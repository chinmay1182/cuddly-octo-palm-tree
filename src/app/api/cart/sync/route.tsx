// app/api/cart/sync/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/app/lib/db'; // Import your existing pool

export async function POST(request: Request) {
  let connection;
  try {
    // 1. Parse and validate request data
    const { userId, cartItems } = await request.json();
    
    if (!userId || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and cartItems array' },
        { status: 400 }
      );
    }

    // 2. Get a connection from the pool
    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 3. Verify user exists
      const [user] = await connection.query(
        'SELECT id FROM customers WHERE id = ?', 
        [userId]
      );
      
      if (!user) {
        await connection.rollback();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // 4. Clear existing cart
      await connection.query(
        'DELETE FROM cart_items WHERE user_id = ?', 
        [userId]
      );
      await connection.query(
        'DELETE FROM user_carts WHERE user_id = ?', 
        [userId]
      );

      // 5. Insert new cart with validated data
      const validatedItems = cartItems.map(item => ({
        id: Number(item.id),
        name: String(item.name),
        price: Number(item.price),
        image: item.image ? String(item.image) : null,
        quantity: Number(item.quantity) || 1,
        type: item.type === 'combo' ? 'combo' : 'product',
        weight: item.weight ? String(item.weight) : null
      }));

      // 6. Insert into user_carts (JSON storage)
      const [cartResult] = await connection.query(
        'INSERT INTO user_carts (user_id, cart_data) VALUES (?, ?)',
        [userId, JSON.stringify(validatedItems)]
      );

      // 7. Insert into cart_items (relational storage)
      for (const item of validatedItems) {
        await connection.query(
          `INSERT INTO cart_items (
            cart_id, user_id, 
            product_id, combo_id, 
            name, price, image_url, 
            quantity, type, weight
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            cartResult.insertId, // cart_id
            userId,             // user_id
            item.type === 'product' ? item.id : null, // product_id
            item.type === 'combo' ? item.id : null,   // combo_id
            item.name,          // name
            item.price,         // price
            item.image,         // image_url
            item.quantity,      // quantity
            item.type,          // type
            item.weight         // weight
          ]
        );
      }

      // 8. Commit transaction
      await connection.commit();

      return NextResponse.json({ 
        success: true,
        cartId: cartResult.insertId,
        itemCount: validatedItems.length
      });

    } catch (error) {
      // 9. Rollback on any error
      await connection.rollback();
      console.error('Transaction error:', error);
      throw error;
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Failed to sync cart',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    // 10. Always release connection
    if (connection) connection.release();
  }
}