//go:generate mockgen -source=image_repository.go -destination=./mock/image_repository_mock.go
package image

import (
	"context"
)

type ImageRepository interface {
	ListImages(ctx context.Context) (*ListImages, error)
	GetImage(ctx context.Context, id int) (*Image, error)
	DeleteImage(ctx context.Context, path string) error
	RegisterImage(ctx context.Context, img *Image) (string, error)
	GetUntaggedImagesByTags(ctx context.Context, tagIDs *ListImagesNoTaggedTags) (*ListImages, error)
	GetTaggedImagesByTags(ctx context.Context, tagIDs []int) (*ListImages, error)
}
