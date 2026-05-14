import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { User } from '@/lib/models/User';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const { status } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      resolvedParams.id,
      { status },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('Failed to update customer status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
