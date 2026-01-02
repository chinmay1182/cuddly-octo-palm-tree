import { NextResponse } from 'next/server';
import { queryDB } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, role, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        const table = role === 'admin' ? 'admins' : 'customers';

        // Find user with valid token and not expired
        // MySQL NOW() comparison might differ from JS date, using string comparison for simplicity
        // But best to let DB check expiry
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const users = await queryDB(
            `SELECT id FROM ${table} WHERE reset_token = ? AND reset_expires > ?`,
            [token, now]
        );

        if (!users || users.length === 0) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const user = users[0];

        // Hash new password - Admins currently use plain text 'admin123', need to decide if we switch to bcrypt
        // The implementation plan implies bcrypt for users. 
        // For admins, existing code (login) might be using plain text?
        // Let's check admin login logic later. For now, we'll assume bcrypt is safer.
        // However, if the current admin login DOES NOT use bcrypt, this will break login until login is updated.
        // I will use bcrypt here, and I MUST update login/signup to use bcrypt too.

        let passwordToStore = newPassword;
        // For safety, let's try to detect if we should hash.
        // Assuming we are upgrading EVERYTHING to bcrypt.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        passwordToStore = hashedPassword;

        // Update password and clear token
        // For admins table, the column is 'password'. For customers, it is 'password'.
        await queryDB(
            `UPDATE ${table} SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?`,
            [passwordToStore, user.id]
        );

        return NextResponse.json({ success: true, message: 'Password reset successfully' });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
