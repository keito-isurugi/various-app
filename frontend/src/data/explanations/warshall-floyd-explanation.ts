import type { DetailedExplanationData } from "../../types/algorithm";

export const warshallFloydExplanation: DetailedExplanationData = {
	calculationType: "warshall-floyd",
	title: "ワーシャルフロイド法とは？",
	overview: `ワーシャルフロイド法は、重み付きグラフにおいて全点間最短経路問題を解く動的計画法のアルゴリズムです。
ロバート・フロイドとスティーブン・ワーシャルによって独立に発見され、全ての頂点ペア間の最短距離を一度に計算できます。`,

	sections: [
		{
			title: "アルゴリズムの動作原理",
			content: `ワーシャルフロイド法は、動的計画法を用いて全点間の最短経路を求めます。

基本的な考え方：
1. 各頂点を中継点として使用する場合としない場合を比較
2. より短い経路があれば距離を更新
3. 全ての頂点を中継点として検討することで最短経路を発見

動的計画法の漸化式：
dp[i][j][k] = min(dp[i][j][k-1], dp[i][k][k-1] + dp[k][j][k-1])`,

			examples: [
				{
					title: "3頂点グラフでの実行例",
					code: `初期状態:
    A  B  C
A [ 0  5  ∞]
B [ ∞  0  3]
C [ 2  ∞  0]

k=A（Aを中継点として使用）:
B→A→C: ∞ (Aに到達不可)

k=B（Bを中継点として使用）:
A→B→C: 5+3=8 < ∞ → 更新
C→B→A: ∞ (Bに到達不可)

k=C（Cを中継点として使用）:
A→C→B: ∞ (Cに到達不可)
B→C→A: 3+2=5 < ∞ → 更新

最終結果:
    A  B  C
A [ 0  5  8]
B [ 5  0  3]
C [ 2  7  0]`,
				},
			],
		},
		{
			title: "実装のポイント",
			content:
				"ワーシャルフロイド法の実装は非常にシンプルで、3重ループで構成されます。",

			formulas: [
				{
					name: "距離の更新式",
					expression: "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
					description: "頂点kを経由した場合の距離と比較",
				},
			],

			examples: [
				{
					title: "Python実装例",
					code: `def warshall_floyd(n, edges):
    # 距離行列の初期化
    dist = [[float('inf')] * n for _ in range(n)]
    
    # 自己ループは0
    for i in range(n):
        dist[i][i] = 0
    
    # 辺の重みを設定
    for u, v, w in edges:
        dist[u][v] = w
    
    # ワーシャルフロイド法
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    # 負の閉路検出
    for i in range(n):
        if dist[i][i] < 0:
            return None  # 負の閉路あり
    
    return dist`,
				},
			],
		},
		{
			title: "負の閉路の検出",
			content:
				"ワーシャルフロイド法の重要な特徴の一つは、負の閉路を検出できることです。",

			examples: [
				{
					title: "負の閉路検出の仕組み",
					code: `アルゴリズム実行後、対角成分（dist[i][i]）が負になっていれば、
頂点iを含む負の閉路が存在することを意味します。

例：A→B(重み2)→C(重み-5)→A(重み1)
この閉路の総重み: 2 + (-5) + 1 = -2 < 0

実行後: dist[A][A] = -2 となり、負の閉路が検出される`,
				},
			],
		},
		{
			title: "経路復元",
			content: "最短距離だけでなく、実際の経路も復元できます。",

			examples: [
				{
					title: "経路復元の実装",
					code: `def warshall_floyd_with_path(n, edges):
    dist = [[float('inf')] * n for _ in range(n)]
    next = [[None] * n for _ in range(n)]
    
    # 初期化
    for i in range(n):
        dist[i][i] = 0
        next[i][i] = i
    
    for u, v, w in edges:
        dist[u][v] = w
        next[u][v] = v
    
    # ワーシャルフロイド法
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    next[i][j] = next[i][k]
    
    # 経路復元関数
    def get_path(i, j):
        if next[i][j] is None:
            return []
        path = [i]
        while i != j:
            i = next[i][j]
            path.append(i)
        return path
    
    return dist, get_path`,
				},
			],
		},
		{
			title: "ダイクストラ法との比較",
			content: "ワーシャルフロイド法とダイクストラ法の使い分けについて：",

			examples: [
				{
					title: "アルゴリズムの比較",
					code: `ワーシャルフロイド法:
- 全点間最短経路: O(V³)
- 負の重みOK
- 実装が簡単
- 密グラフに適している

ダイクストラ法:
- 単一始点最短経路: O((V+E)logV)
- 負の重み不可
- V回実行で全点間: O(V(V+E)logV)
- 疎グラフに適している

使い分けの目安:
- V² < E → ワーシャルフロイド法
- V² > E → ダイクストラ法×V回`,
				},
			],
		},
		{
			title: "応用例",
			content: "ワーシャルフロイド法は様々な問題に応用されています：",

			examples: [
				{
					title: "実世界での応用",
					code: `1. 推移閉包の計算
   - 到達可能性の判定
   - bool値での実装も可能

2. ゲーム理論
   - ミニマックス戦略の計算
   - ゲーム木の評価

3. ネットワーク分析
   - 中心性の計算
   - クラスタリング係数

4. 為替レート
   - 裁定取引の検出
   - 最適な両替経路`,
				},
			],
		},
	],

	complexity: {
		time: "O(V³)",
		space: "O(V²)",
		description: "Vは頂点数。3重ループによるシンプルな実装。",
	},

	applications: [
		"全点間最短経路問題",
		"ネットワークの到達可能性分析",
		"推移閉包の計算",
		"負の閉路の検出",
		"為替レートの裁定取引検出",
		"ゲーム理論での戦略計算",
	],
};
