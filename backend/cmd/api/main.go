package main

import (
	"fmt"

	"github.com/keito-isurugi/kei-talk/infra/env"
	"github.com/keito-isurugi/kei-talk/infra/logger"
	"github.com/keito-isurugi/kei-talk/infra/db"
	"github.com/keito-isurugi/kei-talk/infra/aws"
	"github.com/keito-isurugi/kei-talk/server"
)

// TODO envファイル読み込み
// TODO db初期化
// TODO logger初期化
// TODO S3初期化
func main() {
	fmt.Println("Hello World")
	ev, err := env.NewValue()
	if err != nil {
		fmt.Println(err.Error())
	}

	zapLogger, err := logger.NewLogger(ev.Debug)
	if err != nil {
		fmt.Println(err.Error())
	}
	defer func() { _ = zapLogger.Sync() }()

	dbClient, err := db.NewClient(&ev.DB, zapLogger)
	if err != nil {
		zapLogger.Error(err.Error())
	}

	awsClient, err := aws.NewS3Client(ev)
	if err != nil {
		zapLogger.Error(err.Error())
	}

	router := server.SetupRouter(ev, dbClient, zapLogger, awsClient)
	router.Start(":8080")
}