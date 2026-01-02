// app/api/cart/get/route.ts
import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Get cart data
    const [cart] = await queryDB(
      'SELECT cart_data FROM user_carts WHERE user_id = ?',
      [userId]
    );

    if (!cart) {
      return NextResponse.json({ cartItems: [] }, { status: 200 });
    }

    // Also get items from cart_items table for verification
    const [items] = await queryDB(
      'SELECT * FROM cart_items WHERE user_id = ?',
      [userId]
    );

    return NextResponse.json({ 
      cartItems: JSON.parse(cart.cart_data) 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}