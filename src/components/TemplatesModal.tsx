import React, { useState } from 'react';
import { SavedTemplate, QRStyleConfig } from '../types';
import { X, BookmarkPlus, Trash2, Check, ArrowRight, FolderKanban } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: SavedTemplate[];
  currentConfig: QRStyleConfig;
  onSaveTemplate: (name: string) => void;
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  lang: 'ua' | 'en';
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  templates,
  currentConfig,
  onSaveTemplate,
  onLoadTemplate,
  onDeleteTemplate,
  lang
}) => {
  const [templateName, setTemplateName] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;
    onSaveTemplate(templateName.trim());
    setTemplateName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">
              {lang === 'ua' ? 'Збережені шаблони дизайну' : 'Saved Design Templates'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Save Current Design Form */}
          <form onSubmit={handleSave} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <label className="text-xs font-semibold text-slate-200 block">
              {lang === 'ua' ? 'Зберегти поточний стиль як шаблон' : 'Save current style as template'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder={lang === 'ua' ? 'Наприклад: Корпоративний синій 2026' : 'e.g. Brand Blue 2026'}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!templateName.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-all"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{lang === 'ua' ? 'Зберегти' : 'Save'}</span>
              </button>
            </div>
            {saveSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {lang === 'ua' ? 'Успішно збережено в браузері (localStorage)!' : 'Saved to localStorage!'}
              </span>
            )}
          </form>

          {/* List of saved templates */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {lang === 'ua' ? 'Ваші збережені стилі' : 'Your saved styles'} ({templates.length})
            </h4>

            {templates.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/30 rounded-xl border border-slate-800/60">
                {lang === 'ua'
                  ? 'У вас ще немає збережених шаблонів. Створіть свій перший дизайн та збережіть вище!'
                  : 'No saved templates yet. Design a code and click save above!'}
              </div>
            ) : (
              <div className="space-y-2">
                {templates.map((tpl) => {
                  const fgColor =
                    tpl.config.dotsColorType === 'solid'
                      ? tpl.config.dotsColor
                      : tpl.config.dotsGradient?.colorStops[0]?.color || '#000';
                  const dateStr = new Date(tpl.createdAt).toLocaleDateString();

                  return (
                    <div
                      key={tpl.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg shrink-0 border border-white/10 flex items-center justify-center shadow-inner"
                          style={{ backgroundColor: tpl.config.bgColor }}
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: fgColor }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                            {tpl.name}
                          </h5>
                          <p className="text-[10px] text-slate-500">
                            {tpl.config.dotsType} · {dateStr}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onLoadTemplate(tpl);
                            onClose();
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-medium transition-all"
                        >
                          <span>{lang === 'ua' ? 'Застосувати' : 'Apply'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteTemplate(tpl.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title={lang === 'ua' ? 'Видалити' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
