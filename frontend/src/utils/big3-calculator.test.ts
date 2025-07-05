import { describe, expect, it } from "@jest/globals";
import type { ExerciseType, WeightLevel } from "../types/big3";
import {
	calculateLevelWeights,
	determineLevel,
	interpolateWeight,
	validateBodyWeight,
} from "./big3-calculator";

describe("BIG3計算ユーティリティテスト", () => {
	describe("validateBodyWeight", () => {
		it("有効な体重を正しく検証する", () => {
			const validWeights = [50, 70, 100, 140];

			validWeights.forEach((weight) => {
				const result = validateBodyWeight(weight);
				expect(result.isValid).toBe(true);
				expect(result.errorMessage).toBeUndefined();
			});
		});

		it("無効な体重を正しく検証する", () => {
			const invalidWeights = [
				{ weight: 40, expectedMessage: "体重は50kg以上で入力してください" },
				{ weight: 150, expectedMessage: "体重は140kg以下で入力してください" },
				{ weight: -10, expectedMessage: "体重は50kg以上で入力してください" },
				{ weight: Number.NaN, expectedMessage: "有効な数値を入力してください" },
			];

			invalidWeights.forEach(({ weight, expectedMessage }) => {
				const result = validateBodyWeight(weight);
				expect(result.isValid).toBe(false);
				expect(result.errorMessage).toBe(expectedMessage);
			});
		});
	});

	describe("interpolateWeight", () => {
		it("既存の体重データに対して正確な値を返す", () => {
			// 70kgのベンチプレス中級者: 85kg
			const result = interpolateWeight(70, "ベンチプレス", "中級者");
			expect(result).toBe(85);
		});

		it("補間計算を正しく実行する", () => {
			// 67.5kg（65kgと70kgの中間）のベンチプレス中級者
			// 65kg: 79kg, 70kg: 85kg -> 67.5kg: 82kg
			const result = interpolateWeight(67.5, "ベンチプレス", "中級者");
			expect(result).toBe(82);
		});

		it("範囲外の体重に対してnullを返す", () => {
			expect(interpolateWeight(40, "ベンチプレス", "中級者")).toBeNull();
			expect(interpolateWeight(150, "ベンチプレス", "中級者")).toBeNull();
		});

		it("全ての種目とレベルの組み合わせで動作する", () => {
			const exercises: ExerciseType[] = [
				"ベンチプレス",
				"スクワット",
				"デッドリフト",
			];
			const levels: WeightLevel[] = [
				"初心者",
				"初級者",
				"中級者",
				"上級者",
				"エリート",
			];

			exercises.forEach((exercise) => {
				levels.forEach((level) => {
					const result = interpolateWeight(70, exercise, level);
					expect(typeof result).toBe("number");
					expect(result).toBeGreaterThan(0);
				});
			});
		});
	});

	describe("determineLevel", () => {
		it("正確にレベルを判定する", () => {
			// 70kgの人がベンチプレス100kg上げた場合（中級者: 85kg, 上級者: 112kg）
			const result = determineLevel(70, 100, "ベンチプレス");
			expect(result).toBe("中級者");
		});

		it("境界値でレベルを正しく判定する", () => {
			// 70kgの人がベンチプレス85kg（中級者の基準値）
			const result = determineLevel(70, 85, "ベンチプレス");
			expect(result).toBe("中級者");
		});

		it("初心者レベル未満の場合", () => {
			// 70kgの人がベンチプレス30kg（初心者: 44kg未満）
			const result = determineLevel(70, 30, "ベンチプレス");
			expect(result).toBe("初心者");
		});

		it("エリートレベル以上の場合", () => {
			// 70kgの人がベンチプレス200kg（エリート: 141kg以上）
			const result = determineLevel(70, 200, "ベンチプレス");
			expect(result).toBe("エリート");
		});

		it("範囲外の体重に対してデータなしを返す", () => {
			const result = determineLevel(40, 50, "ベンチプレス");
			expect(result).toBe("データなし");
		});

		it("無効な挙上重量に対してデータなしを返す", () => {
			expect(determineLevel(70, -10, "ベンチプレス")).toBe("データなし");
			expect(determineLevel(70, Number.NaN, "ベンチプレス")).toBe("データなし");
		});
	});

	describe("calculateLevelWeights", () => {
		it("全レベルの推奨重量を正しく計算する", () => {
			const result = calculateLevelWeights(70, "ベンチプレス");

			expect(result).toEqual({
				初心者: 44,
				初級者: 62,
				中級者: 85,
				上級者: 112,
				エリート: 141,
			});
		});

		it("補間が必要な体重で正しく計算する", () => {
			const result = calculateLevelWeights(72.5, "ベンチプレス");

			// 70kg: {初心者: 44, 初級者: 62, 中級者: 85, 上級者: 112, エリート: 141}
			// 75kg: {初心者: 49, 初級者: 68, 中級者: 92, 上級者: 119, エリート: 149}
			// 72.5kg (中間): 各レベルの中間値
			expect(result.初心者).toBe(46.5); // (44 + 49) / 2
			expect(result.初級者).toBe(65); // (62 + 68) / 2
			expect(result.中級者).toBe(88.5); // (85 + 92) / 2
			expect(result.上級者).toBe(115.5); // (112 + 119) / 2
			expect(result.エリート).toBe(145); // (141 + 149) / 2
		});

		it("範囲外の体重に対してnullを返す", () => {
			expect(calculateLevelWeights(40, "ベンチプレス")).toBeNull();
			expect(calculateLevelWeights(150, "ベンチプレス")).toBeNull();
		});

		it("全ての種目で動作する", () => {
			const exercises: ExerciseType[] = [
				"ベンチプレス",
				"スクワット",
				"デッドリフト",
			];

			exercises.forEach((exercise) => {
				const result = calculateLevelWeights(70, exercise);
				expect(result).not.toBeNull();
				expect(typeof result?.初心者).toBe("number");
				expect(typeof result?.初級者).toBe("number");
				expect(typeof result?.中級者).toBe("number");
				expect(typeof result?.上級者).toBe("number");
				expect(typeof result?.エリート).toBe("number");
			});
		});
	});
});
