package image

import (
	"github.com/labstack/echo/v4"

	imageDomain "github.com/keito-isurugi/kei-talk/domain/image"
)

type GetImageUseCase interface {
	Exec(c echo.Context, id int) (*ImageUseCaseDto, error)
}

type getImageUseCase struct {
	imageRepo imageDomain.ImageRepository
}

func NewGetImageUseCase(imageRepo imageDomain.ImageRepository) GetImageUseCase {
	return &getImageUseCase{
		imageRepo: imageRepo,
	}
}

func (uc *getImageUseCase) Exec(c echo.Context, id int) (*ImageUseCaseDto, error) {
	img, err := uc.imageRepo.GetImage(c.Request().Context(), id)
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
