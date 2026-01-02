import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { handleFileUpload, deleteFile } from '@/app/lib/fileUpload';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = await queryDB('SELECT * FROM reviews ORDER BY created_at DESC');
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const review = formData.get('review')?.toString();
    const rating = formData.get('rating')?.toString() || '5';
    const image = formData.get('image') as File | null;

    if (!name || !review) {
      return NextResponse.json({ error: 'Name and review are required' }, { status: 400 });
    }

    let image_url = null;
    if (image) {
      image_url = await handleFileUpload(image, 'reviews');
    }

    await queryDB(
      'INSERT INTO reviews (name, review, rating, image_url) VALUES (?, ?, ?, ?)',
      [name, review, parseInt(rating), image_url]
    );

    return NextResponse.json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    // Get file path to delete image
    const reviews = await queryDB('SELECT image_url FROM reviews WHERE id = ?', [id]) as any[];
    if (reviews.length > 0 && reviews[0].image_url) {
      await deleteFile(reviews[0].image_url);
    }

    await queryDB('DELETE FROM reviews WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
