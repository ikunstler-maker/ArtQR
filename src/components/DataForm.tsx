import React from 'react';
import { QRDataState, QRDataType } from '../types';
import { ShieldCheck, Eye, EyeOff, Sparkles, Building, User, Phone, Mail, Globe } from 'lucide-react';

interface DataFormProps {
  data: QRDataState;
  onChange: (data: QRDataState) => void;
  lang: 'ua' | 'en';
}

export const DataForm: React.FC<DataFormProps> = ({ data, onChange, lang }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const updateField = <K extends keyof QRDataState>(key: K, value: QRDataState[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateWifi = (key: keyof QRDataState['wifi'], value: any) => {
    onChange({
      ...data,
      wifi: { ...data.wifi, [key]: value }
    });
  };

  const updateVCard = (key: keyof QRDataState['vcard'], value: string) => {
    onChange({
      ...data,
      vcard: { ...data.vcard, [key]: value }
    });
  };

  const updateEmail = (key: keyof QRDataState['email'], value: string) => {
    onChange({
      ...data,
      email: { ...data.email, [key]: value }
    });
  };

  const updateSms = (key: keyof QRDataState['sms'], value: string) => {
    onChange({
      ...data,
      sms: { ...data.sms, [key]: value }
    });
  };

  const updateCrypto = (key: keyof QRDataState['crypto'], value: any) => {
    onChange({
      ...data,
      crypto: { ...data.crypto, [key]: value }
    });
  };

  return (
    <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800 space-y-3">
      {/* URL Type */}
      {data.type === 'url' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            {lang === 'ua' ? 'Веб-посилання (URL)' : 'Web URL'}
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={data.url}
              onChange={(e) => updateField('url', e.target.value)}
              placeholder="https://mriya.ua або ваш сайт"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500 mr-1 self-center">
              {lang === 'ua' ? 'Швидко:' : 'Quick:'}
            </span>
            {['https://mriya.ua', 'https://instagram.com/mybrand', 'https://t.me/mychannel'].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => updateField('url', example)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {example.replace('https://', '')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wi-Fi Type */}
      {data.type === 'wifi' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? 'Назва мережі (SSID)' : 'Network SSID'}
              </label>
              <input
                type="text"
                value={data.wifi.ssid}
                onChange={(e) => updateWifi('ssid', e.target.value)}
                placeholder="Office_Guest_5G"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? 'Пароль' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.wifi.password}
                  onChange={(e) => updateWifi('password', e.target.value)}
                  placeholder="Введіть ключ мережі"
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg pl-3 pr-9 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {lang === 'ua' ? 'Шифрування:' : 'Encryption:'}
              </span>
              {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                <label key={enc} className="inline-flex items-center gap-1 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="wifi-encryption"
                    checked={data.wifi.encryption === enc}
                    onChange={() => updateWifi('encryption', enc)}
                    className="accent-indigo-500"
                  />
                  <span>{enc === 'nopass' ? (lang === 'ua' ? 'Без пароля' : 'Open') : enc}</span>
                </label>
              ))}
            </div>

            <label className="inline-flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={data.wifi.hidden}
                onChange={(e) => updateWifi('hidden', e.target.checked)}
                className="rounded accent-indigo-500"
              />
              <span>{lang === 'ua' ? 'Прихована мережа' : 'Hidden SSID'}</span>
            </label>
          </div>
        </div>
      )}

      {/* vCard Type */}
      {data.type === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? "Ім'я" : 'First Name'}
              </label>
              <input
                type="text"
                value={data.vcard.firstName}
                onChange={(e) => updateVCard('firstName', e.target.value)}
                placeholder="Олександр"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? 'Прізвище' : 'Last Name'}
              </label>
              <input
                type="text"
                value={data.vcard.lastName}
                onChange={(e) => updateVCard('lastName', e.target.value)}
                placeholder="Коваленко"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? 'Мобільний телефон' : 'Phone'}
              </label>
              <input
                type="tel"
                value={data.vcard.phone}
                onChange={(e) => updateVCard('phone', e.target.value)}
                placeholder="+380 50 123 4567"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={data.vcard.email}
                onChange={(e) => updateVCard('email', e.target.value)}
                placeholder="oleksandr@company.ua"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? 'Компанія / Бренд' : 'Company'}
              </label>
              <input
                type="text"
                value={data.vcard.company}
                onChange={(e) => updateVCard('company', e.target.value)}
                placeholder="Art Studio"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? 'Посада' : 'Job Title'}
              </label>
              <input
                type="text"
                value={data.vcard.title}
                onChange={(e) => updateVCard('title', e.target.value)}
                placeholder="Lead Designer"
                className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {lang === 'ua' ? 'Вебсайт' : 'Website'}
            </label>
            <input
              type="text"
              value={data.vcard.website}
              onChange={(e) => updateVCard('website', e.target.value)}
              placeholder="https://studio.ua"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Email Type */}
      {data.type === 'email' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {lang === 'ua' ? 'Одержувач (Email)' : 'Recipient Email'}
            </label>
            <input
              type="email"
              value={data.email.email}
              onChange={(e) => updateEmail('email', e.target.value)}
              placeholder="contact@brand.ua"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {lang === 'ua' ? 'Тема листа' : 'Subject'}
            </label>
            <input
              type="text"
              value={data.email.subject}
              onChange={(e) => updateEmail('subject', e.target.value)}
              placeholder="Запит на співпрацю"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {lang === 'ua' ? 'Повідомлення' : 'Message Body'}
            </label>
            <textarea
              rows={2}
              value={data.email.body}
              onChange={(e) => updateEmail('body', e.target.value)}
              placeholder="Доброго дня! Хочу уточнити деталі..."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Phone Type */}
      {data.type === 'phone' && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            {lang === 'ua' ? 'Номер телефону для миттєвого виклику' : 'Phone Number'}
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+380 67 123 4567"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100"
          />
        </div>
      )}

      {/* SMS Type */}
      {data.type === 'sms' && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {lang === 'ua' ? 'Номер одержувача' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={data.sms.phone}
              onChange={(e) => updateSms('phone', e.target.value)}
              placeholder="+380 50 123 4567"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {lang === 'ua' ? 'Текст SMS' : 'SMS Text'}
            </label>
            <textarea
              rows={2}
              value={data.sms.message}
              onChange={(e) => updateSms('message', e.target.value)}
              placeholder="Привіт, підтверджую бронювання."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>
      )}

      {/* Text Type */}
      {data.type === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 block">
              {lang === 'ua' ? 'Довільний текст або замітка' : 'Raw Text or Note'}
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {data.text.length} {lang === 'ua' ? 'символів' : 'chars'}
            </span>
          </div>
          <textarea
            rows={3}
            value={data.text}
            onChange={(e) => updateField('text', e.target.value)}
            placeholder="Введіть текст, пароль, опис товару або інструкцію..."
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100"
          />
        </div>
      )}

      {/* Crypto & Monobank Type */}
      {data.type === 'crypto' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {lang === 'ua' ? 'Сервіс:' : 'Service:'}
            </span>
            {(['monobank', 'ethereum', 'bitcoin', 'usdt'] as const).map((curr) => (
              <label key={curr} className="inline-flex items-center gap-1 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="crypto-currency"
                  checked={data.crypto.currency === curr}
                  onChange={() => updateCrypto('currency', curr)}
                  className="accent-indigo-500"
                />
                <span className="capitalize">{curr === 'monobank' ? 'Monobank Банка' : curr}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {data.crypto.currency === 'monobank'
                ? (lang === 'ua' ? 'Посилання або ID банки Monobank' : 'Monobank Jar Link or ID')
                : (lang === 'ua' ? 'Адреса крипто-гаманця' : 'Wallet Address')}
            </label>
            <input
              type="text"
              value={data.crypto.address}
              onChange={(e) => updateCrypto('address', e.target.value)}
              placeholder={
                data.crypto.currency === 'monobank'
                  ? 'https://send.monobank.ua/jar/12345678'
                  : '0x71C... або 1Boat...'
              }
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              {lang === 'ua' ? 'Сума (необов’язково)' : 'Amount (Optional)'}
            </label>
            <input
              type="text"
              value={data.crypto.amount || ''}
              onChange={(e) => updateCrypto('amount', e.target.value)}
              placeholder="0.05"
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-indigo-500 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
};
