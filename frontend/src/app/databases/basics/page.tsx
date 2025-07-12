/**
 * src/app/databases/basics/page.tsx
 *
 * データベース基礎学習ページ
 * RDB vs NoSQL、基本概念、SQL基礎、正規化、インデックスなどの基礎知識を提供
 */

"use client";

import React, { useState } from "react";

/**
 * データベース基礎学習ページ
 * 各セクションをタブで切り替えて学習できるインタラクティブなページ
 */
export default function DatabaseBasicsPage() {
	const [activeTab, setActiveTab] = useState("overview");

	/**
	 * タブの定義
	 */
	const tabs = [
		{ id: "overview", name: "概要", icon: "🗄️" },
		{ id: "concepts", name: "基本概念", icon: "🧩" },
		{ id: "rdb-vs-nosql", name: "RDB vs NoSQL", icon: "⚖️" },
		{ id: "sql-basics", name: "SQL基礎", icon: "📝" },
		{ id: "normalization", name: "正規化", icon: "🔧" },
		{ id: "indexing", name: "インデックス", icon: "⚡" },
	];

	/**
	 * タブコンテンツのレンダリング
	 */
	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return <OverviewSection />;
			case "concepts":
				return <ConceptsSection />;
			case "rdb-vs-nosql":
				return <RDBvsNoSQLSection />;
			case "sql-basics":
				return <SQLBasicsSection />;
			case "normalization":
				return <NormalizationSection />;
			case "indexing":
				return <IndexingSection />;
			default:
				return <OverviewSection />;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						データベース基礎
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
						データベースの基本概念から実践的な設計手法まで、体系的に学習しましょう
					</p>
				</header>

				{/* タブナビゲーション */}
				<nav className="mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-2">
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setActiveTab(tab.id)}
									className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
										activeTab === tab.id
											? "bg-cyan-500 text-white shadow-md"
											: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
									}`}
								>
									<div className="text-lg mb-1">{tab.icon}</div>
									<div className="text-xs">{tab.name}</div>
								</button>
							))}
						</div>
					</div>
				</nav>

				{/* タブコンテンツ */}
				<main className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
					{renderTabContent()}
				</main>
			</div>
		</div>
	);
}

/**
 * 概要セクション
 */
function OverviewSection() {
	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				🗄️ データベースとは何か
			</h2>

			<div className="grid md:grid-cols-2 gap-8">
				<div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						データベースの定義
					</h3>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
						データベースとは、データを効率よく管理・検索するための仕組みです。
						大量のデータを整理して保存し、必要な時に素早く取り出せるようにします。
					</p>
					<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
						現代のあらゆるシステムやアプリケーションの基盤として、ユーザー情報、商品データ、取引履歴など
						重要な情報を安全かつ効率的に管理しています。
					</p>

					<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
						データベースの役割
					</h3>
					<ul className="space-y-2 text-gray-600 dark:text-gray-400">
						<li className="flex items-center">
							<span className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
							<strong>データ保存:</strong> 永続的で安全なデータ保管
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
							<strong>データ検索:</strong> 高速な検索とフィルタリング
						</li>
						<li className="flex items-center">
							<span className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
							<strong>データ整合性:</strong> 正確性と一貫性の保証
						</li>
					</ul>
				</div>

				<div>
					<div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-6 border border-cyan-200 dark:border-cyan-700">
						<h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4">
							📚 この学習で身につくスキル
						</h3>
						<ul className="space-y-2 text-cyan-700 dark:text-cyan-300">
							<li>• データベースの基本的な仕組みの理解</li>
							<li>• RDBとNoSQLの特徴と使い分け</li>
							<li>• SQLクエリの作成と最適化</li>
							<li>• 効率的なデータベース設計手法</li>
							<li>• 正規化とパフォーマンス最適化</li>
							<li>• 実際のプロジェクトでの活用方法</li>
						</ul>
					</div>

					<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700 mt-6">
						<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
							🎯 学習の目標
						</h3>
						<p className="text-blue-700 dark:text-blue-300 text-sm">
							この基礎学習を修了すると、データベースエンジニアやバックエンド開発者として
							効率的なデータ管理システムを設計・実装できるようになります。
							また、データ分析やアプリケーション開発での適切なDB選択ができるようになります。
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * 基本概念セクション
 */
function ConceptsSection() {
	const basicTerms = [
		{
			term: "テーブル",
			description: "データを行と列の形で整理した表構造",
			example: "users, orders, products など",
			color:
				"bg-cyan-100 border-cyan-300 dark:bg-cyan-900/20 dark:border-cyan-700",
		},
		{
			term: "レコード（行）",
			description: "テーブル内の1つのデータエントリ",
			example: "1人のユーザー情報、1つの注文データ",
			color:
				"bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700",
		},
		{
			term: "カラム（列）",
			description: "データの属性や項目を表す",
			example: "name, email, created_at など",
			color:
				"bg-purple-100 border-purple-300 dark:bg-purple-900/20 dark:border-purple-700",
		},
		{
			term: "主キー",
			description: "レコードを一意に識別する項目",
			example: "user_id, order_id など",
			color:
				"bg-green-100 border-green-300 dark:bg-green-900/20 dark:border-green-700",
		},
		{
			term: "外部キー",
			description: "他のテーブルとの関連を示す項目",
			example: "user_idでusersテーブルと関連付け",
			color:
				"bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700",
		},
		{
			term: "インデックス",
			description: "検索速度を向上させる仕組み",
			example: "本の索引のように、データの場所を記録",
			color:
				"bg-orange-100 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700",
		},
	];

	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				🧩 データベースの基本用語
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				データベースを理解するために、まず基本的な用語を覚えましょう。
				これらの概念は、どのデータベースシステムでも共通して使われる重要な概念です。
			</p>

			<div className="grid md:grid-cols-2 gap-6">
				{basicTerms.map((term) => (
					<div
						key={term.term}
						className={`${term.color} rounded-lg p-6 border-l-4`}
					>
						<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
							{term.term}
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-3">
							{term.description}
						</p>
						<div className="bg-white dark:bg-gray-700 rounded p-3">
							<p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
								例: {term.example}
							</p>
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
				<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
					💡 テーブル設計の例
				</h3>
				<div className="bg-white dark:bg-gray-800 rounded p-4 font-mono text-sm">
					<div className="text-gray-500 dark:text-gray-400 mb-2">
						users テーブル:
					</div>
					<div className="space-y-1">
						<div>| user_id (主キー) | name | email | created_at |</div>
						<div>|------------------|------|-------|------------|</div>
						<div>| 1 | 田中太郎 | tanaka@example.com | 2024-01-01 |</div>
						<div>| 2 | 佐藤花子 | sato@example.com | 2024-01-02 |</div>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * RDB vs NoSQLセクション
 */
function RDBvsNoSQLSection() {
	const comparisonData = [
		{
			aspect: "データ構造",
			rdb: "テーブル（行・列）",
			nosql: "柔軟な形式（JSON、キー・バリューなど）",
		},
		{
			aspect: "スキーマ",
			rdb: "事前定義が必要（固定）",
			nosql: "動的に変更可能（柔軟）",
		},
		{
			aspect: "ACID特性",
			rdb: "完全にサポート",
			nosql: "部分的サポート（製品による）",
		},
		{
			aspect: "スケーラビリティ",
			rdb: "垂直スケーリング中心",
			nosql: "水平スケーリングに優れる",
		},
		{
			aspect: "クエリ言語",
			rdb: "SQL（標準化されている）",
			nosql: "製品固有のAPI",
		},
		{
			aspect: "適用例",
			rdb: "金融システム、ECサイト",
			nosql: "SNS、IoT、ビッグデータ",
		},
	];

	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				⚖️ RDB vs NoSQL
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				データベースは大きく分けてRDB（リレーショナルデータベース）とNoSQLの2つのタイプがあります。
				それぞれの特徴を理解して、適切な選択をできるようになりましょう。
			</p>

			{/* 比較表 */}
			<div className="mb-8 overflow-x-auto">
				<table className="w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
					<thead className="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								比較項目
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								RDB
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								NoSQL
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{comparisonData.map((row, index) => (
							<tr key={row.aspect}>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
									{row.aspect}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
									{row.rdb}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
									{row.nosql}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* RDBとNoSQLの代表例 */}
			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
					<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
						🗃️ RDBの代表例
					</h3>
					<ul className="space-y-3 text-blue-700 dark:text-blue-300">
						<li>
							<strong>MySQL:</strong> 最も普及しているオープンソースRDB
						</li>
						<li>
							<strong>PostgreSQL:</strong> 高機能で拡張性に優れたRDB
						</li>
						<li>
							<strong>Oracle Database:</strong> エンタープライズ向け高性能RDB
						</li>
						<li>
							<strong>SQL Server:</strong> Microsoft製のRDB
						</li>
					</ul>
				</div>

				<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
					<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
						📦 NoSQLの代表例
					</h3>
					<ul className="space-y-3 text-purple-700 dark:text-purple-300">
						<li>
							<strong>MongoDB:</strong> ドキュメント指向（JSON形式）
						</li>
						<li>
							<strong>Redis:</strong> キー・バリュー型（高速キャッシュ）
						</li>
						<li>
							<strong>Cassandra:</strong> カラム指向（大規模分散）
						</li>
						<li>
							<strong>Neo4j:</strong> グラフ型（関係性重視）
						</li>
					</ul>
				</div>
			</div>

			<div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
				<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
					🎯 選択のポイント
				</h3>
				<div className="grid md:grid-cols-2 gap-4 text-green-700 dark:text-green-300 text-sm">
					<div>
						<h4 className="font-semibold mb-2">RDBを選ぶべき場合:</h4>
						<ul className="space-y-1">
							<li>• データの整合性が重要</li>
							<li>• 複雑な関係性がある</li>
							<li>• トランザクション処理が必要</li>
							<li>• 標準的なSQLを使いたい</li>
						</ul>
					</div>
					<div>
						<h4 className="font-semibold mb-2">NoSQLを選ぶべき場合:</h4>
						<ul className="space-y-1">
							<li>• 大量データの高速処理</li>
							<li>• スキーマが頻繁に変わる</li>
							<li>• 水平スケーリングが必要</li>
							<li>• 非構造化データを扱う</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * SQL基礎セクション
 */
function SQLBasicsSection() {
	const sqlCommands = [
		{
			type: "SELECT",
			description: "データの検索・取得",
			syntax: "SELECT カラム名 FROM テーブル名 WHERE 条件;",
			example: "SELECT name, email FROM users WHERE age > 20;",
		},
		{
			type: "INSERT",
			description: "新しいデータの追加",
			syntax: "INSERT INTO テーブル名 (カラム名) VALUES (値);",
			example:
				"INSERT INTO users (name, email) VALUES ('田中太郎', 'tanaka@example.com');",
		},
		{
			type: "UPDATE",
			description: "既存データの更新",
			syntax: "UPDATE テーブル名 SET カラム名 = 値 WHERE 条件;",
			example: "UPDATE users SET email = 'new@example.com' WHERE id = 1;",
		},
		{
			type: "DELETE",
			description: "データの削除",
			syntax: "DELETE FROM テーブル名 WHERE 条件;",
			example: "DELETE FROM users WHERE id = 1;",
		},
	];

	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				📝 SQL基礎
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				SQL（Structured Query
				Language）は、リレーショナルデータベースを操作するための標準言語です。
				データの検索、追加、更新、削除などの基本操作を学習しましょう。
			</p>

			{/* 基本的なSQLコマンド */}
			<div className="space-y-6">
				{sqlCommands.map((cmd) => (
					<div
						key={cmd.type}
						className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
					>
						<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
							{cmd.type} - {cmd.description}
						</h3>
						<div className="space-y-3">
							<div>
								<h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
									基本構文:
								</h4>
								<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded font-mono text-sm">
									{cmd.syntax}
								</div>
							</div>
							<div>
								<h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
									実例:
								</h4>
								<div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm">
									{cmd.example}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* JOINの説明 */}
			<div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
				<h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
					🔗 JOIN - テーブル結合
				</h3>
				<p className="text-purple-700 dark:text-purple-300 mb-4">
					複数のテーブルからデータを組み合わせて取得する重要な操作です。
				</p>
				<div className="bg-white dark:bg-gray-800 rounded p-4 font-mono text-sm">
					<div className="text-gray-500 dark:text-gray-400 mb-2">例:</div>
					<div className="text-gray-800 dark:text-gray-200">
						SELECT users.name, orders.total
						<br />
						FROM users
						<br />
						JOIN orders ON users.id = orders.user_id;
					</div>
				</div>
			</div>

			<div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
				<h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
					💡 SQL学習のコツ
				</h3>
				<ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
					<li>• 実際にデータベースを作成して練習する</li>
					<li>• 小さなクエリから始めて徐々に複雑にする</li>
					<li>• エラーメッセージを読んで原因を理解する</li>
					<li>• EXPLAIN文でクエリの実行計画を確認する</li>
				</ul>
			</div>
		</div>
	);
}

/**
 * 正規化セクション
 */
function NormalizationSection() {
	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				🔧 データベース正規化
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				正規化とは、データの重複を排除し、データベースを効率的に設計する手法です。
				データの整合性を保ち、更新時の不具合を防ぐことができます。
			</p>

			{/* 正規化のレベル */}
			<div className="space-y-6">
				<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
					<h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4">
						第1正規形（1NF）
					</h3>
					<p className="text-red-700 dark:text-red-300 mb-4">
						各セルに単一の値のみを格納し、重複する行がない状態
					</p>
					<div className="bg-white dark:bg-gray-800 rounded p-4">
						<div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
							❌ 悪い例:
						</div>
						<div className="font-mono text-sm mb-4">
							| 顧客名 | 商品 |<br />| 田中 | リンゴ,バナナ |
						</div>
						<div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
							✅ 良い例:
						</div>
						<div className="font-mono text-sm">
							| 顧客名 | 商品 |<br />| 田中 | リンゴ |<br />| 田中 | バナナ |
						</div>
					</div>
				</div>

				<div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-700">
					<h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-4">
						第2正規形（2NF）
					</h3>
					<p className="text-orange-700 dark:text-orange-300 mb-4">
						第1正規形を満たし、主キーに完全従属する状態
					</p>
					<div className="bg-white dark:bg-gray-800 rounded p-4 text-sm">
						部分従属を排除し、テーブルを分割して関連性を明確にします。
					</div>
				</div>

				<div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
					<h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4">
						第3正規形（3NF）
					</h3>
					<p className="text-yellow-700 dark:text-yellow-300 mb-4">
						第2正規形を満たし、推移的従属がない状態
					</p>
					<div className="bg-white dark:bg-gray-800 rounded p-4 text-sm">
						主キー以外の項目が他の主キー以外の項目に依存しない状態を作ります。
					</div>
				</div>
			</div>

			{/* 正規化のメリット・デメリット */}
			<div className="grid md:grid-cols-2 gap-6 mt-8">
				<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
					<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
						✅ 正規化のメリット
					</h3>
					<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
						<li>• データの重複削除</li>
						<li>• 更新異常の防止</li>
						<li>• ストレージ容量の節約</li>
						<li>• データ整合性の向上</li>
					</ul>
				</div>

				<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
					<h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
						⚠️ 正規化のデメリット
					</h3>
					<ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
						<li>• クエリが複雑になる</li>
						<li>• JOINが多くなり処理が重い</li>
						<li>• テーブル数の増加</li>
						<li>• 設計の複雑化</li>
					</ul>
				</div>
			</div>

			<div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
				<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
					⚖️ 非正規化について
				</h3>
				<p className="text-blue-700 dark:text-blue-300 text-sm">
					パフォーマンス重視の場合、意図的に正規化を緩める「非正規化」も選択肢の一つです。
					読み取り性能を優先し、データの重複を許容することで高速化を図ります。
				</p>
			</div>
		</div>
	);
}

/**
 * インデックスセクション
 */
function IndexingSection() {
	return (
		<div className="p-8">
			<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
				⚡ インデックス
			</h2>

			<p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
				インデックスは、データベースの検索速度を劇的に向上させる仕組みです。
				本の索引のように、データの場所を記録して高速アクセスを可能にします。
			</p>

			{/* インデックスの種類 */}
			<div className="grid md:grid-cols-2 gap-6 mb-8">
				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
					<h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
						🔍 主な種類
					</h3>
					<ul className="space-y-3 text-blue-700 dark:text-blue-300">
						<li>
							<strong>プライマリインデックス:</strong> 主キーに自動作成
						</li>
						<li>
							<strong>セカンダリインデックス:</strong> 検索用に手動作成
						</li>
						<li>
							<strong>ユニークインデックス:</strong> 重複値を許可しない
						</li>
						<li>
							<strong>複合インデックス:</strong> 複数カラムにまたがる
						</li>
					</ul>
				</div>

				<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
					<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
						📈 効果的な使い方
					</h3>
					<ul className="space-y-3 text-green-700 dark:text-green-300">
						<li>• WHERE句でよく使用するカラム</li>
						<li>• JOIN条件で使用するカラム</li>
						<li>• ORDER BYで使用するカラム</li>
						<li>• GROUP BYで使用するカラム</li>
					</ul>
				</div>
			</div>

			{/* インデックス作成例 */}
			<div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-8">
				<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					📝 インデックス作成の例
				</h3>
				<div className="space-y-4">
					<div>
						<h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
							単一カラムインデックス:
						</h4>
						<div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded font-mono text-sm">
							CREATE INDEX idx_user_email ON users(email);
						</div>
					</div>
					<div>
						<h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
							複合インデックス:
						</h4>
						<div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm">
							CREATE INDEX idx_user_name_age ON users(name, age);
						</div>
					</div>
				</div>
			</div>

			{/* インデックスのトレードオフ */}
			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-700">
					<h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">
						✅ メリット
					</h3>
					<ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
						<li>• SELECT文の高速化</li>
						<li>• JOIN処理の最適化</li>
						<li>• ORDER BYの高速化</li>
						<li>• ユニーク制約の実現</li>
					</ul>
				</div>

				<div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-700">
					<h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
						⚠️ デメリット
					</h3>
					<ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
						<li>• INSERT/UPDATE/DELETEの低速化</li>
						<li>• 追加のストレージ使用</li>
						<li>• メンテナンスコストの増加</li>
						<li>• 過剰なインデックスは逆効果</li>
					</ul>
				</div>
			</div>

			<div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
				<h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
					💡 インデックス設計のコツ
				</h3>
				<ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
					<li>• 選択性の高い（ユニークな値が多い）カラムを優先する</li>
					<li>• 複合インデックスでは、選択性の高い順序で定義する</li>
					<li>• EXPLAIN文でクエリ実行計画を確認する</li>
					<li>• 定期的にインデックスの使用状況を監視する</li>
				</ul>
			</div>
		</div>
	);
}
