/**
 * src/types/accounting.ts
 *
 * 会計解説システムの型定義
 * 会計初心者向けの学習支援機能をサポート
 */

/**
 * 減価償却の計算方法の種類
 */
export type DepreciationMethod =
	| "straight_line" // 定額法
	| "declining_balance" // 定率法
	| "sum_of_years" // 年数合計法
	| "units_of_production"; // 生産高比例法

/**
 * 減価償却計算の入力データ
 */
export interface DepreciationInput {
	/** 資産の取得価額（円） */
	acquisitionCost: number;
	/** 残存価額（円） */
	residualValue: number;
	/** 耐用年数（年） */
	usefulLife: number;
	/** 計算方法 */
	method: DepreciationMethod;
	/** 定率法の場合の償却率 */
	depreciationRate?: number;
	/** 生産高比例法の場合の期間中生産量 */
	periodProduction?: number;
	/** 生産高比例法の場合の総生産能力 */
	totalProductionCapacity?: number;
}

/**
 * 各年度の減価償却データ
 */
export interface DepreciationYearData {
	/** 年度 */
	year: number;
	/** 期首帳簿価額 */
	beginningBookValue: number;
	/** 年間償却額 */
	annualDepreciation: number;
	/** 累計償却額 */
	accumulatedDepreciation: number;
	/** 期末帳簿価額 */
	endingBookValue: number;
	/** 償却率（％） */
	depreciationRate: number;
}

/**
 * 減価償却計算の結果
 */
export interface DepreciationResult {
	/** 成功フラグ */
	success: boolean;
	/** 計算方法 */
	method: DepreciationMethod;
	/** 各年度のデータ */
	yearlyData: DepreciationYearData[];
	/** 総償却額 */
	totalDepreciation: number;
	/** 計算サマリー */
	summary: {
		/** 取得価額 */
		acquisitionCost: number;
		/** 残存価額 */
		residualValue: number;
		/** 耐用年数 */
		usefulLife: number;
		/** 償却可能額 */
		depreciableAmount: number;
		/** 年間平均償却額 */
		averageAnnualDepreciation: number;
	};
	/** エラーメッセージ（失敗時） */
	error?: string;
}

/**
 * 会計概念の説明レベル
 */
export type ExplanationLevel = "beginner" | "intermediate" | "advanced";

/**
 * 会計概念の解説セクション
 */
export interface AccountingExplanationSection {
	/** セクションID */
	id: string;
	/** タイトル */
	title: string;
	/** 説明レベル */
	level: ExplanationLevel;
	/** 本文 */
	content: string;
	/** 具体例 */
	examples?: string[];
	/** 重要度 */
	importance: "high" | "medium" | "low";
	/** 図表URL（オプション） */
	chartUrl?: string;
	/** 関連用語 */
	relatedTerms?: string[];
}

/**
 * 会計概念の解説データ
 */
export interface AccountingExplanationData {
	/** 概念のタイプ */
	conceptType: string;
	/** タイトル */
	title: string;
	/** 概要 */
	overview: string;
	/** 難易度（1-5） */
	difficulty: number;
	/** 学習時間（分） */
	estimatedTime: number;
	/** 解説セクション */
	sections: AccountingExplanationSection[];
	/** 前提知識 */
	prerequisites?: string[];
	/** 学習のポイント */
	learningTips?: string[];
}

/**
 * 会計用語の定義
 */
export interface AccountingTerm {
	/** 用語ID */
	id: string;
	/** 用語名 */
	term: string;
	/** 読み方 */
	reading?: string;
	/** 定義 */
	definition: string;
	/** 簡単な説明 */
	simpleExplanation: string;
	/** 例文 */
	example?: string;
	/** カテゴリ */
	category: string;
	/** 関連用語 */
	relatedTerms?: string[];
}

/**
 * 学習進捗の状態
 */
export interface LearningProgress {
	/** 概念ID */
	conceptId: string;
	/** 完了フラグ */
	completed: boolean;
	/** 理解度（1-5） */
	comprehensionLevel: number;
	/** 最終学習日 */
	lastStudied: Date;
	/** 学習回数 */
	studyCount: number;
	/** メモ */
	notes?: string;
}

/**
 * クイズ問題
 */
export interface AccountingQuizQuestion {
	/** 問題ID */
	id: string;
	/** 問題文 */
	question: string;
	/** 選択肢 */
	options: string[];
	/** 正解のインデックス */
	correctAnswer: number;
	/** 解説 */
	explanation: string;
	/** 難易度 */
	difficulty: ExplanationLevel;
	/** 関連概念 */
	relatedConcept: string;
}

/**
 * クイズ結果
 */
export interface QuizResult {
	/** 問題ID */
	questionId: string;
	/** ユーザーの回答 */
	userAnswer: number;
	/** 正解フラグ */
	isCorrect: boolean;
	/** 回答時間（秒） */
	timeSpent: number;
}
