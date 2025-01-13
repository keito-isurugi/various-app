package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
)

type GetImageUseCase interface {
	Exec(c echo.Context, id int) (*ImageUseCaseDto, error)
}

type getImageUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewGetImageUseCase(imageTagRepo imageTagDomain.ImageTagRepository) GetImageUseCase {
	return &getImageUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *getImageUseCase) Exec(c echo.Context, id int) (*ImageUseCaseDto, error) {
	img, err := uc.imageTagRepo.GetImageTag(c.Request().Context(), id)
	if err != nil {
		return nil, err
	}

	dto := ImageUseCaseDto{
		ID: img.ID,
		ImagePath: img.ImagePath,
		DisplayFlag: img.DisplayFlag,
	}

	return &dto, nil
}
