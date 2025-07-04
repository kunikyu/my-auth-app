import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  console.log(`\n[Middleware] Path: ${req.nextUrl.pathname}`);

  const token = req.cookies.get('session-token')?.value;

  if (!token) {
    console.log('[Middleware] Token not found in cookies.');
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('[Middleware] Redirecting to /login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  console.log('[Middleware] Token found. Verifying...');

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error('JWT_SECRET_KEY is not set in .env.local');
    }
    const key = new TextEncoder().encode(secretKey);
    await jwtVerify(token, key, { algorithms: ['HS256'] });

    console.log('[Middleware] ✅ Token verification successful!');
    return NextResponse.next();

  } catch (err) {
    // --- ここから修正 ---
    let errorMessage = "An unknown error occurred";
    // errがErrorオブジェクトのインスタンスであるかを確認する
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    console.error('[Middleware] ❌ Token verification failed:', errorMessage);
    // --- ここまで修正 ---

    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('[Middleware] Redirecting to /login due to verification failure.');
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('session-token');
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};