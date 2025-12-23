package tag

import (
	"github.com/labstack/echo/v4"

	tagDomain "github.com/keito-isurugi/various-app/domain/tag"
)

type DeleteTagUseCase interface {
	Exec(c echo.Context, id int) error
}

type deleteTagUseCase struct {
	tagRepo tagDomain.TagRepository
}

func NewDeleteTagUseCase(tagRepo tagDomain.TagRepository) DeleteTagUseCase {
	return &deleteTagUseCase{
		tagRepo: tagRepo,
	}
}

func (uc *deleteTagUseCase) Exec(c echo.Context, id int) error {
	err := uc.tagRepo.DeleteTag(c.Request().Context(), id)
	if err != nil {
		return err
	}
	return nil
}
