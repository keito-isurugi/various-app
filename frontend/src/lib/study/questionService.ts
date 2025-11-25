import { db } from "@/lib/firebase";
import type { Question, QuestionFilter } from "@/types/study";
import {
	type QueryConstraint,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";

const QUESTIONS_COLLECTION = "questions";

export const questionService = {
	/**
	 * すべての問題を取得
	 */
	async getAllQuestions(): Promise<Question[]> {
		const q = query(
			collection(db, QUESTIONS_COLLECTION),
			orderBy("createdAt", "asc"),
		);
		const querySnapshot = await getDocs(q);

		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Question[];
	},

	/**
	 * 問題IDで1件取得
	 */
	async getQuestionById(id: string): Promise<Question | null> {
		const docRef = doc(db, QUESTIONS_COLLECTION, id);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		return {
			id: docSnap.id,
			...docSnap.data(),
		} as Question;
	},

	/**
	 * フィルター条件で問題を取得
	 */
	async getFilteredQuestions(filter: QuestionFilter): Promise<Question[]> {
		const constraints: QueryConstraint[] = [];

		// グループでフィルタ
		if (filter.groups && filter.groups.length > 0) {
			constraints.push(where("group", "in", filter.groups));
		}

		// カテゴリでフィルタ
		if (filter.categories && filter.categories.length > 0) {
			constraints.push(where("category", "in", filter.categories));
		}

		constraints.push(orderBy("createdAt", "asc"));

		const q = query(collection(db, QUESTIONS_COLLECTION), ...constraints);
		const querySnapshot = await getDocs(q);

		const questions = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Question[];

		// フィルタ条件を追加適用（クライアント側）
		// Note: Firestoreの制限により、一部のフィルタはクライアント側で実行
		if (filter.unansweredOnly) {
			// Phase 1では未実装（Phase 2でuserProgressと連携）
			console.warn("unansweredOnly filter not implemented in Phase 1");
		}

		if (filter.bookmarkedOnly) {
			// Phase 1では未実装（Phase 2でuserProgressと連携）
			console.warn("bookmarkedOnly filter not implemented in Phase 1");
		}

		if (filter.reviewOnly) {
			// Phase 3で実装
			console.warn("reviewOnly filter not implemented in Phase 1");
		}

		return questions;
	},

	/**
	 * ランダムに問題を取得
	 * @param count 取得する問題数
	 * @param excludeIds 除外する問題ID
	 */
	async getRandomQuestions(
		count: number,
		excludeIds: string[] = [],
	): Promise<Question[]> {
		const allQuestions = await this.getAllQuestions();

		// 除外IDをフィルタ
		const availableQuestions = allQuestions.filter(
			(q) => !excludeIds.includes(q.id),
		);

		// より良い乱数生成のため、現在時刻をシードとして使用
		// crypto.getRandomValues()を使用してより高品質な乱数を生成
		const getSecureRandom = () => {
			if (typeof window !== "undefined" && window.crypto) {
				const array = new Uint32Array(1);
				window.crypto.getRandomValues(array);
				return array[0] / (0xffffffff + 1);
			}
			return Math.random();
		};

		// シャッフル（改良版Fisher-Yates アルゴリズム）
		const shuffled = [...availableQuestions];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(getSecureRandom() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		// 選択された問題のグループ分布をログ出力（デバッグ用）
		const selected = shuffled.slice(0, count);
		if (typeof console !== "undefined") {
			const distribution = selected.reduce(
				(acc, q) => {
					acc[q.group] = (acc[q.group] || 0) + 1;
					return acc;
				},
				{} as Record<string, number>,
			);
			console.log("Random questions distribution:", distribution);
		}

		return selected;
	},

	/**
	 * 利用可能なグループ一覧を取得
	 */
	async getAvailableGroups(): Promise<string[]> {
		const questions = await this.getAllQuestions();
		const groups = new Set(questions.map((q) => q.group));
		return Array.from(groups).sort();
	},

	/**
	 * 利用可能なカテゴリ一覧を取得
	 */
	async getAvailableCategories(): Promise<string[]> {
		const questions = await this.getAllQuestions();
		const categories = new Set(questions.map((q) => q.category));
		return Array.from(categories).sort();
	},

	/**
	 * グループ別の問題数を取得
	 */
	async getQuestionCountByGroup(): Promise<Record<string, number>> {
		const questions = await this.getAllQuestions();
		const counts: Record<string, number> = {};

		for (const question of questions) {
			counts[question.group] = (counts[question.group] || 0) + 1;
		}

		return counts;
	},

	/**
	 * カテゴリ別の問題数を取得
	 */
	async getQuestionCountByCategory(): Promise<Record<string, number>> {
		const questions = await this.getAllQuestions();
		const counts: Record<string, number> = {};

		for (const question of questions) {
			counts[question.category] = (counts[question.category] || 0) + 1;
		}

		return counts;
	},
};
