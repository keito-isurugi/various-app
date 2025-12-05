/**
 * src/utils/algorithms/queue-basic.ts
 *
 * キュー（Queue）データ構造の基本操作実装
 * FIFO（First In, First Out）の動作原理をステップバイステップで可視化
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * キューの操作種別
 */
type QueueOperation =
	| "enqueue"
	| "dequeue"
	| "front"
	| "rear"
	| "isEmpty"
	| "size";

/**
 * キューの基本操作アルゴリズムクラス
 *
 * FIFO（First In, First Out）原理に基づくデータ構造
 * 時間計算量: O(1)（すべての基本操作）
 * 空間計算量: O(n)（n個の要素を格納）
 */
export class QueueBasicAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "queue-basic",
		name: "キュー（基本操作）",
		description:
			"FIFO（First In, First Out）原理に基づくキューデータ構造の基本操作。enqueue、dequeue等の動作を可視化",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // すべての基本操作
			average: "O(1)",
			worst: "O(1)",
		},
		difficulty: 1, // 初級（基本的なデータ構造）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private queue: number[] = [];

	/**
	 * キューの基本操作を実行
	 * @param input 実行する操作と値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証
		const operation = input.parameters?.operation as QueueOperation;
		const value = input.parameters?.value as number;

		if (!operation) {
			throw new Error("実行する操作が指定されていません");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 既存のキュー状態を復元（もしあれば）
		if (input.array && input.array.length > 0) {
			this.queue = [...input.array];
		} else {
			this.queue = [];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `キュー操作実行：${this.getOperationDescription(operation, value)}`,
			array: [...this.queue],
			operation: "初期化",
			variables: {
				operation: operation,
				queueSize: this.queue.length,
				principle: "FIFO (First In, First Out)",
				currentQueue: `[${this.queue.join(", ")}]`,
				front: this.queue.length > 0 ? this.queue[0] : "なし",
				rear:
					this.queue.length > 0 ? this.queue[this.queue.length - 1] : "なし",
			},
		});

		// 操作を実行
		let result: any;
		switch (operation) {
			case "enqueue":
				result = this.executeEnqueue(value);
				break;
			case "dequeue":
				result = this.executeDequeue();
				break;
			case "front":
				result = this.executeFront();
				break;
			case "rear":
				result = this.executeRear();
				break;
			case "isEmpty":
				result = this.executeIsEmpty();
				break;
			case "size":
				result = this.executeSize();
				break;
			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 操作完了！結果: ${result}`,
			array: [...this.queue],
			operation: "完了",
			variables: {
				result: result,
				finalQueueSize: this.queue.length,
				finalQueue: `[${this.queue.join(", ")}]`,
				finalFront: this.queue.length > 0 ? this.queue[0] : "なし",
				finalRear:
					this.queue.length > 0 ? this.queue[this.queue.length - 1] : "なし",
				operationCompleted: operation,
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
		};
	}

	/**
	 * enqueue操作の実行
	 */
	private executeEnqueue(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("enqueue操作には値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `enqueue(${value}): 値${value}をキューの末尾に追加`,
			array: [...this.queue],
			operation: "enqueue準備",
			variables: {
				enqueueValue: value,
				currentFront: this.queue.length > 0 ? this.queue[0] : "なし",
				currentRear:
					this.queue.length > 0 ? this.queue[this.queue.length - 1] : "なし",
				beforeSize: this.queue.length,
			},
		});

		// キューに値を追加
		this.queue.push(value);

		this.steps.push({
			id: this.stepId++,
			description: `enqueue完了: ${value}が末尾に追加されました`,
			array: [...this.queue],
			operation: "enqueue完了",
			variables: {
				enqueuedValue: value,
				newRear: value,
				frontElement: this.queue[0],
				afterSize: this.queue.length,
				sizeChange: `${this.queue.length - 1} → ${this.queue.length}`,
			},
		});

		return `値 ${value} が追加されました（サイズ: ${this.queue.length}）`;
	}

	/**
	 * dequeue操作の実行
	 */
	private executeDequeue(): string {
		if (this.queue.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "dequeue失敗: キューが空です",
				array: [...this.queue],
				operation: "dequeue失敗",
				variables: {
					error: "キューが空のためdequeueできません",
					queueSize: 0,
				},
			});
			throw new Error("キューが空のためdequeueできません");
		}

		const frontValue = this.queue[0];

		this.steps.push({
			id: this.stepId++,
			description: `dequeue(): キューの先頭要素${frontValue}を取り出し`,
			array: [...this.queue],
			operation: "dequeue準備",
			variables: {
				frontValue: frontValue,
				beforeSize: this.queue.length,
				rearElement:
					this.queue.length > 1 ? this.queue[this.queue.length - 1] : "なし",
				position: "先頭（最初に追加された要素）",
			},
		});

		// キューから値を削除
		const dequeuedValue = this.queue.shift();
		if (dequeuedValue === undefined) {
			throw new Error("予期しないエラー: dequeueでundefinedが返されました");
		}

		this.steps.push({
			id: this.stepId++,
			description: `dequeue完了: ${dequeuedValue}が取り出されました`,
			array: [...this.queue],
			operation: "dequeue完了",
			variables: {
				dequeuedValue: dequeuedValue,
				newFront: this.queue.length > 0 ? this.queue[0] : "なし",
				afterSize: this.queue.length,
				sizeChange: `${this.queue.length + 1} → ${this.queue.length}`,
			},
		});

		return `値 ${dequeuedValue} が取り出されました（サイズ: ${this.queue.length}）`;
	}

	/**
	 * front操作の実行
	 */
	private executeFront(): string {
		if (this.queue.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "front(): キューが空のため、先頭要素はありません",
				array: [...this.queue],
				operation: "front（空）",
				variables: {
					result: "なし",
					queueSize: 0,
					note: "空のキューには先頭要素が存在しません",
				},
			});
			return "キューが空です";
		}

		const frontValue = this.queue[0];

		this.steps.push({
			id: this.stepId++,
			description: `front(): キューの先頭要素は${frontValue}です（削除せず確認のみ）`,
			array: [...this.queue],
			operation: "front",
			variables: {
				frontValue: frontValue,
				queueSize: this.queue.length,
				rearValue: this.queue[this.queue.length - 1],
				note: "frontは要素を削除せずに値のみ確認します",
			},
		});

		return `先頭要素: ${frontValue}`;
	}

	/**
	 * rear操作の実行
	 */
	private executeRear(): string {
		if (this.queue.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "rear(): キューが空のため、末尾要素はありません",
				array: [...this.queue],
				operation: "rear（空）",
				variables: {
					result: "なし",
					queueSize: 0,
					note: "空のキューには末尾要素が存在しません",
				},
			});
			return "キューが空です";
		}

		const rearValue = this.queue[this.queue.length - 1];

		this.steps.push({
			id: this.stepId++,
			description: `rear(): キューの末尾要素は${rearValue}です（削除せず確認のみ）`,
			array: [...this.queue],
			operation: "rear",
			variables: {
				rearValue: rearValue,
				queueSize: this.queue.length,
				frontValue: this.queue[0],
				note: "rearは要素を削除せずに値のみ確認します",
			},
		});

		return `末尾要素: ${rearValue}`;
	}

	/**
	 * isEmpty操作の実行
	 */
	private executeIsEmpty(): boolean {
		const isEmpty = this.queue.length === 0;

		this.steps.push({
			id: this.stepId++,
			description: `isEmpty(): キューが空かどうかを確認 → ${isEmpty ? "空" : "空でない"}`,
			array: [...this.queue],
			operation: "isEmpty",
			variables: {
				isEmpty: isEmpty,
				queueSize: this.queue.length,
				result: isEmpty ? "true（空）" : "false（要素あり）",
			},
		});

		return isEmpty;
	}

	/**
	 * size操作の実行
	 */
	private executeSize(): number {
		const size = this.queue.length;

		this.steps.push({
			id: this.stepId++,
			description: `size(): キューのサイズを確認 → ${size}個の要素`,
			array: [...this.queue],
			operation: "size",
			variables: {
				size: size,
				elements: this.queue.length > 0 ? `[${this.queue.join(", ")}]` : "空",
				frontElement: this.queue.length > 0 ? this.queue[0] : "なし",
				rearElement:
					this.queue.length > 0 ? this.queue[this.queue.length - 1] : "なし",
			},
		});

		return size;
	}

	/**
	 * 操作の説明文を取得
	 */
	private getOperationDescription(
		operation: QueueOperation,
		value?: number,
	): string {
		switch (operation) {
			case "enqueue":
				return `enqueue(${value}) - 値を末尾に追加`;
			case "dequeue":
				return "dequeue() - 先頭要素を取り出し";
			case "front":
				return "front() - 先頭要素を確認（削除なし）";
			case "rear":
				return "rear() - 末尾要素を確認（削除なし）";
			case "isEmpty":
				return "isEmpty() - 空かどうかを確認";
			case "size":
				return "size() - 要素数を確認";
			default:
				return operation;
		}
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [1, 2, 3],
			parameters: { operation: "enqueue", value: 4 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
キュー（Queue）は、FIFO（First In, First Out）原理に基づくデータ構造です。

【構造】**基本概念**
- 最初に入れた要素が最初に取り出される
- 列に並ぶイメージ（待ち行列）
- 一方の端から追加、もう一方の端から取り出し

【基礎】**基本操作**
- enqueue(value): 要素を末尾に追加 - O(1)
- dequeue(): 先頭要素を取り出し - O(1)
- front(): 先頭要素を確認（削除なし） - O(1)
- rear(): 末尾要素を確認（削除なし） - O(1)
- isEmpty(): 空かどうかを確認 - O(1)
- size(): 要素数を取得 - O(1)

【ポイント】**実世界での応用**
- プロセス管理のタスクキュー
- ネットワークのデータパケット処理
- プリンタの印刷待ち行列
- ゲームのターン管理システム
- 幅優先探索（BFS）アルゴリズム

【計算量】**計算量の特徴**
- すべての基本操作がO(1)で高速
- 配列の先頭と末尾を活用した実装
- メモリ効率が良い

【ヒント】**学習価値**
- データ構造の基礎概念
- FIFO原理の理解
- 順序を保つデータアクセス方法
- 実用的なプログラミング技法

 **スタックとの比較**
- スタック: LIFO（後入れ先出し）
- キュー: FIFO（先入れ先出し）
- どちらも線形データ構造
- 用途によって使い分ける
		`.trim();
	}

	/**
	 * 推奨する操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: QueueOperation;
		value?: number;
		description: string;
		initialQueue?: number[];
	}[] {
		return [
			{
				operation: "enqueue",
				value: 5,
				description: "値5をキューに追加",
				initialQueue: [1, 2, 3],
			},
			{
				operation: "dequeue",
				description: "先頭要素を取り出し",
				initialQueue: [1, 2, 3, 4],
			},
			{
				operation: "front",
				description: "先頭要素を確認（削除なし）",
				initialQueue: [1, 2, 3],
			},
			{
				operation: "rear",
				description: "末尾要素を確認（削除なし）",
				initialQueue: [1, 2, 3],
			},
			{
				operation: "isEmpty",
				description: "空かどうかを確認",
				initialQueue: [],
			},
			{
				operation: "size",
				description: "要素数を確認",
				initialQueue: [1, 2, 3, 4, 5],
			},
		];
	}
}
