/**
 * src/utils/calculators/depreciation.ts
 *
 * 減価償却計算のユーティリティ関数
 * 定額法・定率法など各種償却方法をサポート
 */

import type {
	DepreciationInput,
	DepreciationMethod,
	DepreciationResult,
	DepreciationYearData,
} from "../../types/accounting";

/**
 * 減価償却を計算する
 * @param input 計算に必要な入力データ
 * @returns 計算結果
 */
export function calculateDepreciation(
	input: DepreciationInput,
): DepreciationResult {
	try {
		// 入力値の検証
		const validationError = validateDepreciationInput(input);
		if (validationError) {
			return {
				success: false,
				method: input.method,
				yearlyData: [],
				totalDepreciation: 0,
				summary: {
					acquisitionCost: input.acquisitionCost,
					residualValue: input.residualValue,
					usefulLife: input.usefulLife,
					depreciableAmount: 0,
					averageAnnualDepreciation: 0,
				},
				error: validationError,
			};
		}

		// 計算方法に応じて処理を分岐
		let yearlyData: DepreciationYearData[];

		switch (input.method) {
			case "straight_line":
				yearlyData = calculateStraightLine(input);
				break;
			case "declining_balance":
				yearlyData = calculateDecliningBalance(input);
				break;
			case "sum_of_years":
				yearlyData = calculateSumOfYears(input);
				break;
			case "units_of_production":
				yearlyData = calculateUnitsOfProduction(input);
				break;
			default:
				throw new Error("サポートされていない償却方法です");
		}

		// 結果の集計
		const totalDepreciation = yearlyData.reduce(
			(sum, year) => sum + year.annualDepreciation,
			0,
		);

		const depreciableAmount = input.acquisitionCost - input.residualValue;
		const averageAnnualDepreciation = depreciableAmount / input.usefulLife;

		return {
			success: true,
			method: input.method,
			yearlyData,
			totalDepreciation,
			summary: {
				acquisitionCost: input.acquisitionCost,
				residualValue: input.residualValue,
				usefulLife: input.usefulLife,
				depreciableAmount,
				averageAnnualDepreciation,
			},
		};
	} catch (error) {
		return {
			success: false,
			method: input.method,
			yearlyData: [],
			totalDepreciation: 0,
			summary: {
				acquisitionCost: input.acquisitionCost,
				residualValue: input.residualValue,
				usefulLife: input.usefulLife,
				depreciableAmount: 0,
				averageAnnualDepreciation: 0,
			},
			error:
				error instanceof Error ? error.message : "計算中にエラーが発生しました",
		};
	}
}

/**
 * 入力値の検証
 * @param input 入力データ
 * @returns エラーメッセージ（正常時はnull）
 */
function validateDepreciationInput(input: DepreciationInput): string | null {
	if (input.acquisitionCost <= 0) {
		return "取得価額は0より大きい値を入力してください";
	}

	if (input.residualValue < 0) {
		return "残存価額は0以上の値を入力してください";
	}

	if (input.residualValue >= input.acquisitionCost) {
		return "残存価額は取得価額未満である必要があります";
	}

	if (input.usefulLife <= 0) {
		return "耐用年数は1年以上を入力してください";
	}

	if (input.usefulLife > 100) {
		return "耐用年数は100年以下で入力してください";
	}

	// 定率法の場合の追加チェック
	if (input.method === "declining_balance") {
		if (
			!input.depreciationRate ||
			input.depreciationRate <= 0 ||
			input.depreciationRate >= 1
		) {
			return "定率法の場合、0より大きく1未満の償却率を入力してください";
		}
	}

	// 生産高比例法の場合の追加チェック
	if (input.method === "units_of_production") {
		if (!input.totalProductionCapacity || input.totalProductionCapacity <= 0) {
			return "生産高比例法の場合、総生産能力を入力してください";
		}
		if (!input.periodProduction || input.periodProduction < 0) {
			return "生産高比例法の場合、期間中生産量を入力してください";
		}
	}

	return null;
}

/**
 * 定額法による減価償却計算
 * 毎年同じ金額を償却する最もシンプルな方法
 */
function calculateStraightLine(
	input: DepreciationInput,
): DepreciationYearData[] {
	const depreciableAmount = input.acquisitionCost - input.residualValue;
	const annualDepreciation = depreciableAmount / input.usefulLife;
	const yearlyData: DepreciationYearData[] = [];

	let accumulatedDepreciation = 0;
	let bookValue = input.acquisitionCost;

	for (let year = 1; year <= input.usefulLife; year++) {
		const beginningBookValue = bookValue;

		// 最終年度の調整（端数処理）
		let currentYearDepreciation = annualDepreciation;
		if (year === input.usefulLife) {
			currentYearDepreciation = beginningBookValue - input.residualValue;
		}

		accumulatedDepreciation += currentYearDepreciation;
		bookValue = input.acquisitionCost - accumulatedDepreciation;

		yearlyData.push({
			year,
			beginningBookValue,
			annualDepreciation: Math.round(currentYearDepreciation),
			accumulatedDepreciation: Math.round(accumulatedDepreciation),
			endingBookValue: Math.round(bookValue),
			depreciationRate: (currentYearDepreciation / input.acquisitionCost) * 100,
		});
	}

	return yearlyData;
}

/**
 * 定率法による減価償却計算
 * 初期は多く、後半は少なく償却する方法
 */
function calculateDecliningBalance(
	input: DepreciationInput,
): DepreciationYearData[] {
	if (!input.depreciationRate) {
		throw new Error("定率法には償却率が必要です");
	}

	const yearlyData: DepreciationYearData[] = [];
	let accumulatedDepreciation = 0;
	let bookValue = input.acquisitionCost;

	for (let year = 1; year <= input.usefulLife; year++) {
		const beginningBookValue = bookValue;

		// 当年度の償却額を計算
		let currentYearDepreciation = beginningBookValue * input.depreciationRate;

		// 残存価額を下回らないよう調整
		const maxDepreciation = beginningBookValue - input.residualValue;
		if (currentYearDepreciation > maxDepreciation) {
			currentYearDepreciation = maxDepreciation;
		}

		accumulatedDepreciation += currentYearDepreciation;
		bookValue = beginningBookValue - currentYearDepreciation;

		yearlyData.push({
			year,
			beginningBookValue: Math.round(beginningBookValue),
			annualDepreciation: Math.round(currentYearDepreciation),
			accumulatedDepreciation: Math.round(accumulatedDepreciation),
			endingBookValue: Math.round(bookValue),
			depreciationRate: input.depreciationRate * 100,
		});

		// 残存価額に達したら終了
		if (bookValue <= input.residualValue) {
			break;
		}
	}

	return yearlyData;
}

/**
 * 年数合計法による減価償却計算
 * 年数の逆順で重みづけして償却する方法
 */
function calculateSumOfYears(input: DepreciationInput): DepreciationYearData[] {
	const depreciableAmount = input.acquisitionCost - input.residualValue;
	const sumOfYears = (input.usefulLife * (input.usefulLife + 1)) / 2;
	const yearlyData: DepreciationYearData[] = [];

	let accumulatedDepreciation = 0;
	let bookValue = input.acquisitionCost;

	for (let year = 1; year <= input.usefulLife; year++) {
		const beginningBookValue = bookValue;
		const yearFactor = input.usefulLife - year + 1;
		const currentYearDepreciation =
			(depreciableAmount * yearFactor) / sumOfYears;

		accumulatedDepreciation += currentYearDepreciation;
		bookValue = input.acquisitionCost - accumulatedDepreciation;

		yearlyData.push({
			year,
			beginningBookValue: Math.round(beginningBookValue),
			annualDepreciation: Math.round(currentYearDepreciation),
			accumulatedDepreciation: Math.round(accumulatedDepreciation),
			endingBookValue: Math.round(bookValue),
			depreciationRate: (currentYearDepreciation / input.acquisitionCost) * 100,
		});
	}

	return yearlyData;
}

/**
 * 生産高比例法による減価償却計算
 * 生産量に比例して償却する方法
 */
function calculateUnitsOfProduction(
	input: DepreciationInput,
): DepreciationYearData[] {
	if (!input.totalProductionCapacity || !input.periodProduction) {
		throw new Error("生産高比例法には総生産能力と期間中生産量が必要です");
	}

	const depreciableAmount = input.acquisitionCost - input.residualValue;
	const depreciationPerUnit = depreciableAmount / input.totalProductionCapacity;
	const yearlyData: DepreciationYearData[] = [];

	// 簡単のため、毎年同じ生産量と仮定
	const annualProduction = input.periodProduction;
	let accumulatedDepreciation = 0;
	let bookValue = input.acquisitionCost;

	for (let year = 1; year <= input.usefulLife; year++) {
		const beginningBookValue = bookValue;
		let currentYearDepreciation = annualProduction * depreciationPerUnit;

		// 最終年度または総生産能力に達した場合の調整
		if (accumulatedDepreciation + currentYearDepreciation > depreciableAmount) {
			currentYearDepreciation = depreciableAmount - accumulatedDepreciation;
		}

		accumulatedDepreciation += currentYearDepreciation;
		bookValue = input.acquisitionCost - accumulatedDepreciation;

		yearlyData.push({
			year,
			beginningBookValue: Math.round(beginningBookValue),
			annualDepreciation: Math.round(currentYearDepreciation),
			accumulatedDepreciation: Math.round(accumulatedDepreciation),
			endingBookValue: Math.round(bookValue),
			depreciationRate: (currentYearDepreciation / input.acquisitionCost) * 100,
		});

		// 完全に償却完了したら終了
		if (bookValue <= input.residualValue) {
			break;
		}
	}

	return yearlyData;
}

/**
 * 償却方法の日本語名を取得
 * @param method 償却方法
 * @returns 日本語名
 */
export function getDepreciationMethodName(method: DepreciationMethod): string {
	const methodNames: Record<DepreciationMethod, string> = {
		straight_line: "定額法",
		declining_balance: "定率法",
		sum_of_years: "年数合計法",
		units_of_production: "生産高比例法",
	};
	return methodNames[method];
}

/**
 * 一般的な資産の耐用年数を取得
 * @param assetType 資産の種類
 * @returns 耐用年数（年）
 */
export function getStandardUsefulLife(assetType: string): number {
	const usefulLifeTable: Record<string, number> = {
		パソコン: 4,
		プリンター: 5,
		車両: 6,
		機械装置: 10,
		建物: 30,
		工具器具: 3,
	};
	return usefulLifeTable[assetType] || 5; // デフォルト5年
}

/**
 * 後方互換性のためのレガシーエクスポート
 * @deprecated 直接関数を使用してください
 */
export const DepreciationCalculator = {
	calculate: calculateDepreciation,
	getMethodName: getDepreciationMethodName,
	getStandardUsefulLife: getStandardUsefulLife,
} as const;
