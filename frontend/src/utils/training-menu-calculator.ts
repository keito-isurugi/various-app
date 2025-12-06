import type {
	ExerciseKey,
	ExerciseProgram,
	ExerciseTrainingMenu,
	OneRMInput,
	ProgramDuration,
	ProgramSettings,
	ProgramWeek,
	TrainingConfig,
	TrainingMenu,
	ValidationResult,
	WeekTemplate,
	WeeklyFrequency,
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

/**
 * Light日の強度差（固定値）
 */
const LIGHT_DAY_INTENSITY_DIFF = 0.05;

/**
 * 4週プログラムテンプレート
 */
const PROGRAM_TEMPLATE_4WEEKS: WeekTemplate[] = [
	{ week: 1, intensity: 0.85, reps: 3, sets: 5 },
	{ week: 2, intensity: 0.875, reps: 3, sets: 5 },
	{ week: 3, intensity: 0.9, reps: 3, sets: 4 },
	{ week: 4, intensity: 0.8, reps: 3, sets: 3 }, // 調整週
];

/**
 * 6週プログラムテンプレート
 */
const PROGRAM_TEMPLATE_6WEEKS: WeekTemplate[] = [
	{ week: 1, intensity: 0.8, reps: 3, sets: 5 },
	{ week: 2, intensity: 0.85, reps: 3, sets: 5 },
	{ week: 3, intensity: 0.875, reps: 3, sets: 5 },
	{ week: 4, intensity: 0.9, reps: 3, sets: 4 },
	{ week: 5, intensity: 0.925, reps: 2, sets: 4 },
	{ week: 6, intensity: 0.8, reps: 3, sets: 3 }, // 調整週
];

/**
 * 8週プログラムテンプレート
 */
const PROGRAM_TEMPLATE_8WEEKS: WeekTemplate[] = [
	{ week: 1, intensity: 0.75, reps: 5, sets: 5 },
	{ week: 2, intensity: 0.8, reps: 4, sets: 5 },
	{ week: 3, intensity: 0.85, reps: 3, sets: 5 },
	{ week: 4, intensity: 0.875, reps: 3, sets: 5 },
	{ week: 5, intensity: 0.9, reps: 3, sets: 4 },
	{ week: 6, intensity: 0.925, reps: 2, sets: 4 },
	{ week: 7, intensity: 0.95, reps: 1, sets: 3 },
	{ week: 8, intensity: 0.8, reps: 3, sets: 3 }, // 調整週
];

/**
 * プログラム期間に応じたテンプレートを取得
 */
export function getProgramTemplate(duration: ProgramDuration): WeekTemplate[] {
	switch (duration) {
		case 4:
			return PROGRAM_TEMPLATE_4WEEKS;
		case 6:
			return PROGRAM_TEMPLATE_6WEEKS;
		case 8:
			return PROGRAM_TEMPLATE_8WEEKS;
	}
}

/**
 * プログラム週を計算する
 */
function calculateProgramWeek(
	oneRM: number,
	template: WeekTemplate,
	increment: WeightIncrement,
	frequency: WeeklyFrequency,
): ProgramWeek {
	const weightHeavy = roundToIncrement(oneRM * template.intensity, increment);

	const result: ProgramWeek = {
		week: template.week,
		intensityPercent: template.intensity * 100,
		reps: template.reps,
		sets: template.sets,
		weightHeavy,
	};

	if (frequency === 2) {
		const lightIntensity = template.intensity - LIGHT_DAY_INTENSITY_DIFF;
		result.weightLight = roundToIncrement(oneRM * lightIntensity, increment);
	}

	return result;
}

/**
 * 種目のプログラムを計算する
 */
export function calculateExerciseProgram(
	oneRM: number,
	increment: WeightIncrement,
	settings: ProgramSettings,
): ExerciseProgram | null {
	const template = getProgramTemplate(settings.duration);

	const weeks: ProgramWeek[] = template.map((weekTemplate) =>
		calculateProgramWeek(oneRM, weekTemplate, increment, settings.frequency),
	);

	// すべての週のHeavy重量が0以下でないかチェック
	if (weeks.some((week) => week.weightHeavy <= 0)) {
		return null;
	}

	return { weeks };
}

/**
 * 全種目のプログラムを計算する
 */
export function calculateAllPrograms(
	input: OneRMInput,
	increment: WeightIncrement,
	settings: ProgramSettings,
): Partial<Record<ExerciseKey, ExerciseProgram>> {
	const result: Partial<Record<ExerciseKey, ExerciseProgram>> = {};

	const exercises: ExerciseKey[] = ["squat", "bench", "deadlift"];

	for (const exercise of exercises) {
		const oneRM = input[exercise];
		if (oneRM !== "" && validateOneRM(oneRM).isValid) {
			const program = calculateExerciseProgram(oneRM, increment, settings);
			if (program) {
				result[exercise] = program;
			}
		}
	}

	return result;
}
