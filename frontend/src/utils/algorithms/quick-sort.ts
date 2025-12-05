/**
 * src/utils/algorithms/quick-sort.ts
 *
 * クイックソートアルゴリズムの実装
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
 * ピボット選択戦略の定義
 */
export type PivotStrategy = "first" | "last" | "middle" | "random";

/**
 * クイックソート専用の入力インターフェース
 */
export interface QuickSortInput extends AlgorithmInput {
	/** ピボット選択戦略 */
	pivotStrategy?: PivotStrategy;
}

/**
 * クイックソートアルゴリズムクラス
 *
 * 分割統治法を使用した効率的なソートアルゴリズム
 * 時間計算量: O(n log n)（平均ケース）、O(n²)（最悪ケース）
 * 空間計算量: O(log n)（再帰スタック）
 */
export class QuickSortAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "quick-sort",
		name: "クイックソート",
		description:
			"分割統治法を使用した効率的なソートアルゴリズム。ピボットを基準に配列を分割し、再帰的にソートします",
		category: "sort",
		timeComplexity: {
			best: "O(n log n)", // 最良の場合：バランスの取れた分割
			average: "O(n log n)", // 平均的な場合
			worst: "O(n²)", // 最悪の場合：既にソート済みで最初/最後をピボットに選択
		},
		difficulty: 3, // 中級〜上級
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private comparisonCount = 0;
	private swapCount = 0;
	private recursionDepth = 0;
	private maxRecursionDepth = 0;
	private pivotStrategy: PivotStrategy = "last";

	/**
	 * クイックソートを実行
	 * @param input ソート対象の配列とピボット戦略
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: QuickSortInput): AlgorithmResult {
		const { array, pivotStrategy = "last" } = input;

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

		// 初期化
		const sortedArray = [...array];
		this.steps = [];
		this.stepId = 0;
		this.comparisonCount = 0;
		this.swapCount = 0;
		this.recursionDepth = 0;
		this.maxRecursionDepth = 0;
		this.pivotStrategy = pivotStrategy;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `クイックソート開始：分割統治法でソートします（ピボット戦略: ${this.getPivotStrategyName(pivotStrategy)}）`,
			array: [...sortedArray],
			operation: "初期化",
			variables: {
				length: sortedArray.length,
				pivotStrategy: this.getPivotStrategyName(pivotStrategy),
				comparisonCount: this.comparisonCount,
				swapCount: this.swapCount,
			},
		});

		// クイックソートの実行
		this.quickSort(sortedArray, 0, sortedArray.length - 1);

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description:
				" クイックソート完了！分割統治法により効率的にソートされました",
			array: [...sortedArray],
			operation: "完了",
			variables: {
				result: sortedArray,
				totalComparisons: this.comparisonCount,
				totalSwaps: this.swapCount,
				maxRecursionDepth: this.maxRecursionDepth,
				totalSteps: this.steps.length,
				efficiency: `${this.comparisonCount}回の比較、${this.swapCount}回の交換、最大再帰深度${this.maxRecursionDepth}`,
			},
		});

		return {
			success: true,
			result: sortedArray,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * クイックソートの再帰的実装
	 * @param array ソート対象の配列
	 * @param low 開始インデックス
	 * @param high 終了インデックス
	 */
	private quickSort(array: number[], low: number, high: number): void {
		if (low < high) {
			this.recursionDepth++;
			this.maxRecursionDepth = Math.max(
				this.maxRecursionDepth,
				this.recursionDepth,
			);

			// 分割開始のステップ
			this.steps.push({
				id: this.stepId++,
				description: `範囲 [${low}, ${high}] の分割を開始（配列: [${array.slice(low, high + 1).join(", ")}]）`,
				array: [...array],
				searchRange: { start: low, end: high },
				operation: "分割開始",
				variables: {
					low: low,
					high: high,
					rangeSize: high - low + 1,
					recursionDepth: this.recursionDepth,
					comparisonCount: this.comparisonCount,
					swapCount: this.swapCount,
				},
			});

			// パーティション操作
			const pivotIndex = this.partition(array, low, high);

			// 分割完了のステップ
			this.steps.push({
				id: this.stepId++,
				description: `分割完了：ピボット ${array[pivotIndex]} を基準に左右に分割されました`,
				array: [...array],
				foundIndex: pivotIndex,
				operation: "分割完了",
				variables: {
					pivotIndex: pivotIndex,
					pivotValue: array[pivotIndex],
					leftRange: low < pivotIndex ? `[${low}, ${pivotIndex - 1}]` : "なし",
					rightRange:
						pivotIndex < high ? `[${pivotIndex + 1}, ${high}]` : "なし",
					recursionDepth: this.recursionDepth,
				},
			});

			// 左側の部分配列を再帰的にソート
			if (low < pivotIndex - 1) {
				this.steps.push({
					id: this.stepId++,
					description: `左側の部分配列 [${low}, ${pivotIndex - 1}] を再帰的にソート`,
					array: [...array],
					searchRange: { start: low, end: pivotIndex - 1 },
					operation: "左側再帰",
					variables: {
						targetRange: `[${low}, ${pivotIndex - 1}]`,
						recursionDepth: this.recursionDepth,
					},
				});
				this.quickSort(array, low, pivotIndex - 1);
			}

			// 右側の部分配列を再帰的にソート
			if (pivotIndex + 1 < high) {
				this.steps.push({
					id: this.stepId++,
					description: `右側の部分配列 [${pivotIndex + 1}, ${high}] を再帰的にソート`,
					array: [...array],
					searchRange: { start: pivotIndex + 1, end: high },
					operation: "右側再帰",
					variables: {
						targetRange: `[${pivotIndex + 1}, ${high}]`,
						recursionDepth: this.recursionDepth,
					},
				});
				this.quickSort(array, pivotIndex + 1, high);
			}

			this.recursionDepth--;

			// 結合完了のステップ
			this.steps.push({
				id: this.stepId++,
				description: `範囲 [${low}, ${high}] のソート完了`,
				array: [...array],
				searchRange: { start: low, end: high },
				operation: "範囲完了",
				variables: {
					completedRange: `[${low}, ${high}]`,
					sortedPortion: array.slice(low, high + 1),
					recursionDepth: this.recursionDepth,
				},
			});
		}
	}

	/**
	 * パーティション操作：ピボットを基準に配列を分割
	 * @param array 配列
	 * @param low 開始インデックス
	 * @param high 終了インデックス
	 * @returns ピボットの最終位置
	 */
	private partition(array: number[], low: number, high: number): number {
		// ピボットを選択
		const pivotIndex = this.selectPivot(array, low, high);
		const pivot = array[pivotIndex];

		// ピボットを最後の位置に移動（戦略によって既に最後にある場合もある）
		if (pivotIndex !== high) {
			this.swap(array, pivotIndex, high);
			this.steps.push({
				id: this.stepId++,
				description: `ピボット ${pivot} を最後の位置に移動`,
				array: [...array],
				comparing: [pivotIndex, high],
				operation: "ピボット移動",
				variables: {
					pivot: pivot,
					fromIndex: pivotIndex,
					toIndex: high,
					swapCount: this.swapCount,
				},
			});
		}

		// ピボット選択の説明
		this.steps.push({
			id: this.stepId++,
			description: `ピボット ${pivot} を選択（${this.getPivotStrategyName(this.pivotStrategy)}戦略）`,
			array: [...array],
			foundIndex: high,
			operation: "ピボット選択",
			variables: {
				pivot: pivot,
				pivotIndex: high,
				strategy: this.getPivotStrategyName(this.pivotStrategy),
				comparisonCount: this.comparisonCount,
			},
		});

		let i = low - 1; // 小さい要素の境界

		// パーティション操作
		for (let j = low; j < high; j++) {
			this.comparisonCount++;

			// 現在の要素とピボットを比較
			this.steps.push({
				id: this.stepId++,
				description: `${array[j]} とピボット ${pivot} を比較`,
				array: [...array],
				comparing: [j, high],
				operation: "要素比較",
				variables: {
					currentElement: array[j],
					pivot: pivot,
					currentIndex: j,
					smallerBoundary: i,
					comparisonCount: this.comparisonCount,
				},
			});

			if (array[j] <= pivot) {
				i++;
				if (i !== j) {
					this.swap(array, i, j);
					this.steps.push({
						id: this.stepId++,
						description: `${array[i]} ≤ ${pivot} なので小さい要素の領域に移動`,
						array: [...array],
						comparing: [i, j],
						operation: "要素移動",
						variables: {
							movedElement: array[i],
							fromIndex: j,
							toIndex: i,
							smallerBoundary: i,
							swapCount: this.swapCount,
						},
					});
				} else {
					this.steps.push({
						id: this.stepId++,
						description: `${array[j]} ≤ ${pivot} なので既に正しい位置にあります`,
						array: [...array],
						comparing: [j],
						operation: "位置確認",
						variables: {
							element: array[j],
							position: j,
							smallerBoundary: i,
						},
					});
				}
			} else {
				this.steps.push({
					id: this.stepId++,
					description: `${array[j]} > ${pivot} なので大きい要素の領域に残します`,
					array: [...array],
					comparing: [j],
					operation: "要素維持",
					variables: {
						element: array[j],
						pivot: pivot,
						position: j,
						smallerBoundary: i,
					},
				});
			}
		}

		// ピボットを正しい位置に配置
		this.swap(array, i + 1, high);
		this.steps.push({
			id: this.stepId++,
			description: `ピボット ${pivot} を正しい位置 ${i + 1} に配置`,
			array: [...array],
			comparing: [i + 1, high],
			foundIndex: i + 1,
			operation: "ピボット配置",
			variables: {
				pivot: pivot,
				finalPosition: i + 1,
				leftSize: i + 1 - low,
				rightSize: high - (i + 1),
				swapCount: this.swapCount,
			},
		});

		return i + 1;
	}

	/**
	 * ピボットを選択
	 * @param array 配列
	 * @param low 開始インデックス
	 * @param high 終了インデックス
	 * @returns ピボットのインデックス
	 */
	private selectPivot(array: number[], low: number, high: number): number {
		switch (this.pivotStrategy) {
			case "first":
				return low;
			case "middle":
				return Math.floor((low + high) / 2);
			case "random":
				return Math.floor(Math.random() * (high - low + 1)) + low;
			default:
				return high;
		}
	}

	/**
	 * 配列の要素を交換
	 * @param array 配列
	 * @param i インデックス1
	 * @param j インデックス2
	 */
	private swap(array: number[], i: number, j: number): void {
		if (i !== j) {
			[array[i], array[j]] = [array[j], array[i]];
			this.swapCount++;
		}
	}

	/**
	 * ピボット戦略の日本語名を取得
	 * @param strategy ピボット戦略
	 * @returns 日本語名
	 */
	private getPivotStrategyName(strategy: PivotStrategy): string {
		const strategyNames: Record<PivotStrategy, string> = {
			first: "先頭要素",
			last: "末尾要素",
			middle: "中央要素",
			random: "ランダム要素",
		};
		return strategyNames[strategy];
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): QuickSortInput {
		return {
			array: [3, 6, 8, 10, 1, 2, 1],
			pivotStrategy: "last",
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
クイックソートは、分割統治法を使用した効率的なソートアルゴリズムです。

【ポイント】**基本原理**
1. 配列からピボット（基準要素）を選択
2. ピボットより小さい要素を左、大きい要素を右に分割
3. 左右の部分配列に対して再帰的に同じ操作を実行
4. 分割により自然にソートが完成

 **特徴**
- 実用的で高速（平均的にO(n log n)）
- インプレースソート（追加メモリをほとんど使わない）
- 不安定ソート（同じ値の順序が保たれない）
- ピボット選択戦略により性能が大きく変わる

【ポイント】**実用性**
- 多くのプログラミング言語の標準ライブラリで採用
- 大規模データセットに適している
- キャッシュ効率が良い
- ハイブリッドソートの基礎アルゴリズム

【ヒント】**ピボット戦略**
- 先頭要素：実装が簡単だが、ソート済み配列で性能劣化
- 末尾要素：一般的な選択、先頭と同様の特性
- 中央要素：ソート済み配列でもバランスの取れた分割
- ランダム要素：理論的に最も安定した性能

【詳細】**他のソートとの比較**
- マージソート：安定だが追加メモリが必要
- ヒープソート：最悪ケースでもO(n log n)だがキャッシュ効率が悪い
- クイックソート：実用性と性能のバランスが最適
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
	 * 既にソート済みの配列を生成（最悪ケースのテスト用）
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

	/**
	 * バランスの取れた配列を生成（最良ケースのテスト用）
	 * @param size 配列のサイズ
	 * @returns バランスの取れた配列
	 */
	static generateBalancedArray(size: number): number[] {
		const array: number[] = [];
		const mid = Math.ceil(size / 2);

		// 中央値を最後に配置し、その前後に値を配置
		for (let i = 1; i < mid; i++) {
			array.push(i);
		}
		for (let i = mid + 1; i <= size; i++) {
			array.push(i);
		}
		array.push(mid); // 中央値を最後に

		return array;
	}
}
