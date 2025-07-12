/**
 * src/utils/algorithms/bubble-sort.ts
 *
 * バブルソートアルゴリズムの実装
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
 * バブルソートアルゴリズムクラス
 *
 * 隣接する要素を比較して、必要に応じて交換を繰り返すソートアルゴリズム
 * 時間計算量: O(n²)
 * 空間計算量: O(1)
 */
export class BubbleSortAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "bubble-sort",
		name: "バブルソート",
		description:
			"隣接する要素を比較して交換を繰り返すシンプルなソートアルゴリズム",
		category: "sort",
		timeComplexity: {
			best: "O(n)", // 最良の場合：既にソート済み
			average: "O(n²)", // 平均的な場合
			worst: "O(n²)", // 最悪の場合：逆順
		},
		difficulty: 2, // 初級〜中級
		spaceComplexity: "O(1)",
	};

	/**
	 * バブルソートを実行
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

		// 初期状態のステップ
		steps.push({
			id: stepId++,
			description: "ソート開始：配列をバブルソートで並べ替えます",
			array: [...sortedArray],
			operation: "初期化",
			variables: {
				length: sortedArray.length,
				swapCount: swapCount,
			},
		});

		// バブルソートのメインループ
		const n = sortedArray.length;
		for (let i = 0; i < n - 1; i++) {
			let hasSwapped = false;

			// パス開始のステップ
			steps.push({
				id: stepId++,
				description: `パス ${i + 1}/${n - 1}：最大値を右端に移動させます`,
				array: [...sortedArray],
				operation: "パス開始",
				variables: {
					pass: i + 1,
					totalPasses: n - 1,
					swapCount: swapCount,
				},
			});

			// 各パスでの比較・交換
			for (let j = 0; j < n - i - 1; j++) {
				// 隣接要素の比較ステップ
				steps.push({
					id: stepId++,
					description: `${sortedArray[j]} と ${sortedArray[j + 1]} を比較`,
					array: [...sortedArray],
					comparing: [j, j + 1],
					operation: "比較",
					variables: {
						leftValue: sortedArray[j],
						rightValue: sortedArray[j + 1],
						leftIndex: j,
						rightIndex: j + 1,
						swapCount: swapCount,
					},
				});

				// 交換が必要な場合
				if (sortedArray[j] > sortedArray[j + 1]) {
					// 交換前の状態を記録
					const beforeSwap = [...sortedArray];

					// 実際の交換処理
					[sortedArray[j], sortedArray[j + 1]] = [
						sortedArray[j + 1],
						sortedArray[j],
					];
					hasSwapped = true;
					swapCount++;

					// 交換後のステップ
					steps.push({
						id: stepId++,
						description: `${beforeSwap[j]} > ${beforeSwap[j + 1]} なので交換します`,
						array: [...sortedArray],
						comparing: [j, j + 1],
						operation: "交換",
						variables: {
							beforeSwap: `[${beforeSwap[j]}, ${beforeSwap[j + 1]}]`,
							afterSwap: `[${sortedArray[j]}, ${sortedArray[j + 1]}]`,
							swapCount: swapCount,
						},
					});
				} else {
					// 交換不要の場合
					steps.push({
						id: stepId++,
						description: `${sortedArray[j]} ≤ ${sortedArray[j + 1]} なので交換不要`,
						array: [...sortedArray],
						comparing: [j, j + 1],
						operation: "交換不要",
						variables: {
							swapCount: swapCount,
						},
					});
				}
			}

			// パス終了のステップ
			steps.push({
				id: stepId++,
				description: `パス ${i + 1} 終了：最大値 ${sortedArray[n - i - 1]} が右端に配置されました`,
				array: [...sortedArray],
				operation: "パス終了",
				variables: {
					pass: i + 1,
					sortedElement: sortedArray[n - i - 1],
					sortedPosition: n - i - 1,
					swapCount: swapCount,
				},
			});

			// 最適化：交換が発生しなかった場合は既にソート済み
			if (!hasSwapped) {
				steps.push({
					id: stepId++,
					description:
						"✅ 交換が発生しませんでした。配列は既にソート済みです！",
					array: [...sortedArray],
					operation: "早期終了",
					variables: {
						finalPass: i + 1,
						totalPasses: n - 1,
						swapCount: swapCount,
					},
				});
				break;
			}
		}

		// 完了ステップ
		steps.push({
			id: stepId++,
			description: "🎉 ソート完了！配列が昇順に並べ替えられました",
			array: [...sortedArray],
			operation: "完了",
			variables: {
				result: sortedArray,
				totalSwaps: swapCount,
				totalSteps: steps.length,
			},
		});

		return {
			success: true,
			result: sortedArray,
			steps: steps,
			executionSteps: steps,
			timeComplexity:
				swapCount === 0
					? this.info.timeComplexity.best
					: this.info.timeComplexity.average,
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [64, 34, 25, 12, 22, 11, 90],
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
バブルソートは、隣接する要素を比較して必要に応じて交換を繰り返すシンプルなソートアルゴリズムです。

🫧 **基本原理**
1. 配列の先頭から隣接する2つの要素を比較
2. 左の要素が右の要素より大きい場合、交換
3. 配列の最後まで繰り返し、最大値を右端に「浮上」させる
4. 残りの要素に対して同じ処理を繰り返す

📈 **特徴**
- 実装が非常にシンプル
- 安定ソート（同じ値の要素の順序が保たれる）
- 最適化により既にソート済みの配列を高速処理可能
- 大きな値が「泡（バブル）」のように浮上することから命名

🎯 **実用性**
- 教育目的での理解に最適
- 小規模なデータセットに適している
- 大規模データには効率的でない（O(n²)の時間計算量）

💡 **最適化のポイント**
- 交換が発生しなかった場合の早期終了
- 各パスで右端の要素は確定済みなので比較範囲を縮小
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
}
