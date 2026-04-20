export type NotificationType = 'announcement' | 'grade' | 'attendance' | 'assignment' | 'reminder' | 'alert';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  senderId?: string;
  senderName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  targetRoles: ('admin' | 'teacher' | 'student' | 'parent')[];
  targetClassIds?: string[];
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}