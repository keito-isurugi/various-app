/**
 * src/utils/algorithms/stack-basic.ts
 *
 * スタック（Stack）データ構造の基本操作実装
 * LIFO（Last In, First Out）の動作原理をステップバイステップで可視化
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * スタックの操作種別
 */
type StackOperation = "push" | "pop" | "peek" | "isEmpty" | "size";

/**
 * スタックの基本操作アルゴリズムクラス
 *
 * LIFO（Last In, First Out）原理に基づくデータ構造
 * 時間計算量: O(1)（すべての基本操作）
 * 空間計算量: O(n)（n個の要素を格納）
 */
export class StackBasicAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "stack-basic",
		name: "スタック（基本操作）",
		description:
			"LIFO（Last In, First Out）原理に基づくスタックデータ構造の基本操作。push、pop、peek等の動作を可視化",
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
	private stack: number[] = [];

	/**
	 * スタックの基本操作を実行
	 * @param input 実行する操作と値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証
		const operation = input.parameters?.operation as StackOperation;
		const value = input.parameters?.value as number;

		if (!operation) {
			throw new Error("実行する操作が指定されていません");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 既存のスタック状態を復元（もしあれば）
		if (input.array && input.array.length > 0) {
			this.stack = [...input.array];
		} else {
			this.stack = [];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `スタック操作実行：${this.getOperationDescription(operation, value)}`,
			array: [...this.stack],
			operation: "初期化",
			variables: {
				operation: operation,
				stackSize: this.stack.length,
				principle: "LIFO (Last In, First Out)",
				currentStack: `[${this.stack.join(", ")}]`,
			},
		});

		// 操作を実行
		let result: any;
		switch (operation) {
			case "push":
				result = this.executePush(value);
				break;
			case "pop":
				result = this.executePop();
				break;
			case "peek":
				result = this.executePeek();
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
			array: [...this.stack],
			operation: "完了",
			variables: {
				result: result,
				finalStackSize: this.stack.length,
				finalStack: `[${this.stack.join(", ")}]`,
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
	 * push操作の実行
	 */
	private executePush(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("push操作には値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `push(${value}): 値${value}をスタックの先頭に追加`,
			array: [...this.stack],
			operation: "push準備",
			variables: {
				pushValue: value,
				currentTop:
					this.stack.length > 0 ? this.stack[this.stack.length - 1] : "なし",
				beforeSize: this.stack.length,
			},
		});

		// スタックに値を追加
		this.stack.push(value);

		this.steps.push({
			id: this.stepId++,
			description: `push完了: ${value}が先頭に追加されました`,
			array: [...this.stack],
			operation: "push完了",
			variables: {
				pushedValue: value,
				newTop: value,
				afterSize: this.stack.length,
				sizeChange: `${this.stack.length - 1} → ${this.stack.length}`,
			},
		});

		return `値 ${value} が追加されました（サイズ: ${this.stack.length}）`;
	}

	/**
	 * pop操作の実行
	 */
	private executePop(): string {
		if (this.stack.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "pop失敗: スタックが空です",
				array: [...this.stack],
				operation: "pop失敗",
				variables: {
					error: "スタックが空のためpopできません",
					stackSize: 0,
				},
			});
			throw new Error("スタックが空のためpopできません");
		}

		const topValue = this.stack[this.stack.length - 1];

		this.steps.push({
			id: this.stepId++,
			description: `pop(): スタックの先頭要素${topValue}を取り出し`,
			array: [...this.stack],
			operation: "pop準備",
			variables: {
				topValue: topValue,
				beforeSize: this.stack.length,
				position: "先頭（最後に追加された要素）",
			},
		});

		// スタックから値を削除
		const poppedValue = this.stack.pop();
		if (poppedValue === undefined) {
			throw new Error("予期しないエラー: popでundefinedが返されました");
		}

		this.steps.push({
			id: this.stepId++,
			description: `pop完了: ${poppedValue}が取り出されました`,
			array: [...this.stack],
			operation: "pop完了",
			variables: {
				poppedValue: poppedValue,
				newTop:
					this.stack.length > 0 ? this.stack[this.stack.length - 1] : "なし",
				afterSize: this.stack.length,
				sizeChange: `${this.stack.length + 1} → ${this.stack.length}`,
			},
		});

		return `値 ${poppedValue} が取り出されました（サイズ: ${this.stack.length}）`;
	}

	/**
	 * peek操作の実行
	 */
	private executePeek(): string {
		if (this.stack.length === 0) {
			this.steps.push({
				id: this.stepId++,
				description: "peek(): スタックが空のため、先頭要素はありません",
				array: [...this.stack],
				operation: "peek（空）",
				variables: {
					result: "なし",
					stackSize: 0,
					note: "空のスタックには先頭要素が存在しません",
				},
			});
			return "スタックが空です";
		}

		const topValue = this.stack[this.stack.length - 1];

		this.steps.push({
			id: this.stepId++,
			description: `peek(): スタックの先頭要素は${topValue}です（削除せず確認のみ）`,
			array: [...this.stack],
			operation: "peek",
			variables: {
				topValue: topValue,
				stackSize: this.stack.length,
				note: "peekは要素を削除せずに値のみ確認します",
			},
		});

		return `先頭要素: ${topValue}`;
	}

	/**
	 * isEmpty操作の実行
	 */
	private executeIsEmpty(): boolean {
		const isEmpty = this.stack.length === 0;

		this.steps.push({
			id: this.stepId++,
			description: `isEmpty(): スタックが空かどうかを確認 → ${isEmpty ? "空" : "空でない"}`,
			array: [...this.stack],
			operation: "isEmpty",
			variables: {
				isEmpty: isEmpty,
				stackSize: this.stack.length,
				result: isEmpty ? "true（空）" : "false（要素あり）",
			},
		});

		return isEmpty;
	}

	/**
	 * size操作の実行
	 */
	private executeSize(): number {
		const size = this.stack.length;

		this.steps.push({
			id: this.stepId++,
			description: `size(): スタックのサイズを確認 → ${size}個の要素`,
			array: [...this.stack],
			operation: "size",
			variables: {
				size: size,
				elements: this.stack.length > 0 ? `[${this.stack.join(", ")}]` : "空",
			},
		});

		return size;
	}

	/**
	 * 操作の説明文を取得
	 */
	private getOperationDescription(
		operation: StackOperation,
		value?: number,
	): string {
		switch (operation) {
			case "push":
				return `push(${value}) - 値を先頭に追加`;
			case "pop":
				return "pop() - 先頭要素を取り出し";
			case "peek":
				return "peek() - 先頭要素を確認（削除なし）";
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
			parameters: { operation: "push", value: 4 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
スタック（Stack）は、LIFO（Last In, First Out）原理に基づくデータ構造です。

【構造】**基本概念**
- 最後に入れた要素が最初に取り出される
- 皿を積み重ねるイメージ
- 一方向（先頭）からのみアクセス可能

【基礎】**基本操作**
- push(value): 要素を先頭に追加 - O(1)
- pop(): 先頭要素を取り出し - O(1)
- peek(): 先頭要素を確認（削除なし） - O(1)
- isEmpty(): 空かどうかを確認 - O(1)
- size(): 要素数を取得 - O(1)

【ポイント】**実世界での応用**
- 関数呼び出しのコールスタック
- ブラウザの戻るボタン履歴
- 数式の括弧チェック
- アンドゥ（取り消し）機能
- 再帰アルゴリズムの実装

【計算量】**計算量の特徴**
- すべての基本操作がO(1)で高速
- 配列の末尾を先頭として実装
- メモリ効率が良い

【ヒント】**学習価値**
- データ構造の基礎概念
- LIFO原理の理解
- 効率的なデータアクセス方法
- 実用的なプログラミング技法
		`.trim();
	}

	/**
	 * 推奨する操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: StackOperation;
		value?: number;
		description: string;
		initialStack?: number[];
	}[] {
		return [
			{
				operation: "push",
				value: 5,
				description: "値5をスタックに追加",
				initialStack: [1, 2, 3],
			},
			{
				operation: "pop",
				description: "先頭要素を取り出し",
				initialStack: [1, 2, 3, 4],
			},
			{
				operation: "peek",
				description: "先頭要素を確認（削除なし）",
				initialStack: [1, 2, 3],
			},
			{
				operation: "isEmpty",
				description: "空かどうかを確認",
				initialStack: [],
			},
			{
				operation: "size",
				description: "要素数を確認",
				initialStack: [1, 2, 3, 4, 5],
			},
		];
	}
}
