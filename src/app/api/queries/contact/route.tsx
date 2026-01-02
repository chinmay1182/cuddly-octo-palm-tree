import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, description } = await request.json();
    
    if (!name || !email || !description) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await queryDB(
      'INSERT INTO contact_messages (name, email, description) VALUES (?, ?, ?)',
      [name, email, description]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Contact message submitted successfully',
      id: result.insertId
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}