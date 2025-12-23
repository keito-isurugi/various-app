package tag

import (
	"github.com/labstack/echo/v4"

	tagDomain "github.com/keito-isurugi/various-app/domain/tag"
)

type TagUseCaseOutputDto struct {
	ID   int
	Name string
}

type ListTagsUseCase interface {
	Exec(c echo.Context) (*[]TagUseCaseOutputDto, error)
}

type listTagsUseCase struct {
	tagRepo tagDomain.TagRepository
}

func NewListTagsUseCase(tagRepo tagDomain.TagRepository) ListTagsUseCase {
	return &listTagsUseCase{
		tagRepo: tagRepo,
	}
}

func (ltuc *listTagsUseCase) Exec(c echo.Context) (*[]TagUseCaseOutputDto, error) {
	tags, err := ltuc.tagRepo.ListTags(c.Request().Context())
	if err != nil {
		return nil, err
	}

	dto := make([]TagUseCaseOutputDto, len(*tags))
	for i, tag := range *tags {
		dto[i] = TagUseCaseOutputDto{
			ID:   tag.ID,
			Name: tag.Name,
		}
	}

	return &dto, nil
}
