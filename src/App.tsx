/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DataTypeSelector } from './components/DataTypeSelector';
import { DataForm } from './components/DataForm';
import { StyleControls } from './components/StyleControls';
import { QRPreview } from './components/QRPreview';
import { ScannerModal } from './components/ScannerModal';
import { TemplatesModal } from './components/TemplatesModal';
import {
  QRDataState,
  QRStyleConfig,
  SavedTemplate
} from './types';
import { DEFAULT_STYLE_CONFIG } from './utils/presets';
import { generateQRPayload } from './utils/qrPayload';
import { ShieldCheck, Zap, Sliders, Smartphone, Sparkles, Layers } from 'lucide-react';

const STORAGE_KEY_TEMPLATES = 'qr_art_studio_templates';
const STORAGE_KEY_LANG = 'qr_art_studio_lang';

export default function App() {
  const [lang, setLang] = useState<'ua' | 'en'>(() => {
    return (localStorage.getItem(STORAGE_KEY_LANG) as 'ua' | 'en') || 'ua';
  });

  const [dataState, setDataState] = useState<QRDataState>({
    type: 'url',
    url: 'https://mriya.ua',
    wifi: {
      ssid: 'Mriya_Guest_WiFi',
      password: 'ukraine_future_2026',
      encryption: 'WPA',
      hidden: false
    },
    vcard: {
      firstName: 'Олександр',
      lastName: 'Шевченко',
      phone: '+380 50 123 4567',
      email: 'alex@design.ua',
      company: 'Creative Labs Ukraine',
      title: 'Head of Product',
      website: 'https://mriya.ua',
      note: 'Зроблено з любов’ю в Україні'
    },
    email: {
      email: 'hello@mriya.ua',
      subject: 'Запит на створення QR-дизайну',
      body: 'Доброго дня! Цікавить створення естетичного брендованого коду...'
    },
    phone: '+380 44 123 4567',
    sms: {
      phone: '+380 50 123 4567',
      message: 'Привіт! Підтверджую замовлення.'
    },
    text: 'Слава Україні! Героям слава! 🇺🇦',
    crypto: {
      currency: 'monobank',
      address: 'https://send.monobank.ua/jar/example',
      amount: '100'
    }
  });

  const [styleConfig, setStyleConfig] = useState<QRStyleConfig>(DEFAULT_STYLE_CONFIG);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);

  // Sync lang changes to storage
  const handleToggleLang = () => {
    const nextLang = lang === 'ua' ? 'en' : 'ua';
    setLang(nextLang);
    localStorage.setItem(STORAGE_KEY_LANG, nextLang);
  };

  // Sync templates to storage
  const handleSaveTemplate = (name: string) => {
    const newTemplate: SavedTemplate = {
      id: 'tpl_' + Date.now(),
      name,
      createdAt: Date.now(),
      config: { ...styleConfig },
      dataType: dataState.type
    };
    const updated = [newTemplate, ...savedTemplates];
    setSavedTemplates(updated);
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updated));
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = savedTemplates.filter((t) => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updated));
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    setStyleConfig(template.config);
  };

  const handleReset = () => {
    if (
      window.confirm(
        lang === 'ua'
          ? 'Скинути всі стилі до стандартних налаштувань?'
          : 'Reset all styles to default values?'
      )
    ) {
      setStyleConfig(DEFAULT_STYLE_CONFIG);
    }
  };

  // Calculate current payload
  const currentPayload = generateQRPayload(dataState);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Contract */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onReset={handleReset}
        savedTemplatesCount={savedTemplates.length}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Data & Styling Controls (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Content Type Selection & Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {lang === 'ua' ? '1. Вміст та тип даних' : '1. Content & Data Type'}
                </h2>
                <div className="text-[11px] text-slate-500 font-mono">
                  {currentPayload.length} {lang === 'ua' ? 'байт' : 'bytes'}
                </div>
              </div>

              <DataTypeSelector
                currentType={dataState.type}
                onChange={(type) => setDataState({ ...dataState, type })}
                lang={lang}
              />

              <DataForm
                data={dataState}
                onChange={setDataState}
                lang={lang}
              />
            </div>

            {/* Step 2: Styling Studio */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {lang === 'ua' ? '2. Дизайн, форми та брендинг' : '2. Styling & Branding'}
                </h2>
                <span className="text-[11px] text-indigo-400 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" />
                  {lang === 'ua' ? 'Миттєве векторне прев’ю' : 'Instant live preview'}
                </span>
              </div>

              <StyleControls
                config={styleConfig}
                onChange={setStyleConfig}
                lang={lang}
              />
            </div>

            {/* Client-Side Privacy & Feature Badges */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'ua'
                    ? '100% Клієнтська генерація та конфіденційність'
                    : '100% Client-Side Privacy & Offline Ready'}
                </span>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-400">
                {lang === 'ua'
                  ? 'Жодні ваші дані (паролі Wi-Fi, контакти, посилання) не відправляються на сервер. Вся математика матриці, розрахунок контрасту WCAG та рендеринг у високій роздільності (до 4K) відбуваються виключно у вашому браузері.'
                  : 'Zero telemetry or server calls. All matrix math, WCAG contrast verification, and ultra-high-res rendering (up to 4K) happen completely inside your local browser.'}
              </p>
            </div>
          </div>

          {/* Right Column: Live Interactive Preview, Metrics & Export (5 cols on desktop, sticky) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {lang === 'ua' ? '3. Прев’ю та аудит зчитування' : '3. Live Preview & Audit'}
              </h2>
              <span className="text-[11px] text-emerald-400 font-medium">
                {lang === 'ua' ? 'SVG + Canvas' : 'SVG + Canvas'}
              </span>
            </div>

            <QRPreview
              payload={currentPayload}
              config={styleConfig}
              lang={lang}
            />
          </div>
        </div>
      </main>

      {/* Test Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        expectedPayload={currentPayload}
        lang={lang}
      />

      {/* Saved Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        templates={savedTemplates}
        currentConfig={styleConfig}
        onSaveTemplate={handleSaveTemplate}
        onLoadTemplate={handleLoadTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        lang={lang}
      />
    </div>
  );
}
