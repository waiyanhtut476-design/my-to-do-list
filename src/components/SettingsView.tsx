import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Cloud, Trash2, ShieldAlert, Moon, Sun, Sparkles, Check, HelpCircle, Globe, Download, Upload, User, Send, Database } from 'lucide-react';
import { SettingsLanguageCards } from './LanguageSelector';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    logout, 
    user, 
    userProfile, 
    updateUserProfileName, 
    tasks, 
    createTask, 
    createNotification, 
    theme, 
    setTheme, 
    t 
  } = useApp();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(userProfile?.displayName || user?.displayName || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSaveProfileName = async () => {
    if (!editingName.trim()) return;
    setIsSavingName(true);
    await updateUserProfileName(editingName.trim());
    setIsSavingName(false);
    showToast(t('profile_updated_toast'));
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: {
        email: user?.email,
        displayName: userProfile?.displayName || user?.displayName
      },
      tasks: tasks.map(t => ({
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        categoryId: t.categoryId,
        dueDate: t.dueDate,
        dueTime: t.dueTime,
        subtasks: t.subtasks,
        isPinned: t.isPinned,
        tags: t.tags,
        recurrence: t.recurrence
      })),
      settings
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clarity-flow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('backup_copied_success'));
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && Array.isArray(parsed.tasks)) {
          for (const taskData of parsed.tasks) {
            await createTask({
              title: taskData.title || 'Untitled Task',
              description: taskData.description || '',
              status: taskData.status || 'pending',
              priority: taskData.priority || 'normal',
              categoryId: taskData.categoryId || 'work',
              dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
              dueTime: taskData.dueTime || '09:30',
              subtasks: taskData.subtasks || [],
              isPinned: !!taskData.isPinned,
              tags: taskData.tags || [],
              recurrence: taskData.recurrence || 'none'
            });
          }
          showToast(`นำเข้าสำเร็จ ${parsed.tasks.length} รายการ!`);
        }
      } catch (err) {
        alert('ไฟล์สำรองไม่ถูกต้อง กรุณาเลือกไฟล์ .json ที่ถูกต้อง');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Trigger real in-app test notification
  const handleTestNotification = async () => {
    await createNotification(
      t('test_notif_title'),
      t('test_notif_body'),
      'system'
    );
    showToast(t('test_notif_title'));
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

      {/* 1. User Profile Customization Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <User className="w-5.5 h-5.5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {t('edit_profile_name_label')}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder={userProfile?.displayName || user?.displayName || 'Your Name'}
                className="text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 flex-1 text-slate-900 dark:text-white focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleSaveProfileName}
                disabled={isSavingName || !editingName.trim()}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                {t('save_profile_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Language Selection Card (Thai, English, Myanmar) */}
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

      {/* 3. Master Notifications & Test Notification Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
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

          <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
            <input 
              type="checkbox" 
              checked={settings.notificationsEnabled}
              onChange={(e) => handleToggle('notificationsEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Test Notification Trigger Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">{t('test_notif_body')}</span>
          <button
            type="button"
            onClick={handleTestNotification}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('test_notif_btn')}</span>
          </button>
        </div>
      </div>

      {/* 4. Display Theme Selection Cards */}
      <div className="space-y-2">
        <div className="flex flex-col px-0.5">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {t('theme_section_title')}
          </span>
          <span className="text-[11px] text-slate-400 leading-tight">
            {t('theme_section_desc')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`flex flex-col p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm'
                : 'border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
            }`}
          >
            {theme === 'light' && (
              <span className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            )}
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2.5">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{t('theme_light')}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t('theme_light_desc')}</span>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`flex flex-col p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-sm'
                : 'border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
            }`}
          >
            {theme === 'dark' && (
              <span className="absolute top-3 right-3 w-4.5 h-4.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            )}
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center mb-2.5">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">{t('theme_dark')}</span>
            <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t('theme_dark_desc')}</span>
          </button>
        </div>
      </div>

      {/* 5. Early Reminders Setting */}
      <div className="space-y-2">
        <div className="flex flex-col px-0.5">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">{t('reminder_title')}</span>
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

      {/* 6. Data Backup & Export (JSON) */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {t('backup_export_title')}
            </span>
            <span className="text-[10px] text-slate-400">
              {t('backup_export_desc')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{t('backup_download_btn')}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t('backup_import_btn')}</span>
          </button>
          
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".json"
            onChange={handleImportBackup} 
            className="hidden" 
          />
        </div>
      </div>

      {/* 7. Cloud Sync & Account details */}
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
