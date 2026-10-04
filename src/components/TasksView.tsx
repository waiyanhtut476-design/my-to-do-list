import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { 
  Check, 
  Trash2, 
  Clock, 
  Folder, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  X, 
  ArrowUpDown, 
  Edit3, 
  Share2, 
  Sparkles,
  CalendarPlus,
  Pin,
  Repeat,
  Tag
} from 'lucide-react';
import { getDaysLeftInfo } from '../i18n/translations';
import confetti from 'canvas-confetti';

export const TasksView: React.FC = () => {
  const { tasks, updateTask, deleteTask, openEditTask, language, t } = useApp();
  const [filter, setFilter] = useState<'all' | 'high' | 'project' | 'personal' | 'completed'>('all');
  const [showCompletedSection, setShowCompletedSection] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueSoonest' | 'priority' | 'alphabetical' | 'newest'>('dueSoonest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeSnoozeId, setActiveSnoozeId] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  const snoozeRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Grouped tasks calculation
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Total counts & Completion Percentage
  const totalCount = tasks.length;
  const completedCount = completedTasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Trigger celebration confetti when 100% is reached
  const prevCompletionRef = useRef(completionRate);
  useEffect(() => {
    if (totalCount > 0 && completionRate === 100 && prevCompletionRef.current < 100) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
    prevCompletionRef.current = completionRate;
  }, [completionRate, totalCount]);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (snoozeRef.current && !snoozeRef.current.contains(e.target as Node)) {
        setActiveSnoozeId(null);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Filter & Search
  let filteredPending = pendingTasks.filter(t => {
    if (filter === 'high' && t.priority !== 'high') return false;
    if (filter === 'project' && t.categoryId !== 'project') return false;
    if (filter === 'personal' && t.categoryId !== 'personal') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      const matchTags = t.tags?.some(tag => tag.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchTags;
    }
    return true;
  });

  // Sort logic (Pinned tasks always float to top first)
  filteredPending = [...filteredPending].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortBy === 'dueSoonest') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'priority') {
      const pMap: Record<string, number> = { high: 3, medium: 2, normal: 1 };
      const diff = (pMap[b.priority] || 1) - (pMap[a.priority] || 1);
      if (diff !== 0) return diff;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    }
    if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'newest') {
      return (b.id || '').localeCompare(a.id || '');
    }
    return 0;
  });

  const handleToggleStatus = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: nextStatus });
  };

  const handleTogglePin = async (task: Task) => {
    await updateTask(task.id, { isPinned: !task.isPinned });
  };

  const handleDelete = (id: string) => {
    setTaskToDelete(id);
  };

  // Quick snooze / reschedule
  const handleQuickSnooze = async (task: Task, daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    await updateTask(task.id, { dueDate: `${yyyy}-${mm}-${dd}` });
    setActiveSnoozeId(null);
  };

  // Copy / Share Daily Agenda
  const handleShareSummary = () => {
    const todayStr = new Date().toLocaleDateString(language === 'th' ? 'th-TH' : language === 'my' ? 'my-MM' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    let summary = `📋 Clarity Flow - ${t('share_agenda')} (${todayStr})\n`;
    summary += `━━━━━━━━━━━━━━━━━━━━━\n`;
    summary += `📊 ${t('progress_summary')}: ${completionRate}% (${completedCount}/${totalCount} ${t('tasks_unit')})\n\n`;

    if (pendingTasks.length > 0) {
      summary += `🟡 ${t('pending_tasks')} (${pendingTasks.length}):\n`;
      pendingTasks.forEach((t, i) => {
        const pinTag = t.isPinned ? '📌 ' : '';
        const priorityTag = t.priority === 'high' ? '🔥' : t.priority === 'medium' ? '⚡' : '📝';
        const timeTag = t.dueTime ? ` [${t.dueTime}]` : '';
        summary += `${i + 1}. ${pinTag}${priorityTag} ${t.title}${timeTag}\n`;
      });
      summary += `\n`;
    }

    if (completedTasks.length > 0) {
      summary += `🟢 ${t('completed_tasks')} (${completedTasks.length}):\n`;
      completedTasks.forEach((t, i) => {
        summary += `${i + 1}. ✓ ${t.title}\n`;
      });
    }

    navigator.clipboard.writeText(summary);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  const getCategoryName = (catId?: string) => {
    switch (catId) {
      case 'work': return t('cat_work');
      case 'project': return t('cat_project');
      case 'personal': return t('cat_personal');
      case 'learning': return t('cat_learning');
      default: return t('cat_work');
    }
  };

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'high': return t('priority_high');
      case 'medium': return t('priority_medium');
      default: return t('priority_normal');
    }
  };

  return (
    <>
      <div className="space-y-4">
      
      {/* 1. Daily Progress Delight Card with Share Button */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between gap-4">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col gap-1.5 z-10 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {t('progress_summary')}
              </span>
              <span className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
            </div>

            {/* Quick Share / Export Button */}
            <button
              type="button"
              onClick={handleShareSummary}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[10px] font-bold transition-colors cursor-pointer"
              title={t('share_agenda')}
            >
              <Share2 className="w-3 h-3" />
              <span className="hidden sm:inline">{t('share_agenda')}</span>
            </button>
          </div>
          
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">
            {completionRate === 100 ? t('progress_done_100') : completionRate >= 75 ? t('progress_done_great') : t('progress_done_start')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {completionRate === 100 ? t('progress_desc_done') : t('progress_desc_ongoing')}
          </p>
          
          {/* Linear Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Circular Progress SVG Ring */}
        <div className="relative flex items-center justify-center shrink-0 w-20 h-20 ml-2">
          <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 72 72">
            <circle className="text-slate-100 dark:text-slate-800 fill-none" cx="36" cy="36" r="28" stroke="currentColor" strokeWidth="5.5"></circle>
            <circle 
              className="text-indigo-600 dark:text-indigo-400 fill-none transition-all duration-1000 ease-out" 
              cx="36" 
              cy="36" 
              r="28" 
              stroke="currentColor" 
              strokeWidth="5.5" 
              strokeDasharray="175.93" 
              strokeDashoffset={175.93 - (175.93 * completionRate) / 100}
              strokeLinecap="round"
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">{completionRate}%</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
              {completedCount}/{totalCount} {t('tasks_unit')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Search & Sort Bar */}
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1 flex items-center bg-white dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-800 px-3 py-1.5 shadow-2xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            placeholder={t('search_tasks_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 bg-transparent border-none p-0 focus:ring-0 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Sort Trigger */}
        <div ref={sortRef} className="relative">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-850 rounded-xl border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
              isSortOpen 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20' 
                : 'border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
            title={t('sort_by')}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">{t('sort_by')}</span>
          </button>

          {/* Sort Dropdown */}
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 p-1.5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-2xl z-30 space-y-0.5 animate-in fade-in zoom-in-95">
              {[
                { id: 'dueSoonest', label: t('sort_due_date') },
                { id: 'priority', label: t('sort_priority') },
                { id: 'alphabetical', label: t('sort_alphabetical') },
                { id: 'newest', label: t('sort_newest') }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSortBy(s.id as any);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    sortBy === s.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{s.label}</span>
                  {sortBy === s.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Horizontal Scrollable Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {[
          { id: 'all', label: t('filter_all'), badge: tasks.length },
          { id: 'high', label: t('filter_urgent'), badge: tasks.filter(t => t.priority === 'high' && t.status === 'pending').length, badgeColor: 'text-red-500' },
          { id: 'project', label: t('filter_project'), badge: tasks.filter(t => t.categoryId === 'project' && t.status === 'pending').length },
          { id: 'personal', label: t('filter_personal'), badge: tasks.filter(t => t.categoryId === 'personal' && t.status === 'pending').length },
          { id: 'completed', label: t('filter_completed'), badge: completedCount, badgeColor: 'text-emerald-500' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as any)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs shadow-xs transition-all cursor-pointer ${
              filter === item.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{item.label}</span>
            <span className={`text-[10px] font-extrabold ${item.badgeColor || (filter === item.id ? 'text-indigo-200' : 'text-slate-400')}`}>
              ({item.badge})
            </span>
          </button>
        ))}
      </div>

      {/* 4. Active Tasks Section */}
      {filter !== 'completed' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {t('pending_tasks')}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
                {filteredPending.length} {t('pending_badge')}
              </span>
            </div>
          </div>

          {/* Pending tasks list */}
          {filteredPending.length === 0 ? (
            <div className="bg-white dark:bg-slate-850 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800/80">
              <span className="text-2xl block mb-2">🎈</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-300">
                {searchQuery ? t('no_search_results') : t('no_pending')}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{t('no_pending_sub')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPending.map((task) => {
                const isHigh = task.priority === 'high';
                const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                const completedSubCount = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0;
                const subProgressPct = hasSubtasks ? Math.round((completedSubCount / task.subtasks.length) * 100) : 0;
                const daysInfo = getDaysLeftInfo(task.dueDate, task.dueTime, language);
                const isSnoozeOpen = activeSnoozeId === task.id;

                return (
                  <article 
                    key={task.id}
                    className={`group relative bg-white dark:bg-slate-850 rounded-2xl p-4 shadow-sm border transition-all flex flex-col gap-3 active:scale-[0.99] ${
                      task.isPinned 
                        ? 'border-amber-300/80 dark:border-amber-600/50 bg-gradient-to-br from-amber-50/20 via-white to-white dark:from-amber-950/10 dark:via-slate-850 dark:to-slate-850 ring-1 ring-amber-400/20' 
                        : 'border-slate-100 dark:border-slate-800/80 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Circle checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(task);
                        }}
                        className="group/check mt-1 w-5.5 h-5.5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer"
                        title={t('mark_completed')}
                      >
                        <Check className="w-3 h-3 text-transparent group-hover/check:text-indigo-500 transition-colors" />
                      </button>

                      {/* Content details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            {task.isPinned && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Pin className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                                <span>PINNED</span>
                              </span>
                            )}

                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              isHigh 
                                ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' 
                                : task.priority === 'medium' 
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' 
                                  : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                            }`}>
                              {getPriorityLabel(task.priority)}
                            </span>

                            {task.recurrence && task.recurrence !== 'none' && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                <Repeat className="w-2.5 h-2.5" />
                                <span>{task.recurrence}</span>
                              </span>
                            )}
                          </div>

                          {/* Days Left and Time Badges */}
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {daysInfo ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${daysInfo.badgeClass}`}>
                                <Clock className={`w-3 h-3 ${daysInfo.iconColorClass}`} />
                                <span>{daysInfo.badgeText}</span>
                              </span>
                            ) : null}

                            {task.dueTime ? (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                {task.dueTime} {t('time_unit')}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Click title to edit */}
                        <div 
                          onClick={() => openEditTask(task)} 
                          className="cursor-pointer group/title"
                          title={t('edit')}
                        >
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Custom Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {task.tags.map((tg, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="inline-flex items-center text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded-md"
                              >
                                {tg}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Interactive Subtasks mini bar with Visual Progress */}
                        {hasSubtasks && (
                          <div className="mt-3 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mb-1.5">
                              <span className="uppercase tracking-wider">{t('subtasks_title')}</span>
                              <span>{completedSubCount}/{task.subtasks.length} ({subProgressPct}%)</span>
                            </div>

                            {/* Subtask Linear Progress Bar */}
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mb-2 overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${subProgressPct}%` }}
                              ></div>
                            </div>

                            <div className="space-y-1.5">
                              {task.subtasks.map((sub, sIdx) => (
                                <label 
                                  key={sIdx} 
                                  className="flex items-center gap-2 text-[10px] cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedSub = [...task.subtasks];
                                    updatedSub[sIdx].completed = !updatedSub[sIdx].completed;
                                    updateTask(task.id, { subtasks: updatedSub });
                                  }}
                                >
                                  <input 
                                    type="checkbox" 
                                    checked={sub.completed}
                                    readOnly
                                    className="w-3 h-3 text-indigo-600 rounded bg-transparent border-slate-300 cursor-pointer focus:ring-0" 
                                  />
                                  <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300 font-medium'}>
                                    {sub.title}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Card bottom actions bar */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 text-[10px] font-semibold border border-slate-100 dark:border-slate-800">
                              <Folder className="w-3 h-3" />
                              {getCategoryName(task.categoryId)}
                            </span>

                            {daysInfo && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 text-[10px] font-semibold border border-slate-100 dark:border-slate-800">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{daysInfo.dateLabel}</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Actions: Pin, Snooze, Edit, Delete */}
                          <div className="flex items-center gap-0.5">
                            {/* Pin Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePin(task);
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                task.isPinned 
                                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
                                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={task.isPinned ? t('unpin_task') : t('pin_task')}
                            >
                              <Pin className={`w-3.5 h-3.5 ${task.isPinned ? 'fill-amber-500' : ''}`} />
                            </button>

                            {/* Quick Snooze Popover */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSnoozeId(isSnoozeOpen ? null : task.id);
                                }}
                                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title={t('quick_snooze')}
                              >
                                <CalendarPlus className="w-3.5 h-3.5" />
                              </button>

                              {isSnoozeOpen && (
                                <div 
                                  ref={snoozeRef}
                                  className="absolute right-0 bottom-full mb-1.5 w-44 p-1 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 shadow-xl z-20 space-y-0.5 animate-in fade-in zoom-in-95"
                                >
                                  <div className="px-2 py-1 text-[9px] font-extrabold uppercase text-slate-400">
                                    {t('quick_snooze')}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickSnooze(task, 1)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    {t('snooze_tomorrow')}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickSnooze(task, 3)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    {t('snooze_3days')}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleQuickSnooze(task, 7)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                  >
                                    {t('snooze_next_week')}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditTask(task);
                              }}
                              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title={t('edit')}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(task.id);
                              }}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title={t('delete')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Completed Tasks Section */}
      {(filter === 'all' || filter === 'completed') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-500 dark:text-slate-400">
                {t('completed_tasks')}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {completedCount} {t('tasks_unit')}
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => setShowCompletedSection(!showCompletedSection)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showCompletedSection ? t('hide') : t('show')}</span>
              {showCompletedSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Completed cards list */}
          {showCompletedSection && (
            completedTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span>{t('completed_history_empty')}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {completedTasks.map((task) => {
                  const daysInfo = getDaysLeftInfo(task.dueDate, task.dueTime, language);

                  return (
                    <div 
                      key={task.id} 
                      className="completed-card relative bg-white/70 dark:bg-slate-850/50 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 opacity-80 hover:opacity-100 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(task)}
                          className="w-5.5 h-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs active:scale-90 cursor-pointer"
                          title={t('mark_uncompleted')}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-slate-500 dark:text-slate-500 line-through truncate">
                            {task.title}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                            <span>{t('completed_tasks')} • {getCategoryName(task.categoryId)}</span>
                            {daysInfo && (
                              <span>• {daysInfo.dateLabel}</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      )}

    </div>

      {/* Copy Summary Toast */}
      {copiedToast && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-[110] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{t('copied_summary')}</span>
        </div>
      )}

      {/* Custom Confirmation Modal for Deletion */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl max-w-xs w-full border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {t('delete_confirm_title')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('delete_confirm_desc')}
              </p>
            </div>
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (taskToDelete) {
                    await deleteTask(taskToDelete);
                    setTaskToDelete(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
