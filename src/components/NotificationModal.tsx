import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Check, CheckSquare, Clock, BellOff, Award, Edit, Users, Eye } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    updateTask,
    tasks,
    language,
    t
  } = useApp();
  
  const [filter, setFilter] = useState<'all' | 'urgent' | 'meetings' | 'team'>('all');

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return n.title.includes('ด่วน') || n.title.includes('กำหนด') || n.title.includes('Urgent') || n.title.includes('Due') || n.title.includes('အရေးကြီး');
    if (filter === 'meetings') return n.type === 'reminder' && (n.title.includes('ประชุม') || n.body.includes('Meet') || n.title.includes('Meeting') || n.title.includes('အစည်းအဝေး'));
    if (filter === 'team') return n.type === 'assignment';
    return true;
  });

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex flex-col h-screen overflow-hidden animate-slide-up">
      {/* Header Context */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/80 px-4 py-3.5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 transition-transform shrink-0 cursor-pointer"
              title={t('back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {t('notif_modal_title')}
                </h1>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-600 text-white font-semibold text-[10px] shadow-sm animate-pulse">
                    {unreadCount} {t('unread_badge')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {t('notif_modal_desc')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handleMarkAllRead}
              className="h-9 px-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center gap-1 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{t('mark_all_read')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pt-20 pb-24 max-w-md mx-auto w-full no-scrollbar space-y-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-2 no-scrollbar">
          {[
            { id: 'all', label: t('notif_filter_all'), badge: notifications.length },
            { id: 'urgent', label: t('notif_filter_urgent'), badge: notifications.filter(n => n.title.includes('ด่วน') || n.title.includes('กำหนด') || n.title.includes('Urgent') || n.title.includes('အရေးကြီး')).length },
            { id: 'meetings', label: t('notif_filter_meeting'), badge: notifications.filter(n => n.type === 'reminder' && (n.title.includes('ประชุม') || n.body.includes('Meet') || n.title.includes('Meeting') || n.title.includes('အစည်းအဝေး'))).length },
            { id: 'team', label: t('notif_filter_team'), badge: notifications.filter(n => n.type === 'assignment').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
            <p className="text-sm font-bold text-slate-800 dark:text-slate-300">
              {t('no_notifications')}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {t('no_notifications_sub')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((notif) => {
              const isUnread = !notif.read;
              const isUrgent = notif.title.includes('ด่วน') || notif.title.includes('สำคัญ') || notif.title.includes('กำหนด') || notif.title.includes('Urgent') || notif.title.includes('အရေးကြီး');

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
                      ) : notif.body.includes('สำเร็จ') || notif.body.includes('Completed') || notif.body.includes('ပြီးစီး') ? (
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
                          {isUrgent ? t('priority_high') : notif.type === 'assignment' ? (language === 'my' ? '👥 အလုပ်တာဝန်' : language === 'en' ? '👥 Task Assignment' : '👥 มอบหมายงาน') : '🔔 Alert'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {notif.createdAt instanceof Date ? notif.createdAt.toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : (language === 'my' ? 'ယခု' : language === 'en' ? 'Just now' : 'สักครู่')}
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
                              const highTask = tasks.find(t => t.priority === 'high' && t.status === 'pending');
                              if (highTask) {
                                updateTask(highTask.id, { status: 'completed' });
                              }
                              handleMarkAsRead(notif.id);
                            }}
                            className="flex-1 sm:flex-initial h-8 px-3.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('completed_tasks')}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notif.id);
                            }}
                            className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{t('snooze')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
