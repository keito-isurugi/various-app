import {
	BookOpen,
	Brain,
	Calculator,
	Calendar,
	Code,
	Rocket,
	Ticket,
} from "lucide-react";
import Link from "next/link";

const pageLinks = [
	{
		href: "/blog/posts",
		title: "ブログ",
		description: "技術記事とナレッジ",
		icon: BookOpen,
		color: "from-blue-500 to-cyan-500",
	},
	{
		href: "/todo",
		title: "TODOアプリ",
		description: "タスク管理ツール",
		icon: Calendar,
		color: "from-green-500 to-emerald-500",
	},
	{
		href: "/study/techquiz",
		title: "Tech Quiz",
		description: "技術問題で学習",
		icon: Brain,
		color: "from-purple-500 to-pink-500",
	},
	{
		href: "/algorithms",
		title: "アルゴリズム学習",
		description: "データ構造とアルゴリズム",
		icon: Code,
		color: "from-orange-500 to-red-500",
	},
	{
		href: "/calculator",
		title: "物理計算",
		description: "物理学の計算ツール",
		icon: Calculator,
		color: "from-indigo-500 to-blue-500",
	},
	{
		href: "/playground",
		title: "Playground",
		description: "コード実験場",
		icon: Rocket,
		color: "from-violet-500 to-purple-500",
	},
	{
		href: "/massage-ticket/admin/list",
		title: "肩たたき券管理",
		description: "デジタル肩たたき券",
		icon: Ticket,
		color: "from-pink-500 to-rose-500",
	},
];

export default function HomePage() {
	return (
		<div className="min-h-screen">
			{/* ヒーローセクション */}
			<section className="section-padding pt-8 md:pt-12">
				<div className="container mx-auto container-padding text-center">
					<h1 className="text-5xl font-bold mb-6">
						<span className="gradient-text-primary">Welcome!</span>
					</h1>
				</div>
			</section>

			{/* コンテンツナビゲーション */}
			<section className="section-padding">
				<div className="container mx-auto container-padding">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{pageLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.href}
									href={link.href}
									className="group relative bg-card hover:bg-accent border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
								>
									<div
										className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}
									/>
									<div className="relative">
										<div
											className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-4`}
										>
											<Icon className="h-6 w-6 text-white" />
										</div>
										<h3 className="text-lg font-bold mb-2 text-foreground">
											{link.title}
										</h3>
										<p className="text-sm text-muted-foreground">
											{link.description}
										</p>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>
		</div>
	);
}
