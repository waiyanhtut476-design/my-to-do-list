import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { Check, Trash2, Calendar, Clock, Award, Layers, Folder, Shield, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, updateTask, deleteTask } = useApp();
  const [filter, setFilter] = useState<'all' | 'high' | 'project' | 'personal' | 'completed'>('all');
  const [showCompletedSection, setShowCompletedSection] = useState(true);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Grouped tasks calculation
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Filter lists down
  const filteredPending = pendingTasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'high') return t.priority === 'high';
    if (filter === 'project') return t.categoryId === 'project';
    if (filter === 'personal') return t.categoryId === 'personal';
    return true;
  });

  const handleToggleStatus = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: nextStatus });
  };

  const handleDelete = (id: string) => {
    setTaskToDelete(id);
  };

  // Completion Percentage calculation
  const totalCount = tasks.length;
  const completedCount = completedTasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <>
      <div className="space-y-5">
      
      {/* 1. Daily Progress Delight Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-850 shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between gap-4">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col gap-1.5 z-10 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">สรุปความคืบหน้า</span>
            <span className="inline-flex items-center justify-center w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">✓</span>
          </div>
          
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight truncate">
            {completionRate === 100 ? 'เสร็จครบ 100% แล้ว! 🎉' : completionRate >= 75 ? 'ยอดเยี่ยมมาก! ✨' : 'เคลียร์วันนี้กันเถอะ! 📝'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {completionRate === 100 
              ? 'คุณทำงานสำเร็จครบถ้วนทุกรายการสำหรับวันนี้!' 
              : 'อีกนิดเดียวจะครบเป้าหมายของวันแล้ว! 🎉'}
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
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{completedCount}/{totalCount} งาน</span>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Scrollable Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {[
          { id: 'all', label: 'ทั้งหมด', badge: tasks.length },
          { id: 'high', label: 'งานด่วน ⚡', badge: tasks.filter(t => t.priority === 'high' && t.status === 'pending').length, badgeColor: 'text-red-500' },
          { id: 'project', label: 'โปรเจกต์ 💼', badge: tasks.filter(t => t.categoryId === 'project' && t.status === 'pending').length },
          { id: 'personal', label: 'ส่วนตัว 🏡', badge: tasks.filter(t => t.categoryId === 'personal' && t.status === 'pending').length },
          { id: 'completed', label: 'เสร็จสิ้นแล้ว ✅', badge: completedCount, badgeColor: 'text-emerald-500' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id as any)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs shadow-xs transition-all ${
              filter === item.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <span>{item.label}</span>
            <span className={`text-[10px] font-extrabold ${item.badgeColor || (filter === item.id ? 'text-indigo-200' : 'text-slate-400')}`}>
              ({item.badge})
            </span>
          </button>
        ))}
      </div>

      {/* 3. Active Tasks Section */}
      {filter !== 'completed' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">งานที่ค้างอยู่</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
                {filteredPending.length} งานค้าง
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => alert('ฟีเจอร์จัดเรียงการซิงค์ข้อมูลบนเดโม จัดเรียงตามลำดับความด่วนและวันเวลาสร้างโดยออโต้คลาวด์!')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              จัดเรียง
            </button>
          </div>

          {/* Pending tasks list */}
          {filteredPending.length === 0 ? (
            <div className="bg-white dark:bg-slate-850 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-800/80">
              <span className="text-2xl block mb-2">🎈</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-300">ไม่มีงานค้างอยู่ในขณะนี้</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">ยินดีด้วยกับการเคลียร์งานตามเป้าหมายครับ!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPending.map((task) => {
                const isHigh = task.priority === 'high';
                const isMedium = task.priority === 'medium';
                const hasSubtasks = task.subtasks && task.subtasks.length > 0;
                const completedSubCount = hasSubtasks ? task.subtasks.filter(s => s.completed).length : 0;

                return (
                  <article 
                    key={task.id}
                    className="group relative bg-white dark:bg-slate-850 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col gap-3 active:scale-[0.99]"
                  >
                    <div className="flex items-start gap-3">
                      {/* Circle checkbox */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(task)}
                        className="mt-1 w-5.5 h-5.5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 transition-all hover:border-indigo-500"
                        title="ทำเครื่องหมายเสร็จสิ้น"
                      >
                        <span className="text-transparent">✓</span>
                      </button>

                      {/* Content details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                            isHigh 
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' 
                              : isMedium 
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' 
                                : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                          }`}>
                            {isHigh ? '🔴 ด่วนมาก' : isMedium ? '🟡 ปานกลาง' : '🟢 ปกติ'}
                          </span>

                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                              <Clock className={`w-3.5 h-3.5 ${isHigh ? 'text-red-500' : 'text-slate-400'}`} />
                              <span className={isHigh ? 'text-red-500' : ''}>{task.dueTime || 'วันนี้'}</span>
                            </div>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Interactive Subtasks mini bar */}
                        {hasSubtasks && (
                          <div className="mt-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                              <span>รายการงานย่อย</span>
                              <span>{completedSubCount}/{task.subtasks.length} ข้อย่อย</span>
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

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-500 text-[10px] font-semibold border border-slate-100 dark:border-slate-800">
                            <Folder className="w-3 h-3" />
                            {task.categoryId === 'work' ? 'งานบริษัท' : task.categoryId === 'project' ? 'งานโปรเจกต์' : task.categoryId === 'personal' ? 'ส่วนตัว' : 'การเรียนรู้'}
                          </span>

                          {/* Member avatars simulation */}
                          <div className="flex items-center -space-x-1.5">
                            <div className="w-5.5 h-5.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">ก</div>
                            {isHigh && (
                              <div className="w-5.5 h-5.5 rounded-full bg-teal-500 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white">ธ</div>
                            )}
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

      {/* 4. Completed Tasks Section */}
      {(filter === 'all' || filter === 'completed') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-500 dark:text-slate-400">เสร็จสิ้นแล้ว</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {completedCount} งาน
              </span>
            </div>
            
            <button 
              type="button"
              onClick={() => setShowCompletedSection(!showCompletedSection)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
            >
              <span>{showCompletedSection ? 'ซ่อน' : 'แสดง'}</span>
              {showCompletedSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Completed cards list */}
          {showCompletedSection && (
            completedTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                <span>ไม่มีประวัติงานเสร็จสิ้น</span>
              </div>
            ) : (
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="completed-card relative bg-white/70 dark:bg-slate-850/50 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 opacity-80 hover:opacity-100 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(task)}
                        className="w-5.5 h-5.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs active:scale-90"
                        title="ทำต่อ"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-500 line-through truncate">
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          เสร็จสิ้น • หมวดหมู่{task.categoryId === 'work' ? 'บริษัท' : task.categoryId === 'project' ? 'โปรเจกต์' : task.categoryId === 'personal' ? 'ส่วนตัว' : 'การเรียนรู้'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="ลบอย่างถาวร"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* Motivational Quote banner */}
      <div className="rounded-xl bg-gradient-to-r from-slate-100 to-indigo-50 dark:from-slate-800 dark:to-slate-800/40 p-4 flex items-center gap-3 border border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
            เคล็ดลับเพิ่มสมาธิ: โฟกัสงานด่วนที่สุดก่อนเที่ยง
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            สมองจะมีพลังงานมากที่สุดในช่วง 3 ชั่วโมงแรกของการทำงาน
          </p>
        </div>
      </div>
    </div>

      {/* Custom DOM Confirmation Modal for Deletion (Safe for sandboxed iframes) */}
      {taskToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl max-w-xs w-full border border-slate-100 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">ยืนยันการลบงาน</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">คุณแน่ใจหรือไม่ว่าต้องการลบรายการงานนี้อย่างถาวร? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            </div>
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (taskToDelete) {
                    await deleteTask(taskToDelete);
                    setTaskToDelete(null);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
