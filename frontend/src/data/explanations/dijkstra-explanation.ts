import type { DetailedExplanationData } from "../../types/algorithm";

export const dijkstraExplanation: DetailedExplanationData = {
	calculationType: "dijkstra",
	title: "ダイクストラ法とは？",
	overview: `ダイクストラ法は、重み付きグラフにおいて単一始点最短経路問題を解くアルゴリズムです。
1959年にエドガー・ダイクストラによって考案され、グラフ理論における最も重要なアルゴリズムの一つです。`,

	sections: [
		{
			title: "アルゴリズムの動作原理",
			content: `ダイクストラ法は、始点から各頂点への最短距離を段階的に確定していきます。

基本的な考え方：
1. 始点の距離を0、他の全ての頂点の距離を∞に初期化
2. 未確定の頂点の中から、現在の最短距離が最小の頂点を選択
3. 選択した頂点から到達可能な隣接頂点の距離を更新
4. 全ての頂点の最短距離が確定するまで繰り返し`,

			examples: [
				{
					title: "ステップごとの動作",
					code: `初期状態: S(0), A(∞), B(∞), C(∞)
			  ↓
ステップ1: S を確定 → A(3), B(5)に更新
ステップ2: A を確定 → B(4), C(5)に更新  
ステップ3: B を確定 → C(5)（変更なし）
ステップ4: C を確定 → 完了`,
				},
			],
		},
		{
			title: "実装のポイント",
			content: "効率的な実装には優先度付きキュー（ヒープ）を使用します。",

			formulas: [
				{
					name: "距離の更新条件",
					expression: "distance[v] > distance[u] + weight(u, v)",
					description: "頂点uを経由した方が短い場合に距離を更新",
				},
			],

			examples: [
				{
					title: "Python実装例",
					code: `import heapq

def dijkstra(graph, start):
    n = len(graph)
    distances = [float('inf')] * n
    distances[start] = 0
    pq = [(0, start)]  # (距離, 頂点)
    
    while pq:
        current_dist, u = heapq.heappop(pq)
        
        if current_dist > distances[u]:
            continue
            
        for v, weight in graph[u]:
            new_dist = distances[u] + weight
            if new_dist < distances[v]:
                distances[v] = new_dist
                heapq.heappush(pq, (new_dist, v))
    
    return distances`,
				},
			],
		},
		{
			title: "計算量の分析",
			content:
				"ダイクストラ法の計算量は、使用するデータ構造によって異なります。",

			formulas: [
				{
					name: "優先度付きキューを使用",
					expression: "O((V + E) log V)",
					description: "Vは頂点数、Eは辺数",
				},
				{
					name: "配列による単純な実装",
					expression: "O(V²)",
					description: "密グラフでは効率的",
				},
			],
		},
		{
			title: "制限事項と注意点",
			content: `ダイクストラ法には以下の制限があります：

1. **負の重みを持つ辺が存在する場合は正しく動作しない**
   - この場合はベルマン・フォード法を使用する必要がある
   
2. **全ての辺の重みが非負である必要がある**
   - アルゴリズムの正当性の前提条件

3. **単一始点からの最短経路のみ計算**
   - 全点間最短経路にはワーシャル・フロイド法を使用`,
		},
		{
			title: "応用例",
			content: "ダイクストラ法は様々な分野で応用されています：",

			examples: [
				{
					title: "実世界での応用",
					code: `1. カーナビゲーション
   - 道路網での最短ルート探索
   
2. ネットワークルーティング
   - パケットの最適経路決定
   
3. ゲームAI
   - キャラクターの経路探索
   
4. 鉄道・航空路線
   - 最短時間・最小コストの経路計算`,
				},
			],
		},
	],

	complexity: {
		time: "O((V + E) log V)",
		space: "O(V)",
		description: "優先度付きキューを使用した場合の計算量。Vは頂点数、Eは辺数。",
	},

	applications: [
		"地図アプリケーションでの経路探索",
		"ネットワークの最短経路ルーティング",
		"ゲームでのAIパスファインディング",
		"ソーシャルネットワークでの最短関係パス",
		"VLSI設計での配線最適化",
	],
};
