/**
 * ウエイトトレーニングのレベル分類
 */
export type WeightLevel =
	| "初心者"
	| "初級者"
	| "中級者"
	| "上級者"
	| "エリート";

/**
 * 性別タイプ
 */
export type Gender = "male" | "female";

/**
 * BIG3の種目タイプ
 */
export type ExerciseType = "ベンチプレス" | "スクワット" | "デッドリフト";

/**
 * レベル別の重量データ
 */
export type LevelWeight = {
	[K in WeightLevel]: number;
};

/**
 * 体重と各レベルの挙上重量データ
 */
export interface WeightData extends LevelWeight {
	/** 体重 (kg) */
	bodyWeight: number;
}

/**
 * BIG3全種目のデータ構造
 */
export type BIG3Data = {
	[K in ExerciseType]: WeightData[];
};

/**
 * ユーザーの挙上重量とレベル判定結果
 */
export interface UserLiftData {
	/** 種目 */
	exercise: ExerciseType;
	/** ユーザーの挙上重量 (kg) */
	weight: number;
	/** 判定されたレベル */
	level: WeightLevel | "データなし";
	/** そのレベルでの推奨重量 */
	recommendedWeight?: number;
}

/**
 * 体重入力のバリデーション結果
 */
export interface WeightValidation {
	/** 入力値が有効かどうか */
	isValid: boolean;
	/** エラーメッセージ */
	errorMessage?: string;
}

/**
 * レベル判定の設定
 */
export interface LevelConfig {
	/** 最小体重 (kg) */
	minBodyWeight: number;
	/** 最大体重 (kg) */
	maxBodyWeight: number;
	/** 体重の刻み幅 (kg) */
	weightStep: number;
}

/**
 * BIG3合計値のデータ
 */
export interface BIG3TotalData {
	/** ベンチプレス重量 (kg) */
	benchPress: number;
	/** スクワット重量 (kg) */
	squat: number;
	/** デッドリフト重量 (kg) */
	deadlift: number;
	/** 合計重量 (kg) */
	total: number;
}

/**
 * レベル別BIG3合計値
 */
export type LevelBIG3Total = {
	[K in WeightLevel]: BIG3TotalData;
};
