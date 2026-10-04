import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Check, CheckSquare, Clock, BellOff, Award, Edit, Users, Eye, Trash2 } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onGoToSettings }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotification, 
    updateTask,
    tasks
  } = useApp();
  
  const [filter, setFilter] = useState<'all' | 'urgent' | 'meetings' | 'team'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return n.title.includes('ด่วน') || n.title.includes('กำหนด');
    if (filter === 'meetings') return n.type === 'reminder' && (n.title.includes('ประชุม') || n.body.includes('Meet'));
    if (filter === 'team') return n.type === 'assignment';
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await clearNotification(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex flex-col h-screen overflow-hidden animate-slide-up">
      {/* Header Context */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 px-4 py-3.5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 transition-transform shrink-0"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">การแจ้งเตือน</h1>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-600 text-white font-semibold text-[10px] shadow-sm animate-pulse">
                    {unreadCount} ใหม่
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">อัปเดตงาน นัดหมาย และความคืบหน้าทีม</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handleMarkAllRead}
              className="h-9 px-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 active:scale-95 transition-all text-xs font-semibold"
            >
              <CheckSquare className="w-4 h-4" />
              <span>อ่านทั้งหมด</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-24 max-w-md mx-auto w-full no-scrollbar space-y-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-2 no-scrollbar">
          {[
            { id: 'all', label: 'ทั้งหมด', badge: notifications.length },
            { id: 'urgent', label: 'งานใกล้ถึงกำหนด ⏰', badge: notifications.filter(n => n.title.includes('ด่วน') || n.title.includes('กำหนด')).length },
            { id: 'meetings', label: 'นัดหมาย & ประชุม 📅', badge: notifications.filter(n => n.type === 'reminder' && (n.title.includes('ประชุม') || n.body.includes('Meet'))).length },
            { id: 'team', label: 'อัปเดตทีม 👥', badge: notifications.filter(n => n.type === 'assignment').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full font-bold text-[10px] ${
                filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic List */}
        {filteredNotifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-3">
              <Eye className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-300">ไม่มีการแจ้งเตือน</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">กล่องข้อความสะอาดสะอ้าน สบายตา!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((notif) => {
              const isUnread = !notif.read;
              const isUrgent = notif.title.includes('ด่วน') || notif.title.includes('สำคัญ') || notif.title.includes('กำหนด');

              return (
                <article 
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`relative flex flex-col gap-3 p-4 rounded-xl transition-all cursor-pointer shadow-sm border ${
                    isUnread 
                      ? 'bg-white dark:bg-slate-850 border-indigo-100 dark:border-indigo-950/60' 
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon mapping */}
                    <div className="shrink-0">
                      {isUrgent ? (
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shadow-xs">
                          <BellOff className="w-5 h-5 animate-pulse" />
                        </div>
                      ) : notif.type === 'assignment' ? (
                        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
                          <Users className="w-5 h-5" />
                        </div>
                      ) : notif.body.includes('สำเร็จ') ? (
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                          <Award className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                          <Edit className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-500'
                        }`}>
                          {isUrgent ? '🔴 ด่วนมาก' : notif.type === 'assignment' ? '👥 มอบหมายงาน' : '🔔 แจ้งเตือน'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {notif.createdAt instanceof Date ? notif.createdAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'สักครู่'}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {notif.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {notif.body}
                      </p>

                      {/* Display custom button triggers depending on payload */}
                      {isUrgent && isUnread && (
                        <div className="flex items-center gap-2 mt-3 pt-1">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Find high priority task and complete it
                              const highTask = tasks.find(t => t.priority === 'high' && t.status === 'pending');
                              if (highTask) {
                                updateTask(highTask.id, { status: 'completed' });
                              }
                              handleMarkAsRead(notif.id);
                            }}
                            className="flex-1 sm:flex-initial h-8 px-3.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>เสร็จสิ้นแล้ว</span>
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert('จำลองการเลื่อนเวลาเตือนออกไปอีก 15 นาที');
                              handleMarkAsRead(notif.id);
                            }}
                            className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 hover:bg-slate-200 transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>เลื่อนเวลา</span>
                          </button>
                        </div>
                      )}

                      {/* Attendee indicators mock for meeting reminders */}
                      {notif.body.includes('Design') && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-1.5 overflow-hidden">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">ก</div>
                            <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">ธ</div>
                            <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900">พ</div>
                          </div>
                          <span className="text-[10px] text-slate-500">และผู้ประสานงานทีม</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleDelete(notif.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isUnread && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Settings Shortcut Banner */}
        <aside className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 flex items-start gap-3 mt-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BellOff className="w-4 h-4" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">โหมดโฟกัส & การแจ้งเตือนล่วงหน้า</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              ปิดเสียงชั่วคราว หรือกำหนดเวลาล่วงหน้าเพื่อหลีกเลี่ยงการถูกรบกวนยามค่ำคืน (Do Not Disturb)
            </p>
            <button 
              onClick={() => {
                onClose();
                onGoToSettings();
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-semibold mt-2 text-left"
            >
              ตั้งค่าการแจ้งเตือน &rarr;
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
