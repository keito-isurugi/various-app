import type { Timestamp } from "firebase/firestore";

/**
 * Question データ型
 * Firestore の questions コレクションの型定義
 */
export interface Question {
	id: string;
	group: string; // DSA, Backend, Frontend, etc.
	category: string; // DSA - Technical Question, Networking, etc.
	japaneseQuestion: string;
	englishQuestion: string;
	japaneseAnswer: string;
	englishAnswer: string;
	relatedLink: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

/**
 * 学習履歴の個別記録
 */
export interface AttemptRecord {
	answeredAt: Timestamp;
	understood: boolean; // わかった: true, わからなかった: false
	timeSpent: number; // 所要時間（秒）
}

/**
 * ユーザーの問題ごとの進捗
 * Firestore の userProgress コレクションの型定義
 */
export interface UserProgress {
	id: string;
	userId: string;
	questionId: string;
	attempts: AttemptRecord[];
	lastReviewedAt: Timestamp | null;
	nextReviewAt: Timestamp | null; // 間隔反復学習用（Phase 3）
	easeFactor: number; // SM-2 アルゴリズム用（Phase 3）
	interval: number; // 復習間隔（日数）（Phase 3）
	bookmarked: boolean;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

/**
 * カテゴリ別統計
 */
export interface CategoryStats {
	total: number; // 総問題数
	answered: number; // 解答済み問題数
	understood: number; // 理解した問題数
}

/**
 * ユーザーの全体統計
 * Firestore の userStats コレクションの型定義
 */
export interface UserStats {
	id: string;
	userId: string;
	totalQuestions: number;
	answeredQuestions: number;
	understoodCount: number;
	totalTimeSpent: number; // 総学習時間（秒）
	currentStreak: number; // 現在の連続学習日数
	longestStreak: number; // 最長連続学習日数
	lastStudiedAt: Timestamp | null;
	categoryStats: Record<string, CategoryStats>; // カテゴリ別統計
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

/**
 * 日別学習進捗
 * Firestore の dailyProgress コレクションの型定義
 */
export interface DailyProgress {
	id: string;
	userId: string;
	date: string; // YYYY-MM-DD
	questionsAnswered: number;
	questionsUnderstood: number;
	timeSpent: number; // 学習時間（秒）
	completed: boolean; // デイリーチャレンジ完了
	createdAt: Timestamp;
}

/**
 * 言語設定
 */
export type Language = "ja" | "en";

/**
 * 問題表示用の型（UI用）
 */
export interface QuestionDisplay extends Question {
	currentLanguage: Language;
	showAnswer: boolean;
}

/**
 * 学習セッション（UI状態管理用）
 */
export interface StudySession {
	questionIds: string[]; // セッション内の問題IDリスト
	currentIndex: number; // 現在の問題インデックス
	startTime: number; // セッション開始時刻（timestamp）
	language: Language; // 表示言語
}

/**
 * 問題フィルター
 */
export interface QuestionFilter {
	groups?: string[]; // フィルタするグループ
	categories?: string[]; // フィルタするカテゴリ
	bookmarkedOnly?: boolean; // ブックマークのみ
	unansweredOnly?: boolean; // 未解答のみ
	reviewOnly?: boolean; // 復習対象のみ
}

/**
 * JSONインポート用の型（tech-test.json の構造）
 */
export interface TechTestQuestion {
	Group: string;
	Category: string;
	Japanese_Question: string;
	English_Question: string;
	Japanese_Answer: string;
	English_Answer: string;
	Related_Link: string;
}
