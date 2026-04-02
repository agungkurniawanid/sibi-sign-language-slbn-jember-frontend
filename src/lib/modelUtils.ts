import { MODEL_PATH, SEQUENCE_LENGTH, THRESHOLD, ACTIONS } from '@/config/modelConfig';

let ws: WebSocket | null = null;
let isConnected = false;

/**
 * Promise store for pending prediction requests
 */
let pendingPredicts: Array<(value: any) => void> = [];

export async function loadModel(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      console.log(`🔄 Menghubungkan ke API Backend WebSocket...`);
      // Use dynamic hostname so accessing from mobile phone (e.g., 192.168.x.x) works properly
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';
      ws = new WebSocket(`ws://${hostname}:8000/ws/predict`);
      
      ws.onopen = () => {
        console.log('✅ WebSocket Terhubung ke Backend AI!');
        isConnected = true;
        resolve(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const resolveFn = pendingPredicts.shift();
          
          if (!resolveFn) return;
          
          if (data.error) {
            console.error('API Error:', data.error);
            resolveFn({
              predictions: [],
              confidence: 0,
              gesture: 'API Error',
              allProbabilities: [],
            });
            return;
          }
          
          if (data.prediction) {
            const bestIndex = ACTIONS.indexOf(data.prediction);
            
            resolveFn({
              predictions: [bestIndex !== -1 ? bestIndex : 0],
              confidence: data.confidence,
              gesture: data.prediction,
              allProbabilities: data.probabilities || [],
            });
          }
        } catch (err) {
          console.error('Gagal membaca balasan WebSocket:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
        if (!isConnected) resolve(false);
      };

      ws.onclose = () => {
        console.log('❌ WebSocket Terputus dari Backend');
        isConnected = false;
        ws = null;
        resolve(false);
      };
      
    } catch (error) {
      console.error('❌ Gagal Connect WebSocket:', error);
      resolve(false);
    }
  });
}

export async function predictGesture(
  sequence: Float32Array[],
): Promise<{
  predictions: number[];
  confidence: number;
  gesture: string;
  allProbabilities: number[];
}> {
  if (!isConnected || !ws || ws.readyState !== WebSocket.OPEN) {
    return {
      predictions: [],
      confidence: 0,
      gesture: 'Koneksi Terputus',
      allProbabilities: [],
    };
  }

  if (sequence.length < SEQUENCE_LENGTH) {
    return {
      predictions: [],
      confidence: 0,
      gesture: 'Memuat Frame...',
      allProbabilities: [],
    };
  }

  return new Promise((resolve) => {
    pendingPredicts.push(resolve);
    
    // Ubah format float32 dari mediapipe jadi standard numeric array JS -> string json API backend
    const sequenceData = sequence.map(frame => Array.from(frame));
    ws?.send(JSON.stringify({ sequence: sequenceData }));
    
    // Time out pelindung kalau backend mati
    setTimeout(() => {
      const idx = pendingPredicts.indexOf(resolve);
      if (idx !== -1) {
        pendingPredicts.splice(idx, 1);
        resolve({
          predictions: [],
          confidence: 0,
          gesture: 'Timeout API',
          allProbabilities: [],
        });
      }
    }, 1000);
  });
}

/**
 * Check if model is loaded
 */
export function isModelLoaded(): boolean {
  return isConnected && ws !== null && ws.readyState === WebSocket.OPEN;
}

/**
 * Dispose model untuk cleanup
 */
export function disposeModel(): void {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  ws = null;
  isConnected = false;
  pendingPredicts = [];
}
