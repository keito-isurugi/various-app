/**
 * src/utils/algorithms/union-find.ts
 *
 * Union-Find（素集合データ構造）の実装
 * 効率的な集合の合併と同一集合判定を実現する森データ構造
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * Union-Find操作の種類
 */
type UnionFindOperationType =
	| "makeSet" // 新しい集合の作成
	| "find" // 集合の代表元検索
	| "union" // 二つの集合の合併
	| "connected" // 二つの要素の連結性判定
	| "initializeSet" // 指定サイズの初期化
	| "getComponents" // 全ての連結成分を取得
	| "getSize"; // 指定要素の集合サイズ取得

/**
 * Union-Findノードの状態を表す型
 */
interface UnionFindNode {
	element: number; // 要素の値
	parent: number; // 親ノードのインデックス
	rank: number; // ランク（深さの上限）
	size: number; // 集合のサイズ
}

/**
 * Union-Find（素集合データ構造）クラス
 *
 * 互いに素な集合の効率的な管理を行うデータ構造
 * パス圧縮とランクによる最適化により、ほぼO(1)での操作を実現
 * 時間計算量: O(α(n))（α：逆アッカーマン関数、実用的にはほぼ定数）
 * 空間計算量: O(n)
 */
export class UnionFindAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "union-find",
		name: "Union-Find（素集合データ構造）",
		description:
			"互いに素な集合の効率的な管理。パス圧縮とランク最適化により高速な合併・検索を実現",
		category: "data-structure",
		timeComplexity: {
			best: "O(1)", // 単純なケース
			average: "O(α(n))", // アッカーマン逆関数
			worst: "O(log n)", // 最適化なしの場合
		},
		difficulty: 3, // 中級（パス圧縮とランクの理解が必要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private parent: number[] = [];
	private rank: number[] = [];
	private size: number[] = [];
	private componentCount = 0;

	/**
	 * Union-Find操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as UnionFindOperationType;
		const x = input.parameters?.x as number | undefined;
		const y = input.parameters?.y as number | undefined;
		const setSize = input.parameters?.setSize as number | undefined;
		const element = input.parameters?.element as number | undefined;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `Union-Find操作開始：${this.getOperationDescription(operation)}を実行`,
			array: [],
			operation: "初期化",
			variables: {
				operation: operation,
				currentSets: this.componentCount,
				totalElements: this.parent.length,
				optimization: "パス圧縮 + ランクによる合併",
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "initializeSet":
				if (setSize !== undefined && setSize > 0) {
					result = this.performInitializeSet(setSize);
				} else {
					throw new Error("初期化には正の整数サイズが必要です");
				}
				break;

			case "makeSet":
				if (element !== undefined) {
					result = this.performMakeSet(element);
				} else {
					throw new Error("新しい集合作成には要素が必要です");
				}
				break;

			case "find":
				if (x !== undefined) {
					result = this.performFind(x);
				} else {
					throw new Error("検索には要素が必要です");
				}
				break;

			case "union":
				if (x !== undefined && y !== undefined) {
					result = this.performUnion(x, y);
				} else {
					throw new Error("合併には二つの要素が必要です");
				}
				break;

			case "connected":
				if (x !== undefined && y !== undefined) {
					result = this.performConnected(x, y);
				} else {
					throw new Error("連結性判定には二つの要素が必要です");
				}
				break;

			case "getComponents":
				result = this.performGetComponents();
				break;

			case "getSize":
				if (x !== undefined) {
					result = this.performGetSize(x);
				} else {
					throw new Error("サイズ取得には要素が必要です");
				}
				break;

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` Union-Find操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
			array: this.getVisualizationArray(),
			operation: "完了",
			variables: {
				result: result,
				totalSets: this.componentCount,
				maxRank: this.getMaxRank(),
				pathCompressionUsed: "有効",
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
				totalElements: this.parent.length,
				connectedComponents: this.componentCount,
				averageDepth: this.getAverageDepth(),
				totalSteps: this.steps.length,
			},
		};
	}

	/**
	 * 指定サイズでUnion-Findを初期化
	 */
	private performInitializeSet(setSize: number): string {
		this.parent = [];
		this.rank = [];
		this.size = [];
		this.componentCount = setSize;

		this.steps.push({
			id: this.stepId++,
			description: `サイズ ${setSize} でUnion-Findを初期化`,
			array: [],
			operation: "初期化開始",
			variables: {
				setSize: setSize,
				initialComponents: setSize,
			},
		});

		// 各要素を独立した集合として初期化
		for (let i = 0; i < setSize; i++) {
			this.parent[i] = i; // 自分自身が親（代表元）
			this.rank[i] = 0; // 初期ランクは0
			this.size[i] = 1; // 初期サイズは1

			this.steps.push({
				id: this.stepId++,
				description: `要素 ${i} を独立した集合として初期化`,
				array: this.getVisualizationArray(),
				highlight: [i],
				operation: "要素初期化",
				variables: {
					element: i,
					parent: i,
					rank: 0,
					size: 1,
				},
			});
		}

		return `${setSize}個の独立した集合を作成しました`;
	}

	/**
	 * 新しい集合の作成
	 */
	private performMakeSet(element: number): string {
		if (element < this.parent.length) {
			this.steps.push({
				id: this.stepId++,
				description: `要素 ${element} は既に存在します`,
				array: this.getVisualizationArray(),
				operation: "エラー",
			});
			return `要素 ${element} は既に存在します`;
		}

		// 新しい要素の領域を拡張
		while (this.parent.length <= element) {
			const newElement = this.parent.length;
			this.parent.push(newElement);
			this.rank.push(0);
			this.size.push(1);
			this.componentCount++;

			this.steps.push({
				id: this.stepId++,
				description: `要素 ${newElement} の新しい集合を作成`,
				array: this.getVisualizationArray(),
				highlight: [newElement],
				operation: "集合作成",
				variables: {
					newElement: newElement,
					parent: newElement,
					rank: 0,
					size: 1,
				},
			});
		}

		return `要素 ${element} の新しい集合を作成しました`;
	}

	/**
	 * 集合の代表元検索（パス圧縮あり）
	 */
	private performFind(x: number): number {
		if (x < 0 || x >= this.parent.length) {
			throw new Error("無効な要素です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `要素 ${x} の代表元を検索`,
			array: this.getVisualizationArray(),
			highlight: [x],
			operation: "検索開始",
			variables: {
				searchElement: x,
				currentParent: this.parent[x],
			},
		});

		const path: number[] = [];
		let current = x;

		// 代表元までのパスを記録
		while (this.parent[current] !== current) {
			path.push(current);
			current = this.parent[current];

			this.steps.push({
				id: this.stepId++,
				description: `要素 ${path[path.length - 1]} から親 ${current} へ移動`,
				array: this.getVisualizationArray(),
				highlight: path.concat([current]),
				operation: "親へ移動",
				variables: {
					currentElement: path[path.length - 1],
					parentElement: current,
					pathLength: path.length,
				},
			});
		}

		const root = current;

		// パス圧縮：経路上の全ての要素を直接ルートに接続
		if (path.length > 0) {
			this.steps.push({
				id: this.stepId++,
				description: `パス圧縮開始：経路上の要素を直接ルート ${root} に接続`,
				array: this.getVisualizationArray(),
				highlight: path.concat([root]),
				operation: "パス圧縮",
				variables: {
					root: root,
					pathElements: path,
					compressionBenefit: `深さ${path.length} → 深さ1`,
				},
			});

			for (const element of path) {
				const oldParent = this.parent[element];
				this.parent[element] = root;

				this.steps.push({
					id: this.stepId++,
					description: `要素 ${element} の親を ${oldParent} から ${root} に変更`,
					array: this.getVisualizationArray(),
					highlight: [element, root],
					operation: "親更新",
					variables: {
						element: element,
						oldParent: oldParent,
						newParent: root,
					},
				});
			}
		}

		return root;
	}

	/**
	 * 二つの集合の合併（ランクによる最適化）
	 */
	private performUnion(x: number, y: number): boolean {
		if (x < 0 || x >= this.parent.length || y < 0 || y >= this.parent.length) {
			throw new Error("無効な要素です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `要素 ${x} と ${y} の集合を合併`,
			array: this.getVisualizationArray(),
			highlight: [x, y],
			operation: "合併開始",
			variables: {
				element1: x,
				element2: y,
			},
		});

		// 各要素の代表元を検索
		const rootX = this.performFind(x);
		const rootY = this.performFind(y);

		// 既に同じ集合の場合
		if (rootX === rootY) {
			this.steps.push({
				id: this.stepId++,
				description: `要素 ${x} と ${y} は既に同じ集合（代表元: ${rootX}）`,
				array: this.getVisualizationArray(),
				highlight: [rootX],
				operation: "合併不要",
				variables: {
					commonRoot: rootX,
					alreadyConnected: true,
				},
			});
			return false;
		}

		// ランクによる合併：ランクの小さい木を大きい木に接続
		let newRoot: number;
		let attachedRoot: number;

		if (this.rank[rootX] < this.rank[rootY]) {
			this.parent[rootX] = rootY;
			this.size[rootY] += this.size[rootX];
			newRoot = rootY;
			attachedRoot = rootX;
		} else if (this.rank[rootX] > this.rank[rootY]) {
			this.parent[rootY] = rootX;
			this.size[rootX] += this.size[rootY];
			newRoot = rootX;
			attachedRoot = rootY;
		} else {
			// ランクが同じ場合：一方を他方に接続してランクを増加
			this.parent[rootY] = rootX;
			this.size[rootX] += this.size[rootY];
			this.rank[rootX]++;
			newRoot = rootX;
			attachedRoot = rootY;

			this.steps.push({
				id: this.stepId++,
				description: `ランクが同じため、${newRoot} のランクを ${this.rank[newRoot] - 1} から ${this.rank[newRoot]} に増加`,
				array: this.getVisualizationArray(),
				operation: "ランク増加",
				variables: {
					root: newRoot,
					newRank: this.rank[newRoot],
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: `集合 ${attachedRoot} を集合 ${newRoot} に合併`,
			array: this.getVisualizationArray(),
			highlight: [newRoot, attachedRoot],
			operation: "集合合併",
			variables: {
				newRoot: newRoot,
				attachedRoot: attachedRoot,
				newSize: this.size[newRoot],
				rankX: this.rank[rootX],
				rankY: this.rank[rootY],
			},
		});

		this.componentCount--;
		return true;
	}

	/**
	 * 二つの要素の連結性判定
	 */
	private performConnected(x: number, y: number): boolean {
		if (x < 0 || x >= this.parent.length || y < 0 || y >= this.parent.length) {
			throw new Error("無効な要素です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `要素 ${x} と ${y} の連結性を判定`,
			array: this.getVisualizationArray(),
			highlight: [x, y],
			operation: "連結性判定",
		});

		const rootX = this.performFind(x);
		const rootY = this.performFind(y);
		const isConnected = rootX === rootY;

		this.steps.push({
			id: this.stepId++,
			description: `判定結果: ${isConnected ? "連結" : "非連結"}`,
			array: this.getVisualizationArray(),
			highlight: isConnected ? [rootX] : [rootX, rootY],
			operation: "判定結果",
			variables: {
				element1: x,
				element2: y,
				root1: rootX,
				root2: rootY,
				connected: isConnected,
			},
		});

		return isConnected;
	}

	/**
	 * 全ての連結成分を取得
	 */
	private performGetComponents(): number[][] {
		this.steps.push({
			id: this.stepId++,
			description: "全ての連結成分を取得",
			array: this.getVisualizationArray(),
			operation: "成分取得",
		});

		const components: Map<number, number[]> = new Map();

		// 各要素の代表元を求めて分類
		for (let i = 0; i < this.parent.length; i++) {
			const root = this.performFind(i);
			if (!components.has(root)) {
				components.set(root, []);
			}
			components.get(root)?.push(i);
		}

		const result = Array.from(components.values());

		this.steps.push({
			id: this.stepId++,
			description: `${result.length}個の連結成分を発見`,
			array: this.getVisualizationArray(),
			operation: "成分分類",
			variables: {
				componentCount: result.length,
				components: result.map(
					(comp, idx) => `成分${idx + 1}: [${comp.join(", ")}]`,
				),
				sizes: result.map((comp) => comp.length),
			},
		});

		return result;
	}

	/**
	 * 指定要素の集合サイズ取得
	 */
	private performGetSize(x: number): number {
		if (x < 0 || x >= this.parent.length) {
			throw new Error("無効な要素です");
		}

		this.steps.push({
			id: this.stepId++,
			description: `要素 ${x} の集合サイズを取得`,
			array: this.getVisualizationArray(),
			highlight: [x],
			operation: "サイズ取得",
		});

		const root = this.performFind(x);
		const setSize = this.size[root];

		this.steps.push({
			id: this.stepId++,
			description: `要素 ${x} の集合サイズ: ${setSize}`,
			array: this.getVisualizationArray(),
			highlight: [root],
			operation: "サイズ確認",
			variables: {
				element: x,
				root: root,
				size: setSize,
			},
		});

		return setSize;
	}

	/**
	 * 可視化用の配列を生成
	 */
	private getVisualizationArray(): number[] {
		return [...this.parent];
	}

	/**
	 * 最大ランクを取得
	 */
	private getMaxRank(): number {
		return this.rank.length > 0 ? Math.max(...this.rank) : 0;
	}

	/**
	 * 平均深度を計算
	 */
	private getAverageDepth(): number {
		if (this.parent.length === 0) return 0;

		let totalDepth = 0;
		for (let i = 0; i < this.parent.length; i++) {
			let depth = 0;
			let current = i;
			while (this.parent[current] !== current) {
				depth++;
				current = this.parent[current];
			}
			totalDepth += depth;
		}

		return Math.round((totalDepth / this.parent.length) * 100) / 100;
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(operation: UnionFindOperationType): string {
		const descriptions = {
			makeSet: "新しい集合の作成",
			find: "代表元の検索",
			union: "集合の合併",
			connected: "連結性の判定",
			initializeSet: "Union-Findの初期化",
			getComponents: "連結成分の取得",
			getSize: "集合サイズの取得",
		};
		return descriptions[operation] || "操作";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(operation: UnionFindOperationType): string {
		const complexities = {
			makeSet: "O(1)",
			find: "O(α(n))",
			union: "O(α(n))",
			connected: "O(α(n))",
			initializeSet: "O(n)",
			getComponents: "O(n α(n))",
			getSize: "O(α(n))",
		};
		return complexities[operation] || "O(α(n))";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "initializeSet",
				setSize: 6,
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
Union-Find（素集合データ構造、Disjoint Set Union）は、互いに素な集合の効率的な管理を行うデータ構造です。「どの要素がどの集合に属するか」を高速に判定し、異なる集合を効率的に合併することができます。

 **基本概念**
- 各集合を木構造で表現（森データ構造）
- 各要素は親へのポインタを持つ
- 集合の代表元（ルート）は自分自身を親とする
- 同じ代表元を持つ要素は同じ集合に属する

【計算量】**主要な最適化技法**
1. **パス圧縮（Path Compression）**
   - Find操作時に経路上の全ノードを直接ルートに接続
   - 木の深度を劇的に削減
   - 後続のFind操作を高速化

2. **ランクによる合併（Union by Rank）**
   - 浅い木を深い木に接続
   - 木の深度の増加を最小限に抑制
   - バランスの取れた森構造を維持

【解析】**操作と計算量**
- MakeSet: O(1) - 新しい集合の作成
- Find: O(α(n)) - 代表元の検索（パス圧縮込み）
- Union: O(α(n)) - 二つの集合の合併
- Connected: O(α(n)) - 連結性の判定
- α(n)：逆アッカーマン関数（実用的にはほぼ定数）

 **動作原理**
1. **初期化**: 各要素を独立した集合として初期化
2. **Find**: 代表元までの経路を辿り、パス圧縮を実行
3. **Union**: 各集合の代表元を求めて、ランクに基づいて合併
4. **Connected**: 二つの要素の代表元が同じかを判定

 **実用的な応用**
- **グラフの連結性判定**: 無向グラフの連結成分
- **クラスカル法**: 最小全域木アルゴリズム
- **画像処理**: 連結成分ラベリング
- **ネットワーク**: ノード間の到達可能性
- **ゲーム**: 領域の連結判定（囲碁、オセロなど）

【詳細】**実装のポイント**
- 配列インデックスによる効率的な実装
- パス圧縮の再帰的または反復的実装
- ランクと木の高さの違いの理解
- 境界条件とエラーハンドリング

【ヒント】**理論的特性**
- m回の操作（Find/Union）に対してO(m α(n))
- α(n) ≤ 4（n ≤ 2^65536の範囲）
- 実用的には定数時間と見なせる性能
- 最適なオンラインアルゴリズム

【実装】**バリエーション**
- Union by Size: サイズによる合併
- Weighted Union-Find: 重み付き版
- Persistent Union-Find: 永続化版
- Parallel Union-Find: 並列処理版

Union-Findは、シンプルな実装でありながら理論的に最適な性能を発揮する美しいデータ構造です。多くのグラフアルゴリズムの基盤として重要な役割を果たしています。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: UnionFindOperationType;
		x?: number;
		y?: number;
		setSize?: number;
		element?: number;
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "initializeSet",
				setSize: 6,
				description: "6個の独立した集合を初期化",
				expectedResult: "6個の独立した集合を作成しました",
			},
			{
				operation: "union",
				x: 0,
				y: 1,
				description: "要素0と1の集合を合併",
				expectedResult: true,
			},
			{
				operation: "union",
				x: 2,
				y: 3,
				description: "要素2と3の集合を合併",
				expectedResult: true,
			},
			{
				operation: "union",
				x: 0,
				y: 2,
				description: "要素0と2の集合を合併（間接的に4つの要素が連結）",
				expectedResult: true,
			},
			{
				operation: "connected",
				x: 1,
				y: 3,
				description: "要素1と3の連結性を確認",
				expectedResult: true,
			},
			{
				operation: "connected",
				x: 0,
				y: 4,
				description: "要素0と4の連結性を確認（非連結）",
				expectedResult: false,
			},
			{
				operation: "find",
				x: 1,
				description: "要素1の代表元を検索",
				expectedResult: 0,
			},
			{
				operation: "getSize",
				x: 0,
				description: "要素0の集合サイズを取得",
				expectedResult: 4,
			},
			{
				operation: "getComponents",
				description: "全ての連結成分を取得",
				expectedResult: [[0, 1, 2, 3], [4], [5]],
			},
		];
	}
}
