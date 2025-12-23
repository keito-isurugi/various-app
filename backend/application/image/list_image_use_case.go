package image

import (
	"github.com/labstack/echo/v4"

	tagApp "github.com/keito-isurugi/various-app/application/tag"
	imageDomain "github.com/keito-isurugi/various-app/domain/image"
)

type ImageUseCaseDto struct {
	ID          int
	ImagePath   string
	DisplayFlag bool
	Tags        []tagApp.TagUseCaseOutputDto
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
		// Tags を DTO に変換
		tagsDto := make([]tagApp.TagUseCaseOutputDto, len(img.Tags))
		for j, tag := range img.Tags {
			tagsDto[j] = tagApp.TagUseCaseOutputDto{
				ID:   tag.ID,
				Name: tag.Name,
			}
		}

		// 各 Image の情報を DTO に詰める
		dto[i] = ImageUseCaseDto{
			ID:          img.ID,
			ImagePath:   img.ImagePath,
			DisplayFlag: img.DisplayFlag,
			Tags:        tagsDto,
		}
	}

	return &dto, nil
}
