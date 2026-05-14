import 'server-only';
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  offerPrice?: number;
  category: mongoose.Types.ObjectId;
  stockQuantity: number;
  images: string[];
  tags: string[];
  variants?: { name: string; options: string[] }[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stockQuantity: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    tags: [{ type: String }],
    variants: [
      {
        name: { type: String },
        options: [{ type: String }],
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

