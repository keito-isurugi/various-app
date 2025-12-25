# CLAUDE.md

このファイルはClaude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## 基本ルール

- 日本語で回答して下さい。
- ユーザーからの指示や仕様に疑問などがあれば作業を中断し、質問すること。
- コードエクセレンス原則に基づきテスト駆動開発を必須で実施すること。
- TDDおよびテスト駆動開発で実践する際は、全てt-wadaの推奨する進め方に従ってください。
- リファクタリングはMartin Fowlerが推奨する進め方に従って下さい。
- セキュリティルールに従うこと。
- 強制追加など-fコマンドは禁止。
- 計画内容、進捗状況はplanフォルダを確認すること。

## 開発コマンド

### Frontend (Next.js + TypeScript)

```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server (http://localhost:3000)
npm run dev:all     # Start Next.js + Firebase Emulator
npm run build       # Build for production
npm run test        # Run Jest tests
npm run format      # Format code with Biome
npx biome check src/  # Lint check
npx biome check --write src/  # Auto-fix lint errors
```

### Backend (Go + Echo)

```bash
# All backend services run via Docker Compose
docker-compose up -d    # Start all services (API, DB, pgAdmin, LocalStack, Firebase Emulator)
docker-compose down     # Stop all services
docker-compose logs -f api  # View API logs
docker-compose up firebase-emulator  # Start only Firebase Emulator for TODO app
```

The Go backend uses Air for hot-reloading - changes to `.go` files automatically rebuild.

### TODO App Development
```bash
cd frontend
npm run dev:all         # Start Next.js dev server + Firebase Emulator
npm run emulator        # Start Firebase Emulator only
```

## アーキテクチャ概要

### various-app

ブログプラットフォームとコンテンツシンジケーション機能を持つフルスタックアプリケーション。

### Backend Architecture (Go Clean Architecture)

- **Domain Layer** (`domain/`): ビジネスロジックとエンティティ
- **Application Layer** (`application/`): ユースケースとアプリケーションサービス
- **Infrastructure Layer** (`infrastructure/`): DB、外部サービス統合
- **Presentation Layer** (`presentation/`): HTTPハンドラー、ルーティング

### Frontend Architecture (Next.js App Router)

- **App Router**: Next.js 15 App Router パターン
- **Components**: `/src/components/` - 再利用可能なUIコンポーネント
- **Hooks**: `/src/hooks/` - カスタムフック
- **Types**: `/src/types/` - TypeScript型定義
- **Utils**: `/src/utils/` - ユーティリティ関数
- **Lib**: `/src/lib/` - ライブラリ統合（Firebase等）

### 主要機能

1. **ブログシステム**:
   - Notionからコンテンツ取得
   - マークダウンファイルへ変換
   - Gitへ自動コミット
   - Qiita/Zennへ公開
   - Twitter/Xへ投稿

2. **画像管理**:
   - S3へアップロード
   - タグ管理
   - 画像-タグ多対多リレーション

3. **TODOアプリ** (`/todo`):
   - カレンダービュー（月/週/日）でのタスク管理
   - カテゴリ/タグ整理
   - 進捗トラッキング（日次/週次/月次）
   - 統計・分析ダッシュボード
   - CSVインポート/エクスポート
   - Firebase Firestore データ永続化

## 開発環境・ワークフロー

### Environment Setup

1. Copy `.env.example` to `.env` in the root directory
2. Frontend requires `.env.local` file with:
   - `NOTION_DATABASE_ID` - Notion database ID
   - `NEXT_PUBLIC_API_BASE_URL` - Backend API URL
   - Firebase credentials (for TODO app)
   - `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` for local development

### Testing Strategy

- **Frontend**: Jest with jsdom (`npm run test`)
- **Backend**: Go test（現在テストファイルなし）

## ディレクトリ構成

### Backend (`backend/`)

```
backend/
├── cmd/                    # アプリケーションエントリーポイント
├── domain/                 # ドメイン層（エンティティ、ビジネスロジック）
├── application/            # アプリケーション層（ユースケース）
├── infrastructure/         # インフラ層（DB、外部サービス）
├── presentation/           # プレゼンテーション層（ハンドラー）
│   └── handler/            # HTTPハンドラー
├── server/                 # サーバー設定、ルーティング
├── persist/                # 永続化関連
├── DDL/                    # データベースマイグレーション
└── docker/                 # Docker設定
```

### Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── app/                # Next.js App Router ページ
│   │   ├── blog/           # ブログ機能
│   │   ├── todo/           # TODOアプリ
│   │   ├── admin/          # 管理画面
│   │   └── api/            # APIルート
│   ├── components/         # UIコンポーネント
│   │   ├── ui/             # shadcn/ui コンポーネント
│   │   └── ...             # 機能別コンポーネント
│   ├── hooks/              # カスタムフック
│   ├── types/              # TypeScript型定義
│   ├── utils/              # ユーティリティ関数
│   ├── lib/                # ライブラリ統合
│   ├── data/               # データ関連
│   └── css/                # スタイル
└── public/                 # 静的ファイル
```

## Claude設定 (`.claude/`)

```
.claude/
├── agents/                          # エージェント定義
├── commands/                        # コマンド定義
├── rules/                           # ルール定義
│   ├── backend/                     # Go/Echo用ルール
│   └── frontend/                    # Next.js/React用ルール
├── skills/                          # スキル定義
└── workflows/                       # ワークフロー定義
```

## 作業完了通知

Agentの作業が完了したら、以下のコマンドを実行して通知音を鳴らすこと：

```bash
afplay /System/Library/Sounds/Submarine.aiff
```
