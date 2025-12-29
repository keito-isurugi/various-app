import combis from "@/data/m1/combis.json";
import performances from "@/data/m1/performances.json";
import tournaments from "@/data/m1/tournaments.json";
import type { Combi, Performance, Tournament } from "@/types/m1";
import { Award, Crown, Medal, Star, TrendingUp, Trophy } from "lucide-react";
import Link from "next/link";

type CombiStats = {
	combiId: string;
	wins: number;
	consecutiveWins: number;
	finals: number;
	consecutiveFinals: number;
	firstPlaceFirstRound: number;
	consecutiveFirstPlaceFirstRound: number;
	finalStageAppearances: number;
	consecutiveFinalStageAppearances: number;
};

type PerformanceWithAvg = Performance & {
	avgScore: number;
	year: number;
	combiName: string;
};

function getCombiName(combiId: string): string {
	return (combis as Combi[]).find((c) => c.id === combiId)?.name ?? "不明";
}

function getTournamentYear(tournamentId: string): number {
	return (
		(tournaments as Tournament[]).find((t) => t.id === tournamentId)?.year ?? 0
	);
}

function getJudgeCount(tournamentId: string): number {
	const tournament = (tournaments as Tournament[]).find(
		(t) => t.id === tournamentId,
	);
	return tournament?.judgeIds.length ?? 7;
}

function calculateCombiStats(): CombiStats[] {
	const stats: Map<string, CombiStats> = new Map();
	const performanceData = performances as Performance[];
	const tournamentData = tournaments as Tournament[];

	// 年度順にソート
	const sortedTournaments = [...tournamentData].sort((a, b) => a.year - b.year);

	// 各コンビの統計を初期化
	for (const combi of combis as Combi[]) {
		stats.set(combi.id, {
			combiId: combi.id,
			wins: 0,
			consecutiveWins: 0,
			finals: 0,
			consecutiveFinals: 0,
			firstPlaceFirstRound: 0,
			consecutiveFirstPlaceFirstRound: 0,
			finalStageAppearances: 0,
			consecutiveFinalStageAppearances: 0,
		});
	}

	// 年度ごとの結果を追跡
	const combiYearlyResults: Map<
		string,
		{
			year: number;
			won: boolean;
			reachedFinal: boolean;
			firstPlaceFirstRound: boolean;
			reachedFinalStage: boolean;
		}[]
	> = new Map();

	for (const tournament of sortedTournaments) {
		const tournamentPerfs = performanceData.filter(
			(p) => p.tournamentId === tournament.id,
		);

		// 優勝者（最終決戦でrank=1）
		const winner = tournamentPerfs.find(
			(p) => p.stage === "final" && p.rank === 1,
		);
		// 決勝進出者
		const finalists = tournamentPerfs.filter((p) => p.stage === "first");
		// ファーストラウンド1位
		const firstPlaceFirst = tournamentPerfs.find(
			(p) => p.stage === "first" && p.rank === 1,
		);
		// 最終決戦進出者
		const finalStageParticipants = tournamentPerfs.filter(
			(p) => p.stage === "final",
		);

		for (const finalist of finalists) {
			const combiId = finalist.combiId;
			const stat = stats.get(combiId);
			if (!stat) continue;

			stat.finals++;

			const isWinner = winner?.combiId === combiId;
			const isFirstPlace = firstPlaceFirst?.combiId === combiId;
			const inFinalStage = finalStageParticipants.some(
				(p) => p.combiId === combiId,
			);

			if (isWinner) stat.wins++;
			if (isFirstPlace) stat.firstPlaceFirstRound++;
			if (inFinalStage) stat.finalStageAppearances++;

			// 年度ごとの結果を記録
			if (!combiYearlyResults.has(combiId)) {
				combiYearlyResults.set(combiId, []);
			}
			combiYearlyResults.get(combiId)?.push({
				year: tournament.year,
				won: isWinner,
				reachedFinal: true,
				firstPlaceFirstRound: isFirstPlace,
				reachedFinalStage: inFinalStage,
			});
		}
	}

	// 連続記録を計算
	for (const [combiId, results] of combiYearlyResults) {
		const stat = stats.get(combiId);
		if (!stat) continue;

		// 連続優勝
		stat.consecutiveWins = calculateMaxConsecutive(
			results.filter((r) => r.won).map((r) => r.year),
		);
		// 連続決勝進出
		stat.consecutiveFinals = calculateMaxConsecutive(
			results.filter((r) => r.reachedFinal).map((r) => r.year),
		);
		// 連続ファーストラウンド1位
		stat.consecutiveFirstPlaceFirstRound = calculateMaxConsecutive(
			results.filter((r) => r.firstPlaceFirstRound).map((r) => r.year),
		);
		// 連続最終決戦進出
		stat.consecutiveFinalStageAppearances = calculateMaxConsecutive(
			results.filter((r) => r.reachedFinalStage).map((r) => r.year),
		);
	}

	return Array.from(stats.values());
}

function calculateMaxConsecutive(years: number[]): number {
	if (years.length === 0) return 0;

	const sortedYears = [...years].sort((a, b) => a - b);
	let maxConsecutive = 1;
	let currentConsecutive = 1;

	// M-1の年度を考慮（2011-2014は開催なし）
	const tournamentYears = (tournaments as Tournament[])
		.map((t) => t.year)
		.sort((a, b) => a - b);

	for (let i = 1; i < sortedYears.length; i++) {
		const prevYear = sortedYears[i - 1];
		const currentYear = sortedYears[i];

		// 連続した大会かどうかを確認
		const prevIndex = tournamentYears.indexOf(prevYear);
		const currentIndex = tournamentYears.indexOf(currentYear);

		if (currentIndex === prevIndex + 1) {
			currentConsecutive++;
			maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
		} else {
			currentConsecutive = 1;
		}
	}

	return maxConsecutive;
}

function calculateFirstRoundAverages(): PerformanceWithAvg[] {
	const result: PerformanceWithAvg[] = [];
	const performanceData = performances as Performance[];

	for (const perf of performanceData) {
		if (perf.stage !== "first" || perf.totalScore === undefined) continue;

		const judgeCount = getJudgeCount(perf.tournamentId);
		const avgScore = perf.totalScore / judgeCount;
		const year = getTournamentYear(perf.tournamentId);
		const combiName = getCombiName(perf.combiId);

		result.push({
			...perf,
			avgScore,
			year,
			combiName,
		});
	}

	return result;
}

function calculateFinalStageBorderScores(): {
	year: number;
	borderScore: number;
	avgBorderScore: number;
}[] {
	const result: {
		year: number;
		borderScore: number;
		avgBorderScore: number;
	}[] = [];
	const performanceData = performances as Performance[];
	const tournamentData = tournaments as Tournament[];

	for (const tournament of tournamentData) {
		const firstRoundPerfs = performanceData
			.filter(
				(p) =>
					p.tournamentId === tournament.id &&
					p.stage === "first" &&
					p.totalScore !== undefined,
			)
			.sort((a, b) => (a.totalScore ?? 0) - (b.totalScore ?? 0));

		// 最終決戦進出者を取得
		const finalStagePerfs = performanceData.filter(
			(p) => p.tournamentId === tournament.id && p.stage === "final",
		);

		// 最終決戦進出のボーダー（3位のスコア）
		const finalStageCombiIds = finalStagePerfs.map((p) => p.combiId);
		const finalStageFirstRoundPerfs = firstRoundPerfs.filter((p) =>
			finalStageCombiIds.includes(p.combiId),
		);

		if (finalStageFirstRoundPerfs.length > 0) {
			const borderPerf = finalStageFirstRoundPerfs[0];
			const judgeCount = getJudgeCount(tournament.id);
			result.push({
				year: tournament.year,
				borderScore: borderPerf.totalScore ?? 0,
				avgBorderScore: (borderPerf.totalScore ?? 0) / judgeCount,
			});
		}
	}

	return result;
}

function calculateFirstRoundEliminationBorder(): {
	year: number;
	borderScore: number;
	avgBorderScore: number;
	combiName: string;
}[] {
	const result: {
		year: number;
		borderScore: number;
		avgBorderScore: number;
		combiName: string;
	}[] = [];
	const performanceData = performances as Performance[];
	const tournamentData = tournaments as Tournament[];

	for (const tournament of tournamentData) {
		const firstRoundPerfs = performanceData
			.filter(
				(p) =>
					p.tournamentId === tournament.id &&
					p.stage === "first" &&
					p.totalScore !== undefined,
			)
			.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

		// 最終決戦進出者を取得
		const finalStagePerfs = performanceData.filter(
			(p) => p.tournamentId === tournament.id && p.stage === "final",
		);
		const finalStageCombiIds = finalStagePerfs.map((p) => p.combiId);

		// 敗退者の中で最高スコア（4位）
		const eliminatedPerfs = firstRoundPerfs.filter(
			(p) => !finalStageCombiIds.includes(p.combiId),
		);

		if (eliminatedPerfs.length > 0) {
			const borderPerf = eliminatedPerfs[0];
			const judgeCount = getJudgeCount(tournament.id);
			result.push({
				year: tournament.year,
				borderScore: borderPerf.totalScore ?? 0,
				avgBorderScore: (borderPerf.totalScore ?? 0) / judgeCount,
				combiName: getCombiName(borderPerf.combiId),
			});
		}
	}

	return result;
}

function RecordSection({
	title,
	icon: Icon,
	children,
}: {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	children: React.ReactNode;
}) {
	return (
		<section className="mb-8">
			<h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
				<Icon className="w-5 h-5 text-red-400" />
				{title}
			</h2>
			{children}
		</section>
	);
}

function RankingTable({
	headers,
	rows,
}: {
	headers: string[];
	rows: { rank: number; cells: (string | number)[] }[];
}) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-gray-700">
						<th className="py-2 px-3 text-left w-16">順位</th>
						{headers.map((header) => (
							<th key={header} className="py-2 px-3 text-left">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, index) => (
						<tr
							key={`${row.rank}-${index}`}
							className="border-b border-gray-800 hover:bg-gray-800/50"
						>
							<td className="py-2 px-3">
								{row.rank === 1 && (
									<span className="text-yellow-400 font-bold">1</span>
								)}
								{row.rank === 2 && (
									<span className="text-gray-300 font-bold">2</span>
								)}
								{row.rank === 3 && (
									<span className="text-amber-600 font-bold">3</span>
								)}
								{row.rank > 3 && <span>{row.rank}</span>}
							</td>
							{row.cells.map((cell, cellIndex) => (
								<td key={cellIndex} className="py-2 px-3">
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default function RecordsPage() {
	const combiStats = calculateCombiStats();
	const firstRoundAverages = calculateFirstRoundAverages();
	const finalStageBorders = calculateFinalStageBorderScores();
	const eliminationBorders = calculateFirstRoundEliminationBorder();

	// 最多優勝回数 Top5
	const topWins = [...combiStats]
		.filter((s) => s.wins > 0)
		.sort((a, b) => b.wins - a.wins)
		.slice(0, 5);

	// 最多決勝戦進出回数 Top5
	const topFinals = [...combiStats]
		.filter((s) => s.finals > 0)
		.sort((a, b) => b.finals - a.finals)
		.slice(0, 5);

	// 最多連続決勝戦進出回数 Top5
	const topConsecutiveFinals = [...combiStats]
		.filter((s) => s.consecutiveFinals > 1)
		.sort((a, b) => b.consecutiveFinals - a.consecutiveFinals)
		.slice(0, 5);

	// 最多ファーストラウンド1位通過回数 Top5
	const topFirstPlace = [...combiStats]
		.filter((s) => s.firstPlaceFirstRound > 0)
		.sort((a, b) => b.firstPlaceFirstRound - a.firstPlaceFirstRound)
		.slice(0, 5);

	// 最多最終決戦進出回数 Top5
	const topFinalStage = [...combiStats]
		.filter((s) => s.finalStageAppearances > 0)
		.sort((a, b) => b.finalStageAppearances - a.finalStageAppearances)
		.slice(0, 5);

	// 最多連続最終決戦進出回数 Top5
	const topConsecutiveFinalStage = [...combiStats]
		.filter((s) => s.consecutiveFinalStageAppearances > 1)
		.sort(
			(a, b) =>
				b.consecutiveFinalStageAppearances - a.consecutiveFinalStageAppearances,
		)
		.slice(0, 5);

	// ファーストラウンド最高平均点 Top5
	const topAvgScores = [...firstRoundAverages]
		.sort((a, b) => b.avgScore - a.avgScore)
		.slice(0, 5);

	// ファーストラウンド最低平均点 Top5
	const lowestAvgScores = [...firstRoundAverages]
		.sort((a, b) => a.avgScore - b.avgScore)
		.slice(0, 5);

	// 最終決戦進出ボーダー最高平均点 Top5
	const topBorderScores = [...finalStageBorders]
		.sort((a, b) => b.avgBorderScore - a.avgBorderScore)
		.slice(0, 5);

	// ファーストラウンド敗退ボーダー最高平均点 Top5
	const topEliminationBorders = [...eliminationBorders]
		.sort((a, b) => b.avgBorderScore - a.avgBorderScore)
		.slice(0, 5);

	// ボーダーライン間の差（最終決戦進出3位と敗退4位の差）を計算
	const borderGaps: {
		year: number;
		gap: number;
		avgGap: number;
	}[] = [];
	for (const finalBorder of finalStageBorders) {
		const elimBorder = eliminationBorders.find(
			(e) => e.year === finalBorder.year,
		);
		if (elimBorder) {
			borderGaps.push({
				year: finalBorder.year,
				gap: finalBorder.borderScore - elimBorder.borderScore,
				avgGap: finalBorder.avgBorderScore - elimBorder.avgBorderScore,
			});
		}
	}

	const maxBorderGaps = [...borderGaps]
		.sort((a, b) => b.avgGap - a.avgGap)
		.slice(0, 5);
	const minBorderGaps = [...borderGaps]
		.filter((g) => g.avgGap >= 0)
		.sort((a, b) => a.avgGap - b.avgGap)
		.slice(0, 5);

	// 歴代平均点
	const overallAvg =
		firstRoundAverages.reduce((sum, p) => sum + p.avgScore, 0) /
		firstRoundAverages.length;

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="container mx-auto px-4 py-8">
				<header className="mb-8">
					<Link
						href="/m1"
						className="text-gray-400 hover:text-white text-sm mb-4 inline-block"
					>
						M-1グランプリ 分析 に戻る
					</Link>
					<h1 className="text-3xl font-bold text-red-500 flex items-center gap-2">
						<Trophy className="w-8 h-8" />
						M-1グランプリ 記録集
					</h1>
					<p className="text-gray-400 mt-2">歴代の記録をランキング形式で表示</p>
				</header>

				<div className="bg-gray-800 rounded-lg p-6 mb-8">
					<h2 className="text-lg font-bold mb-2">歴代平均点</h2>
					<p className="text-4xl font-bold text-red-400">
						{overallAvg.toFixed(2)}点
					</p>
					<p className="text-gray-400 text-sm mt-1">
						全{firstRoundAverages.length}パフォーマンスの平均
					</p>
				</div>

				<RecordSection title="最多優勝回数" icon={Crown}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "優勝回数"]}
							rows={topWins.map((s, i) => ({
								rank: i + 1,
								cells: [getCombiName(s.combiId), `${s.wins}回`],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="最多決勝戦進出回数" icon={Trophy}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "進出回数"]}
							rows={topFinals.map((s, i) => ({
								rank: i + 1,
								cells: [getCombiName(s.combiId), `${s.finals}回`],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="最多連続決勝戦進出回数" icon={TrendingUp}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "連続進出回数"]}
							rows={topConsecutiveFinals.map((s, i) => ({
								rank: i + 1,
								cells: [getCombiName(s.combiId), `${s.consecutiveFinals}回`],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="最多ファーストラウンド1位通過回数" icon={Medal}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "1位通過回数"]}
							rows={topFirstPlace.map((s, i) => ({
								rank: i + 1,
								cells: [getCombiName(s.combiId), `${s.firstPlaceFirstRound}回`],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="最多最終決戦進出回数" icon={Star}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "進出回数"]}
							rows={topFinalStage.map((s, i) => ({
								rank: i + 1,
								cells: [
									getCombiName(s.combiId),
									`${s.finalStageAppearances}回`,
								],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="最多連続最終決戦進出回数" icon={TrendingUp}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "連続進出回数"]}
							rows={topConsecutiveFinalStage.map((s, i) => ({
								rank: i + 1,
								cells: [
									getCombiName(s.combiId),
									`${s.consecutiveFinalStageAppearances}回`,
								],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="ファーストラウンド最高平均点" icon={Award}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "年度", "平均点"]}
							rows={topAvgScores.map((p, i) => ({
								rank: i + 1,
								cells: [
									p.combiName,
									`${p.year}年`,
									`${p.avgScore.toFixed(2)}点`,
								],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="ファーストラウンド最低平均点" icon={Award}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["コンビ名", "年度", "平均点"]}
							rows={lowestAvgScores.map((p, i) => ({
								rank: i + 1,
								cells: [
									p.combiName,
									`${p.year}年`,
									`${p.avgScore.toFixed(2)}点`,
								],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="最終決戦進出ボーダー最高平均点" icon={TrendingUp}>
					<div className="bg-gray-800 rounded-lg p-4">
						<RankingTable
							headers={["年度", "平均点"]}
							rows={topBorderScores.map((b, i) => ({
								rank: i + 1,
								cells: [`${b.year}年`, `${b.avgBorderScore.toFixed(2)}点`],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection
					title="ファーストラウンド敗退ボーダー最高平均点"
					icon={TrendingUp}
				>
					<div className="bg-gray-800 rounded-lg p-4">
						<p className="text-gray-400 text-sm mb-3">
							最終決戦に進出できなかったコンビの中で最高得点
						</p>
						<RankingTable
							headers={["年度", "コンビ名", "平均点"]}
							rows={topEliminationBorders.map((b, i) => ({
								rank: i + 1,
								cells: [
									`${b.year}年`,
									b.combiName,
									`${b.avgBorderScore.toFixed(2)}点`,
								],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="ボーダーライン間の最大平均点差" icon={TrendingUp}>
					<div className="bg-gray-800 rounded-lg p-4">
						<p className="text-gray-400 text-sm mb-3">
							最終決戦進出3位と敗退4位の平均点差が大きい年度
						</p>
						<RankingTable
							headers={["年度", "平均点差"]}
							rows={maxBorderGaps.map((g, i) => ({
								rank: i + 1,
								cells: [`${g.year}年`, `${g.avgGap.toFixed(2)}点`],
							}))}
						/>
					</div>
				</RecordSection>

				<RecordSection title="ボーダーライン間の最小平均点差" icon={TrendingUp}>
					<div className="bg-gray-800 rounded-lg p-4">
						<p className="text-gray-400 text-sm mb-3">
							最終決戦進出3位と敗退4位の平均点差が小さい年度
						</p>
						<RankingTable
							headers={["年度", "平均点差"]}
							rows={minBorderGaps.map((g, i) => ({
								rank: i + 1,
								cells: [`${g.year}年`, `${g.avgGap.toFixed(2)}点`],
							}))}
						/>
					</div>
				</RecordSection>
			</div>
		</div>
	);
}
