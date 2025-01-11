//go:generate mockgen -source=tag_repository.go -destination=./mock/tag_repository_mock.go
package tag

import (
	"context"
)

type TagRepository interface {
	ListTags(ctx context.Context) (*ListTags, error)
	GetTag(ctx context.Context, id int) (*Tag, error)
	RegisterTag(ctx context.Context, tag *Tag) (int, error)
	UpdateTag(ctx context.Context, tag *Tag) error
	DeleteTag(ctx context.Context, id int) error
}
