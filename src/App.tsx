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
  Lock,
  Key,
  RefreshCw,
  Copy,
  ExternalLink,
  Globe,
  AlertCircle,
  Check
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
    registerWithEmail,
    isUsingCustomConfig,
    activeProjectId,
    saveCustomFirebaseConfig,
    clearCustomFirebaseConfig,
    signIn,
    theme
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'analytics' | 'settings'>('tasks');

  // Email form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<{
    type: 'unauthorized-domain' | 'operation-not-allowed' | 'general';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(window.location.hostname);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 3000);
  };

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
      setAuthError({ type: 'general', message: 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน' });
      return;
    }
    if (password.length < 6) {
      setAuthError({ type: 'general', message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
      return;
    }

    setAuthError(null);
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else {
        const finalName = displayName.trim() || email.split('@')[0];
        await registerWithEmail(email, password, finalName);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      const msg = err?.code || err?.message || String(err);
      if (msg.includes('operation-not-allowed')) {
        setAuthError({
          type: 'operation-not-allowed',
          message: 'ยังไม่ได้เปิดสวิตช์ Email/Password ในหน้า Sign-in method ของ Firebase Console'
        });
      } else if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential') || msg.includes('auth/invalid-login-credentials')) {
        setAuthError({
          type: 'general',
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือยังไม่ได้สมัครสมาชิก (หากเข้าใช้งานครั้งแรก โปรดกดสลับไปที่แท็บ "สมัครสมาชิก" ด้านบนเพื่อเปิดบัญชีก่อนนะครับ)'
        });
      } else if (msg.includes('email-already-in-use')) {
        setAuthError({
          type: 'general',
          message: 'อีเมลนี้ถูกใช้งานแล้ว โปรดสลับไปที่แท็บ "เข้าสู่ระบบ"'
        });
      } else if (msg.includes('invalid-email')) {
        setAuthError({
          type: 'general',
          message: 'กรุณากรอกรูปแบบอีเมลให้ถูกต้อง'
        });
      } else {
        setAuthError({
          type: 'general',
          message: err?.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน โปรดลองอีกครั้ง'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      await signIn();
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const msg = err?.code || err?.message || String(err);
      if (msg.includes('unauthorized-domain')) {
        setAuthError({
          type: 'unauthorized-domain',
          message: 'โดเมนของแอปนี้ยังไม่ได้ถูกเพิ่มใน Authorized domains ของ Firebase Console'
        });
      } else if (msg.includes('popup-blocked')) {
        setAuthError({
          type: 'general',
          message: 'เบราว์เซอร์บล็อกหน้าต่างป๊อปอัป โปรดกดอนุญาตป๊อปอัปบนเบราว์เซอร์เพื่อเข้าสู่ระบบ'
        });
      } else if (msg.includes('operation-not-allowed')) {
        setAuthError({
          type: 'operation-not-allowed',
          message: 'ยังไม่ได้เปิดใช้งาน Google Sign-In ในหน้า Sign-in method ของ Firebase Console'
        });
      } else {
        setAuthError({
          type: 'general',
          message: err?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google'
        });
      }
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
      <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col justify-between py-6 px-6`}>
        {/* Top Header Logo */}
        <div className="flex items-center gap-2 justify-center max-w-sm w-full mx-auto">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/35">
            <CheckCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            Clarity Flow
          </span>
        </div>

        {/* Form area */}
        <div className="max-w-sm w-full mx-auto bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-4 my-auto">
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h1 className="text-lg font-black text-slate-900 dark:text-white">
                {authMode === 'login' ? 'เข้าสู่ระบบบัญชีส่วนตัว' : 'สร้างบัญชีเข้าใช้งาน'}
              </h1>
              <p className="text-[10px] text-slate-400 leading-normal max-w-[280px] mx-auto">
                ข้อมูลจะถูกบันทึกแยกและคุ้มครองอย่างปลอดภัยผ่านฐานข้อมูลคลาวด์ของโครงการคุณเอง
              </p>
            </div>

            {/* Tab toggler */}
            <div className="grid grid-cols-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(null); }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                สมัครสมาชิก
              </button>
            </div>

            {authError && (
              <div className="space-y-2">
                {authError.type === 'unauthorized-domain' ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300">
                      <Globe className="w-4 h-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <div className="space-y-1">
                        <span className="font-extrabold block text-sm text-amber-950 dark:text-amber-200">
                          จำเป็นต้องอนุญาตโดเมนใน Firebase
                        </span>
                        <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                          เพื่อความปลอดภัย Firebase กำหนดให้ต้องเพิ่มชื่อโดเมนเว็บนี้ในรายการ <b>Authorized domains</b> ก่อน จึงจะล็อกอินด้วย Google ได้ครับ
                        </p>
                      </div>
                    </div>

                    {/* Domain copy box */}
                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">ชื่อโดเมนเว็บนี้:</span>
                        <span className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {window.location.hostname}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyDomain}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
                      >
                        {copiedDomain ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>คัดลอกแล้ว!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>คัดลอกโดเมน</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Steps & Direct Link */}
                    <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-extrabold text-slate-800 dark:text-white block text-[11px]">วิธีเปิดใช้ใน 3 ขั้นตอน:</span>
                      <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
                        <li>กดปุ่ม <b>"คัดลอกโดเมน"</b> ด้านบน</li>
                        <li>
                          คลิกเปิดหน้าตั้งค่า: {' '}
                          <a
                            href={`https://console.firebase.google.com/project/${activeProjectId}/authentication/settings`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-extrabold text-indigo-600 dark:text-indigo-400 underline inline-flex items-center gap-0.5"
                          >
                            <span>Firebase Console &rarr; Authorized domains</span>
                            <ExternalLink className="w-3 h-3 inline" />
                          </a>
                        </li>
                        <li>เลื่อนลงไปที่ <b>Authorized domains</b> &rarr; กด <b>Add domain</b> &rarr; วางชื่อโดเมน &rarr; กด <b>Save</b></li>
                      </ol>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                        ✓ เมื่อกด Save แล้ว กลับมากดปุ่ม "เข้าสู่ระบบด้วย Google" ด้านล่างเพื่อเริ่มใช้งานได้ทันทีครับ!
                      </p>
                    </div>
                  </div>
                ) : authError.type === 'operation-not-allowed' ? (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/25 border border-amber-200/60 dark:border-amber-900/40 rounded-xl space-y-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                    <span className="font-extrabold block text-amber-900 dark:text-amber-200">🛠️ วิธีเปิดใช้ระบบล็อกอินใน Firebase:</span>
                    <ol className="list-decimal pl-4 space-y-1 font-semibold leading-relaxed">
                      <li>
                        เปิดไปที่: {' '}
                        <a
                          href={`https://console.firebase.google.com/project/${activeProjectId}/authentication/providers`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline font-black text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-0.5"
                        >
                          <span>หน้า Sign-in method ของคุณ</span>
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      </li>
                      <li>คลิกเปิดสวิตช์ <b>Email/Password</b> หรือ <b>Google</b> ให้เป็น Enabled</li>
                      <li>กดปุ่ม <b>Save (บันทึก)</b> เป็นอันเสร็จสิ้น!</li>
                    </ol>
                  </div>
                ) : (
                  <div className="p-3 text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-150 dark:border-red-900/50 leading-relaxed flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{authError.message}</span>
                  </div>
                )}
              </div>
            )}

              {/* Auth form */}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      ชื่อแสดงผลของคุณ
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="เช่น สมชาย ใจดี (ไม่จำเป็นต้องกรอก)"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    อีเมล / Gmail ส่วนตัว
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    กำหนดรหัสผ่านเข้าแอป
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="ความยาว 6 ตัวอักษรขึ้นไป"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 transition-all text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังดำเนินการ...</span>
                    </>
                  ) : (
                    <span>{authMode === 'login' ? 'เข้าสู่ระบบด้วยอีเมล 🚀' : 'สมัครสมาชิกด้วยอีเมล 🎉'}</span>
                  )}
                </button>
              </form>

              {/* Native Google Sign-In button option */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-extrabold text-slate-400 uppercase">หรือเชื่อมต่อด่วน</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
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
                <span>เข้าสู่ระบบรวดเร็วด้วยบัญชี Google</span>
              </button>
            </div>

        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-center text-[10px] font-bold text-slate-400">
          <div className="space-y-1">
            <Cloud className="w-5 h-5 mx-auto text-indigo-500/80" />
            <span>ซิงค์แยกคลาวด์ส่วนตัว</span>
          </div>
          <div className="space-y-1">
            <Eye className="w-5 h-5 mx-auto text-indigo-500/80" />
            <span>โหมดถนอมสายตา</span>
          </div>
          <div className="space-y-1">
            <ShieldCheck className="w-5 h-5 mx-auto text-indigo-500/80" />
            <span>ปลอดภัยระดับบุคคล</span>
          </div>
        </div>
      </div>
    );
  }

  // Render Logged-In Application Core
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} pb-28`}>
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
