import { db } from "@/lib/firebase";
import type { Question, QuestionFilter } from "@/types/study";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
	type QueryConstraint,
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

		let questions = querySnapshot.docs.map((doc) => ({
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

		// シャッフル（Fisher-Yates アルゴリズム）
		const shuffled = [...availableQuestions];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		return shuffled.slice(0, count);
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
