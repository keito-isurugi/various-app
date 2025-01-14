package repository

import (
	"context"
	"fmt"
	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql"
	"gorm.io/gorm"
)

type imageTagRepository struct {
	dbClient db.Client
}

func NewImageTagRepository(dbClient db.Client) imageTagDomain.ImageTagRepository {
	return &imageTagRepository{
		dbClient: dbClient,
	}
}

func (r *imageTagRepository) ListImageTags(ctx context.Context) (*imageTagDomain.ListImageTags, error) {
	var it imageTagDomain.ListImageTags
	if err := r.dbClient.Conn(ctx).Find(&it).Error; err != nil {
		return nil, err
	}

	fmt.Println(it)
	return &it, nil
}

func (r *imageTagRepository) GetImageTag(ctx context.Context, id int) (*imageTagDomain.ImageTag, error) {
	var it imageTagDomain.ImageTag
	if err := r.dbClient.Conn(ctx).
		Where("id", id).
		First(&it).Error; err != nil {
		return nil, err
	}

	return &it, nil
}

func (r *imageTagRepository) RegisterImageTag(ctx context.Context, imgTag *imageTagDomain.ImageTag) (int, error) {
	if err := r.dbClient.Conn(ctx).
		Create(imgTag).
		Error; err != nil {
		return 0, err
	}
	return imgTag.ID, nil
}

func (r *imageTagRepository) DeleteImageTag(ctx context.Context, id int) error {
	var it imageTagDomain.ImageTag
	if err := r.dbClient.Conn(ctx).Where("id", id).First(&it).Error; err != nil {
		return err
	}

	if err := r.dbClient.Conn(ctx).
		Delete(it).
		Error; err != nil {
		return err
	}

	return nil
}

func (r *imageTagRepository) RegisterMultipleImageTags(ctx context.Context, ids *imageTagDomain.UpdateMultipleImageTags) ([]int, error) {
	var insertedIDs []int

	if err := r.dbClient.Conn(ctx).Transaction(func(tx *gorm.DB) error {
		for _, imageID := range ids.ImageIDs {
			for _, tagID := range ids.TagIDs {
				imageTag := imageTagDomain.ImageTag{
					ImageID: imageID,
					TagID:   tagID,
				}

				if err := tx.Create(&imageTag).Error; err != nil {
					return err
				}
				insertedIDs = append(insertedIDs, imageTag.ID)
			}
		}
		return nil
	}); err != nil {
		return nil, err
	}

	return insertedIDs, nil
}

func (r *imageTagRepository) DeleteMultipleImageTags(ctx context.Context, ids *imageTagDomain.UpdateMultipleImageTags) error {
	if err := r.dbClient.Conn(ctx).Transaction(func(tx *gorm.DB) error {
		// 複数条件で削除を実行
		if err := tx.Where("image_id IN ?", ids.ImageIDs).
			Where("tag_id IN ?", ids.TagIDs).
			Delete(&imageTagDomain.ImageTag{}).Error; err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}

	return nil
}
