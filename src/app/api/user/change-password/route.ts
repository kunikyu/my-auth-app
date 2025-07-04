import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getUserFromSession } from '@/lib/session';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // 1. ログインしているユーザーの情報を取得
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ message: '認証されていません。' }, { status: 401 });
    }

    // 2. リクエストから現在のパスワードと新しいパスワードを取得
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { message: '現在のパスワードと、8文字以上の新しいパスワードを入力してください。' },
        { status: 400 }
      );
    }

    // 3. データベースからユーザーの完全な情報を取得
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
    });
    if (!dbUser) {
      return NextResponse.json({ message: 'ユーザーが見つかりません。' }, { status: 404 });
    }

    // 4. 入力された「現在のパスワード」が正しいか検証
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      dbUser.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ message: '現在のパスワードが間違っています。' }, { status: 403 });
    }

    // 5. 新しいパスワードをハッシュ化
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 6. データベースのパスワードを更新
    await prisma.user.update({
      where: { id: user.userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ message: 'パスワードが正常に変更されました。' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'エラーが発生しました。' }, { status: 500 });
  }
}