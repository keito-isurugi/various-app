import { db } from "@/lib/firebase";
import type { UserProgress } from "@/types/study";
import {
	Timestamp,
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

const USER_PROGRESS_COLLECTION = "userProgress";

/**
 * 一意のユーザーIDを生成
 */
function getCurrentUserId(): string {
	return "dev-user-001";
}

/**
 * SM-2 アルゴリズムの品質スコア（0-5）
 * 5: 完璧に理解
 * 4: 正しい答えだが少し苦労した
 * 3: 正しい答えだが大変苦労した
 * 2: 間違えたが、答えを見て思い出した
 * 1: 間違えて、答えを見てもよく分からなかった
 * 0: 完全に忘れていた
 */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * SM-2 アルゴリズムの結果
 */
export interface SM2Result {
	interval: number; // 次回復習までの日数
	easeFactor: number; // 難易度係数
	nextReviewAt: Date; // 次回復習日
}

/**
 * SM-2 アルゴリズムの実装
 * 参考: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 *
 * @param quality - 0-5の品質スコア
 * @param repetitions - 現在の繰り返し回数
 * @param easeFactor - 現在の難易度係数（初期値: 2.5）
 * @param interval - 現在の間隔（日数）
 * @returns SM2Result - 次回復習までの間隔、難易度係数、次回復習日
 */
export function calculateSM2(
	quality: Quality,
	repetitions: number,
	easeFactor: number,
	interval: number,
): SM2Result {
	let newEaseFactor = easeFactor;
	let newInterval = interval;
	let newRepetitions = repetitions;

	// 難易度係数の更新
	// EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
	newEaseFactor = Math.max(
		1.3,
		easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
	);

	// 品質が3未満の場合、復習をリセット
	if (quality < 3) {
		newRepetitions = 0;
		newInterval = 1;
	} else {
		newRepetitions += 1;

		// 間隔の計算
		if (newRepetitions === 1) {
			newInterval = 1;
		} else if (newRepetitions === 2) {
			newInterval = 6;
		} else {
			newInterval = Math.round(interval * newEaseFactor);
		}
	}

	// 次回復習日の計算
	const nextReviewAt = new Date();
	nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

	return {
		interval: newInterval,
		easeFactor: newEaseFactor,
		nextReviewAt,
	};
}

/**
 * 理解度（boolean）をSM-2の品質スコアに変換
 * understood = true  -> quality = 4 (正しい答え)
 * understood = false -> quality = 2 (間違えたが思い出した)
 */
function understoodToQuality(understood: boolean): Quality {
	return understood ? 4 : 2;
}

export const reviewService = {
	/**
	 * 今日復習すべき問題のリストを取得
	 */
	async getTodayReviewQuestions(): Promise<UserProgress[]> {
		const userId = getCurrentUserId();
		const now = Timestamp.now();

		const q = query(
			collection(db, USER_PROGRESS_COLLECTION),
			where("userId", "==", userId),
			where("nextReviewAt", "<=", now),
		);

		const querySnapshot = await getDocs(q);

		return querySnapshot.docs
			.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					}) as UserProgress,
			)
			.filter(
				(progress) =>
					progress.nextReviewAt !== null && progress.attempts.length > 0,
			);
	},

	/**
	 * 期限切れの復習問題を取得（今日の日付よりも前）
	 */
	async getOverdueReviewQuestions(): Promise<UserProgress[]> {
		const todayReviews = await this.getTodayReviewQuestions();
		const now = new Date();
		now.setHours(0, 0, 0, 0); // 今日の0時

		return todayReviews.filter((progress) => {
			if (!progress.nextReviewAt) return false;
			const reviewDate = progress.nextReviewAt.toDate();
			reviewDate.setHours(0, 0, 0, 0);
			return reviewDate < now;
		});
	},

	/**
	 * 復習記録を更新（SM-2アルゴリズムを適用）
	 */
	async updateReviewProgress(
		questionId: string,
		understood: boolean,
	): Promise<SM2Result> {
		const userId = getCurrentUserId();
		const progressId = `${userId}_${questionId}`;
		const docRef = doc(db, USER_PROGRESS_COLLECTION, progressId);

		// 現在の進捗を取得
		const q = query(
			collection(db, USER_PROGRESS_COLLECTION),
			where("userId", "==", userId),
			where("questionId", "==", questionId),
		);
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			throw new Error("Progress not found for this question");
		}

		const progressDoc = querySnapshot.docs[0];
		const currentProgress = progressDoc.data() as UserProgress;

		// SM-2アルゴリズムで次回復習日を計算
		const quality = understoodToQuality(understood);
		const repetitions = currentProgress.attempts.filter(
			(a) => a.understood,
		).length;
		const sm2Result = calculateSM2(
			quality,
			repetitions,
			currentProgress.easeFactor,
			currentProgress.interval,
		);

		// Firestoreを更新
		await updateDoc(docRef, {
			easeFactor: sm2Result.easeFactor,
			interval: sm2Result.interval,
			nextReviewAt: Timestamp.fromDate(sm2Result.nextReviewAt),
			lastReviewedAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		});

		return sm2Result;
	},

	/**
	 * 復習統計を取得
	 */
	async getReviewStatistics(): Promise<{
		totalReviewsToday: number;
		totalOverdue: number;
		completedToday: number;
	}> {
		const todayReviews = await this.getTodayReviewQuestions();
		const overdueReviews = await this.getOverdueReviewQuestions();

		// 今日完了した復習（lastReviewedAtが今日）
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const userId = getCurrentUserId();
		const q = query(
			collection(db, USER_PROGRESS_COLLECTION),
			where("userId", "==", userId),
			where("lastReviewedAt", ">=", Timestamp.fromDate(today)),
			where("lastReviewedAt", "<", Timestamp.fromDate(tomorrow)),
		);
		const completedSnapshot = await getDocs(q);

		return {
			totalReviewsToday: todayReviews.length,
			totalOverdue: overdueReviews.length,
			completedToday: completedSnapshot.size,
		};
	},

	/**
	 * 復習が必要な問題IDのリストを取得
	 */
	async getReviewQuestionIds(): Promise<string[]> {
		const reviewQuestions = await this.getTodayReviewQuestions();
		return reviewQuestions.map((progress) => progress.questionId);
	},

	/**
	 * 次回復習日を手動で設定
	 */
	async setNextReviewDate(
		questionId: string,
		daysFromNow: number,
	): Promise<void> {
		const userId = getCurrentUserId();
		const progressId = `${userId}_${questionId}`;
		const docRef = doc(db, USER_PROGRESS_COLLECTION, progressId);

		const nextReviewAt = new Date();
		nextReviewAt.setDate(nextReviewAt.getDate() + daysFromNow);

		await updateDoc(docRef, {
			nextReviewAt: Timestamp.fromDate(nextReviewAt),
			interval: daysFromNow,
			updatedAt: Timestamp.now(),
		});
	},
};
