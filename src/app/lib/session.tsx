// app/lib/session.ts
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { nanoid } from 'nanoid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '7d';

interface SessionData {
  userId: string;
  name: string;
  email: string;
  mobile: string;
  role?: 'user' | 'admin';
}

export async function createSession(data: SessionData): Promise<string> {
  const token = await new SignJWT(data as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(new TextEncoder().encode(JWT_SECRET));

  return token;
}

export async function setSessionCookie(token: string) {
  (await cookies()).set({
    name: 'session_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  });
}

export async function getSession(): Promise<SessionData | null> {
  const token = (await cookies()).get('session_token')?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return verified.payload as unknown as SessionData;
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).set({
    name: 'session_token',
    value: '',
    expires: new Date(0),
    path: '/'
  });
}