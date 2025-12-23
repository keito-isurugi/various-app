package repository

import (
	"context"
	"fmt"
	imageDomain "github.com/keito-isurugi/various-app/domain/image"
	imageTagDomain "github.com/keito-isurugi/various-app/domain/image_tag"

	"github.com/keito-isurugi/various-app/domain/image"
	"github.com/keito-isurugi/various-app/infrastructure/postgresql"
)

type imageRepository struct {
	dbClient db.Client
}

func NewImageRepository(dbClient db.Client) image.ImageRepository {
	return &imageRepository{
		dbClient: dbClient,
	}
}

func (ir *imageRepository) ListImages(ctx context.Context) (*image.ListImages, error) {
	var lt image.ListImages
	if err := ir.dbClient.Conn(ctx).
		Where("display_flag", true).
		Preload("Tags").
		Find(&lt).Error; err != nil {
		return nil, err
	}

	fmt.Println(lt)
	return &lt, nil
}

func (ir *imageRepository) GetImage(ctx context.Context, id int) (*image.Image, error) {
	var img image.Image
	if err := ir.dbClient.Conn(ctx).
		Where("id", id).
		First(&img).Error; err != nil {
		return nil, err
	}

	return &img, nil
}

func (ir *imageRepository) RegisterImage(ctx context.Context, img *image.Image) (string, error) {
	if err := ir.dbClient.Conn(ctx).
		Create(img).
		Error; err != nil {
		return "", err
	}
	return img.ImagePath, nil
}

// func (ir *imageRepository) UpdateTodo(ctx context.Context, todo *image.Image) error {
// 	var t image.Image
// 	if err := ir.dbClient.Conn(ctx).Where("id", todo.ID).First(&t).Error; err != nil {
// 		return err
// 	}

// 	todo.CreatedAt = t.CreatedAt

// 	if err := ir.dbClient.Conn(ctx).
// 		Updates(todo).
// 		Error; err != nil {
// 		return err
// 	}

// 	return nil
// }

func (ir *imageRepository) DeleteImage(ctx context.Context, path string) error {
	var img image.Image
	if err := ir.dbClient.Conn(ctx).Where("image_path", path).First(&img).Error; err != nil {
		return err
	}

	if err := ir.dbClient.Conn(ctx).
		Delete(img).
		Error; err != nil {
		return err
	}

	return nil
}

func (ir *imageRepository) GetUntaggedImagesByTags(ctx context.Context, tagIDs *imageDomain.ListImagesNoTaggedTags) (*image.ListImages, error) {
	var untaggedImages image.ListImages

	// サブクエリ: すべての tagIDs に紐づいている image_id を計算
	subQuery := ir.dbClient.Conn(ctx).
		Model(&imageTagDomain.ImageTag{}).
		Select("image_id").
		Where("tag_id IN ?", tagIDs.TagIDs).
		Group("image_id").
		Having("COUNT(DISTINCT tag_id) = ?", len(tagIDs.TagIDs)) // 指定されたすべてのタグに紐づいている image_id

	// メインクエリ: 上記サブクエリに含まれない画像を取得し、Tags を Preload でロード
	if err := ir.dbClient.Conn(ctx).
		Where("id NOT IN (?)", subQuery).
		Preload("Tags"). // Tags情報をロード
		Find(&untaggedImages).Error; err != nil {
		return nil, err
	}

	return &untaggedImages, nil
}

func (ir *imageRepository) GetTaggedImagesByTags(ctx context.Context, tagIDs []int) (*image.ListImages, error) {
	var taggedImages image.ListImages

	// サブクエリを作成して、指定された tagIDs に紐づく image_id を取得
	subQuery := ir.dbClient.Conn(ctx).
		Model(&imageTagDomain.ImageTag{}).
		Select("image_id").
		Where("tag_id IN ?", tagIDs)

	// images テーブルで、そのような image_id を持つレコードを取得
	if err := ir.dbClient.Conn(ctx).
		Where("id IN (?)", subQuery).
		Find(&taggedImages).Error; err != nil {
		return nil, err
	}

	return &taggedImages, nil
}
