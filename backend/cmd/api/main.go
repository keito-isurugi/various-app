package main

import (
	"fmt"

	"github.com/keito-isurugi/kei-talk/infrastructure/aws"
	"github.com/keito-isurugi/kei-talk/infrastructure/postgresql"
	"github.com/keito-isurugi/kei-talk/infrastructure/env"
	"github.com/keito-isurugi/kei-talk/infrastructure/logger"
	"github.com/keito-isurugi/kei-talk/server"
)

func main() {
	// 環境変数初期化
	ev, err := env.NewValue()
	if err != nil {
		fmt.Println(err.Error())
	}

	// ロガー初期化
	zapLogger, err := logger.NewLogger(ev.Debug)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer func() { _ = zapLogger.Sync() }()

	// dbクライアント初期化
	dbClient, err := db.NewClient(&ev.DB, zapLogger)
	if err != nil {
		zapLogger.Error(err.Error())
	}

	// awsクライアント初期化
	awsClient, err := aws.NewS3Client(ev)
	if err != nil {
		zapLogger.Error(err.Error())
	}

	router := server.SetupRouter(ev, dbClient, zapLogger, awsClient)
	router.Start(":8080")
}
