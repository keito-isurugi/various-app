/**
 * トレーニングメニュー生成用の型定義
 */

/**
 * BIG3種目の英語キー
 */
export type ExerciseKey = "squat" | "bench" | "deadlift";

/**
 * 重量の刻み幅 (kg)
 */
export type WeightIncrement = 1.25 | 2.5 | 5;

/**
 * トレーニング目的
 */
export type TrainingGoal = "strength" | "hypertrophy";

/**
 * 1RMの入力値
 */
export interface OneRMInput {
	squat: number | "";
	bench: number | "";
	deadlift: number | "";
}

/**
 * トレーニングメニューの設定
 */
export interface TrainingConfig {
	/** 使用強度 (0-1) */
	intensity: number;
	/** 回数 */
	reps: number;
	/** セット数 */
	sets: number;
	/** 休憩時間 (分) */
	restTime: {
		min: number;
		max: number;
	};
	/** 補足表示 */
	note?: string;
}

/**
 * 計算されたトレーニングメニュー
 */
export interface TrainingMenu {
	/** 計算済み重量 (kg) */
	weight: number;
	/** 回数 */
	reps: number;
	/** セット数 */
	sets: number;
	/** 休憩時間 (分) */
	restTime: {
		min: number;
		max: number;
	};
	/** 補足表示 */
	note?: string;
}

/**
 * 種目ごとのトレーニングメニュー
 */
export interface ExerciseTrainingMenu {
	/** MAXアップ用メニュー */
	strength: TrainingMenu;
	/** 筋肥大用メニュー */
	hypertrophy: TrainingMenu;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
	isValid: boolean;
	errorMessage?: string;
}

/**
 * 種目の表示名マッピング
 */
export const EXERCISE_LABELS: Record<ExerciseKey, string> = {
	squat: "スクワット",
	bench: "ベンチプレス",
	deadlift: "デッドリフト",
};

/**
 * 種目の略称マッピング
 */
export const EXERCISE_SHORT_LABELS: Record<ExerciseKey, string> = {
	squat: "SQ",
	bench: "BP",
	deadlift: "DL",
};
