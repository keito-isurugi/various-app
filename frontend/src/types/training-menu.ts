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

/**
 * 種目ごとのバッジカラー
 */
export const EXERCISE_BADGE_COLORS: Record<ExerciseKey, string> = {
	squat: "bg-red-500",
	bench: "bg-blue-500",
	deadlift: "bg-green-500",
};

/**
 * プログラム期間（週数）
 */
export type ProgramDuration = 4 | 6 | 8;

/**
 * 週間頻度
 */
export type WeeklyFrequency = 1 | 2;

/**
 * プログラム設定
 */
export interface ProgramSettings {
	/** プログラム期間（週数） */
	duration: ProgramDuration;
	/** 週間頻度 */
	frequency: WeeklyFrequency;
}

/**
 * 週ごとのプログラムテンプレート
 */
export interface WeekTemplate {
	/** 週番号 */
	week: number;
	/** 強度 (0-1) */
	intensity: number;
	/** 回数 */
	reps: number;
	/** セット数 */
	sets: number;
}

/**
 * 計算されたプログラム週
 */
export interface ProgramWeek {
	/** 週番号 */
	week: number;
	/** 強度 (%) */
	intensityPercent: number;
	/** 回数 */
	reps: number;
	/** セット数 */
	sets: number;
	/** Heavy日の重量 (kg) */
	weightHeavy: number;
	/** Light日の重量 (kg) - 週2回の場合のみ */
	weightLight?: number;
}

/**
 * 種目ごとのプログラム
 */
export interface ExerciseProgram {
	/** 週ごとのプログラム */
	weeks: ProgramWeek[];
}
