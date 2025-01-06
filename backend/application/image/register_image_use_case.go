package image

import (
	"github.com/labstack/echo/v4"

	imageDomain "github.com/keito-isurugi/kei-talk/domain/image"
)

type RegisterImageUseCase interface {
	Exec(c echo.Context, path string) (string, error)
}

type registerImageUseCase struct {
	imageRepo imageDomain.ImageRepository
}

func NewRegisterImageUseCase(imageRepo imageDomain.ImageRepository) RegisterImageUseCase {
	return &registerImageUseCase{
		imageRepo: imageRepo,
	}
}

func (uc *registerImageUseCase) Exec(c echo.Context, path string) (string, error) {
	img := imageDomain.Image{
		ImagePath: path,
		DisplayFlag: true,
	}

	path, err := uc.imageRepo.RegisterImage(c.Request().Context(), &img)
	if err != nil {
		return "", err
	}

	return path, nil
}
