import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, phone, state, city, description } = await request.json();
    
    if (!name || !email || !phone || !state || !city || !description) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const result = await queryDB(
      'INSERT INTO partner_queries (name, email, phone, state, city, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, state, city, description]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Partner query submitted successfully',
      id: result.insertId
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}