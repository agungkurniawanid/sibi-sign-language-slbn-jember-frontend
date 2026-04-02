'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  initializeMediaPipe,
  detectPoseLandmarks,
  extractKeypoints,
  drawLandmarks,
  isHandDetected,
  isPoseDetected,
} from '@/lib/mediapipeUtils';
import { loadModel, predictGesture, isModelLoaded, disposeModel } from '@/lib/modelUtils';
import { ACTIONS, SEQUENCE_LENGTH, STABILITY_FRAMES, THRESHOLD } from '@/config/modelConfig';
import { Play, Square, Eye, EyeOff, RotateCcw } from 'lucide-react';

interface PredictionState {
  gesture: string;
  confidence: number;
  allProbabilities: number[];
  detected: boolean;
}

export default function ModelTestingComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<PredictionState>({
    gesture: 'Waiting...',
    confidence: 0,
    allProbabilities: [],
    detected: false,
  });
  const [sentence, setSentence] = useState<string[]>([]);
  const [stats, setStats] = useState({ frames: 0, fps: 0 });

  // State untuk prediction stabilization
  const sequenceRef = useRef<Float32Array[]>([]);
  const predictionBufferRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const animationIdRef = useRef<number | null>(null);

  // Initialize models saat component mount
  useEffect(() => {
    const initializeModels = async () => {
      try {
        setIsLoading(true);
        setInitError(null);

        const mediapipeReady = await initializeMediaPipe();
        if (!mediapipeReady) {
          throw new Error('Failed to initialize MediaPipe');
        }

        const modelReady = await loadModel();
        if (!modelReady) {
          throw new Error('Failed to load AI model');
        }

        console.log('✅ All systems ready!');
        setIsLoading(false);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Initialization error:', errorMsg);
        setInitError(errorMsg);
        setIsLoading(false);
      }
    };

    initializeModels();

    return () => {
      disposeModel();
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // Setup camera when component is ready
  useEffect(() => {
    const setupCamera = async () => {
      try {
        if (!videoRef.current) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (error) {
        console.error('Camera error:', error);
        setInitError('Cannot access camera. Please check permissions.');
      }
    };

    if (isActive && !initError) {
      setupCamera();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isActive, initError]);

  // Main detection loop
  const detectFrame = useCallback(async () => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      !isActive ||
      !isModelLoaded() ||
      videoRef.current.videoWidth === 0
    ) {
      animationIdRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    try {
      const now = performance.now();
      const deltaTime = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Calculate FPS
      frameCountRef.current++;
      if (deltaTime > 0) {
        setStats((prev) => ({
          frames: frameCountRef.current,
          fps: Math.round(1000 / deltaTime),
        }));
      }

      // Setup canvas
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Detect pose/hand landmarks
      const detectionResult = await detectPoseLandmarks(
        videoRef.current,
        now
      );

      // Draw landmarks if enabled
      if (showLandmarks && detectionResult) {
        drawLandmarks(canvasRef.current, detectionResult, true);
      }

      // Check if hands detected
      const handsDetected = detectionResult ? isHandDetected(detectionResult) : false;

      if (handsDetected && detectionResult) {
        // Extract keypoints
        const keypoints = extractKeypoints(detectionResult);
        sequenceRef.current.push(keypoints);
        sequenceRef.current = sequenceRef.current.slice(-SEQUENCE_LENGTH);

        // Make prediction when we have enough frames
        if (sequenceRef.current.length === SEQUENCE_LENGTH) {
          const result = await predictGesture(sequenceRef.current);
          
          if (result.predictions.length > 0) {
            const gestureIndex = result.predictions[0];
            predictionBufferRef.current.push(gestureIndex);
            predictionBufferRef.current = predictionBufferRef.current.slice(
              -STABILITY_FRAMES
            );

            // Stabilization: check if predictions are consistent
            if (predictionBufferRef.current.length === STABILITY_FRAMES) {
              const allSame = predictionBufferRef.current.every(
                (p) => p === predictionBufferRef.current[0]
              );

              if (allSame && result.confidence > THRESHOLD) {
                // Add to sentence
                const newGesture = ACTIONS[gestureIndex];
                setSentence((prev) => {
                  if (prev.length === 0 || prev[prev.length - 1] !== newGesture) {
                    return [...prev, newGesture].slice(-5);
                  }
                  return prev;
                });
              }
            }

            setPredictions({
              gesture: ACTIONS[gestureIndex],
              confidence: result.confidence,
              allProbabilities: result.allProbabilities,
              detected: true,
            });
          }
        }
      } else {
        // Reset jika tangan tidak terdeteksi
        sequenceRef.current = [];
        predictionBufferRef.current = [];
        setPredictions({
          gesture: 'Menunggu tangan...',
          confidence: 0,
          allProbabilities: [],
          detected: false,
        });
      }
    } catch (error) {
      console.error('Frame processing error:', error);
    }

    animationIdRef.current = requestAnimationFrame(detectFrame);
  }, [isActive, showLandmarks]);

  // Start detection loop when active
  useEffect(() => {
    if (isActive && isModelLoaded()) {
      lastFrameTimeRef.current = performance.now();
      animationIdRef.current = requestAnimationFrame(detectFrame);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isActive, detectFrame]);

  const toggleActive = () => {
    setIsActive(!isActive);
    if (isActive) {
      sequenceRef.current = [];
      predictionBufferRef.current = [];
      setSentence([]);
    }
  };

  const resetSentence = () => {
    setSentence([]);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 bg-gray-100 dark:bg-gray-900 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Initializing models...</p>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800">
        <div className="text-3xl mb-2">❌</div>
        <p className="text-red-600 dark:text-red-400 font-semibold">Initialization Error</p>
        <p className="text-red-500 dark:text-red-500 text-sm mt-2 text-center px-4">{initError}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <h2 className="text-2xl font-bold">🧪 Model Testing - Real-time Detection</h2>
        <p className="text-blue-100 mt-1">Test sign language classification with webcam</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Camera Feed */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: showLandmarks ? 'block' : 'none' }}
          />

          {/* Overlay Info */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
            {/* Top Stats */}
            <div className="text-white text-xs font-mono bg-black/50 px-3 py-1 rounded w-fit">
              FPS: {stats.fps} | Frames: {stats.frames}
            </div>

            {/* Bottom Prediction */}
            <div className="text-white text-sm font-semibold bg-black/50 px-4 py-3 rounded">
              <div className={predictions.detected ? 'text-green-400' : 'text-gray-400'}>
                {predictions.gesture}
              </div>
              <div className="text-xs mt-1">
                Confidence: {(predictions.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={toggleActive}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isActive ? (
              <>
                <Square size={18} /> STOP
              </>
            ) : (
              <>
                <Play size={18} /> START
              </>
            )}
          </button>

          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              showLandmarks
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-400 hover:bg-gray-500 text-white'
            }`}
          >
            {showLandmarks ? (
              <>
                <Eye size={18} /> Hide Skeleton
              </>
            ) : (
              <>
                <EyeOff size={18} /> Show Skeleton
              </>
            )}
          </button>

          <button
            onClick={resetSentence}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition-all"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>

        {/* Prediction Probabilities */}
        {predictions.allProbabilities.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Prediction Probabilities
            </h3>
            {ACTIONS.map((action, idx) => {
              const probability = predictions.allProbabilities[idx] || 0;
              const percentage = (probability * 100).toFixed(1);
              const barWidth = Math.round(probability * 100);

              return (
                <div key={action}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {action}
                    </span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        probability > THRESHOLD
                          ? 'bg-green-500'
                          : probability > 0.5
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detected Sentence */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            📝 Detected Sentence
          </h3>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 min-h-8">
            {sentence.length > 0 ? sentence.join(' • ') : 'Waiting for gestures...'}
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</div>
            <div className={`font-semibold ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
              {isActive ? '🟢 Active' : '🔴 Inactive'}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Skeleton</div>
            <div className={`font-semibold ${showLandmarks ? 'text-blue-600' : 'text-gray-600'}`}>
              {showLandmarks ? '👁️ Visible' : '👁️‍🗨️ Hidden'}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Buffer</div>
            <div className="font-semibold text-purple-600">
              {sequenceRef.current.length}/{SEQUENCE_LENGTH}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
