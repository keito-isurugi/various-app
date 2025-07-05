import { BIG3_DATA, LEVEL_CONFIG, LEVEL_ORDER } from "../data/big3-data";
import type {
	ExerciseType,
	LevelWeight,
	WeightLevel,
	WeightValidation,
} from "../types/big3";

/**
 * 体重の入力値を検証する
 * @param bodyWeight 体重 (kg)
 * @returns 検証結果
 */
export function validateBodyWeight(bodyWeight: number): WeightValidation {
	if (Number.isNaN(bodyWeight)) {
		return {
			isValid: false,
			errorMessage: "有効な数値を入力してください",
		};
	}

	if (bodyWeight < LEVEL_CONFIG.minBodyWeight) {
		return {
			isValid: false,
			errorMessage: `体重は${LEVEL_CONFIG.minBodyWeight}kg以上で入力してください`,
		};
	}

	if (bodyWeight > LEVEL_CONFIG.maxBodyWeight) {
		return {
			isValid: false,
			errorMessage: `体重は${LEVEL_CONFIG.maxBodyWeight}kg以下で入力してください`,
		};
	}

	return { isValid: true };
}

/**
 * 線形補間により特定の体重における推奨重量を計算する
 * @param bodyWeight 体重 (kg)
 * @param exercise 種目
 * @param level レベル
 * @returns 推奨重量 (kg) または null（範囲外の場合）
 */
export function interpolateWeight(
	bodyWeight: number,
	exercise: ExerciseType,
	level: WeightLevel,
): number | null {
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid) {
		return null;
	}

	const exerciseData = BIG3_DATA[exercise];

	// 完全一致するデータがある場合
	const exactMatch = exerciseData.find(
		(data) => data.bodyWeight === bodyWeight,
	);
	if (exactMatch) {
		return exactMatch[level];
	}

	// 線形補間が必要な場合
	const lowerIndex =
		exerciseData.findIndex((data) => data.bodyWeight > bodyWeight) - 1;

	if (lowerIndex < 0) {
		// 最小値未満の場合、最小値のデータを返す
		return exerciseData[0][level];
	}

	if (lowerIndex >= exerciseData.length - 1) {
		// 最大値以上の場合、最大値のデータを返す
		return exerciseData[exerciseData.length - 1][level];
	}

	const lowerData = exerciseData[lowerIndex];
	const upperData = exerciseData[lowerIndex + 1];

	// 線形補間の計算
	const ratio =
		(bodyWeight - lowerData.bodyWeight) /
		(upperData.bodyWeight - lowerData.bodyWeight);

	const interpolatedWeight =
		lowerData[level] + ratio * (upperData[level] - lowerData[level]);

	return Math.round(interpolatedWeight * 10) / 10; // 小数点第1位まで
}

/**
 * 挙上重量からレベルを判定する
 * @param bodyWeight 体重 (kg)
 * @param liftWeight 挙上重量 (kg)
 * @param exercise 種目
 * @returns レベル または "データなし"
 */
export function determineLevel(
	bodyWeight: number,
	liftWeight: number,
	exercise: ExerciseType,
): WeightLevel | "データなし" {
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid || Number.isNaN(liftWeight) || liftWeight < 0) {
		return "データなし";
	}

	// 各レベルの推奨重量を取得
	const levelWeights = calculateLevelWeights(bodyWeight, exercise);
	if (!levelWeights) {
		return "データなし";
	}

	// レベルを逆順（エリートから初心者）で判定
	for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
		const level = LEVEL_ORDER[i];
		if (liftWeight >= levelWeights[level]) {
			return level;
		}
	}

	// どのレベルにも達していない場合は初心者
	return "初心者";
}

/**
 * 指定した体重における全レベルの推奨重量を計算する
 * @param bodyWeight 体重 (kg)
 * @param exercise 種目
 * @returns 各レベルの推奨重量 または null（範囲外の場合）
 */
export function calculateLevelWeights(
	bodyWeight: number,
	exercise: ExerciseType,
): LevelWeight | null {
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid) {
		return null;
	}

	const result: LevelWeight = {} as LevelWeight;

	for (const level of LEVEL_ORDER) {
		const weight = interpolateWeight(bodyWeight, exercise, level);
		if (weight === null) {
			return null;
		}
		result[level] = weight;
	}

	return result;
}

/**
 * 体重を最も近い5kg刻みの値に丸める
 * @param bodyWeight 体重 (kg)
 * @returns 丸められた体重
 */
export function roundToNearestStep(bodyWeight: number): number {
	return (
		Math.round(bodyWeight / LEVEL_CONFIG.weightStep) * LEVEL_CONFIG.weightStep
	);
}

/**
 * レベルの色を取得する（UI用）
 * @param level レベル
 * @returns CSSクラス名
 */
export function getLevelColor(level: WeightLevel | "データなし"): string {
	const colorMap = {
		初心者: "text-gray-600",
		初級者: "text-green-600",
		中級者: "text-blue-600",
		上級者: "text-purple-600",
		エリート: "text-red-600",
		データなし: "text-gray-400",
	};

	return colorMap[level] || "text-gray-400";
}

/**
 * レベルの背景色を取得する（UI用）
 * @param level レベル
 * @returns CSSクラス名
 */
export function getLevelBgColor(level: WeightLevel | "データなし"): string {
	const colorMap = {
		初心者: "bg-gray-100",
		初級者: "bg-green-100",
		中級者: "bg-blue-100",
		上級者: "bg-purple-100",
		エリート: "bg-red-100",
		データなし: "bg-gray-50",
	};

	return colorMap[level] || "bg-gray-50";
}
