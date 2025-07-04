'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.refresh();
  };

  return (
    <button onClick={handleLogout} style={{
      padding: '0.5rem 1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      cursor: 'pointer',
      background: 'white',
      color: 'inherit',
      fontSize: 'inherit',
    }}>
      ログアウト
    </button>
  );
}