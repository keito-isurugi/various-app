import {
	BIG3_DATA_MALE,
	LEVEL_CONFIG_MALE,
	LEVEL_ORDER,
} from "../data/big3-data";
import {
	BIG3_DATA_FEMALE,
	LEVEL_CONFIG_FEMALE,
} from "../data/big3-data-female";
import type {
	BIG3Data,
	ExerciseType,
	Gender,
	LevelConfig,
	LevelWeight,
	WeightLevel,
	WeightValidation,
} from "../types/big3";

/**
 * 性別に応じてBIG3データを取得する
 * @param gender 性別
 * @returns BIG3データ
 */
export function getBIG3DataByGender(gender: Gender): BIG3Data {
	return gender === "male" ? BIG3_DATA_MALE : BIG3_DATA_FEMALE;
}

/**
 * 性別に応じてレベル設定を取得する
 * @param gender 性別
 * @returns レベル設定
 */
export function getLevelConfigByGender(gender: Gender): LevelConfig {
	return gender === "male" ? LEVEL_CONFIG_MALE : LEVEL_CONFIG_FEMALE;
}

/**
 * 体重の入力値を検証する（性別対応）
 * @param bodyWeight 体重 (kg)
 * @param gender 性別
 * @returns 検証結果
 */
export function validateBodyWeightByGender(
	bodyWeight: number,
	gender: Gender,
): WeightValidation {
	if (Number.isNaN(bodyWeight)) {
		return {
			isValid: false,
			errorMessage: "有効な数値を入力してください",
		};
	}

	const config = getLevelConfigByGender(gender);

	if (bodyWeight < config.minBodyWeight) {
		return {
			isValid: false,
			errorMessage: `体重は${config.minBodyWeight}kg以上で入力してください`,
		};
	}

	if (bodyWeight > config.maxBodyWeight) {
		return {
			isValid: false,
			errorMessage: `体重は${config.maxBodyWeight}kg以下で入力してください`,
		};
	}

	return { isValid: true };
}

/**
 * 線形補間により特定の体重における推奨重量を計算する（性別対応）
 * @param bodyWeight 体重 (kg)
 * @param exercise 種目
 * @param level レベル
 * @param gender 性別
 * @returns 推奨重量 (kg) または null（範囲外の場合）
 */
export function interpolateWeightByGender(
	bodyWeight: number,
	exercise: ExerciseType,
	level: WeightLevel,
	gender: Gender,
): number | null {
	const validation = validateBodyWeightByGender(bodyWeight, gender);
	if (!validation.isValid) {
		return null;
	}

	const exerciseData = getBIG3DataByGender(gender)[exercise];

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
 * 挙上重量からレベルを判定する（性別対応）
 * @param bodyWeight 体重 (kg)
 * @param liftWeight 挙上重量 (kg)
 * @param exercise 種目
 * @param gender 性別
 * @returns レベル または "データなし"
 */
export function determineLevelByGender(
	bodyWeight: number,
	liftWeight: number,
	exercise: ExerciseType,
	gender: Gender,
): WeightLevel | "データなし" {
	const validation = validateBodyWeightByGender(bodyWeight, gender);
	if (!validation.isValid || Number.isNaN(liftWeight) || liftWeight < 0) {
		return "データなし";
	}

	// 各レベルの推奨重量を取得
	const levelWeights = calculateLevelWeightsByGender(
		bodyWeight,
		exercise,
		gender,
	);
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
 * 指定した体重における全レベルの推奨重量を計算する（性別対応）
 * @param bodyWeight 体重 (kg)
 * @param exercise 種目
 * @param gender 性別
 * @returns 各レベルの推奨重量 または null（範囲外の場合）
 */
export function calculateLevelWeightsByGender(
	bodyWeight: number,
	exercise: ExerciseType,
	gender: Gender,
): LevelWeight | null {
	const validation = validateBodyWeightByGender(bodyWeight, gender);
	if (!validation.isValid) {
		return null;
	}

	const result: LevelWeight = {} as LevelWeight;

	for (const level of LEVEL_ORDER) {
		const weight = interpolateWeightByGender(
			bodyWeight,
			exercise,
			level,
			gender,
		);
		if (weight === null) {
			return null;
		}
		result[level] = weight;
	}

	return result;
}

/**
 * 体重を最も近い設定刻みの値に丸める（性別対応）
 * @param bodyWeight 体重 (kg)
 * @param gender 性別
 * @returns 丸められた体重
 */
export function roundToNearestStepByGender(
	bodyWeight: number,
	gender: Gender,
): number {
	const config = getLevelConfigByGender(gender);
	return Math.round(bodyWeight / config.weightStep) * config.weightStep;
}

/**
 * 性別用の体重範囲メッセージを取得する
 * @param gender 性別
 * @returns 体重範囲の説明文
 */
export function getWeightRangeMessageByGender(gender: Gender): string {
	const config = getLevelConfigByGender(gender);
	return `${config.minBodyWeight}kg〜${config.maxBodyWeight}kgの範囲で入力してください`;
}
