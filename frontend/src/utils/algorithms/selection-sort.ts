/**
 * src/utils/algorithms/selection-sort.ts
 *
 * 選択ソートアルゴリズムの実装
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
 * 選択ソートアルゴリズムクラス
 *
 * 未ソート部分から最小値を見つけて、ソート済み部分の末尾に移動する操作を繰り返すソートアルゴリズム
 * 時間計算量: O(n²)
 * 空間計算量: O(1)
 */
export class SelectionSortAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "selection-sort",
		name: "選択ソート",
		description:
			"未ソート部分から最小値を見つけて先頭に移動する操作を繰り返すソートアルゴリズム",
		category: "sort",
		timeComplexity: {
			best: "O(n²)", // 最良の場合：既にソート済みでも全要素を比較
			average: "O(n²)", // 平均的な場合
			worst: "O(n²)", // 最悪の場合：逆順
		},
		difficulty: 2, // 初級〜中級
		spaceComplexity: "O(1)",
	};

	/**
	 * 選択ソートを実行
	 * @param input ソート対象の配列
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		const { array } = input;

		// 入力検証
		if (!array || array.length === 0) {
			return {
				success: false,
				result: [],
				steps: [],
				executionSteps: [],
				timeComplexity: this.info.timeComplexity.best,
			};
		}

		// 配列をコピー（元の配列を変更しないため）
		const sortedArray = [...array];
		const steps: AlgorithmStep[] = [];
		let stepId = 0;
		let swapCount = 0;
		let comparisonCount = 0;

		// 初期状態のステップ
		steps.push({
			id: stepId++,
			description:
				"選択ソート開始：未ソート部分から最小値を見つけて先頭に移動します",
			array: [...sortedArray],
			operation: "初期化",
			variables: {
				length: sortedArray.length,
				swapCount: swapCount,
				comparisonCount: comparisonCount,
			},
		});

		// 選択ソートのメインループ
		const n = sortedArray.length;
		for (let i = 0; i < n - 1; i++) {
			let minIndex = i;

			// パス開始のステップ
			steps.push({
				id: stepId++,
				description: `パス ${i + 1}/${n - 1}：インデックス ${i} から最後まで最小値を探します`,
				array: [...sortedArray],
				comparing: [i],
				operation: "パス開始",
				variables: {
					pass: i + 1,
					totalPasses: n - 1,
					currentPosition: i,
					assumedMinIndex: minIndex,
					assumedMinValue: sortedArray[minIndex],
					swapCount: swapCount,
					comparisonCount: comparisonCount,
				},
			});

			// 最小値を探すループ
			for (let j = i + 1; j < n; j++) {
				comparisonCount++;

				// 比較ステップ
				steps.push({
					id: stepId++,
					description: `${sortedArray[j]} と現在の最小値 ${sortedArray[minIndex]} を比較`,
					array: [...sortedArray],
					comparing: [minIndex, j],
					operation: "最小値探索",
					variables: {
						currentIndex: j,
						currentValue: sortedArray[j],
						minIndex: minIndex,
						minValue: sortedArray[minIndex],
						comparisonCount: comparisonCount,
					},
				});

				// 新しい最小値が見つかった場合
				if (sortedArray[j] < sortedArray[minIndex]) {
					const oldMinIndex = minIndex;
					const oldMinValue = sortedArray[minIndex];
					minIndex = j;

					steps.push({
						id: stepId++,
						description: `${sortedArray[j]} < ${oldMinValue} なので最小値を更新`,
						array: [...sortedArray],
						comparing: [oldMinIndex, minIndex],
						operation: "最小値更新",
						variables: {
							oldMinIndex: oldMinIndex,
							oldMinValue: oldMinValue,
							newMinIndex: minIndex,
							newMinValue: sortedArray[minIndex],
							comparisonCount: comparisonCount,
						},
					});
				} else {
					// 最小値は変わらない場合
					steps.push({
						id: stepId++,
						description: `${sortedArray[j]} ≥ ${sortedArray[minIndex]} なので最小値は変わりません`,
						array: [...sortedArray],
						comparing: [minIndex, j],
						operation: "最小値維持",
						variables: {
							minIndex: minIndex,
							minValue: sortedArray[minIndex],
							comparisonCount: comparisonCount,
						},
					});
				}
			}

			// 最小値をソート済み部分の末尾に移動
			if (minIndex !== i) {
				// 交換が必要な場合
				const beforeSwap = [...sortedArray];
				[sortedArray[i], sortedArray[minIndex]] = [
					sortedArray[minIndex],
					sortedArray[i],
				];
				swapCount++;

				steps.push({
					id: stepId++,
					description: `最小値 ${beforeSwap[minIndex]} をインデックス ${i} に移動（交換）`,
					array: [...sortedArray],
					comparing: [i, minIndex],
					operation: "交換",
					variables: {
						fromIndex: minIndex,
						toIndex: i,
						beforeValue_i: beforeSwap[i],
						beforeValue_min: beforeSwap[minIndex],
						afterValue_i: sortedArray[i],
						afterValue_min: sortedArray[minIndex],
						swapCount: swapCount,
						comparisonCount: comparisonCount,
					},
				});
			} else {
				// 交換が不要な場合
				steps.push({
					id: stepId++,
					description: `最小値 ${sortedArray[i]} は既に正しい位置にあります（交換不要）`,
					array: [...sortedArray],
					comparing: [i],
					operation: "交換不要",
					variables: {
						position: i,
						value: sortedArray[i],
						swapCount: swapCount,
						comparisonCount: comparisonCount,
					},
				});
			}

			// パス終了のステップ
			steps.push({
				id: stepId++,
				description: `パス ${i + 1} 終了：インデックス ${i} が確定（値: ${sortedArray[i]}）`,
				array: [...sortedArray],
				operation: "パス終了",
				variables: {
					pass: i + 1,
					confirmedIndex: i,
					confirmedValue: sortedArray[i],
					remainingUnsorted: n - i - 1,
					swapCount: swapCount,
					comparisonCount: comparisonCount,
				},
			});
		}

		// 完了ステップ
		steps.push({
			id: stepId++,
			description: " 選択ソート完了！配列が昇順に並べ替えられました",
			array: [...sortedArray],
			operation: "完了",
			variables: {
				result: sortedArray,
				totalSwaps: swapCount,
				totalComparisons: comparisonCount,
				totalSteps: steps.length,
				efficiency: `${comparisonCount}回の比較、${swapCount}回の交換`,
			},
		});

		return {
			success: true,
			result: sortedArray,
			steps: steps,
			executionSteps: steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [64, 25, 12, 22, 11],
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
選択ソートは、未ソート部分から最小値を選択して、ソート済み部分の末尾に移動する操作を繰り返すソートアルゴリズムです。

【ポイント】**基本原理**
1. 配列全体から最小値を見つけて最初の位置に移動
2. 残りの部分から最小値を見つけて2番目の位置に移動
3. この操作を配列がソートされるまで繰り返す

 **特徴**
- 実装がシンプルで理解しやすい
- 交換回数が最小（最大n-1回）
- 不安定ソート（同じ値の順序が保たれない）
- データの初期状態に関係なく常にO(n²)

【ポイント】**実用性**
- 教育目的での理解に最適
- 交換コストが高い場合に有効
- 小規模なデータセットに適している

【ヒント】**他のソートとの比較**
- バブルソート：交換回数は多いが、部分的にソート済みで高速化可能
- 挿入ソート：安定ソートで、部分的にソート済みの配列で高効率
- 選択ソート：交換回数最小、常に一定の性能
		`.trim();
	}

	/**
	 * ランダムな配列を生成
	 * @param size 配列のサイズ
	 * @param maxValue 最大値
	 * @returns ランダムな配列
	 */
	static generateRandomArray(size: number, maxValue = 100): number[] {
		const array: number[] = [];
		for (let i = 0; i < size; i++) {
			array.push(Math.floor(Math.random() * maxValue) + 1);
		}
		return array;
	}

	/**
	 * 逆順の配列を生成（最悪ケースのテスト用）
	 * @param size 配列のサイズ
	 * @returns 逆順の配列
	 */
	static generateReverseArray(size: number): number[] {
		const array: number[] = [];
		for (let i = size; i > 0; i--) {
			array.push(i);
		}
		return array;
	}

	/**
	 * 既にソート済みの配列を生成（最良ケースのテスト用）
	 * @param size 配列のサイズ
	 * @returns ソート済み配列
	 */
	static generateSortedArray(size: number): number[] {
		const array: number[] = [];
		for (let i = 1; i <= size; i++) {
			array.push(i);
		}
		return array;
	}

	/**
	 * 重複要素を含む配列を生成
	 * @param size 配列のサイズ
	 * @returns 重複要素を含む配列
	 */
	static generateArrayWithDuplicates(size: number): number[] {
		const array: number[] = [];
		const baseValues = [10, 20, 30, 40, 50];

		for (let i = 0; i < size; i++) {
			const value = baseValues[Math.floor(Math.random() * baseValues.length)];
			array.push(value);
		}
		return array;
	}
}
