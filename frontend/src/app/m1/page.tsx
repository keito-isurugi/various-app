import combis from "@/data/m1/combis.json";
import judges from "@/data/m1/judges.json";
import performances from "@/data/m1/performances.json";
import tournaments from "@/data/m1/tournaments.json";
import type { Performance, Tournament } from "@/types/m1";
import { Crown, Trophy } from "lucide-react";
import Link from "next/link";

function getWinner(year: number): string | null {
	const tournament = (tournaments as Tournament[]).find((t) => t.year === year);
	if (!tournament) return null;

	const finalPerformances = (performances as Performance[]).filter(
		(p) =>
			p.tournamentId === tournament.id && p.stage === "final" && p.rank === 1,
	);

	if (finalPerformances.length === 0) return null;

	const winnerCombi = combis.find((c) => c.id === finalPerformances[0].combiId);
	return winnerCombi?.name ?? null;
}

export default function M1TopPage() {
	const sortedTournaments = [...(tournaments as Tournament[])].sort(
		(a, b) => b.year - a.year,
	);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-8">
				<header className="mb-12 text-center">
					<h1 className="text-4xl font-bold text-red-500 mb-2">
						M-1グランプリ 分析
					</h1>
					<p className="text-gray-400">
						第1期（2001-2010）・第2期（2015-2025）のデータを分析
					</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<div className="bg-gray-800 rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-2">大会数</h2>
						<p className="text-4xl font-bold text-red-400">
							{tournaments.length}
						</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-2">登録コンビ</h2>
						<p className="text-4xl font-bold text-red-400">{combis.length}</p>
					</div>
					<div className="bg-gray-800 rounded-lg p-6">
						<h2 className="text-xl font-semibold mb-2">審査員</h2>
						<p className="text-4xl font-bold text-red-400">{judges.length}</p>
					</div>
				</div>

				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
						年度別結果
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
						{sortedTournaments.map((tournament) => {
							const winner = getWinner(tournament.year);
							return (
								<Link
									key={tournament.id}
									href={`/m1/years/${tournament.year}`}
									className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors block"
								>
									<div className="text-2xl font-bold text-red-400 mb-1">
										{tournament.year}
									</div>
									<div className="text-sm text-gray-400">
										第{tournament.year - 2000}回
									</div>
									{winner && (
										<div className="mt-2 text-sm flex items-center gap-1">
											<Crown className="w-4 h-4 text-yellow-400" />
											{winner}
										</div>
									)}
								</Link>
							);
						})}
					</div>
				</section>

				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Link
						href="/m1/combis"
						className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors block"
					>
						<h2 className="text-xl font-semibold mb-2">コンビ一覧</h2>
						<p className="text-gray-400">出場コンビの成績を確認</p>
					</Link>
					<Link
						href="/m1/judges"
						className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors block"
					>
						<h2 className="text-xl font-semibold mb-2">審査員一覧</h2>
						<p className="text-gray-400">審査員の採点傾向を分析</p>
					</Link>
					<Link
						href="/m1/records"
						className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors block"
					>
						<h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
							<Trophy className="w-5 h-5 text-yellow-400" />
							記録集
						</h2>
						<p className="text-gray-400">歴代の記録をランキングで表示</p>
					</Link>
				</section>
			</div>
		</div>
	);
}
