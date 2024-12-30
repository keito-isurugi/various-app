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
	if err := ir.dbClient.Conn(ctx).Find(&lt).Error; err != nil {
		return nil, err
	}

	fmt.Println(lt)
	return &lt, nil
}

// func (ir *imageRepository) GetTodo(ctx context.Context, id int) (image.Image, error) {
// 	var t image.Image
// 	if err := ir.dbClient.Conn(ctx).
// 		Where("id", id).
// 		First(&t).Error; err != nil {
// 		return image.Image{}, err
// 	}

// 	return t, nil
// }

// func (ir *imageRepository) RegisterTodo(ctx context.Context, todo *image.Image) (int, error) {
// 	if err := ir.dbClient.Conn(ctx).
// 		Create(todo).
// 		Error; err != nil {
// 		return 0, err
// 	}

// 	return todo.ID, nil
// }

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

// func (ir *imageRepository) DeleteTodo(ctx context.Context, id int) error {
// 	var t image.Image
// 	if err := ir.dbClient.Conn(ctx).Where("id", id).First(&t).Error; err != nil {
// 		return err
// 	}

// 	if err := ir.dbClient.Conn(ctx).
// 		Delete(t).
// 		Error; err != nil {
// 		return err
// 	}

// 	return nil
// }
