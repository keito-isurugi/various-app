import { describe, expect, it } from "@jest/globals";
import type {
	BIG3Data,
	ExerciseType,
	LevelWeight,
	WeightData,
	WeightLevel,
} from "./big3";

describe("BIG3型定義テスト", () => {
	it("WeightLevel型が正しい値を持つ", () => {
		const levels: WeightLevel[] = [
			"初心者",
			"初級者",
			"中級者",
			"上級者",
			"エリート",
		];

		levels.forEach((level) => {
			expect(typeof level).toBe("string");
		});

		expect(levels).toHaveLength(5);
	});

	it("ExerciseType型が正しい値を持つ", () => {
		const exercises: ExerciseType[] = [
			"ベンチプレス",
			"スクワット",
			"デッドリフト",
		];

		exercises.forEach((exercise) => {
			expect(typeof exercise).toBe("string");
		});

		expect(exercises).toHaveLength(3);
	});

	it("WeightData型の構造が正しい", () => {
		const testData: WeightData = {
			bodyWeight: 70,
			初心者: 44,
			初級者: 62,
			中級者: 85,
			上級者: 112,
			エリート: 141,
		};

		expect(typeof testData.bodyWeight).toBe("number");
		expect(typeof testData.初心者).toBe("number");
		expect(typeof testData.初級者).toBe("number");
		expect(typeof testData.中級者).toBe("number");
		expect(typeof testData.上級者).toBe("number");
		expect(typeof testData.エリート).toBe("number");
	});

	it("LevelWeight型の構造が正しい", () => {
		const testLevelWeight: LevelWeight = {
			初心者: 44,
			初級者: 62,
			中級者: 85,
			上級者: 112,
			エリート: 141,
		};

		expect(typeof testLevelWeight.初心者).toBe("number");
		expect(typeof testLevelWeight.初級者).toBe("number");
		expect(typeof testLevelWeight.中級者).toBe("number");
		expect(typeof testLevelWeight.上級者).toBe("number");
		expect(typeof testLevelWeight.エリート).toBe("number");
	});

	it("BIG3Data型の構造が正しい", () => {
		const testBIG3Data: BIG3Data = {
			ベンチプレス: [
				{
					bodyWeight: 70,
					初心者: 44,
					初級者: 62,
					中級者: 85,
					上級者: 112,
					エリート: 141,
				},
			],
			スクワット: [
				{
					bodyWeight: 70,
					初心者: 59,
					初級者: 83,
					中級者: 113,
					上級者: 147,
					エリート: 184,
				},
			],
			デッドリフト: [
				{
					bodyWeight: 70,
					初心者: 73,
					初級者: 100,
					中級者: 133,
					上級者: 171,
					エリート: 212,
				},
			],
		};

		expect(Array.isArray(testBIG3Data.ベンチプレス)).toBe(true);
		expect(Array.isArray(testBIG3Data.スクワット)).toBe(true);
		expect(Array.isArray(testBIG3Data.デッドリフト)).toBe(true);

		expect(testBIG3Data.ベンチプレス[0].bodyWeight).toBe(70);
		expect(testBIG3Data.スクワット[0].bodyWeight).toBe(70);
		expect(testBIG3Data.デッドリフト[0].bodyWeight).toBe(70);
	});
});
