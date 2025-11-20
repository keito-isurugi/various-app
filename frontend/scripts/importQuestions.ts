/**
 * tech-test.json を Firestore にインポートするスクリプト
 *
 * 実行方法:
 * npx ts-node scripts/importQuestions.ts
 *
 * 注意:
 * - Firebase Emulator を起動してから実行してください
 * - 本番環境にインポートする場合は、NEXT_PUBLIC_USE_FIREBASE_EMULATOR を false に設定してください
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp } from "firebase/app";
import {
	collection,
	connectFirestoreEmulator,
	doc,
	getFirestore,
	setDoc,
	type Timestamp,
} from "firebase/firestore";
import type { TechTestQuestion } from "../src/types/study";

// Firebase設定
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Emulatorに接続（環境変数で制御）
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
	try {
		connectFirestoreEmulator(db, "localhost", 8080);
		console.log("🔥 Connected to Firestore Emulator");
	} catch (error) {
		console.log("⚠️  Firestore Emulator already connected");
	}
}

/**
 * tech-test.json を読み込む
 */
function loadTechTestData(): TechTestQuestion[] {
	const filePath = resolve(__dirname, "../tech-test.json");
	const fileContent = readFileSync(filePath, "utf-8");
	return JSON.parse(fileContent) as TechTestQuestion[];
}

/**
 * 問題データをFirestoreにインポート
 */
async function importQuestions() {
	console.log("📚 Starting to import questions...\n");

	const questions = loadTechTestData();
	console.log(`Found ${questions.length} questions to import\n`);

	const questionsCollection = collection(db, "questions");
	let successCount = 0;
	let errorCount = 0;

	for (const [index, question] of questions.entries()) {
		try {
			// ドキュメントIDを生成（インデックスベース）
			const docId = `q${String(index + 1).padStart(4, "0")}`;

			// Firestoreに保存するデータを作成
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

			// Firestoreに保存
			await setDoc(doc(questionsCollection, docId), questionData);

			successCount++;
			console.log(
				`✅ [${index + 1}/${questions.length}] Imported: ${question.Group} - ${question.Category.substring(0, 30)}...`,
			);
		} catch (error) {
			errorCount++;
			console.error(
				`❌ [${index + 1}/${questions.length}] Failed to import question:`,
				error,
			);
		}
	}

	console.log("\n📊 Import Summary:");
	console.log(`   Total: ${questions.length}`);
	console.log(`   Success: ${successCount}`);
	console.log(`   Failed: ${errorCount}`);

	if (successCount === questions.length) {
		console.log("\n🎉 All questions imported successfully!");
	} else {
		console.log(
			"\n⚠️  Some questions failed to import. Please check the errors above.",
		);
	}
}

/**
 * グループとカテゴリの統計を表示
 */
function showStatistics() {
	const questions = loadTechTestData();

	const groupStats = new Map<string, number>();
	const categoryStats = new Map<string, number>();

	for (const question of questions) {
		// グループ統計
		groupStats.set(question.Group, (groupStats.get(question.Group) || 0) + 1);

		// カテゴリ統計
		categoryStats.set(
			question.Category,
			(categoryStats.get(question.Category) || 0) + 1,
		);
	}

	console.log("\n📊 Question Statistics:\n");

	console.log("Groups:");
	for (const [group, count] of Array.from(groupStats.entries()).sort(
		(a, b) => b[1] - a[1],
	)) {
		console.log(`  - ${group}: ${count} questions`);
	}

	console.log("\nTop Categories:");
	const topCategories = Array.from(categoryStats.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10);

	for (const [category, count] of topCategories) {
		console.log(`  - ${category}: ${count} questions`);
	}

	console.log(`\nTotal unique categories: ${categoryStats.size}`);
}

/**
 * メイン処理
 */
async function main() {
	const args = process.argv.slice(2);

	if (args.includes("--stats")) {
		// 統計表示モード
		showStatistics();
	} else if (args.includes("--help")) {
		// ヘルプ表示
		console.log(`
Usage: npx ts-node scripts/importQuestions.ts [options]

Options:
  --stats    Show statistics about questions (groups, categories)
  --help     Show this help message

Examples:
  npx ts-node scripts/importQuestions.ts          # Import all questions
  npx ts-node scripts/importQuestions.ts --stats  # Show statistics
		`);
	} else {
		// デフォルト: インポート実行
		await importQuestions();
	}

	process.exit(0);
}

// スクリプト実行
main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
