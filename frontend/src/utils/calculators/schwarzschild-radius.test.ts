import { beforeEach, describe, expect, it } from "@jest/globals";
import { CALCULATION_TYPES, PHYSICAL_CONSTANTS } from "../../types/calculator";
import { SchwarzschildRadiusCalculator } from "./schwarzschild-radius";

describe("SchwarzschildRadiusCalculator", () => {
	let calculator: SchwarzschildRadiusCalculator;

	beforeEach(() => {
		calculator = new SchwarzschildRadiusCalculator();
	});

	describe("基本プロパティ", () => {
		it("正しい計算タイプを返す", () => {
			expect(calculator.type).toBe(CALCULATION_TYPES.SCHWARZSCHILD_RADIUS);
		});

		it("適切な表示名を持つ", () => {
			expect(calculator.displayName).toBe("シュワルツシルト半径");
		});

		it("説明文を持つ", () => {
			expect(calculator.description).toContain("ブラックホール");
		});

		it("質量パラメータをサポートする", () => {
			expect(calculator.supportedParameters).toHaveLength(1);
			expect(calculator.supportedParameters[0].id).toBe("mass");
			expect(calculator.supportedParameters[0].unit).toBe("kg");
		});
	});

	describe("パラメータバリデーション", () => {
		it("有効な質量でバリデーション成功", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: 1.989e30, // 太陽質量
					unit: "kg",
				},
			];

			const result = calculator.validateParameters(parameters);
			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it("負の質量でバリデーション失敗", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: -1,
					unit: "kg",
				},
			];

			const result = calculator.validateParameters(parameters);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain("質量は正の値である必要があります");
		});

		it("ゼロ質量でバリデーション失敗", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: 0,
					unit: "kg",
				},
			];

			const result = calculator.validateParameters(parameters);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain("質量は正の値である必要があります");
		});

		it("必須パラメータなしでバリデーション失敗", () => {
			const result = calculator.validateParameters([]);
			expect(result.isValid).toBe(false);
			expect(result.errors).toContain("質量パラメータが必要です");
		});

		it("非常に小さい質量で警告", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: 1e-30, // 非常に小さい質量
					unit: "kg",
				},
			];

			const result = calculator.validateParameters(parameters);
			expect(result.isValid).toBe(true);
			expect(result.warnings).toContain(
				"非常に小さい質量です。計算結果が非常に小さくなります。",
			);
		});
	});

	describe("計算実行", () => {
		it("太陽質量のシュワルツシルト半径を正しく計算", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: 1.989e30, // 太陽質量
					unit: "kg",
				},
			];

			const results = calculator.calculate(parameters);
			expect(Array.isArray(results)).toBe(true);
			expect(results).toHaveLength(1);

			const result = results[0];
			expect(result.id).toBe("schwarzschild_radius");
			expect(result.name).toBe("シュワルツシルト半径");
			expect(result.unit).toBe("m");

			// 太陽質量のシュワルツシルト半径は約2.95km
			expect(result.value).toBeCloseTo(2954, 0);
			expect(result.formattedValue).toContain("2.95");
			expect(result.formattedValue).toContain("km");
		});

		it("地球質量のシュワルツシルト半径を正しく計算", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: 5.972e24, // 地球質量
					unit: "kg",
				},
			];

			const results = calculator.calculate(parameters);
			const result = results[0];

			// 地球質量のシュワルツシルト半径は約8.87mm
			expect(result.value).toBeCloseTo(0.00887, 5);
			expect(result.formattedValue).toContain("mm");
		});

		it("無効なパラメータで計算実行時にエラー", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: -1,
					unit: "kg",
				},
			];

			expect(() => calculator.calculate(parameters)).toThrow(
				"パラメータが無効です",
			);
		});

		it("計算結果に適切な説明が含まれる", () => {
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: 1.989e30,
					unit: "kg",
				},
			];

			const results = calculator.calculate(parameters);
			const result = results[0];
			expect(result.description).toContain(
				"この質量の物体がブラックホールになった場合の",
			);
		});
	});

	describe("計算例", () => {
		it("太陽質量を例として提供", () => {
			const examples = calculator.getExampleParameters();
			expect(examples).toHaveLength(1);
			expect(examples[0].id).toBe("mass");
			expect(examples[0].value).toBe(1.989e30); // 太陽質量
		});
	});

	describe("物理的妥当性", () => {
		it("シュワルツシルト半径の公式が正しい", () => {
			const mass = 1; // 1kg
			const parameters = [
				{
					id: "mass",
					name: "質量",
					value: mass,
					unit: "kg",
				},
			];

			const results = calculator.calculate(parameters);
			const result = results[0];

			// Rs = 2GM/c² の公式
			const expectedRadius =
				(2 * PHYSICAL_CONSTANTS.GRAVITATIONAL_CONSTANT * mass) /
				PHYSICAL_CONSTANTS.SPEED_OF_LIGHT ** 2;

			expect(result.value).toBeCloseTo(expectedRadius, 15);
		});
	});
});
