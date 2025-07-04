# Next.js カスタム認証機能 サンプルアプリ

このプロジェクトは、Next.js (App Router) を使用して、**認証機能の実装を学習する目的で作成された**サンプルアプリケーションです。認証ライブラリに頼らず、トークンベースの認証機能をゼロから実装しています。
また、このプロジェクトは生成AI(google gemini)を使用しています。

---

## 主な機能

このアプリケーションには、基本的なWebサイトに必要な認証・認可機能が一通り含まれています。

-   **トークンベース認証**: JWT (JSON Web Token) を `HttpOnly` Cookie に保存する安全な認証方式。
-   **新規アカウント登録**: メールアドレスとパスワードで新しいアカウントを作成できます。
-   **ログイン・ログアウト**: 登録した情報でログイン・ログアウトが可能です。
-   **パスワード変更**: ログイン中のユーザーが、現在のパスワードを検証した上で新しいパスワードに変更できます。
-   **アカウントロック**: 連続で5回ログインに失敗すると、アカウントが1分間ロックされます。
-   **セッションタイムアウト**: ログイン後、5分間操作がないとセッションが切れ、再ログインが必要になります。
-   **ログインIDの保存**: 「次回から自動入力する」機能により、メールアドレスをブラウザに記憶させることができます。
-   **動的なヘッダー**: ログイン状態に応じて、表示されるメニュー（メールアドレス/ログアウトボタン、ログイン/新規登録ボタン）が切り替わります。
-   **保護されたルート**: Middlewareを使用し、未ログインのユーザーが特定のページ（例: `/dashboard`）にアクセスするのを防ぎます。

---

## スクリーンショット

### トップページ（未ログイン時）
ユーザーがサイトに最初に訪れた際に表示されるページです。ヘッダーにはログインと新規登録へのリンクがあります。

![未ログイン時のトップページ](https://github.com/kunikyu/my-auth-app/blob/images/img/page-home-loggedout.png?raw=true)

### トップページ（ログイン時）
ログインに成功すると、ヘッダーにユーザーのメールアドレスとログアウトボタンが表示され、パーソナライズされたウェルカムメッセージが表示されます。

![ログイン時のトップページ](https://github.com/kunikyu/my-auth-app/blob/images/img/page-home-loggedin.png?raw=true)

### ログイン画面
既存のユーザーがログインするための画面です。「次回から自動入力する」チェックボックスのほか、複数回パスワードを間違えるとアカウントがロックされたことを伝えるメッセージも表示されます。


![ログイン画面](https://github.com/kunikyu/my-auth-app/blob/images/img/page-login.png?raw=true)

### ダッシュボード
ログインしたユーザーのみがアクセスできる保護されたページです。このページからパスワード変更ページへアクセス可能です。

![ダッシュボード](https://github.com/kunikyu/my-auth-app/blob/images/img/page-dashboard.png?raw=true)

### パスワード変更画面
ログイン中のユーザーがパスワードを変更するための専用ページです。変更には、現在のパスワードと新しいパスワード（確認用含め2回）の入力が必要です。

![パスワード変更画面](https://github.com/kunikyu/my-auth-app/blob/images/img/page-change-password.png?raw=true)


---

## 使用技術

-   **フレームワーク**: Next.js 14 (App Router)
-   **言語**: TypeScript
-   **データベース**: Prisma, SQLite
-   **認証**: `jose` (JWT), `bcryptjs` (パスワードハッシュ化)
-   **スタイリング**: インラインCSS

---

## セットアップと実行方法

1.  **リポジトリをクローン**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **依存関係をインストール**:
    ```bash
    npm install
    ```

3.  **環境変数を設定**:
    プロジェクトのルートに`.env`ファイルを作成し、以下の内容を記述します。`JWT_SECRET_KEY`には必ずご自身で考えた、長くてランダムな文字列を設定してください。
    ```env
    # Prismaが使用するデータベースファイルのパス
    DATABASE_URL="file:./dev.db"

    # JWTの署名に使用する秘密鍵
    JWT_SECRET_KEY="your-super-secret-and-long-random-string"
    ```

4.  **データベースをセットアップ**:
    以下のコマンドで、`prisma/schema.prisma`に基づいてデータベースとテーブルを作成します。
    ```bash
    npx prisma db push
    npx prisma generate
    ```

5.  **初期データを投入 (任意)**:
    テスト用のユーザー (mail-adress: `test@example.com`, password: `password123`) を作成するために、以下のシードコマンドを実行します。
    ```bash
    npx prisma db seed
    ```

6.  **開発サーバーを起動**:
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:3000` を開きます。

---

## ディレクトリ構成

主要なファイルの構成です。

```
my-auth-app/
├── 📁 prisma/
│   ├── 📄 dev.db
│   ├── 📄 schema.prisma
│   └── 📄 seed.ts
├── 📁 src/
│   ├── 📁 _Components/
│   │   ├── 📄 Header.tsx
│   │   └── 📄 LogoutButton.tsx
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 logout/
│   │   │   │   └── 📄 route.ts
│   │   │   ├── 📁 signup/
│   │   │   │   └── 📄 route.ts
│   │   │   └── 📁 user/
│   │   │       └── 📁 change-password/
│   │   │           └── 📄 route.ts
│   │   ├── 📁 dashboard/
│   │   │   ├── 📄 page.tsx
│   │   │   └── 📁 change-password/
│   │   │       └── 📄 page.tsx
│   │   ├── 📁 login/
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 signup/
│   │   │   └── 📄 page.tsx
│   │   ├── 📄 globals.css
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 lib/
│   │   └── 📄 session.ts
│   └── 📄 middleware.ts
├── 📄 .env
├── 📄 .gitignore
├── 📄 next.config.mjs
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 README.md
└── 📄 tsconfig.json
```
