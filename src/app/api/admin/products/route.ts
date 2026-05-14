import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';
import { Category } from '@/lib/models/Category';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Populate category to get the name instead of just ObjectId
    const products = await Product.find({}).populate('category', 'name').sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.description || !body.price || !body.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = new Product({
      title: body.title,
      description: body.description,
      price: body.price,
      offerPrice: body.offerPrice,
      category: body.category,
      stockQuantity: body.stockQuantity || 0,
      images: body.images || [],
      tags: body.tags || [],
      variants: body.variants || [],
      isFeatured: body.isFeatured || false,
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
    });

    await newProduct.save();

    return NextResponse.json({ message: 'Product created successfully', product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
