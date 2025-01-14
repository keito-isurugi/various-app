package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
)

type UpdateMultipleImageTagsUseCaseInputDto struct {
	ImageIDs []int
	TagIDs   []int
}

type RegisterMultipleImageTagsUseCase interface {
	Exec(c echo.Context, input UpdateMultipleImageTagsUseCaseInputDto) ([]int, error)
}

type registerMultipleImageTagsUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewRegisterMultipleImageTagsUseCase(imageTagRepo imageTagDomain.ImageTagRepository) RegisterMultipleImageTagsUseCase {
	return &registerMultipleImageTagsUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *registerMultipleImageTagsUseCase) Exec(c echo.Context, input UpdateMultipleImageTagsUseCaseInputDto) ([]int, error) {
	data := &imageTagDomain.UpdateMultipleImageTags{
		ImageIDs: input.ImageIDs,
		TagIDs:   input.TagIDs,
	}

	insertedIDs, err := uc.imageTagRepo.RegisterMultipleImageTags(c.Request().Context(), data)
	if err != nil {
		return nil, err
	}

	return insertedIDs, nil
}
