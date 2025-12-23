package tag

import (
	"github.com/labstack/echo/v4"

	tagDomain "github.com/keito-isurugi/various-app/domain/tag"
)

type UpdateTagUseCase interface {
	Exec(c echo.Context, input TagUseCaseInputDto) error
}

type updateTagUseCase struct {
	tagRepo tagDomain.TagRepository
}

type TagUseCaseInputDto struct {
	ID   int
	Name string
}

func NewUpdateTagUseCase(tagRepo tagDomain.TagRepository) UpdateTagUseCase {
	return &updateTagUseCase{
		tagRepo: tagRepo,
	}
}

func (uc *updateTagUseCase) Exec(c echo.Context, input TagUseCaseInputDto) error {
	tag := tagDomain.Tag{
		ID: input.ID,
		Name: input.Name,
	}

	err := uc.tagRepo.UpdateTag(c.Request().Context(), &tag)
	if err != nil {
		return err
	}

	return nil
}
