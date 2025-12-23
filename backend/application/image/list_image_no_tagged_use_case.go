package image

import (
	tagApp "github.com/keito-isurugi/various-app/application/tag"
	"github.com/labstack/echo/v4"

	imageDomain "github.com/keito-isurugi/various-app/domain/image"
)

type ListImagesNoTaggedInputDto struct {
	TagIDs []int
}

type ListImagesNoTaggedUseCase interface {
	Exec(c echo.Context, input ListImagesNoTaggedInputDto) (*[]ImageUseCaseDto, error)
}

type listImagesNoTaggedUseCase struct {
	imageRepo imageDomain.ImageRepository
}

func NewListImagesNoTaggedUseCase(imageRepo imageDomain.ImageRepository) ListImagesNoTaggedUseCase {
	return &listImagesNoTaggedUseCase{
		imageRepo: imageRepo,
	}
}

func (uc *listImagesNoTaggedUseCase) Exec(c echo.Context, input ListImagesNoTaggedInputDto) (*[]ImageUseCaseDto, error) {
	tagIDs := imageDomain.ListImagesNoTaggedTags{
		TagIDs: input.TagIDs,
	}
	images, err := uc.imageRepo.GetUntaggedImagesByTags(c.Request().Context(), &tagIDs)
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
