package image_tag

import (
	"net/http"
	"strconv"

	imageTagApp "github.com/keito-isurugi/kei-talk/application/image_tag"
	"github.com/keito-isurugi/kei-talk/infrastructure/env"
	"github.com/labstack/echo/v4"
)

type ImageTagHandler interface {
	ListImageTags(c echo.Context) error
	GetImageTag(c echo.Context) error
	DeleteImageTag(c echo.Context) error
	RegisterImageTag(c echo.Context) error
}

type imageTagHandler struct {
	ev                   *env.Values
	listImageTagsUseCase    imageTagApp.ListImageTagsUseCase
	getImageTagUseCase      imageTagApp.GetImageTagUseCase
	deleteImageTagUseCase   imageTagApp.DeleteImageTagUseCase
	registerImageTagUseCase imageTagApp.RegisterImageTagUseCase
}

func NewImageTagHandler(
	ev *env.Values,
	listImageTagsUseCase imageTagApp.ListImageTagsUseCase,
	getImageTagUseCase imageTagApp.GetImageTagUseCase,
	registerImageTagUseCase imageTagApp.RegisterImageTagUseCase,
	deleteImageTagUseCase imageTagApp.DeleteImageTagUseCase,
) ImageTagHandler {
	return &imageTagHandler{
		ev:                   ev,
		listImageTagsUseCase:    listImageTagsUseCase,
		getImageTagUseCase:      getImageTagUseCase,
		registerImageTagUseCase: registerImageTagUseCase,
		deleteImageTagUseCase:   deleteImageTagUseCase,
	}
}

func (h *imageTagHandler) ListImageTags(c echo.Context) error {
	lit, err := h.listImageTagsUseCase.Exec(c)
	if err != nil {
		return err
	}

	res := make([]imageTagResponseModel, len(*lit))
	for i, it := range *lit {
		res[i] = imageTagResponseModel{
			ID:          it.ID,
			ImageID: it.ImageID,
			TagID: it.TagID,
		}
	}

	return c.JSON(http.StatusOK, res)
}

func (h *imageTagHandler) GetImageTag(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return err
	}

	it, err := h.getImageTagUseCase.Exec(c, id)
	if err != nil {
		return err
	}

	res := imageTagResponseModel{
		ID:          it.ID,
		ImageID: it.ImageID,
		TagID: it.TagID,
	}

	return c.JSON(http.StatusOK, res)
}

func (h *imageTagHandler) DeleteImageTag(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return err
	}

	err = h.deleteImageTagUseCase.Exec(c, id)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, nil)
}

func (h *imageTagHandler) RegisterImageTag(c echo.Context) error {
	var req registerImageTagRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	input := imageTagApp.ImageTagUseCaseInputDto{
		ImageID: req.ImageID,
		TagID: req.TagID,
	}

	id, err := h.registerImageTagUseCase.Exec(c, input)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, id)
}
