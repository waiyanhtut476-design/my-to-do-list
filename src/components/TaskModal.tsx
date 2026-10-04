import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Subtask } from '../types';
import { 
  MONTH_NAMES, 
  SHORT_PICKER_WEEKDAYS, 
  formatShortDate 
} from '../i18n/translations';
import { 
  X, 
  Mic, 
  Calendar, 
  Clock, 
  Plus, 
  Paperclip, 
  Video, 
  MapPin, 
  Check, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit3
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, initialDate }) => {
  const { createTask, updateTask, editingTask, setEditingTask, language, t } = useApp();
  const [mode, setMode] = useState<'task' | 'meeting'>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('09:30');
  const [allDay, setAllDay] = useState(false);
  const [priority, setPriority] = useState<'high' | 'medium' | 'normal'>('normal');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showVoiceSuccess, setShowVoiceSuccess] = useState(false);

  // Interactive Date Picker states
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const nativeDateInputRef = useRef<HTMLInputElement>(null);

  const initialD = dueDate ? new Date(dueDate) : new Date();
  const validD = isNaN(initialD.getTime()) ? new Date() : initialD;
  const [pickerYear, setPickerYear] = useState<number>(validD.getFullYear());
  const [pickerMonth, setPickerMonth] = useState<number>(validD.getMonth()); // 0-indexed

  // Populate form fields if editing existing task or creating new task
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title || '');
        setDescription(editingTask.description || '');
        setCategory(editingTask.categoryId || 'work');
        setDueDate(editingTask.dueDate || new Date().toISOString().split('T')[0]);
        setDueTime(editingTask.dueTime || '09:30');
        setAllDay(!editingTask.dueTime);
        setPriority(editingTask.priority || 'normal');
        setSubtasks(editingTask.subtasks ? JSON.parse(JSON.stringify(editingTask.subtasks)) : []);
        
        if (editingTask.dueDate) {
          const parts = editingTask.dueDate.split('-');
          if (parts[0]) setPickerYear(parseInt(parts[0], 10));
          if (parts[1]) setPickerMonth(parseInt(parts[1], 10) - 1);
        }
      } else {
        setTitle('');
        setDescription('');
        setCategory('work');
        const fallbackDate = initialDate || new Date().toISOString().split('T')[0];
        setDueDate(fallbackDate);
        setDueTime('09:30');
        setAllDay(false);
        setPriority('normal');
        setSubtasks([]);
        
        const d = initialDate ? new Date(initialDate) : new Date();
        if (!isNaN(d.getTime())) {
          setPickerYear(d.getFullYear());
          setPickerMonth(d.getMonth());
        }
      }
    }
  }, [isOpen, editingTask, initialDate]);

  // Close calendar popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    if (isDatePickerOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDatePickerOpen]);

  const monthNames = MONTH_NAMES[language] || MONTH_NAMES['th'];
  const pickerWeekdays = SHORT_PICKER_WEEKDAYS[language] || SHORT_PICKER_WEEKDAYS['th'];

  const handleQuickDate = (daysFromNow: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);
    setPickerYear(d.getFullYear());
    setPickerMonth(d.getMonth());
    setIsDatePickerOpen(false);
  };

  const handlePrevPickerMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(pickerYear - 1);
    } else {
      setPickerMonth(pickerMonth - 1);
    }
  };

  const handleNextPickerMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(pickerYear + 1);
    } else {
      setPickerMonth(pickerMonth + 1);
    }
  };

  const handleSelectCalendarDay = (day: number) => {
    const yyyy = pickerYear;
    const mm = String(pickerMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    setDueDate(`${yyyy}-${mm}-${dd}`);
    setIsDatePickerOpen(false);
  };

  // Generate calendar days for pickerMonth & pickerYear
  const firstDayOfWeek = new Date(pickerYear, pickerMonth, 1).getDay(); // 0 = Sun
  const daysInPickerMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();

  // Selected date components
  const parsedDueDate = dueDate ? dueDate.split('-') : [];
  const selectedYear = parsedDueDate[0] ? parseInt(parsedDueDate[0], 10) : null;
  const selectedMonth = parsedDueDate[1] ? parseInt(parsedDueDate[1], 10) - 1 : null;
  const selectedDay = parsedDueDate[2] ? parseInt(parsedDueDate[2], 10) : null;

  const today = new Date();
  const isCurrentMonthToday = today.getFullYear() === pickerYear && today.getMonth() === pickerMonth;
  const todayDay = isCurrentMonthToday ? today.getDate() : null;

  // Format date display label for active language (Thai, English, Myanmar)
  const formattedDueDate = formatShortDate(dueDate, language) || t('select_date');

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleToggleSubtask = (index: number) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const handleClose = () => {
    setEditingTask(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      await updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        categoryId: category,
        dueDate: dueDate,
        dueTime: allDay ? '' : dueTime,
        subtasks
      });
    } else {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status: 'pending',
        priority,
        categoryId: category,
        dueDate: dueDate,
        dueTime: allDay ? '' : dueTime,
        subtasks
      });
    }

    // Reset fields & close
    setTitle('');
    setDescription('');
    setCategory('work');
    setPriority('normal');
    setSubtasks([]);
    setEditingTask(null);
    onClose();
  };

  // Simulating voice dictation for demonstration
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const voiceTitle = language === 'my' 
        ? 'မိုဘိုင်းအက်ပ် ဒီဇိုင်းစစ်ဆေးခြင်း' 
        : language === 'en' 
        ? 'Review Mobile App Design Flow' 
        : 'ตรวจรับรองงานดีไซน์ Mobile App';
      setTitle(voiceTitle);
      setShowVoiceSuccess(true);
      setTimeout(() => setShowVoiceSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 backdrop-blur-[2px]">
      {/* Backdrop Close */}
      <div className="absolute inset-0" onClick={handleClose}></div>

      {/* Sheet Container */}
      <div className="relative z-20 w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] border-t border-slate-100 dark:border-slate-800 flex flex-col max-h-[90dvh] overflow-hidden animate-slide-up shadow-2xl">
        {/* Drag handle */}
        <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={handleClose}>
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <header className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <button 
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mode switch or Edit Header */}
          {editingTask ? (
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
              <Edit3 className="w-4 h-4" />
              <span>{t('edit_task_title')}</span>
            </div>
          ) : (
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('task')}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  mode === 'task' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {t('modal_mode_task')}
              </button>
              <button
                type="button"
                onClick={() => setMode('meeting')}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                  mode === 'meeting' 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {t('modal_mode_meeting')}
              </button>
            </div>
          )}

          <button 
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            {editingTask ? t('save_changes') : t('save')}
          </button>
        </header>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-10">
          
          {/* Voice Feedback Notification */}
          {showVoiceSuccess && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs animate-pulse">
              <Check className="w-4 h-4 shrink-0" />
              <span>{t('voice_success')}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {mode === 'task' ? t('title_label_task') : t('title_label_meeting')} <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 px-3.5 py-1 transition-all">
              <input
                type="text"
                placeholder={mode === 'task' ? t('title_placeholder_task') : t('title_placeholder_meeting')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                className="w-full text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal bg-transparent border-none focus:ring-0 py-2 outline-none"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl ml-1 shrink-0 transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                }`}
                title={t('voice_typing')}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-1">
            <textarea
              placeholder={t('description_placeholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={2}
              className="w-full text-sm text-slate-600 dark:text-slate-300 placeholder:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Category Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t('category_title')}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'work', label: t('cat_work'), icon: '🏢' },
                { id: 'project', label: t('cat_project'), icon: '💼' },
                { id: 'personal', label: t('cat_personal'), icon: '🏡' },
                { id: 'learning', label: t('cat_learning'), icon: '🎓' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border shrink-0 transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Settings */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100/60 dark:border-slate-800/80 space-y-3">
            {/* Quick Date Select Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                {t('quick_schedule')}
              </span>
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                  dueDate === today.toISOString().split('T')[0]
                    ? 'bg-indigo-600 text-white shadow-xs scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                {t('today_chip')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(1)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer shrink-0"
              >
                {t('tomorrow_chip')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(3)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer shrink-0"
              >
                {t('plus3days_chip')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(7)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-755 transition-colors cursor-pointer shrink-0"
              >
                {t('nextweek_chip')}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Date Input Button & Popover */}
              <div ref={datePickerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className={`flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border transition-all shadow-xs text-xs font-semibold shrink-0 cursor-pointer ${
                    isDatePickerOpen 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="font-semibold">{formattedDueDate}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDatePickerOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>

                {/* Interactive Calendar Popover */}
                {isDatePickerOpen && (
                  <div className="absolute left-0 top-full mt-2 z-50 w-72 p-3 bg-white dark:bg-slate-855 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
                    {/* Calendar Month Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                        {monthNames[pickerMonth]} {language === 'th' ? pickerYear + 543 : pickerYear}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevPickerMonth}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextPickerMonth}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Day of Week Headers */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-slate-400">
                      {pickerWeekdays.map((pw, idx) => (
                        <span key={idx}>{pw}</span>
                      ))}
                    </div>

                    {/* Day Cells Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-8 h-8" />
                      ))}
                      {Array.from({ length: daysInPickerMonth }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = selectedYear === pickerYear && selectedMonth === pickerMonth && selectedDay === day;
                        const isToday = isCurrentMonthToday && todayDay === day;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleSelectCalendarDay(day)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                : isToday
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                            }`}
                          >
                            <span>{day}</span>
                            {isToday && !isSelected && (
                              <span className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400 absolute bottom-0.5"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Native Date Picker Fallback */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-750 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{t('or_type_date')}</span>
                      <input
                        ref={nativeDateInputRef}
                        type="date"
                        value={dueDate}
                        onChange={(e) => {
                          setDueDate(e.target.value);
                          if (e.target.value) {
                            const p = e.target.value.split('-');
                            if (p[0]) setPickerYear(parseInt(p[0], 10));
                            if (p[1]) setPickerMonth(parseInt(p[1], 10) - 1);
                          }
                        }}
                        className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-lg px-2 py-0.5 text-slate-700 dark:text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Time Input */}
              <div className={`flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 ${
                allDay ? 'opacity-40 pointer-events-none' : ''
              }`}>
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  disabled={allDay}
                  className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-20 min-w-[76px] font-semibold text-slate-800 dark:text-slate-200"
                />
                {t('time_unit') && (
                  <span className="text-slate-400 font-normal">{t('time_unit')}</span>
                )}
              </div>
            </div>

            {/* All Day Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t('all_day')}
              </span>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* Priority Select */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {t('priority_section')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                  priority === 'high'
                    ? 'border-red-500 bg-red-50/70 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-xs font-medium'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>{t('priority_high_label')}</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border transition-all cursor-pointer ${
                  priority === 'medium'
                    ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-xs font-medium'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>{t('priority_medium_label')}</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border transition-all cursor-pointer ${
                  priority === 'normal'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-xs font-medium'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>{t('priority_normal_label')}</span>
              </button>
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('subtasks_title')} ({subtasks.filter(s => s.completed).length}/{subtasks.length} {t('subtasks_done_suffix')})
              </label>
              <button
                type="button"
                onClick={handleAddSubtask}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                {t('add_item')}
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {subtasks.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(idx)}
                      className="rounded text-indigo-600 focus:ring-0 w-4 h-4 border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
                    />
                    <span className={`${sub.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300 font-medium'}`}>
                      {sub.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(idx)}
                    className="text-slate-400 hover:text-red-500 transition-colors text-base font-medium px-1 cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 mt-1">
                <input
                  type="text"
                  placeholder={t('add_subtask_placeholder')}
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  className="w-full bg-transparent border-none p-0 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:ring-0 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => alert(t('demo_feature_attach'))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('attach_file')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const meetTitle = language === 'my' ? 'တိုးတက်မှု အစည်းအဝေး' : language === 'en' ? 'Team Progress Sync Meeting' : 'ประชุมทีมซิงค์ความคืบหน้า';
                  setTitle(prev => prev || meetTitle);
                  setDescription(prev => prev ? prev + '\nGoogle Meet: meet.google.com/abc-xyz' : 'Google Meet: meet.google.com/abc-xyz');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('google_meet')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const locText = language === 'my' ? 'နေရာ: ရုံးခန်း ၄ လွှာ' : language === 'en' ? 'Location: Office 4th Floor' : 'สถานที่: ออฟฟิศ ชั้น 4';
                  setDescription(prev => prev ? prev + '\n' + locText : locText);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('location')}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Bottom Sticky Action Footer */}
        <footer className="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:shadow-none text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
          >
            {editingTask ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t('save_changes')}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{t('create_task_button')}</span>
              </>
            )}
          </button>
          {!title.trim() && (
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 font-medium">
              {t('title_required_hint')}
            </p>
          )}
        </footer>
      </div>
    </div>
  );
};
