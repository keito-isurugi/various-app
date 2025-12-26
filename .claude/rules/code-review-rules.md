---
paths: ["backend", "frontend"]
description: ソースコードレビュー規約
---

# Code Review Rules (コードレビュー規約)

## レビューの目的

- **品質保証**: バグの早期発見、コード品質の向上
- **知識共有**: チーム全体での知識の共有と標準化
- **メンテナンス性向上**: 可読性、保守性の高いコードの実現
- **セキュリティ確保**: 脆弱性の防止
- **学習機会**: ベストプラクティスの共有

## レビューの基本原則

### レビュアーの心構え

- **建設的なフィードバック**: 批判ではなく改善提案
- **具体的な指摘**: 「なぜ」改善が必要か理由を説明
- **優先順位の明確化**: Must/Should/Niceの区別
- **ポジティブな姿勢**: 良い点も積極的に評価
- **学びの姿勢**: 新しいアプローチから学ぶ

### レビューイーの心構え

- **オープンな姿勢**: フィードバックを前向きに受け止める
- **説明責任**: 設計判断の理由を説明できる
- **品質への責任**: レビュー指摘を真摯に対応
- **質問の推奨**: 不明点は遠慮なく質問

## レビューチェックリスト

### レベル1: 必須チェック（Must）

これらに問題がある場合は**必ず修正が必要**です。

#### 機能性
- [ ] 要件を満たしているか
- [ ] バグや論理エラーがないか
- [ ] エッジケースが考慮されているか
- [ ] エラーハンドリングが適切か

#### テスト
- [ ] テストが実装されているか（TDD必須）
- [ ] テストカバレッジが十分か
- [ ] テストが失敗しないか
- [ ] テストケースが適切か（正常系・異常系・境界値）

#### セキュリティ
- [ ] 入力値のバリデーションがあるか
- [ ] SQLインジェクション対策がされているか
- [ ] XSS対策がされているか
- [ ] 認証・認可が適切に実装されているか
- [ ] 機密情報がハードコードされていないか
- [ ] ログに機密情報が出力されていないか

#### アーキテクチャ
- [ ] レイヤー分離が守られているか（Clean Architecture）
- [ ] 依存関係の方向が正しいか
- [ ] 責務分離ができているか（SRP）

### レベル2: 推奨チェック（Should）

これらは**修正を強く推奨**します。

#### 可読性
- [ ] 変数名・関数名が意図を表現しているか
- [ ] マジックナンバーが定数化されているか
- [ ] 複雑なロジックにコメントがあるか
- [ ] ネストが深すぎないか（3階層以内）

#### 保守性
- [ ] DRY原則が守られているか（コードの重複がないか）
- [ ] 関数が適切な長さか（50行以内推奨）
- [ ] 関数が単一責務か
- [ ] 適切に例外処理されているか

#### パフォーマンス
- [ ] N+1問題がないか（データベースクエリ）
- [ ] 不要なループがないか
- [ ] メモリリークの可能性がないか
- [ ] 非効率なアルゴリズムがないか

#### コードスタイル
- [ ] プロジェクトのコーディング規約に従っているか
- [ ] Linterエラーがないか
- [ ] インポート順序が正しいか
- [ ] 不要なコメントアウトがないか

### レベル3: 改善提案（Nice to have）

これらは**余裕があれば改善**するレベルです。

#### 設計改善
- [ ] より良い設計パターンが適用できないか
- [ ] 拡張性を考慮した設計になっているか
- [ ] 将来の変更に強い設計か

#### ドキュメント
- [ ] 複雑な処理にドキュメントがあるか
- [ ] APIドキュメントが更新されているか
- [ ] README更新が必要か

## Backend (Python) レビューポイント

### アーキテクチャ

#### レイヤー分離（Clean Architecture）

```python
# Bad: Routerにビジネスロジックが混在
@router.post("/users")
async def create_user(data: UserCreate):
    # バリデーション（本来はService層）❌
    if not data.email or "@" not in data.email:
        raise HTTPException(400, "Invalid email")
    
    # ビジネスロジック（本来はService層）❌
    if await db.exists(data.email):
        raise HTTPException(409, "Email exists")
    
    return await db.create(data)

# Good: Routerは薄く、Service層に委譲
@router.post("/users")
async def create_user(
    data: UserCreate,
    service: UserService = Depends(get_user_service)
):
    return await service.create_user(data)
```

#### 依存性注入

```python
# Bad: 依存性注入がRouterに混在
@router.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    repository = UserRepository(db)  # ❌
    return repository.get(user_id)

# Good: dependencies.pyで管理
# dependencies.py
def get_user_service(db: Session = Depends(get_db)):
    repository = UserRepository(db)
    return UserService(repository)

# router.py
@router.get("/users/{user_id}")
async def get_user(
    user_id: int,
    service: UserService = Depends(get_user_service)
):
    return service.get_user(user_id)
```

### データベース

#### 外部キー制約

```python
# Bad: ON DELETE SET NULL（原則禁止）
user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))  # ❌

# Good: ON DELETE CASCADE（標準）
user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))  # ✅

# Good: 履歴保全が必要な場合はFK無し
user_id = Column(
    Integer,
    nullable=False,
    comment="ユーザーID（FK無し：履歴保全のため）"
)  # ✅（コメント必須）
```

#### ユーザー参照

```python
# Bad: user_uuid を外部キーに使用
user_uuid = Column(String, ForeignKey("users.uuid"))  # ❌

# Good: user_id (INTEGER) を使用
user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))  # ✅
```

### 型ヒント

```python
# Bad: 型ヒントなし
def process_data(items):  # ❌
    return [x * 2 for x in items]

# Good: 完全な型ヒント
def process_data(items: list[int]) -> list[int]:  # ✅
    return [x * 2 for x in items]

# Bad: anyの使用
def fetch_data() -> Any:  # ❌
    return {"data": "value"}

# Good: 具体的な型
def fetch_data() -> dict[str, str]:  # ✅
    return {"data": "value"}
```

### エラーハンドリング

```python
# Bad: 例外を無視
try:
    result = risky_operation()
except:  # ❌ 何の例外かわからない
    pass  # ❌ エラーを無視

# Good: 具体的な例外を適切に処理
try:
    result = risky_operation()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise HTTPException(400, f"Invalid input: {str(e)}")
except DatabaseError as e:
    logger.error(f"Database error: {e}")
    raise HTTPException(500, "Internal server error")
```

### セキュリティ

```python
# Bad: SQLインジェクションの危険性
def get_user(email: str):
    query = f"SELECT * FROM users WHERE email = '{email}'"  # ❌
    return db.execute(query)

# Good: パラメータ化クエリ
def get_user(email: str):
    return db.query(User).filter(User.email == email).first()  # ✅

# Bad: 機密情報のハードコード
API_KEY = "sk-1234567890abcdef"  # ❌

# Good: 環境変数から取得
API_KEY = os.getenv("API_KEY")  # ✅

# Bad: パスワードをログ出力
logger.info(f"User login: {email}, password: {password}")  # ❌

# Good: 機密情報をマスク
logger.info(f"User login: {email}")  # ✅
```

## Frontend (TypeScript/SvelteKit) レビューポイント

### 型安全性

```typescript
// Bad: any の使用
function processData(data: any): any {  // ❌
  return data.map((item: any) => item.value);
}

// Good: 明確な型定義
interface DataItem {
  id: number;
  value: string;
}

function processData(data: DataItem[]): string[] {  // ✅
  return data.map(item => item.value);
}

// Bad: asによる強引なキャスト
const user = response.data as User;  // ❌ 型チェックをバイパス

// Good: 型ガードで安全に
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
}

if (isUser(response.data)) {
  const user = response.data;  // ✅ 型安全
}
```

### リアクティビティ

```svelte
<script lang="ts">
  // Bad: リアクティブ宣言なしで派生値を計算
  let items = [1, 2, 3];
  let total = items.reduce((a, b) => a + b, 0);  // ❌ 更新されない
  
  function addItem(item: number) {
    items = [...items, item];
    // totalは自動更新されない
  }
</script>

<script lang="ts">
  // Good: リアクティブ宣言を使用
  let items = [1, 2, 3];
  $: total = items.reduce((a, b) => a + b, 0);  // ✅ 自動更新
  
  function addItem(item: number) {
    items = [...items, item];
    // totalは自動的に再計算される
  }
</script>
```

### エラーハンドリング

```typescript
// Bad: エラーを無視
async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);  // ❌ エラーチェックなし
  return response.json();
}

// Good: 適切なエラーハンドリング
async function fetchUser(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!isUser(data)) {
      throw new Error('Invalid user data');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

### セキュリティ（XSS対策）

```svelte
<!-- Bad: HTMLを直接埋め込み -->
<div>{@html userInput}</div>  <!-- ❌ XSSの危険性 -->

<!-- Good: エスケープされたテキスト -->
<div>{userInput}</div>  <!-- ✅ 自動エスケープ -->

<!-- Good: 信頼できるHTMLのみ -->
<div>{@html sanitizeHtml(trustedContent)}</div>  <!-- ✅ サニタイズ済み -->
```

## コードスタイル

### Backend (Python)

#### 命名規則

```python
# Good
class UserService:  # PascalCase（クラス）
    def get_user_by_id(self, user_id: int):  # snake_case（関数）
        MAX_RETRY_COUNT = 3  # UPPER_SNAKE_CASE（定数）
        is_active = True  # snake_case（変数）
```

#### インポート順序

```python
# Good: 標準 → サードパーティ → ローカル
import os
import sys
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.domain.entities.user import User
from src.infrastructure.database import get_db
from src.usecase.user_service import UserService
```

### Frontend (TypeScript)

#### 命名規則

```typescript
// Good
class UserService {}  // PascalCase（クラス）
function getUserById(id: number) {}  // camelCase（関数）
const API_BASE_URL = 'https://api.example.com';  // UPPER_SNAKE_CASE（定数）
interface UserResponse {}  // PascalCase（型・インターフェース）
```

## パフォーマンス

### N+1問題

```python
# Bad: N+1問題
users = db.query(User).all()
for user in users:
    posts = db.query(Post).filter(Post.user_id == user.id).all()  # ❌ N回クエリ

# Good: Eager Loading
users = db.query(User).options(joinedload(User.posts)).all()  # ✅ 1回のクエリ
for user in users:
    posts = user.posts
```

### 不要な再レンダリング

```svelte
<script lang="ts">
  // Bad: 毎回新しいオブジェクトを生成
  let items = [1, 2, 3];
  $: mappedItems = items.map(i => ({ value: i }));  // ❌ 毎回再生成
</script>

<script lang="ts">
  // Good: 必要な時だけ再計算
  let items = [1, 2, 3];
  let mappedItems = items.map(i => ({ value: i }));
  
  function updateItems(newItems: number[]) {
    items = newItems;
    mappedItems = items.map(i => ({ value: i }));  // ✅ 明示的な更新
  }
</script>
```

## テスト

### テストの必須性

```python
# Bad: テストなし
def create_user(data: UserCreate) -> User:
    # 実装のみ
    pass  # ❌

# Good: テストあり
# tests/test_user_service.py
def test_create_user_with_valid_data_returns_user():
    # Arrange
    service = UserService(mock_repository)
    data = UserCreate(name="Test", email="test@example.com")
    
    # Act
    result = service.create_user(data)
    
    # Assert
    assert result.name == "Test"
    assert result.email == "test@example.com"
```

### テストカバレッジ

- **Domain層**: 90%以上
- **UseCase層**: 80%以上
- **Infrastructure層**: 70%以上
- **API/UI層**: 主要パスをカバー

## コメント

### 良いコメント

```python
# Good: なぜそうするのか説明
# ユーザー削除後30日間はデータを保持する必要があるため、
# 論理削除（ソフトデリート）を使用
user.deleted_at = datetime.now()

# Good: 複雑なビジネスロジックの説明
# 会員ランクの計算: 過去12ヶ月の購入金額に基づく
# ゴールド: 100,000円以上
# シルバー: 50,000円以上
# ブロンズ: それ以下
rank = calculate_member_rank(total_amount)
```

### 悪いコメント

```python
# Bad: コードを読めばわかる
i = i + 1  # iに1を足す ❌

# Bad: 古いコードのコメントアウト
# def old_function():
#     pass
# ❌ 削除すべき

# Bad: TODO without context
# TODO: fix this  ❌

# Good: 具体的なTODO
# TODO(username): ページネーション実装必要 #123  ✅
```

## レビューコメントの書き方

### Must（必須修正）

```
[Must] SQLインジェクションの脆弱性があります

現状のコード:
query = f"SELECT * FROM users WHERE email = '{email}'"

問題点:
ユーザー入力を直接SQL文に埋め込んでいるため、SQLインジェクション攻撃の危険性があります。

修正案:
db.query(User).filter(User.email == email).first()

参考: OWASP SQL Injection Prevention Cheat Sheet
```

### Should（推奨修正）

```
[Should] 関数が長すぎて理解しにくいです

現状: process_data()が150行あります

推奨:
- データ取得、加工、保存の3つの関数に分割
- 各関数は単一責務に
- 50行以内を目標に

こうすることで:
- テストが書きやすくなる
- 再利用性が向上
- 可読性が改善
```

### Nice to have（改善提案）

```
[Nice to have] より良い設計パターンがあるかもしれません

現状は問題ありませんが、将来的にはStrategy Patternの適用を検討してみてはいかがでしょうか。

メリット:
- 新しい支払い方法の追加が容易
- テストが書きやすい
- 拡張性が向上

参考実装例: [リンク]
```

### ポジティブフィードバック

```
[Good] エラーハンドリングが素晴らしいです！

具体的な例外を捕捉し、適切なログを出力し、ユーザーにわかりやすいエラーメッセージを返している点が良いです。
他の箇所でも参考にさせてください。
```

## レビュー禁止事項

### やってはいけないこと

- ❌ **人格攻撃**: 「このコード書いた人はセンスがない」
- ❌ **曖昧な指摘**: 「なんか変」「微妙」
- ❌ **理由なし否定**: 「ダメです」だけ
- ❌ **過度な細かい指摘**: タイポや些細なスタイルの指摘に終始
- ❌ **代替案なし**: 問題点の指摘のみで解決策を示さない
- ❌ **後出しジャンケン**: レビュー後に新しい要件を追加

### 推奨すること

- ✅ **建設的**: 「〇〇すると、△△のメリットがあります」
- ✅ **具体的**: コード例や参考リンクを提示
- ✅ **優先順位**: Must/Should/Niceの明確化
- ✅ **ポジティブ**: 良い点も積極的に評価
- ✅ **学習機会**: 「なぜ」を説明して知識共有
- ✅ **質問形式**: 「〇〇の理由は何でしょうか？」

## レビュー承認基準

### 承認可能（Approve）

- [ ] 全てのMust項目がクリア
- [ ] 重大なバグがない
- [ ] テストが実装されている
- [ ] テストが通っている
- [ ] セキュリティ上の問題がない
- [ ] Should項目の大半が対応済み

### 条件付き承認（Approve with Comments）

- [ ] Must項目はクリア
- [ ] Should項目に若干の課題が残る
- [ ] Nice to have の改善提案がある
- [ ] 後続のリファクタリングで対応予定

### 修正依頼（Request Changes）

- [ ] Must項目に問題がある
- [ ] セキュリティ上の問題がある
- [ ] テストが実装されていない
- [ ] 重大なバグがある

## ツール活用

### 自動チェック

**Backend**:
```bash
# Linter
poetry run flake8 src/
poetry run mypy src/

# Formatter
poetry run black src/
poetry run isort src/

# Test
poetry run pytest --cov=src
```

**Frontend**:
```bash
# Linter
npm run lint

# Formatter
npm run format

# Type check
npm run check

# Test
npm run test
```

### 手動レビューに集中

自動化できることは自動化し、レビュアーは以下に集中：
- ビジネスロジックの正確性
- アーキテクチャの適切性
- セキュリティ
- 設計の妥当性
- テストの質

## まとめ

コードレビューは**品質向上**と**知識共有**の重要な機会です。

**レビュアー**:
- 建設的で具体的なフィードバックを提供
- 優先順位を明確に
- 良い点も積極的に評価

**レビューイー**:
- フィードバックを前向きに受け止める
- 設計判断の理由を説明できるようにする
- わからないことは質問する

お互いに学び合い、チーム全体のコード品質を向上させましょう。

---

## コミット前セルフレビュー

### ルール

**コミット前に必ずセルフレビューを実施すること**

AIアシスタントがコードを変更した場合も、コミット前に以下の確認を行う。

### セルフレビューチェックリスト

#### 1. 変更範囲の確認
- [ ] 変更内容が依頼された範囲に収まっているか
- [ ] 意図しない変更が含まれていないか
- [ ] プロダクションコードとテストコードの変更が適切か

#### 2. プロダクションコード変更時の確認
- [ ] テストを通すためだけの変更になっていないか
- [ ] 変更がバグ修正なのか、テスト修正が必要なのか明確か
- [ ] 影響範囲を把握しているか

#### 3. テストコード変更時の確認
- [ ] テストが実装の仕様を正しく反映しているか
- [ ] 期待値の変更理由が明確か
- [ ] テストをスキップする場合、理由が妥当か

#### 4. 品質確認
- [ ] 全テストがパスするか
- [ ] Lintエラーがないか
- [ ] 不要なデバッグコードが残っていないか

### AIアシスタントへの指示

コミットを依頼された場合：

1. **変更内容の要約を提示する**
   - 何を変更したか
   - なぜ変更したか（バグ修正 or テスト修正 or 機能追加）

2. **プロダクションコード変更時は確認を取る**
   - テストを通すための変更ではないことを説明
   - または、実装のバグ修正であることを明示

3. **レビュー後にコミットする**
   - ユーザーの承認を得てからコミット
