package server

import (
	"net/http"

	"github.com/aws/aws-sdk-go/service/s3/s3iface"
	"github.com/keito-isurugi/kei-talk/infra/db"
	"github.com/keito-isurugi/kei-talk/infra/env"
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

	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	imageGroup := e.Group("/images")
	imageGroup.GET("", func(c echo.Context) error {
		return c.JSON(http.StatusOK, "Hello World!")
	})

	return e
}
