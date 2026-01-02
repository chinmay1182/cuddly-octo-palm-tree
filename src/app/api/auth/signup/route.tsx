// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { createSession, setSessionCookie } from '@/app/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await queryDB('SELECT * FROM customers WHERE mobile = ?', [phone]) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await queryDB(
      'INSERT INTO customers (name, email, mobile, password) VALUES (?, ?, ?, ?)',
      [name, email, phone, hashedPassword]
    ) as any;

    const userId = result.insertId;

    // Create empty cart for the new user
    await queryDB(
      'INSERT INTO user_carts (user_id, cart_data) VALUES (?, ?)',
      [userId, JSON.stringify([])]
    );

    // Create session token (store as phone)
    const sessionToken = await createSession({
      userId: userId.toString(),
      name,
      email,
      phone,
      role: 'user'
    });

    // Set session cookie
    await setSessionCookie(sessionToken);

    // Return user data with correct key
    return NextResponse.json(
      {
        user: {
          id: userId,
          name,
          email,
          phone
        },
        cartItems: []
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
