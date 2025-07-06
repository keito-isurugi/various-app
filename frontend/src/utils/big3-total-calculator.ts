import { LEVEL_ORDER } from "../data/big3-data";
import type { BIG3TotalData, Gender, LevelBIG3Total } from "../types/big3";
import { interpolateWeight, validateBodyWeight } from "./big3-calculator";
import {
	interpolateWeightByGender,
	validateBodyWeightByGender,
} from "./big3-calculator-gender";

/**
 * 指定した体重における全レベルのBIG3合計値を計算する
 * @param bodyWeight 体重 (kg)
 * @returns 各レベルのBIG3合計値 または null（範囲外の場合）
 */
export function calculateBIG3Total(bodyWeight: number): LevelBIG3Total | null {
	// 体重の妥当性を検証
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid) {
		return null;
	}

	const result: Partial<LevelBIG3Total> = {};

	// 各レベルごとにBIG3合計値を計算
	for (const level of LEVEL_ORDER) {
		// 各種目の重量を取得
		const benchPress = interpolateWeight(bodyWeight, "ベンチプレス", level);
		const squat = interpolateWeight(bodyWeight, "スクワット", level);
		const deadlift = interpolateWeight(bodyWeight, "デッドリフト", level);

		// いずれかの種目で計算に失敗した場合はnullを返す
		if (benchPress === null || squat === null || deadlift === null) {
			return null;
		}

		// 合計値を計算
		const total = benchPress + squat + deadlift;

		// レベル別データを作成
		const levelData: BIG3TotalData = {
			benchPress,
			squat,
			deadlift,
			total: Math.round(total * 10) / 10, // 小数点第1位まで
		};

		result[level] = levelData;
	}

	return result as LevelBIG3Total;
}

/**
 * 指定した体重における全レベルのBIG3合計値を計算する（性別対応）
 * @param bodyWeight 体重 (kg)
 * @param gender 性別
 * @returns 各レベルのBIG3合計値 または null（範囲外の場合）
 */
export function calculateBIG3TotalByGender(
	bodyWeight: number,
	gender: Gender,
): LevelBIG3Total | null {
	// 体重の妥当性を検証
	const validation = validateBodyWeightByGender(bodyWeight, gender);
	if (!validation.isValid) {
		return null;
	}

	const result: Partial<LevelBIG3Total> = {};

	// 各レベルごとにBIG3合計値を計算
	for (const level of LEVEL_ORDER) {
		// 各種目の重量を取得
		const benchPress = interpolateWeightByGender(
			bodyWeight,
			"ベンチプレス",
			level,
			gender,
		);
		const squat = interpolateWeightByGender(
			bodyWeight,
			"スクワット",
			level,
			gender,
		);
		const deadlift = interpolateWeightByGender(
			bodyWeight,
			"デッドリフト",
			level,
			gender,
		);

		// いずれかの種目で計算に失敗した場合はnullを返す
		if (benchPress === null || squat === null || deadlift === null) {
			return null;
		}

		// 合計値を計算
		const total = benchPress + squat + deadlift;

		// レベル別データを作成
		const levelData: BIG3TotalData = {
			benchPress,
			squat,
			deadlift,
			total: Math.round(total * 10) / 10, // 小数点第1位まで
		};

		result[level] = levelData;
	}

	return result as LevelBIG3Total;
}

/**
 * BIG3合計値に基づいてレベルを判定する
 * @param bodyWeight 体重 (kg)
 * @param totalWeight BIG3合計重量 (kg)
 * @returns レベル または "データなし"
 */
export function determineLevelByTotal(
	bodyWeight: number,
	totalWeight: number,
): import("../types/big3").WeightLevel | "データなし" {
	// 体重とBIG3合計値の妥当性を検証
	const validation = validateBodyWeight(bodyWeight);
	if (!validation.isValid || Number.isNaN(totalWeight) || totalWeight < 0) {
		return "データなし";
	}

	// 各レベルの合計値を取得
	const levelTotals = calculateBIG3Total(bodyWeight);
	if (!levelTotals) {
		return "データなし";
	}

	// レベルを逆順（エリートから初心者）で判定
	for (let i = LEVEL_ORDER.length - 1; i >= 0; i--) {
		const level = LEVEL_ORDER[i];
		if (totalWeight >= levelTotals[level].total) {
			return level;
		}
	}

	// どのレベルにも達していない場合は初心者
	return "初心者";
}
