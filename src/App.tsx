import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TasksView } from './components/TasksView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { TaskModal } from './components/TaskModal';
import { NotificationModal } from './components/NotificationModal';
import { 
  CheckCircle, 
  Calendar as CalendarIcon, 
  BarChart2, 
  Settings as SettingsIcon, 
  Plus, 
  Bell, 
  SlidersHorizontal, 
  User as UserIcon, 
  Loader2, 
  Cloud, 
  ShieldCheck, 
  Eye, 
  Award,
  LogOut
} from 'lucide-react';

function AppContent() {
  const { 
    user, 
    userProfile, 
    signIn, 
    authLoading, 
    loading, 
    notifications,
    isTaskModalOpen,
    setIsTaskModalOpen,
    isNotificationOpen,
    setIsNotificationOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'analytics' | 'settings'>('tasks');

  // Dynamic Thai date formatting
  const getThaiTodayStr = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `วันนี้ • ${date.toLocaleDateString('th-TH', options)}`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Render Loader during Auth checking
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mb-3" />
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">กำลังเชื่อมต่อฐานข้อมูลคลาวด์...</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Clarity Flow - ปลอดภัยและเรียลไทม์</p>
      </div>
    );
  }

  // Render Login Landing Page when logged out
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col justify-between py-12 px-6">
        {/* Top brand */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/35">
            <CheckCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            Clarity Flow
          </span>
        </div>

        {/* Hero Illustration details */}
        <div className="max-w-sm mx-auto text-center space-y-6 my-auto">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto shadow-sm">
              <Award className="w-12 h-12 stroke-[1.5]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              จัดระเบียบความคิด <br />พิชิตเป้าหมายทุกวัน
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              แอปพลิเคชันจดบันทึกงานที่รองรับระบบแจ้งเตือนอัจฉริยะ ล็อกอินรวดเร็ว ซิงค์เรียลไทม์ และรายงานสถิติกราฟความคืบหน้า
            </p>
          </div>

          {/* Social Sign-In */}
          <button
            type="button"
            onClick={signIn}
            className="w-full py-4 px-6 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
          >
            {/* Minimalist Google Icon concept */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.84h2.64c1.55-2.43 2.63-6 2.63-9.52z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.84c-.73.49-1.66.78-2.64.78-2.03 0-3.75-1.37-4.36-3.22H1.94v2.96C3.76 21.04 7.57 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M7.64 15.06c-.15-.49-.24-.98-.24-1.5s.09-1.01.24-1.5V9.1H1.94C1.3 10.42 1 11.92 1 13.5s.3 3.08.94 4.4l3.14-2.44-1.12-2.4c0-.74-.08-1.52-.08-2.3z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.57 1 3.76 2.96 1.94 5.88l3.14 2.44c.61-1.85 2.33-3.22 4.36-3.22z"
              />
            </svg>
            <span>เข้าสู่ระบบรวดเร็วด้วย Google</span>
          </button>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-center text-[10px] font-bold text-slate-400">
          <div className="space-y-1">
            <Cloud className="w-5 h-5 mx-auto text-slate-400" />
            <span>ซิงค์เรียลไทม์</span>
          </div>
          <div className="space-y-1">
            <Eye className="w-5 h-5 mx-auto text-slate-400" />
            <span>โหมดถนอมสายตา</span>
          </div>
          <div className="space-y-1">
            <ShieldCheck className="w-5 h-5 mx-auto text-slate-400" />
            <span>คลาวด์ปลอดภัย</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Logged-In Application Core
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white pb-28">
      {/* 1. Universal Top Header Bar (Fixed) */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 pt-safe">
        <div className="h-20 px-4 max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-slate-950 dark:text-white truncate">
                สวัสดี, {userProfile?.displayName?.split(' ')[0] || user.displayName?.split(' ')[0] || 'กานต์'} 👋
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] shrink-0 uppercase tracking-wide">
                {getThaiTodayStr()}
              </span>
              <span className="text-[10px] text-slate-400 font-bold truncate">
                {activeTab === 'tasks' ? 'Tasks' : activeTab === 'calendar' ? 'ปฏิทิน' : activeTab === 'analytics' ? 'สถิติ' : 'ตั้งค่า'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => alert('ตัวกรองและพารามิเตอร์การซิงค์คลาวด์ ได้รับการจัดหมวดหมู่ด่วนเรียบร้อย!')}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="จัดเรียง & ตัวกรอง"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Notification Button with Badge */}
            <button
              type="button"
              onClick={() => setIsNotificationOpen(true)}
              className="w-10 h-10 relative flex items-center justify-center rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="กล่องข้อความแจ้งเตือน"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-500 text-white font-extrabold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile image with dropdown/logout */}
            <div className="relative group ml-1">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Profile'}
                  className="w-8 h-8 rounded-full object-cover shadow-xs cursor-pointer border border-slate-200 dark:border-slate-800"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer">
                  {user.displayName?.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Container (Dynamic view injection) */}
      <main className="max-w-md mx-auto px-4 pt-24 pb-8 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
            <p className="text-xs font-semibold text-slate-500">กำลังดึงข้อมูลเรียลไทม์จากคลาวด์...</p>
          </div>
        ) : (
          <>
            {activeTab === 'tasks' && <TasksView />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'settings' && <SettingsView />}
          </>
        )}
      </main>

      {/* 3. Navigation Bar (Fixed Bottom) */}
      <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800/80 shadow-lg">
        <div className="relative flex items-center justify-between h-16 px-2 max-w-md mx-auto">
          
          {/* Tab 1: Tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center justify-center flex-1 h-12 transition-all gap-0.5 cursor-pointer ${
              activeTab === 'tasks'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CheckCircle className="w-5.5 h-5.5" />
            <span className="text-[10px] font-bold">งานของฉัน</span>
          </button>

          {/* Tab 2: Calendar */}
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center flex-1 h-12 transition-all gap-0.5 cursor-pointer ${
              activeTab === 'calendar'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CalendarIcon className="w-5.5 h-5.5" />
            <span className="text-[10px] font-bold">ปฏิทิน</span>
          </button>

          {/* Centered Trigger FAB */}
          <div className="flex items-center justify-center px-2">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(true)}
              className="w-13 h-13 -mt-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/35 hover:shadow-indigo-700/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="สร้างงานใหม่"
            >
              <Plus className="w-6.5 h-6.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Tab 3: Analytics */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center flex-1 h-12 transition-all gap-0.5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BarChart2 className="w-5.5 h-5.5" />
            <span className="text-[10px] font-bold">สถิติ</span>
          </button>

          {/* Tab 4: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center justify-center flex-1 h-12 transition-all gap-0.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'text-indigo-600 dark:text-indigo-400 font-extrabold scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <SettingsIcon className="w-5.5 h-5.5" />
            <span className="text-[10px] font-bold">ตั้งค่า</span>
          </button>

        </div>
      </nav>

      {/* Floating Create Task Modal Drawer */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />

      {/* Floating Notification Inbox Drawer */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onGoToSettings={() => setActiveTab('settings')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
