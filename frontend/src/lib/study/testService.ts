import { db } from "@/lib/firebase";
import type { Question, TestQuestionResult, TestResult } from "@/types/study";
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";

const TEST_RESULTS_COLLECTION = "testResults";

/**
 * 一意のユーザーIDを取得
 */
function getCurrentUserId(): string {
	return "dev-user-001";
}

export const testService = {
	/**
	 * テスト結果を保存
	 */
	async saveTestResult(
		questions: Question[],
		answers: Map<string, boolean>,
		timesPerQuestion: Map<string, number>,
		startTime: number,
		timeLimit: number | null,
	): Promise<string> {
		const userId = getCurrentUserId();
		const completedAt = Timestamp.now();
		const startedAt = Timestamp.fromMillis(startTime);

		// 各問題の結果を作成
		const questionResults: TestQuestionResult[] = Array.from(
			answers.entries(),
		).map(([questionId, understood]) => ({
			questionId,
			understood,
			timeSpent: timesPerQuestion.get(questionId) || 0,
		}));

		// スコア計算
		const score = questionResults.filter((r) => r.understood).length;
		const percentage = Math.round((score / questions.length) * 100);

		// 総所要時間
		const totalTimeSpent = Array.from(timesPerQuestion.values()).reduce(
			(sum, time) => sum + time,
			0,
		);

		// グループとカテゴリを抽出
		const groups = Array.from(new Set(questions.map((q) => q.group)));
		const categories = Array.from(new Set(questions.map((q) => q.category)));

		const testResult: Omit<TestResult, "id"> = {
			userId,
			questionCount: questions.length,
			timeLimit,
			startedAt,
			completedAt,
			totalTimeSpent,
			score,
			percentage,
			questionResults,
			groups,
			categories,
			createdAt: Timestamp.now(),
		};

		const docRef = await addDoc(
			collection(db, TEST_RESULTS_COLLECTION),
			testResult,
		);

		return docRef.id;
	},

	/**
	 * テスト結果を取得
	 */
	async getTestResult(testId: string): Promise<TestResult | null> {
		const docRef = doc(db, TEST_RESULTS_COLLECTION, testId);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		return {
			id: docSnap.id,
			...docSnap.data(),
		} as TestResult;
	},

	/**
	 * ユーザーの全テスト結果を取得（新しい順）
	 */
	async getAllTestResults(): Promise<TestResult[]> {
		const userId = getCurrentUserId();
		const q = query(
			collection(db, TEST_RESULTS_COLLECTION),
			where("userId", "==", userId),
			orderBy("completedAt", "desc"),
		);

		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map(
			(doc) =>
				({
					id: doc.id,
					...doc.data(),
				}) as TestResult,
		);
	},

	/**
	 * 最近のテスト結果を取得
	 */
	async getRecentTestResults(limit = 10): Promise<TestResult[]> {
		const allResults = await this.getAllTestResults();
		return allResults.slice(0, limit);
	},

	/**
	 * テスト統計を取得
	 */
	async getTestStatistics(): Promise<{
		totalTests: number;
		averageScore: number;
		averagePercentage: number;
		highestScore: number;
		lowestScore: number;
		totalQuestionsAnswered: number;
	}> {
		const allResults = await this.getAllTestResults();

		if (allResults.length === 0) {
			return {
				totalTests: 0,
				averageScore: 0,
				averagePercentage: 0,
				highestScore: 0,
				lowestScore: 0,
				totalQuestionsAnswered: 0,
			};
		}

		const totalTests = allResults.length;
		const totalScore = allResults.reduce(
			(sum, result) => sum + result.score,
			0,
		);
		const totalPercentage = allResults.reduce(
			(sum, result) => sum + result.percentage,
			0,
		);
		const highestScore = Math.max(...allResults.map((r) => r.score));
		const lowestScore = Math.min(...allResults.map((r) => r.score));
		const totalQuestionsAnswered = allResults.reduce(
			(sum, result) => sum + result.questionCount,
			0,
		);

		return {
			totalTests,
			averageScore: Math.round(totalScore / totalTests),
			averagePercentage: Math.round(totalPercentage / totalTests),
			highestScore,
			lowestScore,
			totalQuestionsAnswered,
		};
	},

	/**
	 * カテゴリ別のテスト統計を取得
	 */
	async getCategoryTestStatistics(): Promise<
		Record<
			string,
			{
				tests: number;
				averagePercentage: number;
			}
		>
	> {
		const allResults = await this.getAllTestResults();
		const categoryStats: Record<
			string,
			{
				tests: number;
				totalPercentage: number;
			}
		> = {};

		for (const result of allResults) {
			for (const category of result.categories) {
				if (!categoryStats[category]) {
					categoryStats[category] = {
						tests: 0,
						totalPercentage: 0,
					};
				}
				categoryStats[category].tests += 1;
				categoryStats[category].totalPercentage += result.percentage;
			}
		}

		// 平均を計算
		const finalStats: Record<
			string,
			{
				tests: number;
				averagePercentage: number;
			}
		> = {};

		for (const [category, stats] of Object.entries(categoryStats)) {
			finalStats[category] = {
				tests: stats.tests,
				averagePercentage: Math.round(stats.totalPercentage / stats.tests),
			};
		}

		return finalStats;
	},

	/**
	 * 間違えた問題のIDリストを取得（直近のテストから）
	 */
	async getRecentMistakes(limit = 5): Promise<string[]> {
		const recentResults = await this.getRecentTestResults(limit);
		const mistakes = new Set<string>();

		for (const result of recentResults) {
			for (const questionResult of result.questionResults) {
				if (!questionResult.understood) {
					mistakes.add(questionResult.questionId);
				}
			}
		}

		return Array.from(mistakes);
	},
};
