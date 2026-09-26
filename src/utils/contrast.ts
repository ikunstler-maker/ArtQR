import { ContrastResult, MatrixDensityInfo, ErrorCorrectionLevel } from '../types';

/**
 * Converts a hex color (#RRGGBB or #RGB) to normalized sRGB [0..1]
 */
export function hexToRgb(hex: string): [number, number, number] {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length < 6) {
    return [0, 0, 0];
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
  return [r, g, b];
}

/**
 * Calculates WCAG 2.1 relative luminance
 */
export function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(c => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Evaluates contrast ratio and optical scanability
 */
export function evaluateContrast(fgHex: string, bgHex: string, isTransparent = false): ContrastResult {
  if (isTransparent) {
    return {
      ratio: 4.5,
      level: 'good',
      foregroundLuminance: 0.2,
      backgroundLuminance: 0.9,
      messageUa: 'Прозорий фон: контраст залежатиме від поверхні нанесення.',
      messageEn: 'Transparent background: contrast depends on placement surface.'
    };
  }

  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);

  const l1 = getRelativeLuminance(fgRgb);
  const l2 = getRelativeLuminance(bgRgb);

  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (brighter + 0.05) / (darker + 0.05);
  const roundedRatio = Math.round(ratio * 10) / 10;

  if (ratio >= 7.0) {
    return {
      ratio: roundedRatio,
      level: 'excellent',
      foregroundLuminance: l1,
      backgroundLuminance: l2,
      messageUa: `Чудовий контраст (${roundedRatio}:1). Зчитується миттєво за будь-якого освітлення.`,
      messageEn: `Excellent contrast (${roundedRatio}:1). Scannable under all lighting.`
    };
  } else if (ratio >= 4.5) {
    return {
      ratio: roundedRatio,
      level: 'good',
      foregroundLuminance: l1,
      backgroundLuminance: l2,
      messageUa: `Хороший контраст (${roundedRatio}:1, WCAG AA). Надійне розпізнавання.`,
      messageEn: `Good contrast (${roundedRatio}:1, WCAG AA). Reliable detection.`
    };
  } else if (ratio >= 3.0) {
    return {
      ratio: roundedRatio,
      level: 'warning',
      foregroundLuminance: l1,
      backgroundLuminance: l2,
      messageUa: `Помірний контраст (${roundedRatio}:1). Камери в напівтемряві можуть фокусуватися повільніше.`,
      messageEn: `Moderate contrast (${roundedRatio}:1). Low-light cameras might lag.`
    };
  } else {
    return {
      ratio: roundedRatio,
      level: 'critical',
      foregroundLuminance: l1,
      backgroundLuminance: l2,
      messageUa: `Критично низький контраст (${roundedRatio}:1). Сканери можуть не розпізнати код!`,
      messageEn: `Critical low contrast (${roundedRatio}:1). Scanners will struggle to read!`
    };
  }
}

/**
 * Estimates QR code matrix size and density in pixels per module
 * Formula: Modules = 21 + (Version - 1) * 4
 */
export function calculateMatrixDensity(
  dataLength: number,
  ecl: ErrorCorrectionLevel,
  canvasSize: number = 320,
  margin: number = 10
): MatrixDensityInfo {
  // Approximate version requirement based on byte capacity per ECL
  // Version 1: 17(L), 14(M), 11(Q), 7(H)
  // Version 2: 32(L), 26(M), 20(Q), 14(H)
  // Version 3: 53(L), 42(M), 32(Q), 24(H)
  // Version 4: 78(L), 62(M), 46(Q), 34(H)
  // Version 5: 106(L), 84(M), 60(Q), 44(H)
  // Version 6: 134(L), 106(M), 74(Q), 58(H)
  const capacityFactors: Record<ErrorCorrectionLevel, number> = {
    L: 1.0,
    M: 0.8,
    Q: 0.65,
    H: 0.5
  };

  const factor = capacityFactors[ecl] || 0.6;
  let estimatedVersion = 1;

  if (dataLength <= 14 * factor) estimatedVersion = 1;
  else if (dataLength <= 26 * factor) estimatedVersion = 2;
  else if (dataLength <= 42 * factor) estimatedVersion = 3;
  else if (dataLength <= 62 * factor) estimatedVersion = 4;
  else if (dataLength <= 84 * factor) estimatedVersion = 5;
  else if (dataLength <= 106 * factor) estimatedVersion = 6;
  else if (dataLength <= 150 * factor) estimatedVersion = 8;
  else if (dataLength <= 250 * factor) estimatedVersion = 12;
  else estimatedVersion = Math.min(40, Math.ceil(dataLength / 18));

  const moduleCount = 21 + (estimatedVersion - 1) * 4;
  const activeQrArea = Math.max(100, canvasSize - margin * 2);
  const pxPerModule = Math.round((activeQrArea / moduleCount) * 10) / 10;

  const isOptimal = pxPerModule >= 4.0;

  return {
    version: estimatedVersion,
    moduleCount,
    pxPerModule,
    isOptimal,
    statusUa: isOptimal
      ? `${pxPerModule} px/модуль (потрібно ≥ 4px) — висока чіткість`
      : `${pxPerModule} px/модуль — щільна матриця, збільшіть роздільність для друку`,
    statusEn: isOptimal
      ? `${pxPerModule} px/module (≥4px required) — high crispness`
      : `${pxPerModule} px/module — dense matrix, increase resolution for print`
  };
}
