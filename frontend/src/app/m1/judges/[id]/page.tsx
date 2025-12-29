import combis from "@/data/m1/combis.json";
import judges from "@/data/m1/judges.json";
import performances from "@/data/m1/performances.json";
import scores from "@/data/m1/scores.json";
import tournaments from "@/data/m1/tournaments.json";
import type { Judge, Performance, Score, Tournament } from "@/types/m1";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

function getCombiName(combiId: string): string {
	return combis.find((c) => c.id === combiId)?.name ?? "";
}

function getPerformance(performanceId: string): Performance | undefined {
	return (performances as Performance[]).find((p) => p.id === performanceId);
}

function getTournament(tournamentId: string): Tournament | undefined {
	return (tournaments as Tournament[]).find((t) => t.id === tournamentId);
}

export async function generateStaticParams() {
	return (judges as Judge[]).map((j) => ({
		id: j.id,
	}));
}

export default async function JudgeDetailPage({ params }: Props) {
	const { id } = await params;

	const judge = (judges as Judge[]).find((j) => j.id === id);
	if (!judge) {
		notFound();
	}

	const judgeScores = (scores as Score[]).filter((s) => s.judgeId === id);

	const years = (tournaments as Tournament[])
		.filter((t) => t.judgeIds.includes(id))
		.map((t) => t.year)
		.sort();

	const averageScore =
		judgeScores.length > 0
			? judgeScores.reduce((sum, s) => sum + s.score, 0) / judgeScores.length
			: 0;

	const maxScore =
		judgeScores.length > 0 ? Math.max(...judgeScores.map((s) => s.score)) : 0;
	const minScore =
		judgeScores.length > 0 ? Math.min(...judgeScores.map((s) => s.score)) : 0;

	const yearlyStats = years
		.map((year) => {
			const tournament = (tournaments as Tournament[]).find(
				(t) => t.year === year,
			);
			if (!tournament) return null;

			const yearPerformances = (performances as Performance[]).filter(
				(p) => p.tournamentId === tournament.id && p.stage === "first",
			);

			const yearScores = judgeScores.filter((s) => {
				const perf = getPerformance(s.performanceId);
				return perf?.tournamentId === tournament.id;
			});

			const avg =
				yearScores.length > 0
					? yearScores.reduce((sum, s) => sum + s.score, 0) / yearScores.length
					: 0;

			const scoresWithCombi = yearScores
				.map((s) => {
					const perf = getPerformance(s.performanceId);
					return {
						score: s.score,
						combiId: perf?.combiId ?? "",
						combiName: getCombiName(perf?.combiId ?? ""),
						order: perf?.order ?? 0,
					};
				})
				.sort((a, b) => a.order - b.order);

			return {
				year,
				average: Math.round(avg * 10) / 10,
				scores: scoresWithCombi,
				count: yearScores.length,
			};
		})
		.filter(Boolean);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Link
						href="/m1/judges"
						className="text-red-400 hover:text-red-300 transition-colors"
					>
						← 審査員一覧に戻る
					</Link>
				</div>

				<header className="mb-8">
					<h1 className="text-4xl font-bold text-red-500 mb-2">{judge.name}</h1>
				</header>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1">出演回数</div>
						<div className="text-2xl font-bold text-red-400">
							{years.length}回
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1">平均点</div>
						<div className="text-2xl font-bold">
							{Math.round(averageScore * 10) / 10}
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
							<TrendingUp className="w-4 h-4 text-green-400" />
							最高点
						</div>
						<div className="text-2xl font-bold text-green-400">{maxScore}</div>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
							<TrendingDown className="w-4 h-4 text-blue-400" />
							最低点
						</div>
						<div className="text-2xl font-bold text-blue-400">{minScore}</div>
					</div>
				</div>

				<section className="mb-8">
					<h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
						年度別採点
					</h2>
					{yearlyStats.map((stat) => {
						if (!stat) return null;
						return (
							<div key={stat.year} className="mb-6 bg-gray-800 rounded-lg p-4">
								<div className="flex items-center justify-between mb-4">
									<Link
										href={`/m1/years/${stat.year}`}
										className="text-xl font-bold text-red-400 hover:text-red-300 transition-colors"
									>
										{stat.year}年（第{stat.year - 2000}回）
									</Link>
									<span className="text-gray-400">
										平均:{" "}
										<span className="text-white font-bold">{stat.average}</span>
										点
									</span>
								</div>

								<div className="overflow-x-auto">
									<table className="w-full text-sm">
										<thead>
											<tr className="border-b border-gray-700">
												<th className="text-left py-2 px-2">順番</th>
												<th className="text-left py-2 px-2">コンビ</th>
												<th className="text-center py-2 px-2">得点</th>
												<th className="text-center py-2 px-2">平均差</th>
											</tr>
										</thead>
										<tbody>
											{stat.scores.map((score, idx) => {
												const diff = score.score - stat.average;
												return (
													<tr key={idx} className="border-b border-gray-700">
														<td className="py-2 px-2">{score.order}番</td>
														<td className="py-2 px-2">
															<Link
																href={`/m1/combis/${score.combiId}`}
																className="hover:text-red-400 transition-colors"
															>
																{score.combiName}
															</Link>
														</td>
														<td className="text-center py-2 px-2 font-bold">
															{score.score}
														</td>
														<td
															className={`text-center py-2 px-2 ${
																diff > 0
																	? "text-green-400"
																	: diff < 0
																		? "text-blue-400"
																		: "text-gray-400"
															}`}
														>
															{diff > 0 ? "+" : ""}
															{Math.round(diff * 10) / 10}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
						);
					})}
				</section>
			</div>
		</div>
	);
}
