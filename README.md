# various-app

個人ブログサイト・物理計算ツール・筋トレ記録アプリを統合したフルスタックWebアプリケーション

## 🚀 概要

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Go (Echo) + PostgreSQL 
- **CMS**: Notion (ヘッドレスCMS)
- **Deploy**: Vercel (Frontend) + Docker Compose (Backend)
- **Code Quality**: Biome + Husky + TypeScript

## 📱 主要機能

### 1. ブログシステム
- **Notion連携**: Notionで記事を作成・更新すると自動的にサイトに反映
- **マルチプラットフォーム投稿**: Qiita・Zenn・X(Twitter)への自動投稿
- **Markdown対応**: 記事はMarkdown形式で管理・表示
- **レスポンシブデザイン**: モバイル・デスクトップ対応

### 2. 物理計算ツール (`/calculator`)
- **シュワルツシルト半径計算**: ブラックホールの事象の地平面計算
- **天体選択機能**: 太陽系の天体と有名な恒星から質量を選択
- **質量比較表示**: 身近な例での質量の大きさ比較
- **拡張可能設計**: 将来的に他の物理計算も追加予定

### 3. BIG3筋トレ記録 (`/big3`)
- **体重・重量入力**: ベンチプレス・スクワット・デッドリフト記録
- **目標重量計算**: 理想的な重量バランス表示
- **データ可視化**: 進捗グラフとデータテーブル

### 4. プレイグラウンド (`/playground`)
- **リアルタイムプレビュー**: HTML・CSS・JavaScript実行環境
- **エラー検出**: 構文エラーの自動検出・表示
- **テーマ切り替え**: ダーク・ライトモード対応

### 5. 画像管理システム (`/admin`)
- **S3連携**: AWS S3への画像アップロード
- **タグ管理**: 画像の分類・検索機能
- **管理画面**: 画像とタグの関連付け管理

## 🛠️ 技術スタック

### Frontend
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "ui": "React 18",
  "testing": "Jest + Testing Library",
  "formatting": "Biome",
  "hooks": "Husky + lint-staged"
}
```

### Backend
```go
// Go + Echo Framework
- Clean Architecture
- GORM ORM
- PostgreSQL Database
- AWS S3 Integration
- Structured Logging (Zap)
- Hot Reload (Air)
```

### Infrastructure
```yaml
services:
  - PostgreSQL: データベース
  - pgAdmin: データベース管理
  - LocalStack: AWS S3 ローカル環境
  - Docker Compose: 開発環境構築
```

## 🏗️ プロジェクト構成

```
various-app/
├── frontend/                 # Next.js アプリケーション
│   ├── src/
│   │   ├── app/             # App Router ページ
│   │   │   ├── calculator/  # 物理計算ツール
│   │   │   ├── big3/        # 筋トレ記録
│   │   │   ├── playground/  # コードプレイグラウンド
│   │   │   └── admin/       # 画像管理
│   │   ├── components/      # 再利用可能コンポーネント
│   │   ├── utils/          # ユーティリティ関数
│   │   ├── types/          # TypeScript型定義
│   │   └── data/           # 静的データ
│   ├── biome.json          # コードフォーマット設定
│   └── package.json
├── backend/                 # Go API サーバー
│   ├── domain/             # ドメインロジック
│   ├── application/        # アプリケーションサービス
│   ├── infrastructure/     # インフラストラクチャ
│   ├── presentation/       # プレゼンテーション層
│   └── DDL/               # データベースマイグレーション
├── .husky/                 # Git hooks
└── docker-compose.yml     # 開発環境設定
```

## 🚦 開発コマンド

### Frontend開発
```bash
cd frontend
npm install              # 依存関係インストール
npm run dev             # 開発サーバー起動 (http://localhost:3000)
npm run build           # プロダクションビルド
npm run test            # テスト実行
npm run format          # コードフォーマット
npm run lint            # Lint実行
npm run typecheck       # 型チェック
```

### Backend開発
```bash
# Docker Composeで全サービス起動
docker-compose up -d    # バックグラウンド起動
docker-compose down     # サービス停止
docker-compose logs -f api  # APIログ表示

# 個別サービス確認
- API: http://localhost:8080
- pgAdmin: http://localhost:5050
- LocalStack: http://localhost:4566
```

## 🔧 環境設定

### 1. 環境変数設定
```bash
# ルートディレクトリに .env ファイルを作成
cp .env.example .env

# フロントエンド用 .env.local ファイルを作成
cd frontend
cp .env.local.example .env.local
```

### 2. 必要な環境変数
```bash
# Notion API
NOTION_DATABASE_ID=your_notion_database_id

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Database (docker-compose.yml で自動設定)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=kei_talk
```

## 📊 データベース

### マイグレーション
PostgreSQLマイグレーションは `/backend/DDL/` に配置され、コンテナ起動時に自動実行されます：

- `000001_create_images_table.up.sql` - 画像テーブル
- `000002_create_tags_table.up.sql` - タグテーブル  
- `000003_create_image_tags_table.up.sql` - 画像-タグ関連テーブル

### 管理画面
pgAdmin: http://localhost:5050
- Email: `admin@example.com`
- Password: `.env` ファイルで設定

## 🔍 コード品質管理

### Git Hooks (Husky)
```bash
# コミット前: コードフォーマット・Lint・型チェック
git commit -m "feat: new feature"

# プッシュ前: テスト・ビルドチェック
git push origin main
```

### コミットメッセージ規則
```bash
# 形式: <type>(<scope>): <description>
feat(calculator): add celestial body selector
fix(big3): resolve weight input validation
docs(readme): update project structure
```

## 🌐 API エンドポイント

### ブログAPI
- `GET /api/blog/posts` - 記事一覧取得
- `GET /api/blog/posts/[id]` - 記事詳細取得

### 画像管理API
- `GET /api/images` - 画像一覧取得
- `POST /api/images` - 画像アップロード
- `GET /api/tags` - タグ一覧取得
- `POST /api/tags` - タグ作成

## 📈 外部サービス連携

### Notion API
- **公式ドキュメント**: https://developers.notion.com/docs/getting-started
- **機能**: 記事の自動取得・Markdown変換

### Qiita自動投稿
- **ライブラリ**: [qiita-js](https://github.com/increments/qiita-js)
- **公式API**: https://qiita.com/api/v2/docs

### Zenn自動投稿
- **方式**: GitHub連携による自動投稿
- **公式ガイド**: https://zenn.dev/zenn/articles/connect-to-github

### X(Twitter) 投稿
- **ライブラリ**: [node-twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2)

## 🚀 デプロイ

### Frontend (Vercel)
```bash
# 自動デプロイ (main ブランチ)
git push origin main
```

### Backend (Docker)
```bash
# プロダクション環境
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 テスト

### Frontend
```bash
npm run test           # Jest テスト実行
npm run test:watch     # ウォッチモード
npm run test:coverage  # カバレッジ確認
```

### 対象
- コンポーネントテスト
- ユーティリティ関数テスト
- 型安全性チェック

## 📝 今後の予定

- [ ] 他の物理計算機能追加 (脱出速度、軌道速度など)
- [ ] BIG3記録のグラフ機能強化
- [ ] モバイルアプリ版開発
- [ ] パフォーマンス最適化
- [ ] E2Eテスト追加

## 🤝 貢献方法

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

---

**開発者**: [Kei Isurugi](https://github.com/keito-isurugi)  
**サイトURL**: [various-app.vercel.app](https://various-app.vercel.app)