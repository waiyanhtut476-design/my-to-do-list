import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, Language } from '../i18n/translations';
import { Globe, Check } from 'lucide-react';

export const HeaderLanguageButton: React.FC = () => {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = async (langCode: Language) => {
    await setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
        title="เปลี่ยนภาษา / Change Language / ဘာသာစကားပြောင်းရန်"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="uppercase text-[11px] font-extrabold">{currentLang.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-750 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>Language / ဘာသာစကား</span>
            </span>
          </div>

          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col text-left">
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const SettingsLanguageCards: React.FC = () => {
  const { language, setLanguage, t } = useApp();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer relative ${
                isSelected
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-xs font-bold leading-tight">{lang.nativeName}</span>
              <span className="text-[10px] text-slate-400 font-medium">{lang.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
