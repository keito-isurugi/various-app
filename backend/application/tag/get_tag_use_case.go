package tag

import (
	"github.com/labstack/echo/v4"

	tagDomain "github.com/keito-isurugi/various-app/domain/tag"
)

type GetTagUseCase interface {
	Exec(c echo.Context, id int) (*TagUseCaseOutputDto, error)
}

type getTagUseCase struct {
	tagRepo tagDomain.TagRepository
}

func NewGetTagUseCase(tagRepo tagDomain.TagRepository) GetTagUseCase {
	return &getTagUseCase{
		tagRepo: tagRepo,
	}
}

func (uc *getTagUseCase) Exec(c echo.Context, id int) (*TagUseCaseOutputDto, error) {
	tag, err := uc.tagRepo.GetTag(c.Request().Context(), id)
	if err != nil {
		return nil, err
	}

	dto := TagUseCaseOutputDto{
		ID:   tag.ID,
		Name: tag.Name,
	}

	return &dto, nil
}
