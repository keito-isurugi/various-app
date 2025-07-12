/**
 * src/utils/algorithms/merge-sort.ts
 *
 * マージソートアルゴリズムの実装
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
 * マージソートアルゴリズムクラス
 *
 * 分割統治法を使用した安定なソートアルゴリズム
 * 時間計算量: O(n log n)（全てのケース）
 * 空間計算量: O(n)（追加配列が必要）
 */
export class MergeSortAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "merge-sort",
		name: "マージソート",
		description:
			"分割統治法を使用した安定なソートアルゴリズム。配列を半分ずつに分割し、ソート済み配列をマージして結果を得ます",
		category: "sort",
		timeComplexity: {
			best: "O(n log n)", // 最良の場合：常に一定
			average: "O(n log n)", // 平均的な場合：常に一定
			worst: "O(n log n)", // 最悪の場合：常に一定
		},
		spaceComplexity: "O(n)", // 追加配列が必要
		difficulty: 3, // 中級〜上級
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private comparisonCount = 0;
	private mergeCount = 0;
	private recursionDepth = 0;
	private maxRecursionDepth = 0;

	/**
	 * マージソートを実行
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
				executionSteps: 0,
				timeComplexity: this.info.timeComplexity.best,
				spaceComplexity: this.info.spaceComplexity,
			};
		}

		// 初期化
		const sortedArray = [...array];
		this.steps = [];
		this.stepId = 0;
		this.comparisonCount = 0;
		this.mergeCount = 0;
		this.recursionDepth = 0;
		this.maxRecursionDepth = 0;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: "マージソート開始：分割統治法により安定ソートを実行します",
			array: [...sortedArray],
			operation: "初期化",
			variables: {
				length: sortedArray.length,
				comparisonCount: this.comparisonCount,
				mergeCount: this.mergeCount,
			},
		});

		// マージソートの実行
		const result = this.mergeSort(sortedArray, 0, sortedArray.length - 1);

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: "🎉 マージソート完了！安定で効率的なソートが実現されました",
			array: [...result],
			operation: "完了",
			variables: {
				result: result,
				totalComparisons: this.comparisonCount,
				totalMerges: this.mergeCount,
				maxRecursionDepth: this.maxRecursionDepth,
				totalSteps: this.steps.length,
				efficiency: `${this.comparisonCount}回の比較、${this.mergeCount}回のマージ、最大再帰深度${this.maxRecursionDepth}`,
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps.length,
			timeComplexity: this.info.timeComplexity.average,
			spaceComplexity: this.info.spaceComplexity,
		};
	}

	/**
	 * マージソートの再帰的実装
	 * @param array ソート対象の配列
	 * @param left 開始インデックス
	 * @param right 終了インデックス
	 * @returns ソート済み配列
	 */
	private mergeSort(array: number[], left: number, right: number): number[] {
		if (left >= right) {
			// ベースケース：要素が1個以下
			const singleElement = [array[left]];
			this.steps.push({
				id: this.stepId++,
				description: `ベースケース：単一要素 [${singleElement[0]}] は既にソート済み`,
				array: [...array],
				searchRange: { start: left, end: right },
				operation: "ベースケース",
				variables: {
					element: singleElement[0],
					position: left,
					recursionDepth: this.recursionDepth,
				},
			});
			return singleElement;
		}

		this.recursionDepth++;
		this.maxRecursionDepth = Math.max(
			this.maxRecursionDepth,
			this.recursionDepth,
		);

		const mid = Math.floor((left + right) / 2);

		// 分割開始のステップ
		this.steps.push({
			id: this.stepId++,
			description: `配列 [${array.slice(left, right + 1).join(", ")}] を中央で分割（中央点: ${mid}）`,
			array: [...array],
			searchRange: { start: left, end: right },
			operation: "分割開始",
			variables: {
				left: left,
				right: right,
				mid: mid,
				leftSize: mid - left + 1,
				rightSize: right - mid,
				recursionDepth: this.recursionDepth,
			},
		});

		// 左半分を再帰的にソート
		this.steps.push({
			id: this.stepId++,
			description: `左半分 [${array.slice(left, mid + 1).join(", ")}] を再帰的にソート`,
			array: [...array],
			searchRange: { start: left, end: mid },
			operation: "左分割",
			variables: {
				leftRange: `[${left}, ${mid}]`,
				recursionDepth: this.recursionDepth,
			},
		});

		const leftSorted = this.mergeSort(array, left, mid);

		// 右半分を再帰的にソート
		this.steps.push({
			id: this.stepId++,
			description: `右半分 [${array.slice(mid + 1, right + 1).join(", ")}] を再帰的にソート`,
			array: [...array],
			searchRange: { start: mid + 1, end: right },
			operation: "右分割",
			variables: {
				rightRange: `[${mid + 1}, ${right}]`,
				recursionDepth: this.recursionDepth,
			},
		});

		const rightSorted = this.mergeSort(array, mid + 1, right);

		// マージ操作の準備
		this.steps.push({
			id: this.stepId++,
			description: `ソート済み左配列 [${leftSorted.join(", ")}] と右配列 [${rightSorted.join(", ")}] をマージ開始`,
			array: [...array],
			operation: "マージ準備",
			variables: {
				leftSorted: leftSorted,
				rightSorted: rightSorted,
				totalElements: leftSorted.length + rightSorted.length,
				recursionDepth: this.recursionDepth,
			},
		});

		// マージ操作
		const merged = this.merge(leftSorted, rightSorted);

		// 結果を元の配列に反映
		for (let i = 0; i < merged.length; i++) {
			array[left + i] = merged[i];
		}

		// マージ完了のステップ
		this.steps.push({
			id: this.stepId++,
			description: `マージ完了：結果 [${merged.join(", ")}] を範囲 [${left}, ${right}] に配置`,
			array: [...array],
			searchRange: { start: left, end: right },
			operation: "マージ完了",
			variables: {
				mergedResult: merged,
				targetRange: `[${left}, ${right}]`,
				recursionDepth: this.recursionDepth,
			},
		});

		this.recursionDepth--;

		return merged;
	}

	/**
	 * 2つのソート済み配列をマージ
	 * @param left 左のソート済み配列
	 * @param right 右のソート済み配列
	 * @returns マージされた配列
	 */
	private merge(left: number[], right: number[]): number[] {
		const result: number[] = [];
		let leftIndex = 0;
		let rightIndex = 0;

		this.mergeCount++;

		// マージ操作の詳細ステップ
		while (leftIndex < left.length && rightIndex < right.length) {
			this.comparisonCount++;

			const leftElement = left[leftIndex];
			const rightElement = right[rightIndex];

			// 比較ステップ
			this.steps.push({
				id: this.stepId++,
				description: `${leftElement} と ${rightElement} を比較`,
				array: [], // マージ中は元配列の状態を表示しない
				operation: "要素比較",
				variables: {
					leftElement: leftElement,
					rightElement: rightElement,
					leftIndex: leftIndex,
					rightIndex: rightIndex,
					currentResult: [...result],
					comparisonCount: this.comparisonCount,
				},
			});

			if (leftElement <= rightElement) {
				// 左の要素を選択（安定性を保つため等しい場合は左を優先）
				result.push(leftElement);
				leftIndex++;

				this.steps.push({
					id: this.stepId++,
					description: `${leftElement} ≤ ${rightElement} なので ${leftElement} を結果に追加（安定性保持）`,
					array: [],
					operation: "左要素選択",
					variables: {
						selectedElement: leftElement,
						reason: "left_smaller_or_equal",
						currentResult: [...result],
						remainingLeft: left.slice(leftIndex),
						remainingRight: right.slice(rightIndex),
					},
				});
			} else {
				// 右の要素を選択
				result.push(rightElement);
				rightIndex++;

				this.steps.push({
					id: this.stepId++,
					description: `${leftElement} > ${rightElement} なので ${rightElement} を結果に追加`,
					array: [],
					operation: "右要素選択",
					variables: {
						selectedElement: rightElement,
						reason: "right_smaller",
						currentResult: [...result],
						remainingLeft: left.slice(leftIndex),
						remainingRight: right.slice(rightIndex),
					},
				});
			}
		}

		// 残りの左側要素を追加
		while (leftIndex < left.length) {
			result.push(left[leftIndex]);
			this.steps.push({
				id: this.stepId++,
				description: `右側完了：残りの左要素 ${left[leftIndex]} を結果に追加`,
				array: [],
				operation: "左残り追加",
				variables: {
					remainingElement: left[leftIndex],
					currentResult: [...result],
					remainingLeft: left.slice(leftIndex + 1),
				},
			});
			leftIndex++;
		}

		// 残りの右側要素を追加
		while (rightIndex < right.length) {
			result.push(right[rightIndex]);
			this.steps.push({
				id: this.stepId++,
				description: `左側完了：残りの右要素 ${right[rightIndex]} を結果に追加`,
				array: [],
				operation: "右残り追加",
				variables: {
					remainingElement: right[rightIndex],
					currentResult: [...result],
					remainingRight: right.slice(rightIndex + 1),
				},
			});
			rightIndex++;
		}

		// マージ結果のステップ
		this.steps.push({
			id: this.stepId++,
			description: `マージ操作完了：[${left.join(", ")}] + [${right.join(", ")}] → [${result.join(", ")}]`,
			array: [],
			operation: "マージ結果",
			variables: {
				leftArray: left,
				rightArray: right,
				mergedArray: result,
				totalComparisons: this.comparisonCount,
				mergeCount: this.mergeCount,
			},
		});

		return result;
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [38, 27, 43, 3, 9, 82, 10],
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
マージソートは、分割統治法を使用した安定で効率的なソートアルゴリズムです。

🎯 **基本原理**
1. 配列を半分ずつに分割していく（分割フェーズ）
2. 単一要素になるまで再帰的に分割
3. ソート済みの小配列同士をマージ（統治フェーズ）
4. 全体がソートされるまで繰り返し

📈 **特徴**
- 安定ソート（同じ値の順序が保たれる）
- 常にO(n log n)の時間計算量を保証
- 外部ソート（大容量データ）に適している
- 並列処理に適用しやすい

🎯 **実用性**
- データベースの大規模ソート処理
- 外部ソート（メモリに収まらないデータ）
- 安定性が重要なアプリケーション
- 並列分散処理システム

💡 **クイックソートとの比較**
- マージソート：常にO(n log n)、安定、追加メモリ必要
- クイックソート：平均O(n log n)、不安定、インプレース
- マージソート：予測可能な性能、外部ソートに適用可能

🔍 **分割統治法の学習**
- 問題を小さく分割する思考法
- 再帰的なアルゴリズム設計の基礎
- 効率的なアルゴリズムの典型例
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
	 * 逆順の配列を生成
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
	 * 既にソート済みの配列を生成
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
	 * 重複要素を含む配列を生成（安定性テスト用）
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

	/**
	 * 安定性テスト用の配列を生成
	 * 同じ値でも挿入順序が分かるように連番を追加
	 * @param size 配列のサイズ
	 * @returns 安定性テスト用配列
	 */
	static generateStabilityTestArray(size: number): number[] {
		const array: number[] = [];
		const values = [1, 2, 3];

		for (let i = 0; i < size; i++) {
			// 同じ値を複数回挿入して安定性をテスト
			const baseValue = values[i % values.length];
			array.push(baseValue);
		}

		return array;
	}

	/**
	 * 部分的にソート済みの配列を生成
	 * @param size 配列のサイズ
	 * @returns 部分的にソート済み配列
	 */
	static generatePartiallySortedArray(size: number): number[] {
		const array: number[] = [];

		// 前半をソート済みに
		for (let i = 1; i <= Math.floor(size / 2); i++) {
			array.push(i);
		}

		// 後半をランダムに
		for (let i = Math.floor(size / 2) + 1; i <= size; i++) {
			array.push(Math.floor(Math.random() * size) + 1);
		}

		return array;
	}
}
