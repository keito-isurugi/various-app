---
paths: ["backend", "frontend"]
description: コードスタイル規約
---

# コードスタイル

## 共通

- コメントは日本語で記述
- 変数名・関数名・クラス名は英語で記述
- マジックナンバーは定数化する
- 1関数は1責務に限定する
- 早期リターンを原則とし、深いネストを極力避ける
- 参照透過性を高める


## Backend (Go)

### フォーマッター・リンター

- **gofmt**: 標準フォーマッター
- **goimports**: import文の整理
- **golint / staticcheck**: リンター

### 命名規則

- **パッケージ名**: 小文字、短く、snake_caseは使わない（例: `handler`, `domain`）
- **エクスポートする関数・型**: PascalCase（例: `GetImages`, `ImageRepository`）
- **エクスポートしない関数・型**: camelCase（例: `getImages`, `imageRepository`）
- **定数**: PascalCase または camelCase（例: `MaxRetryCount`, `defaultTimeout`）
- **インターフェース**: 動詞+er または 名詞（例: `Reader`, `ImageRepository`）

```go
// Good: Go命名規則
type ImageRepository interface {
    FindByID(id uint) (*Image, error)
    FindAll() ([]*Image, error)
}

type imageHandler struct {
    useCase ImageUseCase
}

func NewImageHandler(useCase ImageUseCase) *imageHandler {
    return &imageHandler{useCase: useCase}
}
```

### エラーハンドリング

```go
// Good: エラーを適切にラップして返す
func (r *imageRepository) FindByID(id uint) (*Image, error) {
    var image Image
    if err := r.db.First(&image, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, nil // 見つからない場合はnilを返す
        }
        return nil, fmt.Errorf("failed to find image: %w", err)
    }
    return &image, nil
}

// Bad: エラーを握りつぶす
func (r *imageRepository) FindByID(id uint) (*Image, error) {
    var image Image
    r.db.First(&image, id) // エラーを無視 ❌
    return &image, nil
}
```

### 構造体の初期化

```go
// Good: フィールド名を明示
image := &Image{
    Name:      name,
    URL:       url,
    CreatedAt: time.Now(),
}

// Bad: 位置引数のみ
image := &Image{name, url, time.Now()} // ❌
```

## Frontend (TypeScript/React)

### フォーマッター・リンター

- **Biome**: コードフォーマッター＆リンター（ESLint + Prettierの代替）
  - タブインデント
  - ダブルクォート使用
  - セミコロンあり

### Biome設定

```json
{
  "formatter": {
    "indentStyle": "tab",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```

### コマンド

```bash
# Lint check
npx biome check src/

# Auto-fix safe issues
npx biome check --write src/

# Auto-fix including unsafe issues
npx biome check --write --unsafe src/
```

### 命名規則

- **コンポーネント**: PascalCase（例: `PostCard.tsx`, `TodoList.tsx`）
- **関数・変数名**: camelCase（例: `getUserById`, `todoList`）
- **定数**: UPPER_SNAKE_CASE（例: `API_BASE_URL`, `MAX_RETRY_COUNT`）
- **型・インターフェース**: PascalCase（例: `UserResponse`, `TodoItem`）
- **カスタムフック**: `use`プレフィックス（例: `useTodos`, `useFirebase`）

```tsx
// Good: 命名規則に従う
import type { TodoItem } from "@/types/todo";

const MAX_ITEMS = 100;

interface TodoListProps {
  items: TodoItem[];
  onItemClick: (id: string) => void;
}

export function TodoList({ items, onItemClick }: TodoListProps) {
  const { todos, addTodo } = useTodos();
  // ...
}
```

### TypeScript

- `any`の使用は禁止（`unknown`を使用）
- 明示的な型定義を推奨
- `as`によるキャストは最小限に
- 戻り値の型を明示する

```tsx
// Good: 明示的な型定義
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Bad: any使用
function calculateTotal(items: any): any { // ❌
  return items.reduce((sum: any, item: any) => sum + item.price, 0);
}
```

### JSX/TSXルール

- button要素には必ず`type`属性を指定
- `Number.isNaN()`を使用（グローバル`isNaN`は禁止）
- switch文の変数はブロックスコープで囲む

```tsx
// Good
<button type="button" onClick={handleClick}>
  Click me
</button>

// Bad
<button onClick={handleClick}> {/* type属性がない ❌ */}
  Click me
</button>

// Good
if (Number.isNaN(value)) { ... }

// Bad
if (isNaN(value)) { ... } // ❌
```

### import順序

```tsx
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. サードパーティ
import { format } from "date-fns";

// 3. プロジェクト内（エイリアス使用）
import { Button } from "@/components/ui/button";
import { useTodos } from "@/hooks/useTodos";
import type { Todo } from "@/types/todo";

// 4. 相対パス
import { localHelper } from "./helpers";
```

### コンポーネント設計

```tsx
// Good: Propsの型を明示、デフォルト値を設定
interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = "primary",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

## コミット前チェック

### Frontend

```bash
cd frontend
npx biome check src/
```

Biomeエラーがある状態でコミットすると、pre-commitフック（husky + lint-staged）によりブロックされます。

### Backend

```bash
cd backend
go fmt ./...
go vet ./...
```
