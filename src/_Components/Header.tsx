import Link from 'next/link';
import { getUserFromSession } from '@/lib/session';
import LogoutButton from './LogoutButton';

export default async function Header() {
  const user = await getUserFromSession();

  // ボタン用の共通スタイル
  const buttonLinkStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'white',
  };

  return (
    <header style={{
      backgroundColor: '#f8f9fa',
      padding: '0.75rem 2rem',
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Link href="/" style={{ fontWeight: 'bold', color: 'inherit', textDecoration: 'none', fontSize: '1.25rem' }}>
        My App
      </Link>

      <nav>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/login" style={buttonLinkStyle}>
              ログイン
            </Link>
            <Link href="/signup" style={buttonLinkStyle}>
              新規登録
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}