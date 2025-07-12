/**
 * src/utils/algorithms/array-basic.ts
 *
 * 配列（Array）データ構造の基本操作実装
 * インデックスベースのランダムアクセスとCRUD操作をステップバイステップで可視化
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 配列の操作種別
 */
type ArrayOperation =
	| "access"
	| "insert"
	| "delete"
	| "update"
	| "search"
	| "length";

/**
 * 配列の基本操作アルゴリズムクラス
 *
 * インデックスベースのランダムアクセス機能
 * 時間計算量: アクセス O(1)、挿入・削除 O(n)、検索 O(n)
 * 空間計算量: O(n)（n個の要素を格納）
 */
export class ArrayBasicAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "array-basic",
		name: "配列（基本操作）",
		description:
			"インデックスベースのランダムアクセスが可能な配列データ構造の基本操作。CRUD操作と線形検索を可視化",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // アクセス操作
			average: "O(n)", // 平均的な操作
			worst: "O(n)", // 挿入・削除・検索
		},
		difficulty: 1, // 初級（最も基本的なデータ構造）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private array: number[] = [];

	/**
	 * 配列の基本操作を実行
	 * @param input 実行する操作と値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証
		const operation = input.parameters?.operation as ArrayOperation;
		const value = input.parameters?.value as number;
		const index = input.parameters?.index as number;

		if (!operation) {
			throw new Error("実行する操作が指定されていません");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 既存の配列状態を復元（もしあれば）
		if (input.array && input.array.length > 0) {
			this.array = [...input.array];
		} else {
			this.array = [];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `配列操作実行：${this.getOperationDescription(operation, value, index)}`,
			array: [...this.array],
			operation: "初期化",
			variables: {
				operation: operation,
				arrayLength: this.array.length,
				principle: "インデックスベースランダムアクセス",
				currentArray: `[${this.array.join(", ")}]`,
			},
		});

		// 操作を実行
		let result: any;
		switch (operation) {
			case "access":
				result = this.executeAccess(index);
				break;
			case "insert":
				result = this.executeInsert(index, value);
				break;
			case "delete":
				result = this.executeDelete(index);
				break;
			case "update":
				result = this.executeUpdate(index, value);
				break;
			case "search":
				result = this.executeSearch(value);
				break;
			case "length":
				result = this.executeLength();
				break;
			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🎉 操作完了！結果: ${result}`,
			array: [...this.array],
			operation: "完了",
			variables: {
				result: result,
				finalArrayLength: this.array.length,
				finalArray: `[${this.array.join(", ")}]`,
				operationCompleted: operation,
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.getTimeComplexity(operation),
		};
	}

	/**
	 * access操作の実行
	 */
	private executeAccess(index: number): string {
		if (index === undefined || index === null) {
			throw new Error("access操作にはインデックスが必要です");
		}

		if (index < 0 || index >= this.array.length) {
			this.steps.push({
				id: this.stepId++,
				description: `❌ アクセス失敗: インデックス${index}は範囲外です`,
				array: [...this.array],
				operation: "アクセス失敗",
				variables: {
					error: `インデックス${index}は範囲外（0-${this.array.length - 1}）`,
					arrayLength: this.array.length,
				},
			});
			throw new Error(
				`インデックス${index}は範囲外です（0-${this.array.length - 1}）`,
			);
		}

		this.steps.push({
			id: this.stepId++,
			description: `access(${index}): インデックス${index}の要素にアクセス`,
			array: [...this.array],
			operation: "アクセス準備",
			variables: {
				accessIndex: index,
				arrayLength: this.array.length,
				targetValue: this.array[index],
			},
		});

		const value = this.array[index];

		this.steps.push({
			id: this.stepId++,
			description: `✅ アクセス完了: インデックス${index}の値は${value}です`,
			array: [...this.array],
			operation: "アクセス完了",
			variables: {
				accessedIndex: index,
				accessedValue: value,
				timeComplexity: "O(1)",
				note: "配列はランダムアクセスなので即座に要素を取得可能",
			},
		});

		return `インデックス${index}の値: ${value}`;
	}

	/**
	 * insert操作の実行
	 */
	private executeInsert(index: number, value: number): string {
		if (value === undefined || value === null) {
			throw new Error("insert操作には値が必要です");
		}

		// インデックスの正規化
		let insertIndex = index;
		if (insertIndex === undefined || insertIndex === null) {
			// 末尾に挿入
			insertIndex = this.array.length;
		}

		if (insertIndex < 0 || insertIndex > this.array.length) {
			throw new Error(
				`挿入インデックス${insertIndex}は無効です（0-${this.array.length}）`,
			);
		}

		this.steps.push({
			id: this.stepId++,
			description: `insert(${insertIndex}, ${value}): インデックス${insertIndex}に値${value}を挿入`,
			array: [...this.array],
			operation: "挿入準備",
			variables: {
				insertIndex: insertIndex,
				insertValue: value,
				beforeLength: this.array.length,
				shiftRequired:
					insertIndex < this.array.length ? "要素の右シフトが必要" : "末尾追加",
			},
		});

		// 要素を右にシフト
		if (insertIndex < this.array.length) {
			this.steps.push({
				id: this.stepId++,
				description: `要素をシフト: インデックス${insertIndex}以降の要素を右に移動`,
				array: [...this.array],
				operation: "要素シフト",
				variables: {
					shiftStart: insertIndex,
					elementsToShift: this.array.length - insertIndex,
					note: "挿入位置を空けるため既存要素を移動",
				},
			});
		}

		// 挿入実行
		this.array.splice(insertIndex, 0, value);

		this.steps.push({
			id: this.stepId++,
			description: `✅ 挿入完了: インデックス${insertIndex}に${value}が挿入されました`,
			array: [...this.array],
			operation: "挿入完了",
			variables: {
				insertedIndex: insertIndex,
				insertedValue: value,
				afterLength: this.array.length,
				lengthChange: `${this.array.length - 1} → ${this.array.length}`,
			},
		});

		return `インデックス${insertIndex}に値${value}を挿入（配列サイズ: ${this.array.length}）`;
	}

	/**
	 * delete操作の実行
	 */
	private executeDelete(index: number): string {
		if (index === undefined || index === null) {
			throw new Error("delete操作にはインデックスが必要です");
		}

		if (index < 0 || index >= this.array.length) {
			this.steps.push({
				id: this.stepId++,
				description: `❌ 削除失敗: インデックス${index}は範囲外です`,
				array: [...this.array],
				operation: "削除失敗",
				variables: {
					error: `インデックス${index}は範囲外（0-${this.array.length - 1}）`,
					arrayLength: this.array.length,
				},
			});
			throw new Error(
				`インデックス${index}は範囲外です（0-${this.array.length - 1}）`,
			);
		}

		const deletedValue = this.array[index];

		this.steps.push({
			id: this.stepId++,
			description: `delete(${index}): インデックス${index}の要素${deletedValue}を削除`,
			array: [...this.array],
			operation: "削除準備",
			variables: {
				deleteIndex: index,
				deleteValue: deletedValue,
				beforeLength: this.array.length,
				shiftRequired:
					index < this.array.length - 1 ? "要素の左シフトが必要" : "末尾削除",
			},
		});

		// 削除実行
		this.array.splice(index, 1);

		if (index < this.array.length) {
			this.steps.push({
				id: this.stepId++,
				description: `要素をシフト: インデックス${index + 1}以降の要素を左に移動`,
				array: [...this.array],
				operation: "要素シフト",
				variables: {
					shiftStart: index + 1,
					elementsShifted: this.array.length - index,
					note: "削除された位置を埋めるため要素を移動",
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: `✅ 削除完了: インデックス${index}の要素${deletedValue}が削除されました`,
			array: [...this.array],
			operation: "削除完了",
			variables: {
				deletedIndex: index,
				deletedValue: deletedValue,
				afterLength: this.array.length,
				lengthChange: `${this.array.length + 1} → ${this.array.length}`,
			},
		});

		return `インデックス${index}の値${deletedValue}を削除（配列サイズ: ${this.array.length}）`;
	}

	/**
	 * update操作の実行
	 */
	private executeUpdate(index: number, value: number): string {
		if (index === undefined || index === null) {
			throw new Error("update操作にはインデックスが必要です");
		}

		if (value === undefined || value === null) {
			throw new Error("update操作には新しい値が必要です");
		}

		if (index < 0 || index >= this.array.length) {
			this.steps.push({
				id: this.stepId++,
				description: `❌ 更新失敗: インデックス${index}は範囲外です`,
				array: [...this.array],
				operation: "更新失敗",
				variables: {
					error: `インデックス${index}は範囲外（0-${this.array.length - 1}）`,
					arrayLength: this.array.length,
				},
			});
			throw new Error(
				`インデックス${index}は範囲外です（0-${this.array.length - 1}）`,
			);
		}

		const oldValue = this.array[index];

		this.steps.push({
			id: this.stepId++,
			description: `update(${index}, ${value}): インデックス${index}の値を${oldValue}から${value}に更新`,
			array: [...this.array],
			operation: "更新準備",
			variables: {
				updateIndex: index,
				oldValue: oldValue,
				newValue: value,
			},
		});

		// 更新実行
		this.array[index] = value;

		this.steps.push({
			id: this.stepId++,
			description: `✅ 更新完了: インデックス${index}の値が${oldValue}から${value}に変更されました`,
			array: [...this.array],
			operation: "更新完了",
			variables: {
				updatedIndex: index,
				oldValue: oldValue,
				newValue: value,
				timeComplexity: "O(1)",
				note: "インデックス指定の更新は即座に実行可能",
			},
		});

		return `インデックス${index}を${oldValue}から${value}に更新`;
	}

	/**
	 * search操作の実行
	 */
	private executeSearch(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("search操作には検索値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `search(${value}): 値${value}を線形検索で探索開始`,
			array: [...this.array],
			operation: "検索開始",
			variables: {
				searchValue: value,
				arrayLength: this.array.length,
				method: "線形検索（先頭から順次確認）",
			},
		});

		// 線形検索
		for (let i = 0; i < this.array.length; i++) {
			this.steps.push({
				id: this.stepId++,
				description: `インデックス${i}をチェック: ${this.array[i]} ${this.array[i] === value ? `== ${value} ✅ 発見！` : `!= ${value}`}`,
				array: [...this.array],
				operation: "検索中",
				variables: {
					currentIndex: i,
					currentValue: this.array[i],
					searchValue: value,
					found: this.array[i] === value,
					checked: i + 1,
					remaining: this.array.length - i - 1,
				},
			});

			if (this.array[i] === value) {
				this.steps.push({
					id: this.stepId++,
					description: `✅ 検索完了: 値${value}がインデックス${i}で見つかりました`,
					array: [...this.array],
					operation: "検索成功",
					variables: {
						foundIndex: i,
						foundValue: value,
						comparisons: i + 1,
						timeComplexity: "O(n)",
					},
				});
				return `値${value}がインデックス${i}で見つかりました（${i + 1}回の比較）`;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `❌ 検索完了: 値${value}は配列に存在しません`,
			array: [...this.array],
			operation: "検索失敗",
			variables: {
				searchValue: value,
				comparisons: this.array.length,
				result: "見つからず",
				timeComplexity: "O(n)",
			},
		});

		return `値${value}は見つかりませんでした（${this.array.length}回の比較）`;
	}

	/**
	 * length操作の実行
	 */
	private executeLength(): number {
		const length = this.array.length;

		this.steps.push({
			id: this.stepId++,
			description: `length(): 配列の要素数を確認 → ${length}個の要素`,
			array: [...this.array],
			operation: "length",
			variables: {
				length: length,
				elements: this.array.length > 0 ? `[${this.array.join(", ")}]` : "空",
				timeComplexity: "O(1)",
				note: "配列のサイズ情報は即座に取得可能",
			},
		});

		return length;
	}

	/**
	 * 操作の説明文を取得
	 */
	private getOperationDescription(
		operation: ArrayOperation,
		value?: number,
		index?: number,
	): string {
		switch (operation) {
			case "access":
				return `access(${index}) - 指定インデックスの要素にアクセス`;
			case "insert":
				return `insert(${index}, ${value}) - 指定位置に要素を挿入`;
			case "delete":
				return `delete(${index}) - 指定インデックスの要素を削除`;
			case "update":
				return `update(${index}, ${value}) - 指定インデックスの要素を更新`;
			case "search":
				return `search(${value}) - 指定値を線形検索`;
			case "length":
				return "length() - 配列の要素数を取得";
			default:
				return operation;
		}
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getTimeComplexity(operation: ArrayOperation): string {
		switch (operation) {
			case "access":
			case "update":
			case "length":
				return "O(1)";
			case "insert":
			case "delete":
			case "search":
				return "O(n)";
			default:
				return "O(n)";
		}
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			array: [1, 2, 3, 4, 5],
			parameters: { operation: "access", index: 2 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
配列（Array）は、同じ型の要素を連続したメモリ領域に格納するデータ構造です。

🏗️ **基本概念**
- インデックスベースのランダムアクセス
- 要素は0から始まる整数インデックスで管理
- メモリ上に連続して配置される

📚 **基本操作**
- access(index): 指定インデックスの要素にアクセス - O(1)
- insert(index, value): 指定位置に要素を挿入 - O(n)
- delete(index): 指定インデックスの要素を削除 - O(n)
- update(index, value): 指定インデックスの要素を更新 - O(1)
- search(value): 指定値を線形検索 - O(n)
- length(): 配列の要素数を取得 - O(1)

🎯 **実世界での応用**
- プログラミング言語の基本データ型
- データベースのレコード管理
- 画像処理（ピクセル配列）
- 数値計算（ベクトル・行列）
- ゲーム開発（座標・状態管理）

⚡ **計算量の特徴**
- アクセス・更新: O(1)で高速
- 挿入・削除: O(n)（要素のシフトが必要）
- 検索: O(n)（線形検索）
- キャッシュ効率が良い

💡 **学習価値**
- プログラミングの基礎概念
- メモリ管理の理解
- インデックス操作の重要性
- 他のデータ構造の基礎
		`.trim();
	}

	/**
	 * 推奨する操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: ArrayOperation;
		value?: number;
		index?: number;
		description: string;
		initialArray?: number[];
	}[] {
		return [
			{
				operation: "access",
				index: 2,
				description: "インデックス2の要素にアクセス",
				initialArray: [10, 20, 30, 40, 50],
			},
			{
				operation: "insert",
				index: 1,
				value: 15,
				description: "インデックス1に値15を挿入",
				initialArray: [10, 20, 30],
			},
			{
				operation: "delete",
				index: 0,
				description: "インデックス0の要素を削除",
				initialArray: [10, 20, 30, 40],
			},
			{
				operation: "update",
				index: 1,
				value: 25,
				description: "インデックス1を値25に更新",
				initialArray: [10, 20, 30],
			},
			{
				operation: "search",
				value: 30,
				description: "値30を線形検索",
				initialArray: [10, 20, 30, 40, 50],
			},
			{
				operation: "length",
				description: "配列の要素数を確認",
				initialArray: [1, 2, 3, 4, 5, 6],
			},
		];
	}
}
