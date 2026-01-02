// app/api/orders/[orderId]/route.ts
import { queryDB } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    // Fetch order details
    const order = await queryDB(
      `SELECT * FROM orders WHERE id = ?`,
      [orderId]
    );

    if (!order || (order as any[]).length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch order items
    const items = await queryDB(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );

    return NextResponse.json({
      ...(order as any[])[0],
      items: items || [],
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching order details' },
      { status: 500 }
    );
  }
}