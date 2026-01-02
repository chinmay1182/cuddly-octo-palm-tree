import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';

export async function GET() {
    try {
        const orders = await queryDB(
            'SELECT * FROM orders ORDER BY created_at DESC'
        );
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
            );
        }

        await queryDB('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

        return NextResponse.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json(
            { error: 'Failed to update order' },
            { status: 500 }
        );
    }
}
