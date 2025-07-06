/**
 * src/utils/explanation-provider.ts
 *
 * 計算タイプに応じた解説データを提供するユーティリティ
 */

import type { ExplanationData } from "../components/calculator/CalculationExplanation";
import { escapeVelocityExplanation } from "../data/explanations/escape-velocity-explanation";
import { massEnergyExplanation } from "../data/explanations/mass-energy-explanation";
import { schwarzschildExplanation } from "../data/explanations/schwarzschild-explanation";
import { CALCULATION_TYPES } from "../types/calculator";

/**
 * 計算タイプに応じた解説データを取得
 * @param calculationType 計算タイプ
 * @returns 対応する解説データ、存在しない場合はnull
 */
export const getExplanationData = (
	calculationType: string,
): ExplanationData | null => {
	switch (calculationType) {
		case CALCULATION_TYPES.SCHWARZSCHILD_RADIUS:
			return schwarzschildExplanation;
		case CALCULATION_TYPES.ESCAPE_VELOCITY:
			return escapeVelocityExplanation;
		case CALCULATION_TYPES.MASS_ENERGY:
			return massEnergyExplanation;
		default:
			return null;
	}
};

/**
 * 利用可能な解説データの一覧を取得
 * @returns 利用可能な解説データの配列
 */
export const getAllExplanationData = (): ExplanationData[] => {
	return [
		schwarzschildExplanation,
		escapeVelocityExplanation,
		massEnergyExplanation,
	];
};

/**
 * 解説が利用可能かどうかを確認
 * @param calculationType 計算タイプ
 * @returns 解説が利用可能な場合true
 */
export const hasExplanation = (calculationType: string): boolean => {
	return getExplanationData(calculationType) !== null;
};
