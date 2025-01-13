package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
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
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewListImagesUseCase(imageTagRepo imageTagDomain.ImageTagRepository) ListImagesUseCase {
	return &listImagesUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (ltuc *listImagesUseCase) Exec(c echo.Context) (*[]ImageUseCaseDto, error) {
	images, err := ltuc.imageTagRepo.ListImageTags(c.Request().Context())
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
