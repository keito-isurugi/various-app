import combis from "@/data/m1/combis.json";
import judges from "@/data/m1/judges.json";
import performances from "@/data/m1/performances.json";
import scores from "@/data/m1/scores.json";
import tournaments from "@/data/m1/tournaments.json";
import type { Combi, Performance, Score, Tournament } from "@/types/m1";
import { Crown, Medal } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ id: string }>;
};

function getJudgeName(judgeId: string): string {
	return judges.find((j) => j.id === judgeId)?.name ?? "";
}

function getTournament(tournamentId: string): Tournament | undefined {
	return (tournaments as Tournament[]).find((t) => t.id === tournamentId);
}

function getScoresForPerformance(performanceId: string): Score[] {
	return (scores as Score[]).filter((s) => s.performanceId === performanceId);
}

export async function generateStaticParams() {
	return (combis as Combi[]).map((c) => ({
		id: c.id,
	}));
}

export default async function CombiDetailPage({ params }: Props) {
	const { id } = await params;

	const combi = (combis as Combi[]).find((c) => c.id === id);
	if (!combi) {
		notFound();
	}

	const combiPerformances = (performances as Performance[]).filter(
		(p) => p.combiId === id,
	);

	const firstStagePerformances = combiPerformances.filter(
		(p) => p.stage === "first",
	);
	const finalPerformances = combiPerformances.filter(
		(p) => p.stage === "final",
	);

	const years = [
		...new Set(
			firstStagePerformances.map((p) => {
				const tournament = getTournament(p.tournamentId);
				return tournament?.year ?? 0;
			}),
		),
	].sort();

	const wins = finalPerformances.filter((p) => p.rank === 1);
	const averageRank =
		firstStagePerformances.length > 0
			? (
					firstStagePerformances.reduce((sum, p) => sum + p.rank, 0) /
					firstStagePerformances.length
				).toFixed(1)
			: "-";

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6">
					<Link
						href="/m1/combis"
						className="text-red-400 hover:text-red-300 transition-colors"
					>
						← コンビ一覧に戻る
					</Link>
				</div>

				<header className="mb-8">
					<h1 className="text-4xl font-bold text-red-500 mb-2 flex items-center gap-3">
						{combi.name}
						{wins.length > 0 && <Crown className="w-8 h-8 text-yellow-400" />}
					</h1>
				</header>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1">出場回数</div>
						<div className="text-2xl font-bold text-red-400">
							{firstStagePerformances.length}回
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1">ファイナル進出</div>
						<div className="text-2xl font-bold text-red-400">
							{finalPerformances.length}回
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1">優勝</div>
						<div className="text-2xl font-bold text-yellow-400">
							{wins.length}回
						</div>
					</div>
					<div className="bg-gray-800 rounded-lg p-4">
						<div className="text-gray-400 text-sm mb-1">平均順位</div>
						<div className="text-2xl font-bold">{averageRank}位</div>
					</div>
				</div>

				<section className="mb-8">
					<h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
						年度別成績
					</h2>
					{years.map((year) => {
						const tournament = (tournaments as Tournament[]).find(
							(t) => t.year === year,
						);
						if (!tournament) return null;

						const firstPerf = firstStagePerformances.find(
							(p) => p.tournamentId === tournament.id,
						);
						const finalPerf = finalPerformances.find(
							(p) => p.tournamentId === tournament.id,
						);

						const firstScores = firstPerf
							? getScoresForPerformance(firstPerf.id)
							: [];

						const tournamentJudges = tournament.judgeIds.map((jid) => ({
							id: jid,
							name: getJudgeName(jid),
						}));

						return (
							<div key={year} className="mb-6 bg-gray-800 rounded-lg p-4">
								<div className="flex items-center justify-between mb-4">
									<Link
										href={`/m1/years/${year}`}
										className="text-xl font-bold text-red-400 hover:text-red-300 transition-colors"
									>
										{year}年（第{year - 2000}回）
									</Link>
									{finalPerf?.rank === 1 && (
										<span className="flex items-center gap-1 text-yellow-400 font-bold">
											<Crown className="w-5 h-5" />
											優勝
										</span>
									)}
								</div>

								{firstPerf && (
									<div className="mb-4">
										<h3 className="text-sm text-gray-400 mb-2">
											ファーストステージ
										</h3>
										<div className="overflow-x-auto">
											<table className="w-full text-sm">
												<thead>
													<tr className="border-b border-gray-700">
														<th className="text-left py-2 px-2">順番</th>
														{tournamentJudges.map((judge) => (
															<th
																key={judge.id}
																className="text-center py-2 px-2 min-w-[50px]"
															>
																{judge.name.slice(0, 3)}
															</th>
														))}
														<th className="text-center py-2 px-2">合計</th>
														<th className="text-center py-2 px-2">順位</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="py-2 px-2">{firstPerf.order}番</td>
														{tournamentJudges.map((judge) => {
															const score = firstScores.find(
																(s) => s.judgeId === judge.id,
															);
															return (
																<td
																	key={judge.id}
																	className="text-center py-2 px-2"
																>
																	{score?.score ?? "-"}
																</td>
															);
														})}
														<td className="text-center py-2 px-2 font-bold text-red-400">
															{firstPerf.totalScore}
														</td>
														<td className="text-center py-2 px-2">
															{firstPerf.rank <= 3 ? (
																<Medal
																	className={`w-5 h-5 inline ${
																		firstPerf.rank === 1
																			? "text-yellow-400"
																			: firstPerf.rank === 2
																				? "text-gray-300"
																				: "text-orange-400"
																	}`}
																/>
															) : (
																`${firstPerf.rank}位`
															)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								)}

								{finalPerf && (
									<div>
										<h3 className="text-sm text-gray-400 mb-2">
											ファイナルステージ
										</h3>
										<div className="flex items-center gap-4">
											<span>出場順: {finalPerf.order}番</span>
											<span className="text-red-400 font-bold">
												得票: {finalPerf.totalVotes}票
											</span>
											<span
												className={
													finalPerf.rank === 1
														? "text-yellow-400 font-bold"
														: finalPerf.rank === 2
															? "text-gray-300"
															: "text-orange-400"
												}
											>
												{finalPerf.rank}位
											</span>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</section>
			</div>
		</div>
	);
}
