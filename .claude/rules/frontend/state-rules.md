---
paths: ["frontend/src/hooks", "frontend/src/components"]
description: フロントエンド状態管理規約（React/Next.js）
---

# State Rules (状態管理規約)

## 状態管理の種類と使い分け

| 種類 | 使用可否 | 用途 |
|------|---------|------|
| **useState** | ✅ 推奨 | コンポーネント内の単純な状態 |
| **useReducer** | ✅ 推奨 | 複雑な状態遷移が必要な場合 |
| **カスタムフック** | ✅ 推奨 | 再利用可能な状態ロジック |
| **Context API** | △ 限定的 | テーマ、認証など広範囲で必要な状態 |
| **Server State** | ✅ 推奨 | Next.js Server Componentsでのデータ取得 |

## 原則: カスタムフックで状態を管理

```tsx
// Good: 機能ごとにカスタムフック
// src/hooks/useTodos.ts
import { useState, useCallback, useMemo } from "react";
import type { Todo, TodoFilter } from "@/types/todo";

interface UseTodosReturn {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => Promise<void>;
  setFilter: (filter: TodoFilter) => void;
  clearError: () => void;
}

export function useTodos(initialTodos: Todo[] = []): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // メモ化されたフィルター済みリスト
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter(todo => !todo.completed);
      case "completed":
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = useCallback(async (title: string) => {
    setLoading(true);
    setError(null);
    try {
      // API呼び出し
      const newTodo = await createTodoAPI(title);
      setTodos(prev => [...prev, newTodo]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add todo");
      throw e;
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

  const deleteTodo = useCallback(async (id: string) => {
    try {
      await deleteTodoAPI(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete todo");
      throw e;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    todos,
    filteredTodos,
    filter,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearError,
  };
}

// Bad: 巨大なグローバルストア
const globalState = {
  todos: [],
  products: [],
  users: [],
  settings: {},
  // ... 全てが一箇所に ❌
};
```

## useReducerパターン

複雑な状態遷移には`useReducer`を使用：

```tsx
// src/hooks/useTodoReducer.ts
import { useReducer, useCallback } from "react";
import type { Todo } from "@/types/todo";

type TodoAction =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "ADD_TODO": {
      return { ...state, todos: [...state.todos, action.payload] };
    }
    case "TOGGLE_TODO": {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    }
    case "DELETE_TODO": {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    }
    case "SET_LOADING": {
      return { ...state, loading: action.payload };
    }
    case "SET_ERROR": {
      return { ...state, error: action.payload };
    }
    default: {
      return state;
    }
  }
}

export function useTodoReducer() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const addTodo = useCallback((todo: Todo) => {
    dispatch({ type: "ADD_TODO", payload: todo });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  }, []);

  return { state, addTodo, toggleTodo, deleteTodo };
}
```

## コンポーネント内状態の使い分け

### カスタムフックを使うべき場合

- 複数コンポーネント間で共有する状態
- API通信の結果
- 複雑な状態ロジック
- ローディング/エラー状態を含む操作

### コンポーネント内useStateで良い場合

- フォームの入力値（送信前）
- UIの一時的な状態（ドロップダウンの開閉等）
- アニメーション状態
- ホバー/フォーカス状態

```tsx
// Good: UIのみの一時状態はコンポーネント内
function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // UIのみの状態
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <input />
      ) : (
        <span>{todo.title}</span>
      )}
      {isHovered && (
        <button type="button" onClick={() => setIsEditing(true)}>
          編集
        </button>
      )}
    </div>
  );
}
```

## Context APIの使用

```tsx
// Good: 限定的な用途でContext使用
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

## Server Componentsでの状態

Next.js App Routerでは、可能な限りServer Componentsを使用：

```tsx
// Good: Server Componentでデータ取得
// src/app/todo/page.tsx
import { getTodos } from "@/lib/firebase";
import { TodoList } from "@/components/todo/TodoList";

export default async function TodoPage() {
  // サーバーサイドでデータ取得
  const todos = await getTodos();

  return <TodoList initialTodos={todos} />;
}

// src/components/todo/TodoList.tsx
"use client";

import { useTodos } from "@/hooks/useTodos";

interface TodoListProps {
  initialTodos: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  // クライアントサイドで状態管理
  const { todos, addTodo, toggleTodo } = useTodos(initialTodos);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

## 禁止事項

### 1. コンポーネント内での状態ロジック肥大化

```tsx
// Bad: 状態管理ロジックがコンポーネント内に散在
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // 100行以上の状態管理コード... ❌

  return <div>...</div>;
}

// Good: カスタムフックに抽出
function TodoApp() {
  const { todos, loading, error, addTodo, toggleTodo } = useTodos();

  return <div>...</div>;
}
```

### 2. useEffectの依存配列の問題

```tsx
// Bad: 依存配列の警告を無視
useEffect(() => {
  fetchData(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ❌ userIdが依存配列にない

// Good: 適切な依存配列
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Good: useCallbackでメモ化
const memoizedFetch = useCallback(() => {
  fetchData(userId);
}, [userId]);

useEffect(() => {
  memoizedFetch();
}, [memoizedFetch]);
```

### 3. 不要な再レンダリング

```tsx
// Bad: オブジェクトを直接渡す
function Parent() {
  return <Child style={{ color: "red" }} />; // 毎回新しいオブジェクト ❌
}

// Good: メモ化
const style = useMemo(() => ({ color: "red" }), []);
function Parent() {
  return <Child style={style} />;
}
```

## 命名規則

- **カスタムフック**: `use{機能名}` （例: `useTodos`, `useAuth`, `useFirebase`）
- **状態変数**: camelCase（例: `isLoading`, `todoList`, `currentUser`）
- **セッター関数**: `set{状態名}`（例: `setIsLoading`, `setTodoList`）
- **アクション関数**: 動詞から始める（例: `addTodo`, `deleteTodo`, `toggleCompleted`）

## 実装チェックリスト

新しい状態管理を作成する際に確認：

- [ ] カスタムフックに抽出されているか
- [ ] loading/error状態を含んでいるか
- [ ] useCallbackでアクション関数がメモ化されているか
- [ ] useMemoで計算値がメモ化されているか
- [ ] useEffectの依存配列が正しいか
- [ ] 型定義が明確か
- [ ] 不要な再レンダリングが発生していないか
