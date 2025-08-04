import { Plan } from "./plan.interface";

export interface CartItem {
  planId: string;
  plan: Plan;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  currency: string;
  userId?: string;
}