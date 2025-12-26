---
paths: ["backend/infrastructure", "backend/DDL"]
description: データベース設計規約（GORM + PostgreSQL）
---

# Database Rules (データベース設計規約)

## GORM モデル定義

### 基本構造

```go
// Good: 標準的なGORMモデル
type Image struct {
    ID        uint           `gorm:"primaryKey"`
    Name      string         `gorm:"type:varchar(255);not null"`
    URL       string         `gorm:"type:text;not null"`
    Tags      []Tag          `gorm:"many2many:image_tags;"`
    CreatedAt time.Time      `gorm:"autoCreateTime"`
    UpdatedAt time.Time      `gorm:"autoUpdateTime"`
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

## 外部キー制約 (Foreign Key)

### ON DELETE の方針

| 方式 | 使用可否 | 説明 |
|------|---------|------|
| **CASCADE** | ✅ 推奨 | 親削除時に子も削除。プロジェクト標準 |
| **SET NULL** | ❌ 原則禁止 | 元のIDが失われ、追跡困難になる |
| **RESTRICT** | △ 限定的 | 削除を防ぎたい場合のみ |

### GORM での外部キー定義

```go
// Good: CASCADE を使用
type ImageTag struct {
    ImageID uint `gorm:"primaryKey;constraint:OnDelete:CASCADE"`
    TagID   uint `gorm:"primaryKey;constraint:OnDelete:CASCADE"`
}

// Bad: SET NULL は原則禁止
type BadExample struct {
    UserID *uint `gorm:"constraint:OnDelete:SET NULL"` // ❌
}
```

### DDLでの定義

```sql
-- Good: 標準パターン
CREATE TABLE image_tags (
    image_id INTEGER NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (image_id, tag_id)
);
```

## リレーション定義

### Has Many

```go
type Image struct {
    ID       uint
    Comments []Comment `gorm:"foreignKey:ImageID;constraint:OnDelete:CASCADE"`
}

type Comment struct {
    ID      uint
    ImageID uint
    Content string
}
```

### Many to Many

```go
type Image struct {
    ID   uint
    Tags []Tag `gorm:"many2many:image_tags;"`
}

type Tag struct {
    ID     uint
    Name   string
    Images []Image `gorm:"many2many:image_tags;"`
}
```

### Belongs To

```go
type Comment struct {
    ID      uint
    ImageID uint
    Image   Image `gorm:"foreignKey:ImageID"`
}
```

## 命名規則

- **テーブル名**: 複数形、snake_case（GORMが自動変換）
- **カラム名**: snake_case（GORMが自動変換）
- **モデル名**: 単数形、PascalCase
- **インデックス名**: `idx_{テーブル名}_{カラム名}`

```go
// モデル名: Image → テーブル名: images
type Image struct {
    ID        uint      // → id
    ImageURL  string    // → image_url
    CreatedAt time.Time // → created_at
}
```

## タイムスタンプ

```go
type BaseModel struct {
    ID        uint           `gorm:"primaryKey"`
    CreatedAt time.Time      `gorm:"autoCreateTime"`
    UpdatedAt time.Time      `gorm:"autoUpdateTime"`
    DeletedAt gorm.DeletedAt `gorm:"index"` // ソフトデリート用
}

type Image struct {
    BaseModel
    Name string
    URL  string
}
```

## マイグレーション

### DDLファイルの配置

マイグレーションファイルは `/backend/DDL/` に配置：

```
DDL/
├── 000001_create_images_table.up.sql
├── 000001_create_images_table.down.sql
├── 000002_create_tags_table.up.sql
├── 000002_create_tags_table.down.sql
├── 000003_create_image_tags_table.up.sql
└── 000003_create_image_tags_table.down.sql
```

### マイグレーション命名規則

- `{番号}_{説明}.up.sql` - 適用用
- `{番号}_{説明}.down.sql` - ロールバック用

### マイグレーション例

```sql
-- 000001_create_images_table.up.sql
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_images_deleted_at ON images(deleted_at);
```

```sql
-- 000001_create_images_table.down.sql
DROP TABLE IF EXISTS images;
```

## クエリパターン

### Preload（関連データの取得）

```go
// Good: 必要な関連のみPreload
func (r *imageRepository) FindByID(id uint) (*Image, error) {
    var image Image
    err := r.db.Preload("Tags").First(&image, id).Error
    return &image, err
}

// Bad: 不必要なPreload
func (r *imageRepository) FindByID(id uint) (*Image, error) {
    var image Image
    err := r.db.Preload(clause.Associations).First(&image, id).Error // ❌
    return &image, err
}
```

### トランザクション

```go
// Good: トランザクション管理
func (r *imageRepository) CreateWithTags(image *Image, tagIDs []uint) error {
    return r.db.Transaction(func(tx *gorm.DB) error {
        if err := tx.Create(image).Error; err != nil {
            return err
        }

        for _, tagID := range tagIDs {
            imageTag := ImageTag{ImageID: image.ID, TagID: tagID}
            if err := tx.Create(&imageTag).Error; err != nil {
                return err
            }
        }

        return nil
    })
}
```

### N+1問題の回避

```go
// Bad: N+1問題
func (r *imageRepository) FindAll() ([]Image, error) {
    var images []Image
    r.db.Find(&images)
    for i := range images {
        r.db.Model(&images[i]).Association("Tags").Find(&images[i].Tags) // ❌
    }
    return images, nil
}

// Good: Preloadで一括取得
func (r *imageRepository) FindAll() ([]Image, error) {
    var images []Image
    err := r.db.Preload("Tags").Find(&images).Error
    return images, err
}
```

## 実装チェックリスト

新しいテーブル作成時に確認：

- [ ] FK制約は `ON DELETE CASCADE` になっているか（または正当な理由でFK無し）
- [ ] `ON DELETE SET NULL` を使用していないか
- [ ] モデル名・テーブル名は命名規則に従っているか
- [ ] タイムスタンプ（created_at, updated_at）が定義されているか
- [ ] 必要なインデックスが定義されているか
- [ ] DDLファイルが `/backend/DDL/` に配置されているか
- [ ] up/downの両方のマイグレーションが用意されているか
