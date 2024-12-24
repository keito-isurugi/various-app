package image

import (
	"net/http"

	imageApp "github.com/keito-isurugi/kei-talk/application/image"
	"github.com/labstack/echo/v4"
)

const (
	S3ObjectKey = "todo-images"
)

type ImageHandler interface {
	ListImages(c echo.Context) error
}

type imageHnadler struct {
	listImagesUseCase imageApp.ListImagesUseCase
}

func NewTodoHandler(
	listImagesUseCase imageApp.ListImagesUseCase,
) ImageHandler {
	return &imageHnadler{
		listImagesUseCase: listImagesUseCase,
	}
}

func (ih *imageHnadler) ListImages(c echo.Context) error {
	li, err := ih.listImagesUseCase.Exec(c)
	if err != nil {
		return err
	}

	res := make([]imageResponseModel, len(li))
	for i := range li {
		res[i] = imageResponseModel{
			ID:          li[i].ID,
			ImagePath:   li[i].ImagePath,
			DisplayFlag: li[i].DisplayFlag,
		}
	}

	return c.JSON(http.StatusOK, res)
}
