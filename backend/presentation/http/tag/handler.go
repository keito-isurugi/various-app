package tag

import (
	"net/http"
	"strconv"
	tagApp "github.com/keito-isurugi/various-app/application/tag"
	"github.com/keito-isurugi/various-app/infrastructure/env"
	"github.com/labstack/echo/v4"
)

type ImageHandler interface {
	ListTags(c echo.Context) error
	GetTag(c echo.Context) error
	RegisterTag(c echo.Context) error
	UpdateTag(c echo.Context) error
	DeleteTag(c echo.Context) error
}

type tagHandler struct {
	ev                   *env.Values
	listTagsUseCase    tagApp.ListTagsUseCase
	getTagUseCase      tagApp.GetTagUseCase
	registerTagUseCase tagApp.RegisterTagUseCase
	updateTagUseCase tagApp.UpdateTagUseCase
	deleteTagUseCase   tagApp.DeleteTagUseCase
}

func NewImageHandler(
	ev *env.Values,
	listTagsUseCase tagApp.ListTagsUseCase,
	getTagUseCase tagApp.GetTagUseCase,
	registerTagUseCase tagApp.RegisterTagUseCase,
	updateTagUseCase tagApp.UpdateTagUseCase,
	deleteTagUseCase tagApp.DeleteTagUseCase,
) ImageHandler {
	return &tagHandler{
		ev:                   ev,
		listTagsUseCase:    listTagsUseCase,
		getTagUseCase:      getTagUseCase,
		registerTagUseCase: registerTagUseCase,
		updateTagUseCase: updateTagUseCase,
		deleteTagUseCase:   deleteTagUseCase,
	}
}

func (h *tagHandler) ListTags(c echo.Context) error {
	lt, err := h.listTagsUseCase.Exec(c)
	if err != nil {
		return err
	}

	res := make([]tagResponseModel, len(*lt))
	for i, tag := range *lt {
		res[i] = tagResponseModel{
			ID:          tag.ID,
			Name:   tag.Name,
		}
	}

	return c.JSON(http.StatusOK, res)
}

func (h *tagHandler) GetTag(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return err
	}

	tag, err := h.getTagUseCase.Exec(c, id)
	if err != nil {
		return err
	}

	res := tagResponseModel{
		ID:          tag.ID,
		Name:   tag.Name,
	}

	return c.JSON(http.StatusOK, res)
}

func (h *tagHandler) RegisterTag(c echo.Context) error {
	var req registerTagRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	id, err := h.registerTagUseCase.Exec(c, req.Name)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, id)
}

func (h *tagHandler) UpdateTag(c echo.Context) error {
	var req updateTagRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	input := tagApp.TagUseCaseInputDto{
		ID: req.ID,
		Name: req.Name,
	}

	err := h.updateTagUseCase.Exec(c, input)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, nil)
}

func (h *tagHandler) DeleteTag(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return err
	}

	err = h.deleteTagUseCase.Exec(c, id)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, nil)
}
