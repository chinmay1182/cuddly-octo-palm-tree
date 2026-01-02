import { NextRequest, NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { createSession, setSessionCookie } from '@/app/lib/session';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();
    if (!phone || !password) {
      return NextResponse.json(
        { error: 'Phone number and password are required' },
        { status: 400 }
      );
    }

    const results = await queryDB(
      'SELECT id, name, email, mobile, password FROM customers WHERE mobile = ?',
      [phone]
    );

    if (!results || results.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = results[0];

    // Verify Password
    // Handle cases where existing users might not have a password set yet (optional safety check)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Please reset your password or contact support.' },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const sessionToken = await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: 'user'
    });

    await setSessionCookie(sessionToken);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}