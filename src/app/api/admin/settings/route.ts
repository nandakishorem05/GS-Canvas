import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Setting } from '@/lib/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Setting.findOne({});
    if (!settings) {
      settings = await Setting.create({
        storeName: 'GS Canvas',
        storeEmail: 'contact@gscanvas.com',
        storePhone: '+1 (555) 123-4567',
        currency: 'USD',
        taxRate: 5,
        shippingFee: 15,
        freeShippingThreshold: 100,
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let settings = await Setting.findOne({});
    if (settings) {
      settings = await Setting.findOneAndUpdate({}, body, { new: true });
    } else {
      settings = await Setting.create(body);
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
