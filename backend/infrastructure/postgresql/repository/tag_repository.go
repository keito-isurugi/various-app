package repository

import (
	"context"

	"github.com/keito-isurugi/kei-talk/domain/tag"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql"
)

type tagRepository struct {
	dbClient db.Client
}

func NewTagRepository(dbClient db.Client) tag.TagRepository {
	return &tagRepository{
		dbClient: dbClient,
	}
}

func (r *tagRepository) ListTags(ctx context.Context) (*tag.ListTags, error) {
	var tl tag.ListTags
	if err := r.dbClient.Conn(ctx).Find(&tl).Error; err != nil {
		return nil, err
	}

	return &tl, nil
}

func (r *tagRepository) GetTag(ctx context.Context, id int) (*tag.Tag, error) {
	var tag tag.Tag
	if err := r.dbClient.Conn(ctx).
		Where("id", id).
		First(&tag).Error; err != nil {
		return nil, err
	}

	return &tag, nil
}

func (r *tagRepository) RegisterTag(ctx context.Context, tag *tag.Tag) (int, error) {
	if err := r.dbClient.Conn(ctx).
		Create(tag).
		Error; err != nil {
		return 0, err
	}
	return tag.ID, nil
}

func (r *tagRepository) UpdateTag(ctx context.Context, todo *tag.Tag) error {
	var t tag.Tag
	if err := r.dbClient.Conn(ctx).Where("id", todo.ID).First(&t).Error; err != nil {
		return err
	}

	todo.CreatedAt = t.CreatedAt

	if err := r.dbClient.Conn(ctx).
		Updates(todo).
		Error; err != nil {
		return err
	}

	return nil
}

func (r *tagRepository) DeleteTag(ctx context.Context, id int) error {
	var tag tag.Tag
	if err := r.dbClient.Conn(ctx).Where("id", id).First(&tag).Error; err != nil {
		return err
	}

	if err := r.dbClient.Conn(ctx).
		Delete(tag).
		Error; err != nil {
		return err
	}

	return nil
}
