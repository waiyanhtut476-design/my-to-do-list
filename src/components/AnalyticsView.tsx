import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Clock, TrendingUp, Compass, Award } from 'lucide-react';
import { ANALYTICS_WEEKDAYS } from '../i18n/translations';

export const AnalyticsView: React.FC = () => {
  const { tasks, language, t } = useApp();

  // Basic Calculations
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const totalCount = tasks.length;
  
  const completionRate = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;

  const weekdays = ANALYTICS_WEEKDAYS[language] || ANALYTICS_WEEKDAYS['th'];
  
  // Real tasks distribution across current week
  const today = new Date();
  const currentDayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  
  // Count tasks by weekday
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
  
  // Calculate category distributions
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

  return (
    <div className="space-y-5">
      
      {/* Overview Stat Ring Card */}
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

      {/* Numerical Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {t('stat_completed')}
            </p>
            <p className="text-base font-extrabold text-slate-950 dark:text-white">
              {completedTasks.length} {t('tasks_unit')}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              {t('stat_pending')}
            </p>
            <p className="text-base font-extrabold text-slate-950 dark:text-white">
              {pendingTasks.length} {t('tasks_unit')}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Custom Bar Chart Widget */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t('chart_weekly_title')}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
            {t('chart_this_week')}
          </span>
        </div>

        {/* Visual Graph Grid */}
        <div className="h-40 flex items-end justify-between pt-6 px-1.5">
          {weekdays.map((day, idx) => {
            const count = weeklyCounts[idx];
            const percentHeight = Math.max(Math.round((count / maxWeeklyCount) * 100), count > 0 ? 16 : 8);
            const isToday = idx === currentDayOfWeek;

            return (
              <div key={idx} className="flex flex-col items-center flex-1 group relative">
                {/* Tooltip */}
                <span className="opacity-0 group-hover:opacity-100 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] px-2 py-0.5 rounded-lg absolute -translate-y-8 transition-opacity pointer-events-none font-bold shadow-md z-20 whitespace-nowrap">
                  {count} {t('tasks_unit')} {isToday ? `(${t('today_badge')})` : ''}
                </span>

                {/* Vertical Bar */}
                <div className="w-6 bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full relative flex items-end overflow-hidden">
                  <div 
                    style={{ height: `${percentHeight}%` }}
                    className={`w-full rounded-t-xl transition-all duration-700 ease-out origin-bottom ${
                      isToday 
                        ? 'bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-600/30' 
                        : count > 0 
                        ? 'bg-indigo-400/90 dark:bg-indigo-600/70' 
                        : 'bg-slate-200/70 dark:bg-slate-700/50'
                    }`}
                  ></div>
                </div>

                {/* Day label */}
                <span className={`text-[11px] font-bold mt-2 ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Info Legend */}
        <div className="flex justify-center items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></span>
            <span>{t('today_chart_legend')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-400/80 rounded-full"></span>
            <span>{t('past_chart_legend')}</span>
          </div>
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {t('category_dist_title')}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(categoryStats).map(([key, value]) => {
            const percentage = maxCatCount > 0 ? Math.round((value.count / totalCount) * 100) || 0 : 0;
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{value.label}</span>
                  <span className="text-slate-400 dark:text-slate-500">{value.count} {t('tasks_unit')} ({percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-1000 ${value.color}`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/40 dark:from-slate-800 dark:to-slate-800/20 p-5 border border-indigo-100/30 dark:border-slate-800 flex items-start gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Award className="w-5.5 h-5.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
            {t('recommendation_title')}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {t('recommendation_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};
