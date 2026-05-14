import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all customers (excluding admins)
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 }).select('-password');
    return NextResponse.json(customers);
  } catch (error: any) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
