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
  LogOut,
  Mail,
  Lock
} from 'lucide-react';

function AppContent() {
  const { 
    user, 
    userProfile, 
    authLoading, 
    loading, 
    notifications,
    isTaskModalOpen,
    setIsTaskModalOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    loginWithEmail,
    registerWithEmail
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'analytics' | 'settings'>('tasks');

  // Email form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Thai date formatting
  const getThaiTodayStr = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `วันนี้ • ${date.toLocaleDateString('th-TH', options)}`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }
    if (authMode === 'register' && !displayName) {
      setErrorMessage('กรุณากรอกชื่อที่ต้องการให้แสดงผล');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, displayName);
      }
    } catch (err: any) {
      console.error(err);
      let localizedError = 'เกิดข้อผิดพลาดในการยืนยันตัวตน โปรดลองอีกครั้ง';
      const msg = err?.message || String(err);
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential') || msg.includes('auth/invalid-login-credentials')) {
        localizedError = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบอีกครั้ง';
      } else if (msg.includes('email-already-in-use')) {
        localizedError = 'อีเมลนี้ถูกใช้งานแล้ว โปรดเข้าสู่ระบบหรือใช้อีเมลอื่น';
      } else if (msg.includes('invalid-email')) {
        localizedError = 'กรุณากรอกรูปแบบอีเมลให้ถูกต้อง';
      } else if (msg.includes('Configuration not found') || msg.includes('auth/operation-not-allowed')) {
        localizedError = 'โปรดเปิดใช้การเข้าสู่ระบบแบบ Email/Password ใน Firebase Console ของคุณก่อนใช้งานครับ';
      }
      setErrorMessage(localizedError);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col justify-between py-8 px-6">
        {/* Top brand */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/35">
            <CheckCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            Clarity Flow
          </span>
        </div>

        {/* Beautiful Authentication Card */}
        <div className="max-w-sm w-full mx-auto bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-5 my-auto">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {authMode === 'login' ? 'เข้าสู่ระบบบัญชีส่วนตัว' : 'สร้างบัญชีเข้าใช้งาน'}
            </h1>
            <p className="text-[11px] text-slate-400 leading-normal max-w-[280px] mx-auto">
              ใช้งานได้ทุกคน ข้อมูลของคุณจะบันทึกแยกเป็นส่วนตัวบนระบบคลาวด์อย่างปลอดภัยด้วย Gmail ของคุณเอง
            </p>
          </div>

          {/* Tab toggler */}
          <div className="grid grid-cols-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              เข้าสู่ระบบ
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              สมัครสมาชิก
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50">
              {errorMessage}
            </div>
          )}

          {/* Auth form */}
          <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  ชื่อที่ต้องการให้แสดงผล
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="เช่น สมชาย ใจดี"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all text-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                อีเมล / Gmail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                รหัสผ่านสำหรับเข้าใช้แอป
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ความยาวอย่างน้อย 6 ตัวอักษร"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all text-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/35 hover:shadow-indigo-700/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังดำเนินการ...</span>
                </>
              ) : (
                <span>{authMode === 'login' ? 'เข้าสู่ระบบเลย 🚀' : 'สมัครสมาชิกแล้วเริ่มลุย 🎉'}</span>
              )}
            </button>
          </form>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-center text-[10px] font-bold text-slate-400">
          <div className="space-y-1">
            <Cloud className="w-5 h-5 mx-auto text-indigo-500/80" />
            <span>ซิงค์แยกบัญชีส่วนตัว</span>
          </div>
          <div className="space-y-1">
            <Eye className="w-5 h-5 mx-auto text-indigo-500/80" />
            <span>โหมดถนอมสายตา</span>
          </div>
          <div className="space-y-1">
            <ShieldCheck className="w-5 h-5 mx-auto text-indigo-500/80" />
            <span>คลาวด์ปลอดภัย 100%</span>
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
