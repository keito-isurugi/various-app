package main

import (
	"fmt"

	"github.com/keito-isurugi/kei-talk/server"
)

// TODO envファイル読み込み
// TODO db初期化
// TODO logger初期化
// TODO S3初期化
func main() {
	fmt.Println("Hello World")
	router := server.SetupRouter()
	router.Start(":8080")
}