/**
 * src/utils/algorithms/deque-basic.ts
 *
 * 両端キュー（Deque）データ構造の基本操作実装
 * 両端でのアクセスが可能なキューの動作原理をステップバイステップで可視化
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 両端キューの操作種別
 */
type DequeOperation =
	| "pushFront"
	| "pushBack"
	| "popFront"
	| "popBack"
	| "front"
	| "back"
	| "isEmpty"
	| "size";

/**
 * 両端キューの基本操作アルゴリズムクラス
 *
 * 両端からの追加・削除が可能なデータ構造
 * 時間計算量: O(1)（すべての基本操作）
 * 空間計算量: O(n)（n個の要素を格納）
 */
export class DequeBasicAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "deque-basic",
		name: "両端キュー（基本操作）",
		description:
			"両端からの追加・削除が可能な双方向キューデータ構造の基本操作。push/pop操作を前後両方向で実行可能",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // すべての基本操作
			average: "O(1)",
			worst: "O(1)",
		},
		difficulty: 2, // 中級（スタックとキューの発展）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private deque: number[] = [];

	/**
	 * 両端キューの基本操作を実行
	 * @param input 実行する操作と値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証
		const operation = input.parameters?.operation as DequeOperation;
		const value = input.parameters?.value as number;

		if (!operation) {
			throw new Error("実行する操作が指定されていません");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 既存の両端キュー状態を復元（もしあれば）
		if (input.array && input.array.length > 0) {
			this.deque = [...input.array];
		} else {
			this.deque = [];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `両端キュー操作実行：${this.getOperationDescription(operation, value)}`,
			array: [...this.deque],
			operation: "初期化",
			variables: {
				operation: operation,
				dequeSize: this.deque.length,
				principle: "両端アクセス可能なキュー",
				currentDeque: `[${this.deque.join(", ")}]`,
				front: this.deque.length > 0 ? this.deque[0] : "なし",
				back:
					this.deque.length > 0 ? this.deque[this.deque.length - 1] : "なし",
			},
		});

		// 操作を実行
		let result: any;
		switch (operation) {
			case "pushFront":
				result = this.executePushFront(value);
				break;
			case "pushBack":
				result = this.executePushBack(value);
				break;
			case "popFront":
				result = this.executePopFront();
				break;
			case "popBack":
				result = this.executePopBack();
				break;
			case "front":
				result = this.executeFront();
				break;
			case "back":
				result = this.executeBack();
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
			description: `🎉 操作完了！結果: ${result}`,
			array: [...this.deque],
			operation: "完了",
			variables: {
				result: result,
				finalDequeSize: this.deque.length,
				finalDeque: `[${this.deque.join(", ")}]`,
				finalFront: this.deque.length > 0 ? this.deque[0] : "なし",
				finalBack:
					this.deque.length > 0 ? this.deque[this.deque.length - 1] : "なし",
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
	 * pushFront操作の実行
	 */
	private executePushFront(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("pushFront操作には値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `pushFront(${value}): 値${value}を両端キューの先頭に追加`,
			array: [...this.deque],
			operation: "pushFront準備",
			variables: {
				pushValue: value,
				currentFront: this.deque.length > 0 ? this.deque[0] : "なし",
				currentBack:
					this.deque.length > 0 ? this.deque[this.deque.length - 1] : "なし",
				beforeSize: this.deque.length,
				direction: "先頭（左側）",
			},
		});

		// 両端キューの先頭に値を追加
		this.deque.unshift(value);

		this.steps.push({
			id: this.stepId++,
			description: `✅ pushFront完了: ${value}が先頭に追加されました`,
			array: [...this.deque],
			operation: "pushFront完了",
			variables: {
				pushedValue: value,
				newFront: value,
				backElement:
					this.deque.length > 1 ? this.deque[this.deque.length - 1] : "なし",
				afterSize: this.deque.length,
				sizeChange: `${this.deque.length - 1} → ${this.deque.length}`,
			},
		});

		return `値 ${value} が先頭に追加されました（サイズ: ${this.deque.length}）`;
	}

	/**
	 * pushBack操作の実行
	 */
	private executePushBack(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("pushBack操作には値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `pushBack(${value}): 値${value}を両端キューの末尾に追加`,
			array: [...this.deque],
			operation: "pushBack準備",
			variables: {
				pushValue: value,
				currentFront: this.deque.length > 0 ? this.deque[0] : "なし",
				currentBack:
					this.deque.length > 0 ? this.deque[this.deque.length - 1] : "なし",
				beforeSize: this.deque.length,
				direction: "末尾（右側）",
			},
		});

		// 両端キューの末尾に値を追加
		this.deque.push(value);

		this.steps.push({
			id: this.stepId++,
			description: `✅ pushBack完了: ${value}が末尾に追加されました`,
			array: [...this.deque],
			operation: "pushBack完了",
			variables: {
				pushedValue: value,
				newBack: value,
				frontElement: this.deque[0],
				afterSize: this.deque.length,
				sizeChange: `${this.deque.length - 1} → ${this.deque.length}`,
			},
		});

		return `値 ${value} が末尾に追加されました（サイズ: ${this.deque.length}）`;
	}

	/**
	 * popFront操作の実行
	 */
	private executePopFront(): string {
		if (this.deque.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "❌ popFront失敗: 両端キューが空です",
				array: [...this.deque],
				operation: "popFront失敗",
				variables: {
					error: "両端キューが空のためpopFrontできません",
					dequeSize: 0,
				},
			});
			throw new Error("両端キューが空のためpopFrontできません");
		}

		const frontValue = this.deque[0];

		this.steps.push({
			id: this.stepId++,
			description: `popFront(): 両端キューの先頭要素${frontValue}を取り出し`,
			array: [...this.deque],
			operation: "popFront準備",
			variables: {
				frontValue: frontValue,
				beforeSize: this.deque.length,
				backElement:
					this.deque.length > 1 ? this.deque[this.deque.length - 1] : "なし",
				direction: "先頭（左側）から削除",
			},
		});

		// 両端キューから先頭値を削除
		const poppedValue = this.deque.shift();
		if (poppedValue === undefined) {
			throw new Error("予期しないエラー: popFrontでundefinedが返されました");
		}

		this.steps.push({
			id: this.stepId++,
			description: `✅ popFront完了: ${poppedValue}が取り出されました`,
			array: [...this.deque],
			operation: "popFront完了",
			variables: {
				poppedValue: poppedValue,
				newFront: this.deque.length > 0 ? this.deque[0] : "なし",
				afterSize: this.deque.length,
				sizeChange: `${this.deque.length + 1} → ${this.deque.length}`,
			},
		});

		return `値 ${poppedValue} が先頭から取り出されました（サイズ: ${this.deque.length}）`;
	}

	/**
	 * popBack操作の実行
	 */
	private executePopBack(): string {
		if (this.deque.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "❌ popBack失敗: 両端キューが空です",
				array: [...this.deque],
				operation: "popBack失敗",
				variables: {
					error: "両端キューが空のためpopBackできません",
					dequeSize: 0,
				},
			});
			throw new Error("両端キューが空のためpopBackできません");
		}

		const backValue = this.deque[this.deque.length - 1];

		this.steps.push({
			id: this.stepId++,
			description: `popBack(): 両端キューの末尾要素${backValue}を取り出し`,
			array: [...this.deque],
			operation: "popBack準備",
			variables: {
				backValue: backValue,
				beforeSize: this.deque.length,
				frontElement: this.deque[0],
				direction: "末尾（右側）から削除",
			},
		});

		// 両端キューから末尾値を削除
		const poppedValue = this.deque.pop();
		if (poppedValue === undefined) {
			throw new Error("予期しないエラー: popBackでundefinedが返されました");
		}

		this.steps.push({
			id: this.stepId++,
			description: `✅ popBack完了: ${poppedValue}が取り出されました`,
			array: [...this.deque],
			operation: "popBack完了",
			variables: {
				poppedValue: poppedValue,
				newBack:
					this.deque.length > 0 ? this.deque[this.deque.length - 1] : "なし",
				afterSize: this.deque.length,
				sizeChange: `${this.deque.length + 1} → ${this.deque.length}`,
			},
		});

		return `値 ${poppedValue} が末尾から取り出されました（サイズ: ${this.deque.length}）`;
	}

	/**
	 * front操作の実行
	 */
	private executeFront(): string {
		if (this.deque.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "front(): 両端キューが空のため、先頭要素はありません",
				array: [...this.deque],
				operation: "front（空）",
				variables: {
					result: "なし",
					dequeSize: 0,
					note: "空の両端キューには先頭要素が存在しません",
				},
			});
			return "両端キューが空です";
		}

		const frontValue = this.deque[0];

		this.steps.push({
			id: this.stepId++,
			description: `front(): 両端キューの先頭要素は${frontValue}です（削除せず確認のみ）`,
			array: [...this.deque],
			operation: "front",
			variables: {
				frontValue: frontValue,
				dequeSize: this.deque.length,
				backValue: this.deque[this.deque.length - 1],
				note: "frontは要素を削除せずに値のみ確認します",
			},
		});

		return `先頭要素: ${frontValue}`;
	}

	/**
	 * back操作の実行
	 */
	private executeBack(): string {
		if (this.deque.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "back(): 両端キューが空のため、末尾要素はありません",
				array: [...this.deque],
				operation: "back（空）",
				variables: {
					result: "なし",
					dequeSize: 0,
					note: "空の両端キューには末尾要素が存在しません",
				},
			});
			return "両端キューが空です";
		}

		const backValue = this.deque[this.deque.length - 1];

		this.steps.push({
			id: this.stepId++,
			description: `back(): 両端キューの末尾要素は${backValue}です（削除せず確認のみ）`,
			array: [...this.deque],
			operation: "back",
			variables: {
				backValue: backValue,
				dequeSize: this.deque.length,
				frontValue: this.deque[0],
				note: "backは要素を削除せずに値のみ確認します",
			},
		});

		return `末尾要素: ${backValue}`;
	}

	/**
	 * isEmpty操作の実行
	 */
	private executeIsEmpty(): boolean {
		const isEmpty = this.deque.length === 0;

		this.steps.push({
			id: this.stepId++,
			description: `isEmpty(): 両端キューが空かどうかを確認 → ${isEmpty ? "空" : "空でない"}`,
			array: [...this.deque],
			operation: "isEmpty",
			variables: {
				isEmpty: isEmpty,
				dequeSize: this.deque.length,
				result: isEmpty ? "true（空）" : "false（要素あり）",
			},
		});

		return isEmpty;
	}

	/**
	 * size操作の実行
	 */
	private executeSize(): number {
		const size = this.deque.length;

		this.steps.push({
			id: this.stepId++,
			description: `size(): 両端キューのサイズを確認 → ${size}個の要素`,
			array: [...this.deque],
			operation: "size",
			variables: {
				size: size,
				elements: this.deque.length > 0 ? `[${this.deque.join(", ")}]` : "空",
				frontElement: this.deque.length > 0 ? this.deque[0] : "なし",
				backElement:
					this.deque.length > 0 ? this.deque[this.deque.length - 1] : "なし",
			},
		});

		return size;
	}

	/**
	 * 操作の説明文を取得
	 */
	private getOperationDescription(
		operation: DequeOperation,
		value?: number,
	): string {
		switch (operation) {
			case "pushFront":
				return `pushFront(${value}) - 値を先頭に追加`;
			case "pushBack":
				return `pushBack(${value}) - 値を末尾に追加`;
			case "popFront":
				return "popFront() - 先頭要素を取り出し";
			case "popBack":
				return "popBack() - 末尾要素を取り出し";
			case "front":
				return "front() - 先頭要素を確認（削除なし）";
			case "back":
				return "back() - 末尾要素を確認（削除なし）";
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
			parameters: { operation: "pushBack", value: 4 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
両端キュー（Deque：Double-ended Queue）は、両端での追加・削除が可能なデータ構造です。

🏗️ **基本概念**
- 先頭と末尾の両方からアクセス可能
- スタックとキューの機能を併せ持つ
- 柔軟なデータアクセスパターンを提供

📚 **基本操作**
- pushFront(value): 先頭に要素を追加 - O(1)
- pushBack(value): 末尾に要素を追加 - O(1)
- popFront(): 先頭要素を取り出し - O(1)
- popBack(): 末尾要素を取り出し - O(1)
- front(): 先頭要素を確認（削除なし） - O(1)
- back(): 末尾要素を確認（削除なし） - O(1)
- isEmpty(): 空かどうかを確認 - O(1)
- size(): 要素数を取得 - O(1)

🎯 **実世界での応用**
- ブラウザの履歴管理（前進・後退）
- アンドゥ・リドゥ機能の実装
- スライディングウィンドウアルゴリズム
- 回文判定アルゴリズム
- タスクスケジューラの優先度管理

⚡ **計算量の特徴**
- すべての基本操作がO(1)で高速
- 両端でのアクセスが効率的
- メモリ使用量はO(n)

💡 **学習価値**
- スタックとキューの統合概念
- 双方向データアクセスの理解
- 効率的なデータ構造設計
- 実用的なアルゴリズム実装

🔄 **他データ構造との比較**
- スタック: 片端のみ（LIFO）
- キュー: 両端だが一方向（FIFO）
- 両端キュー: 両端双方向アクセス
- 配列: ランダムアクセス可能だが挿入・削除が遅い

🧠 **実装のポイント**
- 配列やリンクリストで実装可能
- 循環バッファによる効率的な実装
- 動的サイズ調整機能
- メモリの効率的利用
		`.trim();
	}

	/**
	 * 推奨する操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: DequeOperation;
		value?: number;
		description: string;
		initialDeque?: number[];
	}[] {
		return [
			{
				operation: "pushFront",
				value: 0,
				description: "値0を先頭に追加",
				initialDeque: [1, 2, 3],
			},
			{
				operation: "pushBack",
				value: 4,
				description: "値4を末尾に追加",
				initialDeque: [1, 2, 3],
			},
			{
				operation: "popFront",
				description: "先頭要素を取り出し",
				initialDeque: [1, 2, 3, 4],
			},
			{
				operation: "popBack",
				description: "末尾要素を取り出し",
				initialDeque: [1, 2, 3, 4],
			},
			{
				operation: "front",
				description: "先頭要素を確認（削除なし）",
				initialDeque: [1, 2, 3],
			},
			{
				operation: "back",
				description: "末尾要素を確認（削除なし）",
				initialDeque: [1, 2, 3],
			},
			{
				operation: "isEmpty",
				description: "空かどうかを確認",
				initialDeque: [],
			},
			{
				operation: "size",
				description: "要素数を確認",
				initialDeque: [1, 2, 3, 4, 5],
			},
		];
	}
}
