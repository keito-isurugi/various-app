/**
 * src/utils/calculators/mass-energy.ts
 *
 * E=mc²計算機
 * アインシュタインの質量エネルギー等価性の計算を行う
 */

import {
	CALCULATION_TYPES,
	type CalculationParameter,
	type CalculationResult,
	type Calculator,
	PHYSICAL_CONSTANTS,
	type ValidationResult,
} from "../../types/calculator";

/**
 * E=mc²計算機クラス
 *
 * 質量とエネルギーの等価性を計算
 * E = mc²
 *
 * E: エネルギー (J)
 * m: 質量 (kg)
 * c: 光速 (299,792,458 m/s)
 */
export class MassEnergyCalculator implements Calculator {
	readonly type = CALCULATION_TYPES.MASS_ENERGY;
	readonly displayName = "E=mc²計算機";
	readonly description =
		"アインシュタインの有名な式E=mc²を使って、質量とエネルギーの変換を計算します。わずかな質量から膨大なエネルギーが生み出される様子を確認できます。";

	readonly supportedParameters = [
		{
			id: "mass",
			name: "質量",
			description: "エネルギーに変換する質量",
			unit: "kg",
			min: 1e-30, // 電子質量程度まで
			max: 1e30, // 銀河系レベルまで
			required: true,
		},
	] as const;

	/**
	 * パラメータのバリデーション
	 */
	validateParameters(parameters: CalculationParameter[]): ValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		// 質量パラメータの存在チェック
		const massParam = parameters.find((p) => p.id === "mass");
		if (!massParam) {
			errors.push("質量パラメータが必要です");
			return { isValid: false, errors, warnings };
		}

		// 質量の値チェック
		if (massParam.value <= 0) {
			errors.push("質量は正の値である必要があります");
		}

		// 非常に小さい質量への警告
		if (massParam.value > 0 && massParam.value < 1e-25) {
			warnings.push("非常に小さい質量です。原子レベル以下の計算になります。");
		}

		// 非常に大きい質量への警告
		if (massParam.value > 1e20) {
			warnings.push("非常に大きい質量です。天体レベルの計算になります。");
		}

		// 現実的な範囲の確認
		if (massParam.value > 0) {
			const energy = massParam.value * PHYSICAL_CONSTANTS.SPEED_OF_LIGHT ** 2;

			// 原子爆弾レベル（広島型原爆: 約63TJ）のエネルギー
			const hiroshimaBombEnergy = 6.3e13; // J
			if (energy > hiroshimaBombEnergy) {
				warnings.push("計算結果は原子爆弾レベルのエネルギーを超えます。");
			}

			// 1年間の世界のエネルギー消費量レベル
			const worldAnnualEnergy = 6e20; // J (概算)
			if (energy > worldAnnualEnergy) {
				warnings.push("計算結果は世界の年間エネルギー消費量を超えます。");
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	/**
	 * E=mc²の計算実行
	 */
	calculate(parameters: CalculationParameter[]): CalculationResult[] {
		// パラメータバリデーション
		const validation = this.validateParameters(parameters);
		if (!validation.isValid) {
			throw new Error(`パラメータが無効です: ${validation.errors.join(", ")}`);
		}

		const massParam = parameters.find((p) => p.id === "mass");
		if (!massParam) {
			throw new Error("質量パラメータが見つかりません");
		}
		const mass = massParam.value;

		// E=mc²の計算
		const energy = mass * PHYSICAL_CONSTANTS.SPEED_OF_LIGHT ** 2;

		// 結果の配列
		const results: CalculationResult[] = [
			{
				id: "energy_joules",
				name: "エネルギー",
				value: energy,
				unit: "J",
				description: "質量から変換されるエネルギー（ジュール）",
				formattedValue: this.formatEnergy(energy, "J"),
			},
			{
				id: "energy_kwh",
				name: "エネルギー",
				value: energy / 3.6e6, // 1 kWh = 3.6×10⁶ J
				unit: "kWh",
				description: "エネルギー（キロワット時換算）",
				formattedValue: this.formatEnergy(energy / 3.6e6, "kWh"),
			},
		];

		// 比較情報の追加
		const comparisons = this.generateComparisons(energy);
		if (comparisons.length > 0) {
			results.push({
				id: "energy_comparisons",
				name: "エネルギー比較",
				value: 0,
				unit: "",
				description: comparisons.join("、"),
				formattedValue: "",
			});
		}

		// 実用的な換算の追加
		const practicalConversions = this.generatePracticalConversions(energy);
		if (practicalConversions.length > 0) {
			results.push({
				id: "practical_conversions",
				name: "実用的な換算",
				value: 0,
				unit: "",
				description: practicalConversions.join("、"),
				formattedValue: "",
			});
		}

		// 物理的洞察の追加
		const insights = this.generatePhysicalInsights(mass, energy);
		if (insights.length > 0) {
			results.push({
				id: "physical_insights",
				name: "物理的意味",
				value: 0,
				unit: "",
				description: insights.join("、"),
				formattedValue: "",
			});
		}

		return results;
	}

	/**
	 * 計算例の取得
	 */
	getExampleParameters(): CalculationParameter[] {
		return [
			{
				id: "mass",
				name: "質量",
				value: 1e-3, // 1グラム
				unit: "kg",
				description: "1グラムの質量",
			},
		];
	}

	/**
	 * エネルギーを適切な単位でフォーマット
	 */
	private formatEnergy(energy: number, unit: string): string {
		if (energy >= 1e24) {
			return `${(energy / 1e24).toExponential(2)} Y${unit}`;
		}
		if (energy >= 1e21) {
			return `${(energy / 1e21).toFixed(2)} Z${unit}`;
		}
		if (energy >= 1e18) {
			return `${(energy / 1e18).toFixed(2)} E${unit}`;
		}
		if (energy >= 1e15) {
			return `${(energy / 1e15).toFixed(2)} P${unit}`;
		}
		if (energy >= 1e12) {
			return `${(energy / 1e12).toFixed(2)} T${unit}`;
		}
		if (energy >= 1e9) {
			return `${(energy / 1e9).toFixed(2)} G${unit}`;
		}
		if (energy >= 1e6) {
			return `${(energy / 1e6).toFixed(2)} M${unit}`;
		}
		if (energy >= 1e3) {
			return `${(energy / 1e3).toFixed(2)} k${unit}`;
		}
		if (energy >= 1) {
			return `${energy.toFixed(2)} ${unit}`;
		}
		return `${energy.toExponential(2)} ${unit}`;
	}

	/**
	 * エネルギーの比較情報を生成
	 */
	private generateComparisons(energy: number): string[] {
		const comparisons: string[] = [];

		// 身近なエネルギーとの比較
		const batteryAA = 1.5 * 3600; // 単3電池: 1.5V × 1Ah = 5400J
		const gasoline1L = 3.2e7; // ガソリン1L: 約32MJ
		const hiroshimaBomb = 6.3e13; // 広島型原爆: 約63TJ
		const humanDaily = 8.4e6; // 人間の1日のエネルギー消費: 約2000kcal = 8.4MJ
		const lightningBolt = 5e9; // 雷のエネルギー: 約5GJ

		if (energy >= batteryAA * 0.1 && energy <= batteryAA * 10) {
			const ratio = energy / batteryAA;
			comparisons.push(`単3電池の${ratio.toFixed(1)}倍のエネルギー`);
		}

		if (energy >= humanDaily * 0.1 && energy <= humanDaily * 10) {
			const ratio = energy / humanDaily;
			comparisons.push(`人間の1日分のエネルギーの${ratio.toFixed(1)}倍`);
		}

		if (energy >= gasoline1L * 0.1 && energy <= gasoline1L * 10) {
			const ratio = energy / gasoline1L;
			comparisons.push(`ガソリン1Lの${ratio.toFixed(1)}倍のエネルギー`);
		}

		if (energy >= lightningBolt * 0.1 && energy <= lightningBolt * 10) {
			const ratio = energy / lightningBolt;
			comparisons.push(`雷のエネルギーの${ratio.toFixed(1)}倍`);
		}

		if (energy >= hiroshimaBomb * 0.001 && energy <= hiroshimaBomb * 1000) {
			const ratio = energy / hiroshimaBomb;
			if (ratio >= 1) {
				comparisons.push(`広島型原爆の${ratio.toFixed(1)}倍のエネルギー`);
			} else {
				comparisons.push(
					`広島型原爆の${(1 / ratio).toFixed(1)}分の1のエネルギー`,
				);
			}
		}

		return comparisons;
	}

	/**
	 * 実用的な換算情報を生成
	 */
	private generatePracticalConversions(energy: number): string[] {
		const conversions: string[] = [];

		// 電力換算
		const powerPlantHour = 1e9; // 大型発電所の1時間の発電量: 1GWh = 3.6×10¹²J
		const householdMonth = 3e8; // 一般家庭の1ヶ月の消費電力: 約300kWh = 1.08×10⁹J

		if (energy >= householdMonth) {
			const months = energy / householdMonth;
			if (months >= 12) {
				conversions.push(`一般家庭${(months / 12).toFixed(1)}年分の電力`);
			} else {
				conversions.push(`一般家庭${months.toFixed(1)}ヶ月分の電力`);
			}
		}

		// TNT換算
		const tntKg = 4.6e6; // TNT 1kg: 約4.6MJ
		if (energy >= tntKg) {
			const tntEquivalent = energy / tntKg;
			if (tntEquivalent >= 1e6) {
				conversions.push(`TNT${(tntEquivalent / 1e6).toFixed(1)}メガトン相当`);
			} else if (tntEquivalent >= 1e3) {
				conversions.push(`TNT${(tntEquivalent / 1e3).toFixed(1)}キロトン相当`);
			} else {
				conversions.push(`TNT${tntEquivalent.toFixed(1)}kg相当`);
			}
		}

		return conversions;
	}

	/**
	 * 物理的洞察を生成
	 */
	private generatePhysicalInsights(mass: number, energy: number): string[] {
		const insights: string[] = [];

		// 効率性の洞察
		if (mass <= 1e-3) {
			insights.push(
				"わずか数グラムの質量から膨大なエネルギーが生まれることがわかります",
			);
		}

		// 核反応との比較
		const nuclearEfficiency = 0.007; // 核融合の質量欠損率: 約0.7%
		const nuclearEnergy =
			mass * nuclearEfficiency * PHYSICAL_CONSTANTS.SPEED_OF_LIGHT ** 2;

		if (energy > nuclearEnergy * 100) {
			insights.push(
				"この計算は完全な質量変換を想定しており、実際の核反応よりもはるかに効率的です",
			);
		}

		// 相対性理論の意味
		if (mass >= 1e-10) {
			insights.push(
				"この式はアインシュタインの特殊相対性理論から導かれた、質量とエネルギーの等価性を表しています",
			);
		}

		return insights;
	}

	/**
	 * 質量からエネルギーを直接計算するヘルパーメソッド
	 */
	static calculateEnergy(mass: number): number {
		return mass * PHYSICAL_CONSTANTS.SPEED_OF_LIGHT ** 2;
	}

	/**
	 * エネルギーから質量を直接計算するヘルパーメソッド
	 */
	static calculateMass(energy: number): number {
		return energy / PHYSICAL_CONSTANTS.SPEED_OF_LIGHT ** 2;
	}

	/**
	 * 主要な質量とそのエネルギー換算例を取得
	 */
	static getCommonMassEnergyExamples(): {
		name: string;
		mass: number;
		energy: number;
	}[] {
		return [
			{
				name: "電子",
				mass: 9.109e-31,
				energy: MassEnergyCalculator.calculateEnergy(9.109e-31),
			},
			{
				name: "陽子",
				mass: 1.673e-27,
				energy: MassEnergyCalculator.calculateEnergy(1.673e-27),
			},
			{
				name: "1グラム",
				mass: 1e-3,
				energy: MassEnergyCalculator.calculateEnergy(1e-3),
			},
			{
				name: "1キログラム",
				mass: 1,
				energy: MassEnergyCalculator.calculateEnergy(1),
			},
		];
	}
}
