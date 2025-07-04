import Link from 'next/link';
import { getUserFromSession } from '@/lib/session';

// このファイルではLogoutButtonを使わないので、インポート文も削除します
// import LogoutButton from '@/components/LogoutButton';

export default async function HomePage() {
  const user = await getUserFromSession();

  return (
    <div>
      <h1>トップページ</h1>

      {user ? (
        // --- ログインしている場合に表示 ---
        <div>
          <p>ようこそ, {user.email} さん</p>
          <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/dashboard">ダッシュボードへ</Link>
            {/* ここにあった <LogoutButton /> を削除しました */}
          </nav>
        </div>
      ) : (
        // --- ログインしていない場合に表示 ---
        <div>
          <p>ログインしていません。</p>
          <nav style={{ marginTop: '1rem' }}>
            <Link href="/login">ログインページへ</Link>
          </nav>
        </div>
      )}
    </div>
  );
}