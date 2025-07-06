import {
	CALCULATION_TYPES,
	type CalculationParameter,
	type CalculationResult,
	type Calculator,
	PHYSICAL_CONSTANTS,
	type ValidationResult,
} from "../../types/calculator";

/**
 * シュワルツシルト半径計算機
 *
 * シュワルツシルト半径は、ある質量の物体がブラックホールになる臨界半径を表します。
 * 計算式: Rs = 2GM/c²
 * G: 重力定数, M: 質量, c: 光速
 */
export class SchwarzschildRadiusCalculator implements Calculator {
	readonly type = CALCULATION_TYPES.SCHWARZSCHILD_RADIUS;
	readonly displayName = "シュワルツシルト半径";
	readonly description =
		"与えられた質量の物体がブラックホールになる場合の事象の地平面の半径を計算します。";

	readonly supportedParameters = [
		{
			id: "mass",
			name: "質量",
			unit: "kg",
			description: "計算対象の物体の質量（キログラム）",
			min: Number.MIN_VALUE,
			max: Number.MAX_SAFE_INTEGER,
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
		if (massParam.value > 0 && massParam.value < 1e-20) {
			warnings.push("非常に小さい質量です。計算結果が非常に小さくなります。");
		}

		// 非常に大きい質量への警告
		if (massParam.value > 1e40) {
			warnings.push("非常に大きい質量です。計算結果が非常に大きくなります。");
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	/**
	 * シュワルツシルト半径の計算実行
	 */
	calculate(parameters: CalculationParameter[]): CalculationResult[] {
		// パラメータバリデーション
		const validation = this.validateParameters(parameters);
		if (!validation.isValid) {
			throw new Error("パラメータが無効です: " + validation.errors.join(", "));
		}

		const massParam = parameters.find((p) => p.id === "mass")!;
		const mass = massParam.value;

		// シュワルツシルト半径の計算: Rs = 2GM/c²
		const radius =
			(2 * PHYSICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * mass) /
			PHYSICAL_CONSTANTS.SPEED_OF_LIGHT ** 2;

		// 適切な単位での表示
		const formattedValue = this.formatRadius(radius);

		return [
			{
				id: "schwarzschild_radius",
				name: "シュワルツシルト半径",
				value: radius,
				unit: "m",
				description: `この質量の物体がブラックホールになった場合の事象の地平面の半径です。`,
				formattedValue,
			},
		];
	}

	/**
	 * 計算例の取得
	 */
	getExampleParameters(): CalculationParameter[] {
		return [
			{
				id: "mass",
				name: "質量",
				value: 1.989e30, // 太陽質量
				unit: "kg",
				description: "太陽の質量",
			},
		];
	}

	/**
	 * 半径を適切な単位でフォーマット
	 */
	private formatRadius(radiusInMeters: number): string {
		if (radiusInMeters >= 1e9) {
			// 1,000,000km以上：Gm単位
			return `${(radiusInMeters / 1e9).toExponential(2)} Gm`;
		} else if (radiusInMeters >= 1e6) {
			// 1,000km以上：Mm単位
			return `${(radiusInMeters / 1e6).toFixed(2)} Mm`;
		} else if (radiusInMeters >= 1e3) {
			// 1km以上：km単位
			return `${(radiusInMeters / 1e3).toFixed(2)} km`;
		} else if (radiusInMeters >= 1) {
			// 1m以上：m単位
			return `${radiusInMeters.toFixed(2)} m`;
		} else if (radiusInMeters >= 1e-3) {
			// 1mm以上：mm単位
			return `${(radiusInMeters * 1e3).toFixed(2)} mm`;
		} else if (radiusInMeters >= 1e-6) {
			// 1μm以上：μm単位
			return `${(radiusInMeters * 1e6).toFixed(2)} μm`;
		} else if (radiusInMeters >= 1e-9) {
			// 1nm以上：nm単位
			return `${(radiusInMeters * 1e9).toFixed(2)} nm`;
		} else {
			// それ以下：指数表記
			return `${radiusInMeters.toExponential(2)} m`;
		}
	}
}
