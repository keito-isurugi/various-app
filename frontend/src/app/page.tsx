import Link from "next/link";

export default function HomePage() {
	return (
		<div className="min-h-screen">
			<section className="section-padding pt-8 md:pt-12">
				<div className="container mx-auto container-padding text-center">
					<h1 className="text-5xl font-bold mb-6">
						<span className="gradient-text-primary">Welcome to</span>{" "}
						<span className="text-gray-900 dark:text-white">kei-talk</span>
					</h1>
					<p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
						技術ブログとポートフォリオサイト
					</p>
					<div className="flex gap-4 justify-center">
						<Link href="/blog/posts" className="btn-primary px-6 py-3">
							ブログを読む
						</Link>
						<Link href="/about" className="btn-secondary px-6 py-3">
							私について
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
