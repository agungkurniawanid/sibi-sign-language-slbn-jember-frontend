import { KEYPOINTS_CONFIG } from '@/config/modelConfig';
import type { Results } from '@mediapipe/holistic';
import * as mpHolistic from '@mediapipe/holistic';
import * as mpDrawingUtils from '@mediapipe/drawing_utils';

const { drawConnectors, drawLandmarks: mpDrawLandmarks } = mpDrawingUtils as any;

const { Holistic, POSE_CONNECTIONS, HAND_CONNECTIONS } = mpHolistic as any;

let holistic: InstanceType<typeof mpHolistic.Holistic> | null = null;

// Store promise resolve function for the onResults callback
let resolveDetection: ((results: Results) => void) | null = null;

/**
 * Initialize MediaPipe Holistic (Legacy API that perfectly matches Python mp.solutions.holistic)
 */
export async function initializeMediaPipe(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    holistic = new Holistic({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
      }
    });

    // Identik dengan config Python (TestingRealtimeModel.py / CollectionDataset.py)
    holistic?.setOptions({
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      refineFaceLandmarks: false,
      enableSegmentation: false,
      modelComplexity: 1
    });

    holistic?.onResults((results) => {
      if (resolveDetection) {
        resolveDetection(results);
        resolveDetection = null;
      }
    });

    // Load Wasm and models
    if (holistic) {
      await holistic.initialize();
    }

    console.log('✅ MediaPipe Holistic initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize MediaPipe Holistic:', error);
    return false;
  }
}

/**
 * Detect pose and hand landmarks from video frame using Holistic
 */
export async function detectPoseLandmarks(
  video: HTMLVideoElement | HTMLCanvasElement,
  timestamp: number
): Promise<Results | null> {
  if (!holistic) return null;

  try {
    return new Promise((resolve) => {
      resolveDetection = resolve;
      // Holistic.send expects an HTMLVideoElement, HTMLImageElement, or HTMLCanvasElement
      holistic!.send({ image: video });
      
      // Safety timeout if Holistic fails to respond
      setTimeout(() => {
        if (resolveDetection === resolve) {
          resolveDetection = null;
          resolve(null);
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Error detecting landmarks:', error);
    return null;
  }
}

/**
 * Extract keypoints exactly matching Python:
 * pose(132) + left_hand(63) + right_hand(63) = 258 features total
 */
export function extractKeypoints(detectionResult: Results): Float32Array {
  const keypoints = new Float32Array(KEYPOINTS_CONFIG.TOTAL_FEATURES);
  let featureIndex = 0;

  try {
    // 1. Pose (33 * 4 = 132)
    if (detectionResult.poseLandmarks) {
      for (let i = 0; i < KEYPOINTS_CONFIG.POSE_KEYPOINTS; i++) {
        const lm = detectionResult.poseLandmarks[i];
        keypoints[featureIndex++] = lm.x ?? 0;
        keypoints[featureIndex++] = lm.y ?? 0;
        keypoints[featureIndex++] = lm.z ?? 0;
        keypoints[featureIndex++] = lm.visibility ?? 0;
      }
    } else {
      featureIndex += KEYPOINTS_CONFIG.POSE_KEYPOINTS * KEYPOINTS_CONFIG.POSE_DIMENSIONS;
    }

    // 2. Left Hand (21 * 3 = 63)
    if (detectionResult.leftHandLandmarks) {
      for (let i = 0; i < KEYPOINTS_CONFIG.LEFT_HAND_KEYPOINTS; i++) {
        const lm = detectionResult.leftHandLandmarks[i];
        keypoints[featureIndex++] = lm.x ?? 0;
        keypoints[featureIndex++] = lm.y ?? 0;
        keypoints[featureIndex++] = lm.z ?? 0;
      }
    } else {
      featureIndex += KEYPOINTS_CONFIG.LEFT_HAND_KEYPOINTS * KEYPOINTS_CONFIG.HAND_DIMENSIONS;
    }

    // 3. Right Hand (21 * 3 = 63)
    if (detectionResult.rightHandLandmarks) {
      for (let i = 0; i < KEYPOINTS_CONFIG.RIGHT_HAND_KEYPOINTS; i++) {
        const lm = detectionResult.rightHandLandmarks[i];
        keypoints[featureIndex++] = lm.x ?? 0;
        keypoints[featureIndex++] = lm.y ?? 0;
        keypoints[featureIndex++] = lm.z ?? 0;
      }
    } else {
      featureIndex += KEYPOINTS_CONFIG.RIGHT_HAND_KEYPOINTS * KEYPOINTS_CONFIG.HAND_DIMENSIONS;
    }

    return keypoints;
  } catch (error) {
    console.error('Error extracting keypoints:', error);
    return keypoints;
  }
}

/**
 * Draw landmarks on canvas
 */
export function drawLandmarks(
  canvas: HTMLCanvasElement,
  detectionResult: Results,
  showLandmarks: boolean
) {
  if (!showLandmarks) return;

  try {
    const canvasCtx = canvas?.getContext('2d');
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pose landmarks
    if (detectionResult.poseLandmarks) {
      drawConnectors(canvasCtx, detectionResult.poseLandmarks, POSE_CONNECTIONS, { color: 'rgb(80,44,121)', lineWidth: 1 });
      mpDrawLandmarks(canvasCtx, detectionResult.poseLandmarks, { color: 'rgb(80,22,10)', radius: 1 });
    }

    // Draw left hand
    if (detectionResult.leftHandLandmarks) {
      drawConnectors(canvasCtx, detectionResult.leftHandLandmarks, HAND_CONNECTIONS, { color: 'rgb(121,44,250)', lineWidth: 2 });
      mpDrawLandmarks(canvasCtx, detectionResult.leftHandLandmarks, { color: 'rgb(121,22,76)', radius: 4 });
    }

    // Draw right hand
    if (detectionResult.rightHandLandmarks) {
      drawConnectors(canvasCtx, detectionResult.rightHandLandmarks, HAND_CONNECTIONS, { color: 'rgb(245,66,230)', lineWidth: 2 });
      mpDrawLandmarks(canvasCtx, detectionResult.rightHandLandmarks, { color: 'rgb(245,117,66)', radius: 4 });
    }

    canvasCtx.restore();
  } catch (error) {
    console.error('Error drawing landmarks:', error);
  }
}

/**
 * Check if hands are detected
 */
export function isHandDetected(detectionResult: Results): boolean {
  if (!detectionResult) return false;
  return !!detectionResult.leftHandLandmarks || !!detectionResult.rightHandLandmarks;
}

/**
 * Get pose visibility (bahu terdeteksi)
 */
export function isPoseDetected(detectionResult: Results): boolean {
  if (!detectionResult) return false;
  return !!detectionResult.poseLandmarks;
}

