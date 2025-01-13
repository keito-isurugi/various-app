package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
)

type GetImageTagUseCase interface {
	Exec(c echo.Context, id int) (*ImageTagsUseCaseOutputDto, error)
}

type getImageTagUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewGetImageTagUseCase(imageTagRepo imageTagDomain.ImageTagRepository) GetImageTagUseCase {
	return &getImageTagUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *getImageTagUseCase) Exec(c echo.Context, id int) (*ImageTagsUseCaseOutputDto, error) {
	it, err := uc.imageTagRepo.GetImageTag(c.Request().Context(), id)
	if err != nil {
		return nil, err
	}

	dto := ImageTagsUseCaseOutputDto{
		ID: it.ID,
		ImageID: it.ImageID,
		TagID: it.TagID,
	}

	return &dto, nil
}
