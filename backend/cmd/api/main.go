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