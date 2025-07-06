import {
	CALCULATION_TYPES,
	type CalculationParameter,
	type CalculationResult,
	type Calculator,
	PHYSICAL_CONSTANTS,
	type ValidationResult,
} from "../../types/calculator";

/**
 * 脱出速度計算機
 *
 * 脱出速度 = √(2GM/r)
 *
 * G: 万有引力定数 (6.67430 × 10^-11 m³/kg·s²)
 * M: 天体の質量 (kg)
 * r: 天体の半径 (m)
 */
export class EscapeVelocityCalculator implements Calculator {
	readonly type = CALCULATION_TYPES.ESCAPE_VELOCITY;
	readonly displayName = "脱出速度計算機";
	readonly description =
		"天体の質量と半径から脱出速度を計算します。脱出速度とは、その天体の重力を振り切って無限遠まで到達するのに必要な最小の速度です。";

	readonly supportedParameters = [
		{
			id: "mass",
			name: "質量",
			description: "天体の質量",
			unit: "kg",
			min: 1e10,
			max: 1e35,
			required: true,
		},
		{
			id: "radius",
			name: "半径",
			description: "天体の半径",
			unit: "m",
			min: 1e3,
			max: 1e12,
			required: true,
		},
	] as const;

	getExampleParameters(): CalculationParameter[] {
		return [
			{
				id: "mass",
				name: "質量",
				value: 5.972e24, // 地球の質量
				unit: "kg",
				description: "地球の質量",
			},
			{
				id: "radius",
				name: "半径",
				value: 6.371e6, // 地球の半径
				unit: "m",
				description: "地球の半径",
			},
		];
	}

	validateParameters(parameters: CalculationParameter[]): ValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		const mass = parameters.find((p) => p.id === "mass")?.value;
		const radius = parameters.find((p) => p.id === "radius")?.value;

		// 基本的な妥当性チェック
		if (mass === undefined || mass === null) {
			errors.push("質量が指定されていません");
		} else if (mass <= 0) {
			errors.push("質量は正の値である必要があります");
		} else if (mass < 1e10) {
			warnings.push("質量が小さすぎる可能性があります（小惑星未満）");
		} else if (mass > 1e35) {
			warnings.push("質量が大きすぎる可能性があります（銀河系を超える）");
		}

		if (radius === undefined || radius === null) {
			errors.push("半径が指定されていません");
		} else if (radius <= 0) {
			errors.push("半径は正の値である必要があります");
		} else if (radius < 1e3) {
			warnings.push("半径が小さすぎる可能性があります（1km未満）");
		} else if (radius > 1e12) {
			warnings.push("半径が大きすぎる可能性があります（太陽系サイズ）");
		}

		// 物理的妥当性チェック
		if (mass && radius) {
			// 密度チェック（kg/m³）
			const volume = (4 / 3) * Math.PI * radius ** 3;
			const density = mass / volume;

			if (density > 1e20) {
				warnings.push("密度が異常に高い値です（中性子星レベル）");
			} else if (density < 1) {
				warnings.push("密度が異常に低い値です（気体未満）");
			}

			// 脱出速度が光速を超える場合
			const escapeVelocity = Math.sqrt(
				(2 * PHYSICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * mass) / radius,
			);
			const lightSpeed = PHYSICAL_CONSTANTS.SPEED_OF_LIGHT;

			if (escapeVelocity >= lightSpeed) {
				warnings.push(
					"脱出速度が光速に近づいています（相対論的効果を考慮する必要があります）",
				);
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	calculate(parameters: CalculationParameter[]): CalculationResult[] {
		const validation = this.validateParameters(parameters);
		if (!validation.isValid) {
			throw new Error(`計算エラー: ${validation.errors.join(", ")}`);
		}

		const massParam = parameters.find((p) => p.id === "mass");
		const radiusParam = parameters.find((p) => p.id === "radius");

		if (!massParam || massParam.value === undefined) {
			throw new Error("質量パラメータが見つかりません");
		}
		if (!radiusParam || radiusParam.value === undefined) {
			throw new Error("半径パラメータが見つかりません");
		}

		const mass = massParam.value;
		const radius = radiusParam.value;

		// 脱出速度の計算: v = √(2GM/r)
		const escapeVelocity = Math.sqrt(
			(2 * PHYSICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * mass) / radius,
		);

		// 比較用の値
		const earthEscapeVelocity = 11180; // m/s
		const moonEscapeVelocity = 2380; // m/s
		const sunEscapeVelocity = 617500; // m/s
		const lightSpeed = PHYSICAL_CONSTANTS.SPEED_OF_LIGHT;

		// 結果の配列
		const results: CalculationResult[] = [
			{
				id: "escape-velocity",
				name: "脱出速度",
				value: escapeVelocity,
				unit: "m/s",
				description: "この天体から脱出するのに必要な最小速度",
				formattedValue: this.formatVelocity(escapeVelocity, "m/s"),
			},
			{
				id: "escape-velocity-kmh",
				name: "脱出速度",
				value: escapeVelocity * 3.6,
				unit: "km/h",
				description: "脱出速度（時速換算）",
				formattedValue: this.formatVelocity(escapeVelocity * 3.6, "km/h"),
			},
		];

		// 比較情報
		const comparisons: string[] = [];

		if (
			escapeVelocity > earthEscapeVelocity * 0.9 &&
			escapeVelocity < earthEscapeVelocity * 1.1
		) {
			comparisons.push("地球の脱出速度とほぼ同じです");
		} else if (
			escapeVelocity > moonEscapeVelocity * 0.9 &&
			escapeVelocity < moonEscapeVelocity * 1.1
		) {
			comparisons.push("月の脱出速度とほぼ同じです");
		} else {
			const earthRatio = escapeVelocity / earthEscapeVelocity;
			if (earthRatio > 1) {
				comparisons.push(`地球の${earthRatio.toFixed(1)}倍の脱出速度`);
			} else {
				comparisons.push(`地球の${(1 / earthRatio).toFixed(1)}分の1の脱出速度`);
			}
		}

		if (escapeVelocity / lightSpeed > 0.01) {
			const lightSpeedRatio = ((escapeVelocity / lightSpeed) * 100).toFixed(2);
			comparisons.push(`光速の${lightSpeedRatio}%`);
		}

		if (comparisons.length > 0) {
			results.push({
				id: "comparison",
				name: "比較",
				value: 0,
				unit: "",
				description: comparisons.join("、"),
				formattedValue: "",
			});
		}

		// 物理的な洞察
		const insights: string[] = [];

		// 密度の計算
		const volume = (4 / 3) * Math.PI * radius ** 3;
		const density = mass / volume;

		if (density > 1e15) {
			insights.push("この密度は中性子星に匹敵します");
		} else if (density > 1e9) {
			insights.push("この密度は白色矮星に匹敵します");
		} else if (density > 5000) {
			insights.push("この密度は岩石惑星程度です");
		} else if (density > 1000) {
			insights.push("この密度は水程度です");
		} else {
			insights.push("この密度は気体に近い値です");
		}

		// エネルギー計算（1kgの物体を脱出させるのに必要なエネルギー）
		const escapeEnergy = 0.5 * escapeVelocity ** 2; // J/kg
		results.push({
			id: "escape-energy",
			name: "脱出エネルギー",
			value: escapeEnergy,
			unit: "J/kg",
			description: "1kgの物体を脱出させるのに必要なエネルギー",
			formattedValue: this.formatEnergy(escapeEnergy),
		});

		if (insights.length > 0) {
			results.push({
				id: "insights",
				name: "物理的特徴",
				value: 0,
				unit: "",
				description: insights.join("、"),
				formattedValue: "",
			});
		}

		return results;
	}

	/**
	 * 天体の質量と半径から脱出速度を直接計算するヘルパーメソッド
	 */
	static calculateEscapeVelocity(mass: number, radius: number): number {
		return Math.sqrt(
			(2 * PHYSICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * mass) / radius,
		);
	}

	/**
	 * 速度を適切な単位でフォーマット
	 */
	private formatVelocity(velocity: number, unit: string): string {
		if (velocity >= 1e6) {
			return `${(velocity / 1e6).toFixed(2)} M${unit}`;
		}
		if (velocity >= 1e3) {
			return `${(velocity / 1e3).toFixed(2)} k${unit}`;
		}
		return `${velocity.toFixed(0)} ${unit}`;
	}

	/**
	 * エネルギーを適切な単位でフォーマット
	 */
	private formatEnergy(energy: number): string {
		if (energy >= 1e12) {
			return `${(energy / 1e12).toFixed(2)} TJ/kg`;
		}
		if (energy >= 1e9) {
			return `${(energy / 1e9).toFixed(2)} GJ/kg`;
		}
		if (energy >= 1e6) {
			return `${(energy / 1e6).toFixed(2)} MJ/kg`;
		}
		if (energy >= 1e3) {
			return `${(energy / 1e3).toFixed(2)} kJ/kg`;
		}
		return `${energy.toFixed(0)} J/kg`;
	}

	/**
	 * 地球の脱出速度を取得
	 */
	static getEarthEscapeVelocity(): number {
		return 11180; // m/s
	}

	/**
	 * 主要天体の脱出速度一覧を取得
	 */
	static getMajorBodiesEscapeVelocities(): {
		name: string;
		velocity: number;
	}[] {
		return [
			{ name: "地球", velocity: 11180 },
			{ name: "月", velocity: 2380 },
			{ name: "火星", velocity: 5030 },
			{ name: "木星", velocity: 59500 },
			{ name: "太陽", velocity: 617500 },
		];
	}
}
