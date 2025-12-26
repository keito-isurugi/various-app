---
paths: ["backend"]
description: Backend責務分離ルール（Go Clean Architecture）
---

# Backend Layer Rules (責務分離ルール)

## Presentation Layer (`presentation/handler/`)

- **責務**: HTTPリクエスト/レスポンスの処理のみ
- **許可**: リクエストの受け取り、レスポンスの返却、HTTPステータスコードの設定
- **禁止事項**:
  - ビジネスロジック（権限チェック、バリデーション、データ集計）
  - 複数サービスの呼び出しを調整するオーケストレーション
  - ドメインエンティティ→DTOの変換ロジック（Application層で行う）

```go
// Good: シンプルなハンドラー
func (h *ImageHandler) GetImages(c echo.Context) error {
    images, err := h.useCase.GetImages()
    if err != nil {
        return c.JSON(http.StatusInternalServerError, err.Error())
    }
    return c.JSON(http.StatusOK, images)
}

// Bad: ハンドラーにビジネスロジック
func (h *ImageHandler) GetImages(c echo.Context) error {
    // ❌ ビジネスロジックがハンドラーに混入
    if !h.checkPermission(c) {
        return c.JSON(http.StatusForbidden, "forbidden")
    }
    // ❌ 複雑なフィルタリング
    images := h.filterByUser(c.Get("user"))
    return c.JSON(http.StatusOK, images)
}
```

## Application Layer (`application/`)

- **責務**: ユースケースのオーケストレーション、DTO変換
- **許可**:
  - 複数リポジトリの調整
  - トランザクション管理
  - ドメインサービスの呼び出し
  - DTO変換

```go
// Good: ユースケースの実装
type ImageUseCase struct {
    imageRepo  domain.ImageRepository
    tagRepo    domain.TagRepository
}

func (u *ImageUseCase) CreateImageWithTags(req CreateImageRequest) (*ImageResponse, error) {
    // トランザクション開始
    tx := u.db.Begin()
    defer tx.Rollback()

    // ドメインエンティティ作成
    image := domain.NewImage(req.Name, req.URL)

    // リポジトリ経由で永続化
    if err := u.imageRepo.Save(tx, image); err != nil {
        return nil, err
    }

    // タグ関連付け
    for _, tagID := range req.TagIDs {
        if err := u.imageRepo.AddTag(tx, image.ID, tagID); err != nil {
            return nil, err
        }
    }

    tx.Commit()
    return toImageResponse(image), nil
}
```

## Domain Layer (`domain/`)

- **責務**: ビジネスロジック、エンティティ、リポジトリインターフェース
- **許可**:
  - エンティティの定義と振る舞い
  - ドメインサービス
  - リポジトリインターフェースの定義
  - バリデーションルール

```go
// Good: ドメインエンティティ
type Image struct {
    ID        uint
    Name      string
    URL       string
    Tags      []Tag
    CreatedAt time.Time
}

func NewImage(name, url string) (*Image, error) {
    if name == "" {
        return nil, ErrEmptyName
    }
    if !isValidURL(url) {
        return nil, ErrInvalidURL
    }
    return &Image{
        Name:      name,
        URL:       url,
        CreatedAt: time.Now(),
    }, nil
}

// Good: リポジトリインターフェース（ドメイン層で定義）
type ImageRepository interface {
    FindByID(id uint) (*Image, error)
    FindAll() ([]*Image, error)
    Save(image *Image) error
    Delete(id uint) error
    AddTag(imageID, tagID uint) error
}
```

## Infrastructure Layer (`infrastructure/`)

- **責務**: 外部サービスとの連携、リポジトリ実装
- **許可**:
  - データベースアクセス（GORM）
  - 外部API呼び出し（S3等）
  - リポジトリインターフェースの実装

```go
// Good: リポジトリ実装
type imageRepository struct {
    db *gorm.DB
}

func NewImageRepository(db *gorm.DB) domain.ImageRepository {
    return &imageRepository{db: db}
}

func (r *imageRepository) FindByID(id uint) (*domain.Image, error) {
    var model ImageModel
    if err := r.db.Preload("Tags").First(&model, id).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            return nil, nil
        }
        return nil, err
    }
    return toDomainImage(&model), nil
}
```

## Server Layer (`server/`)

- **責務**: ルーティング、ミドルウェア設定
- **許可**:
  - Echoルーターの設定
  - ミドルウェアの登録
  - 依存性注入の設定

```go
// Good: ルーター設定
func SetupRouter(e *echo.Echo, h *handler.Handlers) {
    api := e.Group("/api")

    // 画像API
    images := api.Group("/images")
    images.GET("", h.Image.GetImages)
    images.GET("/:id", h.Image.GetImage)
    images.POST("", h.Image.CreateImage)
    images.DELETE("/:id", h.Image.DeleteImage)

    // タグAPI
    tags := api.Group("/tags")
    tags.GET("", h.Tag.GetTags)
    tags.POST("", h.Tag.CreateTag)
}
```

## 依存関係の方向

```
presentation → application → domain ← infrastructure
                    ↓
              infrastructure
```

- **domain**: 他の層に依存しない（最も安定）
- **application**: domainのみに依存
- **infrastructure**: domainのインターフェースを実装
- **presentation**: applicationのユースケースを呼び出す

## 実装チェックリスト

新しいエンドポイント実装時に確認：

- [ ] Handlerにビジネスロジックが混入していないか
- [ ] ドメインエンティティは`domain/`に定義されているか
- [ ] リポジトリインターフェースは`domain/`に定義されているか
- [ ] リポジトリ実装は`infrastructure/`にあるか
- [ ] DTO変換はApplication層で行っているか
- [ ] エラーハンドリングは適切か
