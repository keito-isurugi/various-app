/**
 * src/utils/algorithms/linked-list-basic.ts
 *
 * 連結リスト（Linked List）データ構造の基本操作実装
 * ノードとポインタを使った動的データ構造の動作原理をステップバイステップで可視化
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 連結リストのノード
 */
interface ListNode {
	value: number;
	next: ListNode | null;
}

/**
 * 連結リストの操作種別
 */
type LinkedListOperation =
	| "insertHead"
	| "insertTail"
	| "insertAt"
	| "deleteHead"
	| "deleteTail"
	| "deleteAt"
	| "find"
	| "size"
	| "isEmpty";

/**
 * 連結リストの基本操作アルゴリズムクラス
 *
 * ノードとポインタによる動的データ構造
 * 挿入・削除: O(1)〜O(n)（位置による）
 * 検索: O(n)
 * 空間計算量: O(n)（n個のノード）
 */
export class LinkedListBasicAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "linked-list-basic",
		name: "連結リスト（基本操作）",
		description:
			"ノードとポインタで構成される動的データ構造の基本操作。挿入・削除・検索の動作を詳細に可視化",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // 先頭への挿入・削除
			average: "O(n)", // 検索、任意位置操作
			worst: "O(n)",
		},
		difficulty: 3, // 上級（ポインタ操作が複雑）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private head: ListNode | null = null;
	private nodeCount = 0;

	/**
	 * 連結リストの基本操作を実行
	 * @param input 実行する操作と値
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証
		const operation = input.parameters?.operation as LinkedListOperation;
		const value = input.parameters?.value as number;
		const index = input.parameters?.index as number;

		if (!operation) {
			throw new Error("実行する操作が指定されていません");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 既存のリスト状態を復元（もしあれば）
		this.buildListFromArray(input.array || []);

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `連結リスト操作実行：${this.getOperationDescription(operation, value, index)}`,
			array: this.toArray(),
			operation: "初期化",
			variables: {
				operation: operation,
				listSize: this.nodeCount,
				structure: "ノード -> ノード -> ... -> null",
				currentList: this.toDisplayString(),
				headValue: this.head?.value ?? "なし",
			},
		});

		// 操作を実行
		let result: any;
		switch (operation) {
			case "insertHead":
				result = this.executeInsertHead(value);
				break;
			case "insertTail":
				result = this.executeInsertTail(value);
				break;
			case "insertAt":
				result = this.executeInsertAt(value, index);
				break;
			case "deleteHead":
				result = this.executeDeleteHead();
				break;
			case "deleteTail":
				result = this.executeDeleteTail();
				break;
			case "deleteAt":
				result = this.executeDeleteAt(index);
				break;
			case "find":
				result = this.executeFind(value);
				break;
			case "size":
				result = this.executeSize();
				break;
			case "isEmpty":
				result = this.executeIsEmpty();
				break;
			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🎉 操作完了！結果: ${result}`,
			array: this.toArray(),
			operation: "完了",
			variables: {
				result: result,
				finalListSize: this.nodeCount,
				finalList: this.toDisplayString(),
				finalHeadValue: this.head?.value ?? "なし",
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
	 * 配列から連結リストを構築
	 */
	private buildListFromArray(array: number[]): void {
		this.head = null;
		this.nodeCount = 0;

		for (const value of array) {
			this.insertTailSilent(value);
		}
	}

	/**
	 * 連結リストを配列に変換
	 */
	private toArray(): number[] {
		const result: number[] = [];
		let current = this.head;
		while (current) {
			result.push(current.value);
			current = current.next;
		}
		return result;
	}

	/**
	 * 連結リストの表示用文字列を生成
	 */
	private toDisplayString(): string {
		if (!this.head) {
			return "空のリスト";
		}
		const values = this.toArray();
		return `${values.join(" -> ")} -> null`;
	}

	/**
	 * 末尾に挿入（ログなし）
	 */
	private insertTailSilent(value: number): void {
		const newNode: ListNode = { value, next: null };

		if (!this.head) {
			this.head = newNode;
		} else {
			let current = this.head;
			while (current.next) {
				current = current.next;
			}
			current.next = newNode;
		}
		this.nodeCount++;
	}

	/**
	 * 先頭に挿入する操作
	 */
	private executeInsertHead(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("insertHead操作には値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `insertHead(${value}): 値${value}を連結リストの先頭に挿入`,
			array: this.toArray(),
			operation: "insertHead準備",
			variables: {
				insertValue: value,
				currentHead: this.head?.value ?? "なし",
				beforeSize: this.nodeCount,
				step: "新しいノードを作成し、先頭に配置",
			},
		});

		// 新しいノードを作成
		const newNode: ListNode = { value, next: this.head };
		this.head = newNode;
		this.nodeCount++;

		this.steps.push({
			id: this.stepId++,
			description: `✅ insertHead完了: ${value}が先頭に挿入されました`,
			array: this.toArray(),
			operation: "insertHead完了",
			variables: {
				insertedValue: value,
				newHead: value,
				afterSize: this.nodeCount,
				sizeChange: `${this.nodeCount - 1} → ${this.nodeCount}`,
				newStructure: this.toDisplayString(),
			},
		});

		return `値 ${value} が先頭に挿入されました（サイズ: ${this.nodeCount}）`;
	}

	/**
	 * 末尾に挿入する操作
	 */
	private executeInsertTail(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("insertTail操作には値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `insertTail(${value}): 値${value}を連結リストの末尾に挿入`,
			array: this.toArray(),
			operation: "insertTail準備",
			variables: {
				insertValue: value,
				currentHead: this.head?.value ?? "なし",
				beforeSize: this.nodeCount,
				step: "末尾まで辿って新しいノードを追加",
			},
		});

		const newNode: ListNode = { value, next: null };

		if (!this.head) {
			// リストが空の場合
			this.head = newNode;
			this.steps.push({
				id: this.stepId++,
				description: `空のリストなので${value}が先頭ノードになります`,
				array: this.toArray(),
				operation: "insertTail（空リスト）",
				variables: {
					insertedValue: value,
					newHead: value,
					note: "空のリストでは先頭と末尾が同じ",
				},
			});
		} else {
			// 末尾まで辿る
			let current = this.head;
			let position = 0;
			while (current.next) {
				this.steps.push({
					id: this.stepId++,
					description: `位置${position}のノード(${current.value})を通過中...`,
					array: this.toArray(),
					operation: "末尾探索",
					variables: {
						currentValue: current.value,
						position: position,
						hasNext: !!current.next,
					},
				});
				current = current.next;
				position++;
			}

			// 末尾ノードにリンク
			current.next = newNode;
			this.steps.push({
				id: this.stepId++,
				description: `末尾ノード(${current.value})に${value}をリンクしました`,
				array: this.toArray(),
				operation: "insertTail完了",
				variables: {
					previousTail: current.value,
					newTail: value,
					finalPosition: position + 1,
				},
			});
		}

		this.nodeCount++;

		this.steps.push({
			id: this.stepId++,
			description: `✅ insertTail完了: ${value}が末尾に挿入されました`,
			array: this.toArray(),
			operation: "insertTail完了",
			variables: {
				insertedValue: value,
				afterSize: this.nodeCount,
				sizeChange: `${this.nodeCount - 1} → ${this.nodeCount}`,
				newStructure: this.toDisplayString(),
			},
		});

		return `値 ${value} が末尾に挿入されました（サイズ: ${this.nodeCount}）`;
	}

	/**
	 * 指定位置に挿入する操作
	 */
	private executeInsertAt(value: number, index: number): string {
		if (value === undefined || value === null) {
			throw new Error("insertAt操作には値が必要です");
		}
		if (index === undefined || index < 0 || index > this.nodeCount) {
			throw new Error(
				`無効なインデックス: ${index} (有効範囲: 0-${this.nodeCount})`,
			);
		}

		this.steps.push({
			id: this.stepId++,
			description: `insertAt(${index}, ${value}): 位置${index}に値${value}を挿入`,
			array: this.toArray(),
			operation: "insertAt準備",
			variables: {
				insertValue: value,
				targetIndex: index,
				beforeSize: this.nodeCount,
				validRange: `0-${this.nodeCount}`,
			},
		});

		// 先頭への挿入
		if (index === 0) {
			return this.executeInsertHead(value);
		}

		// 指定位置まで辿る
		let current = this.head;
		let position = 0;
		while (position < index - 1 && current) {
			this.steps.push({
				id: this.stepId++,
				description: `位置${position}のノード(${current.value})を通過中...`,
				array: this.toArray(),
				operation: "位置探索",
				variables: {
					currentValue: current.value,
					currentPosition: position,
					targetPosition: index - 1,
				},
			});
			current = current.next;
			position++;
		}

		if (!current) {
			throw new Error("位置の探索中にエラーが発生しました");
		}

		// 新しいノードを挿入
		const newNode: ListNode = { value, next: current.next };
		current.next = newNode;
		this.nodeCount++;

		this.steps.push({
			id: this.stepId++,
			description: `✅ insertAt完了: 位置${index}に${value}が挿入されました`,
			array: this.toArray(),
			operation: "insertAt完了",
			variables: {
				insertedValue: value,
				insertedIndex: index,
				afterSize: this.nodeCount,
				sizeChange: `${this.nodeCount - 1} → ${this.nodeCount}`,
				newStructure: this.toDisplayString(),
			},
		});

		return `値 ${value} が位置${index}に挿入されました（サイズ: ${this.nodeCount}）`;
	}

	/**
	 * 先頭を削除する操作
	 */
	private executeDeleteHead(): string {
		if (!this.head) {
			this.steps.push({
				id: this.stepId++,
				description: "❌ deleteHead失敗: リストが空です",
				array: this.toArray(),
				operation: "deleteHead失敗",
				variables: {
					error: "空のリストから要素を削除できません",
					listSize: 0,
				},
			});
			throw new Error("空のリストから要素を削除できません");
		}

		const deletedValue = this.head.value;

		this.steps.push({
			id: this.stepId++,
			description: `deleteHead(): 先頭ノード(${deletedValue})を削除`,
			array: this.toArray(),
			operation: "deleteHead準備",
			variables: {
				deletedValue: deletedValue,
				beforeSize: this.nodeCount,
				nextHead: this.head.next?.value ?? "なし",
			},
		});

		// 先頭を次のノードに移動
		this.head = this.head.next;
		this.nodeCount--;

		this.steps.push({
			id: this.stepId++,
			description: `✅ deleteHead完了: ${deletedValue}が削除されました`,
			array: this.toArray(),
			operation: "deleteHead完了",
			variables: {
				deletedValue: deletedValue,
				newHead: this.head?.value ?? "なし",
				afterSize: this.nodeCount,
				sizeChange: `${this.nodeCount + 1} → ${this.nodeCount}`,
				newStructure: this.toDisplayString(),
			},
		});

		return `値 ${deletedValue} が先頭から削除されました（サイズ: ${this.nodeCount}）`;
	}

	/**
	 * 末尾を削除する操作
	 */
	private executeDeleteTail(): string {
		if (!this.head) {
			this.steps.push({
				id: this.stepId++,
				description: "❌ deleteTail失敗: リストが空です",
				array: this.toArray(),
				operation: "deleteTail失敗",
				variables: {
					error: "空のリストから要素を削除できません",
					listSize: 0,
				},
			});
			throw new Error("空のリストから要素を削除できません");
		}

		// 単一ノードの場合
		if (!this.head.next) {
			const deletedValue = this.head.value;
			this.head = null;
			this.nodeCount--;

			this.steps.push({
				id: this.stepId++,
				description: `✅ deleteTail完了: 単一ノード${deletedValue}が削除されました`,
				array: this.toArray(),
				operation: "deleteTail完了",
				variables: {
					deletedValue: deletedValue,
					newStructure: "空のリスト",
					afterSize: this.nodeCount,
				},
			});

			return `値 ${deletedValue} が削除されました（サイズ: ${this.nodeCount}）`;
		}

		// 末尾の一つ前まで辿る
		let current = this.head;
		let position = 0;
		while (current.next?.next) {
			this.steps.push({
				id: this.stepId++,
				description: `位置${position}のノード(${current.value})を通過中...`,
				array: this.toArray(),
				operation: "末尾探索",
				variables: {
					currentValue: current.value,
					position: position,
					isSecondToLast: !current.next?.next,
				},
			});
			current = current.next;
			position++;
		}

		const deletedValue = current.next?.value;
		if (deletedValue === undefined) {
			throw new Error("予期しないエラー: 削除対象ノードが見つかりません");
		}
		current.next = null;
		this.nodeCount--;

		this.steps.push({
			id: this.stepId++,
			description: `✅ deleteTail完了: ${deletedValue}が末尾から削除されました`,
			array: this.toArray(),
			operation: "deleteTail完了",
			variables: {
				deletedValue: deletedValue,
				newTail: current.value,
				afterSize: this.nodeCount,
				sizeChange: `${this.nodeCount + 1} → ${this.nodeCount}`,
				newStructure: this.toDisplayString(),
			},
		});

		return `値 ${deletedValue} が末尾から削除されました（サイズ: ${this.nodeCount}）`;
	}

	/**
	 * 指定位置を削除する操作
	 */
	private executeDeleteAt(index: number): string {
		if (index === undefined || index < 0 || index >= this.nodeCount) {
			throw new Error(
				`無効なインデックス: ${index} (有効範囲: 0-${this.nodeCount - 1})`,
			);
		}

		this.steps.push({
			id: this.stepId++,
			description: `deleteAt(${index}): 位置${index}のノードを削除`,
			array: this.toArray(),
			operation: "deleteAt準備",
			variables: {
				targetIndex: index,
				beforeSize: this.nodeCount,
				validRange: `0-${this.nodeCount - 1}`,
			},
		});

		// 先頭の削除
		if (index === 0) {
			return this.executeDeleteHead();
		}

		// 指定位置の一つ前まで辿る
		let current = this.head;
		if (!current) {
			throw new Error("予期しないエラー: リストが空です");
		}
		let position = 0;
		while (position < index - 1) {
			this.steps.push({
				id: this.stepId++,
				description: `位置${position}のノード(${current.value})を通過中...`,
				array: this.toArray(),
				operation: "位置探索",
				variables: {
					currentValue: current.value,
					currentPosition: position,
					targetPosition: index - 1,
				},
			});
			if (!current.next) {
				throw new Error("予期しないエラー: 次のノードが見つかりません");
			}
			current = current.next;
			position++;
		}

		const deletedValue = current.next?.value;
		if (deletedValue === undefined) {
			throw new Error("予期しないエラー: 削除対象ノードが見つかりません");
		}
		current.next = current.next?.next || null;
		this.nodeCount--;

		this.steps.push({
			id: this.stepId++,
			description: `✅ deleteAt完了: 位置${index}の${deletedValue}が削除されました`,
			array: this.toArray(),
			operation: "deleteAt完了",
			variables: {
				deletedValue: deletedValue,
				deletedIndex: index,
				afterSize: this.nodeCount,
				sizeChange: `${this.nodeCount + 1} → ${this.nodeCount}`,
				newStructure: this.toDisplayString(),
			},
		});

		return `値 ${deletedValue} が位置${index}から削除されました（サイズ: ${this.nodeCount}）`;
	}

	/**
	 * 値を検索する操作
	 */
	private executeFind(value: number): string {
		if (value === undefined || value === null) {
			throw new Error("find操作には検索値が必要です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `find(${value}): 値${value}を線形検索で探索`,
			array: this.toArray(),
			operation: "find準備",
			variables: {
				searchValue: value,
				listSize: this.nodeCount,
				searchMethod: "線形検索（先頭から順次確認）",
			},
		});

		let current = this.head;
		let position = 0;

		while (current) {
			this.steps.push({
				id: this.stepId++,
				description: `位置${position}: ノード値${current.value}を確認 ${current.value === value ? "→ 発見！" : "→ 一致せず"}`,
				array: this.toArray(),
				operation: current.value === value ? "find発見" : "find検索中",
				variables: {
					currentValue: current.value,
					position: position,
					match: current.value === value,
					searchValue: value,
				},
			});

			if (current.value === value) {
				this.steps.push({
					id: this.stepId++,
					description: `✅ find完了: 値${value}が位置${position}で発見されました`,
					array: this.toArray(),
					operation: "find完了",
					variables: {
						foundValue: value,
						foundIndex: position,
						totalChecked: position + 1,
					},
				});
				return `値 ${value} が位置${position}で発見されました`;
			}

			current = current.next;
			position++;
		}

		this.steps.push({
			id: this.stepId++,
			description: `❌ find完了: 値${value}は見つかりませんでした`,
			array: this.toArray(),
			operation: "find未発見",
			variables: {
				searchValue: value,
				totalChecked: position,
				result: "見つからない",
			},
		});

		return `値 ${value} は見つかりませんでした`;
	}

	/**
	 * サイズを取得する操作
	 */
	private executeSize(): number {
		this.steps.push({
			id: this.stepId++,
			description: `size(): リストのサイズを確認 → ${this.nodeCount}個のノード`,
			array: this.toArray(),
			operation: "size",
			variables: {
				size: this.nodeCount,
				structure: this.toDisplayString(),
				method: "ノード数をカウント",
			},
		});

		return this.nodeCount;
	}

	/**
	 * 空かどうかを確認する操作
	 */
	private executeIsEmpty(): boolean {
		const isEmpty = this.head === null;

		this.steps.push({
			id: this.stepId++,
			description: `isEmpty(): リストが空かどうかを確認 → ${isEmpty ? "空" : "空でない"}`,
			array: this.toArray(),
			operation: "isEmpty",
			variables: {
				isEmpty: isEmpty,
				headExists: !!this.head,
				result: isEmpty ? "true（空）" : "false（要素あり）",
			},
		});

		return isEmpty;
	}

	/**
	 * 操作の説明文を取得
	 */
	private getOperationDescription(
		operation: LinkedListOperation,
		value?: number,
		index?: number,
	): string {
		switch (operation) {
			case "insertHead":
				return `insertHead(${value}) - 先頭に値を挿入`;
			case "insertTail":
				return `insertTail(${value}) - 末尾に値を挿入`;
			case "insertAt":
				return `insertAt(${index}, ${value}) - 指定位置に値を挿入`;
			case "deleteHead":
				return "deleteHead() - 先頭要素を削除";
			case "deleteTail":
				return "deleteTail() - 末尾要素を削除";
			case "deleteAt":
				return `deleteAt(${index}) - 指定位置の要素を削除`;
			case "find":
				return `find(${value}) - 値を検索`;
			case "size":
				return "size() - 要素数を確認";
			case "isEmpty":
				return "isEmpty() - 空かどうかを確認";
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
			parameters: { operation: "insertTail", value: 4 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
連結リスト（Linked List）は、ノードとポインタで構成される動的データ構造です。

🏗️ **基本概念**
- 各ノードが値と次のノードへのポインタを持つ
- 動的にサイズを変更可能
- メモリの効率的な利用
- 順次アクセスのみ（ランダムアクセス不可）

📚 **基本操作**
- insertHead(value): 先頭に挿入 - O(1)
- insertTail(value): 末尾に挿入 - O(n)
- insertAt(index, value): 指定位置に挿入 - O(n)
- deleteHead(): 先頭を削除 - O(1)
- deleteTail(): 末尾を削除 - O(n)
- deleteAt(index): 指定位置を削除 - O(n)
- find(value): 値を検索 - O(n)
- size(): 要素数を取得 - O(1)
- isEmpty(): 空かどうかを確認 - O(1)

🎯 **実世界での応用**
- ウェブブラウザの履歴管理
- 音楽プレイヤーのプレイリスト
- アンドゥ機能の実装
- メモリ管理システム
- スタックやキューの実装基盤

⚡ **計算量の特徴**
- 先頭への挿入・削除: O(1)で高速
- 検索・任意位置操作: O(n)で線形時間
- 空間計算量: O(n)（ノード数に比例）
- 配列と比べてメモリオーバーヘッドあり

💡 **学習価値**
- ポインタとメモリ管理の理解
- 動的データ構造の概念
- アルゴリズムとデータ構造の関係
- 実装における設計選択の重要性

🔄 **配列との比較**
- 配列: ランダムアクセスO(1)、固定サイズ
- 連結リスト: 順次アクセスO(n)、動的サイズ
- 配列: 挿入・削除O(n)（要素移動が必要）
- 連結リスト: 先頭操作O(1)、ポインタ操作のみ

🧠 **実装のポイント**
- ポインタの正確な操作
- メモリリークの防止
- エッジケースの処理（空リスト、単一ノード）
- 時間計算量とメモリ効率のトレードオフ
		`.trim();
	}

	/**
	 * 推奨する操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: LinkedListOperation;
		value?: number;
		index?: number;
		description: string;
		initialList?: number[];
	}[] {
		return [
			{
				operation: "insertHead",
				value: 0,
				description: "値0を先頭に挿入",
				initialList: [1, 2, 3],
			},
			{
				operation: "insertTail",
				value: 4,
				description: "値4を末尾に挿入",
				initialList: [1, 2, 3],
			},
			{
				operation: "insertAt",
				value: 5,
				index: 1,
				description: "値5を位置1に挿入",
				initialList: [1, 2, 3],
			},
			{
				operation: "deleteHead",
				description: "先頭要素を削除",
				initialList: [1, 2, 3, 4],
			},
			{
				operation: "deleteTail",
				description: "末尾要素を削除",
				initialList: [1, 2, 3, 4],
			},
			{
				operation: "deleteAt",
				index: 1,
				description: "位置1の要素を削除",
				initialList: [1, 2, 3, 4],
			},
			{
				operation: "find",
				value: 3,
				description: "値3を検索",
				initialList: [1, 2, 3, 4, 5],
			},
			{
				operation: "size",
				description: "リストサイズを確認",
				initialList: [1, 2, 3, 4, 5],
			},
			{
				operation: "isEmpty",
				description: "空かどうかを確認",
				initialList: [],
			},
		];
	}
}
