import { PrismaClient } from '@prisma/client';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
  throw new Error("JWT_SECRET_KEY is not defined in .env.local");
}
const key = new TextEncoder().encode(secretKey);

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME_IN_MINUTES = 1;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: 'メールアドレスまたはパスワードが違います' }, { status: 401 });
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const now = new Date();
      const lockedUntil = user.lockedUntil;
      const remainingMs = lockedUntil.getTime() - now.getTime();

      // 残り時間を分と秒に変換（小数点以下切り上げ）
      const remainingSecondsTotal = Math.ceil(remainingMs / 1000);
      const remainingMinutes = Math.floor(remainingSecondsTotal / 60);
      const remainingSeconds = remainingSecondsTotal % 60;

      // 分が残っている場合と秒だけの場合でメッセージを調整
      let timeMessage = "";
      if (remainingMinutes > 0) {
        timeMessage = `${remainingMinutes}分${remainingSeconds}秒`;
      } else {
        timeMessage = `${remainingSeconds}秒`;
      }

      const message = `アカウントはロックされています。あと${timeMessage}後に再度お試しください。`;
      return NextResponse.json({ message }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      await prisma.user.update({
        where: { email },
        data: { failedLoginAttempts: 0, lockedUntil: null },
      });

      const token = await new SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('5m')
        .sign(key);

      cookies().set('session-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax' });
      
      return NextResponse.json({ message: 'ログイン成功' });
    }

    const newAttempts = user.failedLoginAttempts + 1;
    const dataToUpdate: { failedLoginAttempts: number, lockedUntil?: Date } = { failedLoginAttempts: newAttempts };

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_TIME_IN_MINUTES * 60 * 1000);
      dataToUpdate.lockedUntil = lockedUntil;
    }
    
    await prisma.user.update({
      where: { email },
      data: dataToUpdate,
    });

    return NextResponse.json({ message: 'メールアドレスまたはパスワードが違います' }, { status: 401 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'エラーが発生しました' }, { status: 500 });
  }
}