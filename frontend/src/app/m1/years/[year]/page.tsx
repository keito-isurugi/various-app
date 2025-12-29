import combis from "@/data/m1/combis.json";
import judges from "@/data/m1/judges.json";
import performances from "@/data/m1/performances.json";
import scores from "@/data/m1/scores.json";
import tournaments from "@/data/m1/tournaments.json";
import type { Performance, Score, Tournament } from "@/types/m1";
import { Crown, Medal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ year: string }>;
};

function getJudgeName(judgeId: string): string {
	return judges.find((j) => j.id === judgeId)?.name ?? "";
}

function getCombiName(combiId: string): string {
	return combis.find((c) => c.id === combiId)?.name ?? "";
}

function getScoresForPerformance(performanceId: string): Score[] {
	return (scores as Score[]).filter((s) => s.performanceId === performanceId);
}

export async function generateStaticParams() {
	return (tournaments as Tournament[]).map((t) => ({
		year: t.year.toString(),
	}));
}

export default async function YearDetailPage({ params }: Props) {
	const { year: yearStr } = await params;
	const year = Number.parseInt(yearStr, 10);

	const tournament = (tournaments as Tournament[]).find((t) => t.year === year);
	if (!tournament) {
		notFound();
	}

	const tournamentPerformances = (performances as Performance[]).filter(
		(p) => p.tournamentId === tournament.id,
	);

	const firstStagePerformances = tournamentPerformances
		.filter((p) => p.stage === "first")
		.sort((a, b) => a.order - b.order);

	const finalStagePerformances = tournamentPerformances
		.filter((p) => p.stage === "final")
		.sort((a, b) => a.order - b.order);

	const tournamentJudges = tournament.judgeIds.map((id) => ({
		id,
		name: getJudgeName(id),
	}));

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Link
						href="/m1"
						className="text-red-400 hover:text-red-300 transition-colors"
					>
						← トップに戻る
					</Link>
				</div>

				<header className="mb-8">
					<h1 className="text-4xl font-bold text-red-500 mb-2">
						M-1グランプリ {year}
					</h1>
					<p className="text-gray-400">第{year - 2000}回大会</p>
				</header>

				<section className="mb-8">
					<h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
						審査員
					</h2>
					<div className="flex flex-wrap gap-2">
						{tournamentJudges.map((judge) => (
							<span
								key={judge.id}
								className="bg-gray-800 px-3 py-1 rounded-full text-sm"
							>
								{judge.name}
							</span>
						))}
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
						ファーストステージ
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-700">
									<th className="text-left py-2 px-2">順番</th>
									<th className="text-left py-2 px-2">コンビ</th>
									{tournamentJudges.map((judge) => (
										<th
											key={judge.id}
											className="text-center py-2 px-2 min-w-[60px]"
										>
											{judge.name.slice(0, 3)}
										</th>
									))}
									<th className="text-center py-2 px-2">合計</th>
									<th className="text-center py-2 px-2">順位</th>
								</tr>
							</thead>
							<tbody>
								{firstStagePerformances.map((perf) => {
									const perfScores = getScoresForPerformance(perf.id);
									const isTopThree = perf.rank <= 3;
									return (
										<tr
											key={perf.id}
											className={`border-b border-gray-800 ${
												isTopThree ? "bg-gray-800" : ""
											}`}
										>
											<td className="py-2 px-2">{perf.order}</td>
											<td className="py-2 px-2 font-medium">
												<Link
													href={`/m1/combis/${perf.combiId}`}
													className="hover:text-red-400 transition-colors"
												>
													{getCombiName(perf.combiId)}
												</Link>
											</td>
											{tournamentJudges.map((judge) => {
												const score = perfScores.find(
													(s) => s.judgeId === judge.id,
												);
												return (
													<td key={judge.id} className="text-center py-2 px-2">
														{score?.score ?? "-"}
													</td>
												);
											})}
											<td className="text-center py-2 px-2 font-bold text-red-400">
												{perf.totalScore}
											</td>
											<td className="text-center py-2 px-2">
												{perf.rank === 1 && (
													<Medal className="w-5 h-5 text-yellow-400 inline" />
												)}
												{perf.rank === 2 && (
													<Medal className="w-5 h-5 text-gray-300 inline" />
												)}
												{perf.rank === 3 && (
													<Medal className="w-5 h-5 text-orange-400 inline" />
												)}
												{perf.rank > 3 && perf.rank}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>

				{finalStagePerformances.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
							ファイナルステージ
						</h2>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b border-gray-700">
										<th className="text-left py-2 px-2">順番</th>
										<th className="text-left py-2 px-2">コンビ</th>
										<th className="text-center py-2 px-2">得票数</th>
										<th className="text-center py-2 px-2">結果</th>
									</tr>
								</thead>
								<tbody>
									{finalStagePerformances
										.sort((a, b) => a.rank - b.rank)
										.map((perf) => (
											<tr
												key={perf.id}
												className={`border-b border-gray-800 ${
													perf.rank === 1 ? "bg-yellow-900/30" : ""
												}`}
											>
												<td className="py-2 px-2">{perf.order}</td>
												<td className="py-2 px-2 font-medium">
													<Link
														href={`/m1/combis/${perf.combiId}`}
														className="hover:text-red-400 transition-colors"
													>
														{getCombiName(perf.combiId)}
													</Link>
												</td>
												<td className="text-center py-2 px-2 font-bold text-red-400">
													{perf.totalVotes}票
												</td>
												<td className="text-center py-2 px-2">
													{perf.rank === 1 && (
														<span className="text-yellow-400 font-bold flex items-center justify-center gap-1">
															<Crown className="w-5 h-5" />
															優勝
														</span>
													)}
													{perf.rank === 2 && (
														<span className="text-gray-300">2位</span>
													)}
													{perf.rank === 3 && (
														<span className="text-orange-400">3位</span>
													)}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</section>
				)}

				<div className="flex justify-between mt-8">
					{year > 2001 && (
						<Link
							href={`/m1/years/${year - 1}`}
							className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
						>
							← {year - 1}年
						</Link>
					)}
					<div />
					{year < 2010 && (
						<Link
							href={`/m1/years/${year + 1}`}
							className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
						>
							{year + 1}年 →
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
