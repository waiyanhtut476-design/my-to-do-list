import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Cloud, Trash2, ShieldAlert, Moon, Sun, Sparkles, Check, HelpCircle, Globe } from 'lucide-react';
import { SettingsLanguageCards } from './LanguageSelector';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, logout, user, theme, setTheme, t } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!settings) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleToggle = async (key: keyof typeof settings, val: any) => {
    await updateSettings({ [key]: val });
    showToast(t('toast_saved'));
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    await setTheme(newTheme);
    showToast(newTheme === 'dark' ? t('toast_dark_theme') : t('toast_light_theme'));
  };

  const handleReset = async () => {
    await setTheme('light');
    await updateSettings({
      darkMode: false,
      notificationsEnabled: true,
      earlyReminderMinutes: 30,
      urgentReminderRepeat: true
    });
    showToast(t('toast_reset'));
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Settings Sub-header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
            {t('settings_main_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {t('settings_main_desc')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100/50">
            <Cloud className="w-3.5 h-3.5" />
            <span>{t('cloud_saved_badge')}</span>
          </span>
          <button 
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
          >
            {t('reset_defaults')}
          </button>
        </div>
      </div>

      {/* Language Selection Card (Thai, English, Myanmar) */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Globe className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t('lang_section_title')}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {t('lang_section_desc')}
            </span>
          </div>
        </div>
        <SettingsLanguageCards />
      </div>

      {/* Master Switch Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Bell className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {t('notify_master_title')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t('notify_master_desc')}
              </span>
            </div>
          </div>
          {/* iOS toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none mt-1">
            <input 
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(e) => handleToggle('notificationsEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
          </label>
        </div>
      </div>

      {/* Theme Switcher (Light / Dark Mode) Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 transition-colors ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-amber-500'
            }`}>
              {theme === 'dark' ? <Moon className="w-5.5 h-5.5" /> : <Sun className="w-5.5 h-5.5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {t('theme_section_title')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t('theme_section_desc')}
              </span>
            </div>
          </div>

          {/* Quick iOS toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none mt-1" title="Toggle Theme">
            <input 
              type="checkbox"
              checked={theme === 'dark'}
              onChange={(e) => handleThemeChange(e.target.checked ? 'dark' : 'light')}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
          </label>
        </div>

        {/* 2 Visual Interactive Selection Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-50/70 dark:bg-slate-800 border-amber-400 text-amber-950 dark:text-white shadow-xs ring-2 ring-amber-400/40 scale-[1.01]'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold block">{t('theme_light')}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{t('theme_light_desc')}</span>
            </div>
            {theme === 'light' && (
              <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-0.5 pt-0.5">
                <Check className="w-3 h-3 stroke-[3]" /> Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-500 text-indigo-950 dark:text-white shadow-xs ring-2 ring-indigo-500/40 scale-[1.01]'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div className="text-center">
              <span className="text-xs font-bold block">{t('theme_dark')}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{t('theme_dark_desc')}</span>
            </div>
            {theme === 'dark' && (
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 pt-0.5">
                <Check className="w-3 h-3 stroke-[3]" /> Active
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advance Reminders Settings */}
      <div className="space-y-2.5">
        <div className="flex flex-col px-0.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('reminder_title')}</span>
          <span className="text-[11px] text-slate-400">{t('reminder_desc')}</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          
          {/* Urgent tasks reminders advance */}
          <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100/50 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('urgent_tasks_heading')}</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[9px] font-bold">Important</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '15m', mins: 15 },
                { label: '30m', mins: 30 },
                { label: '1h', mins: 60 },
                { label: '1d', mins: 1440 }
              ].map((chip) => {
                const isActive = settings.earlyReminderMinutes === chip.mins;
                return (
                  <button
                    key={chip.mins}
                    type="button"
                    onClick={() => handleToggle('earlyReminderMinutes', chip.mins)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-bold scale-[1.02]'
                        : 'bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Repeat toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-700/60 mt-1">
              <span className="text-[11px] font-semibold text-slate-500">{t('repeat_reminder')}</span>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
                <input 
                  type="checkbox"
                  checked={settings.urgentReminderRepeat}
                  onChange={(e) => handleToggle('urgentReminderRepeat', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-3.5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Item: General tasks default */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">{t('general_tasks_heading')}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{t('general_tasks_value')}</span>
          </div>

        </div>
      </div>

      {/* Cloud Sync & Account details */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
        <span className="font-extrabold text-slate-700 dark:text-slate-300 block">{t('account_section_title')}</span>
        <p className="text-slate-500 dark:text-slate-400">
          {t('current_account_label')} <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
        </p>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          {t('account_sync_desc')}
        </p>
        <button
          type="button"
          onClick={logout}
          className="text-red-500 hover:text-red-600 font-bold pt-1 cursor-pointer text-left block"
        >
          {t('logout_button')}
        </button>
      </div>



      {/* Global Toast component inline simulation */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-slate-900/90 dark:bg-slate-950/90 text-white rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 z-[90] animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
