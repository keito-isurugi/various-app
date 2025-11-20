import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TechTestQuestion } from "@/types/study";
import { getApps, initializeApp } from "firebase/app";
import {
	collection,
	connectFirestoreEmulator,
	doc,
	getFirestore,
	writeBatch,
} from "firebase/firestore";
import { NextResponse } from "next/server";

// Firebase初期化
function initializeFirebase() {
	if (getApps().length === 0) {
		const app = initializeApp({
			apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
			authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
		});

		const db = getFirestore(app);

		// Emulator接続
		if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
			try {
				connectFirestoreEmulator(db, "localhost", 8080);
			} catch (error) {
				// Already connected
			}
		}

		return db;
	}

	return getFirestore(getApps()[0]);
}

export async function POST() {
	try {
		// Firebase初期化
		const db = initializeFirebase();

		// tech-test.jsonを読み込み
		const filePath = resolve(process.cwd(), "tech-test.json");
		const fileContent = readFileSync(filePath, "utf-8");
		const questions = JSON.parse(fileContent) as TechTestQuestion[];

		let successCount = 0;
		let errorCount = 0;
		const questionsRef = collection(db, "questions");

		// バッチ処理でデータをインポート（500件ずつ）
		for (let i = 0; i < questions.length; i += 500) {
			const batch = writeBatch(db);
			const batchQuestions = questions.slice(i, i + 500);

			for (const [batchIndex, question] of batchQuestions.entries()) {
				try {
					const globalIndex = i + batchIndex;
					const docId = `q${String(globalIndex + 1).padStart(4, "0")}`;
					const docRef = doc(questionsRef, docId);

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
				} catch (error) {
					errorCount++;
					console.error(
						`Failed to import question ${i + batchIndex + 1}:`,
						error,
					);
				}
			}

			// バッチをコミット
			await batch.commit();
		}

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
