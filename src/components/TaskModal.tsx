import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subtask } from '../types';
import { X, Mic, Calendar, Clock, Plus, Paperclip, Video, MapPin, Check, AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, initialDate }) => {
  const { createTask } = useApp();
  const [mode, setMode] = useState<'task' | 'meeting'>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [dueDate, setDueDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('09:30');
  const [allDay, setAllDay] = useState(false);
  const [priority, setPriority] = useState<'high' | 'medium' | 'normal'>('normal');
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { title: 'เตรียมเอกสารสรุปความคืบหน้า', completed: true },
    { title: 'ส่งมอบ UI Flow ให้ฝ่ายเทคโนโลยี', completed: false }
  ]);
  const [newSubtask, setNewSubtask] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showVoiceSuccess, setShowVoiceSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      priority,
      categoryId: category,
      dueDate: allDay ? '' : dueDate,
      dueTime: allDay ? '' : dueTime,
      subtasks
    });

    // Reset fields
    setTitle('');
    setDescription('');
    setCategory('work');
    setPriority('normal');
    setSubtasks([]);
    onClose();
  };

  // Simulating Thai voice dictation for demonstration
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setTitle('ตรวจรับรองงานดีไซน์ Mobile App');
      setShowVoiceSuccess(true);
      setTimeout(() => setShowVoiceSuccess(false), 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 backdrop-blur-[2px]">
      {/* Backdrop Close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Sheet Container */}
      <div className="relative z-20 w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[32px] border-t border-slate-100 dark:border-slate-800 flex flex-col max-h-[90dvh] overflow-hidden animate-slide-up shadow-2xl">
        {/* Drag handle */}
        <div className="pt-3 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <header className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mode switch */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('task')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                mode === 'task' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              งานที่ต้องทำ
            </button>
            <button
              type="button"
              onClick={() => setMode('meeting')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                mode === 'meeting' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              นัดหมาย
            </button>
          </div>

          <button 
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 disabled:opacity-50"
          >
            บันทึก
          </button>
        </header>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          
          {/* Voice Feedback Notification */}
          {showVoiceSuccess && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs animate-pulse">
              <Check className="w-4 h-4 shrink-0" />
              <span>ตรวจจับเสียงเรียบร้อย: "ตรวจรับรองงานดีไซน์ Mobile App"</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={mode === 'task' ? 'ชื่องานที่ต้องทำ...' : 'ชื่อนัดหมาย/การประชุม...'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
                className="w-full text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal bg-transparent border-0 border-b border-transparent focus:border-indigo-500 focus:ring-0 px-0 py-2 transition-all outline-none"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-full ml-2 shrink-0 transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-ping' 
                    : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
                }`}
                title="พิมพ์ด้วยเสียง"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-1">
            <textarea
              placeholder="รายละเอียดเพิ่มเติม..."
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
              หมวดหมู่โครงการ
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'work', label: 'งานบริษัท', icon: '🏢' },
                { id: 'project', label: 'โปรเจกต์', icon: '💼' },
                { id: 'personal', label: 'ส่วนตัว', icon: '🏡' },
                { id: 'learning', label: 'การเรียนรู้', icon: '🎓' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border shrink-0 transition-all ${
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Date Input */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={allDay}
                  className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-28 font-medium"
                />
              </div>

              {/* Time Input */}
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  disabled={allDay}
                  className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-14 font-medium"
                />
                <span className="text-slate-400 font-normal">น.</span>
              </div>
            </div>

            {/* All Day Switch */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">ตลอดทั้งวัน (All day)</span>
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
              ระดับความสำคัญ
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border-2 transition-all ${
                  priority === 'high'
                    ? 'border-red-500 bg-red-50/70 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-xs font-medium'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>ด่วนมาก</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border transition-all ${
                  priority === 'medium'
                    ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-xs font-medium'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>ปานกลาง</span>
              </button>

              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border transition-all ${
                  priority === 'normal'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 text-xs font-medium'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>ปกติ</span>
              </button>
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                งานย่อย ({subtasks.filter(s => s.completed).length}/{subtasks.length} เสร็จแล้ว)
              </label>
              <button
                type="button"
                onClick={handleAddSubtask}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                + เพิ่มรายการ
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
                    className="text-slate-400 hover:text-red-500 transition-colors text-base font-medium px-1"
                  >
                    &times;
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 mt-1">
                <input
                  type="text"
                  placeholder="เขียนหัวข้องานย่อยแล้วกดบวก..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                  className="w-full bg-transparent border-none p-0 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:ring-0 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="p-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 shrink-0"
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
                onClick={() => alert('ฟีเจอร์นี้ได้รับการจำลองในเดโม: แนบไฟล์')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors shrink-0"
              >
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span>แนบไฟล์</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle(prev => prev || 'ประชุมทีมซิงค์ความคืบหน้า');
                  setDescription(prev => prev ? prev + '\nลิงก์: meet.google.com/abc-xyz' : 'ลิงก์: meet.google.com/abc-xyz');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors shrink-0"
              >
                <Video className="w-3.5 h-3.5 text-slate-500" />
                <span>Google Meet</span>
              </button>
              <button
                type="button"
                onClick={() => setDescription(prev => prev ? prev + '\nสถานที่: ออฟฟิศ ชั้น 4' : 'สถานที่: ออฟฟิศ ชั้น 4')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>สถานที่</span>
              </button>
            </div>
          </div>
        </form>

        {/* Bottom Sticky Action Footer */}
        <footer className="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>สร้างงานใหม่</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
