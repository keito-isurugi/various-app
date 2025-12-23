package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/various-app/domain/image_tag"
)

type DeleteImageTagUseCase interface {
	Exec(c echo.Context, id int) error
}

type deleteImageTagUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewDeleteImageTagUseCase(imageTagRepo imageTagDomain.ImageTagRepository) DeleteImageTagUseCase {
	return &deleteImageTagUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *deleteImageTagUseCase) Exec(c echo.Context, id int) error {
	err := uc.imageTagRepo.DeleteImageTag(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return nil
}
