import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  const { fullName, username, email, password } = await req.json();

  // 1. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username,
      },
    },
  });

  if (authError) {
    return NextResponse.json({ message: authError.message }, { status: 400 });
  }

  if (!authData.user) {
    return NextResponse.json({ message: "Registration failed: no user returned" }, { status: 500 });
  }

  return NextResponse.json({ message: "Registration successful! Please check your email to confirm your account." }, { status: 201 });
}
