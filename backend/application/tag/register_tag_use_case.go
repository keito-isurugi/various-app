package tag

import (
	"github.com/labstack/echo/v4"

	tagDomain "github.com/keito-isurugi/kei-talk/domain/tag"
)

type RegisterTagUseCase interface {
	Exec(c echo.Context, name string) (int, error)
}

type registerTagUseCase struct {
	tagRepo tagDomain.TagRepository
}

func NewRegisterTagUseCase(tagRepo tagDomain.TagRepository) RegisterTagUseCase {
	return &registerTagUseCase{
		tagRepo: tagRepo,
	}
}

func (uc *registerTagUseCase) Exec(c echo.Context, name string) (int, error) {
	tag := tagDomain.Tag{
		Name: name,
	}

	id, err := uc.tagRepo.RegisterTag(c.Request().Context(), &tag)
	if err != nil {
		return 0, err
	}

	return id, nil
}
