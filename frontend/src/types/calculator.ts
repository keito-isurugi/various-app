/**
 * 計算機能の基本型定義
 * 拡張可能な計算システムの基盤となるインターフェース
 */

/** 計算パラメータの基本インターフェース */
export interface CalculationParameter {
	/** パラメータのID */
	id: string;
	/** パラメータ名 */
	name: string;
	/** 値 */
	value: number;
	/** 単位 */
	unit: string;
	/** 説明 */
	description?: string;
	/** 最小値 */
	min?: number;
	/** 最大値 */
	max?: number;
	/** 必須かどうか */
	required?: boolean;
}

/** 計算結果の基本インターフェース */
export interface CalculationResult {
	/** 結果のID */
	id: string;
	/** 結果名 */
	name: string;
	/** 値 */
	value: number;
	/** 単位 */
	unit: string;
	/** 説明 */
	description?: string;
	/** フォーマット済み表示文字列 */
	formattedValue: string;
}

/** バリデーション結果 */
export interface ValidationResult {
	/** バリデーション成功かどうか */
	isValid: boolean;
	/** エラーメッセージのリスト */
	errors: string[];
	/** 警告メッセージのリスト */
	warnings: string[];
}

/** 計算エラー */
export interface CalculationError {
	/** エラーID */
	id: string;
	/** エラーメッセージ */
	message: string;
	/** エラータイプ */
	type: "validation" | "computation" | "overflow" | "underflow";
	/** 関連するパラメータID */
	parameterId?: string;
	/** 詳細情報 */
	details?: Record<string, unknown>;
}

/** 計算履歴のエントリ */
export interface CalculationHistoryEntry {
	/** 履歴のID */
	id: string;
	/** 計算タイプ */
	calculationType: string;
	/** 計算実行時刻 */
	timestamp: Date;
	/** 入力パラメータ */
	parameters: CalculationParameter[];
	/** 計算結果 */
	results: CalculationResult[];
	/** 実行時間（ミリ秒） */
	executionTime: number;
}

/** 計算機能の共通インターフェース */
export interface Calculator {
	/** 計算タイプ名 */
	readonly type: string;
	/** 計算の表示名 */
	readonly displayName: string;
	/** 計算の説明 */
	readonly description: string;
	/** サポートするパラメータ定義 */
	readonly supportedParameters: ReadonlyArray<Omit<CalculationParameter, "value">>;
	
	/**
	 * パラメータのバリデーション
	 * @param parameters 検証するパラメータ
	 * @returns バリデーション結果
	 */
	validateParameters(parameters: CalculationParameter[]): ValidationResult;
	
	/**
	 * 計算実行
	 * @param parameters 計算パラメータ
	 * @returns 計算結果またはエラー
	 */
	calculate(parameters: CalculationParameter[]): Promise<CalculationResult[]> | CalculationResult[];
	
	/**
	 * 計算例の取得
	 * @returns サンプルパラメータ
	 */
	getExampleParameters(): CalculationParameter[];
}

/** 物理定数 */
export const PHYSICAL_CONSTANTS = {
	/** 光速 (m/s) */
	SPEED_OF_LIGHT: 299792458,
	/** 重力定数 (m³/kg/s²) */
	GRAVITATIONAL_CONSTANT: 6.67430e-11,
	/** プランク定数 (J⋅s) */
	PLANCK_CONSTANT: 6.62607015e-34,
	/** ボルツマン定数 (J/K) */
	BOLTZMANN_CONSTANT: 1.380649e-23,
	/** アボガドロ数 (1/mol) */
	AVOGADRO_NUMBER: 6.02214076e23,
} as const;

/** 計算タイプの列挙 */
export const CALCULATION_TYPES = {
	SCHWARZSCHILD_RADIUS: "schwarzschild_radius",
	// 将来的に追加される計算タイプ
	ESCAPE_VELOCITY: "escape_velocity",
	ORBITAL_VELOCITY: "orbital_velocity",
	TIME_DILATION: "time_dilation",
} as const;

export type CalculationType = typeof CALCULATION_TYPES[keyof typeof CALCULATION_TYPES];