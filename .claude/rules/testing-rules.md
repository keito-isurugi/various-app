---
paths: ["backend", "frontend"]
description: テスト駆動開発（TDD）規約
---

# Testing Rules (テスト駆動開発規約)

## TDD基本原則

### Red-Green-Refactorサイクル

1. **Red**: 失敗するテストを先に書く
2. **Green**: 最小限の実装でテストを通す
3. **Refactor**: テストが通った状態でリファクタリング

### テストファーストの徹底

- **実装前にテストを書く**: これがTDDの本質
- **テストが失敗することを確認**: Redフェーズで必ず失敗を確認
- **小さなステップで**: 一度に多くのテストを書きすぎない

### t-wadaのベストプラクティス

- **小さく始める**: 一度に1つのテストケースだけを書く
- **テストの意図を明確にする**: テスト名で仕様を表現
- **三角測量を活用**: 1つ目は仮実装、2つ目で一般化、3つ目でパターン確立
- **リファクタリングはグリーンで**: テストが通っている状態でのみリファクタリング

## テストの構造

### AAA Pattern（必須）

すべてのテストは以下の構造に従うこと：

```go
// Backend (Go)
func TestCreateImage_WithValidData_ReturnsImage(t *testing.T) {
    // Arrange: テストの準備
    repo := NewImageRepository(db)
    name := "test.jpg"
    url := "https://example.com/test.jpg"

    // Act: テスト対象の実行
    image, err := repo.Create(name, url)

    // Assert: 結果の検証
    assert.NoError(t, err)
    assert.NotZero(t, image.ID)
    assert.Equal(t, name, image.Name)
}
```

```tsx
// Frontend (Jest)
describe("useTodos", () => {
  it("should add a new todo", async () => {
    // Arrange
    const { result } = renderHook(() => useTodos());

    // Act
    await act(async () => {
      await result.current.addTodo("New todo");
    });

    // Assert
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe("New todo");
  });
});
```

## テスト命名規則

### Backend (Go)

形式: `Test{対象}_{条件}_{期待結果}`

```go
// Good: 何を・どんな条件で・どうなる が明確
func TestCreateImage_WithValidData_ReturnsImageWithID(t *testing.T) {}
func TestCreateImage_WithEmptyName_ReturnsError(t *testing.T) {}
func TestFindByID_WhenNotFound_ReturnsNil(t *testing.T) {}

// Bad: 意図が不明瞭
func TestImage(t *testing.T) {}  // ❌
func TestCreate(t *testing.T) {} // ❌
```

### Frontend (Jest)

形式: describe-it の階層構造で仕様を表現

```tsx
// Good: 階層構造で仕様を表現
describe("useTodos", () => {
  describe("addTodo", () => {
    it("should add a new todo to the list", () => {
      // テストコード
    });

    it("should throw error when title is empty", () => {
      // テストコード
    });
  });

  describe("toggleTodo", () => {
    it("should toggle completed status", () => {
      // テストコード
    });
  });
});

// Bad: フラットで意図が不明瞭
it("test todo", () => {}); // ❌
```

## テストケース設計

### 必須テストケース

各機能に対して以下のテストケースを実装すること：

1. **正常系（Happy Path）**: 想定される正しい使い方
2. **境界値（Boundary Value）**: 最小値、最大値、境界値
3. **異常系（Error Cases）**: エラーケース、例外処理
4. **エッジケース（Edge Cases）**: 空、null、undefined等

## Backend Testing (Go)

### ディレクトリ構造

```
backend/
├── domain/
│   ├── image.go
│   └── image_test.go      # 同一ディレクトリにテスト
├── application/
│   ├── image_usecase.go
│   └── image_usecase_test.go
├── infrastructure/
│   └── repository/
│       ├── image_repository.go
│       └── image_repository_test.go
└── presentation/
    └── handler/
        ├── image_handler.go
        └── image_handler_test.go
```

### テーブル駆動テスト

```go
func TestValidateImageURL(t *testing.T) {
    tests := []struct {
        name    string
        url     string
        wantErr bool
    }{
        {"valid http url", "http://example.com/image.jpg", false},
        {"valid https url", "https://example.com/image.jpg", false},
        {"empty url", "", true},
        {"invalid url", "not-a-url", true},
        {"no extension", "https://example.com/image", false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateImageURL(tt.url)
            if tt.wantErr {
                assert.Error(t, err)
            } else {
                assert.NoError(t, err)
            }
        })
    }
}
```

### モックの使用

```go
// インターフェースを使用したモック
type MockImageRepository struct {
    mock.Mock
}

func (m *MockImageRepository) FindByID(id uint) (*domain.Image, error) {
    args := m.Called(id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*domain.Image), args.Error(1)
}

func TestImageUseCase_GetImage(t *testing.T) {
    mockRepo := new(MockImageRepository)
    useCase := NewImageUseCase(mockRepo)

    expectedImage := &domain.Image{ID: 1, Name: "test.jpg"}
    mockRepo.On("FindByID", uint(1)).Return(expectedImage, nil)

    image, err := useCase.GetImage(1)

    assert.NoError(t, err)
    assert.Equal(t, expectedImage, image)
    mockRepo.AssertExpectations(t)
}
```

### テスト実行コマンド

```bash
# 全テストを実行
go test ./...

# 詳細出力
go test -v ./...

# 特定パッケージのテスト
go test -v ./domain/...

# カバレッジ付き
go test -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# 特定のテスト関数
go test -v -run TestCreateImage ./domain/...
```

## Frontend Testing (Jest)

### ディレクトリ構造

```
frontend/
├── src/
│   ├── components/
│   │   └── todo/
│   │       ├── TodoList.tsx
│   │       └── TodoList.test.tsx   # コンポーネントと同階層
│   ├── hooks/
│   │   ├── useTodos.ts
│   │   └── useTodos.test.ts
│   └── utils/
│       ├── date.ts
│       └── date.test.ts
└── jest.config.js
```

### コンポーネントテスト

```tsx
// src/components/todo/TodoItem.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "./TodoItem";

describe("TodoItem", () => {
  const mockTodo = {
    id: "1",
    title: "Test Todo",
    completed: false,
  };

  it("should render todo title", () => {
    render(<TodoItem todo={mockTodo} onToggle={() => {}} />);
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
  });

  it("should call onToggle when checkbox clicked", () => {
    const handleToggle = jest.fn();
    render(<TodoItem todo={mockTodo} onToggle={handleToggle} />);

    fireEvent.click(screen.getByRole("checkbox"));

    expect(handleToggle).toHaveBeenCalledWith("1");
  });

  it("should show completed style when todo is completed", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggle={() => {}} />);

    expect(screen.getByText("Test Todo")).toHaveClass("line-through");
  });
});
```

### カスタムフックテスト

```tsx
// src/hooks/useTodos.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTodos } from "./useTodos";

describe("useTodos", () => {
  it("should initialize with empty todos", () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it("should add a new todo", async () => {
    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await result.current.addTodo("New Todo");
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe("New Todo");
    expect(result.current.todos[0].completed).toBe(false);
  });

  it("should toggle todo completed status", async () => {
    const { result } = renderHook(() =>
      useTodos([{ id: "1", title: "Test", completed: false }])
    );

    act(() => {
      result.current.toggleTodo("1");
    });

    expect(result.current.todos[0].completed).toBe(true);
  });
});
```

### ユーティリティテスト

```tsx
// src/utils/date.test.ts
import { formatDate, isOverdue } from "./date";

describe("formatDate", () => {
  it("should format date in Japanese locale", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("2024年1月15日");
  });
});

describe("isOverdue", () => {
  it("should return true for past dates", () => {
    const pastDate = new Date("2020-01-01");
    expect(isOverdue(pastDate)).toBe(true);
  });

  it("should return false for future dates", () => {
    const futureDate = new Date("2030-01-01");
    expect(isOverdue(futureDate)).toBe(false);
  });
});
```

### テスト実行コマンド

```bash
cd frontend

# 全テストを実行
npm run test

# ウォッチモード
npm run test -- --watch

# カバレッジ
npm run test -- --coverage

# 特定ファイル
npm run test -- useTodos.test.ts
```

## テストカバレッジ

### 目標値

| レイヤー | カバレッジ目標 | 対象 |
|----------|----------------|------|
| **Domain層** | 90%以上 | ビジネスロジック |
| **Application層** | 80%以上 | ユースケース |
| **Hooks** | 80%以上 | カスタムフック |
| **Utils** | 90%以上 | ユーティリティ |
| **Components** | 60%以上 | UIコンポーネント |

### 優先順位

1. **最優先**: ビジネスロジック、カスタムフック
2. **高優先**: ユーティリティ関数、API呼び出し
3. **中優先**: UIコンポーネント
4. **低優先**: 単純なマッピング、スタイル

## 禁止事項

### テストで絶対にやってはいけないこと

- ❌ **実装後にテストを書く**: TDDの原則に反する
- ❌ **テストの失敗を確認しない**: Redフェーズをスキップしない
- ❌ **複数のことを1つのテストで検証**: 1テスト1検証の原則
- ❌ **テスト間で状態を共有**: 独立性の原則に反する
- ❌ **本番環境への影響**: 実際のAPIやDBにアクセスしない
- ❌ **モックの過剰使用**: テスト対象までモック化しない

## テスト作成のチェックリスト

新しいテストを作成する際に確認すること：

### 基本チェック
- [ ] **テストファースト**: 実装前にテストを書いている
- [ ] **失敗確認**: テストがRedフェーズで失敗することを確認した
- [ ] **独立性**: テストが他のテストに依存していない
- [ ] **可読性**: テストの意図が明確で、仕様書として読める

### 構造チェック
- [ ] **AAA構造**: Arrange-Act-Assertの構造が明確
- [ ] **適切な命名**: テスト名が「何を」「どんな条件で」「どうなる」を表現
- [ ] **1テスト1検証**: 1つのテストで1つのことだけを検証

### 網羅性チェック
- [ ] **正常系**: Happy Pathがテストされている
- [ ] **境界値**: 境界値のテストケースがカバーされている
- [ ] **異常系**: エラーケースが適切にテストされている
- [ ] **エッジケース**: null、空、undefinedなどがテストされている

## 参考資料

- **TDD**: Kent Beck『テスト駆動開発』
- **t-wada**: 和田卓人氏の講演・記事
- **Refactoring**: Martin Fowler『リファクタリング』
- **Go testing**: https://go.dev/doc/tutorial/add-a-test
- **Jest**: https://jestjs.io/docs/getting-started
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
