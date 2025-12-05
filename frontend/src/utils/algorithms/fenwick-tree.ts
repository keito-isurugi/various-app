/**
 * src/utils/algorithms/fenwick-tree.ts
 *
 * Fenwick Tree（Binary Indexed Tree, BIT）の実装
 * 累積和の効率的な計算と一点更新を実現する特殊な木構造
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * Fenwick Tree操作の種類
 */
type FenwickTreeOperationType =
	| "build" // Fenwick Treeの構築
	| "update" // 一点更新（加算）
	| "query" // 累積和クエリ
	| "rangeQuery" // 範囲和クエリ
	| "set" // 一点設定
	| "get" // 一点取得
	| "visualizeBits" // ビット操作の可視化
	| "showStructure"; // 内部構造の表示

/**
 * Fenwick Treeノードの状態を表す型
 */
interface FenwickNode {
	index: number; // 1-basedインデックス
	value: number; // ノードの値
	range: string; // 担当範囲
	binaryIndex: string; // 二進表現
	parent?: number; // 親ノードのインデックス
	children: number[]; // 子ノードのインデックス
}

/**
 * Fenwick Tree（Binary Indexed Tree）データ構造クラス
 *
 * 累積和の効率的な計算と一点更新を実現する特殊な木構造
 * ビット演算を用いた巧妙な実装により、シンプルながら高性能
 * 時間計算量: 構築O(n log n)、クエリ・更新O(log n)
 * 空間計算量: O(n)
 */
export class FenwickTreeAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "fenwick-tree",
		name: "Fenwick Tree（Binary Indexed Tree）",
		description:
			"累積和の効率的な計算と一点更新。ビット演算による巧妙な実装で高速な区間和クエリを実現",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // 単純な取得
			average: "O(log n)", // 通常のクエリ・更新
			worst: "O(n log n)", // 構築時
		},
		difficulty: 4, // 上級（ビット演算の理解が必要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private tree: number[] = []; // 1-basedで使用
	private originalArray: number[] = [];
	private n = 0; // 配列サイズ

	/**
	 * Fenwick Tree操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as FenwickTreeOperationType;
		const array = input.parameters?.array as number[] | undefined;
		const index = input.parameters?.index as number | undefined;
		const value = input.parameters?.value as number | undefined;
		const left = input.parameters?.left as number | undefined;
		const right = input.parameters?.right as number | undefined;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `Fenwick Tree操作開始：${this.getOperationDescription(operation)}を実行`,
			array: this.originalArray.length > 0 ? [...this.originalArray] : [],
			operation: "初期化",
			variables: {
				operation: operation,
				currentSize: this.originalArray.length,
				treeSize: this.tree.length,
				indexBased: "1-based indexing",
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

			case "update":
				if (index !== undefined && value !== undefined) {
					result = this.performUpdate(index, value);
				} else {
					throw new Error("更新にはインデックスと値が必要です");
				}
				break;

			case "query":
				if (index !== undefined) {
					result = this.performQuery(index);
				} else {
					throw new Error("累積和クエリにはインデックスが必要です");
				}
				break;

			case "rangeQuery":
				if (left !== undefined && right !== undefined) {
					result = this.performRangeQuery(left, right);
				} else {
					throw new Error("範囲和クエリには範囲が必要です");
				}
				break;

			case "set":
				if (index !== undefined && value !== undefined) {
					result = this.performSet(index, value);
				} else {
					throw new Error("設定にはインデックスと値が必要です");
				}
				break;

			case "get":
				if (index !== undefined) {
					result = this.performGet(index);
				} else {
					throw new Error("取得にはインデックスが必要です");
				}
				break;

			case "visualizeBits":
				if (index !== undefined) {
					result = this.performVisualizeBits(index);
				} else {
					throw new Error("ビット可視化にはインデックスが必要です");
				}
				break;

			case "showStructure":
				result = this.performShowStructure();
				break;

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` Fenwick Tree操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
			array: [...this.originalArray],
			operation: "完了",
			variables: {
				result: result,
				totalElements: this.originalArray.length,
				treeDepth: Math.floor(Math.log2(this.n)) + 1,
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
				operationResult: result,
				arraySize: this.originalArray.length,
				totalQueries: this.steps.length,
				averageQueryTime: "O(log n)",
				totalSteps: this.steps.length,
			},
		};
	}

	/**
	 * Fenwick Treeの構築
	 */
	private performBuild(array: number[]): string {
		this.originalArray = [...array];
		this.n = array.length;
		this.tree = new Array(this.n + 1).fill(0); // 1-basedのため +1

		this.steps.push({
			id: this.stepId++,
			description: `配列 [${array.join(", ")}] からFenwick Treeを構築`,
			array: [...array],
			operation: "構築開始",
			variables: {
				originalArray: array,
				arraySize: this.n,
				treeSize: this.tree.length,
				indexingStyle: "1-based",
			},
		});

		// 各要素を順次追加してFenwick Treeを構築
		for (let i = 0; i < this.n; i++) {
			this.addToTree(i + 1, array[i]); // 1-basedインデックス
		}

		this.steps.push({
			id: this.stepId++,
			description: "Fenwick Treeの構築が完了",
			array: [...this.originalArray],
			operation: "構築完了",
			variables: {
				treeArray: this.tree.slice(1), // 0番目を除く
				totalSum: this.tree.slice(1).reduce((sum, val) => sum + val, 0),
				constructionMethod: "逐次追加方式",
			},
		});

		return `サイズ ${this.n} の配列からFenwick Treeを構築しました`;
	}

	/**
	 * 一点更新（加算）
	 */
	private performUpdate(index: number, value: number): string {
		if (index < 0 || index >= this.n) {
			throw new Error("無効なインデックスです");
		}

		const oldValue = this.originalArray[index];
		const delta = value;

		this.steps.push({
			id: this.stepId++,
			description: `配列[${index}]に ${value} を加算（${oldValue} → ${oldValue + value}）`,
			array: [...this.originalArray],
			highlight: [index],
			operation: "更新開始",
			variables: {
				index: index,
				oldValue: oldValue,
				addValue: value,
				newValue: oldValue + value,
				delta: delta,
			},
		});

		this.originalArray[index] += value;
		this.addToTree(index + 1, delta); // 1-basedインデックス

		return `インデックス ${index} に ${value} を加算しました`;
	}

	/**
	 * Fenwick Treeに値を追加（内部用）
	 */
	private addToTree(index: number, value: number): void {
		const originalIndex = index;

		this.steps.push({
			id: this.stepId++,
			description: `Fenwick Tree更新開始：インデックス ${index} から値 ${value} を追加`,
			array: [...this.originalArray],
			operation: "tree更新開始",
			variables: {
				startIndex: index,
				addValue: value,
				binaryStart: index.toString(2).padStart(8, "0"),
			},
		});

		let currentIndex = index;
		while (currentIndex <= this.n) {
			const oldTreeValue = this.tree[currentIndex];
			this.tree[currentIndex] += value;

			this.steps.push({
				id: this.stepId++,
				description: `tree[${currentIndex}]: ${oldTreeValue} + ${value} = ${this.tree[currentIndex]}`,
				array: [...this.originalArray],
				operation: "tree更新",
				variables: {
					treeIndex: currentIndex,
					oldValue: oldTreeValue,
					newValue: this.tree[currentIndex],
					addedValue: value,
					binaryIndex: currentIndex.toString(2).padStart(8, "0"),
					nextIndex: currentIndex + this.lowbit(currentIndex),
					lowbit: this.lowbit(currentIndex),
				},
			});

			// 次のインデックスに移動（lowbit操作）
			currentIndex += this.lowbit(currentIndex);
		}

		this.steps.push({
			id: this.stepId++,
			description: `更新完了：${originalIndex} から始まって影響を受けたノードを全て更新`,
			array: [...this.originalArray],
			operation: "tree更新完了",
			variables: {
				originalIndex: originalIndex,
				finalTreeState: this.tree.slice(1),
			},
		});
	}

	/**
	 * 累積和クエリ（0からindexまで）
	 */
	private performQuery(index: number): number {
		if (index < 0 || index >= this.n) {
			throw new Error("無効なインデックスです");
		}

		this.steps.push({
			id: this.stepId++,
			description: `累積和クエリ：配列[0]から配列[${index}]までの合計を計算`,
			array: [...this.originalArray],
			highlight: Array.from({ length: index + 1 }, (_, i) => i),
			operation: "クエリ開始",
			variables: {
				queryRange: `[0, ${index}]`,
				expectedElements: index + 1,
			},
		});

		let sum = 0;
		let currentIndex = index + 1; // 1-basedインデックス

		while (currentIndex > 0) {
			const treeValue = this.tree[currentIndex];
			sum += treeValue;

			this.steps.push({
				id: this.stepId++,
				description: `tree[${currentIndex}] = ${treeValue} を合計に追加（累計: ${sum}）`,
				array: [...this.originalArray],
				operation: "累積和計算",
				variables: {
					treeIndex: currentIndex,
					treeValue: treeValue,
					currentSum: sum,
					binaryIndex: currentIndex.toString(2).padStart(8, "0"),
					nextIndex: currentIndex - this.lowbit(currentIndex),
					lowbit: this.lowbit(currentIndex),
				},
			});

			// 次のインデックスに移動（lowbit操作）
			currentIndex -= this.lowbit(currentIndex);
		}

		this.steps.push({
			id: this.stepId++,
			description: `累積和計算完了：結果 = ${sum}`,
			array: [...this.originalArray],
			highlight: Array.from({ length: index + 1 }, (_, i) => i),
			operation: "クエリ完了",
			variables: {
				finalSum: sum,
				rangeSize: index + 1,
				traversedNodes: Math.floor(Math.log2(index + 1)) + 1,
			},
		});

		return sum;
	}

	/**
	 * 範囲和クエリ（leftからrightまで）
	 */
	private performRangeQuery(left: number, right: number): number {
		if (left < 0 || right >= this.n || left > right) {
			throw new Error("無効な範囲です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `範囲和クエリ：配列[${left}]から配列[${right}]までの合計を計算`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "範囲クエリ開始",
			variables: {
				leftIndex: left,
				rightIndex: right,
				rangeSize: right - left + 1,
				method: "sum(right) - sum(left-1)",
			},
		});

		const rightSum = this.performQuery(right);
		const leftSum = left > 0 ? this.performQuery(left - 1) : 0;
		const result = rightSum - leftSum;

		this.steps.push({
			id: this.stepId++,
			description: `範囲和計算：${rightSum} - ${leftSum} = ${result}`,
			array: [...this.originalArray],
			highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
			operation: "範囲クエリ完了",
			variables: {
				rightSum: rightSum,
				leftSum: leftSum,
				rangeSum: result,
				formula: `sum(${right}) - sum(${left - 1})`,
			},
		});

		return result;
	}

	/**
	 * 一点設定
	 */
	private performSet(index: number, value: number): string {
		if (index < 0 || index >= this.n) {
			throw new Error("無効なインデックスです");
		}

		const oldValue = this.originalArray[index];
		const delta = value - oldValue;

		this.steps.push({
			id: this.stepId++,
			description: `配列[${index}]を ${oldValue} から ${value} に設定（差分: ${delta}）`,
			array: [...this.originalArray],
			highlight: [index],
			operation: "設定開始",
			variables: {
				index: index,
				oldValue: oldValue,
				newValue: value,
				delta: delta,
			},
		});

		if (delta !== 0) {
			this.originalArray[index] = value;
			this.addToTree(index + 1, delta);
		}

		return `インデックス ${index} を ${value} に設定しました`;
	}

	/**
	 * 一点取得
	 */
	private performGet(index: number): number {
		if (index < 0 || index >= this.n) {
			throw new Error("無効なインデックスです");
		}

		const value = this.originalArray[index];

		this.steps.push({
			id: this.stepId++,
			description: `配列[${index}] = ${value}`,
			array: [...this.originalArray],
			highlight: [index],
			operation: "値取得",
			variables: {
				index: index,
				value: value,
			},
		});

		return value;
	}

	/**
	 * ビット操作の可視化
	 */
	private performVisualizeBits(index: number): any {
		if (index < 1 || index > this.n) {
			throw new Error("無効なインデックスです（1-basedで指定）");
		}

		this.steps.push({
			id: this.stepId++,
			description: `インデックス ${index} のビット操作を可視化`,
			array: [...this.originalArray],
			operation: "ビット可視化",
		});

		const binary = index.toString(2).padStart(8, "0");
		const lowbitValue = this.lowbit(index);
		const lowbitBinary = lowbitValue.toString(2).padStart(8, "0");
		const nextUpdate = index + lowbitValue;
		const nextQuery = index - lowbitValue;

		this.steps.push({
			id: this.stepId++,
			description: `インデックス ${index} のビット分析完了`,
			array: [...this.originalArray],
			operation: "ビット分析",
			variables: {
				index: index,
				binary: binary,
				lowbit: lowbitValue,
				lowbitBinary: lowbitBinary,
				nextUpdateIndex: nextUpdate > this.n ? "範囲外" : nextUpdate,
				nextQueryIndex: nextQuery <= 0 ? "終了" : nextQuery,
				responsibility: this.getResponsibilityRange(index),
			},
		});

		return {
			index: index,
			binary: binary,
			lowbit: lowbitValue,
			lowbitBinary: lowbitBinary,
			nextUpdate: nextUpdate,
			nextQuery: nextQuery,
		};
	}

	/**
	 * 内部構造の表示
	 */
	private performShowStructure(): FenwickNode[] {
		this.steps.push({
			id: this.stepId++,
			description: "Fenwick Treeの内部構造を表示",
			array: [...this.originalArray],
			operation: "構造表示",
		});

		const nodes: FenwickNode[] = [];

		for (let i = 1; i <= this.n; i++) {
			const node: FenwickNode = {
				index: i,
				value: this.tree[i],
				range: this.getResponsibilityRange(i),
				binaryIndex: i.toString(2).padStart(8, "0"),
				children: [],
			};

			// 子ノードを見つける
			for (let j = 1; j <= this.n; j++) {
				if (j !== i && j + this.lowbit(j) === i) {
					node.children.push(j);
				}
			}

			// 親ノードを見つける
			const parent = i + this.lowbit(i);
			if (parent <= this.n) {
				node.parent = parent;
			}

			nodes.push(node);
		}

		this.steps.push({
			id: this.stepId++,
			description: `${nodes.length}個のノードの構造分析完了`,
			array: [...this.originalArray],
			operation: "構造分析完了",
			variables: {
				totalNodes: nodes.length,
				leafNodes: nodes.filter((n) => n.children.length === 0).length,
				rootNodes: nodes.filter((n) => n.parent === undefined).length,
			},
		});

		return nodes;
	}

	/**
	 * lowbit操作（最下位の1ビットを取得）
	 */
	private lowbit(x: number): number {
		return x & -x;
	}

	/**
	 * ノードの担当範囲を取得
	 */
	private getResponsibilityRange(index: number): string {
		const lowbitValue = this.lowbit(index);
		const start = index - lowbitValue + 1;
		const end = index;
		return `[${start}, ${end}]`;
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(operation: FenwickTreeOperationType): string {
		const descriptions = {
			build: "Fenwick Treeの構築",
			update: "一点更新（加算）",
			query: "累積和クエリ",
			rangeQuery: "範囲和クエリ",
			set: "一点設定",
			get: "一点取得",
			visualizeBits: "ビット操作の可視化",
			showStructure: "内部構造の表示",
		};
		return descriptions[operation] || "操作";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(operation: FenwickTreeOperationType): string {
		const complexities = {
			build: "O(n log n)",
			update: "O(log n)",
			query: "O(log n)",
			rangeQuery: "O(log n)",
			set: "O(log n)",
			get: "O(1)",
			visualizeBits: "O(1)",
			showStructure: "O(n)",
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
				array: [1, 3, 5, 7, 9, 11, 13, 15],
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
Fenwick Tree（Binary Indexed Tree, BIT）は、累積和の効率的な計算と一点更新を実現するデータ構造です。1994年にPeter Fenwickによって発明され、ビット演算を用いた巧妙な実装により、シンプルながら非常に高性能を発揮します。

【数値】**基本概念**
- 配列の累積和を効率的に管理
- 1-basedインデックスで実装
- 各ノードが特定の範囲の和を保持
- ビット演算による親子関係の高速計算

【計算量】**核心となるlowbit操作**
- lowbit(x) = x & (-x)
- 最下位の1ビットを抽出
- 更新: index += lowbit(index)
- クエリ: index -= lowbit(index)

【解析】**主要な操作と計算量**
- 構築: O(n log n) - 各要素を逐次追加
- 一点更新: O(log n) - 影響するノードのパスを更新
- 累積和クエリ: O(log n) - 必要なノードの和を計算
- 範囲和クエリ: O(log n) - sum(r) - sum(l-1)

 **木構造の特性**
- 完全二分木ではない特殊な構造
- 各ノードは2^k個の要素を担当
- 親子関係がビット演算で決まる
- メモリ効率が良い（配列実装）

【ポイント】**動作原理**
1. **更新時**: 影響を受ける全ての祖先ノードを更新
2. **クエリ時**: 必要な部分の和をビット操作で高速収集
3. **範囲クエリ**: 累積和の差分を利用
4. **ビット操作**: lowbit関数による効率的な移動

【ヒント】**実装のポイント**
- 1-basedインデックスの使用（計算の簡単化）
- lowbit操作の理解と正確な実装
- オーバーフローの考慮
- 初期化方法の選択（逐次追加 vs 直接構築）

 **Fenwick Treeの優位性**
- **実装の簡潔性**: セグメント木より短いコード
- **定数倍の高速性**: 実際の実行時間が速い
- **メモリ効率**: セグメント木の1/4のメモリ使用量
- **ビット操作**: ハードウェアレベルでの最適化

【詳細】**セグメント木との比較**
- **Fenwick Tree**: 累積和特化、実装簡単、高速
- **セグメント木**: 汎用的、任意の結合演算、構築O(n)
- **用途**: 累積和のみならFenwick Tree、その他はセグメント木

【応用】**応用例**
- **累積和計算**: 大規模データの範囲和クエリ
- **座標圧縮**: 大きな座標での累積カウント
- **転倒数計算**: ソートアルゴリズムの効率解析
- **動的ランキング**: リアルタイムランク計算
- **イベント処理**: タイムラインの集計処理

 **学習価値**
- ビット演算の実践的応用
- 効率的なデータ構造設計
- 累積和という基本概念の深い理解
- 実装の簡潔性と性能の両立

【設定】**最適化技法**
- **2D Fenwick Tree**: 二次元累積和
- **Range Update**: 区間更新のサポート
- **圧縮座標**: 大きな座標空間での効率化
- **並列化**: マルチコアでの高速化

Fenwick Treeは、累積和という特定の問題に特化することで、極めて効率的な解法を提供します。ビット演算の美しい応用例として、アルゴリズム学習者にとって重要な知識です。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: FenwickTreeOperationType;
		array?: number[];
		index?: number;
		value?: number;
		left?: number;
		right?: number;
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "build",
				array: [1, 3, 5, 7, 9, 11, 13, 15],
				description: "配列からFenwick Treeを構築",
				expectedResult: "サイズ8の配列からFenwick Treeを構築しました",
			},
			{
				operation: "query",
				index: 3,
				description: "インデックス3までの累積和を取得",
				expectedResult: 16, // 1+3+5+7
			},
			{
				operation: "update",
				index: 2,
				value: 10,
				description: "インデックス2に10を加算",
				expectedResult: "インデックス2に10を加算しました",
			},
			{
				operation: "query",
				index: 3,
				description: "更新後の累積和を確認",
				expectedResult: 26, // 1+3+15+7
			},
			{
				operation: "rangeQuery",
				left: 1,
				right: 4,
				description: "範囲[1,4]の合計を取得",
				expectedResult: 32, // 3+15+7+9
			},
			{
				operation: "set",
				index: 0,
				value: 100,
				description: "インデックス0を100に設定",
				expectedResult: "インデックス0を100に設定しました",
			},
			{
				operation: "get",
				index: 2,
				description: "インデックス2の値を取得",
				expectedResult: 15,
			},
			{
				operation: "visualizeBits",
				index: 6,
				description: "インデックス6のビット操作を可視化",
				expectedResult: "ビット操作オブジェクト",
			},
			{
				operation: "showStructure",
				description: "Fenwick Treeの内部構造を表示",
				expectedResult: "FenwickNode[]",
			},
		];
	}
}
