import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { CustomOrder } from '@/lib/models/CustomOrder';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const { status } = await req.json();

    const updatedOrder = await CustomOrder.findByIdAndUpdate(
      resolvedParams.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Failed to update custom order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
