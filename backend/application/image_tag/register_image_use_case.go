package image_tag

import (
	"github.com/labstack/echo/v4"

	imageTagDomain "github.com/keito-isurugi/kei-talk/domain/image_tag"
)

type ImageTagUseCaseInputDto struct {
	ID      int
	ImageID int
	TagID   int
}

type RegisterImageUseCase interface {
	Exec(c echo.Context, imageTag ImageTagUseCaseInputDto) (int, error)
}

type registerImageUseCase struct {
	imageTagRepo imageTagDomain.ImageTagRepository
}

func NewRegisterImageUseCase(imageTagRepo imageTagDomain.ImageTagRepository) RegisterImageUseCase {
	return &registerImageUseCase{
		imageTagRepo: imageTagRepo,
	}
}

func (uc *registerImageUseCase) Exec(c echo.Context, imageTag ImageTagUseCaseInputDto) (int, error) {
	img := imageTagDomain.ImageTag{
		ImageID: imageTag.ImageID,
		TagID: imageTag.TagID,
	}

	id, err := uc.imageTagRepo.RegisterImageTag(c.Request().Context(), &img)
	if err != nil {
		return 0, err
	}

	return id, nil
}
