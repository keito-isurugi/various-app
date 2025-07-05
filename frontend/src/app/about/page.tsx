import Link from "next/link";

export default function AboutPage() {
	const skills = {
		フロントエンド: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
		バックエンド: ["Go", "Node.js", "PostgreSQL", "Docker"],
		その他: ["Git", "AWS", "CI/CD", "アジャイル開発"],
	};

	const timeline = [
		{
			year: "2024",
			title: "フルスタックエンジニア",
			description: "Webアプリケーション開発に従事",
		},
		{
			year: "2022",
			title: "エンジニアとしてのキャリアをスタート",
			description: "プログラミング学習を開始し、実務経験を積む",
		},
	];

	return (
		<div className="min-h-screen py-12 px-4">
			<div className="container mx-auto max-w-4xl">
				{/* ヘッダー */}
				<h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
					私について
				</h1>

				{/* プロフィールセクション */}
				<section className="mb-16">
					<div className="flex flex-col md:flex-row items-center gap-8">
						<div className="flex-shrink-0">
							<div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
								<svg
									className="w-24 h-24 text-gray-400"
									fill="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="プロフィールアイコン"
								>
									<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
								</svg>
							</div>
						</div>
						<div className="flex-1 text-center md:text-left">
							<h2 className="text-2xl font-semibold mb-4">
								ソフトウェアエンジニア
							</h2>
							<p className="text-gray-600 leading-relaxed">
								フルスタックエンジニアとして、フロントエンドからバックエンドまで幅広い技術を扱っています。
								ユーザー体験を重視した開発を心がけ、常に新しい技術の習得に励んでいます。
								技術ブログを通じて、学んだことや経験を共有することで、エンジニアコミュニティに貢献したいと考えています。
							</p>
						</div>
					</div>
				</section>

				{/* スキルセクション */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
						スキル
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{Object.entries(skills).map(([category, items]) => (
							<div key={category} className="bg-white rounded-lg shadow-md p-6">
								<h3 className="text-xl font-semibold mb-4 text-blue-600">
									{category}
								</h3>
								<ul className="space-y-2">
									{items.map((skill) => (
										<li key={skill} className="flex items-center gap-2">
											<svg
												className="w-4 h-4 text-green-500"
												fill="currentColor"
												viewBox="0 0 20 20"
												role="img"
												aria-label="チェックマーク"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
											<span className="text-gray-700">{skill}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</section>

				{/* 経歴セクション */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
						経歴
					</h2>
					<div className="space-y-8">
						{timeline.map((item) => (
							<div key={item.year} className="flex gap-4">
								<div className="flex-shrink-0 w-24">
									<span className="text-blue-600 font-semibold">
										{item.year}
									</span>
								</div>
								<div className="flex-1 pb-8 border-l-2 border-gray-200 pl-8 relative">
									<div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full" />
									<h3 className="text-xl font-semibold mb-2">{item.title}</h3>
									<p className="text-gray-600">{item.description}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* CTA */}
				<section className="text-center">
					<p className="text-lg text-gray-700 mb-4">
						プロジェクトのご相談やお問い合わせはお気軽にどうぞ
					</p>
					<Link
						href="/contact"
						className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
					>
						お問い合わせはこちら
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							role="img"
							aria-label="矢印アイコン"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</Link>
				</section>
			</div>
		</div>
	);
}
