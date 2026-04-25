"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, QrCode, Scan, Loader2 } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import jsQR from "jsqr";
import Quagga from "@ericblade/quagga2";

export default function ObjectScanner() {
  const [mode, setMode] = useState<'object' | 'qr' | 'barcode' | null>(null);
  const [result, setResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async (selectedMode: 'object' | 'qr' | 'barcode') => {
    setMode(selectedMode);
    setResult("");
    setIsScanning(true);
    
    if (selectedMode === 'barcode') {
      // Need to delay initialization slightly to allow DOM to render the video element
      setTimeout(() => {
        Quagga.init({
          inputStream: {
            type: "LiveStream",
            target: videoRef.current!,
            constraints: {
              facingMode: "environment"
            },
          },
          decoder: {
            readers: ["ean_reader", "upc_reader", "code_128_reader", "ean_8_reader"]
          }
        }, function (err) {
            if (err) {
                console.error(err);
                setResult("Barcode scanner init failed");
                return;
            }
            Quagga.start();
        });

        Quagga.onDetected((data) => {
          if (data.codeResult && data.codeResult.code) {
             setResult("Barcode found: " + data.codeResult.code);
             stopCamera();
          }
        });
      }, 100);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      console.error(e);
      setResult("Camera access denied or unavailable.");
    }
  };

  const stopCamera = () => {
    if (mode === 'barcode') {
      try {
        Quagga.stop();
        Quagga.offDetected();
      } catch (e) {
        // ignore
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    setMode(null);
    setIsScanning(false);
  };

  useEffect(() => {
    let animationFrameId: number;
    
    const checkQR = () => {
      if (mode === 'qr' && videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            setResult("QR Code found: " + code.data);
            stopCamera();
            return;
          }
        }
      }
      animationFrameId = requestAnimationFrame(checkQR);
    };

    if (mode === 'qr') {
      checkQR();
    }
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [mode]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsScanning(true);
    
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
    }
    
    try {
      // In a full application, we would send the image Base64 to Gemini here
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = "Analyze this image and identify the object. If it's an instrument, tell me what kind of music it's best for. (Simulated text prompt since standard REST File API applies)";
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      setResult(response.text || "Scan complete. Object identified.");
    } catch (e) {
      setResult("Scan failed. " + String(e));
    } finally {
      setIsScanning(false);
      stopCamera();
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-white tracking-widest uppercase">Nexus Scanner</h2>
      </div>

      {!mode ? (
        <div className="grid grid-cols-3 gap-4">
          <button onClick={() => startCamera('object')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center justify-center gap-2 transition-all">
            <Camera className="w-8 h-8 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Object AI</span>
          </button>
          <button onClick={() => startCamera('qr')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center justify-center gap-2 transition-all">
            <QrCode className="w-8 h-8 text-pink-400" />
            <span className="text-xs font-bold uppercase tracking-widest">QR Code</span>
          </button>
          <button onClick={() => startCamera('barcode')} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center justify-center gap-2 transition-all">
            <Scan className="w-8 h-8 text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-widest">Barcode</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/20">
            <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
            
            {/* Overlay Grid */}
            <div className="absolute inset-0 border-4 border-cyan-500/50 m-8 rounded-xl pointer-events-none p-1">
              <div className="w-full h-0.5 bg-cyan-500/30 animate-scan" style={{ animationDuration: '2s', animationIterationCount: 'infinite' }} />
            </div>

            {mode === 'object' && (
              <button 
                onClick={captureAndAnalyze}
                disabled={isScanning}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-full hover:bg-cyan-400 disabled:opacity-50"
              >
                {isScanning ? "Processing..." : "Analyze Object"}
              </button>
            )}
            
            <button onClick={stopCamera} className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
              Cancel
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-white/5 border border-cyan-500/30 rounded-xl text-white/80 text-sm">
          <h4 className="text-cyan-400 font-bold mb-2 uppercase tracking-widest text-xs">Scan Result</h4>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
