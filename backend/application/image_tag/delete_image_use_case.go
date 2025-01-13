package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
)

type DeleteImageUseCase interface {
	Exec(c echo.Context, id int) error
}

type deleteImageUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewDeleteImageUseCase(imageTagRepo imageTagDomain.ImageTagRepository) DeleteImageUseCase {
	return &deleteImageUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *deleteImageUseCase) Exec(c echo.Context, id int) error {
	err := uc.imageTagRepo.DeleteImageTag(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return nil
}
