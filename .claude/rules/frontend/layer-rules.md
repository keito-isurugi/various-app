---
paths: ["frontend/src"]
description: Frontend責務分離ルール（Next.js App Router）
---

# Frontend Layer Rules (責務分離ルール)

## App Router Layer (`src/app/`)

- **責務**: ページのルーティング、レイアウト、データフェッチ
- **許可**:
  - `page.tsx` - ページコンポーネント
  - `layout.tsx` - レイアウト定義
  - `loading.tsx` - ローディング状態
  - `error.tsx` - エラーハンドリング
  - `route.ts` - APIルート
- **禁止事項**:
  - 大きなコンポーネント（50行を超える場合は`components/`に分割）
  - 複雑なビジネスロジック（`hooks/`または`utils/`に配置）

```tsx
// Good: シンプルなページコンポーネント
// src/app/blog/posts/page.tsx
import { PostList } from "@/components/blog/PostList";
import { getPosts } from "@/lib/notion";

export default async function PostsPage() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}

// Bad: 責務過多なページ
export default async function PostsPage() {
  // ❌ 複雑なロジックがページに混入
  const posts = await fetch("...").then(r => r.json());
  const filtered = posts.filter(p => p.published);
  const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  // ...100行以上のJSX
}
```

## Components Layer (`src/components/`)

- **責務**: 再利用可能なUIコンポーネント
- **構成**:
  - `ui/`: shadcn/ui ベースコンポーネント（Button, Input, Modal等）
  - `{feature}/`: 機能別コンポーネント（blog/, todo/, admin/等）
- **禁止事項**:
  - Server Actionsを直接定義（`actions/`に配置）
  - グローバル状態への直接アクセス（Props経由で受け取る）

```tsx
// Good: 単一責任、Props明確
// src/components/blog/PostCard.tsx
interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
}

export function PostCard({ post, onEdit }: PostCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      {onEdit && (
        <button type="button" onClick={() => onEdit(post)}>
          編集
        </button>
      )}
    </div>
  );
}

// Bad: API直接呼び出し、責務過多
export function PostCard({ postId }: { postId: string }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${postId}`).then(r => r.json()).then(setPost); // ❌
  }, [postId]);

  // ... 複雑なロジック
}
```

## Hooks Layer (`src/hooks/`)

- **責務**: カスタムフック（状態管理、副作用）
- **命名**: `use{機能名}.ts`（例: `useTodos.ts`, `useFirebase.ts`）
- **禁止事項**:
  - UIレンダリング（JSXを返さない）
  - DOM操作

```tsx
// Good: カスタムフック
// src/hooks/useTodos.ts
import { useState, useCallback } from "react";
import type { Todo } from "@/types/todo";

export function useTodos(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTodo = useCallback(async (title: string) => {
    setLoading(true);
    try {
      const newTodo = await createTodo(title);
      setTodos(prev => [...prev, newTodo]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add todo");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  return { todos, loading, error, addTodo, toggleTodo };
}
```

## Lib Layer (`src/lib/`)

- **責務**: 外部サービス統合、クライアント設定
- **構成**:
  - `firebase.ts` - Firebase設定
  - `notion.ts` - Notion API
  - `utils.ts` - 汎用ユーティリティ（cn関数等）

```tsx
// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // ...
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// エミュレーター接続
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
```

## Types Layer (`src/types/`)

- **責務**: TypeScript型定義
- **構成**:
  - `{domain}.ts`: ドメインごとの型定義
  - `index.ts`: 再エクスポート
- **禁止事項**:
  - `any`型の使用
  - 型定義の重複（共通化すること）
  - 実装の混入（型定義のみ）

```tsx
// src/types/todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type TodoStatus = "all" | "active" | "completed";
```

## Utils Layer (`src/utils/`)

- **責務**: 純粋関数のユーティリティ
- **禁止事項**:
  - 副作用を持つ関数
  - DOM操作
  - 状態への依存

```tsx
// src/utils/date.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isOverdue(dueDate: Date): boolean {
  return dueDate < new Date();
}

// src/utils/string.ts
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
```

## Data Layer (`src/data/`)

- **責務**: 静的データ、定数、設定
- **禁止事項**:
  - 動的なデータ取得
  - 副作用

```tsx
// src/data/navigation.ts
export const navigationItems = [
  { href: "/blog", label: "Blog" },
  { href: "/todo", label: "TODO" },
  { href: "/admin", label: "Admin" },
];

// src/data/categories.ts
export const defaultCategories = [
  { id: "work", name: "仕事", color: "#3B82F6" },
  { id: "personal", name: "個人", color: "#10B981" },
];
```

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router
│   ├── blog/               # ブログ機能
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── todo/               # TODOアプリ
│   ├── admin/              # 管理画面
│   ├── api/                # APIルート
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # ホームページ
├── components/             # UIコンポーネント
│   ├── ui/                 # shadcn/ui
│   ├── blog/               # ブログ関連
│   ├── todo/               # TODO関連
│   └── common/             # 共通コンポーネント
├── hooks/                  # カスタムフック
├── lib/                    # 外部サービス統合
├── types/                  # 型定義
├── utils/                  # ユーティリティ
├── data/                   # 静的データ
└── css/                    # スタイル
```

## 実装チェックリスト

新しい機能実装時に確認：

- [ ] ページコンポーネントは50行以内に収まっているか
- [ ] コンポーネントがAPI直接呼び出しをしていないか
- [ ] 状態管理ロジックはカスタムフックに抽出されているか
- [ ] 型定義は`types/`に配置されているか
- [ ] ユーティリティ関数は純粋関数か
- [ ] `any`型を使用していないか
- [ ] button要素に`type`属性が設定されているか
