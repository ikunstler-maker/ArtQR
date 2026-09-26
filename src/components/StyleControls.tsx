import React, { useRef } from 'react';
import {
  QRStyleConfig,
  DotType,
  CornerSquareType,
  CornerDotType,
  ErrorCorrectionLevel,
  FrameType
} from '../types';
import { STYLE_PRESETS, StylePreset } from '../utils/presets';
import { PRESET_LOGOS } from '../utils/presetIcons';
import {
  Palette,
  Shapes,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  LayoutTemplate,
  Upload,
  Trash2,
  HelpCircle,
  Check
} from 'lucide-react';

interface StyleControlsProps {
  config: QRStyleConfig;
  onChange: (config: QRStyleConfig) => void;
  lang: 'ua' | 'en';
}

type TabType = 'presets' | 'shapes' | 'colors' | 'logo' | 'frame' | 'advanced';

export const StyleControls: React.FC<StyleControlsProps> = ({ config, onChange, lang }) => {
  const [activeTab, setActiveTab] = React.useState<TabType>('presets');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateConfig = (updates: Partial<QRStyleConfig>) => {
    onChange({ ...config, ...updates });
  };

  const updateFrame = (updates: Partial<QRStyleConfig['frame']>) => {
    onChange({
      ...config,
      frame: { ...config.frame, ...updates }
    });
  };

  const applyPreset = (preset: StylePreset) => {
    onChange({
      ...config,
      ...preset.config
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'ua' ? 'Будь ласка, оберіть файл зображення' : 'Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        updateConfig({
          logoUrl: event.target.result,
          errorCorrectionLevel: 'H' // High is needed for reliable scan with logos
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    updateConfig({ logoUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
      {/* Tab navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/50 overflow-x-auto text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'presets'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ua' ? 'Пресети' : 'Presets'}</span>
        </button>

        <button
          onClick={() => setActiveTab('shapes')}
          className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'shapes'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shapes className="w-3.5 h-3.5" />
          <span>{lang === 'ua' ? 'Форми' : 'Shapes'}</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'colors'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>{lang === 'ua' ? 'Кольори' : 'Colors'}</span>
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'logo'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>{lang === 'ua' ? 'Логотип' : 'Logo'}</span>
          {config.logoUrl && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
        </button>

        <button
          onClick={() => setActiveTab('frame')}
          className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'frame'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>{lang === 'ua' ? 'Картка / Стенд' : 'Frame Card'}</span>
          {config.frame.enabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap transition-colors border-b-2 ${
            activeTab === 'advanced'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{lang === 'ua' ? 'Параметри' : 'Params'}</span>
        </button>
      </div>

      <div className="p-4">
        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              {lang === 'ua'
                ? 'Оберіть дизайнерську палітру та стиль в один клік:'
                : 'Select a curated design preset in one click:'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-700/60 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all text-left group"
                >
                  <div
                    className="w-7 h-7 rounded-md shrink-0 border border-white/10 flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: preset.previewBg }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: preset.previewFg }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                      {lang === 'ua' ? preset.nameUa : preset.nameEn}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {lang === 'ua' ? preset.descriptionUa : preset.descriptionEn}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SHAPES */}
        {activeTab === 'shapes' && (
          <div className="space-y-4">
            {/* Dots style */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                {lang === 'ua' ? 'Стиль елементів коду (Dots)' : 'Code Module Style (Dots)'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'rounded', labelUa: 'Заокруглені', labelEn: 'Rounded' },
                    { id: 'dots', labelUa: 'Крапки', labelEn: 'Dots' },
                    { id: 'classy', labelUa: 'Смуги (Classy)', labelEn: 'Classy' },
                    { id: 'classy-rounded', labelUa: 'Смуги округлі', labelEn: 'Classy Round' },
                    { id: 'extra-rounded', labelUa: 'Овали', labelEn: 'Extra Round' },
                    { id: 'square', labelUa: 'Квадрати', labelEn: 'Square' }
                  ] as { id: DotType; labelUa: string; labelEn: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateConfig({ dotsType: opt.id })}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      config.dotsType === opt.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    {lang === 'ua' ? opt.labelUa : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Corners Square */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                {lang === 'ua' ? 'Кутові рамки (Corners Square)' : 'Corner Squares Style'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'extra-rounded', labelUa: 'Округлені', labelEn: 'Rounded' },
                    { id: 'square', labelUa: 'Класичні', labelEn: 'Square' },
                    { id: 'dot', labelUa: 'Кільця (Dot)', labelEn: 'Circle' }
                  ] as { id: CornerSquareType; labelUa: string; labelEn: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateConfig({ cornersSquareType: opt.id })}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      config.cornersSquareType === opt.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    {lang === 'ua' ? opt.labelUa : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Corners Dot */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                {lang === 'ua' ? 'Кутові центри (Corner Dots)' : 'Corner Center Dots'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'dot', labelUa: 'Круглий центр', labelEn: 'Circular Dot' },
                    { id: 'square', labelUa: 'Квадратний центр', labelEn: 'Square Dot' }
                  ] as { id: CornerDotType; labelUa: string; labelEn: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateConfig({ cornersDotType: opt.id })}
                    className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      config.cornersDotType === opt.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    {lang === 'ua' ? opt.labelUa : opt.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COLORS */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            {/* Color mode switcher */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300">
                {lang === 'ua' ? 'Тип заповнення елементів' : 'Element Fill Type'}
              </span>
              <div className="flex bg-slate-950 p-0.5 rounded-md border border-slate-800">
                <button
                  type="button"
                  onClick={() => updateConfig({ dotsColorType: 'solid' })}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    config.dotsColorType === 'solid'
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ua' ? 'Суцільний' : 'Solid'}
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ dotsColorType: 'gradient' })}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    config.dotsColorType === 'gradient'
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ua' ? 'Градієнт' : 'Gradient'}
                </button>
              </div>
            </div>

            {/* Solid color */}
            {config.dotsColorType === 'solid' ? (
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block">
                    {lang === 'ua' ? 'Колір коду' : 'Foreground Color'}
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {config.dotsColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {['#0f172a', '#2563eb', '#16a34a', '#dc2626', '#eab308', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateConfig({ dotsColor: c })}
                      className="w-6 h-6 rounded-md border border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={config.dotsColor}
                    onChange={(e) => updateConfig({ dotsColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            ) : (
              /* Gradient controls */
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      {lang === 'ua' ? 'Початковий колір' : 'Color Start'}
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-200">
                        {config.dotsGradient.colorStops[0]?.color || '#3b82f6'}
                      </span>
                      <input
                        type="color"
                        value={config.dotsGradient.colorStops[0]?.color || '#3b82f6'}
                        onChange={(e) => {
                          const stops = [...config.dotsGradient.colorStops];
                          stops[0] = { offset: 0, color: e.target.value };
                          updateConfig({
                            dotsGradient: { ...config.dotsGradient, colorStops: stops }
                          });
                        }}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      {lang === 'ua' ? 'Кінцевий колір' : 'Color End'}
                    </label>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-200">
                        {config.dotsGradient.colorStops[1]?.color || '#8b5cf6'}
                      </span>
                      <input
                        type="color"
                        value={config.dotsGradient.colorStops[1]?.color || '#8b5cf6'}
                        onChange={(e) => {
                          const stops = [...config.dotsGradient.colorStops];
                          stops[1] = { offset: 1, color: e.target.value };
                          updateConfig({
                            dotsGradient: { ...config.dotsGradient, colorStops: stops }
                          });
                        }}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{lang === 'ua' ? 'Кут градієнта' : 'Gradient Angle'}</span>
                    <span className="font-mono">{config.dotsGradient.rotation ?? 45}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={config.dotsGradient.rotation ?? 45}
                    onChange={(e) =>
                      updateConfig({
                        dotsGradient: {
                          ...config.dotsGradient,
                          rotation: parseInt(e.target.value, 10)
                        }
                      })
                    }
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Background Color & Transparent */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block">
                    {lang === 'ua' ? 'Колір фону (Background)' : 'Background Color'}
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {config.bgTransparent ? (lang === 'ua' ? 'Прозорий' : 'Transparent') : config.bgColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {['#ffffff', '#f8fafc', '#0f172a', '#090d16', '#09090b'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      disabled={config.bgTransparent}
                      onClick={() => updateConfig({ bgColor: c })}
                      className="w-6 h-6 rounded-md border border-white/20 transition-transform hover:scale-110 disabled:opacity-30"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    disabled={config.bgTransparent}
                    value={config.bgColor}
                    onChange={(e) => updateConfig({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 disabled:opacity-30"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.bgTransparent}
                  onChange={(e) => updateConfig({ bgTransparent: e.target.checked })}
                  className="rounded accent-indigo-500"
                />
                <span>
                  {lang === 'ua'
                    ? 'Прозорий фон (для накладання на інші дизайни)'
                    : 'Transparent background (for overlay on designs)'}
                </span>
              </label>
            </div>

            {/* Custom Corner Square/Dot Colors */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useCustomCornerColor}
                  onChange={(e) => updateConfig({ useCustomCornerColor: e.target.checked })}
                  className="rounded accent-indigo-500"
                />
                <span>
                  {lang === 'ua' ? 'Окремий колір кутових рамок' : 'Custom corner square color'}
                </span>
              </label>

              {config.useCustomCornerColor && (
                <div className="flex items-center justify-between pl-5">
                  <span className="text-xs text-slate-400">
                    {lang === 'ua' ? 'Колір рамки:' : 'Square Color:'}
                  </span>
                  <input
                    type="color"
                    value={config.cornersSquareColor}
                    onChange={(e) => updateConfig({ cornersSquareColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: LOGO */}
        {activeTab === 'logo' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {lang === 'ua' ? 'Швидкі піктограми та логотипи' : 'Preset Logos & Icons'}
              </label>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {PRESET_LOGOS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      updateConfig({
                        logoUrl: item.svgDataUri,
                        errorCorrectionLevel: 'H'
                      })
                    }
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/40 transition-all text-center"
                  >
                    <img src={item.svgDataUri} alt={item.nameEn} className="w-6 h-6 object-contain mb-1" />
                    <span className="text-[10px] text-slate-300 truncate w-full">
                      {lang === 'ua' ? item.nameUa : item.nameEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload or clear */}
            <div className="pt-2 border-t border-slate-800">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {config.logoUrl
                      ? (lang === 'ua' ? 'Змінити свій логотип' : 'Change custom logo')
                      : (lang === 'ua' ? 'Завантажити свій логотип' : 'Upload custom logo')}
                  </span>
                </button>

                {config.logoUrl && (
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                    title={lang === 'ua' ? 'Видалити логотип' : 'Remove logo'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Logo Settings */}
            {config.logoUrl && (
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{lang === 'ua' ? 'Розмір логотипу' : 'Logo Scale'}</span>
                    <span className="font-mono">{Math.round(config.logoSize * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="0.4"
                    step="0.01"
                    value={config.logoSize}
                    onChange={(e) => updateConfig({ logoSize: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{lang === 'ua' ? 'Відступ навколо логотипу' : 'Logo Margin'}</span>
                    <span className="font-mono">{config.logoMargin}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={config.logoMargin}
                    onChange={(e) => updateConfig({ logoMargin: parseInt(e.target.value, 10) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={config.hideBackgroundDots}
                    onChange={(e) => updateConfig({ hideBackgroundDots: e.target.checked })}
                    className="rounded accent-indigo-500"
                  />
                  <span>
                    {lang === 'ua'
                      ? 'Очищати точки під логотипом (покращує читання)'
                      : 'Clear dots behind logo (boosts readability)'}
                  </span>
                </label>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FRAME & POSTER */}
        {activeTab === 'frame' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  {lang === 'ua' ? 'Картка для друку / Тейбл-тент' : 'Printable Frame Card'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {lang === 'ua'
                    ? 'Створює завершену листівку із закликом до дії'
                    : 'Creates ready-to-print poster or table stand'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.frame.enabled}
                  onChange={(e) => updateFrame({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {config.frame.enabled && (
              <div className="space-y-3 pt-1">
                {/* Frame type */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'ua' ? 'Стиль картки' : 'Card Style'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: 'simple-card', labelUa: 'Класична картка', labelEn: 'Classic Card' },
                        { id: 'poster', labelUa: 'Постер / Меню', labelEn: 'Poster / Menu' },
                        { id: 'badge-top', labelUa: 'Бейдж зверху', labelEn: 'Top Badge' },
                        { id: 'minimal-border', labelUa: 'Тонка рамка', labelEn: 'Minimal Border' }
                      ] as { id: FrameType; labelUa: string; labelEn: string }[]
                    ).map((f) => (
                      <button
                        key={f.id}
                        onClick={() => updateFrame({ type: f.id })}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                          config.frame.type === f.id
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        {lang === 'ua' ? f.labelUa : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'ua' ? 'Головний заголовок' : 'Header Title'}
                  </label>
                  <input
                    type="text"
                    value={config.frame.title}
                    onChange={(e) => updateFrame({ title: e.target.value })}
                    placeholder="ПРИЄДНУЙТЕСЬ / МЕНЮ"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'ua' ? 'Заклик до дії (CTA)' : 'Call To Action'}
                  </label>
                  <input
                    type="text"
                    value={config.frame.callToAction}
                    onChange={(e) => updateFrame({ callToAction: e.target.value })}
                    placeholder="СКАНУЙТЕ ТУТ"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {lang === 'ua' ? 'Підпис знизу' : 'Bottom Instructions'}
                  </label>
                  <input
                    type="text"
                    value={config.frame.subtitle}
                    onChange={(e) => updateFrame({ subtitle: e.target.value })}
                    placeholder="Наведіть камеру вашого смартфона"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400">
                      {lang === 'ua' ? 'Тло картки:' : 'Card BG:'}
                    </span>
                    <input
                      type="color"
                      value={config.frame.bgColor}
                      onChange={(e) => updateFrame({ bgColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-400">
                      {lang === 'ua' ? 'Акцент:' : 'Accent:'}
                    </span>
                    <input
                      type="color"
                      value={config.frame.accentColor}
                      onChange={(e) => updateFrame({ accentColor: e.target.value })}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ADVANCED PARAMETERS */}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  {lang === 'ua' ? 'Рівень корекції помилок (ECL)' : 'Error Correction Level'}
                </label>
                <span className="text-[11px] text-indigo-400 font-mono">
                  {config.errorCorrectionLevel === 'H' ? '30% (Max)' : config.errorCorrectionLevel === 'Q' ? '25%' : config.errorCorrectionLevel === 'M' ? '15%' : '7%'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: 'L', name: 'L (7%)', descUa: 'Легкий', descEn: 'Low' },
                    { id: 'M', name: 'M (15%)', descUa: 'Стандарт', descEn: 'Medium' },
                    { id: 'Q', name: 'Q (25%)', descUa: 'Високий', descEn: 'Quartile' },
                    { id: 'H', name: 'H (30%)', descUa: 'Дизайн', descEn: 'High' }
                  ] as { id: ErrorCorrectionLevel; name: string; descUa: string; descEn: string }[]
                ).map((ecl) => (
                  <button
                    key={ecl.id}
                    onClick={() => updateConfig({ errorCorrectionLevel: ecl.id })}
                    className={`py-2 px-1 rounded-lg text-xs font-medium border text-center transition-all ${
                      config.errorCorrectionLevel === ecl.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>{ecl.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {lang === 'ua' ? ecl.descUa : ecl.descEn}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {lang === 'ua'
                  ? '💡 Для дизайнерських кодів, логотипів та заокруглених елементів рекомендовано рівень H (відновлює до 30% пошкодженої матриці).'
                  : '💡 For styled codes, embedded logos and rounded modules, H is recommended (recovers up to 30% of matrix).'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{lang === 'ua' ? 'Тиха зона (Quiet Zone / Margin)' : 'Quiet Zone (Margin)'}</span>
                <span className="font-mono">{config.margin}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="2"
                value={config.margin}
                onChange={(e) => updateConfig({ margin: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {lang === 'ua'
                  ? 'Камерам смартфонів потрібна рамка навколо коду (мінімум 8-12px) для швидкого автофокусу.'
                  : 'Smartphone cameras require empty surrounding space (≥8-12px) for autofocus.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
