package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
)

type DeleteMultipleImageTagsUseCase interface {
	Exec(c echo.Context, input UpdateMultipleImageTagsUseCaseInputDto) error
}

type deleteMultipleImageTagsUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewDeleteMultipleImageTagsUseCase(imageTagRepo imageTagDomain.ImageTagRepository) DeleteMultipleImageTagsUseCase {
	return &deleteMultipleImageTagsUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *deleteMultipleImageTagsUseCase) Exec(c echo.Context, input UpdateMultipleImageTagsUseCaseInputDto) error {
	data := &imageTagDomain.UpdateMultipleImageTags{
		ImageIDs: input.ImageIDs,
		TagIDs:   input.TagIDs,
	}

	err := uc.imageTagRepo.DeleteMultipleImageTags(c.Request().Context(), data)
	if err != nil {
		return err
	}

	return nil
}
