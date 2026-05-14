import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch only published products, populate category name
    const products = await Product.find({ isPublished: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching public products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
