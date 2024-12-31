package image

import (
	"github.com/labstack/echo/v4"

	imageDomain "github.com/keito-isurugi/kei-talk/domain/image"
)

type ImageUseCaseDto struct {
	ID          int
	ImagePath   string
	DisplayFlag bool
}

type ListImagesUseCase interface {
	Exec(c echo.Context) (*[]ImageUseCaseDto, error)
}

type listImagesUseCase struct {
	imageRepo imageDomain.ImageRepository
}

func NewListImagesUseCase(imageRepo imageDomain.ImageRepository) ListImagesUseCase {
	return &listImagesUseCase{
		imageRepo: imageRepo,
	}
}

func (ltuc *listImagesUseCase) Exec(c echo.Context) (*[]ImageUseCaseDto, error) {
	images, err := ltuc.imageRepo.ListImages(c.Request().Context())
	if err != nil {
		return nil, err
	}

	dto := make([]ImageUseCaseDto, len(*images))
	for i, img := range *images {
		dto[i] = ImageUseCaseDto{
			ID: img.ID,
			ImagePath: img.ImagePath,
			DisplayFlag: img.DisplayFlag,
		}
	}

	return &dto, nil
}
