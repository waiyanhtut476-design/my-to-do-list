import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, signInWithGoogle as loginGoogle, getActiveFirebaseConfig } from '../firebase';
import { Task, UserSetting, AppNotification, UserProfile } from '../types';

interface AppContextType {
  user: User | null;
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
  signIn: () => Promise<void>; // Direct Google Sign-In helper
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<User>;
  logout: () => Promise<void>;
  isUsingCustomConfig: boolean;
  activeProjectId: string;
  saveCustomFirebaseConfig: (configText: string) => boolean;
  clearCustomFirebaseConfig: () => void;
  createTask: (taskData: Omit<Task, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  updateSettings: (updates: Partial<UserSetting>) => Promise<void>;
  createNotification: (title: string, body: string, type: AppNotification['type']) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearNotification: (notificationId: string) => Promise<void>;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<UserSetting | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // LocalStorage Theme Management
  const [theme, setAppTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('clarity_flow_theme');
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Configuration Info
  const [isUsingCustomConfig, setIsUsingCustomConfig] = useState<boolean>(() => {
    return localStorage.getItem('clarity_flow_custom_firebase_config') !== null;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const config = getActiveFirebaseConfig();
    return config.projectId || 'optimal-method-9vk22';
  });

  // Save Config function with regex-tolerant parsing
  const saveCustomFirebaseConfig = (configText: string): boolean => {
    try {
      let parsed: any = null;
      try {
        parsed = JSON.parse(configText.trim());
      } catch (jsonErr) {
        // Fallback to extraction via regex
        const config: any = {};
        const keys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'measurementId'];
        keys.forEach(key => {
          const regex = new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`);
          const match = configText.match(regex);
          if (match) {
            config[key] = match[1];
          }
        });
        if (config.apiKey && config.projectId) {
          parsed = config;
        }
      }

      if (parsed && parsed.apiKey && parsed.projectId) {
        localStorage.setItem('clarity_flow_custom_firebase_config', JSON.stringify(parsed));
        setIsUsingCustomConfig(true);
        setActiveProjectId(parsed.projectId);
        alert('เชื่อมต่อโครงการ Firebase สำเร็จแล้ว! กำลังรีโหลดแอปพลิเคชันเพื่อใช้การตั้งค่าใหม่ของคุณ...');
        window.location.reload();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const clearCustomFirebaseConfig = () => {
    localStorage.removeItem('clarity_flow_custom_firebase_config');
    setIsUsingCustomConfig(false);
    alert('กลับสู่โครงการเริ่มต้นเรียบร้อย! กำลังรีโหลดแอปพลิเคชัน...');
    window.location.reload();
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setAuthLoading(true);
      if (currentUser) {
        setUser(currentUser);
        
        // Ensure User Profile document exists in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            const profilePayload = {
              userId: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'ผู้ใช้งาน Clarity Flow',
              photoURL: currentUser.photoURL || '',
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, profilePayload);
            setUserProfile({
              ...profilePayload,
              createdAt: new Date()
            });
          } else {
            setUserProfile(userSnap.data() as UserProfile);
          }
        } catch (err) {
          console.error('Error creating user profile document:', err);
        }

        // Ensure User Settings document exists in Firestore
        const settingsRef = doc(db, 'user_settings', currentUser.uid);
        try {
          const settingsSnap = await getDoc(settingsRef);
          if (!settingsSnap.exists()) {
            const defaultSettings: UserSetting = {
              ownerId: currentUser.uid,
              darkMode: false,
              notificationsEnabled: true,
              dndEnabled: false,
              dndStartTime: '22:00',
              dndEndTime: '07:00',
              earlyReminderMinutes: 30,
              urgentReminderRepeat: true,
              updatedAt: serverTimestamp()
            };
            await setDoc(settingsRef, defaultSettings);
            setSettings({
              ...defaultSettings,
              updatedAt: new Date()
            });
          } else {
            setSettings(settingsSnap.data() as UserSetting);
          }
        } catch (err) {
          console.error('Error creating user settings document:', err);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setTasks([]);
        setSettings(null);
        setNotifications([]);
        setLoading(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync real-time Firestore collections for current user
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // 1. Subscribe to Tasks
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTasks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        } as Task);
      });
      setTasks(fetchedTasks);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `tasks [ownerId=${user.uid}]`);
    });

    // 2. Subscribe to Notifications
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('ownerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const fetchedNotifications: AppNotification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedNotifications.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        } as AppNotification);
      });
      setNotifications(fetchedNotifications);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `notifications [ownerId=${user.uid}]`);
    });

    // 3. Subscribe to Settings Changes
    const settingsRef = doc(db, 'user_settings', user.uid);
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings({
          ...data,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        } as UserSetting);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `user_settings/${user.uid}`);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeNotifications();
      unsubscribeSettings();
    };
  }, [user]);

  const setTheme = async (newTheme: 'light' | 'dark') => {
    setAppTheme(newTheme);
    try {
      localStorage.setItem('clarity_flow_theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme in localStorage', e);
    }

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
    }

    // Also sync to user_settings in Firestore if user is logged in
    if (user) {
      try {
        await updateSettings({ darkMode: newTheme === 'dark' });
      } catch (err) {
        console.error('Failed to sync darkMode to Firestore:', err);
      }
    }
  };

  const toggleTheme = async () => {
    await setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Ensure DOM class matches theme state on mount and update
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body?.classList.remove('dark');
    }
  }, [theme]);

  // Sync settings.darkMode from Firestore if loaded
  useEffect(() => {
    if (settings && typeof settings.darkMode === 'boolean') {
      const dbTheme = settings.darkMode ? 'dark' : 'light';
      try {
        const local = localStorage.getItem('clarity_flow_theme');
        if (!local) {
          localStorage.setItem('clarity_flow_theme', dbTheme);
          setAppTheme(dbTheme);
        }
      } catch (e) {}
    }
  }, [settings]);

  // Email/Password Authentication Operations
  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    return cred.user;
  };

  const signIn = async () => {
    await loginGoogle();
  };

  const logout = async () => {
    await signOut(auth);
  };

  // Task Operations
  const createTask = async (taskData: Omit<Task, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error("User not authenticated");
    const taskId = 'task_' + Math.random().toString(36).substring(2, 15);
    const path = `tasks/${taskId}`;
    try {
      const taskPayload = {
        ...taskData,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'tasks', taskId), taskPayload);

      // Create automatic notification if enabled
      if (settings?.notificationsEnabled) {
        let alertMsg = `สร้างงานใหม่สำเร็จ: "${taskData.title}"`;
        if (taskData.dueDate) alertMsg += ` ครกกำหนด ${taskData.dueDate}`;
        await createNotification(
          taskData.priority === 'high' ? '⏰ งานด่วนมากใหม่' : '📝 มอบหมายงานใหม่',
          alertMsg,
          'assignment'
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) throw new Error("User not authenticated");
    const path = `tasks/${taskId}`;
    try {
      const { id, ...safeUpdates } = updates;
      const payload = {
        ...safeUpdates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'tasks', taskId), payload);

      // Trigger standard completion notification if status toggled to completed
      if (updates.status === 'completed' && settings?.notificationsEnabled) {
        const taskName = tasks.find(t => t.id === taskId)?.title || 'งานของคุณ';
        await createNotification(
          '🎯 ยินดีด้วย! คุณทำงานสำเร็จ',
          `คุณเคลียร์งาน "${taskName}" เสร็จสิ้นเรียบร้อยแล้ว`,
          'reminder'
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) throw new Error("User not authenticated");
    const path = `tasks/${taskId}`;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // User Settings Operations
  const updateSettings = async (updates: Partial<UserSetting>) => {
    if (!user) throw new Error("User not authenticated");
    const path = `user_settings/${user.uid}`;
    try {
      const safeUpdates = { ...updates };
      delete safeUpdates.ownerId;

      await setDoc(doc(db, 'user_settings', user.uid), {
        ...safeUpdates,
        ownerId: user.uid,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // In-App Notification Operations
  const createNotification = async (title: string, body: string, type: AppNotification['type']) => {
    if (!user) return;
    const notificationId = 'notif_' + Math.random().toString(36).substring(2, 15);
    const path = `notifications/${notificationId}`;
    try {
      await setDoc(doc(db, 'notifications', notificationId), {
        title,
        body,
        type,
        read: false,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;
    const path = `notifications/${notificationId}`;
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    try {
      const unread = notifications.filter(n => !n.read);
      const promises = unread.map(async (n) => {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      });
      await Promise.all(promises);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'notifications/multiple');
    }
  };

  const clearNotification = async (notificationId: string) => {
    if (!user) return;
    const path = `notifications/${notificationId}`;
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
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
      loginWithEmail,
      registerWithEmail,
      logout,
      isUsingCustomConfig,
      activeProjectId,
      saveCustomFirebaseConfig,
      clearCustomFirebaseConfig,
      createTask,
      updateTask,
      deleteTask,
      updateSettings,
      createNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      clearNotification,
      theme,
      setTheme,
      toggleTheme
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
