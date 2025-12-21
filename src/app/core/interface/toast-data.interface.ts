import { ToastAction } from "./toast-action.interface";

export interface ToastData {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  closable?: boolean;
  persistent?: boolean;
  actions?: ToastAction[];
}