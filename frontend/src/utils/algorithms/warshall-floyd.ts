import type {
	Algorithm,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
	GraphData,
} from "@/types/algorithm";

/**
 * ワーシャルフロイド法のアルゴリズム実装
 * 全点間最短経路問題を解く
 */
export class WarshallFloydAlgorithm implements Algorithm {
	readonly info = {
		id: "warshall-floyd",
		name: "ワーシャルフロイド法",
		description: "全点間最短経路問題を解くアルゴリズム",
		category: "graph" as const,
		timeComplexity: {
			best: "O(V³)",
			average: "O(V³)",
			worst: "O(V³)",
		},
		spaceComplexity: "O(V²)",
		difficulty: 3,
	};

	execute(input: AlgorithmInput): AlgorithmResult {
		const { graph } = input;

		// GraphData形式のチェック
		if (
			!graph ||
			typeof graph !== "object" ||
			!("nodes" in graph) ||
			!("edges" in graph)
		) {
			return {
				steps: [],
				result: { error: "グラフが入力されていません（GraphData形式が必要）" },
			};
		}

		const graphData = graph as GraphData;
		if (!graphData.nodes || graphData.nodes.length === 0) {
			return {
				steps: [],
				result: { error: "グラフが入力されていません" },
			};
		}

		const n = graphData.nodes.length;
		const steps: AlgorithmStep[] = [];

		// 距離行列の初期化
		const distances = Array.from({ length: n }, () =>
			Array(n).fill(Number.POSITIVE_INFINITY),
		);

		// 自己ループは0
		for (let i = 0; i < n; i++) {
			distances[i][i] = 0;
		}

		// 辺の重みを設定
		if (graphData.edges) {
			for (const edge of graphData.edges) {
				distances[edge.from][edge.to] = edge.weight;
			}
		}

		steps.push({
			id: 0,
			description: "距離行列を初期化しました",
			state: {
				distances: distances.map((row) => [...row]),
				phase: "初期化",
			},
		});

		// ワーシャルフロイド法のメインループ
		for (let k = 0; k < n; k++) {
			steps.push({
				id: k + 1,
				description: `中継点として ${graphData.nodes[k]} を選択`,
				state: {
					distances: distances.map((row) => [...row]),
					intermediate: k,
					phase: `中継点: ${graphData.nodes[k]}`,
				},
			});

			for (let i = 0; i < n; i++) {
				for (let j = 0; j < n; j++) {
					const newDistance = distances[i][k] + distances[k][j];

					if (newDistance < distances[i][j]) {
						distances[i][j] = newDistance;

						steps.push({
							id: steps.length,
							description: `${graphData.nodes[i]} → ${graphData.nodes[j]} の距離を ${newDistance} に更新（${graphData.nodes[k]} 経由）`,
							state: {
								distances: distances.map((row) => [...row]),
								from: i,
								to: j,
								intermediate: k,
								oldDistance: distances[i][j],
								newDistance,
							},
						});
					}
				}
			}
		}

		// 負の閉路検出
		let hasNegativeCycle = false;
		for (let i = 0; i < n; i++) {
			if (distances[i][i] < 0) {
				hasNegativeCycle = true;
				break;
			}
		}

		if (hasNegativeCycle) {
			steps.push({
				id: steps.length,
				description: "負の閉路が検出されました",
				state: {
					distances: distances.map((row) => [...row]),
					hasNegativeCycle: true,
				},
			});
		} else {
			steps.push({
				id: steps.length,
				description: "全点間最短経路の計算が完了しました",
				state: {
					distances: distances.map((row) => [...row]),
					hasNegativeCycle: false,
				},
			});
		}

		return {
			steps,
			result: {
				distances,
				hasNegativeCycle,
			},
		};
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return WarshallFloydAlgorithm.getDefaultInput();
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
ワーシャルフロイド法は、全点間最短経路問題を解く動的計画法のアルゴリズムです。

🔍 **基本原理**
1. 各頂点を中継点として考慮
2. 中継点を経由する経路と直接経路を比較
3. より短い経路で距離行列を更新
4. 全ての頂点を中継点として処理

📈 **効率性**
- O(V³)の時間計算量
- 負の重みも扱え、負の閉路も検出可能
- 密グラフに適している

🎯 **実用例**
- 道路網の全点間最短距離計算
- ネットワークの到達可能性分析
- 為替レートの裁定取引検出
		`.trim();
	}

	/**
	 * デフォルトの入力値を生成
	 */
	static getDefaultInput(): AlgorithmInput {
		return {
			graph: {
				nodes: ["A", "B", "C", "D"],
				edges: [
					{ from: 0, to: 1, weight: 5 },
					{ from: 0, to: 3, weight: 10 },
					{ from: 1, to: 2, weight: 3 },
					{ from: 1, to: 3, weight: 9 },
					{ from: 2, to: 3, weight: 4 },
					{ from: 3, to: 0, weight: 2 },
					{ from: 3, to: 2, weight: 1 },
				],
			},
		};
	}

	/**
	 * 推奨されるサンプル入力
	 */
	static getRecommendedExamples(): AlgorithmInput[] {
		return [
			{
				graph: {
					nodes: ["1", "2", "3", "4", "5"],
					edges: [
						{ from: 0, to: 1, weight: 3 },
						{ from: 0, to: 2, weight: 8 },
						{ from: 0, to: 4, weight: -4 },
						{ from: 1, to: 3, weight: 1 },
						{ from: 1, to: 4, weight: 7 },
						{ from: 2, to: 1, weight: 4 },
						{ from: 3, to: 0, weight: 2 },
						{ from: 3, to: 2, weight: -5 },
						{ from: 4, to: 3, weight: 6 },
					],
				},
			},
			{
				graph: {
					nodes: ["S", "A", "B", "C", "T"],
					edges: [
						{ from: 0, to: 1, weight: 10 },
						{ from: 0, to: 2, weight: 5 },
						{ from: 1, to: 2, weight: 2 },
						{ from: 1, to: 3, weight: 1 },
						{ from: 2, to: 1, weight: 3 },
						{ from: 2, to: 3, weight: 9 },
						{ from: 2, to: 4, weight: 2 },
						{ from: 3, to: 4, weight: 4 },
						{ from: 4, to: 3, weight: 6 },
					],
				},
			},
		];
	}
}
