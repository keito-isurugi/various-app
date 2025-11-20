# 技術問題学習機能 要件定義書

## 1. 概要

### 1.1 目的
エンジニアが技術知識を習慣的に学習し、定着させるための問題演習機能を提供する。

### 1.2 対象データ
- `frontend/tech-test.json` に格納された技術問題・解答データ
- データ構造:
  - Group: 分野（DSA, Backend, Frontend等）
  - Category: カテゴリ（例: DSA - Technical Question, Networking）
  - Japanese_Question: 日本語問題文
  - English_Question: 英語問題文
  - Japanese_Answer: 日本語解答
  - English_Answer: 英語解答
  - Related_Link: 関連リンク

### 1.3 システム構成
- フロントエンド: Next.js 15 + TypeScript + Tailwind CSS
- データベース: Firebase Firestore
- ルート: `/study` または `/tech-quiz`
- 既存のTODOアプリのアーキテクチャを流用

---

## 2. 機能要件

### 2.1 Phase 1: 基本機能（MVP）

#### 2.1.1 問題表示・解答機能
**優先度: 高**

- **問題表示UI**
  - 日本語/英語の切り替え機能
  - Group・Categoryの表示
  - 問題文の読みやすい表示
  - 関連リンクの表示

- **解答表示機能**
  - 「解答を見る」ボタンでトグル表示
  - 解答文の読みやすい表示
  - 外部リンクへのジャンプ機能

- **ナビゲーション**
  - 次の問題へ進む
  - 前の問題に戻る
  - 問題番号の表示（例: 1/100）

#### 2.1.2 ランダム出題機能
**優先度: 高**

- ランダムに問題を選択して出題
- 重複しないように出題（セッション内）
- 「新しい問題セット」ボタンでリセット

#### 2.1.3 学習記録機能
**優先度: 高**

- **記録するデータ**
  - 問題ID
  - 解答日時
  - 理解度（わかった/わからなかった）
  - 所要時間

- **データ保存先**
  - Firebase Firestore
  - ユーザーごとにコレクション管理

#### 2.1.4 データインポート機能
**優先度: 高**

- tech-test.json をFirestoreにインポートするスクリプト
- 問題データの更新・追加に対応

---

### 2.2 Phase 2: 習慣化機能

#### 2.2.1 デイリークイズ機能
**優先度: 中**

- **デイリーチャレンジ**
  - 1日あたり3-5問のクイズセット
  - 毎日0時にリセット
  - 完了/未完了のステータス表示

- **連続学習日数トラッキング**
  - 連続で学習した日数を記録
  - ストリーク（連続記録）の表示
  - ストリーク達成バッジ（7日、30日、100日等）

- **通知機能**
  - ブラウザ通知でリマインド
  - 学習時間の設定機能

#### 2.2.2 進捗ダッシュボード
**優先度: 中**

- **全体統計**
  - 総問題数
  - 解答済み問題数
  - 正答率（理解度ベース）
  - 学習時間の累計

- **カテゴリ別統計**
  - Group/Category別の進捗
  - 習熟度の可視化（円グラフ、棒グラフ）
  - 苦手分野の特定

- **学習履歴グラフ**
  - 日別の学習問題数
  - 週次/月次の学習傾向
  - カレンダービュー（学習した日をマーク）

---

### 2.3 Phase 3: 高度な学習機能

#### 2.3.1 間隔反復学習（Spaced Repetition）
**優先度: 低**

- **復習アルゴリズム**
  - SM-2アルゴリズム（SuperMemoベース）の実装
  - 理解度に応じた次回復習日の計算
  - 復習タイミングの通知

- **復習キュー**
  - 今日復習すべき問題のリスト
  - 期限切れの問題の優先表示
  - 復習完了のチェック機能

#### 2.3.2 カテゴリ別学習モード
**優先度: 中**

- **フィルタリング機能**
  - Group別に問題を絞り込み
  - Category別に問題を絞り込み
  - 複数条件の組み合わせ

- **カスタム学習セット**
  - 苦手な問題のみを集めたセット
  - 未学習の問題のみのセット
  - ブックマークした問題のセット

#### 2.3.3 テストモード
**優先度: 低**

- **模擬試験機能**
  - 問題数を指定（10問、30問、50問等）
  - 制限時間の設定
  - タイマー表示

- **採点機能**
  - 自己採点形式
  - スコアの記録
  - 過去のテスト結果の表示

- **レビュー機能**
  - 間違えた問題の復習
  - 解答の見直し

#### 2.3.4 復習リマインダー
**優先度: 低**

- **ブックマーク機能**
  - 重要な問題をマーク
  - ブックマークリストの管理

- **自動復習リスト**
  - 理解度が低い問題の自動追加
  - 定期的な復習通知

---

## 3. 非機能要件

### 3.1 パフォーマンス
- 問題表示は1秒以内
- ページ遷移はスムーズに（Next.js App Routerの活用）
- 大量の学習データでも高速動作

### 3.2 ユーザビリティ
- レスポンシブデザイン（モバイル対応）
- 直感的なUI/UX
- キーボードショートカット対応
  - `Space`: 解答表示トグル
  - `→`: 次の問題
  - `←`: 前の問題
  - `B`: ブックマーク

### 3.3 データ管理
- Firebase Firestoreでのデータ永続化
- ローカル開発時はFirebase Emulator使用
- データバックアップ・エクスポート機能

### 3.4 セキュリティ
- ユーザー認証（Firebase Authentication）
- 個人の学習データの保護

### 3.5 拡張性
- 新しい問題の追加が容易
- 他の問題形式への対応（選択式、コーディング問題等）
- 他のデータソースとの統合

---

## 4. データモデル

### 4.1 Firestoreコレクション構造

#### questions コレクション
```typescript
{
  id: string;                    // 自動生成ID
  group: string;                 // DSA, Backend, Frontend等
  category: string;              // カテゴリ
  japaneseQuestion: string;      // 日本語問題文
  englishQuestion: string;       // 英語問題文
  japaneseAnswer: string;        // 日本語解答
  englishAnswer: string;         // 英語解答
  relatedLink: string;           // 関連リンク
  createdAt: Timestamp;          // 作成日時
  updatedAt: Timestamp;          // 更新日時
}
```

#### userProgress コレクション
```typescript
{
  userId: string;                // ユーザーID
  questionId: string;            // 問題ID
  attempts: [{
    answeredAt: Timestamp;       // 解答日時
    understood: boolean;         // 理解度（わかった/わからなかった）
    timeSpent: number;           // 所要時間（秒）
  }];
  lastReviewedAt: Timestamp;     // 最終復習日
  nextReviewAt: Timestamp;       // 次回復習日（間隔反復用）
  easeFactor: number;            // 難易度係数（SM-2アルゴリズム用）
  interval: number;              // 復習間隔（日数）
  bookmarked: boolean;           // ブックマーク
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### userStats コレクション
```typescript
{
  userId: string;                // ユーザーID
  totalQuestions: number;        // 総問題数
  answeredQuestions: number;     // 解答済み問題数
  understoodCount: number;       // 理解した問題数
  totalTimeSpent: number;        // 総学習時間（秒）
  currentStreak: number;         // 現在の連続学習日数
  longestStreak: number;         // 最長連続学習日数
  lastStudiedAt: Timestamp;      // 最終学習日
  categoryStats: {               // カテゴリ別統計
    [category: string]: {
      total: number;
      answered: number;
      understood: number;
    }
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### dailyProgress コレクション
```typescript
{
  userId: string;                // ユーザーID
  date: string;                  // 日付（YYYY-MM-DD）
  questionsAnswered: number;     // 解答した問題数
  questionsUnderstood: number;   // 理解した問題数
  timeSpent: number;             // 学習時間（秒）
  completed: boolean;            // デイリーチャレンジ完了
  createdAt: Timestamp;
}
```

---

## 5. UI/UX設計

### 5.1 画面構成

#### 5.1.1 学習メイン画面 (`/study`)
- ヘッダー: タイトル、進捗表示、設定ボタン
- 問題カード:
  - Group/Category表示
  - 問題文（日英切り替え）
  - 解答ボタン
  - 解答エリア（トグル表示）
  - 理解度ボタン（わかった/わからなかった）
- フッター: 前へ/次へボタン、問題番号

#### 5.1.2 ダッシュボード (`/study/dashboard`)
- 統計サマリー（カード形式）
- 学習履歴グラフ
- カテゴリ別進捗
- デイリーチャレンジステータス
- 連続学習日数表示

#### 5.1.3 問題リスト (`/study/questions`)
- フィルタリング機能
- ソート機能（Group, Category, 学習状況）
- 問題カードのグリッド表示
- 学習状況のバッジ表示

#### 5.1.4 復習リスト (`/study/review`)
- 今日の復習問題
- 期限切れ問題
- ブックマーク問題

#### 5.1.5 設定画面 (`/study/settings`)
- 言語設定（日本語/英語デフォルト）
- 通知設定
- デイリー目標設定
- データエクスポート

### 5.2 カラースキーム
- 既存のTODOアプリと統一
- 理解度の色分け:
  - 緑: 理解済み
  - 黄: 要復習
  - 赤: 未理解
  - グレー: 未学習

---

## 6. 実装計画

### 6.1 Phase 1（2-3週間）
- [ ] Firestoreデータモデル設計
- [ ] JSONインポートスクリプト作成
- [ ] 問題表示UI実装
- [ ] 解答機能実装
- [ ] ランダム出題機能
- [ ] 基本的な学習記録機能

### 6.2 Phase 2（2-3週間）
- [ ] デイリークイズ機能
- [ ] 連続学習日数トラッキング
- [ ] ダッシュボード実装
- [ ] 統計グラフ実装
- [ ] 通知機能

### 6.3 Phase 3（3-4週間）
- [ ] 間隔反復学習アルゴリズム
- [ ] カテゴリ別学習モード
- [ ] テストモード
- [ ] 復習リマインダー
- [ ] ブックマーク機能

---

## 7. 技術スタック

### 7.1 フロントエンド
- Next.js 15（App Router）
- TypeScript
- Tailwind CSS v4
- shadcn/ui コンポーネント
- React Hook Form（フォーム管理）
- Recharts（グラフ表示）

### 7.2 バックエンド
- Firebase Firestore（データベース）
- Firebase Authentication（認証）
- Firebase Cloud Functions（通知等）
- Firebase Emulator（ローカル開発）

### 7.3 開発ツール
- Biome（コードフォーマット）
- Jest（テスト）
- Firebase Admin SDK（データ管理）

---

## 8. 今後の拡張案

### 8.1 コミュニティ機能
- 問題へのコメント機能
- ユーザー間での問題共有
- ランキング機能

### 8.2 問題形式の拡張
- 選択式問題
- コーディング問題（実行環境統合）
- 穴埋め問題

### 8.3 学習支援機能
- AIによる解説生成
- 関連問題の自動推薦
- 学習パスの提案

### 8.4 モバイルアプリ
- React Native版の開発
- オフライン学習対応

---

## 9. 成功指標（KPI）

- デイリーアクティブユーザー（自分の継続率）
- 平均学習時間/日
- 連続学習日数
- 問題完了率
- カテゴリ別習熟度の向上

---

## 10. 参考リソース

- [SuperMemo SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Anki - Spaced Repetition System](https://apps.ankiweb.net/)
- [Firebase Firestore ドキュメント](https://firebase.google.com/docs/firestore)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**文書バージョン**: 1.0
**作成日**: 2025-11-20
**最終更新日**: 2025-11-20
