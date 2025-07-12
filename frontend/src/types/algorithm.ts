/**
 * src/types/algorithm.ts
 *
 * アルゴリズム解説機能に関する型定義
 * 可視化とインタラクティブな学習をサポート
 */

/**
 * アルゴリズムの実行ステップの状態
 */
export interface AlgorithmStep {
	/** ステップID */
	id: number;
	/** ステップの説明 */
	description: string;
	/** 現在の配列状態（配列系アルゴリズム用） */
	array?: number[];
	/** 比較対象のインデックス */
	comparing?: number[];
	/** ハイライト対象のインデックス（グラフ系ではノードID） */
	highlight?: string[] | number[];
	/** ハイライト対象の要素（旧互換性のため） */
	highlightedElements?: number[];
	/** セカンダリハイライト要素 */
	secondary?: string[];
	/** 探索範囲（開始・終了インデックス） */
	searchRange?: { start: number; end: number };
	/** 見つかった要素のインデックス */
	foundIndex?: number;
	/** このステップでの詳細情報 */
	details?: string;
	/** このステップでの操作内容（旧互換性のため） */
	operation?: string;
	/** 現在のアルゴリズム状態 */
	state?: Record<string, any>;
	/** 現在の変数状態 */
	variables?: Record<
		string,
		number | string | number[] | string[] | boolean | undefined
	>;
}

/**
 * アルゴリズムの実行結果
 */
export interface AlgorithmResult {
	/** 実行ステップの履歴 */
	steps: AlgorithmStep[];
	/** 実行結果のサマリー */
	summary?: {
		/** 比較回数 */
		comparisons?: number;
		/** 交換回数 */
		swaps?: number;
		/** 実行時間（ミリ秒） */
		timeElapsed?: number;
		/** 最終配列状態 */
		finalArray?: any[];
		/** その他の結果データ */
		[key: string]: any;
	};
	/** 実行成功フラグ（旧互換性のため） */
	success?: boolean;
	/** 実行結果（旧互換性のため） */
	result?: any;
	/** 実行ステップ（旧互換性のため） */
	executionSteps?: AlgorithmStep[];
	/** 時間計算量（旧互換性のため） */
	timeComplexity?: string;
}

/**
 * アルゴリズムの入力設定
 */
export interface AlgorithmInput {
	/** 対象となる配列（配列系アルゴリズム用） */
	array?: number[];
	/** 探索対象の値 */
	target?: number;
	/** グラフデータ（グラフ系アルゴリズム用） */
	graph?: Record<string, string[]>;
	/** 開始ノード（グラフ系アルゴリズム用） */
	startNode?: string;
	/** 目標ノード（グラフ系アルゴリズム用） */
	targetNode?: string;
	/** 実行方法 */
	method?: string;
	/** その他のパラメータ */
	parameters?: Record<string, any>;
}

/**
 * アルゴリズムの基本情報
 */
export interface AlgorithmInfo {
	/** アルゴリズムID */
	id: string;
	/** アルゴリズム名 */
	name: string;
	/** 短い説明 */
	description: string;
	/** カテゴリ */
	category: AlgorithmCategory;
	/** 時間計算量 */
	timeComplexity: {
		best: string;
		average: string;
		worst: string;
	};
	/** 空間計算量 */
	spaceComplexity: string;
	/** 難易度レベル（1-5） */
	difficulty: number;
}

/**
 * アルゴリズムのカテゴリ
 */
export type AlgorithmCategory =
	| "search" // 探索
	| "sort" // ソート
	| "graph" // グラフ
	| "dynamic" // 動的プログラミング
	| "greedy" // 貪欲法
	| "divide" // 分割統治
	| "string" // 文字列
	| "tree" // 木構造
	| "other"; // その他

/**
 * アルゴリズム実行の抽象インターフェース
 */
export interface Algorithm {
	/** アルゴリズムの基本情報 */
	readonly info: AlgorithmInfo;

	/**
	 * アルゴリズムを実行
	 * @param input 入力データ
	 * @returns 実行結果
	 */
	execute(input: AlgorithmInput): AlgorithmResult;

	/**
	 * デフォルトの入力例を取得
	 * @returns デフォルト入力
	 */
	getDefaultInput(): AlgorithmInput;

	/**
	 * アルゴリズムの詳細説明を取得
	 * @returns 説明テキスト
	 */
	getExplanation(): string;
}

/**
 * 可視化用の要素状態
 */
export interface VisualizationElement {
	/** 要素の値 */
	value: number;
	/** 要素のインデックス */
	index: number;
	/** 表示状態 */
	state: ElementState;
	/** ハイライト色 */
	color?: string;
	/** アニメーション状態 */
	isAnimating?: boolean;
}

/**
 * 可視化要素の状態
 */
export type ElementState =
	| "normal" // 通常状態
	| "comparing" // 比較中
	| "found" // 見つかった
	| "searching" // 探索範囲内
	| "excluded" // 探索範囲外
	| "pivot" // 基準点
	| "swapping"; // 交換中

/**
 * アルゴリズム実行の制御状態
 */
export interface ExecutionState {
	/** 実行中かどうか */
	isRunning: boolean;
	/** 一時停止中かどうか */
	isPaused: boolean;
	/** 現在のステップインデックス */
	currentStep: number;
	/** 実行速度（ミリ秒） */
	speed: number;
	/** 自動実行中かどうか */
	autoPlay: boolean;
}

/**
 * アルゴリズム解説データの構造
 */
export interface ExplanationData {
	/** 計算の種類 */
	calculationType: string;
	/** 解説のタイトル */
	title: string;
	/** 概要 */
	overview: string;
	/** 解説セクション */
	sections: ExplanationSection[];
}

/**
 * 解説セクションの構造
 */
export interface ExplanationSection {
	/** セクションID */
	id: string;
	/** セクションタイトル */
	title: string;
	/** セクション内容 */
	content: string;
	/** 重要度 */
	importance: "high" | "medium" | "low";
	/** 例文 */
	examples: string[];
	/** 数式（オプション） */
	formula?: string;
}
