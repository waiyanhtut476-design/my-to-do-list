import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ChevronLeft, ChevronRight, Check, Video, RefreshCw, Plus } from 'lucide-react';
import { Task } from '../types';
import { MONTH_NAMES, WEEKDAY_HEADERS, formatLocalizedDate, getDaysLeftInfo } from '../i18n/translations';

export const CalendarView: React.FC = () => {
  const { tasks, updateTask, openEditTask, setIsTaskModalOpen, language, t } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');

  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());

  const currentMonthsList = MONTH_NAMES[language] || MONTH_NAMES['th'];
  const weekdayHeaders = WEEKDAY_HEADERS[language] || WEEKDAY_HEADERS['th'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Helper to format due date comparisons
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(t => t.dueDate === dateStr);
  };

  // Filter tasks for the selected date
  const selectedDayTasks = getTasksForDate(selectedDate);
  const selectedDayCompletionRate = selectedDayTasks.length > 0
    ? Math.round((selectedDayTasks.filter(t => t.status === 'completed').length / selectedDayTasks.length) * 100)
    : 0;

  // Generate real calendar days based on currentYear and currentMonth state
  const getCalendarCells = () => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells = [];

    // 1. Fill leading days from the previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = prevMonthDays - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      cells.push({
        date: dateStr,
        label: String(prevDay),
        hasUrgent: dayTasks.some(t => t.priority === 'high' && t.status === 'pending'),
        hasNormal: dayTasks.some(t => t.priority !== 'high' && t.status === 'pending'),
        hasCompleted: dayTasks.some(t => t.status === 'completed'),
        isCurrentMonth: false
      });
    }

    // 2. Fill days of the current month
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      cells.push({
        date: dateStr,
        label: String(i),
        hasUrgent: dayTasks.some(t => t.priority === 'high' && t.status === 'pending'),
        hasNormal: dayTasks.some(t => t.priority !== 'high' && t.status === 'pending'),
        hasCompleted: dayTasks.some(t => t.status === 'completed'),
        isCurrentMonth: true
      });
    }

    // 3. Fill trailing days from the next month to complete the grid (usually up to 35 or 42 cells)
    const totalGridSize = cells.length > 35 ? 42 : 35;
    const remainingDays = totalGridSize - cells.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      cells.push({
        date: dateStr,
        label: String(i),
        hasUrgent: dayTasks.some(t => t.priority === 'high' && t.status === 'pending'),
        hasNormal: dayTasks.some(t => t.priority !== 'high' && t.status === 'pending'),
        hasCompleted: dayTasks.some(t => t.status === 'completed'),
        isCurrentMonth: false
      });
    }

    return cells;
  };

  const calendarCells = getCalendarCells();

  const handleToggleTaskStatus = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: nextStatus });
  };

  const displayedYear = language === 'th' ? currentYear + 543 : currentYear;

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
      case 'high': return t('priority_high_label');
      case 'medium': return t('priority_medium_label');
      default: return t('priority_normal_label');
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Selector Widget */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {currentMonthsList[currentMonth]} {displayedYear}
            </h2>
            <div className="flex items-center">
              <button 
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs active:scale-95 transition-all flex items-center gap-1 shadow-xs border border-indigo-100/50 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('calendar_today')}</span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {(['month', 'week', 'agenda'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-1.5 rounded-lg font-semibold text-xs text-center transition-all cursor-pointer ${
                viewMode === mode 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {mode === 'month' ? t('view_month') : mode === 'week' ? t('view_week') : t('view_agenda')}
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Calendar Matrix Card */}
      <section className="bg-white dark:bg-slate-850 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
        {/* Day Header names */}
        <div className="grid grid-cols-7 text-center font-bold text-xs text-slate-400 dark:text-slate-500">
          {weekdayHeaders.map((head, i) => (
            <span key={i} className={i === 0 ? 'text-red-500' : i === 5 ? 'text-indigo-600 dark:text-indigo-400' : ''}>
              {head}
            </span>
          ))}
        </div>

        {/* Calendar cells grid */}
        <div className="grid grid-cols-7 gap-y-2 text-center items-center">
          {calendarCells.map((cell) => {
            const isSelected = selectedDate === cell.date;
            return (
              <button
                key={cell.date}
                type="button"
                onClick={() => setSelectedDate(cell.date)}
                className={`flex flex-col items-center justify-center py-2 rounded-xl transition-all relative cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/35 scale-105 font-bold z-10'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                } ${!cell.isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <span className="text-xs leading-none">{cell.label}</span>
                {/* Dot Indicators */}
                <div className="flex gap-0.5 mt-1.5 h-1 justify-center">
                  {cell.hasUrgent && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-red-300' : 'bg-red-500'}`}></span>}
                  {cell.hasNormal && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-indigo-200' : 'bg-indigo-500'}`}></span>}
                  {cell.hasCompleted && <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`}></span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend Panel */}
        <div className="flex items-center justify-center gap-4 pt-2.5 mt-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl py-1.5 px-3 border border-slate-100/50 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>{t('calendar_legend_urgent')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>{t('calendar_legend_normal')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t('calendar_legend_completed')}</span>
          </div>
        </div>
      </section>

      {/* Google Calendar Sync status bar */}
      <section className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-xs shrink-0">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
            {t('gcal_connected')}
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {t('gcal_updated')}
        </span>
      </section>

      {/* Selected Day Header Details */}
      <section className="flex items-center justify-between bg-indigo-50/50 dark:bg-slate-800/20 px-4 py-3 rounded-2xl border border-indigo-100/10">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {formatLocalizedDate(selectedDate, language)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">
            {selectedDayTasks.length} {t('daily_tasks_count')}
          </span>
        </div>
        {selectedDayTasks.length > 0 && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full shadow-xs border border-slate-100 dark:border-slate-700">
            <span className="text-[10px] font-extrabold text-emerald-600">{selectedDayCompletionRate}%</span>
            <div className="w-10 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedDayCompletionRate}%` }}></div>
            </div>
          </div>
        )}
      </section>

      {/* Daily Hourly Schedule Timeline */}
      <section className="relative pl-2.5">
        {/* Timeline Guide Line */}
        <div className="absolute left-[39px] top-4 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>

        {selectedDayTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 font-semibold space-y-1">
            <p>{t('no_schedule_today')}</p>
            <p className="text-[11px] text-slate-400">{t('no_schedule_sub')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDayTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const isHigh = task.priority === 'high';
              const isMedium = task.priority === 'medium';

              return (
                <div key={task.id} className="flex items-start gap-3 py-1.5 relative z-10">
                  {/* Time label */}
                  <div className="w-12 shrink-0 text-right pt-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {task.dueTime ? `${task.dueTime} ${t('time_unit')}`.trim() : t('all_day_label')}
                    </span>
                  </div>

                  {/* Node Icon */}
                  <button 
                    onClick={() => handleToggleTaskStatus(task)}
                    className={`relative z-10 mt-2.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white shadow-xs' 
                        : isHigh 
                          ? 'bg-red-500 text-white shadow-xs'
                          : isMedium 
                            ? 'bg-amber-400 text-white shadow-xs'
                            : 'bg-indigo-100 dark:bg-slate-700 text-indigo-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </button>

                  {/* Task Card Box */}
                  <div className="flex-1 bg-white dark:bg-slate-850 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        onClick={() => openEditTask(task)} 
                        className="flex flex-col min-w-0 cursor-pointer group/item"
                        title={t('edit')}
                      >
                        <span className={`font-bold text-sm transition-colors ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400'}`}>
                          {task.title}
                        </span>
                        
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                            {getCategoryName(task.categoryId)}
                          </span>
                          {task.dueTime && (
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {task.dueTime} {t('time_unit')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Urgency and Days Left Badge */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        {(() => {
                          const daysInfo = getDaysLeftInfo(task.dueDate, task.dueTime, language);
                          if (!daysInfo) return null;
                          return (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow-2xs ${daysInfo.badgeClass}`}>
                              {daysInfo.badgeText}
                            </span>
                          );
                        })()}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                          isCompleted 
                            ? 'bg-slate-100 text-slate-500' 
                            : isHigh 
                              ? 'bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400' 
                              : isMedium 
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                        }`}>
                          {isCompleted ? t('completed_tasks') : getPriorityLabel(task.priority)}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Subtask list mini preview */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex justify-between">
                          <span>{t('subtasks_title')}</span>
                          <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} {t('subtasks_done_suffix')}</span>
                        </div>
                        <div className="space-y-1">
                          {task.subtasks.map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-1.5 text-[10px]">
                              <Check className={`w-3 h-3 ${sub.completed ? 'text-emerald-500' : 'text-slate-300'}`} />
                              <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-600 dark:text-slate-300 font-medium'}>
                                {sub.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Action Banner */}
      <section className="bg-gradient-to-r from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-slate-800/40 rounded-2xl p-4 flex items-center justify-between border border-slate-200/40 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
              {language === 'my' ? 'အလုပ်သစ် ထည့်သွင်းပါ' : language === 'en' ? 'Add New Task' : 'สร้างงานและนัดหมายใหม่'}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              {language === 'my' ? 'Cloud ပေါ်တွင် သိမ်းဆည်းမည်' : language === 'en' ? 'Synced to your cloud' : 'จัดตารางทันทีบนคลาวด์'}
            </span>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          {t('create_task_button')}
        </button>
      </section>
    </div>
  );
};
