package repository

import (
	"context"
	"fmt"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql"
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

// func (r *imageTagRepository) UpdateTodo(ctx context.Context, todo *imageTagDomain.Image) error {
// 	var t imageTagDomain.Image
// 	if err := r.dbClient.Conn(ctx).Where("id", todo.ID).First(&t).Error; err != nil {
// 		return err
// 	}

// 	todo.CreatedAt = t.CreatedAt

// 	if err := r.dbClient.Conn(ctx).
// 		Updates(todo).
// 		Error; err != nil {
// 		return err
// 	}

// 	return nil
// }

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
