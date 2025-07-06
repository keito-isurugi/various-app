import { describe, expect, it } from "@jest/globals";
import { calculateBIG3Total } from "./big3-total-calculator";

describe("BIG3合計値計算テスト", () => {
	describe("calculateBIG3Total", () => {
		it("有効な体重でBIG3合計値を正しく計算する", () => {
			const bodyWeight = 70;
			const result = calculateBIG3Total(bodyWeight);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();

			if (result) {
				// 各レベルのデータが存在することを確認
				expect(result.初心者).toBeDefined();
				expect(result.初級者).toBeDefined();
				expect(result.中級者).toBeDefined();
				expect(result.上級者).toBeDefined();
				expect(result.エリート).toBeDefined();

				// 各レベルのデータ構造が正しいことを確認
				const levels = ["初心者", "初級者", "中級者", "上級者", "エリート"];
				for (const level of levels) {
					const levelData = result[level];
					expect(typeof levelData.benchPress).toBe("number");
					expect(typeof levelData.squat).toBe("number");
					expect(typeof levelData.deadlift).toBe("number");
					expect(typeof levelData.total).toBe("number");

					// 合計値が正しく計算されていることを確認
					expect(levelData.total).toBe(
						levelData.benchPress + levelData.squat + levelData.deadlift,
					);

					// 各値が正の数であることを確認
					expect(levelData.benchPress).toBeGreaterThan(0);
					expect(levelData.squat).toBeGreaterThan(0);
					expect(levelData.deadlift).toBeGreaterThan(0);
					expect(levelData.total).toBeGreaterThan(0);
				}
			}
		});

		it("レベルが上がるにつれて合計値も増加する", () => {
			const bodyWeight = 70;
			const result = calculateBIG3Total(bodyWeight);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();

			if (result) {
				// レベル順で合計値が増加することを確認
				expect(result.初心者.total).toBeLessThan(result.初級者.total);
				expect(result.初級者.total).toBeLessThan(result.中級者.total);
				expect(result.中級者.total).toBeLessThan(result.上級者.total);
				expect(result.上級者.total).toBeLessThan(result.エリート.total);
			}
		});

		it("範囲外の体重でnullを返す", () => {
			const invalidWeights = [30, 200, -10, 0];

			for (const weight of invalidWeights) {
				const result = calculateBIG3Total(weight);
				expect(result).toBeNull();
			}
		});

		it("NaNの体重でnullを返す", () => {
			const result = calculateBIG3Total(Number.NaN);
			expect(result).toBeNull();
		});

		it("線形補間が正しく動作する", () => {
			// 52.5kg（50kgと55kgの中間）でテスト
			const result = calculateBIG3Total(52.5);
			expect(result).toBeDefined();
			expect(result).not.toBeNull();

			if (result) {
				// 各値が0より大きいことを確認（線形補間の結果）
				expect(result.初心者.benchPress).toBeGreaterThan(0);
				expect(result.初心者.squat).toBeGreaterThan(0);
				expect(result.初心者.deadlift).toBeGreaterThan(0);
				expect(result.初心者.total).toBeGreaterThan(0);

				// 合計値が正しく計算されていることを確認
				expect(result.初心者.total).toBe(
					result.初心者.benchPress +
						result.初心者.squat +
						result.初心者.deadlift,
				);
			}
		});

		it("具体的な値での計算結果を検証", () => {
			// 70kgの場合の期待値（BIG3_DATAから）
			const result = calculateBIG3Total(70);
			expect(result).toBeDefined();
			expect(result).not.toBeNull();

			if (result) {
				// 70kgの初心者レベルのデータを確認
				expect(result.初心者.benchPress).toBe(44);
				expect(result.初心者.squat).toBe(59);
				expect(result.初心者.deadlift).toBe(73);
				expect(result.初心者.total).toBe(44 + 59 + 73); // 176

				// 70kgのエリートレベルのデータを確認
				expect(result.エリート.benchPress).toBe(141);
				expect(result.エリート.squat).toBe(184);
				expect(result.エリート.deadlift).toBe(212);
				expect(result.エリート.total).toBe(141 + 184 + 212); // 537
			}
		});
	});
});
