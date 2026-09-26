import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import jsQR from 'jsqr';
import { QRStyleConfig, ContrastResult, MatrixDensityInfo } from '../types';
import { evaluateContrast, calculateMatrixDensity } from '../utils/contrast';
import {
  Download,
  Copy,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  Maximize2,
  Share2,
  ScanLine,
  Sparkles
} from 'lucide-react';

interface QRPreviewProps {
  payload: string;
  config: QRStyleConfig;
  lang: 'ua' | 'en';
}

export const QRPreview: React.FC<QRPreviewProps> = ({ payload, config, lang }) => {
  const qrContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  const [exportSize, setExportSize] = useState<number>(1024);
  const [copied, setCopied] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<{
    tested: boolean;
    success: boolean;
    decodedText?: string;
  }>({ tested: false, success: false });

  // Contrast & Density
  const effectiveFgColor =
    config.dotsColorType === 'solid'
      ? config.dotsColor
      : config.dotsGradient.colorStops[0]?.color || '#000000';
  
  const contrastInfo: ContrastResult = evaluateContrast(
    effectiveFgColor,
    config.bgColor,
    config.bgTransparent
  );

  const matrixInfo: MatrixDensityInfo = calculateMatrixDensity(
    payload.length,
    config.errorCorrectionLevel,
    300,
    config.margin
  );

  // Initialize and update QRCodeStyling
  useEffect(() => {
    if (!qrCodeInstance.current) {
      qrCodeInstance.current = new QRCodeStyling({
        width: 280,
        height: 280,
        type: 'canvas',
        data: payload,
        margin: config.margin,
        qrOptions: {
          errorCorrectionLevel: config.errorCorrectionLevel
        },
        imageOptions: {
          hideBackgroundDots: config.hideBackgroundDots,
          imageSize: config.logoSize,
          margin: config.logoMargin,
          crossOrigin: 'anonymous'
        }
      });
    }

    const qr = qrCodeInstance.current;

    // Build update options
    const dotsOptions: any = {
      type: config.dotsType
    };

    if (config.dotsColorType === 'gradient') {
      dotsOptions.gradient = {
        type: config.dotsGradient.type,
        rotation: (config.dotsGradient.rotation || 0) * (Math.PI / 180),
        colorStops: config.dotsGradient.colorStops
      };
      delete dotsOptions.color;
    } else {
      dotsOptions.color = config.dotsColor;
      delete dotsOptions.gradient;
    }

    const cornersSquareOptions: any = {
      type: config.cornersSquareType,
      color: config.useCustomCornerColor ? config.cornersSquareColor : effectiveFgColor
    };

    const cornersDotOptions: any = {
      type: config.cornersDotType,
      color: config.useCustomCornerDotColor ? config.cornersDotColor : effectiveFgColor
    };

    const backgroundOptions: any = {
      color: config.bgTransparent ? 'rgba(0,0,0,0)' : config.bgColor
    };

    qr.update({
      data: payload,
      margin: config.margin,
      qrOptions: {
        errorCorrectionLevel: config.errorCorrectionLevel
      },
      image: config.logoUrl || undefined,
      imageOptions: {
        hideBackgroundDots: config.hideBackgroundDots,
        imageSize: config.logoSize,
        margin: config.logoMargin,
        crossOrigin: 'anonymous'
      },
      dotsOptions,
      cornersSquareOptions,
      cornersDotOptions,
      backgroundOptions
    });

    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
      qr.append(qrContainerRef.current);
    }

    // Run automatic decoding check with jsQR
    const timer = setTimeout(() => {
      runDirectScanVerification();
    }, 250);

    return () => clearTimeout(timer);
  }, [payload, config, effectiveFgColor]);

  // Run direct jsQR decoding check on rendered canvas
  const runDirectScanVerification = () => {
    try {
      const canvas = qrContainerRef.current?.querySelector('canvas');
      if (!canvas) {
        setScanStatus({ tested: false, success: false });
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: 'attemptBoth'
      });

      if (code && code.data) {
        setScanStatus({
          tested: true,
          success: true,
          decodedText: code.data
        });
      } else {
        setScanStatus({
          tested: true,
          success: false
        });
      }
    } catch {
      setScanStatus({ tested: false, success: false });
    }
  };

  // Helper to draw framed card onto a high-res canvas for export
  const generateExportCanvas = async (size: number): Promise<HTMLCanvasElement> => {
    // Generate raw QR canvas at target resolution
    const exportQr = new QRCodeStyling({
      width: size,
      height: size,
      type: 'canvas',
      data: payload,
      margin: config.margin * (size / 300),
      qrOptions: {
        errorCorrectionLevel: config.errorCorrectionLevel
      },
      image: config.logoUrl || undefined,
      imageOptions: {
        hideBackgroundDots: config.hideBackgroundDots,
        imageSize: config.logoSize,
        margin: config.logoMargin * (size / 300),
        crossOrigin: 'anonymous'
      },
      dotsOptions: {
        type: config.dotsType,
        color: config.dotsColorType === 'solid' ? config.dotsColor : undefined,
        gradient:
          config.dotsColorType === 'gradient'
            ? {
                type: config.dotsGradient.type,
                rotation: (config.dotsGradient.rotation || 0) * (Math.PI / 180),
                colorStops: config.dotsGradient.colorStops
              }
            : undefined
      },
      cornersSquareOptions: {
        type: config.cornersSquareType,
        color: config.useCustomCornerColor ? config.cornersSquareColor : effectiveFgColor
      },
      cornersDotOptions: {
        type: config.cornersDotType,
        color: config.useCustomCornerDotColor ? config.cornersDotColor : effectiveFgColor
      },
      backgroundOptions: {
        color: config.bgTransparent ? 'rgba(0,0,0,0)' : config.bgColor
      }
    });

    const qrBlob = await exportQr.getRawData('png');
    if (!qrBlob) throw new Error('Failed to render QR');

    const qrImg = new Image();
    const qrImgUrl = URL.createObjectURL(qrBlob as Blob);
    await new Promise((resolve, reject) => {
      qrImg.onload = resolve;
      qrImg.onerror = reject;
      qrImg.src = qrImgUrl;
    });

    // If frame is NOT enabled, return standard QR canvas
    if (!config.frame.enabled) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(qrImg, 0, 0, size, size);
      URL.revokeObjectURL(qrImgUrl);
      return canvas;
    }

    // Frame IS enabled: Draw poster / info stand layout
    const cardCanvas = document.createElement('canvas');
    const padding = Math.round(size * 0.1);
    const cardWidth = size + padding * 2;
    const headerHeight = Math.round(size * 0.32);
    const footerHeight = Math.round(size * 0.28);
    const cardHeight = headerHeight + size + footerHeight;

    cardCanvas.width = cardWidth;
    cardCanvas.height = cardHeight;
    const ctx = cardCanvas.getContext('2d')!;

    // Background
    ctx.fillStyle = config.frame.bgColor;
    ctx.roundRect(0, 0, cardWidth, cardHeight, Math.round(cardWidth * 0.04));
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = config.frame.accentColor + '40';
    ctx.lineWidth = Math.round(cardWidth * 0.005);
    ctx.stroke();

    // Header Title
    ctx.fillStyle = config.frame.textColor;
    ctx.font = `bold ${Math.round(cardWidth * 0.055)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(config.frame.title || 'СКАНУЙТЕ ТУТ', cardWidth / 2, headerHeight * 0.42);

    // Call to action pill
    if (config.frame.callToAction) {
      const pillY = headerHeight * 0.78;
      const pillHeight = Math.round(cardWidth * 0.06);
      const pillWidth = Math.round(cardWidth * 0.6);
      ctx.fillStyle = config.frame.accentColor;
      ctx.beginPath();
      ctx.roundRect(cardWidth / 2 - pillWidth / 2, pillY - pillHeight / 2, pillWidth, pillHeight, 999);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(cardWidth * 0.028)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillText(config.frame.callToAction, cardWidth / 2, pillY);
    }

    // Draw QR Code in center
    ctx.drawImage(qrImg, padding, headerHeight, size, size);

    // Subtitle / instructions at bottom
    ctx.fillStyle = config.frame.textColor + 'b3';
    ctx.font = `500 ${Math.round(cardWidth * 0.032)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText(
      config.frame.subtitle || 'Наведіть камеру вашого смартфона',
      cardWidth / 2,
      headerHeight + size + footerHeight * 0.45
    );

    URL.revokeObjectURL(qrImgUrl);
    return cardCanvas;
  };

  // Download handlers
  const handleDownload = async (ext: 'png' | 'svg' | 'webp' | 'jpeg') => {
    if (ext === 'svg' && !config.frame.enabled && qrCodeInstance.current) {
      // Direct vector SVG download for bare QR
      await qrCodeInstance.current.download({
        name: `qr-art-${Date.now()}`,
        extension: 'svg'
      });
      return;
    }

    const canvas = await generateExportCanvas(exportSize);
    const link = document.createElement('a');
    link.download = `qr-art-${Date.now()}.${ext}`;
    link.href = canvas.toDataURL(ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png', 0.95);
    link.click();
  };

  // Copy to clipboard
  const handleCopyToClipboard = async () => {
    try {
      const canvas = await generateExportCanvas(exportSize);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Fallback
          alert(lang === 'ua' ? 'Будь ласка, збережіть через кнопку завантаження' : 'Please use download button');
        }
      });
    } catch {
      alert(lang === 'ua' ? 'Не вдалося скопіювати' : 'Copy failed');
    }
  };

  // Print sheet
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* PREVIEW CONTAINER */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Framed card or raw QR code */}
        <div
          ref={cardRef}
          id="printable-card"
          className={`relative transition-all duration-300 flex flex-col items-center justify-center ${
            config.frame.enabled
              ? 'p-6 rounded-2xl shadow-2xl max-w-sm w-full border'
              : 'p-3 rounded-2xl'
          }`}
          style={{
            backgroundColor: config.frame.enabled ? config.frame.bgColor : 'transparent',
            borderColor: config.frame.enabled ? config.frame.accentColor + '40' : 'transparent',
            color: config.frame.enabled ? config.frame.textColor : 'inherit'
          }}
        >
          {/* Card Header if frame enabled */}
          {config.frame.enabled && (
            <div className="w-full text-center mb-4 space-y-2">
              <h3 className="text-base font-bold tracking-tight">
                {config.frame.title || (lang === 'ua' ? 'СКАНУЙТЕ ДЛЯ ДІЇ' : 'SCAN FOR ACTION')}
              </h3>
              {config.frame.callToAction && (
                <div
                  className="inline-block px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: config.frame.accentColor }}
                >
                  {config.frame.callToAction}
                </div>
              )}
            </div>
          )}

          {/* QR Canvas Box */}
          <div
            className="p-2.5 rounded-xl shadow-inner flex items-center justify-center relative"
            style={{
              backgroundColor: config.bgTransparent ? 'transparent' : config.bgColor
            }}
          >
            <div ref={qrContainerRef} className="flex items-center justify-center max-w-[280px] max-h-[280px]" />
          </div>

          {/* Card Footer if frame enabled */}
          {config.frame.enabled && (
            <div className="w-full text-center mt-4">
              <p className="text-xs opacity-75">
                {config.frame.subtitle ||
                  (lang === 'ua'
                    ? 'Наведіть камеру смартфона'
                    : 'Point your phone camera to scan')}
              </p>
            </div>
          )}
        </div>

        {/* Scanner Verification pill indicator */}
        <div className="mt-4 flex items-center gap-2">
          {scanStatus.tested ? (
            scanStatus.success ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ua'
                    ? '✓ Оптично перевірено: 100% читабельність'
                    : '✓ Optically verified: 100% readable'}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ua'
                    ? '⚠ Складний код: перевірте контраст або розмір лого'
                    : '⚠ Dense code: check contrast or logo scale'}
                </span>
              </div>
            )
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-slate-400 bg-slate-800/40">
              <ScanLine className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
              <span>{lang === 'ua' ? 'Аналіз розпізнавання...' : 'Analyzing scanability...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* METRICS & AUDIT PANEL (Contrast & Matrix Density) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Contrast WCAG Card */}
        <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'ua' ? 'Контрастність (WCAG 2.1)' : 'Contrast Ratio (WCAG)'}
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                contrastInfo.level === 'excellent'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : contrastInfo.level === 'good'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : contrastInfo.level === 'warning'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {contrastInfo.ratio}:1
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {lang === 'ua' ? contrastInfo.messageUa : contrastInfo.messageEn}
          </p>
        </div>

        {/* Matrix Density & Version Card */}
        <div className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'ua' ? 'Щільність модулів' : 'Matrix Density'}
            </span>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              V{matrixInfo.version} ({matrixInfo.moduleCount}×{matrixInfo.moduleCount})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {lang === 'ua' ? matrixInfo.statusUa : matrixInfo.statusEn}
          </p>
        </div>
      </div>

      {/* EXPORT CONTROLS */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            {lang === 'ua' ? 'Роздільна здатність експорту' : 'Export Resolution'}
          </label>
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
            {[
              { size: 512, label: '512px' },
              { size: 1024, label: '1024px' },
              { size: 2048, label: '2K HD' },
              { size: 4096, label: '4K Друк' }
            ].map((res) => (
              <button
                key={res.size}
                onClick={() => setExportSize(res.size)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  exportSize === res.size
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
        </div>

        {/* Download Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            onClick={() => handleDownload('png')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-sm shadow-indigo-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>

          <button
            onClick={() => handleDownload('svg')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SVG (Вектор)</span>
          </button>

          <button
            onClick={() => handleDownload('webp')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>WebP</span>
          </button>

          <button
            onClick={() => handleDownload('jpeg')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JPEG</span>
          </button>
        </div>

        {/* Secondary Actions: Copy and Print */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">
                  {lang === 'ua' ? 'Скопійовано в буфер!' : 'Copied to clipboard!'}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ua' ? 'Скопіювати зображення' : 'Copy image'}
                </span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
            title={lang === 'ua' ? 'Надрукувати на принтері' : 'Print sheet'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === 'ua' ? 'Друк' : 'Print'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
