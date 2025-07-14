import type { DetailedExplanationData } from "../../types/algorithm";

export const primExplanation: DetailedExplanationData = {
	calculationType: "prim",
	title: "プリム法とは？",
	overview: `プリム法は、重み付き無向グラフから最小全域木（Minimum Spanning Tree, MST）を構築するグリーディアルゴリズムです。
1957年にロバート・プリムによって発表され、頂点を一つずつMSTに追加していく直感的なアプローチを取ります。`,

	sections: [
		{
			title: "アルゴリズムの動作原理",
			content: `プリム法は、頂点ベースのグリーディアプローチを採用しています。

基本的な考え方：
1. 任意の頂点から開始してMSTに追加
2. MSTに含まれない頂点への辺の中で最小重みの辺を選択
3. その辺の終点をMSTに追加
4. V-1本の辺を選択するまで繰り返し

効率的な実装では優先度付きキュー（最小ヒープ）を使用します。`,

			examples: [
				{
					title: "実行例（5頂点のグラフ）",
					code: `グラフ: A-B(2), A-D(6), B-C(3), B-D(8), B-E(5), C-E(7), D-E(9)

ステップ1: Aから開始
MST = {A}, 候補辺 = {A-B(2), A-D(6)}

ステップ2: 最小重みの辺A-B(2)を選択
MST = {A, B}, 候補辺 = {A-D(6), B-C(3), B-D(8), B-E(5)}

ステップ3: 最小重みの辺B-C(3)を選択  
MST = {A, B, C}, 候補辺 = {A-D(6), B-D(8), B-E(5), C-E(7)}

ステップ4: 最小重みの辺B-E(5)を選択
MST = {A, B, C, E}, 候補辺 = {A-D(6), B-D(8), C-E(7), D-E(9)}

ステップ5: 最小重みの辺A-D(6)を選択 ← V-1=4本完了
MST = {A, B, C, D, E}, 総重み: 2+3+5+6 = 16`,
				},
			],
		},
		{
			title: "優先度付きキューを用いた実装",
			content:
				"効率的なプリム法の実装には、最小ヒープ（優先度付きキュー）が不可欠です。",

			formulas: [
				{
					name: "キューの要素",
					expression: "(重み, 頂点)",
					description: "重みが小さい順に取り出される",
				},
				{
					name: "時間計算量",
					expression: "O(E log V)",
					description: "各辺が最大1回キューに追加される",
				},
			],

			examples: [
				{
					title: "Python実装例",
					code: `import heapq

def prim(n, edges):
    # 隣接リストの構築
    graph = [[] for _ in range(n)]
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    # MST構築
    in_mst = [False] * n
    mst = []
    total_weight = 0
    
    # 開始点（0番頂点）
    in_mst[0] = True
    pq = [(w, 0, v) for v, w in graph[0]]
    heapq.heapify(pq)
    
    while pq and len(mst) < n - 1:
        weight, u, v = heapq.heappop(pq)
        
        if in_mst[v]:
            continue
        
        # 辺をMSTに追加
        in_mst[v] = True
        mst.append((u, v, weight))
        total_weight += weight
        
        # 新しい頂点から出る辺を追加
        for next_v, next_w in graph[v]:
            if not in_mst[next_v]:
                heapq.heappush(pq, (next_w, v, next_v))
    
    return mst, total_weight`,
				},
			],
		},
		{
			title: "計算量の詳細分析",
			content: "プリム法の計算量は使用するデータ構造によって決まります。",

			formulas: [
				{
					name: "バイナリヒープ使用時",
					expression: "O(E log V)",
					description: "最も一般的な実装",
				},
				{
					name: "フィボナッチヒープ使用時",
					expression: "O(E + V log V)",
					description: "理論上最適だが実装が複雑",
				},
				{
					name: "配列による単純実装",
					expression: "O(V²)",
					description: "密グラフでは効率的",
				},
			],

			examples: [
				{
					title: "実装方法による比較",
					code: `密グラフ（E ≈ V²）の場合:
- 配列実装: O(V²) 
- ヒープ実装: O(V² log V)
→ 配列実装が効率的

疎グラフ（E ≪ V²）の場合:
- 配列実装: O(V²)
- ヒープ実装: O(E log V)  
→ ヒープ実装が効率的

使い分けの目安:
E > V²/log V → 配列実装
E ≤ V²/log V → ヒープ実装`,
				},
			],
		},
		{
			title: "クラスカル法との比較",
			content: "最小全域木アルゴリズムの2つの代表的手法の詳細比較：",

			examples: [
				{
					title: "特徴の比較",
					code: `プリム法:
✓ 頂点ベースのアプローチ
✓ 一つの連結成分を成長させる
✓ 優先度付きキューを使用
✓ 密グラフに適している
✓ 開始点が必要
✓ オンライン処理可能

クラスカル法:
✓ 辺ベースのアプローチ
✓ 複数の連結成分を統合
✓ Union-Findを使用
✓ 疎グラフに適している
✓ 開始点不要
✓ 並列化が容易

実装の複雑さ:
プリム法: 中程度（ヒープ操作）
クラスカル法: 高（Union-Find実装）`,
				},
			],
		},
		{
			title: "配列実装版プリム法",
			content: "密グラフに適した配列ベースの実装も重要です。",

			examples: [
				{
					title: "配列実装（O(V²)）",
					code: `def prim_array(adj_matrix):
    n = len(adj_matrix)
    key = [float('inf')] * n  # 各頂点のキー値
    parent = [-1] * n         # MST構築用
    in_mst = [False] * n      # MST含有フラグ
    
    key[0] = 0  # 開始点
    
    for _ in range(n):
        # 最小キー値を持つ頂点を選択
        u = -1
        for v in range(n):
            if not in_mst[v] and (u == -1 or key[v] < key[u]):
                u = v
        
        in_mst[u] = True
        
        # 隣接頂点のキー値を更新
        for v in range(n):
            if (adj_matrix[u][v] != 0 and 
                not in_mst[v] and 
                adj_matrix[u][v] < key[v]):
                key[v] = adj_matrix[u][v]
                parent[v] = u
    
    return parent`,
				},
			],
		},
		{
			title: "応用例と発展",
			content: "プリム法は様々な分野で応用されており、多くの発展形があります：",

			examples: [
				{
					title: "実世界での応用",
					code: `1. ネットワーク設計
   - 通信ネットワークの最適配線
   - 電力網の設計

2. クラスタリング
   - 単連結クラスタリング
   - 画像セグメンテーション

3. 近似アルゴリズム
   - 巡回セールスマン問題（TSP）
   - Steiner木問題

4. ゲーム開発
   - 迷路生成アルゴリズム
   - 地形生成

5. バイオインフォマティクス
   - 系統樹の構築
   - タンパク質構造解析`,
				},
			],
		},
	],

	complexity: {
		time: "O(E log V)",
		space: "O(V)",
		description: "Eは辺数、Vは頂点数。バイナリヒープを使用した場合の計算量。",
	},

	applications: [
		"ネットワーク設計での最小コスト配線",
		"通信ネットワークの最適化",
		"クラスタ分析での階層クラスタリング",
		"画像処理でのセグメンテーション",
		"迷路生成アルゴリズム",
		"巡回セールスマン問題の近似解法",
	],
};
