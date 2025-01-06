package repository

import (
	"context"
	"fmt"

	"github.com/keito-isurugi/kei-talk/domain/image"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql"
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
	if err := ir.dbClient.Conn(ctx).Where("display_flag", true).Find(&lt).Error; err != nil {
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

func (ir *imageRepository) DeleteImage(ctx context.Context, id int) error {
	var img image.Image
	if err := ir.dbClient.Conn(ctx).Where("id", id).First(&img).Error; err != nil {
		return err
	}

	if err := ir.dbClient.Conn(ctx).
		Delete(img).
		Error; err != nil {
		return err
	}

	return nil
}
