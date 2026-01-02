// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { getSession } from '@/app/lib/session';

interface CartItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const { cartItems, total }: { cartItems?: CartItem[]; total?: number } = requestBody;

    // Input Validation
    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    if (!session.mobile) {
      return NextResponse.json(
        { error: 'User mobile number is required', field: 'mobile' },
        { status: 400 }
      );
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Database Transaction
    await queryDB('START TRANSACTION');

    try {
      const orderResult: any = await queryDB(
        `INSERT INTO orders
         (user_id, user_name, user_email, user_mobile, total_amount, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [session.userId, session.name, session.email, session.mobile, total]
      );

      const orderId = orderResult.insertId;

      const orderItemsValues = cartItems.map(item => [
        orderId,
        item.id,
        item.name,
        item.quantity,
        item.price
      ]);

      if (orderItemsValues.length > 0) {
        await queryDB(
          `INSERT INTO order_items
           (order_id, product_id, product_name, quantity, price)
           VALUES ?`,
          [orderItemsValues]
        );
      }

      await queryDB('COMMIT');

      return NextResponse.json({
        success: true,
        orderId,
        message: 'Order placed successfully'
      });

    } catch (dbError: any) {
      await queryDB('ROLLBACK');
      return NextResponse.json(
        { error: 'Database error', details: dbError.message },
        { status: 500 }
      );
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Checkout failed', details: error.message },
      { status: 500 }
    );
  }
}