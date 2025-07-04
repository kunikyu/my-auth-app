import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { cache } from 'react';

// cache() を使うことで、同じリクエスト内で複数回呼び出されても、
// 実際のトークン検証は一度しか実行されないように最適化されます。
export const getUserFromSession = cache(async () => {
  const token = cookies().get('session-token')?.value;

  if (!token) {
    return null;
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error("JWT Secret Key is not defined.");
    }
    const key = new TextEncoder().encode(secretKey);

    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload as { userId: string; email: string; iat: number; exp: number };
  } catch (err) {
    console.error("Failed to verify session token:", err);
    return null;
  }
});