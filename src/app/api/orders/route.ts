import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Order } from '@/lib/models/Order';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { fullName, email, phone, address, city, state, pincode, title, price, itemId } = body;

    const newOrder = new Order({
      customerDetails: {
        name: fullName || "Anonymous Customer",
        email: email || "customer@example.com",
        phone: phone || "9876543210",
      },
      items: [
        {
          product: itemId && itemId.length === 24 ? itemId : "60c72b2f9b1d8b001c8e4d10", // valid dummy or real ObjectId
          quantity: 1,
          price: Number(price) || 14999,
          variant: { name: title || "Premium Canvas", option: "24x36 in" },
        }
      ],
      totalAmount: Number(price) || 14999,
      status: 'Pending',
      paymentStatus: 'Paid',
      shippingAddress: {
        street: address || "Flat / House No.",
        city: city || "Mumbai",
        state: state || "Maharashtra",
        zipCode: pincode || "400001",
        country: "India",
      }
    });

    await newOrder.save();

    return NextResponse.json({ message: 'Order created successfully', order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
