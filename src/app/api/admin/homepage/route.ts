import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { HomepageContent } from '@/lib/models/HomepageContent';

export async function GET() {
  try {
    await connectToDatabase();
    let content = await HomepageContent.findOne({});
    if (!content) {
      // Create default if none exists
      content = await HomepageContent.create({
        heroTitle: 'Your Vision, Our Canvas',
        heroSubtitle: 'Transform your favorite memories and artwork into stunning, gallery-quality canvas prints.',
        heroImage: '/hero-bg.png',
        featuredProductsTitle: 'Featured Collections',
      });
    }
    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Failed to fetch homepage content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let content = await HomepageContent.findOne({});
    if (content) {
      content = await HomepageContent.findOneAndUpdate({}, body, { new: true });
    } else {
      content = await HomepageContent.create(body);
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Failed to update homepage content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
