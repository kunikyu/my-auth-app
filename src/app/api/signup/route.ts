import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // 1. 入力値のバリデーション（簡易的）
    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { message: 'メールアドレス、または8文字以上のパスワードを入力してください。' },
        { status: 400 }
      );
    }

    // 2. ユーザーが既に存在するかチェック
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'このメールアドレスは既に使用されています。' },
        { status: 409 } // 409 Conflict: 競合
      );
    }

    // 3. パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 新しいユーザーをデータベースに作成
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'アカウント登録が完了しました。' }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'エラーが発生しました。' }, { status: 500 });
  }
}