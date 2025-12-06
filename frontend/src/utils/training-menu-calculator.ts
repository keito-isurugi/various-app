import type {
	ExerciseKey,
	ExerciseTrainingMenu,
	OneRMInput,
	TrainingConfig,
	TrainingMenu,
	ValidationResult,
	WeightIncrement,
} from "../types/training-menu";

/**
 * MAXアップ用（Strength）の設定
 * - 使用強度: 85% 1RM
 * - 3回 × 5セット
 * - 休憩: 3〜5分
 */
export const STRENGTH_CONFIG: TrainingConfig = {
	intensity: 0.85,
	reps: 3,
	sets: 5,
	restTime: { min: 3, max: 5 },
	note: "RPE8〜9目安（失敗しない重量）",
};

/**
 * 筋肥大用（Hypertrophy）の設定
 * - 使用強度: 70% 1RM
 * - 8回 × 4セット
 * - 休憩: 1.5〜3分
 */
export const HYPERTROPHY_CONFIG: TrainingConfig = {
	intensity: 0.7,
	reps: 8,
	sets: 4,
	restTime: { min: 1.5, max: 3 },
};

/**
 * 重量を指定した刻みに四捨五入する
 * @param weight - 元の重量 (kg)
 * @param increment - 刻み幅 (kg)
 * @returns 丸められた重量 (kg)
 */
export function roundToIncrement(
	weight: number,
	increment: WeightIncrement,
): number {
	return Math.round(weight / increment) * increment;
}

/**
 * 1RM入力値のバリデーション
 * @param value - 入力値
 * @returns バリデーション結果
 */
export function validateOneRM(value: number | ""): ValidationResult {
	if (value === "") {
		return { isValid: false, errorMessage: "1RMを入力してください" };
	}

	if (Number.isNaN(value)) {
		return { isValid: false, errorMessage: "数値を入力してください" };
	}

	if (value < 1) {
		return { isValid: false, errorMessage: "1kg以上で入力してください" };
	}

	if (value > 500) {
		return { isValid: false, errorMessage: "500kg以下で入力してください" };
	}

	return { isValid: true };
}

/**
 * トレーニングメニューを計算する
 * @param oneRM - 1RM (kg)
 * @param config - トレーニング設定
 * @param increment - 重量の刻み幅 (kg)
 * @returns 計算されたトレーニングメニュー、または計算不可の場合はnull
 */
export function calculateTrainingMenu(
	oneRM: number,
	config: TrainingConfig,
	increment: WeightIncrement,
): TrainingMenu | null {
	const calculatedWeight = oneRM * config.intensity;
	const roundedWeight = roundToIncrement(calculatedWeight, increment);

	// 0以下の場合は計算不可
	if (roundedWeight <= 0) {
		return null;
	}

	return {
		weight: roundedWeight,
		reps: config.reps,
		sets: config.sets,
		restTime: config.restTime,
		note: config.note,
	};
}

/**
 * 種目のトレーニングメニュー（MAXアップ + 筋肥大）を計算する
 * @param oneRM - 1RM (kg)
 * @param increment - 重量の刻み幅 (kg)
 * @returns 種目のトレーニングメニュー、または計算不可の場合はnull
 */
export function calculateExerciseMenu(
	oneRM: number,
	increment: WeightIncrement,
): ExerciseTrainingMenu | null {
	const strengthMenu = calculateTrainingMenu(oneRM, STRENGTH_CONFIG, increment);
	const hypertrophyMenu = calculateTrainingMenu(
		oneRM,
		HYPERTROPHY_CONFIG,
		increment,
	);

	if (!strengthMenu || !hypertrophyMenu) {
		return null;
	}

	return {
		strength: strengthMenu,
		hypertrophy: hypertrophyMenu,
	};
}

/**
 * 全種目のトレーニングメニューを計算する
 * @param input - 1RM入力値
 * @param increment - 重量の刻み幅 (kg)
 * @returns 種目ごとのトレーニングメニュー
 */
export function calculateAllMenus(
	input: OneRMInput,
	increment: WeightIncrement,
): Partial<Record<ExerciseKey, ExerciseTrainingMenu>> {
	const result: Partial<Record<ExerciseKey, ExerciseTrainingMenu>> = {};

	const exercises: ExerciseKey[] = ["squat", "bench", "deadlift"];

	for (const exercise of exercises) {
		const oneRM = input[exercise];
		if (oneRM !== "" && validateOneRM(oneRM).isValid) {
			const menu = calculateExerciseMenu(oneRM, increment);
			if (menu) {
				result[exercise] = menu;
			}
		}
	}

	return result;
}
