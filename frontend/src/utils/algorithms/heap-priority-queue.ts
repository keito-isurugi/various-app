/**
 * src/utils/algorithms/heap-priority-queue.ts
 *
 * ヒープ（優先度付きキュー）データ構造の実装
 * 効率的な最大値/最小値の取り出しと優先度管理を実現する完全二分木構造
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * ヒープ操作の種類
 */
type HeapOperationType =
	| "insert" // 要素の挿入
	| "extractMax" // 最大値の取り出し（最大ヒープ）
	| "extractMin" // 最小値の取り出し（最小ヒープ）
	| "peek" // 最大/最小値の確認
	| "buildHeap" // ヒープの構築
	| "heapify" // ヒープ性の修復
	| "changePriority" // 優先度の変更
	| "remove"; // 任意要素の削除

/**
 * ヒープの種類
 */
type HeapType = "max" | "min";

/**
 * ヒープノードの状態を表す型
 */
interface HeapNode {
	value: number; // ノードの値
	index: number; // 配列内のインデックス
	parent?: number; // 親ノードのインデックス
	left?: number; // 左子ノードのインデックス
	right?: number; // 右子ノードのインデックス
}

/**
 * ヒープ（優先度付きキュー）データ構造クラス
 *
 * 完全二分木を配列で実装し、ヒープ性質を維持することで
 * O(log n)での優先度付き要素の挿入・削除を実現
 * 時間計算量: 挿入・削除 O(log n)、構築 O(n)、最大/最小値取得 O(1)
 * 空間計算量: O(n)
 */
export class HeapPriorityQueueAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "heap-priority-queue",
		name: "ヒープ（優先度付きキュー）",
		description:
			"完全二分木を用いた効率的な優先度管理。最大/最小値の高速取得と動的な優先度更新を実現",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // peek操作
			average: "O(log n)", // 挿入・削除操作
			worst: "O(n)", // ヒープ構築
		},
		difficulty: 3, // 中級（ヒープ性質の理解が必要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private heap: number[] = [];
	private heapType: HeapType = "max";

	/**
	 * ヒープ操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as HeapOperationType;
		const value = input.parameters?.value as number | undefined;
		const values = input.parameters?.values as number[] | undefined;
		const heapType = (input.parameters?.heapType as HeapType) || "max";
		const initialHeap = input.parameters?.heap as number[] | undefined;
		const index = input.parameters?.index as number | undefined;

		// ヒープタイプの設定
		this.heapType = heapType;

		// 初期ヒープの設定
		if (initialHeap) {
			this.heap = [...initialHeap];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `ヒープ操作開始：${this.heapType === "max" ? "最大ヒープ" : "最小ヒープ"}で${this.getOperationDescription(operation)}を実行`,
			array: [...this.heap],
			operation: "初期化",
			variables: {
				heapType: this.heapType,
				operation: operation,
				currentSize: this.heap.length,
				heapProperty:
					this.heapType === "max"
						? "親 ≥ 子（最大ヒープ）"
						: "親 ≤ 子（最小ヒープ）",
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "insert":
				if (value !== undefined) {
					result = this.performInsert(value);
				} else {
					throw new Error("挿入操作には値が必要です");
				}
				break;

			case "extractMax":
			case "extractMin":
				result = this.performExtract();
				break;

			case "peek":
				result = this.performPeek();
				break;

			case "buildHeap":
				if (values) {
					result = this.performBuildHeap(values);
				} else {
					throw new Error("ヒープ構築には配列が必要です");
				}
				break;

			case "heapify":
				if (index !== undefined) {
					result = this.performHeapify(index);
				} else {
					result = this.performHeapify(0);
				}
				break;

			case "changePriority":
				if (index !== undefined && value !== undefined) {
					result = this.performChangePriority(index, value);
				} else {
					throw new Error("優先度変更にはインデックスと新しい値が必要です");
				}
				break;

			case "remove":
				if (index !== undefined) {
					result = this.performRemove(index);
				} else {
					throw new Error("削除操作にはインデックスが必要です");
				}
				break;

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` ヒープ操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
			array: [...this.heap],
			operation: "完了",
			variables: {
				result: result,
				finalSize: this.heap.length,
				heapValid: this.isValidHeap() ? "有効" : "無効",
				treeHeight: Math.floor(Math.log2(this.heap.length)) + 1,
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.getOperationComplexity(operation),
			summary: {
				operation: operation,
				heapType: this.heapType,
				initialSize: initialHeap?.length || 0,
				finalSize: this.heap.length,
				operationResult: result,
				totalSteps: this.steps.length,
			},
		};
	}

	/**
	 * 要素の挿入
	 */
	private performInsert(value: number): string {
		this.steps.push({
			id: this.stepId++,
			description: `挿入操作：値 ${value} をヒープに追加`,
			array: [...this.heap],
			operation: "挿入準備",
			variables: {
				insertValue: value,
				insertPosition: this.heap.length,
				currentSize: this.heap.length,
			},
		});

		// 配列の末尾に追加
		this.heap.push(value);
		const currentIndex = this.heap.length - 1;

		this.steps.push({
			id: this.stepId++,
			description: `値 ${value} を配列の末尾（インデックス ${currentIndex}）に追加`,
			array: [...this.heap],
			highlight: [currentIndex],
			operation: "末尾追加",
			variables: {
				newIndex: currentIndex,
				parentIndex: this.getParentIndex(currentIndex),
			},
		});

		// 上方向へのヒープ化（bubble up）
		this.bubbleUp(currentIndex);

		return `値 ${value} が挿入されました`;
	}

	/**
	 * 最大/最小値の取り出し
	 */
	private performExtract(): number | null {
		if (this.heap.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "エラー：ヒープが空です",
				array: [],
				operation: "エラー",
			});
			return null;
		}

		const extractValue = this.heap[0];

		this.steps.push({
			id: this.stepId++,
			description: `${this.heapType === "max" ? "最大値" : "最小値"} ${extractValue} を取り出し`,
			array: [...this.heap],
			highlight: [0],
			operation: "取り出し準備",
			variables: {
				extractValue: extractValue,
				lastValue: this.heap[this.heap.length - 1],
			},
		});

		// 最後の要素を先頭に移動
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();

		if (this.heap.length > 0) {
			this.steps.push({
				id: this.stepId++,
				description: "最後の要素を先頭に移動して、配列サイズを縮小",
				array: [...this.heap],
				highlight: [0],
				operation: "要素移動",
			});

			// 下方向へのヒープ化（bubble down）
			this.bubbleDown(0);
		}

		return extractValue;
	}

	/**
	 * 最大/最小値の確認（削除なし）
	 */
	private performPeek(): number | null {
		if (this.heap.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "ヒープが空です",
				array: [],
				operation: "エラー",
			});
			return null;
		}

		const peekValue = this.heap[0];

		this.steps.push({
			id: this.stepId++,
			description: `${this.heapType === "max" ? "最大値" : "最小値"} ${peekValue} を確認（削除なし）`,
			array: [...this.heap],
			highlight: [0],
			operation: "確認",
			variables: {
				peekValue: peekValue,
				heapSize: this.heap.length,
			},
		});

		return peekValue;
	}

	/**
	 * 配列からヒープを構築
	 */
	private performBuildHeap(values: number[]): string {
		this.heap = [...values];

		this.steps.push({
			id: this.stepId++,
			description: `配列 [${values.join(", ")}] からヒープを構築`,
			array: [...this.heap],
			operation: "構築開始",
			variables: {
				arraySize: values.length,
				lastNonLeaf: Math.floor(values.length / 2) - 1,
				buildMethod: "ボトムアップ方式",
			},
		});

		// 最後の非葉ノードから順にヒープ化
		for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
			this.steps.push({
				id: this.stepId++,
				description: `インデックス ${i} の要素 ${this.heap[i]} からヒープ化開始`,
				array: [...this.heap],
				highlight: [i],
				operation: "ヒープ化",
			});

			this.bubbleDown(i);
		}

		return "ヒープ構築が完了しました";
	}

	/**
	 * 指定位置からのヒープ化
	 */
	private performHeapify(index: number): string {
		if (index < 0 || index >= this.heap.length) {
			throw new Error("無効なインデックスです");
		}

		this.steps.push({
			id: this.stepId++,
			description: `インデックス ${index} の要素 ${this.heap[index]} からヒープ化`,
			array: [...this.heap],
			highlight: [index],
			operation: "ヒープ化開始",
		});

		this.bubbleDown(index);

		return `インデックス ${index} からのヒープ化が完了しました`;
	}

	/**
	 * 優先度の変更
	 */
	private performChangePriority(index: number, newValue: number): string {
		if (index < 0 || index >= this.heap.length) {
			throw new Error("無効なインデックスです");
		}

		const oldValue = this.heap[index];

		this.steps.push({
			id: this.stepId++,
			description: `インデックス ${index} の値を ${oldValue} から ${newValue} に変更`,
			array: [...this.heap],
			highlight: [index],
			operation: "優先度変更",
			variables: {
				oldValue: oldValue,
				newValue: newValue,
				change: newValue - oldValue,
			},
		});

		this.heap[index] = newValue;

		// 値が増加した場合は上方向、減少した場合は下方向にヒープ化
		if (
			(this.heapType === "max" && newValue > oldValue) ||
			(this.heapType === "min" && newValue < oldValue)
		) {
			this.bubbleUp(index);
		} else {
			this.bubbleDown(index);
		}

		return `優先度が ${oldValue} から ${newValue} に変更されました`;
	}

	/**
	 * 任意位置の要素削除
	 */
	private performRemove(index: number): number {
		if (index < 0 || index >= this.heap.length) {
			throw new Error("無効なインデックスです");
		}

		const removeValue = this.heap[index];

		this.steps.push({
			id: this.stepId++,
			description: `インデックス ${index} の要素 ${removeValue} を削除`,
			array: [...this.heap],
			highlight: [index],
			operation: "削除準備",
		});

		// 最後の要素と交換して削除
		this.heap[index] = this.heap[this.heap.length - 1];
		this.heap.pop();

		if (index < this.heap.length) {
			// 必要に応じて上下方向にヒープ化
			const parentIndex = this.getParentIndex(index);
			if (parentIndex >= 0 && this.shouldSwap(index, parentIndex)) {
				this.bubbleUp(index);
			} else {
				this.bubbleDown(index);
			}
		}

		return removeValue;
	}

	/**
	 * 上方向へのヒープ化（bubble up）
	 */
	private bubbleUp(index: number): void {
		let currentIndex = index;

		while (currentIndex > 0) {
			const parentIndex = this.getParentIndex(currentIndex);

			if (this.shouldSwap(currentIndex, parentIndex)) {
				this.steps.push({
					id: this.stepId++,
					description: `要素 ${this.heap[currentIndex]} を親 ${this.heap[parentIndex]} と交換`,
					array: [...this.heap],
					highlight: [currentIndex, parentIndex],
					operation: "上方交換",
					variables: {
						childValue: this.heap[currentIndex],
						parentValue: this.heap[parentIndex],
						childIndex: currentIndex,
						parentIndex: parentIndex,
					},
				});

				// 交換
				[this.heap[currentIndex], this.heap[parentIndex]] = [
					this.heap[parentIndex],
					this.heap[currentIndex],
				];

				currentIndex = parentIndex;
			} else {
				break;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: "上方向のヒープ化完了",
			array: [...this.heap],
			highlight: [currentIndex],
			operation: "bubble up完了",
		});
	}

	/**
	 * 下方向へのヒープ化（bubble down）
	 */
	private bubbleDown(index: number): void {
		let currentIndex = index;

		while (true) {
			const leftIndex = this.getLeftChildIndex(currentIndex);
			const rightIndex = this.getRightChildIndex(currentIndex);
			let targetIndex = currentIndex;

			// 左子との比較
			if (
				leftIndex < this.heap.length &&
				this.shouldSwap(leftIndex, targetIndex)
			) {
				targetIndex = leftIndex;
			}

			// 右子との比較
			if (
				rightIndex < this.heap.length &&
				this.shouldSwap(rightIndex, targetIndex)
			) {
				targetIndex = rightIndex;
			}

			if (targetIndex !== currentIndex) {
				this.steps.push({
					id: this.stepId++,
					description: `要素 ${this.heap[currentIndex]} を子 ${this.heap[targetIndex]} と交換`,
					array: [...this.heap],
					highlight: [currentIndex, targetIndex],
					operation: "下方交換",
					variables: {
						parentValue: this.heap[currentIndex],
						childValue: this.heap[targetIndex],
						parentIndex: currentIndex,
						childIndex: targetIndex,
					},
				});

				// 交換
				[this.heap[currentIndex], this.heap[targetIndex]] = [
					this.heap[targetIndex],
					this.heap[currentIndex],
				];

				currentIndex = targetIndex;
			} else {
				break;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: "下方向のヒープ化完了",
			array: [...this.heap],
			highlight: [currentIndex],
			operation: "bubble down完了",
		});
	}

	/**
	 * 親ノードのインデックスを取得
	 */
	private getParentIndex(index: number): number {
		return Math.floor((index - 1) / 2);
	}

	/**
	 * 左子ノードのインデックスを取得
	 */
	private getLeftChildIndex(index: number): number {
		return 2 * index + 1;
	}

	/**
	 * 右子ノードのインデックスを取得
	 */
	private getRightChildIndex(index: number): number {
		return 2 * index + 2;
	}

	/**
	 * 交換が必要かどうかを判定
	 */
	private shouldSwap(childIndex: number, parentIndex: number): boolean {
		if (this.heapType === "max") {
			return this.heap[childIndex] > this.heap[parentIndex];
		}
		return this.heap[childIndex] < this.heap[parentIndex];
	}

	/**
	 * ヒープが有効かどうかを検証
	 */
	private isValidHeap(): boolean {
		for (let i = 0; i < Math.floor(this.heap.length / 2); i++) {
			const leftIndex = this.getLeftChildIndex(i);
			const rightIndex = this.getRightChildIndex(i);

			if (leftIndex < this.heap.length && this.shouldSwap(leftIndex, i)) {
				return false;
			}

			if (rightIndex < this.heap.length && this.shouldSwap(rightIndex, i)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(operation: HeapOperationType): string {
		const descriptions = {
			insert: "要素の挿入",
			extractMax: "最大値の取り出し",
			extractMin: "最小値の取り出し",
			peek: "最大/最小値の確認",
			buildHeap: "ヒープの構築",
			heapify: "ヒープ性の修復",
			changePriority: "優先度の変更",
			remove: "要素の削除",
		};
		return descriptions[operation] || "操作";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(operation: HeapOperationType): string {
		const complexities = {
			insert: "O(log n)",
			extractMax: "O(log n)",
			extractMin: "O(log n)",
			peek: "O(1)",
			buildHeap: "O(n)",
			heapify: "O(log n)",
			changePriority: "O(log n)",
			remove: "O(log n)",
		};
		return complexities[operation] || "O(log n)";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "insert",
				value: 10,
				heapType: "max",
				heap: [20, 15, 8, 10, 5, 7, 6],
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
ヒープ（Heap）は、完全二分木の形をした特殊なデータ構造で、優先度付きキュー（Priority Queue）の効率的な実装として広く使用されています。各ノードが特定の順序関係（ヒープ性質）を満たすことで、最大値や最小値への高速アクセスを実現します。

 **ヒープの特徴**
- 完全二分木構造（最下段以外は完全に埋まっている）
- 配列による効率的な実装が可能
- 親子関係：親のインデックスi → 左子2i+1、右子2i+2
- ヒープ性質：最大ヒープでは親≥子、最小ヒープでは親≤子

【解析】**主要な操作と計算量**
- 挿入（Insert）: O(log n) - 末尾に追加してbubble up
- 削除（Extract）: O(log n) - 根を削除してbubble down
- 最大/最小値取得（Peek）: O(1) - 根の要素を参照
- ヒープ構築（Build）: O(n) - ボトムアップ方式

 **ヒープ化の手法**
- Bubble Up: 子から親への上方向の調整
- Bubble Down: 親から子への下方向の調整
- 各操作で部分的にヒープ性質を修復

【ヒント】**実装のポイント**
- 配列インデックス0から開始
- 親子関係の計算式を正確に実装
- 境界条件の適切な処理
- ヒープタイプ（最大/最小）による比較の切り替え

 **実用的な応用**
- タスクスケジューリング（優先度付きタスク管理）
- ダイクストラ法などのグラフアルゴリズム
- ハフマン符号化（データ圧縮）
- イベント駆動シミュレーション
- K番目に大きい要素の検索

【計算量】**パフォーマンス特性**
- 挿入・削除がO(log n)で安定
- ソート済み配列と比較して挿入が高速
- 部分的な順序のみ保証（完全なソートは不要）
- メモリ効率が良い（配列実装）

【詳細】**他のデータ構造との比較**
- vs 配列: 優先度付き操作が高速
- vs 平衡二分探索木: 実装が簡単、定数倍が小さい
- vs リンクリスト: ランダムアクセスと優先度管理が可能

ヒープは、優先度管理が必要な多くのアプリケーションで基盤となるデータ構造です。シンプルな実装でありながら、理論的にも実用的にも優れた性能を発揮します。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: HeapOperationType;
		value?: number;
		values?: number[];
		index?: number;
		heapType: HeapType;
		heap?: number[];
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "buildHeap",
				values: [3, 7, 1, 4, 6, 2, 5],
				heapType: "max",
				description: "配列から最大ヒープを構築",
				expectedResult: "ヒープ構築完了",
			},
			{
				operation: "insert",
				value: 10,
				heapType: "max",
				heap: [20, 15, 8, 10, 5, 7, 6],
				description: "最大ヒープに10を挿入",
				expectedResult: "値10が挿入されました",
			},
			{
				operation: "extractMax",
				heapType: "max",
				heap: [20, 15, 8, 10, 5, 7, 6],
				description: "最大値を取り出し",
				expectedResult: 20,
			},
			{
				operation: "insert",
				value: 1,
				heapType: "min",
				heap: [2, 4, 3, 8, 5, 7, 6],
				description: "最小ヒープに1を挿入",
				expectedResult: "値1が挿入されました",
			},
			{
				operation: "extractMin",
				heapType: "min",
				heap: [1, 2, 3, 8, 5, 7, 6, 4],
				description: "最小値を取り出し",
				expectedResult: 1,
			},
			{
				operation: "changePriority",
				index: 3,
				value: 25,
				heapType: "max",
				heap: [20, 15, 8, 10, 5, 7, 6],
				description: "インデックス3の優先度を25に変更",
				expectedResult: "優先度が10から25に変更されました",
			},
			{
				operation: "remove",
				index: 2,
				heapType: "max",
				heap: [20, 15, 8, 10, 5, 7, 6],
				description: "インデックス2の要素を削除",
				expectedResult: 8,
			},
		];
	}
}
