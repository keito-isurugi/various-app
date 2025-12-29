import combis from "@/data/m1/combis.json";
import performances from "@/data/m1/performances.json";
import tournaments from "@/data/m1/tournaments.json";
import type { Performance, Tournament } from "@/types/m1";
import { Crown } from "lucide-react";
import Link from "next/link";

type CombiStats = {
	id: string;
	name: string;
	appearances: number;
	finalAppearances: number;
	wins: number;
	years: number[];
};

function getCombiStats(): CombiStats[] {
	return combis.map((combi) => {
		const combiPerformances = (performances as Performance[]).filter(
			(p) => p.combiId === combi.id,
		);

		const firstStagePerformances = combiPerformances.filter(
			(p) => p.stage === "first",
		);
		const finalPerformances = combiPerformances.filter(
			(p) => p.stage === "final",
		);
		const wins = finalPerformances.filter((p) => p.rank === 1).length;

		const years = [
			...new Set(
				firstStagePerformances.map((p) => {
					const tournament = (tournaments as Tournament[]).find(
						(t) => t.id === p.tournamentId,
					);
					return tournament?.year ?? 0;
				}),
			),
		].sort();

		return {
			id: combi.id,
			name: combi.name,
			appearances: firstStagePerformances.length,
			finalAppearances: finalPerformances.length,
			wins,
			years,
		};
	});
}

export default function CombisPage() {
	const combiStats = getCombiStats()
		.filter((c) => c.appearances > 0)
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
					<h1 className="text-4xl font-bold text-red-500 mb-2">コンビ一覧</h1>
					<p className="text-gray-400">決勝進出コンビ: {combiStats.length}組</p>
				</header>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-700">
								<th className="text-left py-3 px-4">コンビ名</th>
								<th className="text-center py-3 px-4">出場回数</th>
								<th className="text-center py-3 px-4">ファイナル進出</th>
								<th className="text-center py-3 px-4">優勝</th>
								<th className="text-left py-3 px-4">出場年度</th>
							</tr>
						</thead>
						<tbody>
							{combiStats.map((combi) => (
								<tr
									key={combi.id}
									className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
								>
									<td className="py-3 px-4">
										<Link
											href={`/m1/combis/${combi.id}`}
											className="font-medium hover:text-red-400 transition-colors"
										>
											{combi.name}
										</Link>
									</td>
									<td className="text-center py-3 px-4">
										{combi.appearances}回
									</td>
									<td className="text-center py-3 px-4">
										{combi.finalAppearances > 0 ? (
											<span className="text-red-400">
												{combi.finalAppearances}回
											</span>
										) : (
											<span className="text-gray-500">-</span>
										)}
									</td>
									<td className="text-center py-3 px-4">
										{combi.wins > 0 ? (
											<span className="text-yellow-400 flex items-center justify-center gap-1">
												<Crown className="w-4 h-4" />
												{combi.wins}
											</span>
										) : (
											<span className="text-gray-500">-</span>
										)}
									</td>
									<td className="py-3 px-4">
										<div className="flex flex-wrap gap-1">
											{combi.years.map((year) => (
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
