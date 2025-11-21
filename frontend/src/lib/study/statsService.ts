import { db } from "@/lib/firebase";
import type { DailyProgress, UserStats } from "@/types/study";
import {
	Timestamp,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";

const USER_STATS_COLLECTION = "userStats";
const DAILY_PROGRESS_COLLECTION = "dailyProgress";

/**
 * 一意のユーザーIDを取得（Phase 1では固定、Phase 2でFirebase Authと統合）
 */
function getCurrentUserId(): string {
	// Phase 1: ローカル開発用の固定ユーザーID
	// Phase 2: Firebase Authentication のユーザーIDを使用
	return "dev-user-001";
}

/**
 * 日付文字列を生成（YYYY-MM-DD形式）
 */
function getDateString(date: Date = new Date()): string {
	return date.toISOString().split("T")[0];
}

/**
 * 2つの日付が連続しているかチェック
 */
function isConsecutive(date1: string, date2: string): boolean {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	const diff = Math.abs(d1.getTime() - d2.getTime());
	return diff === 24 * 60 * 60 * 1000; // 1日 = 86400000ミリ秒
}

export const statsService = {
	/**
	 * ユーザーの統計情報を取得
	 */
	async getUserStats(): Promise<UserStats | null> {
		const userId = getCurrentUserId();
		const docRef = doc(db, USER_STATS_COLLECTION, userId);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		return {
			id: docSnap.id,
			...docSnap.data(),
		} as UserStats;
	},

	/**
	 * ユーザー統計を初期化
	 */
	async initializeUserStats(): Promise<UserStats> {
		const userId = getCurrentUserId();
		const newStats: Omit<UserStats, "id"> = {
			userId,
			totalQuestions: 0,
			answeredQuestions: 0,
			understoodCount: 0,
			totalTimeSpent: 0,
			currentStreak: 0,
			longestStreak: 0,
			lastStudiedAt: null,
			categoryStats: {},
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		};

		const docRef = doc(db, USER_STATS_COLLECTION, userId);
		await setDoc(docRef, newStats);

		return {
			id: userId,
			...newStats,
		};
	},

	/**
	 * 統計情報を更新
	 */
	async updateUserStats(
		updates: Partial<Omit<UserStats, "id" | "userId" | "createdAt">>,
	): Promise<void> {
		const userId = getCurrentUserId();
		const docRef = doc(db, USER_STATS_COLLECTION, userId);

		await updateDoc(docRef, {
			...updates,
			updatedAt: Timestamp.now(),
		});
	},

	/**
	 * 連続学習日数を更新
	 */
	async updateStreak(): Promise<{
		currentStreak: number;
		longestStreak: number;
	}> {
		const stats = await this.getUserStats();
		if (!stats) {
			const newStats = await this.initializeUserStats();
			return {
				currentStreak: newStats.currentStreak,
				longestStreak: newStats.longestStreak,
			};
		}

		const today = getDateString();
		const lastStudied = stats.lastStudiedAt
			? getDateString(stats.lastStudiedAt.toDate())
			: null;

		let newCurrentStreak = stats.currentStreak;
		let newLongestStreak = stats.longestStreak;

		if (!lastStudied) {
			// 初回学習
			newCurrentStreak = 1;
			newLongestStreak = Math.max(1, newLongestStreak);
		} else if (lastStudied === today) {
			// 今日既に学習済み（ストリークは変更なし）
			return {
				currentStreak: newCurrentStreak,
				longestStreak: newLongestStreak,
			};
		} else if (isConsecutive(lastStudied, today)) {
			// 連続学習
			newCurrentStreak += 1;
			newLongestStreak = Math.max(newCurrentStreak, newLongestStreak);
		} else {
			// ストリーク途切れ
			newCurrentStreak = 1;
		}

		await this.updateUserStats({
			currentStreak: newCurrentStreak,
			longestStreak: newLongestStreak,
			lastStudiedAt: Timestamp.now(),
		});

		return {
			currentStreak: newCurrentStreak,
			longestStreak: newLongestStreak,
		};
	},

	/**
	 * 今日の学習進捗を取得
	 */
	async getTodayProgress(): Promise<DailyProgress | null> {
		const userId = getCurrentUserId();
		const today = getDateString();
		const progressId = `${userId}_${today}`;
		const docRef = doc(db, DAILY_PROGRESS_COLLECTION, progressId);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		return {
			id: docSnap.id,
			...docSnap.data(),
		} as DailyProgress;
	},

	/**
	 * 今日の学習進捗を初期化
	 */
	async initializeTodayProgress(): Promise<DailyProgress> {
		const userId = getCurrentUserId();
		const today = getDateString();
		const progressId = `${userId}_${today}`;

		const newProgress: Omit<DailyProgress, "id"> = {
			userId,
			date: today,
			questionsAnswered: 0,
			questionsUnderstood: 0,
			timeSpent: 0,
			completed: false,
			createdAt: Timestamp.now(),
		};

		const docRef = doc(db, DAILY_PROGRESS_COLLECTION, progressId);
		await setDoc(docRef, newProgress);

		return {
			id: progressId,
			...newProgress,
		};
	},

	/**
	 * 今日の学習進捗を更新
	 */
	async updateTodayProgress(
		understood: boolean,
		timeSpent: number,
	): Promise<DailyProgress> {
		let progress = await this.getTodayProgress();

		if (!progress) {
			progress = await this.initializeTodayProgress();
		}

		const newQuestionsAnswered = progress.questionsAnswered + 1;
		const newQuestionsUnderstood = understood
			? progress.questionsUnderstood + 1
			: progress.questionsUnderstood;
		const newTimeSpent = progress.timeSpent + timeSpent;

		// デイリーチャレンジ完了判定（3問以上解答）
		const newCompleted = newQuestionsAnswered >= 3;

		const userId = getCurrentUserId();
		const today = getDateString();
		const progressId = `${userId}_${today}`;
		const docRef = doc(db, DAILY_PROGRESS_COLLECTION, progressId);

		await updateDoc(docRef, {
			questionsAnswered: newQuestionsAnswered,
			questionsUnderstood: newQuestionsUnderstood,
			timeSpent: newTimeSpent,
			completed: newCompleted,
		});

		return {
			id: progressId,
			userId,
			date: today,
			questionsAnswered: newQuestionsAnswered,
			questionsUnderstood: newQuestionsUnderstood,
			timeSpent: newTimeSpent,
			completed: newCompleted,
			createdAt: progress.createdAt,
		};
	},

	/**
	 * 期間内の学習進捗を取得
	 */
	async getProgressInRange(
		startDate: string,
		endDate: string,
	): Promise<DailyProgress[]> {
		const userId = getCurrentUserId();
		const q = query(
			collection(db, DAILY_PROGRESS_COLLECTION),
			where("userId", "==", userId),
			where("date", ">=", startDate),
			where("date", "<=", endDate),
		);
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as DailyProgress[];
	},

	/**
	 * 過去N日間の学習進捗を取得
	 */
	async getRecentProgress(days = 30): Promise<DailyProgress[]> {
		const endDate = getDateString();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);
		const startDateString = getDateString(startDate);

		return this.getProgressInRange(startDateString, endDate);
	},

	/**
	 * カテゴリ別統計を更新
	 */
	async updateCategoryStats(
		category: string,
		answered: boolean,
		understood: boolean,
	): Promise<void> {
		const stats = await this.getUserStats();
		if (!stats) {
			await this.initializeUserStats();
			return this.updateCategoryStats(category, answered, understood);
		}

		const categoryStats = stats.categoryStats[category] || {
			total: 0,
			answered: 0,
			understood: 0,
		};

		if (answered) {
			categoryStats.answered += 1;
		}
		if (understood) {
			categoryStats.understood += 1;
		}

		await this.updateUserStats({
			categoryStats: {
				...stats.categoryStats,
				[category]: categoryStats,
			},
		});
	},

	/**
	 * 学習記録（統計の総合更新）
	 */
	async recordStudy(
		category: string,
		understood: boolean,
		timeSpent: number,
	): Promise<void> {
		// 今日の進捗を更新
		await this.updateTodayProgress(understood, timeSpent);

		// ストリークを更新
		await this.updateStreak();

		// カテゴリ別統計を更新
		await this.updateCategoryStats(category, true, understood);

		// 全体統計を更新
		const stats = await this.getUserStats();
		if (stats) {
			await this.updateUserStats({
				answeredQuestions: stats.answeredQuestions + 1,
				understoodCount: understood
					? stats.understoodCount + 1
					: stats.understoodCount,
				totalTimeSpent: stats.totalTimeSpent + timeSpent,
			});
		}
	},
};
