import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'K8m9NpQr7StUvWxYz2A5bCdEfGhJkLmNpQrStUvWxYz2A5bCdEfGhJkLmNpQr7St';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }
    console.log("username",username);
    // 1. Find user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError && userError.code !== 'PGRST116') { // Ignore "no rows found" error for now
      console.error('Supabase error finding user:', userError);
      return NextResponse.json({ message: 'Database error.' }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // 2. Check for account lock
    if (user.is_locked && user.last_login_attempt) {
        const lockTime = new Date(user.last_login_attempt).getTime() + LOCKOUT_DURATION_MINUTES * 60 * 1000;
        if (lockTime > Date.now()) {
            return NextResponse.json({ message: 'Account is temporarily locked. Please try again later.' }, { status: 403 });
        }
    }

    // 3. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      const newAttempts = (user.failed_login_attempts || 0) + 1;
      let isLocked = user.is_locked;
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          isLocked = true;
      }

      await supabase
        .from('users')
        .update({ failed_login_attempts: newAttempts, is_locked: isLocked, last_login_attempt: new Date().toISOString() })
        .eq('id', user.id);

      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    // 4. On successful login, reset attempts and create session
    await supabase
      .from('users')
      .update({ failed_login_attempts: 0, is_locked: false, last_login_attempt: null })
      .eq('id', user.id);

    // 5. Create JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    // 6. Set session cookie
    cookies().set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
