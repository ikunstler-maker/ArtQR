import { QRStyleConfig } from '../types';

export interface StylePreset {
  id: string;
  nameUa: string;
  nameEn: string;
  descriptionUa: string;
  descriptionEn: string;
  previewBg: string;
  previewFg: string;
  config: Partial<QRStyleConfig>;
}

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'kyiv-gold',
    nameUa: 'Київський Золотий',
    nameEn: 'Kyiv Golden',
    descriptionUa: 'Глибокий нічний сапфір із теплим золотим градієнтом',
    descriptionEn: 'Deep night sapphire with warm gold gradient',
    previewBg: '#090d16',
    previewFg: '#eab308',
    config: {
      dotsType: 'extra-rounded',
      dotsColorType: 'gradient',
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#f59e0b' },
          { offset: 1, color: '#fde047' }
        ]
      },
      bgColor: '#090d16',
      bgTransparent: false,
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#f59e0b',
      useCustomCornerColor: true,
      cornersDotType: 'dot',
      cornersDotColor: '#fde047',
      useCustomCornerDotColor: true,
      errorCorrectionLevel: 'H',
      margin: 14
    }
  },
  {
    id: 'slate-minimal',
    nameUa: 'Мінімалістичний Сланець',
    nameEn: 'Slate Minimal',
    descriptionUa: 'Чистий преміальний дизайн для друку та бізнесу',
    descriptionEn: 'Crisp premium layout for print and business',
    previewBg: '#ffffff',
    previewFg: '#0f172a',
    config: {
      dotsType: 'rounded',
      dotsColorType: 'solid',
      dotsColor: '#0f172a',
      bgColor: '#ffffff',
      bgTransparent: false,
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#0f172a',
      useCustomCornerColor: false,
      cornersDotType: 'dot',
      cornersDotColor: '#0f172a',
      useCustomCornerDotColor: false,
      errorCorrectionLevel: 'Q',
      margin: 12
    }
  },
  {
    id: 'emerald-mint',
    nameUa: 'Смарагдовий Нео',
    nameEn: 'Emerald Forest',
    descriptionUa: 'Органічний смарагдово-м’ятний стиль із високим контрастом',
    descriptionEn: 'Organic emerald-mint palette with strong readability',
    previewBg: '#041d16',
    previewFg: '#10b981',
    config: {
      dotsType: 'classy',
      dotsColorType: 'gradient',
      dotsGradient: {
        type: 'linear',
        rotation: 30,
        colorStops: [
          { offset: 0, color: '#10b981' },
          { offset: 1, color: '#34d399' }
        ]
      },
      bgColor: '#041d16',
      bgTransparent: false,
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#34d399',
      useCustomCornerColor: true,
      cornersDotType: 'dot',
      cornersDotColor: '#10b981',
      useCustomCornerDotColor: true,
      errorCorrectionLevel: 'H',
      margin: 12
    }
  },
  {
    id: 'cyber-neon',
    nameUa: 'Кібер Неон',
    nameEn: 'Cyber Neon',
    descriptionUa: 'Голографічний неоновий градієнт на чорному тлі',
    descriptionEn: 'Holographic cyan-indigo gradient on deep black',
    previewBg: '#09090b',
    previewFg: '#06b6d4',
    config: {
      dotsType: 'classy-rounded',
      dotsColorType: 'gradient',
      dotsGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#06b6d4' },
          { offset: 1, color: '#818cf8' }
        ]
      },
      bgColor: '#09090b',
      bgTransparent: false,
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#06b6d4',
      useCustomCornerColor: true,
      cornersDotType: 'dot',
      cornersDotColor: '#818cf8',
      useCustomCornerDotColor: true,
      errorCorrectionLevel: 'H',
      margin: 14
    }
  },
  {
    id: 'sunset-coral',
    nameUa: 'Захід Сонця',
    nameEn: 'Sunset Coral',
    descriptionUa: 'Теплі відтінки стиглого манго та коралового заходу',
    descriptionEn: 'Warm tones of ripe mango and coral dusk',
    previewBg: '#190e1a',
    previewFg: '#f43f5e',
    config: {
      dotsType: 'dots',
      dotsColorType: 'gradient',
      dotsGradient: {
        type: 'linear',
        rotation: 60,
        colorStops: [
          { offset: 0, color: '#f43f5e' },
          { offset: 1, color: '#fb923c' }
        ]
      },
      bgColor: '#190e1a',
      bgTransparent: false,
      cornersSquareType: 'dot',
      cornersSquareColor: '#f43f5e',
      useCustomCornerColor: true,
      cornersDotType: 'dot',
      cornersDotColor: '#fb923c',
      useCustomCornerDotColor: true,
      errorCorrectionLevel: 'H',
      margin: 14
    }
  },
  {
    id: 'espresso-craft',
    nameUa: 'Кавовий Крафт',
    nameEn: 'Warm Espresso',
    descriptionUa: 'Затишний крафтовий відтінок для кав’ярень та ресторанів',
    descriptionEn: 'Warm artisanal vibe designed for cafés & restaurants',
    previewBg: '#fefbf6',
    previewFg: '#451a03',
    config: {
      dotsType: 'rounded',
      dotsColorType: 'solid',
      dotsColor: '#451a03',
      bgColor: '#fefbf6',
      bgTransparent: false,
      cornersSquareType: 'extra-rounded',
      cornersSquareColor: '#78350f',
      useCustomCornerColor: true,
      cornersDotType: 'dot',
      cornersDotColor: '#451a03',
      useCustomCornerDotColor: true,
      errorCorrectionLevel: 'H',
      margin: 12
    }
  }
];

export const DEFAULT_STYLE_CONFIG: QRStyleConfig = {
  dotsType: 'rounded',
  dotsColorType: 'solid',
  dotsColor: '#0f172a',
  dotsGradient: {
    type: 'linear',
    rotation: 45,
    colorStops: [
      { offset: 0, color: '#3b82f6' },
      { offset: 1, color: '#8b5cf6' }
    ]
  },
  cornersSquareType: 'extra-rounded',
  cornersSquareColor: '#0f172a',
  useCustomCornerColor: false,
  cornersDotType: 'dot',
  cornersDotColor: '#0f172a',
  useCustomCornerDotColor: false,
  bgColor: '#ffffff',
  bgTransparent: false,
  errorCorrectionLevel: 'H',
  margin: 12,
  logoUrl: null,
  logoSize: 0.28,
  logoMargin: 4,
  hideBackgroundDots: true,
  frame: {
    enabled: false,
    type: 'simple-card',
    title: 'ВІДКАСУЙТЕ ТУТ',
    subtitle: 'Наведіть камеру смартфона для перегляду',
    callToAction: 'СКАНУЙТЕ МЕНЕ',
    bgColor: '#ffffff',
    textColor: '#0f172a',
    accentColor: '#3b82f6',
    showIcon: true
  }
};
