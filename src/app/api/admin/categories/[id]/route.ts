import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Category } from '@/lib/models/Category';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const deletedCategory = await Category.findByIdAndDelete(resolvedParams.id);
    if (!deletedCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
