import 'server-only';
import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomOrder extends Document {
  user?: mongoose.Types.ObjectId;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  customerDesignImage?: string;
  textRequirements: string;
  status: 'Pending' | 'In Review' | 'Accepted' | 'Rejected' | 'Completed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomOrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    customerDesignImage: { type: String },
    textRequirements: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Review', 'Accepted', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export const CustomOrder = mongoose.models.CustomOrder || mongoose.model<ICustomOrder>('CustomOrder', CustomOrderSchema);

