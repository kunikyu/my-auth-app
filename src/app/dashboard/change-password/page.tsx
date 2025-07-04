'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // 新しいパスワードが一致するかクライアントサイドでもチェック
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません。');
      return;
    }

    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage(data.message);
      // 成功したらフォームをクリア
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(data.message || 'パスワードの変更に失敗しました。');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">パスワード変更</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <div>
          <label htmlFor="currentPassword">現在のパスワード:</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="newPassword">新しいパスワード (8文字以上):</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">新しいパスワード (確認用):</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}

        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-white">
          パスワードを変更する
        </button>
      </form>
      <div className="mt-6">
        <Link href="/dashboard" className="text-indigo-600 hover:underline">
          &larr; ダッシュボードに戻る
        </Link>
      </div>
    </div>
  );
}