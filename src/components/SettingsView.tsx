import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Cloud, Trash2, ShieldAlert, Moon, Play, Lightbulb, Check, HelpCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, logout, user } = useApp();
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
    showToast('บันทึกการเปลี่ยนแปลงแล้ว');
  };

  const handleReset = async () => {
    await updateSettings({
      darkMode: false,
      notificationsEnabled: true,
      dndEnabled: false,
      dndStartTime: '22:00',
      dndEndTime: '07:00',
      earlyReminderMinutes: 30,
      urgentReminderRepeat: true
    });
    showToast('รีเซ็ตเป็นค่าเริ่มต้นเรียบร้อย');
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Settings Sub-header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">ตั้งค่าแอปพลิเคชัน</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">จัดการการซิงค์ รูปลักษณ์ และการแจ้งเตือน</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100/50">
            <Cloud className="w-3.5 h-3.5" />
            <span>บันทึกแล้ว</span>
          </span>
          <button 
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            รีเซ็ต
          </button>
        </div>
      </div>

      {/* Master Switch Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Bell className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">อนุญาตการแจ้งเตือนทั้งหมด</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                รับการแจ้งเตือนสำคัญเกี่ยวกับงาน นัดหมาย และสรุปภารกิจประจำวัน
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

      {/* Dark Mode Switch Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Moon className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">เปิดโหมดมืด (Dark Mode)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                เปลี่ยนหน้าจอเป็นสีมืดเพื่อความสบายตาในการเคลียร์งานตอนกลางคืน
              </span>
            </div>
          </div>
          {/* iOS toggle */}
          <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none mt-1">
            <input 
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => handleToggle('darkMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
          </label>
        </div>
      </div>

      {/* Advance Reminders Settings */}
      <div className="space-y-2.5">
        <div className="flex flex-col px-0.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">เวลาเตือนล่วงหน้าเริ่มต้น</span>
          <span className="text-[11px] text-slate-400">กำหนดเวลาเตือนก่อนถึงกำหนดส่งงานหรือเริ่มนัดหมาย</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          
          {/* Urgent tasks reminders advance */}
          <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-100/50 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">งานด่วน / ความสำคัญสูง</span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[9px] font-bold">สำคัญมาก</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '15 นาที', mins: 15 },
                { label: '30 นาที', mins: 30 },
                { label: '1 ชม.', mins: 60 },
                { label: '1 วัน', mins: 1440 }
              ].map((chip) => {
                const isActive = settings.earlyReminderMinutes === chip.mins;
                return (
                  <button
                    key={chip.mins}
                    type="button"
                    onClick={() => handleToggle('earlyReminderMinutes', chip.mins)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
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
              <span className="text-[11px] font-semibold text-slate-500">เตือนซ้ำก่อนครบกำหนด 10 นาที</span>
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
            <span className="font-bold text-slate-700 dark:text-slate-300">งานทั่วไป (General Tasks)</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">เตือนก่อน 30 นาที</span>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

          {/* Item: Meeting integrations */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">แนบลิงก์การประชุม Meet อัตโนมัติ</span>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-3.5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Do Not Disturb Focus Schedule */}
      <div className="space-y-2.5">
        <div className="flex flex-col px-0.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">โหมดโฟกัส & พักผ่อน (Do Not Disturb)</span>
          <span className="text-[11px] text-slate-400">ปิดเสียงเตือนอัตโนมัติเพื่อให้คุณมีสมาธิและหลับสนิท</span>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-850 p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-start justify-between text-xs">
            <div className="flex flex-col">
              <span className="font-bold text-slate-700 dark:text-slate-300">กำหนดช่วงเวลาอัตโนมัติ</span>
              <span className="text-[10px] text-slate-400 mt-0.5">ปิดเสียงรบกวนตามตารางการนอนและทำงาน</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
              <input 
                type="checkbox"
                checked={settings.dndEnabled}
                onChange={(e) => handleToggle('dndEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Schedule range preview pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <Moon className="w-5 h-5 text-indigo-500" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">22:00 น. — 07:00 น.</span>
                <span className="text-[10px] text-slate-400">ทุกวัน (จันทร์ - อาทิตย์)</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => {
                alert('ฟีเจอร์ปรับแต่งเวลา DND แนะนำให้อิงการจำลอง 22:00 น. - 07:00 น. บนเดโมนี้เพื่อการทำงานแบบเรียลไทม์ที่สอดคล้องกัน!');
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 font-bold text-[10px] text-indigo-600 dark:text-indigo-400 border border-slate-200/50 shadow-xs"
            >
              แก้ไข
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1 text-red-500 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>ยกเว้นการแจ้งเตือนสำหรับงานด่วนมาก</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-3.5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Cloud Sync & Account details */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
        <span className="font-extrabold text-slate-700 dark:text-slate-300 block">บัญชีผู้ใช้และระบบคลาวด์ซิงค์</span>
        <p className="text-slate-500 dark:text-slate-400">
          บัญชีปัจจุบัน: <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
        </p>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          ข้อมูลรายการงาน การตั้งค่า และตารางกิจกรรมของคุณจะถูกซิงค์ข้อมูลแยกเป็นส่วนตัวบนคลาวด์แบบเรียลไทม์ ปลอดภัยและเรียกดูได้จากทุกอุปกรณ์
        </p>
        <button
          type="button"
          onClick={logout}
          className="text-red-500 hover:text-red-600 font-bold pt-1 cursor-pointer text-left block"
        >
          ออกจากระบบบัญชีส่วนตัว
        </button>
      </div>

      {/* iOS Safari Add to Home Screen Guide Card */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-3">
        <div className="flex items-center gap-3">
          <img 
            src="./apple-touch-icon.png" 
            alt="Clarity Flow Icon" 
            className="w-12 h-12 rounded-xl object-cover shadow-md border border-slate-100 dark:border-slate-850"
          />
          <div className="min-w-0">
            <span className="font-extrabold text-slate-800 dark:text-white block">ติดตั้งแอปบนหน้าจอโฮม iPhone</span>
            <span className="text-[10px] text-slate-400">ใช้เสมือนแอปพลิเคชันปกติ (Add to Home Screen)</span>
          </div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 border border-slate-100 dark:border-slate-700/50">
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
            ขั้นตอนการดาวน์โหลดติดตั้งใน 2 คลิกผ่าน Safari:
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-[10px] text-slate-500 dark:text-slate-400">
            <li>กดปุ่ม <span className="font-bold text-indigo-600 dark:text-indigo-400">แชร์ (Share)</span> ในแถบเครื่องมือด้านล่างของ Safari</li>
            <li>เลื่อนลงและแตะเลือก <span className="font-bold text-indigo-600 dark:text-indigo-400">"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</span></li>
          </ol>
        </div>
      </div>

      {/* Educational Delight Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50/50 via-slate-50 to-indigo-100/20 dark:from-slate-800 dark:to-slate-800/20 p-4 border border-indigo-100/20 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">เคล็ดลับการทำงานอย่างราบรื่น</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              ผลวิจัยพบว่าการตั้งเตือนล่วงหน้า 30 นาทีสำหรับงานด่วน ช่วยลดโอกาสส่งงานล่าช้าลงได้ถึง 40% และช่วยให้สมองพร้อมสำหรับการสลับบริบทการทำงาน
            </p>
          </div>
        </div>
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
