package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
)

type ImageTagsUseCaseOutputDto struct {
	ID int
	ImageID int
	TagID   int
}

type ListImageTagsUseCase interface {
	Exec(c echo.Context) (*[]ImageTagsUseCaseOutputDto, error)
}

type listImageTagsUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewListImageTagsUseCase(imageTagRepo imageTagDomain.ImageTagRepository) ListImageTagsUseCase {
	return &listImageTagsUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (ltuc *listImageTagsUseCase) Exec(c echo.Context) (*[]ImageTagsUseCaseOutputDto, error) {
	imageTags, err := ltuc.imageTagRepo.ListImageTags(c.Request().Context())
	if err != nil {
		return nil, err
	}

	dto := make([]ImageTagsUseCaseOutputDto, len(*imageTags))
	for i, it := range *imageTags {
		dto[i] = ImageTagsUseCaseOutputDto{
			ID: it.ID,
			ImageID: it.ImageID,
			TagID: it.TagID,
		}
	}

	return &dto, nil
}
