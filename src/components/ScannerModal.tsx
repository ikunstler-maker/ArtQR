import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { X, Camera, ScanLine, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedPayload: string;
  lang: 'ua' | 'en';
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  expectedPayload,
  lang
}) => {
  const [useCamera, setUseCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraResult, setCameraResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera stream cleanly
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setUseCamera(false);
      setCameraResult(null);
      setCameraError(null);
    }
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    setCameraResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        requestScanFrame();
      }
    } catch (err: any) {
      setCameraError(
        lang === 'ua'
          ? 'Не вдалося отримати доступ до камери. Перевірте дозволи браузера.'
          : 'Unable to access camera. Check browser permissions.'
      );
      setIsScanning(false);
    }
  };

  const requestScanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      });

      if (code && code.data) {
        setCameraResult(code.data);
        stopCamera();
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(requestScanFrame);
  };

  if (!isOpen) return null;

  const isMatch = cameraResult === expectedPayload;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {lang === 'ua' ? 'Тестування зчитування QR-коду' : 'QR Scan Verification'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">
              {lang === 'ua' ? 'Очікуваний вміст у коді:' : 'Expected QR Payload:'}
            </span>
            <div className="font-mono text-xs text-indigo-300 break-all bg-slate-900/60 p-2 rounded border border-slate-800/80 max-h-24 overflow-y-auto">
              {expectedPayload}
            </div>
          </div>

          {/* Camera Scanner View */}
          {!useCamera ? (
            <div className="text-center py-6 px-4 space-y-3 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              <Camera className="w-10 h-10 text-indigo-400 mx-auto" />
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  {lang === 'ua' ? 'Перевірте код через веб-камеру' : 'Test code via your webcam/phone'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  {lang === 'ua'
                    ? 'Увімкніть камеру, щоб перевірити читабельність коду на телефоні або роздруківці.'
                    : 'Turn on camera to verify scan speed and readability under actual camera conditions.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setUseCamera(true);
                  startCamera();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>{lang === 'ua' ? 'Увімкнути камеру' : 'Start Camera'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                <video ref={videoRef} playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scan Overlay target guide */}
                {isScanning && (
                  <div className="absolute inset-0 border-2 border-indigo-500/40 m-8 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-full h-0.5 bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-pulse"></div>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {cameraResult && (
                <div
                  className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                    isMatch
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isMatch
                        ? (lang === 'ua' ? 'Код успішно розпізнано! Дані повністю збігаються.' : 'Code scanned! Data matches exactly.')
                        : (lang === 'ua' ? 'Код розпізнано, але вміст відрізняється' : 'Scanned, but content differs')}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] bg-black/30 p-1.5 rounded break-all">
                    {cameraResult}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    startCamera();
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{lang === 'ua' ? 'Повторити' : 'Rescan'}</span>
                </button>
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  {lang === 'ua' ? 'Зупинити' : 'Stop'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            {lang === 'ua' ? 'Закрити' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
