# TODOアプリ - 使用方法

## 概要
TODOアプリがvarious-appプロジェクトに統合されました。

## アクセスURL
- **TODOメイン画面**: http://localhost:3000/todo
- **ダッシュボード**: http://localhost:3000/todo/dashboard

## 起動方法

### 1. フロントエンドのみ起動
```bash
cd frontend
npm run dev
```

### 2. Firebase Emulatorと一緒に起動
```bash
# Option A: フロントエンド内でエミュレータ起動
cd frontend
npm run dev:all  # Firebase Emulator + Next.js dev server

# Option B: Docker Composeで起動
cd /path/to/various-app
docker-compose up firebase-emulator
```

### 3. すべてのサービスを起動
```bash
cd /path/to/various-app
docker-compose up
# API, DB, pgAdmin, LocalStack, Firebase Emulator がすべて起動します
```

## 環境変数設定

`frontend/.env.local` に以下を追加:

```bash
# Firebase Configuration (for TODO app)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Emulator (for local development)
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
```

## Docker Composeサービス

### firebase-emulator
- **Emulator UI**: http://localhost:4000
- **Firestore**: http://localhost:8080
- **Auth**: http://localhost:9099
- **Functions**: http://localhost:5001

データは `frontend/firebase-data/` に永続化されます。

## 機能

### メイン画面 (`/todo`)
- カレンダー表示（月/週/日）
- TODO一覧表示・作成・編集・削除
- カテゴリ管理
- 進捗表示（日/週/月）
- CSVインポート

### ダッシュボード (`/todo/dashboard`)
- 今日/今週/今月の統計
- 期間別グラフ（日別/週別/月別）
- カテゴリ別分析
- 生産性指標

## トラブルシューティング

### ポートが使用中
```bash
# 使用中のポートを確認
lsof -i :8080  # Firestore
lsof -i :4000  # Emulator UI

# プロセスをkill
kill -9 <PID>
```

### Firebase Emulatorが起動しない
```bash
# Docker Composeで再起動
docker-compose restart firebase-emulator

# ログ確認
docker-compose logs -f firebase-emulator
```

## 開発コマンド

```bash
# フロントエンド開発
cd frontend
npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run format           # コードフォーマット
npm run emulator         # Firebase Emulatorのみ起動
npm run dev:all          # Emulator + Dev server

# バックエンド開発
docker-compose up api db  # APIとDBのみ起動
docker-compose logs -f api  # APIログ表示
```

## ディレクトリ構造

```
frontend/
├── src/
│   ├── app/
│   │   └── todo/              # TODOアプリのページ
│   │       ├── page.tsx       # メイン画面
│   │       └── dashboard/
│   │           └── page.tsx   # ダッシュボード
│   ├── components/
│   │   ├── todo/              # TODOコンポーネント
│   │   │   ├── calendar/      # カレンダービュー
│   │   │   └── dashboard/     # ダッシュボードコンポーネント
│   │   └── ui/                # shadcn/ui コンポーネント
│   ├── hooks/                 # カスタムフック
│   │   ├── useTodos.ts
│   │   ├── useCategories.ts
│   │   └── useAllTodos.ts
│   ├── lib/
│   │   ├── firebase.ts        # Firebase設定
│   │   └── todo/              # TODOサービス層
│   │       ├── todoService.ts
│   │       ├── categoryService.ts
│   │       ├── csvImportService.ts
│   │       ├── statisticsService.ts
│   │       └── progressUtils.ts
│   └── types/
│       └── todo.ts            # TODO型定義
├── firebase.json              # Firebase Emulator設定
└── firebase-data/             # Emulatorデータ保存先
```
