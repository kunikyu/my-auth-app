import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">ようこそ、ダッシュボードへ！</h1>
            <p className="mb-6">このページはログインしたユーザーだけが見ることができます。</p>
            
            <nav>
                <Link href="/dashboard/change-password" className="text-indigo-600 hover:underline">
                    パスワードを変更する
                </Link>
            </nav>
        </div>
    )
}