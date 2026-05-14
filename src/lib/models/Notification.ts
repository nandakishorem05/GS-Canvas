import 'server-only';
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  message: string;
  type: 'order' | 'custom_order' | 'system';
  isRead: boolean;
  relatedId?: string; // e.g. Order ID
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ['order', 'custom_order', 'system'], default: 'system' },
    isRead: { type: Boolean, default: false },
    relatedId: { type: String },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

