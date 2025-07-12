/**
 * src/utils/algorithms/insertion-sort.ts
 *
 * 挿入ソートアルゴリズムの実装
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
 * 挿入ソートアルゴリズムクラス
 *
 * 配列の各要素を既にソートされた部分の適切な位置に挿入するソートアルゴリズム
 * 時間計算量: O(n²)（最悪ケース）、O(n)（最良ケース）
 * 空間計算量: O(1)
 */
export class InsertionSortAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "insertion-sort",
		name: "挿入ソート",
		description:
			"配列の各要素を既にソートされた部分の適切な位置に挿入するソートアルゴリズム",
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
	 * 挿入ソートを実行
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
		let shiftCount = 0;
		let comparisonCount = 0;

		// 初期状態のステップ
		steps.push({
			id: stepId++,
			description: "挿入ソート開始：各要素を適切な位置に挿入してソートします",
			array: [...sortedArray],
			operation: "初期化",
			variables: {
				length: sortedArray.length,
				shiftCount: shiftCount,
				comparisonCount: comparisonCount,
			},
		});

		// 挿入ソートのメインループ
		const n = sortedArray.length;
		for (let i = 1; i < n; i++) {
			const key = sortedArray[i];
			let j = i - 1;

			// 新しい要素の挿入開始
			steps.push({
				id: stepId++,
				description: `要素 ${key} をソート済み部分 [${sortedArray
					.slice(0, i)
					.join(", ")}] に挿入します`,
				array: [...sortedArray],
				comparing: [i],
				operation: "挿入開始",
				variables: {
					currentIndex: i,
					keyValue: key,
					sortedPortion: sortedArray.slice(0, i),
					shiftCount: shiftCount,
					comparisonCount: comparisonCount,
				},
			});

			// 挿入位置を探すためのループ
			while (j >= 0 && sortedArray[j] > key) {
				comparisonCount++;

				// 比較ステップ
				steps.push({
					id: stepId++,
					description: `${sortedArray[j]} > ${key} なので ${sortedArray[j]} を右にシフト`,
					array: [...sortedArray],
					comparing: [j, j + 1],
					operation: "比較・シフト",
					variables: {
						comparedIndex: j,
						comparedValue: sortedArray[j],
						keyValue: key,
						willShift: "yes",
						comparisonCount: comparisonCount,
					},
				});

				// 要素を右にシフト
				sortedArray[j + 1] = sortedArray[j];
				shiftCount++;

				// シフト後の状態
				steps.push({
					id: stepId++,
					description: `${sortedArray[j + 1]} を右にシフトしました`,
					array: [...sortedArray],
					comparing: [j, j + 1],
					operation: "シフト完了",
					variables: {
						shiftedValue: sortedArray[j + 1],
						fromIndex: j,
						toIndex: j + 1,
						shiftCount: shiftCount,
						comparisonCount: comparisonCount,
					},
				});

				j--;
			}

			// 最終比較（挿入位置の確定）
			if (j >= 0) {
				comparisonCount++;
				steps.push({
					id: stepId++,
					description: `${sortedArray[j]} ≤ ${key} なので挿入位置が確定`,
					array: [...sortedArray],
					comparing: [j, j + 1],
					operation: "挿入位置確定",
					variables: {
						comparedIndex: j,
						comparedValue: sortedArray[j],
						keyValue: key,
						insertPosition: j + 1,
						comparisonCount: comparisonCount,
					},
				});
			} else {
				// 配列の先頭に挿入する場合
				steps.push({
					id: stepId++,
					description: `${key} は最小値なので配列の先頭に挿入`,
					array: [...sortedArray],
					comparing: [0],
					operation: "先頭挿入",
					variables: {
						keyValue: key,
						insertPosition: 0,
						comparisonCount: comparisonCount,
					},
				});
			}

			// キーを正しい位置に挿入
			sortedArray[j + 1] = key;

			// 挿入完了のステップ
			steps.push({
				id: stepId++,
				description: `要素 ${key} をインデックス ${j + 1} に挿入しました`,
				array: [...sortedArray],
				comparing: [j + 1],
				operation: "挿入完了",
				variables: {
					insertedValue: key,
					insertPosition: j + 1,
					sortedPortion: sortedArray.slice(0, i + 1),
					remainingElements: n - i - 1,
					shiftCount: shiftCount,
					comparisonCount: comparisonCount,
				},
			});

			// パス終了のステップ
			steps.push({
				id: stepId++,
				description: `パス ${i}/${n - 1} 終了：ソート済み部分が [${sortedArray
					.slice(0, i + 1)
					.join(", ")}] になりました`,
				array: [...sortedArray],
				operation: "パス終了",
				variables: {
					pass: i,
					totalPasses: n - 1,
					sortedCount: i + 1,
					remainingCount: n - i - 1,
					shiftCount: shiftCount,
					comparisonCount: comparisonCount,
				},
			});
		}

		// 完了ステップ
		steps.push({
			id: stepId++,
			description: "🎉 挿入ソート完了！全ての要素が正しい位置に挿入されました",
			array: [...sortedArray],
			operation: "完了",
			variables: {
				result: sortedArray,
				totalShifts: shiftCount,
				totalComparisons: comparisonCount,
				totalSteps: steps.length,
				efficiency: `${comparisonCount}回の比較、${shiftCount}回のシフト`,
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
			array: [5, 2, 4, 6, 1, 3],
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
挿入ソートは、配列の各要素を既にソートされた部分の適切な位置に挿入するソートアルゴリズムです。

🎯 **基本原理**
1. 配列の2番目の要素から開始
2. 現在の要素を既ソート部分の適切な位置に挿入
3. 必要に応じて既ソート部分の要素を右にシフト
4. 全ての要素が処理されるまで繰り返し

📈 **特徴**
- 安定ソート（同じ値の順序が保たれる）
- 部分的にソート済みの配列で高効率
- オンラインアルゴリズム（データが逐次到着する場合に適用可能）
- 小規模な配列で効率的

🎯 **実用性**
- 小規模データセットに最適
- 部分的にソート済みの配列で非常に高速
- 他の高速アルゴリズムの基礎部分として使用
- オンライン処理やストリーミングデータに適用可能

💡 **他のソートとの比較**
- バブルソート：隣接交換のみ、実装は簡単だが非効率
- 選択ソート：交換回数最小、常に一定の性能
- 挿入ソート：安定、部分ソートで高効率、実用的
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
	 * ほぼソート済みの配列を生成（挿入ソートが得意なケース）
	 * @param size 配列のサイズ
	 * @returns ほぼソート済み配列
	 */
	static generateNearlySortedArray(size: number): number[] {
		const array: number[] = [];
		for (let i = 1; i <= size; i++) {
			array.push(i);
		}

		// 数個の要素をランダムに入れ替える
		const swaps = Math.min(3, Math.floor(size / 3));
		for (let i = 0; i < swaps; i++) {
			const idx1 = Math.floor(Math.random() * size);
			const idx2 = Math.floor(Math.random() * size);
			[array[idx1], array[idx2]] = [array[idx2], array[idx1]];
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
