// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { destroySession } from '@/app/lib/session';

export async function POST() {
  try {
    await destroySession();
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}