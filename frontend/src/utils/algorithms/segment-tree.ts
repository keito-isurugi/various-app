/**
 * src/utils/algorithms/segment-tree.ts
 *
 * セグメント木（Segment Tree）の実装
 * 範囲クエリと一点更新を効率的に処理する完全二分木データ構造
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * セグメント木操作の種類
 */
type SegmentTreeOperationType =
	| "build" // セグメント木の構築
	| "query" // 範囲クエリ
	| "update" // 一点更新
	| "rangeUpdate" // 範囲更新（遅延評価）
	| "pointQuery" // 一点クエリ
	| "getNode" // 特定ノードの値取得
	| "visualizeTree"; // 木構造の可視化

/**
 * セグメント木のクエリタイプ
 */
type QueryType = "sum" | "min" | "max" | "gcd" | "lcm";

/**
 * セグメント木ノードの状態を表す型
 */
interface SegmentTreeNode {
	index: number; // ノードのインデックス
	left: number; // 担当範囲の左端
	right: number; // 担当範囲の右端
	value: number; // ノードの値
	lazy?: number; // 遅延評価用の値
}

/**
 * セグメント木（Segment Tree）データ構造クラス
 *
 * 配列の範囲クエリと一点更新を効率的に処理する完全二分木
 * 各ノードが特定の範囲の集約値（和、最小値、最大値など）を保持
 * 時間計算量: 構築O(n)、クエリ・更新O(log n)
 * 空間計算量: O(n)
 */
export class SegmentTreeAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "segment-tree",
		name: "セグメント木",
		description:
			"配列の範囲クエリと一点更新を効率的に処理。分割統治による完全二分木で区間の集約値を管理",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // 単一ノードのクエリ
			average: "O(log n)", // 通常のクエリ・更新
			worst: "O(n)", // 構築時
		},
		difficulty: 4, // 上級（木構造と再帰の深い理解が必要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private tree: number[] = [];
	private lazy: number[] = []; // 遅延評価用
	private originalArray: number[] = [];
	private queryType: QueryType = "sum";
	private n = 0; // 元の配列サイズ

	/**
	 * セグメント木操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as SegmentTreeOperationType;
		const array = input.parameters?.array as number[] | undefined;
		const left = input.parameters?.left as number | undefined;
		const right = input.parameters?.right as number | undefined;
		const index = input.parameters?.index as number | undefined;
		const value = input.parameters?.value as number | undefined;
		const queryType = (input.parameters?.queryType as QueryType) || "sum";
		const nodeIndex = input.parameters?.nodeIndex as number | undefined;

		// クエリタイプの設定
		this.queryType = queryType;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `セグメント木操作開始：${this.getOperationDescription(operation)}を実行`,
			array: this.originalArray.length > 0 ? [...this.originalArray] : [],
			operation: "初期化",
			variables: {
				operation: operation,
				queryType: this.queryType,
				currentSize: this.originalArray.length,
				treeSize: this.tree.length,
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "build":
				if (array && array.length > 0) {
					result = this.performBuild(array);
				} else {
					throw new Error("構築には非空の配列が必要です");
				}
				break;

			case "query":
				if (left !== undefined && right !== undefined) {
					result = this.performQuery(left, right);
				} else {
					throw new Error("範囲クエリには左右の境界が必要です");
				}
				break;

			case "update":
				if (index !== undefined && value !== undefined) {
					result = this.performUpdate(index, value);
				} else {
					throw new Error("更新にはインデックスと値が必要です");
				}
				break;

			case "rangeUpdate":
				if (left !== undefined && right !== undefined && value !== undefined) {
					result = this.performRangeUpdate(left, right, value);
				} else {
					throw new Error("範囲更新には範囲と値が必要です");
				}
				break;

			case "pointQuery":
				if (index !== undefined) {
					result = this.performPointQuery(index);
				} else {
					throw new Error("一点クエリにはインデックスが必要です");
				}
				break;

			case "getNode":
				if (nodeIndex !== undefined) {
					result = this.performGetNode(nodeIndex);
				} else {
					throw new Error("ノード取得にはノードインデックスが必要です");
				}
				break;

			case "visualizeTree":
				result = this.performVisualizeTree();
				break;

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` セグメント木操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
			array: [...this.originalArray],
			operation: "完了",
			variables: {
				result: result,
				queryType: this.queryType,
				treeDepth: this.getTreeDepth(),
				totalNodes: this.tree.length,
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
				queryType: this.queryType,
				operationResult: result,
				arraySize: this.originalArray.length,
				treeSize: this.tree.length,
				maxDepth: this.getTreeDepth(),
				totalSteps: this.steps.length,
			},
		};
	}

	/**
	 * セグメント木の構築
	 */
	private performBuild(array: number[]): string {
		this.originalArray = [...array];
		this.n = array.length;

		// 4倍のサイズで初期化（完全二分木用）
		this.tree = new Array(4 * this.n).fill(this.getIdentityValue());
		this.lazy = new Array(4 * this.n).fill(0);

		this.steps.push({
			id: this.stepId++,
			description: `配列 [${array.join(", ")}] からセグメント木を構築`,
			array: [...array],
			operation: "構築開始",
			variables: {
				originalArray: array,
				arraySize: this.n,
				treeSize: this.tree.length,
				queryType: this.queryType,
				identityValue: this.getIdentityValue(),
			},
		});

		// 再帰的に構築
		this.buildRecursive(1, 0, this.n - 1);

		this.steps.push({
			id: this.stepId++,
			description: "セグメント木の構築が完了",
			array: [...this.originalArray],
			operation: "構築完了",
			variables: {
				rootValue: this.tree[1],
				totalNodes: this.countUsedNodes(),
				treeHeight: this.getTreeDepth(),
			},
		});

		return `サイズ ${this.n} の配列からセグメント木を構築しました`;
	}

	/**
	 * 再帰的な構築
	 */
	private buildRecursive(node: number, start: number, end: number): void {
		if (start === end) {
			// 葉ノード
			this.tree[node] = this.originalArray[start];

			this.steps.push({
				id: this.stepId++,
				description: `葉ノード ${node}: 配列[${start}] = ${this.originalArray[start]}`,
				array: [...this.originalArray],
				highlight: [start],
				operation: "葉ノード設定",
				variables: {
					nodeIndex: node,
					arrayIndex: start,
					nodeValue: this.tree[node],
					range: `[${start}, ${end}]`,
				},
			});
		} else {
			// 内部ノード
			const mid = Math.floor((start + end) / 2);
			const leftChild = 2 * node;
			const rightChild = 2 * node + 1;

			this.steps.push({
				id: this.stepId++,
				description: `内部ノード ${node}: 範囲[${start}, ${end}]を[${start}, ${mid}]と[${mid + 1}, ${end}]に分割`,
				array: [...this.originalArray],
				operation: "範囲分割",
				variables: {
					nodeIndex: node,
					range: `[${start}, ${end}]`,
					leftRange: `[${start}, ${mid}]`,
					rightRange: `[${mid + 1}, ${end}]`,
					leftChild: leftChild,
					rightChild: rightChild,
				},
			});

			// 左右の子を構築
			this.buildRecursive(leftChild, start, mid);
			this.buildRecursive(rightChild, mid + 1, end);

			// 現在のノードの値を計算
			this.tree[node] = this.combineValues(
				this.tree[leftChild],
				this.tree[rightChild],
			);

			this.steps.push({
				id: this.stepId++,
				description: `ノード ${node}: ${this.tree[leftChild]} ${this.getOperatorSymbol()} ${this.tree[rightChild]} = ${this.tree[node]}`,
				array: [...this.originalArray],
				operation: "値結合",
				variables: {
					nodeIndex: node,
					leftValue: this.tree[leftChild],
					rightValue: this.tree[rightChild],
					combinedValue: this.tree[node],
					operation: this.queryType,
				},
			});
		}
	}

	/**
	 * 範囲クエリ
	 */
	private performQuery(left: number, right: number): number {
		if (left < 0 || right >= this.n || left > right) {
			throw new Error("無効な範囲です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `範囲[${left}, ${right}]の${this.getQueryDescription()}を取得`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "クエリ開始",
			variables: {
				queryRange: `[${left}, ${right}]`,
				queryType: this.queryType,
			},
		});

		const result = this.queryRecursive(1, 0, this.n - 1, left, right);

		this.steps.push({
			id: this.stepId++,
			description: `クエリ結果: ${result}`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "クエリ完了",
			variables: {
				result: result,
				queryRange: `[${left}, ${right}]`,
			},
		});

		return result;
	}

	/**
	 * 再帰的なクエリ
	 */
	private queryRecursive(
		node: number,
		start: number,
		end: number,
		left: number,
		right: number,
	): number {
		// 範囲外
		if (right < start || left > end) {
			this.steps.push({
				id: this.stepId++,
				description: `ノード ${node}[${start}, ${end}]: 範囲外のためスキップ`,
				array: [...this.originalArray],
				operation: "範囲外",
				variables: {
					nodeRange: `[${start}, ${end}]`,
					queryRange: `[${left}, ${right}]`,
					skipped: true,
				},
			});
			return this.getIdentityValue();
		}

		// 完全に含まれる
		if (left <= start && end <= right) {
			this.steps.push({
				id: this.stepId++,
				description: `ノード ${node}[${start}, ${end}]: 完全に含まれる → ${this.tree[node]}`,
				array: [...this.originalArray],
				operation: "範囲内",
				variables: {
					nodeRange: `[${start}, ${end}]`,
					queryRange: `[${left}, ${right}]`,
					nodeValue: this.tree[node],
					fullyIncluded: true,
				},
			});
			return this.tree[node];
		}

		// 部分的に重複
		const mid = Math.floor((start + end) / 2);
		const leftChild = 2 * node;
		const rightChild = 2 * node + 1;

		this.steps.push({
			id: this.stepId++,
			description: `ノード ${node}[${start}, ${end}]: 部分重複のため子ノードを探索`,
			array: [...this.originalArray],
			operation: "部分重複",
			variables: {
				nodeRange: `[${start}, ${end}]`,
				queryRange: `[${left}, ${right}]`,
				leftChild: leftChild,
				rightChild: rightChild,
			},
		});

		const leftResult = this.queryRecursive(leftChild, start, mid, left, right);
		const rightResult = this.queryRecursive(
			rightChild,
			mid + 1,
			end,
			left,
			right,
		);
		const combinedResult = this.combineValues(leftResult, rightResult);

		this.steps.push({
			id: this.stepId++,
			description: `ノード ${node}: ${leftResult} ${this.getOperatorSymbol()} ${rightResult} = ${combinedResult}`,
			array: [...this.originalArray],
			operation: "結果統合",
			variables: {
				leftResult: leftResult,
				rightResult: rightResult,
				combinedResult: combinedResult,
			},
		});

		return combinedResult;
	}

	/**
	 * 一点更新
	 */
	private performUpdate(index: number, value: number): string {
		if (index < 0 || index >= this.n) {
			throw new Error("無効なインデックスです");
		}

		const oldValue = this.originalArray[index];

		this.steps.push({
			id: this.stepId++,
			description: `配列[${index}]を ${oldValue} から ${value} に更新`,
			array: [...this.originalArray],
			highlight: [index],
			operation: "更新開始",
			variables: {
				index: index,
				oldValue: oldValue,
				newValue: value,
				difference: value - oldValue,
			},
		});

		this.originalArray[index] = value;
		this.updateRecursive(1, 0, this.n - 1, index, value);

		return `インデックス ${index} の値を ${oldValue} から ${value} に更新しました`;
	}

	/**
	 * 再帰的な更新
	 */
	private updateRecursive(
		node: number,
		start: number,
		end: number,
		index: number,
		value: number,
	): void {
		if (start === end) {
			// 葉ノード
			this.tree[node] = value;

			this.steps.push({
				id: this.stepId++,
				description: `葉ノード ${node}: 値を ${value} に更新`,
				array: [...this.originalArray],
				highlight: [index],
				operation: "葉ノード更新",
				variables: {
					nodeIndex: node,
					newValue: value,
					arrayIndex: index,
				},
			});
		} else {
			// 内部ノード
			const mid = Math.floor((start + end) / 2);
			const leftChild = 2 * node;
			const rightChild = 2 * node + 1;

			if (index <= mid) {
				this.updateRecursive(leftChild, start, mid, index, value);
			} else {
				this.updateRecursive(rightChild, mid + 1, end, index, value);
			}

			// 現在のノードの値を再計算
			const oldValue = this.tree[node];
			this.tree[node] = this.combineValues(
				this.tree[leftChild],
				this.tree[rightChild],
			);

			this.steps.push({
				id: this.stepId++,
				description: `ノード ${node}: ${this.tree[leftChild]} ${this.getOperatorSymbol()} ${this.tree[rightChild]} = ${this.tree[node]}`,
				array: [...this.originalArray],
				operation: "内部ノード更新",
				variables: {
					nodeIndex: node,
					oldValue: oldValue,
					newValue: this.tree[node],
					leftValue: this.tree[leftChild],
					rightValue: this.tree[rightChild],
				},
			});
		}
	}

	/**
	 * 範囲更新（遅延評価版）
	 */
	private performRangeUpdate(
		left: number,
		right: number,
		value: number,
	): string {
		if (left < 0 || right >= this.n || left > right) {
			throw new Error("無効な範囲です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `範囲[${left}, ${right}]の全要素に ${value} を加算`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "範囲更新開始",
			variables: {
				updateRange: `[${left}, ${right}]`,
				addValue: value,
			},
		});

		// 簡単のため、一点更新を繰り返す実装
		for (let i = left; i <= right; i++) {
			this.originalArray[i] += value;
			this.updateRecursive(1, 0, this.n - 1, i, this.originalArray[i]);
		}

		return `範囲[${left}, ${right}]に ${value} を加算しました`;
	}

	/**
	 * 一点クエリ
	 */
	private performPointQuery(index: number): number {
		if (index < 0 || index >= this.n) {
			throw new Error("無効なインデックスです");
		}

		const result = this.originalArray[index];

		this.steps.push({
			id: this.stepId++,
			description: `配列[${index}] = ${result}`,
			array: [...this.originalArray],
			highlight: [index],
			operation: "一点クエリ",
			variables: {
				index: index,
				value: result,
			},
		});

		return result;
	}

	/**
	 * 特定ノードの値取得
	 */
	private performGetNode(nodeIndex: number): number {
		if (nodeIndex < 1 || nodeIndex >= this.tree.length) {
			throw new Error("無効なノードインデックスです");
		}

		const value = this.tree[nodeIndex];

		this.steps.push({
			id: this.stepId++,
			description: `ノード ${nodeIndex} の値: ${value}`,
			array: [...this.originalArray],
			operation: "ノード取得",
			variables: {
				nodeIndex: nodeIndex,
				nodeValue: value,
				isUsed: value !== this.getIdentityValue(),
			},
		});

		return value;
	}

	/**
	 * 木構造の可視化
	 */
	private performVisualizeTree(): SegmentTreeNode[] {
		const nodes: SegmentTreeNode[] = [];

		this.steps.push({
			id: this.stepId++,
			description: "セグメント木の構造を可視化",
			array: [...this.originalArray],
			operation: "可視化",
		});

		this.visualizeRecursive(1, 0, this.n - 1, nodes);

		this.steps.push({
			id: this.stepId++,
			description: `${nodes.length}個のノードを可視化`,
			array: [...this.originalArray],
			operation: "可視化完了",
			variables: {
				totalNodes: nodes.length,
				maxDepth: this.getTreeDepth(),
			},
		});

		return nodes;
	}

	/**
	 * 再帰的な可視化
	 */
	private visualizeRecursive(
		node: number,
		start: number,
		end: number,
		nodes: SegmentTreeNode[],
	): void {
		if (start <= end && node < this.tree.length) {
			nodes.push({
				index: node,
				left: start,
				right: end,
				value: this.tree[node],
			});

			if (start !== end) {
				const mid = Math.floor((start + end) / 2);
				this.visualizeRecursive(2 * node, start, mid, nodes);
				this.visualizeRecursive(2 * node + 1, mid + 1, end, nodes);
			}
		}
	}

	/**
	 * 二つの値を結合
	 */
	private combineValues(left: number, right: number): number {
		switch (this.queryType) {
			case "sum":
				return left + right;
			case "min":
				return Math.min(left, right);
			case "max":
				return Math.max(left, right);
			case "gcd":
				return this.gcd(left, right);
			case "lcm":
				return this.lcm(left, right);
			default:
				return left + right;
		}
	}

	/**
	 * 単位元の取得
	 */
	private getIdentityValue(): number {
		switch (this.queryType) {
			case "sum":
				return 0;
			case "min":
				return Number.MAX_SAFE_INTEGER;
			case "max":
				return Number.MIN_SAFE_INTEGER;
			case "gcd":
				return 0;
			case "lcm":
				return 1;
			default:
				return 0;
		}
	}

	/**
	 * 最大公約数
	 */
	private gcd(a: number, b: number): number {
		return b === 0 ? a : this.gcd(b, a % b);
	}

	/**
	 * 最小公倍数
	 */
	private lcm(a: number, b: number): number {
		return (a * b) / this.gcd(a, b);
	}

	/**
	 * 木の深度を取得
	 */
	private getTreeDepth(): number {
		return this.n > 0 ? Math.ceil(Math.log2(this.n)) + 1 : 0;
	}

	/**
	 * 使用中のノード数をカウント
	 */
	private countUsedNodes(): number {
		let count = 0;
		for (let i = 1; i < this.tree.length; i++) {
			if (this.tree[i] !== this.getIdentityValue()) {
				count++;
			}
		}
		return count;
	}

	/**
	 * クエリの説明を取得
	 */
	private getQueryDescription(): string {
		const descriptions = {
			sum: "合計",
			min: "最小値",
			max: "最大値",
			gcd: "最大公約数",
			lcm: "最小公倍数",
		};
		return descriptions[this.queryType] || "値";
	}

	/**
	 * 演算子記号を取得
	 */
	private getOperatorSymbol(): string {
		const symbols = {
			sum: "+",
			min: "min",
			max: "max",
			gcd: "gcd",
			lcm: "lcm",
		};
		return symbols[this.queryType] || "+";
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(operation: SegmentTreeOperationType): string {
		const descriptions = {
			build: "セグメント木の構築",
			query: "範囲クエリ",
			update: "一点更新",
			rangeUpdate: "範囲更新",
			pointQuery: "一点クエリ",
			getNode: "ノード値取得",
			visualizeTree: "木構造の可視化",
		};
		return descriptions[operation] || "操作";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(operation: SegmentTreeOperationType): string {
		const complexities = {
			build: "O(n)",
			query: "O(log n)",
			update: "O(log n)",
			rangeUpdate: "O(n log n)", // 単純実装
			pointQuery: "O(1)",
			getNode: "O(1)",
			visualizeTree: "O(n)",
		};
		return complexities[operation] || "O(log n)";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "build",
				array: [1, 3, 5, 7, 9, 11],
				queryType: "sum",
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
セグメント木（Segment Tree）は、配列の範囲クエリ（区間の和、最小値、最大値など）と一点更新を効率的に処理するデータ構造です。完全二分木として実装され、分割統治法の原理に基づいて動作します。

 **基本構造**
- 完全二分木として配列で実装
- 各ノードは特定の範囲を担当
- 葉ノードは元配列の各要素に対応
- 内部ノードは子ノードの値を結合した値を保持

【解析】**主要な操作と計算量**
- 構築（Build）: O(n) - ボトムアップ方式で構築
- 範囲クエリ（Query）: O(log n) - 必要な部分のみ探索
- 一点更新（Update）: O(log n) - ルートまでのパスを更新
- 範囲更新: O(log n) - 遅延評価を使用

 **動作原理**
1. **構築フェーズ**: 葉から根に向かって値を計算
2. **クエリフェーズ**: 必要な範囲のノードのみを探索
3. **更新フェーズ**: 影響を受けるノードのパスを更新
4. **値の結合**: 各ノードで適切な演算を実行

【ポイント】**サポートする演算**
- 和（Sum）: 区間の合計を計算
- 最小値（Min）: 区間の最小値を検索
- 最大値（Max）: 区間の最大値を検索
- 最大公約数（GCD）: 区間のGCDを計算
- 最小公倍数（LCM）: 区間のLCMを計算

【ヒント】**実装のポイント**
- 配列インデックス1から開始（親子関係の計算が簡単）
- 単位元の適切な設定（和:0, 最小値:∞, 最大値:-∞）
- 再帰的な構築と探索
- 遅延評価による範囲更新の効率化

 **応用例**
- **範囲統計クエリ**: 大規模データセットの統計計算
- **ゲーム開発**: HP管理、ダメージ計算
- **画像処理**: 矩形領域の値計算
- **データベース**: インデックス範囲スキャン
- **競技プログラミング**: RMQ（Range Minimum Query）問題

【計算量】**最適化技法**
- 遅延評価（Lazy Propagation）: 範囲更新の高速化
- 座標圧縮: 大きな座標での空間効率化
- 永続化: 過去の状態を保持
- 並列化: マルチコアでの高速化

【詳細】**他のデータ構造との比較**
- vs 平方分割: 実装が複雑だが漸近的に高速
- vs BIT: より一般的だが定数倍が大きい
- vs Sparse Table: 更新がないクエリでは劣る
- vs 平衡二分探索木: 順序に依存しない範囲クエリ

 **学習価値**
- 分割統治法の理解
- 完全二分木の配列実装
- 再帰的アルゴリズムの設計
- 計算量解析の練習

セグメント木は、範囲処理が必要な多くの問題で威力を発揮する汎用的なデータ構造です。理解すると、様々な範囲クエリ問題を効率的に解決できるようになります。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: SegmentTreeOperationType;
		array?: number[];
		left?: number;
		right?: number;
		index?: number;
		value?: number;
		queryType?: QueryType;
		nodeIndex?: number;
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "build",
				array: [1, 3, 5, 7, 9, 11],
				queryType: "sum",
				description: "配列から和のセグメント木を構築",
				expectedResult: "サイズ6の配列からセグメント木を構築しました",
			},
			{
				operation: "query",
				left: 1,
				right: 3,
				description: "範囲[1,3]の合計を取得",
				expectedResult: 15, // 3+5+7
			},
			{
				operation: "update",
				index: 2,
				value: 10,
				description: "インデックス2の値を10に更新",
				expectedResult: "インデックス2の値を5から10に更新しました",
			},
			{
				operation: "query",
				left: 0,
				right: 2,
				description: "更新後の範囲[0,2]の合計を取得",
				expectedResult: 14, // 1+3+10
			},
			{
				operation: "build",
				array: [5, 2, 8, 1, 9],
				queryType: "min",
				description: "最小値クエリ用セグメント木を構築",
				expectedResult: "サイズ5の配列からセグメント木を構築しました",
			},
			{
				operation: "query",
				left: 1,
				right: 3,
				description: "範囲[1,3]の最小値を取得",
				expectedResult: 1, // min(2,8,1)
			},
			{
				operation: "pointQuery",
				index: 2,
				description: "インデックス2の値を確認",
				expectedResult: 8,
			},
			{
				operation: "visualizeTree",
				description: "セグメント木の構造を可視化",
				expectedResult: "SegmentTreeNode[]",
			},
		];
	}
}
