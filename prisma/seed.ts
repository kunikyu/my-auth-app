import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Prismaクライアントのインスタンスを作成
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- ここから初期データを作成 ---

  // 1. テスト用のユーザー情報を定義
  const email = 'test@example.com';
  const password = 'password123'; // ログイン時に使用するパスワード

  // 2. パスワードをハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. 既存のユーザーがいるか確認し、いなければ作成する
  const user = await prisma.user.upsert({
    where: { email: email }, // このメールアドレスでユーザーを検索
    update: {}, // ユーザーが存在する場合は何もしない
    create: {   // ユーザーが存在しない場合に作成するデータ
      email: email,
      password: hashedPassword,
    },
  });

  console.log(`Created user with email: ${user.email}`);
  
  // --- ここまで ---

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Prismaクライアントとの接続を閉じる
    await prisma.$disconnect();
  });