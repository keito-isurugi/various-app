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
	/** 現在の配列状態 */
	array: number[];
	/** 比較対象のインデックス */
	comparing?: number[];
	/** ハイライト対象のインデックス */
	highlightedElements?: number[];
	/** 探索範囲（開始・終了インデックス） */
	searchRange?: { start: number; end: number };
	/** 見つかった要素のインデックス */
	foundIndex?: number;
	/** このステップでの操作内容 */
	operation: string;
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
	/** 実行が成功したかどうか */
	success: boolean;
	/** 結果の値 */
	result: number | boolean | string | number[];
	/** 実行ステップの履歴 */
	steps: AlgorithmStep[];
	/** 実行時間（ステップ数） */
	executionSteps: number;
	/** 時間計算量 */
	timeComplexity: string;
	/** 空間計算量 */
	spaceComplexity: string;
}

/**
 * アルゴリズムの入力設定
 */
export interface AlgorithmInput {
	/** 対象となる配列 */
	array: number[];
	/** 探索対象の値 */
	target?: number;
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
