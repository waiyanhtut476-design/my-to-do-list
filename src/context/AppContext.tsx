import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, UserSetting, AppNotification, UserProfile } from '../types';

interface AppContextType {
  user: { uid: string; displayName: string; email: string; photoURL: string } | null;
  userProfile: UserProfile | null;
  tasks: Task[];
  settings: UserSetting | null;
  notifications: AppNotification[];
  loading: boolean;
  authLoading: boolean;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateSettings: (updates: Partial<UserSetting>) => Promise<void>;
  createNotification: (title: string, body: string, type: AppNotification['type']) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearNotification: (notificationId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Static Local User to fully bypass auth
  const [user] = useState({
    uid: 'local_user',
    displayName: 'กานต์',
    email: 'local@clarityflow.app',
    photoURL: ''
  });

  const [userProfile] = useState<UserProfile | null>({
    userId: 'local_user',
    email: 'local@clarityflow.app',
    displayName: 'กานต์',
    photoURL: '',
    createdAt: new Date()
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<UserSetting | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading] = useState<boolean>(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    // 1. Settings
    const storedSettings = localStorage.getItem('clarity_flow_settings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultSettings: UserSetting = {
        ownerId: 'local_user',
        darkMode: false,
        notificationsEnabled: true,
        dndEnabled: false,
        dndStartTime: '22:00',
        dndEndTime: '07:00',
        earlyReminderMinutes: 30,
        urgentReminderRepeat: true,
        updatedAt: new Date()
      };
      localStorage.setItem('clarity_flow_settings', JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
    }

    // 2. Tasks
    const storedTasks = localStorage.getItem('clarity_flow_tasks');
    if (storedTasks) {
      try {
        const parsed = JSON.parse(storedTasks).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt)
        }));
        setTasks(parsed);
      } catch (e) {
        console.error(e);
      }
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const initialTasks: Task[] = [
        {
          id: 'task_1',
          ownerId: 'local_user',
          title: 'จัดระเบียบเป้าหมายประจำวัน 🎯',
          description: 'ลิสต์งานสำคัญและคัดแยกตามลำดับความเร่งด่วน',
          priority: 'high',
          status: 'pending',
          dueDate: todayStr,
          dueTime: '10:00',
          categoryId: 'work',
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'task_2',
          ownerId: 'local_user',
          title: 'ทบทวนแผนการทำงานสัปดาห์นี้ 📈',
          description: 'เช็คความคืบหน้าระบบและประสานงานร่วมกับทีม',
          priority: 'medium',
          status: 'pending',
          dueDate: tomorrowStr,
          dueTime: '14:00',
          categoryId: 'work',
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'task_3',
          ownerId: 'local_user',
          title: 'ตั้งค่าแอปพลิเคชัน Clarity Flow 🔔',
          description: 'สลับโหมดถนอมสายตาและเปิดระบบแจ้งเตือนด่วนพิเศษ',
          priority: 'normal',
          status: 'completed',
          dueDate: todayStr,
          dueTime: '09:00',
          categoryId: 'personal',
          subtasks: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      localStorage.setItem('clarity_flow_tasks', JSON.stringify(initialTasks));
      setTasks(initialTasks);
    }

    // 3. Notifications
    const storedNotifs = localStorage.getItem('clarity_flow_notifications');
    if (storedNotifs) {
      try {
        const parsed = JSON.parse(storedNotifs).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }));
        setNotifications(parsed);
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialNotifs: AppNotification[] = [
        {
          id: 'notif_welcome',
          ownerId: 'local_user',
          title: 'ยินดีต้อนรับสู่ Clarity Flow! 🎉',
          body: 'แอปจัดระเบียบงานด่วนพิเศษของคุณพร้อมใช้งานแล้ว ข้อมูลจะถูกบันทึกบนเครื่องของคุณโดยตรงอย่างปลอดภัย',
          type: 'assignment',
          read: false,
          createdAt: new Date()
        }
      ];
      localStorage.setItem('clarity_flow_notifications', JSON.stringify(initialNotifs));
      setNotifications(initialNotifs);
    }

    setLoading(false);
  }, []);

  // Sync Dark Mode state to root HTML element
  useEffect(() => {
    if (settings) {
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings]);

  // Auth Operations (No-ops/Local helper)
  const signIn = async () => {};
  const logout = async () => {
    if (confirm('คุณต้องการรีเซ็ตแอปพลิเคชันและล้างข้อมูลทั้งหมดในเครื่องนี้ใช่หรือไม่?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Task Operations
  const createTask = async (taskData: Omit<Task, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    const taskId = 'task_' + Math.random().toString(36).substring(2, 15);
    const newTask: Task = {
      ...taskData,
      id: taskId,
      ownerId: 'local_user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem('clarity_flow_tasks', JSON.stringify(updatedTasks));

    // Create automatic notification if enabled
    if (settings?.notificationsEnabled) {
      let alertMsg = `สร้างงานใหม่สำเร็จ: "${taskData.title}"`;
      if (taskData.dueDate) alertMsg += ` ครบกำหนด ${taskData.dueDate}`;
      await createNotification(
        taskData.priority === 'high' ? '⏰ งานด่วนมากใหม่' : '📝 มอบหมายงานใหม่',
        alertMsg,
        'assignment'
      );
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const { id, ...safeUpdates } = updates;
        return { ...t, ...safeUpdates, id: taskId, updatedAt: new Date() } as Task;
      }
      return t;
    });

    setTasks(updatedTasks);
    localStorage.setItem('clarity_flow_tasks', JSON.stringify(updatedTasks));

    // Trigger standard completion notification if status toggled to completed
    if (updates.status === 'completed' && settings?.notificationsEnabled) {
      const taskName = tasks.find(t => t.id === taskId)?.title || 'งานของคุณ';
      await createNotification(
        '🎯 ยินดีด้วย! คุณทำงานสำเร็จ',
        `คุณเคลียร์งาน "${taskName}" เสร็จสิ้นเรียบร้อยแล้ว`,
        'reminder'
      );
    }
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('clarity_flow_tasks', JSON.stringify(updatedTasks));
  };

  // User Settings Operations
  const updateSettings = async (updates: Partial<UserSetting>) => {
    if (!settings) return;
    const updatedSettings = {
      ...settings,
      ...updates,
      updatedAt: new Date()
    };
    setSettings(updatedSettings);
    localStorage.setItem('clarity_flow_settings', JSON.stringify(updatedSettings));
  };

  // In-App Notification Operations
  const createNotification = async (title: string, body: string, type: AppNotification['type']) => {
    const notificationId = 'notif_' + Math.random().toString(36).substring(2, 15);
    const newNotif: AppNotification = {
      id: notificationId,
      ownerId: 'local_user',
      title,
      body,
      type,
      read: false,
      createdAt: new Date()
    };

    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('clarity_flow_notifications', JSON.stringify(updatedNotifs));
  };

  const markNotificationAsRead = async (notificationId: string) => {
    const updatedNotifs = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifs);
    localStorage.setItem('clarity_flow_notifications', JSON.stringify(updatedNotifs));
  };

  const markAllNotificationsAsRead = async () => {
    const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifs);
    localStorage.setItem('clarity_flow_notifications', JSON.stringify(updatedNotifs));
  };

  const clearNotification = async (notificationId: string) => {
    const updatedNotifs = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifs);
    localStorage.setItem('clarity_flow_notifications', JSON.stringify(updatedNotifs));
  };

  return (
    <AppContext.Provider value={{
      user,
      userProfile,
      tasks,
      settings,
      notifications,
      loading,
      authLoading,
      isTaskModalOpen,
      setIsTaskModalOpen,
      isNotificationOpen,
      setIsNotificationOpen,
      signIn,
      logout,
      createTask,
      updateTask,
      deleteTask,
      updateSettings,
      createNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
