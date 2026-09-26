export type DotType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRDataType = 'url' | 'wifi' | 'vcard' | 'email' | 'phone' | 'sms' | 'text' | 'crypto';

export interface ColorGradient {
  type: 'linear' | 'radial';
  rotation?: number; // degrees
  colorStops: { offset: number; color: string }[];
}

export type FrameType = 'none' | 'simple-card' | 'poster' | 'badge-top' | 'minimal-border';

export interface CardFrameConfig {
  enabled: boolean;
  type: FrameType;
  title: string;
  subtitle: string;
  callToAction: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  showIcon: boolean;
}

export interface QRStyleConfig {
  dotsType: DotType;
  dotsColorType: 'solid' | 'gradient';
  dotsColor: string;
  dotsGradient: ColorGradient;
  
  cornersSquareType: CornerSquareType;
  cornersSquareColor: string;
  useCustomCornerColor: boolean;

  cornersDotType: CornerDotType;
  cornersDotColor: string;
  useCustomCornerDotColor: boolean;

  bgColor: string;
  bgTransparent: boolean;

  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;

  logoUrl: string | null;
  logoSize: number; // 0.1 to 0.45
  logoMargin: number; // 0 to 20
  hideBackgroundDots: boolean;

  frame: CardFrameConfig;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  note: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface CryptoData {
  currency: 'ethereum' | 'bitcoin' | 'monobank' | 'usdt';
  address: string;
  amount?: string;
  label?: string;
}

export interface QRDataState {
  type: QRDataType;
  url: string;
  wifi: WifiData;
  vcard: VCardData;
  email: EmailData;
  phone: string;
  sms: SmsData;
  text: string;
  crypto: CryptoData;
}

export interface SavedTemplate {
  id: string;
  name: string;
  createdAt: number;
  config: QRStyleConfig;
  dataType?: QRDataType;
}

export interface ContrastResult {
  ratio: number;
  level: 'excellent' | 'good' | 'warning' | 'critical';
  foregroundLuminance: number;
  backgroundLuminance: number;
  messageUa: string;
  messageEn: string;
}

export interface MatrixDensityInfo {
  version: number;
  moduleCount: number;
  pxPerModule: number;
  isOptimal: boolean;
  statusUa: string;
  statusEn: string;
}
