// app/api/session/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        mobile: session.mobile,
        role: session.role
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Session check failed' },
      { status: 500 }
    );
  }
}