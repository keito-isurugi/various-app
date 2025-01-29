# Tech Quiz 学習機能 - セットアップガイド

## Phase 1 実装完了

技術問題を習慣的に学習するための機能を実装しました。

## 機能一覧

### ✅ 実装済み（Phase 1）

- 問題のランダム出題
- 日本語/英語の切り替え
- 解答の表示/非表示
- 理解度の記録（わかった/わからなかった）
- 前の問題/次の問題へのナビゲーション
- 学習進捗の記録
- 問題セットの更新

## セットアップ手順

### 1. 依存関係のインストール

```bash
cd frontend
npm install
```

### 2. Firebase Emulator の起動

```bash
npm run emulator
```

別のターミナルで実行してください。Firestore Emulatorが `localhost:8080` で起動します。

### 3. 問題データのインポート

```bash
# 統計を確認（オプション）
npm run import:questions:stats

# 問題をFirestoreにインポート
npm run import:questions
```

**実行結果例:**
```
📚 Starting to import questions...

Found 100 questions to import

✅ [1/100] Imported: DSA - Technical Question...
✅ [2/100] Imported: Backend - Networking...
...

📊 Import Summary:
   Total: 100
   Success: 100
   Failed: 0

🎉 All questions imported successfully!
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

### 5. アプリケーションにアクセス

ブラウザで http://localhost:3000/study を開きます。

## 便利なコマンド

```bash
# すべてを一度に起動（Emulator + Dev Server）
npm run dev:all

# 問題データの統計を表示
npm run import:questions:stats

# 問題データを再インポート
npm run import:questions
```

## 使い方

### 基本的な学習フロー

1. **言語の選択**: 右上の言語ボタンで日本語/英語を切り替え
2. **問題を読む**: 表示された問題を読んで考える
3. **解答を見る**: 「解答を見る」ボタンをクリック
4. **理解度を記録**:
   - 「わかった」: 理解できた場合
   - 「わからなかった」: 理解できなかった場合
5. **次の問題へ**: 理解度を記録すると自動的に次の問題に進みます

### その他の機能

- **新しいセット**: ランダムな10問を新しく取得
- **前の問題/次の問題**: ナビゲーションボタンで移動
- **進捗表示**: 画面上部に現在の進捗が表示されます

## ディレクトリ構造

```
frontend/
├── src/
│   ├── app/
│   │   └── study/
│   │       └── page.tsx              # メインページ
│   ├── components/
│   │   └── study/
│   │       ├── QuestionCard.tsx      # 問題表示カード
│   │       ├── StudyHeader.tsx       # ヘッダー
│   │       ├── StudyNavigation.tsx   # ナビゲーション
│   │       └── StudyProgress.tsx     # 進捗表示
│   ├── lib/
│   │   └── study/
│   │       ├── questionService.ts    # 問題取得サービス
│   │       └── progressService.ts    # 進捗管理サービス
│   └── types/
│       └── study.ts                  # 型定義
├── scripts/
│   └── importQuestions.ts            # インポートスクリプト
├── src/data/study/
│   ├── tech-test.json                # 問題データ
│   ├── tech-test-old.json            # 旧問題データ
│   ├── tech-test.md                  # 問題ドキュメント
│   └── tech-test-review.md           # レビュードキュメント
```

## Firestoreデータ構造

### questions コレクション
```typescript
{
  id: string;
  group: string;              // DSA, Backend, Frontend
  category: string;           // カテゴリ
  japaneseQuestion: string;   // 日本語問題文
  englishQuestion: string;    // 英語問題文
  japaneseAnswer: string;     // 日本語解答
  englishAnswer: string;      // 英語解答
  relatedLink: string;        // 関連リンク
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### userProgress コレクション
```typescript
{
  id: string;
  userId: string;
  questionId: string;
  attempts: [{
    answeredAt: Timestamp;
    understood: boolean;
    timeSpent: number;
  }];
  lastReviewedAt: Timestamp;
  bookmarked: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## トラブルシューティング

### 問題が表示されない

1. Firebase Emulatorが起動しているか確認
   ```bash
   npm run emulator
   ```

2. 問題データがインポートされているか確認
   ```bash
   npm run import:questions:stats
   ```

3. `.env.local` ファイルに以下が設定されているか確認
   ```
   NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
   ```

### インポートスクリプトが動かない

1. `ts-node` がインストールされているか確認
   ```bash
   npm install --save-dev ts-node
   ```

2. Firebase Emulatorが起動しているか確認

### ビルドエラーが出る

1. 依存関係を再インストール
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Biomeでコードをチェック
   ```bash
   npm run format
   npm run lint
   ```

## 今後の拡張（Phase 2 & 3）

### Phase 2 - 習慣化機能
- [ ] デイリークイズ
- [ ] 連続学習日数トラッキング
- [ ] 進捗ダッシュボード
- [ ] カテゴリ別統計

### Phase 3 - 高度な学習機能
- [ ] 間隔反復学習（Spaced Repetition）
- [ ] カテゴリ別学習モード
- [ ] テストモード
- [ ] ブックマーク機能

詳細は `/docs/TECH_QUIZ_REQUIREMENTS.md` を参照してください。

## 参考リンク

- [要件定義書](../docs/TECH_QUIZ_REQUIREMENTS.md)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)
- [Next.js App Router](https://nextjs.org/docs/app)
