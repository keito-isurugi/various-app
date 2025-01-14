package server

import (
	"net/http"

	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	imageApp "github.com/keito-isurugi/kei-talk/application/image"
	imageTagApp "github.com/keito-isurugi/kei-talk/application/image_tag"
	tagApp "github.com/keito-isurugi/kei-talk/application/tag"
	"github.com/keito-isurugi/kei-talk/infrastructure/env"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql/repository"
	imagePre "github.com/keito-isurugi/kei-talk/presentation/http/image"
	imageTagPre "github.com/keito-isurugi/kei-talk/presentation/http/image_tag"
	tagPre "github.com/keito-isurugi/kei-talk/presentation/http/tag"
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

func SetupRouter(ev *env.Values, dbClient db.Client, _ *zap.Logger, awsClient s3iface.S3API) *echo.Echo {
	e := echo.New()
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"*"},
	}))

	api := e.Group("/api")
	api.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	imageRouter(ev, awsClient, api, dbClient)
	tagRouter(ev, api, dbClient)
	imageTagRouter(ev, api, dbClient)

	return e
}

func imageRouter(ev *env.Values, awsClient s3iface.S3API, eg *echo.Group, dbClient db.Client) {
	imageRepo := repository.NewImageRepository(dbClient)
	h := imagePre.NewImageHandler(
		ev,
		awsClient,
		imageApp.NewListImagesUseCase(imageRepo),
		imageApp.NewGetImageUseCase(imageRepo),
		imageApp.NewDeleteImageUseCase(imageRepo),
		imageApp.NewRegisterImageUseCase(imageRepo),
	)

	imageGroup := eg.Group("/images")
	imageGroup.GET("", h.ListImages)
	imageGroup.GET("/:id", h.GetImage)
	imageGroup.DELETE("/:id", h.DeleteImage)
	imageGroup.PUT("", h.RegisterImage)
	imageGroup.PUT("/multi", h.RegisterImages)
}

func tagRouter(ev *env.Values, eg *echo.Group, dbClient db.Client) {
	tagRepo := repository.NewTagRepository(dbClient)
	h := tagPre.NewImageHandler(
		ev,
		tagApp.NewListTagsUseCase(tagRepo),
		tagApp.NewGetTagUseCase(tagRepo),
		tagApp.NewRegisterTagUseCase(tagRepo),
		tagApp.NewUpdateTagUseCase(tagRepo),
		tagApp.NewDeleteTagUseCase(tagRepo),
	)

	tagGroup := eg.Group("/tags")
	tagGroup.GET("", h.ListTags)
	tagGroup.GET("/:id", h.GetTag)
	tagGroup.POST("", h.RegisterTag)
	tagGroup.PUT("/:id", h.UpdateTag)
	tagGroup.DELETE("/:id", h.DeleteTag)
}

func imageTagRouter(ev *env.Values, eg *echo.Group, dbClient db.Client) {
	imageTagRepo := repository.NewImageTagRepository(dbClient)
	h := imageTagPre.NewImageTagHandler(
		ev,
		imageTagApp.NewListImageTagsUseCase(imageTagRepo),
		imageTagApp.NewGetImageTagUseCase(imageTagRepo),
		imageTagApp.NewRegisterImageTagUseCase(imageTagRepo),
		imageTagApp.NewDeleteImageTagUseCase(imageTagRepo),
		imageTagApp.NewRegisterMultipleImageTagsUseCase(imageTagRepo),
		imageTagApp.NewDeleteMultipleImageTagsUseCase(imageTagRepo),
	)

	imageTagGroup := eg.Group("/image-tags")
	imageTagGroup.GET("", h.ListImageTags)
	imageTagGroup.POST("", h.RegisterImageTag)
	imageTagGroup.DELETE("/:id", h.DeleteImageTag)
	imageTagGroup.POST("/multi", h.RegisterMultipleImageTags)
	imageTagGroup.DELETE("/multi", h.DeleteMultipleImageTags)
}
