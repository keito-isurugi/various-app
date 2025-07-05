import { describe, expect, it } from "@jest/globals";
import type { BIG3Data, LevelConfig } from "../types/big3";
import { BIG3_DATA, LEVEL_CONFIG } from "./big3-data";

describe("BIG3データテスト", () => {
	it("BIG3_DATAが正しい構造を持つ", () => {
		// データの基本構造をチェック
		expect(BIG3_DATA).toBeDefined();
		expect(typeof BIG3_DATA).toBe("object");

		// 3種目が存在することを確認
		expect("ベンチプレス" in BIG3_DATA).toBe(true);
		expect("スクワット" in BIG3_DATA).toBe(true);
		expect("デッドリフト" in BIG3_DATA).toBe(true);
	});

	it("各種目のデータが配列で、正しい数のエントリを持つ", () => {
		// 各種目が配列であることを確認
		expect(Array.isArray(BIG3_DATA.ベンチプレス)).toBe(true);
		expect(Array.isArray(BIG3_DATA.スクワット)).toBe(true);
		expect(Array.isArray(BIG3_DATA.デッドリフト)).toBe(true);

		// 体重50kgから140kgまで5kg刻みで19エントリあることを確認
		expect(BIG3_DATA.ベンチプレス).toHaveLength(19);
		expect(BIG3_DATA.スクワット).toHaveLength(19);
		expect(BIG3_DATA.デッドリフト).toHaveLength(19);
	});

	it("体重データが正しい順序で並んでいる", () => {
		const exercises = [
			BIG3_DATA.ベンチプレス,
			BIG3_DATA.スクワット,
			BIG3_DATA.デッドリフト,
		];

		exercises.forEach((exerciseData) => {
			for (let i = 0; i < exerciseData.length; i++) {
				const expectedBodyWeight = 50 + i * 5;
				expect(exerciseData[i].bodyWeight).toBe(expectedBodyWeight);
			}
		});
	});

	it("各エントリが必要なレベルデータを持つ", () => {
		const levels = [
			"初心者",
			"初級者",
			"中級者",
			"上級者",
			"エリート",
		] as const;

		const allData = [
			...BIG3_DATA.ベンチプレス,
			...BIG3_DATA.スクワット,
			...BIG3_DATA.デッドリフト,
		];

		allData.forEach((entry) => {
			expect(typeof entry.bodyWeight).toBe("number");
			levels.forEach((level) => {
				expect(typeof entry[level]).toBe("number");
				expect(entry[level]).toBeGreaterThan(0);
			});
		});
	});

	it("重量データが論理的に正しい順序になっている", () => {
		const levels = [
			"初心者",
			"初級者",
			"中級者",
			"上級者",
			"エリート",
		] as const;

		const allData = [
			...BIG3_DATA.ベンチプレス,
			...BIG3_DATA.スクワット,
			...BIG3_DATA.デッドリフト,
		];

		allData.forEach((entry) => {
			// 各エントリ内でレベルが上がるにつれて重量も増加することを確認
			for (let i = 0; i < levels.length - 1; i++) {
				expect(entry[levels[i]]).toBeLessThan(entry[levels[i + 1]]);
			}
		});
	});

	it("LEVEL_CONFIGが正しい値を持つ", () => {
		expect(LEVEL_CONFIG).toBeDefined();
		expect(typeof LEVEL_CONFIG).toBe("object");

		expect(LEVEL_CONFIG.minBodyWeight).toBe(50);
		expect(LEVEL_CONFIG.maxBodyWeight).toBe(140);
		expect(LEVEL_CONFIG.weightStep).toBe(5);
	});

	it("特定の体重のデータが正しい値を持つ", () => {
		// 70kgのベンチプレスデータをテスト（5番目のエントリ）
		const benchPress70kg = BIG3_DATA.ベンチプレス[4]; // 70kg = 50 + 4*5
		expect(benchPress70kg.bodyWeight).toBe(70);
		expect(benchPress70kg.初心者).toBe(44);
		expect(benchPress70kg.初級者).toBe(62);
		expect(benchPress70kg.中級者).toBe(85);
		expect(benchPress70kg.上級者).toBe(112);
		expect(benchPress70kg.エリート).toBe(141);
	});
});
