import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const email = username; // Assuming username is the email for Supabase auth    

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful' }, { status: 200 });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
} 