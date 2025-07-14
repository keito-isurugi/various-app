"use client";

import Link from "next/link";

/**
 * グラフの最短経路アルゴリズムの一覧ページ
 * ダイクストラ法、ワーシャルフロイド法、クラスカル法、プリム法へのリンクを提供
 */
export default function GraphShortestPathPage() {
	const algorithms = [
		{
			name: "ダイクストラ法",
			path: "/algorithms/dijkstra",
			description: "単一始点最短経路問題を解くアルゴリズム",
			complexity: "O((V + E) log V)",
			category: "最短経路",
		},
		{
			name: "ワーシャルフロイド法",
			path: "/algorithms/warshall-floyd",
			description: "全点間最短経路問題を解くアルゴリズム",
			complexity: "O(V³)",
			category: "最短経路",
		},
		{
			name: "クラスカル法",
			path: "/algorithms/kruskal",
			description: "最小全域木を構築するアルゴリズム",
			complexity: "O(E log E)",
			category: "最小全域木",
		},
		{
			name: "プリム法",
			path: "/algorithms/prim",
			description: "最小全域木を構築するアルゴリズム",
			complexity: "O(E log V)",
			category: "最小全域木",
		},
	];

	return (
		<div className="max-w-6xl mx-auto p-4">
			{/* パンくずリスト */}
			<nav className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
				<Link href="/" className="hover:text-blue-600 transition-colors">
					ホーム
				</Link>
				<span>/</span>
				<Link
					href="/algorithms"
					className="hover:text-blue-600 transition-colors"
				>
					アルゴリズム
				</Link>
				<span>/</span>
				<span className="text-gray-900 dark:text-gray-100">
					グラフの最短経路
				</span>
			</nav>

			{/* ヘッダー */}
			<div className="mb-8">
				<Link
					href="/algorithms"
					className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
				>
					← アルゴリズム一覧に戻る
				</Link>
				<h1 className="text-3xl font-bold mb-4">グラフの最短経路</h1>
				<p className="text-gray-600 dark:text-gray-400">
					グラフ理論における最短経路問題と最小全域木問題を解くアルゴリズムを学習できます。
				</p>
			</div>

			{/* アルゴリズムカード */}
			<div className="grid gap-4 md:grid-cols-2">
				{algorithms.map((algo) => (
					<Link key={algo.path} href={algo.path}>
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border hover:shadow-lg transition-shadow cursor-pointer h-full">
							<div className="flex items-start justify-between mb-3">
								<h2 className="text-xl font-semibold">{algo.name}</h2>
								<span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
									{algo.category}
								</span>
							</div>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								{algo.description}
							</p>
							<div className="flex items-center gap-4 text-sm">
								<span className="text-gray-600 dark:text-gray-400">
									計算量:
								</span>
								<code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
									{algo.complexity}
								</code>
							</div>
						</div>
					</Link>
				))}
			</div>

			{/* 説明セクション */}
			<div className="mt-12 space-y-8">
				<section>
					<h2 className="text-2xl font-bold mb-4">最短経路問題とは</h2>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
						最短経路問題は、グラフ理論において重み付きグラフの2頂点間を結ぶ経路の中で、
						重みの総和が最小となる経路を求める問題です。実世界では、道路網での最短ルート探索、
						ネットワークルーティング、ゲームのAIなど、様々な場面で応用されています。
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-bold mb-4">最小全域木とは</h2>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed">
						最小全域木（Minimum Spanning Tree,
						MST）は、重み付き連結グラフにおいて、
						すべての頂点を含み、辺の重みの総和が最小となる木構造のことです。
						ネットワーク設計、クラスタリング、画像セグメンテーションなどに応用されています。
					</p>
				</section>
			</div>
		</div>
	);
}
