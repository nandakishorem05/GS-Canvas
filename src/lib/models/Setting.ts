import 'server-only';
import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  websiteName: string;
  logoUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  footerText?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema(
  {
    websiteName: { type: String, required: true, default: 'My E-Commerce' },
    logoUrl: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
    },
    seo: {
      metaTitle: { type: String, default: 'My E-Commerce Store' },
      metaDescription: { type: String, default: 'Best products online' },
      keywords: { type: String, default: 'ecommerce, shop, online' },
    },
    contactInfo: {
      email: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    footerText: { type: String },
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

