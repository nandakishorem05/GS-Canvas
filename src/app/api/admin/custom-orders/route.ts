import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { CustomOrder } from '@/lib/models/CustomOrder';

export async function GET() {
  try {
    await connectToDatabase();
    const customOrders = await CustomOrder.find({}).sort({ createdAt: -1 });
    return NextResponse.json(customOrders);
  } catch (error: any) {
    console.error('Failed to fetch custom orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
