import React from 'react';
import { QRDataType } from '../types';
import { Globe, Wifi, Contact, Mail, Phone, MessageSquare, FileText, CreditCard } from 'lucide-react';

interface DataTypeSelectorProps {
  currentType: QRDataType;
  onChange: (type: QRDataType) => void;
  lang: 'ua' | 'en';
}

interface TypeOption {
  id: QRDataType;
  labelUa: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TYPE_OPTIONS: TypeOption[] = [
  { id: 'url', labelUa: 'Посилання', labelEn: 'URL', icon: Globe },
  { id: 'wifi', labelUa: 'Wi-Fi', labelEn: 'Wi-Fi', icon: Wifi },
  { id: 'vcard', labelUa: 'Контакт (vCard)', labelEn: 'vCard', icon: Contact },
  { id: 'email', labelUa: 'Email', labelEn: 'Email', icon: Mail },
  { id: 'phone', labelUa: 'Телефон', labelEn: 'Phone', icon: Phone },
  { id: 'sms', labelUa: 'SMS', labelEn: 'SMS', icon: MessageSquare },
  { id: 'text', labelUa: 'Текст', labelEn: 'Text', icon: FileText },
  { id: 'crypto', labelUa: 'Платіж / Mono', labelEn: 'Pay / Crypto', icon: CreditCard },
];

export const DataTypeSelector: React.FC<DataTypeSelectorProps> = ({ currentType, onChange, lang }) => {
  return (
    <div className="bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
        {TYPE_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isActive = currentType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate max-w-full text-[11px] leading-tight">
                {lang === 'ua' ? item.labelUa : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
