import React from 'react';
import { QrCode, ScanLine, BookmarkCheck, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  lang: 'ua' | 'en';
  onToggleLang: () => void;
  onOpenScanner: () => void;
  onOpenTemplates: () => void;
  onReset: () => void;
  savedTemplatesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onOpenScanner,
  onOpenTemplates,
  onReset,
  savedTemplatesCount
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-400 p-[1.5px] shadow-sm shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
              QR Art Studio
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                100% Client-Side
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {lang === 'ua'
                ? 'Естетичні QR-коди з розрахунком контрасту та щільності'
                : 'Aesthetic QR generator with contrast & density metrics'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Templates Drawer Button */}
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all"
            title={lang === 'ua' ? 'Збережені шаблони' : 'Saved templates'}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">
              {lang === 'ua' ? 'Шаблони' : 'Templates'}
            </span>
            {savedTemplatesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center justify-center">
                {savedTemplatesCount}
              </span>
            )}
          </button>

          {/* Test Scanner Button */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 rounded-lg transition-all"
            title={lang === 'ua' ? 'Тест сканером / Камера' : 'Test scanner / Camera'}
          >
            <ScanLine className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">
              {lang === 'ua' ? 'Тест сканування' : 'Scan Test'}
            </span>
          </button>

          {/* Reset Defaults */}
          <button
            onClick={onReset}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg border border-transparent hover:border-slate-700/40 transition-colors"
            title={lang === 'ua' ? 'Скинути налаштування' : 'Reset to default'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {lang === 'ua' ? 'UA' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};
