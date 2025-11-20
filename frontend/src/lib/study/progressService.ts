import { db } from "@/lib/firebase";
import type { AttemptRecord, UserProgress } from "@/types/study";
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

const USER_PROGRESS_COLLECTION = "userProgress";

/**
 * 一意のユーザーIDを生成（Phase 1では固定、Phase 2でFirebase Authと統合）
 */
function getCurrentUserId(): string {
	// Phase 1: ローカル開発用の固定ユーザーID
	// Phase 2: Firebase Authentication のユーザーIDを使用
	return "dev-user-001";
}

export const progressService = {
	/**
	 * ユーザーの問題進捗を取得
	 */
	async getUserProgress(questionId: string): Promise<UserProgress | null> {
		const userId = getCurrentUserId();
		const progressId = `${userId}_${questionId}`;
		const docRef = doc(db, USER_PROGRESS_COLLECTION, progressId);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		return {
			id: docSnap.id,
			...docSnap.data(),
		} as UserProgress;
	},

	/**
	 * ユーザーのすべての進捗を取得
	 */
	async getAllUserProgress(): Promise<UserProgress[]> {
		const userId = getCurrentUserId();
		const q = query(
			collection(db, USER_PROGRESS_COLLECTION),
			where("userId", "==", userId),
		);
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as UserProgress[];
	},

	/**
	 * 学習記録を追加
	 */
	async recordAttempt(
		questionId: string,
		understood: boolean,
		timeSpent: number,
	): Promise<void> {
		const userId = getCurrentUserId();
		const progressId = `${userId}_${questionId}`;
		const docRef = doc(db, USER_PROGRESS_COLLECTION, progressId);
		const existingProgress = await getDoc(docRef);

		const attemptRecord: AttemptRecord = {
			answeredAt: Timestamp.now(),
			understood,
			timeSpent,
		};

		if (existingProgress.exists()) {
			// 既存の進捗に追加
			const currentData = existingProgress.data() as UserProgress;
			const updatedAttempts = [...currentData.attempts, attemptRecord];

			await updateDoc(docRef, {
				attempts: updatedAttempts,
				lastReviewedAt: Timestamp.now(),
				updatedAt: Timestamp.now(),
			});
		} else {
			// 新規作成
			const newProgress: Omit<UserProgress, "id"> = {
				userId,
				questionId,
				attempts: [attemptRecord],
				lastReviewedAt: Timestamp.now(),
				nextReviewAt: null,
				easeFactor: 2.5, // SM-2 アルゴリズムのデフォルト値
				interval: 1,
				bookmarked: false,
				createdAt: Timestamp.now(),
				updatedAt: Timestamp.now(),
			};

			await setDoc(docRef, newProgress);
		}
	},

	/**
	 * ブックマークの切り替え
	 */
	async toggleBookmark(questionId: string): Promise<boolean> {
		const userId = getCurrentUserId();
		const progressId = `${userId}_${questionId}`;
		const docRef = doc(db, USER_PROGRESS_COLLECTION, progressId);
		const existingProgress = await getDoc(docRef);

		if (existingProgress.exists()) {
			const currentData = existingProgress.data() as UserProgress;
			const newBookmarkState = !currentData.bookmarked;

			await updateDoc(docRef, {
				bookmarked: newBookmarkState,
				updatedAt: Timestamp.now(),
			});

			return newBookmarkState;
		}

		// 進捗がない場合は新規作成してブックマーク
		const newProgress: Omit<UserProgress, "id"> = {
			userId,
			questionId,
			attempts: [],
			lastReviewedAt: null,
			nextReviewAt: null,
			easeFactor: 2.5,
			interval: 1,
			bookmarked: true,
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		};

		await setDoc(docRef, newProgress);
		return true;
	},

	/**
	 * ブックマークされた問題IDのリストを取得
	 */
	async getBookmarkedQuestionIds(): Promise<string[]> {
		const userId = getCurrentUserId();
		const q = query(
			collection(db, USER_PROGRESS_COLLECTION),
			where("userId", "==", userId),
			where("bookmarked", "==", true),
		);
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => doc.data().questionId as string);
	},

	/**
	 * 解答済みの問題IDのリストを取得
	 */
	async getAnsweredQuestionIds(): Promise<string[]> {
		const allProgress = await this.getAllUserProgress();
		return allProgress
			.filter((progress) => progress.attempts.length > 0)
			.map((progress) => progress.questionId);
	},

	/**
	 * 理解済みの問題IDのリストを取得（最後の試行が理解した場合）
	 */
	async getUnderstoodQuestionIds(): Promise<string[]> {
		const allProgress = await this.getAllUserProgress();
		return allProgress
			.filter((progress) => {
				if (progress.attempts.length === 0) return false;
				const lastAttempt = progress.attempts[progress.attempts.length - 1];
				return lastAttempt.understood;
			})
			.map((progress) => progress.questionId);
	},

	/**
	 * 統計情報を取得
	 */
	async getStatistics(): Promise<{
		totalAnswered: number;
		totalUnderstood: number;
		totalBookmarked: number;
		totalTimeSpent: number; // 秒
	}> {
		const allProgress = await this.getAllUserProgress();

		const totalAnswered = allProgress.filter(
			(p) => p.attempts.length > 0,
		).length;

		const totalUnderstood = allProgress.filter((p) => {
			if (p.attempts.length === 0) return false;
			const lastAttempt = p.attempts[p.attempts.length - 1];
			return lastAttempt.understood;
		}).length;

		const totalBookmarked = allProgress.filter((p) => p.bookmarked).length;

		const totalTimeSpent = allProgress.reduce((total, progress) => {
			const progressTime = progress.attempts.reduce(
				(sum, attempt) => sum + attempt.timeSpent,
				0,
			);
			return total + progressTime;
		}, 0);

		return {
			totalAnswered,
			totalUnderstood,
			totalBookmarked,
			totalTimeSpent,
		};
	},
};
