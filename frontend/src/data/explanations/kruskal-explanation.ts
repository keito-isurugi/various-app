import type { DetailedExplanationData } from "../../types/algorithm";

export const kruskalExplanation: DetailedExplanationData = {
	calculationType: "kruskal",
	title: "クラスカル法とは？",
	overview: `クラスカル法は、重み付き無向グラフから最小全域木（Minimum Spanning Tree, MST）を構築するグリーディアルゴリズムです。
1956年にジョセフ・クラスカルによって発表され、辺を重みの小さい順に選択していく直感的な手法です。`,

	sections: [
		{
			title: "アルゴリズムの動作原理",
			content: `クラスカル法は、貪欲法（グリーディ法）の考え方に基づいています。

基本的な考え方：
1. 全ての辺を重みの昇順にソート
2. 軽い辺から順に検討し、閉路を形成しない辺のみを選択
3. V-1本の辺を選択したら完了（Vは頂点数）

閉路の判定にはUnion-Find（素集合データ構造）を使用します。`,

			examples: [
				{
					title: "実行例（5頂点のグラフ）",
					code: `グラフ: A-B(2), A-D(6), B-C(3), B-D(8), B-E(5), C-E(7), D-E(9)

ステップ1: 辺をソート
[A-B(2), B-C(3), B-E(5), A-D(6), C-E(7), B-D(8), D-E(9)]

ステップ2: 辺を順次選択
1. A-B(2): 閉路なし → 採用
2. B-C(3): 閉路なし → 採用  
3. B-E(5): 閉路なし → 採用
4. A-D(6): 閉路なし → 採用 ← V-1=4本完了

MST: {A-B(2), B-C(3), B-E(5), A-D(6)}
総重み: 2+3+5+6 = 16`,
				},
			],
		},
		{
			title: "Union-Findデータ構造",
			content:
				"クラスカル法の効率的な実装には、Union-Find（素集合データ構造）が不可欠です。",

			formulas: [
				{
					name: "Find操作（経路圧縮）",
					expression:
						"find(x) = x if parent[x] = x, else parent[x] = find(parent[x])",
					description: "要素xが属する集合の代表元を返す",
				},
				{
					name: "Union操作（ランク結合）",
					expression:
						"union(x, y): 小さいランクの集合を大きいランクの集合に統合",
					description: "要素xとyの集合を統合",
				},
			],

			examples: [
				{
					title: "Union-Find実装例",
					code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # 経路圧縮
        return self.parent[x]
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False  # 既に同じ集合
        
        # ランクによる結合
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True`,
				},
			],
		},
		{
			title: "計算量の分析",
			content: "クラスカル法の計算量は、主にソート処理で決まります。",

			formulas: [
				{
					name: "全体の時間計算量",
					expression: "O(E log E)",
					description: "Eは辺数。ソート処理がボトルネック",
				},
				{
					name: "Union-Find操作",
					expression: "O(α(V))",
					description: "α(V)はアッカーマン関数の逆関数（実質的に定数）",
				},
				{
					name: "空間計算量",
					expression: "O(V)",
					description: "Union-Findデータ構造のサイズ",
				},
			],
		},
		{
			title: "完全な実装",
			content: "クラスカル法の完全な実装例を示します。",

			examples: [
				{
					title: "Python実装",
					code: `def kruskal(n, edges):
    # 辺を重み順にソート
    edges.sort(key=lambda x: x[2])
    
    uf = UnionFind(n)
    mst = []
    total_weight = 0
    
    for u, v, weight in edges:
        if uf.union(u, v):  # 閉路を形成しない場合
            mst.append((u, v, weight))
            total_weight += weight
            
            if len(mst) == n - 1:  # V-1本の辺を選択
                break
    
    return mst, total_weight`,
				},
			],
		},
		{
			title: "プリム法との比較",
			content: "最小全域木を求める代表的な2つのアルゴリズムの比較：",

			examples: [
				{
					title: "アルゴリズムの比較",
					code: `クラスカル法:
- 辺ベースのアプローチ
- 計算量: O(E log E)
- 疎グラフに適している
- Union-Findが必要
- 並列化が容易

プリム法:
- 頂点ベースのアプローチ  
- 計算量: O(E log V) (ヒープ使用時)
- 密グラフに適している
- 優先度付きキューが必要
- 逐次処理

使い分けの目安:
- E < V²/log V → クラスカル法
- E ≥ V²/log V → プリム法`,
				},
			],
		},
		{
			title: "応用例",
			content: "クラスカル法は様々な分野で応用されています：",

			examples: [
				{
					title: "実世界での応用",
					code: `1. ネットワーク設計
   - 最小コストでの配線計画
   - 通信ネットワークの構築

2. クラスタリング
   - 単連結クラスタリング
   - 階層クラスタリング

3. 画像処理
   - 画像セグメンテーション
   - 領域分割

4. 近似アルゴリズム
   - 巡回セールスマン問題の近似解
   - Steiner木問題の近似解`,
				},
			],
		},
	],

	complexity: {
		time: "O(E log E)",
		space: "O(V)",
		description: "Eは辺数、Vは頂点数。辺のソートが主要なコスト。",
	},

	applications: [
		"ネットワーク設計での最小コスト配線",
		"クラスタ分析での階層クラスタリング",
		"画像処理でのセグメンテーション",
		"回路設計での配線最適化",
		"道路網や鉄道網の設計",
		"グラフ分割問題の近似解法",
	],
};
