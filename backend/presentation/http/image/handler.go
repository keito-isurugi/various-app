package image

import (
	"net/http"
	"strconv"

	imageApp "github.com/keito-isurugi/kei-talk/application/image"
	"github.com/labstack/echo/v4"
)

const (
	S3ObjectKey = "todo-images"
)

type ImageHandler interface {
	ListImages(c echo.Context) error
	GetImage(c echo.Context) error
	DeleteImage(c echo.Context) error
}

type imageHnadler struct {
	listImagesUseCase imageApp.ListImagesUseCase
	getImageUseCase imageApp.GetImageUseCase
	deleteImageUseCase imageApp.DeleteImageUseCase
}

func NewImageHandler(
	listImagesUseCase imageApp.ListImagesUseCase,
	getImageUseCase imageApp.GetImageUseCase,
	deleteImageUseCase imageApp.DeleteImageUseCase,
) ImageHandler {
	return &imageHnadler{
		listImagesUseCase: listImagesUseCase,
		getImageUseCase: getImageUseCase,
		deleteImageUseCase: deleteImageUseCase,
	}
}

func (ih *imageHnadler) ListImages(c echo.Context) error {
	li, err := ih.listImagesUseCase.Exec(c)
	if err != nil {
		return err
	}

	res := make([]imageResponseModel, len(*li))
	for i, img := range *li {
		res[i] = imageResponseModel{
			ID:          img.ID,
			ImagePath:   img.ImagePath,
			DisplayFlag: img.DisplayFlag,
		}
	}

	return c.JSON(http.StatusOK, res)
}

func (ih *imageHnadler) GetImage(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return err
	}

	gi, err := ih.getImageUseCase.Exec(c, id)
	if err != nil {
		return err
	}

	res := imageResponseModel{
		ID:          gi.ID,
		ImagePath:   gi.ImagePath,
		DisplayFlag: gi.DisplayFlag,
	}

	return c.JSON(http.StatusOK, res)
}

func (ih *imageHnadler) DeleteImage(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return err
	}

	err = ih.deleteImageUseCase.Exec(c, id)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, nil)
}