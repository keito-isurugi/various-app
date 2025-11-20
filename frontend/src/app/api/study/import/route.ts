import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TechTestQuestion } from "@/types/study";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

// Firebase Admin初期化を遅延させる関数
function initializeFirebaseAdmin() {
	if (getApps().length === 0) {
		// Emulator mode
		if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
			process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
			initializeApp({
				projectId: "demo-project",
			});
		} else {
			// Production mode - 環境変数が存在しない場合はスキップ
			if (!process.env.FIREBASE_PRIVATE_KEY) {
				throw new Error(
					"Firebase credentials are not configured. This endpoint is only available in emulator mode or with proper Firebase credentials.",
				);
			}
			initializeApp({
				credential: cert({
					projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
					clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
					privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
				}),
			});
		}
	}
	return getFirestore();
}

export async function POST() {
	try {
		// Firebase Admin初期化
		const db = initializeFirebaseAdmin();

		// tech-test.jsonを読み込み
		const filePath = resolve(process.cwd(), "tech-test.json");
		const fileContent = readFileSync(filePath, "utf-8");
		const questions = JSON.parse(fileContent) as TechTestQuestion[];

		let successCount = 0;
		let errorCount = 0;
		const batch = db.batch();
		const questionsRef = db.collection("questions");

		// バッチ処理でデータをインポート
		for (const [index, question] of questions.entries()) {
			try {
				const docId = `q${String(index + 1).padStart(4, "0")}`;
				const docRef = questionsRef.doc(docId);

				// Firestoreに保存するデータを作成（camelCaseに変換）
				const questionData = {
					group: question.Group,
					category: question.Category,
					japaneseQuestion: question.Japanese_Question,
					englishQuestion: question.English_Question,
					japaneseAnswer: question.Japanese_Answer,
					englishAnswer: question.English_Answer,
					relatedLink: question.Related_Link,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				batch.set(docRef, questionData);
				successCount++;

				// Firestoreのバッチは最大500件まで
				if ((index + 1) % 500 === 0) {
					await batch.commit();
				}
			} catch (error) {
				errorCount++;
				console.error(`Failed to import question ${index + 1}:`, error);
			}
		}

		// 残りのバッチをコミット
		await batch.commit();

		return NextResponse.json({
			message: "問題データのインポートが完了しました",
			stats: {
				total: questions.length,
				success: successCount,
				failed: errorCount,
			},
		});
	} catch (error) {
		console.error("Import error:", error);
		return NextResponse.json(
			{
				error: "インポート処理中にエラーが発生しました",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		);
	}
}
