package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/various-app/domain/image_tag"
)

type ImageTagUseCaseInputDto struct {
	ImageID int
	TagID   int
}

type RegisterImageTagUseCase interface {
	Exec(c echo.Context, input ImageTagUseCaseInputDto) (int, error)
}

type registerImageUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewRegisterImageTagUseCase(imageTagRepo imageTagDomain.ImageTagRepository) RegisterImageTagUseCase {
	return &registerImageUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *registerImageUseCase) Exec(c echo.Context, input ImageTagUseCaseInputDto) (int, error) {
	img := imageTagDomain.ImageTag{
		ImageID: input.ImageID,
		TagID: input.TagID,
	}

	id, err := uc.imageTagRepo.RegisterImageTag(c.Request().Context(), &img)
	if err != nil {
		return 0, err
	}

	return id, nil
}
