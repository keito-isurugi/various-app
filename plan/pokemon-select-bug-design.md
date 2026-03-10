# セレクトバグ ビジュアライザー 設計書

## 1. 概要

初代ポケモン（赤・緑・青）のセレクトバグ（7番目バグ）をWeb上でインタラクティブに体験・理解できるハイブリッド型教育コンテンツ。

### 画面構成
```
┌─────────────────────────────────────────────┐
│          ステップ説明バー                      │
├─────────────────┬───────────────────────────┤
│                 │                           │
│  ゲームボーイ風   │    解説パネル               │
│  操作画面        │    (現在のステップの         │
│                 │     技術的な説明)            │
│                 │                           │
├─────────────────┴───────────────────────────┤
│                                             │
│        メモリマップ可視化                      │
│   CC35 | 技1-4 | OT ID | 経験値 | ...        │
│                                             │
├─────────────────────────────────────────────┤
│     ステップ操作ボタン (← → リセット)          │
└─────────────────────────────────────────────┘
```

## 2. ステップ定義（7番目バグシナリオ）

| Step | 画面状態 | メモリ変化 | 説明 |
|------|---------|-----------|------|
| 0 | フィールド画面 | CC35=0x00, 初期状態 | 初期状態の説明 |
| 1 | メニュー → どうぐリスト表示 | 変化なし | どうぐリストを開く |
| 2 | 7番目にカーソル + セレクト押下 | CC35=0x07 | 入れ替え待機状態がセット |
| 3 | B×2でメニュー閉じる | CC35=0x07のまま残る | **バグの核心**: CC35がクリアされない |
| 4 | 草むらでエンカウント | CC35=0x07のまま | 戦闘開始 |
| 5 | 「たたかう」→ 技リスト表示 | CC35=0x07が技リストに適用 | 技1を選択すると「技1と7番目を入れ替え」 |
| 6 | 技選択 → スワップ実行 | 技1 ↔ Exp上位バイトがスワップ | メモリ上で範囲外アクセスが発生 |
| 7 | バグった技表示で戦闘 | 経験値が巨大な値に変化 | 別の技で敵を倒す |
| 8 | 経験値取得 → Lv100! | レベル計算でカンスト | 結果表示 |

## 3. データモデル

### SimulationState
```typescript
interface SimulationState {
  currentStep: number;
  totalSteps: number;

  // CC35レジスタ
  menuItemToSwap: number; // 0x00 = 未設定, 0x07 = 7番目

  // party_struct メモリ（技スロット周辺）
  memory: MemoryState;

  // ゲーム画面の状態
  gameScreen: GameScreenState;
}

interface MemoryState {
  // オフセット 0x00-0x10 のバイト配列
  bytes: number[];

  // 各フィールドのメタデータ
  fields: MemoryField[];

  // ハイライト対象
  highlightedOffsets: number[];
  swapAnimation: SwapAnimation | null;
}

interface MemoryField {
  name: string;
  offset: number;
  size: number;
  category: "species" | "hp" | "status" | "type" | "move" | "otid" | "exp" | "other";
  displayValue: string;
}

interface SwapAnimation {
  fromOffset: number;
  toOffset: number;
  isAnimating: boolean;
}

interface GameScreenState {
  screen: "field" | "menu" | "items" | "battle" | "battle-fight" | "battle-moves" | "battle-result";
  cursorPosition: number;
  selectPressed: boolean;
  message: string;
}
```

## 4. コンポーネント構成

```
/pokemon-select-bug/page.tsx          # ページ（サーバーコンポーネント）
/components/pokemon-select-bug/
  ├── SelectBugVisualizer.tsx          # メインコンポーネント（クライアント）
  ├── GameScreen.tsx                   # ゲームボーイ風画面
  ├── MemoryViewer.tsx                 # メモリマップ可視化
  ├── StepExplanation.tsx              # ステップ解説パネル
  ├── StepControls.tsx                 # ステップ操作ボタン
  └── useSimulation.ts                # シミュレーション状態管理フック
/types/pokemon-select-bug.ts           # 型定義
/data/pokemon-select-bug.ts            # ステップデータ・初期メモリ値
```

## 5. スタイリング方針

### ゲームボーイ風UI
- 背景: `#9bbc0f`（ゲームボーイの黄緑液晶風）
- テキスト: `#0f380f`（暗い緑）
- ボーダー: 太い黒枠でウィンドウ表現
- フォント: monospace系（ドット絵フォントは使わず、等幅フォントで雰囲気を出す）

### メモリビューワー
- 各バイトをセルとして表示
- カテゴリ別に色分け（技=青、OT ID=黄、経験値=赤）
- スワップ時はアニメーションでバイトが移動する表現
- CC35の状態は常に表示

### レスポンシブ
- モバイル: 縦スタック（ゲーム画面 → 解説 → メモリ）
- デスクトップ: 設計図通りの2カラム + 下部メモリ

## 6. 実装計画

### Phase 1: 基盤
1. 型定義・データモデル作成
2. useSimulation フック実装

### Phase 2: UIコンポーネント
3. MemoryViewer（メモリ可視化）
4. GameScreen（ゲームボーイ風画面）
5. StepExplanation（解説パネル）
6. StepControls（操作ボタン）

### Phase 3: 統合
7. SelectBugVisualizer（メイン統合）
8. ページコンポーネント
9. Biomeチェック・動作確認
