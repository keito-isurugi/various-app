import judges from "@/data/m1/judges.json";
import scores from "@/data/m1/scores.json";
import tournaments from "@/data/m1/tournaments.json";
import type { Score, Tournament } from "@/types/m1";
import Link from "next/link";

type JudgeStats = {
	id: string;
	name: string;
	appearances: number;
	years: number[];
	averageScore: number;
	totalScores: number;
};

function getJudgeStats(): JudgeStats[] {
	return judges.map((judge) => {
		const judgeScores = (scores as Score[]).filter(
			(s) => s.judgeId === judge.id,
		);

		const years = (tournaments as Tournament[])
			.filter((t) => t.judgeIds.includes(judge.id))
			.map((t) => t.year)
			.sort();

		const averageScore =
			judgeScores.length > 0
				? judgeScores.reduce((sum, s) => sum + s.score, 0) / judgeScores.length
				: 0;

		return {
			id: judge.id,
			name: judge.name,
			appearances: years.length,
			years,
			averageScore: Math.round(averageScore * 10) / 10,
			totalScores: judgeScores.length,
		};
	});
}

export default function JudgesPage() {
	const judgeStats = getJudgeStats()
		.filter((j) => j.appearances > 0)
		.sort((a, b) => b.appearances - a.appearances);

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
					<h1 className="text-4xl font-bold text-red-500 mb-2">審査員一覧</h1>
					<p className="text-gray-400">審査員: {judgeStats.length}名</p>
				</header>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-700">
								<th className="text-left py-3 px-4">審査員名</th>
								<th className="text-center py-3 px-4">出演回数</th>
								<th className="text-center py-3 px-4">平均点</th>
								<th className="text-center py-3 px-4">採点数</th>
								<th className="text-left py-3 px-4">出演年度</th>
							</tr>
						</thead>
						<tbody>
							{judgeStats.map((judge) => (
								<tr
									key={judge.id}
									className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
								>
									<td className="py-3 px-4">
										<Link
											href={`/m1/judges/${judge.id}`}
											className="font-medium hover:text-red-400 transition-colors"
										>
											{judge.name}
										</Link>
									</td>
									<td className="text-center py-3 px-4">
										{judge.appearances}回
									</td>
									<td className="text-center py-3 px-4">
										<span className="text-red-400 font-medium">
											{judge.averageScore}
										</span>
									</td>
									<td className="text-center py-3 px-4 text-gray-400">
										{judge.totalScores}
									</td>
									<td className="py-3 px-4">
										<div className="flex flex-wrap gap-1">
											{judge.years.map((year) => (
												<Link
													key={year}
													href={`/m1/years/${year}`}
													className="bg-gray-700 px-2 py-0.5 rounded text-xs hover:bg-gray-600 transition-colors"
												>
													{year}
												</Link>
											))}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
