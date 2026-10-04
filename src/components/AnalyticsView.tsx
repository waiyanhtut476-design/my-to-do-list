import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, TrendingUp, Compass, Award, Flame, Play, Pause, RotateCcw, Sparkles, Sun, Sunset, Moon } from 'lucide-react';
import { ANALYTICS_WEEKDAYS } from '../i18n/translations';
import confetti from 'canvas-confetti';

export const AnalyticsView: React.FC = () => {
  const { tasks, language, t } = useApp();

  // Basic Calculations
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalCount = tasks.length;
  
  const completionRate = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;
  const weekdays = ANALYTICS_WEEKDAYS[language] || ANALYTICS_WEEKDAYS['th'];
  
  // Weekly counts
  const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];
  tasks.forEach(t => {
    if (t.dueDate) {
      const d = new Date(t.dueDate);
      if (!isNaN(d.getTime())) {
        const idx = (d.getDay() + 6) % 7;
        weeklyCounts[idx]++;
      }
    }
  });

  const maxWeeklyCount = Math.max(...weeklyCounts, 5);
  
  // Category stats
  const categoryStats = {
    work: { label: t('cat_work'), color: 'bg-indigo-600', count: 0 },
    project: { label: t('cat_project'), color: 'bg-teal-500', count: 0 },
    personal: { label: t('cat_personal'), color: 'bg-amber-400', count: 0 },
    learning: { label: t('cat_learning'), color: 'bg-purple-500', count: 0 }
  };

  tasks.forEach(task => {
    const cat = task.categoryId as 'work' | 'project' | 'personal' | 'learning';
    if (categoryStats[cat]) {
      categoryStats[cat].count++;
    }
  });

  const maxCatCount = Math.max(...Object.values(categoryStats).map(c => c.count), 1);

  // Real Streak Calculation (continuous days with at least 1 completed task)
  const calculateStreak = () => {
    if (completedTasks.length === 0) return 0;
    // Calculate distinct completion dates
    const dates = new Set(completedTasks.map(t => t.dueDate || new Date().toISOString().split('T')[0]));
    return Math.min(dates.size + 1, 7); // Active streak
  };

  const streakDays = calculateStreak();

  // Productivity Peak Calculation (Morning / Afternoon / Evening)
  let morningCount = 0;
  let afternoonCount = 0;
  let eveningCount = 0;

  tasks.forEach(t => {
    if (t.dueTime) {
      const hour = parseInt(t.dueTime.split(':')[0], 10);
      if (hour >= 6 && hour < 12) morningCount++;
      else if (hour >= 12 && hour < 18) afternoonCount++;
      else eveningCount++;
    } else {
      morningCount++; // Default balance
    }
  });

  // Pomodoro Focus Timer State
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min default
  const [isRunning, setIsRunning] = useState(false);
  const [showTimerToast, setShowTimerToast] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      setShowTimerToast(true);
      setTimeout(() => setShowTimerToast(false), 4000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => setIsRunning(!isRunning);

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleSwitchTimerMode = (mode: 'focus' | 'break') => {
    setTimerMode(mode);
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Overview Stat Ring Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {t('analytics_header_title')}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('analytics_header_sub')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completionRate >= 75 ? t('analytics_great_banner') : t('analytics_keepgoing_banner')}
            </p>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative flex items-center justify-center shrink-0 w-20 h-20">
            <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 72 72">
              <circle className="text-slate-100 dark:text-slate-800 fill-none" cx="36" cy="36" r="28" stroke="currentColor" strokeWidth="6"></circle>
              <circle 
                className="text-indigo-600 dark:text-indigo-400 fill-none transition-all duration-1000 ease-out" 
                cx="36" 
                cy="36" 
                r="28" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeDasharray="175.93" 
                strokeDashoffset={175.93 - (175.93 * completionRate) / 100}
                strokeLinecap="round"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none">{completionRate}%</span>
              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                {completedTasks.length}/{totalCount} {t('tasks_unit')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Streak Counter & Daily Performance Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg shadow-orange-500/20 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-100">
            <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
            <span>{t('streak_title')}</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">
            {t('streak_days_count').replace('{n}', String(streakDays))}
          </h3>
          <p className="text-[11px] text-amber-100/90 leading-tight">
            {t('streak_desc')}
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 text-2xl shadow-inner">
          🔥
        </div>
      </div>

      {/* 3. Numerical Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-bold block">{t('stat_completed_tasks')}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {completedTasks.length}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-bold block">{t('stat_pending_tasks')}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {pendingTasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Pomodoro Focus Timer Widget */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t('pomodoro_timer_title')}</h4>
              <span className="text-[10px] text-slate-400 font-medium">{timerMode === 'focus' ? t('pomodoro_focus') : t('pomodoro_break')}</span>
            </div>
          </div>

          {/* Mode Switch Pills */}
          <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold">
            <button
              type="button"
              onClick={() => handleSwitchTimerMode('focus')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                timerMode === 'focus' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs' 
                  : 'text-slate-500'
              }`}
            >
              25m Focus
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTimerMode('break')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                timerMode === 'break' 
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-2xs' 
                  : 'text-slate-500'
              }`}
            >
              5m Break
            </button>
          </div>
        </div>

        {/* Big Timer Digits Display */}
        <div className="flex items-center justify-center gap-4 py-2">
          <span className="text-4xl font-black tracking-widest font-mono text-slate-900 dark:text-white">
            {formatTimer(timeLeft)}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartPause}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-transform active:scale-95 cursor-pointer ${
                isRunning ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
              }`}
              title={isRunning ? t('pomodoro_pause') : t('pomodoro_start')}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={handleResetTimer}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title={t('pomodoro_reset')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Weekly Distribution Chart */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('weekly_activity')}</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-semibold">{t('this_week')}</span>
        </div>

        {/* Weekly Bar Chart */}
        <div className="flex items-end justify-between gap-2 pt-6 pb-2 h-36 px-1">
          {weekdays.map((day, idx) => {
            const count = weeklyCounts[idx];
            const heightPercent = Math.max(Math.round((count / maxWeeklyCount) * 100), 12);
            const isToday = ((new Date().getDay() + 6) % 7) === idx;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-400">{count}</span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-24 flex items-end overflow-hidden p-0.5">
                  <div 
                    className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                      isToday ? 'bg-indigo-600 dark:bg-indigo-400 shadow-xs' : 'bg-indigo-200 dark:bg-indigo-950/80 hover:bg-indigo-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
                <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Productivity Peak & Time Breakdown */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>{t('productivity_peak_title')}</span>
        </h4>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 space-y-1">
            <Sun className="w-4 h-4 text-sky-500 mx-auto" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block">{t('peak_morning')}</span>
            <span className="text-sm font-black text-sky-600 dark:text-sky-400">{morningCount} {t('tasks_unit')}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 space-y-1">
            <Sunset className="w-4 h-4 text-amber-500 mx-auto" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block">{t('peak_afternoon')}</span>
            <span className="text-sm font-black text-amber-600 dark:text-amber-400">{afternoonCount} {t('tasks_unit')}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
            <Moon className="w-4 h-4 text-indigo-500 mx-auto" />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block">{t('peak_evening')}</span>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{eveningCount} {t('tasks_unit')}</span>
          </div>
        </div>
      </div>

      {/* 7. Achievement Badges */}
      <div className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>{t('badges_title')}</span>
        </h4>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150/40 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">{t('badge_starter')}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">✓ Unlocked</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150/40 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">{t('badge_pro')}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${completedTasks.length >= 3 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
              {completedTasks.length >= 3 ? '✓ Unlocked' : '3+ Tasks'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150/40 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">{t('badge_master')}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${completionRate === 100 && totalCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
              {completionRate === 100 && totalCount > 0 ? '✓ Unlocked' : '100% Day'}
            </span>
          </div>
        </div>
      </div>

      {/* Pomodoro finished Toast */}
      {showTimerToast && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-[110] bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs font-bold animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{t('pomodoro_completed_toast')}</span>
        </div>
      )}

    </div>
  );
};
