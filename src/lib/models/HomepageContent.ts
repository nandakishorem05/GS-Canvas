import 'server-only';
import mongoose, { Schema, Document } from 'mongoose';

export interface IHomepageContent extends Document {
  banners: { imageUrl: string; link?: string }[];
  heroTitle: string;
  heroSubtitle: string;
  promotionalTexts: string[];
  coverPageImages: string[];
  sectionsEnabled: {
    featuredProducts: boolean;
    categories: boolean;
    promotions: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HomepageContentSchema = new Schema(
  {
    banners: [
      {
        imageUrl: { type: String, required: true },
        link: { type: String },
      },
    ],
    heroTitle: { type: String, default: 'Welcome to Our Store' },
    heroSubtitle: { type: String, default: 'Discover the best products' },
    promotionalTexts: [{ type: String }],
    coverPageImages: [{ type: String }],
    sectionsEnabled: {
      featuredProducts: { type: Boolean, default: true },
      categories: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const HomepageContent =
  mongoose.models.HomepageContent ||
  mongoose.model<IHomepageContent>('HomepageContent', HomepageContentSchema);

