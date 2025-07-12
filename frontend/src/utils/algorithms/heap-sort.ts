/**
 * src/utils/algorithms/heap-sort.ts
 *
 * ヒープソートアルゴリズムの実装
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
 * ヒープソートアルゴリズムクラス
 *
 * ヒープデータ構造を使用したインプレースソートアルゴリズム
 * 時間計算量: O(n log n)（全てのケース）
 * 空間計算量: O(1)（インプレース）
 */
export class HeapSortAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "heap-sort",
		name: "ヒープソート",
		description:
			"ヒープデータ構造を利用したインプレースソートアルゴリズム。配列をヒープに変換後、最大値を順次取り出してソートします",
		category: "sort",
		timeComplexity: {
			best: "O(n log n)", // 最良の場合：常に一定
			average: "O(n log n)", // 平均的な場合：常に一定
			worst: "O(n log n)", // 最悪の場合：常に一定
		},
		difficulty: 3, // 中級〜上級
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private comparisonCount = 0;
	private swapCount = 0;
	private heapifyCount = 0;

	/**
	 * ヒープソートを実行
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

		// 初期化
		const sortedArray = [...array];
		this.steps = [];
		this.stepId = 0;
		this.comparisonCount = 0;
		this.swapCount = 0;
		this.heapifyCount = 0;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description:
				"ヒープソート開始：配列をヒープ構造に変換後、順次最大値を取り出します",
			array: [...sortedArray],
			operation: "初期化",
			variables: {
				length: sortedArray.length,
				comparisonCount: this.comparisonCount,
				swapCount: this.swapCount,
				phase: "初期化",
			},
		});

		// フェーズ1: ヒープの構築
		this.buildMaxHeap(sortedArray);

		// フェーズ2: ソート実行
		this.performHeapSort(sortedArray);

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description:
				"🎉 ヒープソート完了！O(n log n)性能保証とインプレース特性を実現",
			array: [...sortedArray],
			operation: "完了",
			variables: {
				result: sortedArray,
				totalComparisons: this.comparisonCount,
				totalSwaps: this.swapCount,
				totalHeapify: this.heapifyCount,
				totalSteps: this.steps.length,
				efficiency: `${this.comparisonCount}回の比較、${this.swapCount}回の交換、${this.heapifyCount}回のヒープ化`,
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
	 * 最大ヒープを構築
	 * @param array 対象配列
	 */
	private buildMaxHeap(array: number[]): void {
		const n = array.length;

		this.steps.push({
			id: this.stepId++,
			description: "🏗️ フェーズ1: 最大ヒープ構築開始",
			array: [...array],
			operation: "ヒープ構築開始",
			variables: {
				arrayLength: n,
				lastNonLeaf: Math.floor(n / 2) - 1,
				explanation: "最後の非葉ノードから順次ヒープ化を実行",
			},
		});

		// 最後の非葉ノードから開始して、ルートまで逆順にヒープ化
		for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
			this.steps.push({
				id: this.stepId++,
				description: `ノード ${i} (値: ${array[i]}) をヒープ化`,
				array: [...array],
				highlightedElements: [i],
				operation: "ノードヒープ化",
				variables: {
					currentNode: i,
					nodeValue: array[i],
					leftChild: 2 * i + 1 < n ? array[2 * i + 1] : "なし",
					rightChild: 2 * i + 2 < n ? array[2 * i + 2] : "なし",
				},
			});

			this.heapify(array, n, i);
		}

		this.steps.push({
			id: this.stepId++,
			description: "✅ 最大ヒープ構築完了！ルートに最大値が配置されました",
			array: [...array],
			highlightedElements: [0],
			operation: "ヒープ構築完了",
			variables: {
				maxValue: array[0],
				heapProperty: "親ノード ≥ 子ノード が全体で成立",
				nextPhase: "ソート実行",
			},
		});
	}

	/**
	 * ヒープソートの実行
	 * @param array 対象配列
	 */
	private performHeapSort(array: number[]): void {
		const n = array.length;

		this.steps.push({
			id: this.stepId++,
			description: "📊 フェーズ2: ソート実行開始",
			array: [...array],
			operation: "ソート開始",
			variables: {
				strategy: "ルート（最大値）を末尾と交換後、ヒープサイズを縮小",
				iterations: n - 1,
			},
		});

		// 最大値（ルート）を末尾と交換し、ヒープサイズを縮小
		for (let i = n - 1; i > 0; i--) {
			// ルート（最大値）を現在の末尾位置と交換
			this.steps.push({
				id: this.stepId++,
				description: `最大値 ${array[0]} を位置 ${i} と交換（ソート済み領域に移動）`,
				array: [...array],
				highlightedElements: [0, i],
				operation: "最大値交換",
				variables: {
					maxValue: array[0],
					targetPosition: i,
					sortedElements: n - i,
					heapSize: i,
				},
			});

			// 交換実行
			this.swap(array, 0, i);

			this.steps.push({
				id: this.stepId++,
				description: `交換完了。ソート済み: [${array.slice(i).join(", ")}], ヒープサイズ: ${i}`,
				array: [...array],
				searchRange: { start: 0, end: i - 1 },
				highlightedElements: array.slice(i).map((_, idx) => i + idx),
				operation: "交換完了",
				variables: {
					sortedRange: `[${i}, ${n - 1}]`,
					heapRange: `[0, ${i - 1}]`,
					remainingElements: i,
				},
			});

			// 新しいルートをヒープ化してヒープ性質を復元
			if (i > 1) {
				this.steps.push({
					id: this.stepId++,
					description: `新しいルート ${array[0]} をヒープ化してヒープ性質を復元`,
					array: [...array],
					highlightedElements: [0],
					operation: "ルートヒープ化",
					variables: {
						newRoot: array[0],
						heapSize: i,
						goal: "最大ヒープ性質の復元",
					},
				});

				this.heapify(array, i, 0);
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: "🎊 ソート完了！全要素が昇順に並びました",
			array: [...array],
			operation: "ソート完了",
			variables: {
				finalResult: array,
				sortedCount: array.length,
				inPlace: "追加メモリを使わずにソート完了",
			},
		});
	}

	/**
	 * ヒープ化操作（下向き）
	 * @param array 対象配列
	 * @param heapSize ヒープサイズ
	 * @param rootIndex ルートインデックス
	 */
	private heapify(array: number[], heapSize: number, rootIndex: number): void {
		let largest = rootIndex;
		const leftChild = 2 * rootIndex + 1;
		const rightChild = 2 * rootIndex + 2;

		this.heapifyCount++;

		// 左の子と比較
		if (leftChild < heapSize) {
			this.comparisonCount++;
			this.steps.push({
				id: this.stepId++,
				description: `左の子 ${array[leftChild]} と親 ${array[largest]} を比較`,
				array: [...array],
				highlightedElements: [largest, leftChild],
				operation: "左子比較",
				variables: {
					parent: array[largest],
					leftChild: array[leftChild],
					comparison: `${array[leftChild]} ${array[leftChild] > array[largest] ? ">" : "≤"} ${array[largest]}`,
					parentIndex: largest,
					leftIndex: leftChild,
				},
			});

			if (array[leftChild] > array[largest]) {
				largest = leftChild;
			}
		}

		// 右の子と比較
		if (rightChild < heapSize) {
			this.comparisonCount++;
			this.steps.push({
				id: this.stepId++,
				description: `右の子 ${array[rightChild]} と現在の最大 ${array[largest]} を比較`,
				array: [...array],
				highlightedElements: [largest, rightChild],
				operation: "右子比較",
				variables: {
					currentLargest: array[largest],
					rightChild: array[rightChild],
					comparison: `${array[rightChild]} ${array[rightChild] > array[largest] ? ">" : "≤"} ${array[largest]}`,
					largestIndex: largest,
					rightIndex: rightChild,
				},
			});

			if (array[rightChild] > array[largest]) {
				largest = rightChild;
			}
		}

		// 最大値が根でない場合、交換して再帰的にヒープ化
		if (largest !== rootIndex) {
			this.steps.push({
				id: this.stepId++,
				description: `ヒープ条件違反検出：${array[rootIndex]} < ${array[largest]}。交換が必要`,
				array: [...array],
				highlightedElements: [rootIndex, largest],
				operation: "条件違反検出",
				variables: {
					violatingParent: array[rootIndex],
					largerChild: array[largest],
					parentIndex: rootIndex,
					childIndex: largest,
					action: "交換後に下位をヒープ化",
				},
			});

			this.swap(array, rootIndex, largest);

			this.steps.push({
				id: this.stepId++,
				description: `交換完了：${array[largest]} ↔ ${array[rootIndex]}。下位ノード ${largest} を再帰的にヒープ化`,
				array: [...array],
				highlightedElements: [largest],
				operation: "交換後継続",
				variables: {
					swappedValues: `${array[largest]} ↔ ${array[rootIndex]}`,
					nextTarget: largest,
					reason: "交換により下位でヒープ条件が崩れた可能性",
				},
			});

			// 交換により影響を受けた下位ノードを再帰的にヒープ化
			this.heapify(array, heapSize, largest);
		} else {
			this.steps.push({
				id: this.stepId++,
				description: `ヒープ条件確認完了：ノード ${rootIndex} (値: ${array[rootIndex]}) は正しい位置にあります`,
				array: [...array],
				highlightedElements: [rootIndex],
				operation: "ヒープ化完了",
				variables: {
					nodeValue: array[rootIndex],
					nodeIndex: rootIndex,
					status: "ヒープ条件満足",
					result: "このサブツリーのヒープ化完了",
				},
			});
		}
	}

	/**
	 * 配列要素を交換
	 * @param array 対象配列
	 * @param i インデックス1
	 * @param j インデックス2
	 */
	private swap(array: number[], i: number, j: number): void {
		this.swapCount++;
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
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
ヒープソートは、ヒープデータ構造を利用したインプレースソートアルゴリズムです。

🎯 **基本原理**
1. 配列を最大ヒープに変換（ヒープ構築フェーズ）
2. ルート（最大値）を末尾と交換
3. ヒープサイズを1減らし、ルートをヒープ化
4. ヒープサイズが1になるまで繰り返し

📈 **特徴**
- 常にO(n log n)の時間計算量を保証
- インプレース（O(1)空間計算量）
- 不安定ソート（同じ値の順序が保たれない場合あり）
- 性能が予測可能

🎯 **実用性**
- リアルタイムシステム（性能保証重要）
- 組み込みシステム（メモリ制限環境）
- 優先度付きキューの実装
- アルゴリズム競技（安全な選択）

💡 **他のソートとの比較**
- vs クイックソート：性能保証 vs 平均速度
- vs マージソート：メモリ効率 vs 安定性
- vs 選択ソート：効率性 vs シンプルさ

🔍 **ヒープデータ構造**
- 完全二分木の配列表現
- 親ノード ≥ 子ノード（最大ヒープ）
- 効率的なインデックス計算
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
	 * ヒープ特性テスト用の配列を生成
	 * @param size 配列のサイズ
	 * @returns ヒープ特性テスト用配列
	 */
	static generateHeapTestArray(size: number): number[] {
		const array: number[] = [];

		// 最初に小さい値を配置して、ヒープ化の効果を可視化
		for (let i = 0; i < size; i++) {
			array.push(i + 1);
		}

		// シャッフルして、ヒープ構築の効果を明確にする
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}

		return array;
	}

	/**
	 * 部分的にヒープ化された配列を生成
	 * @param size 配列のサイズ
	 * @returns 部分的にヒープ化された配列
	 */
	static generatePartialHeapArray(size: number): number[] {
		const array: number[] = [];

		// 大きい値を前半に配置
		for (let i = size; i > Math.floor(size / 2); i--) {
			array.push(i);
		}

		// 小さい値を後半に配置
		for (let i = 1; i <= Math.floor(size / 2); i++) {
			array.push(i);
		}

		return array;
	}
}
