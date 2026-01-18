export interface Notification {
  id: number;
  title: string;
  message: string;
  image?: string | null;
  author: string;
  created_at: string;
  read: boolean;
  type: NotificationType;
  tag_color?: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

export interface NotificationRequest {
  usuario_id: number;
  title: string;
  message: string;
  image?: string | null;
  author?: string;
  type?: NotificationType;
}

export interface NotificationApiResponse {
  status: number;
  message: string;
  data: Notification[];
  dataUnit?: Notification;
}
