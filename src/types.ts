export interface Subtask {
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'normal';
  categoryId: string; // 'work' | 'project' | 'personal' | 'learning'
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM
  ownerId: string;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
  subtasks: Subtask[];
}

export interface UserSetting {
  ownerId: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  dndEnabled: boolean;
  dndStartTime: string; // HH:MM
  dndEndTime: string; // HH:MM
  earlyReminderMinutes: number; // 15 | 30 | 60 | 1440
  urgentReminderRepeat: boolean;
  language?: 'th' | 'en' | 'my';
  updatedAt: any;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'reminder' | 'system' | 'assignment';
  read: boolean;
  ownerId: string;
  createdAt: any;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
}
