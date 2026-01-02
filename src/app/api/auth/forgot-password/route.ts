import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import { sendEmail } from '@/app/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email, role } = await request.json(); // role: 'user' | 'admin'

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const table = role === 'admin' ? 'admins' : 'customers';

        // Check if user exists
        const users = await queryDB(`SELECT id, name FROM ${table} WHERE email = ?`, [email]);

        if (!users || users.length === 0) {
            // For security, don't reveal if user exists, but here detailed for dev
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const user = users[0];

        // Generate Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

        // Save Token to DB
        // Formatting date for MySQL: YYYY-MM-DD HH:MM:SS
        const expiresForDb = resetExpires.toISOString().slice(0, 19).replace('T', ' ');

        await queryDB(
            `UPDATE ${table} SET reset_token = ?, reset_expires = ? WHERE id = ?`,
            [resetToken, expiresForDb, user.id]
        );

        // Send Email
        // Note: In production, use your actual domain. Here assuming localhost for dev.
        // Ideally this URL comes from an environment variable.
        // For local dev with default port 3000:
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&role=${role}`;

        const message = `
      <h1>Password Reset Request</h1>
      <p>Hi ${user.name || 'User'},</p>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

        await sendEmail(email, 'Password Reset Request - Shree Bandhu', message);

        return NextResponse.json({ success: true, message: 'Reset link sent to email' });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
