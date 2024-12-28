package image

import (
	"github.com/labstack/echo/v4"

	imageDomain "github.com/keito-isurugi/kei-talk/domain/image"
)

type ListImagesUseCase interface {
	Exec(c echo.Context) (imageDomain.ListImages, error)
}

type listImagesUseCase struct {
	imageRepo imageDomain.ImageRepository
}

func NewListImagesUseCase(imageRepo imageDomain.ImageRepository) ListImagesUseCase {
	return &listImagesUseCase{
		imageRepo: imageRepo,
	}
}

func (ltuc *listImagesUseCase) Exec(c echo.Context) (imageDomain.ListImages, error) {
	lt, err := ltuc.imageRepo.ListImages(c.Request().Context())
	if err != nil {
		return imageDomain.ListImages{}, err
	}

	return lt, nil
}
