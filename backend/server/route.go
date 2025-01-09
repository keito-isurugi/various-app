package server

import (
	"net/http"

	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	imageApp "github.com/keito-isurugi/kei-talk/application/image"
	"github.com/keito-isurugi/kei-talk/infrastructure/env"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql/repository"
	imagePre "github.com/keito-isurugi/kei-talk/presentation/http/image"
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
