/**
 * src/utils/algorithms/linear-search.ts
 *
 * 線形探索アルゴリズムの実装
 * 教育目的でステップバイステップの実行をサポート
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 線形探索アルゴリズムクラス
 *
 * 配列の先頭から順次要素を確認して目標値を探すシンプルな探索アルゴリズム
 * 時間計算量: O(n)
 * 空間計算量: O(1)
 */
export class LinearSearchAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "linear-search",
		name: "線形探索",
		description:
			"配列の先頭から順次要素を確認して目標値を探すシンプルな探索アルゴリズム",
		category: "search",
		timeComplexity: {
			best: "O(1)", // 最良の場合：最初に見つかる
			average: "O(n/2)", // 平均的な場合：配列の中央あたり
			worst: "O(n)", // 最悪の場合：最後にある、または見つからない
		},
		difficulty: 1, // 初級
		spaceComplexity: "O(1)",
	};

	/**
	 * 線形探索を実行
	 * @param input 探索対象の配列と目標値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		const { array, target } = input;

		// 入力検証
		if (!array || array.length === 0) {
			return {
				success: false,
				result: -1,
				steps: [],
				executionSteps: [],
				timeComplexity: this.info.timeComplexity.best,
			};
		}

		if (target === undefined) {
			throw new Error("探索対象の値（target）が指定されていません");
		}

		const steps: AlgorithmStep[] = [];
		let stepId = 0;

		// 初期状態のステップ
		steps.push({
			id: stepId++,
			description: `線形探索開始：配列から ${target} を先頭から順番に探します`,
			array: [...array],
			operation: "初期化",
			variables: {
				target: target,
				arrayLength: array.length,
				currentIndex: -1,
			},
		});

		// 線形探索のメインループ
		for (let i = 0; i < array.length; i++) {
			const currentValue = array[i];

			// 現在の要素を確認するステップ
			steps.push({
				id: stepId++,
				description: `インデックス ${i}：array[${i}] = ${currentValue} を確認`,
				array: [...array],
				comparing: [i],
				operation: "要素確認",
				variables: {
					currentIndex: i,
					currentValue: currentValue,
					target: target,
					checkedCount: i + 1,
				},
			});

			// 目標値と比較
			if (currentValue === target) {
				// 見つかった場合
				steps.push({
					id: stepId++,
					description: `見つかりました！ ${target} はインデックス ${i} にあります`,
					array: [...array],
					foundIndex: i,
					operation: "発見",
					variables: {
						result: i,
						target: target,
						totalChecked: i + 1,
						efficiency: `${(((i + 1) / array.length) * 100).toFixed(1)}%の要素をチェック`,
					},
				});

				return {
					success: true,
					result: i,
					steps: steps,
					executionSteps: steps,
					timeComplexity:
						i === 0
							? this.info.timeComplexity.best
							: i < array.length / 2
								? "O(n/4)"
								: i < (array.length * 3) / 4
									? this.info.timeComplexity.average
									: "O(3n/4)",
				};
			}

			// 一致しない場合
			steps.push({
				id: stepId++,
				description: `${currentValue} ≠ ${target} なので次の要素を確認します`,
				array: [...array],
				comparing: [i],
				operation: "不一致",
				variables: {
					currentIndex: i,
					currentValue: currentValue,
					target: target,
					remaining: array.length - i - 1,
				},
			});
		}

		// 見つからなかった場合
		steps.push({
			id: stepId++,
			description: `${target} は配列内に見つかりませんでした（全${array.length}個の要素をチェック）`,
			array: [...array],
			operation: "未発見",
			variables: {
				result: -1,
				target: target,
				totalChecked: array.length,
				efficiency: "100%の要素をチェック",
			},
		});

		return {
			success: false,
			result: -1,
			steps: steps,
			executionSteps: steps,
			timeComplexity: this.info.timeComplexity.worst,
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3],
			target: 5,
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
線形探索は、配列の先頭から順番に要素を確認して目標値を探すシンプルな探索アルゴリズムです。

【詳細】**基本原理**
1. 配列の最初の要素から確認開始
2. 目標値と現在の要素を比較
3. 一致すれば探索終了、一致しなければ次の要素へ
4. 配列の最後まで繰り返し

 **特徴**
- 実装が非常にシンプル
- ソートされていない配列でも使用可能
- 最悪の場合、全要素をチェックする必要がある
- メモリ使用量が少ない（定数空間）

【ポイント】**実用例**
- 小さなデータセットでの検索
- ソートされていないデータの検索
- リストの重複チェック
- 条件に合う要素の検索

【計算量】**二分探索との比較**
- 線形探索：O(n)、ソート不要、シンプル
- 二分探索：O(log n)、ソート必須、複雑

【ヒント】**使い分け**
- データが少ない場合やソートのコストが高い場合：線形探索
- データが多くソート済みの場合：二分探索
		`.trim();
	}

	/**
	 * ランダムな配列を生成
	 * @param size 配列のサイズ
	 * @param maxValue 最大値
	 * @returns ランダムな配列
	 */
	static generateRandomArray(size: number, maxValue = 20): number[] {
		const array: number[] = [];
		for (let i = 0; i < size; i++) {
			array.push(Math.floor(Math.random() * maxValue) + 1);
		}
		return array;
	}

	/**
	 * 配列内のランダムな要素を取得（探索テスト用）
	 * @param array 対象配列
	 * @returns ランダムな要素
	 */
	static getRandomTarget(array: number[]): number {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	}

	/**
	 * 配列の最初の要素を取得（最良ケースのテスト用）
	 * @param array 対象配列
	 * @returns 最初の要素
	 */
	static getFirstElement(array: number[]): number {
		return array[0];
	}

	/**
	 * 配列の最後の要素を取得（最悪ケースのテスト用）
	 * @param array 対象配列
	 * @returns 最後の要素
	 */
	static getLastElement(array: number[]): number {
		return array[array.length - 1];
	}

	/**
	 * 配列にない値を生成（見つからないケースのテスト用）
	 * @param array 対象配列
	 * @returns 配列にない値
	 */
	static getNonExistentTarget(array: number[]): number {
		const maxValue = Math.max(...array);
		let candidate = maxValue + 1;

		// 念のため、配列に含まれていないことを確認
		while (array.includes(candidate)) {
			candidate++;
		}
		return candidate;
	}

	/**
	 * 重複要素を含む配列を生成（重複検索のテスト用）
	 * @param size 配列のサイズ
	 * @returns 重複要素を含む配列
	 */
	static generateArrayWithDuplicates(size: number): number[] {
		const array: number[] = [];
		const baseValues = [1, 2, 3, 4, 5];

		for (let i = 0; i < size; i++) {
			const value = baseValues[Math.floor(Math.random() * baseValues.length)];
			array.push(value);
		}
		return array;
	}
}
