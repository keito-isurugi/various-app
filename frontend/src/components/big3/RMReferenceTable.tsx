"use client";

import { ChevronDown, ChevronUp, ExternalLink, Table } from "lucide-react";
import { useState } from "react";
import {
	BENCH_PRESS_RM_TABLE,
	type RMTableData,
	RM_TABLE_SOURCE_URL,
	SQUAT_DEADLIFT_RM_TABLE,
} from "../../data/rm-reference-table";

type TableType = "bench" | "squat_deadlift";

interface RMReferenceTableProps {
	defaultOpen?: boolean;
}

export function RMReferenceTable({
	defaultOpen = false,
}: RMReferenceTableProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [activeTable, setActiveTable] = useState<TableType>("bench");

	const tableData: RMTableData =
		activeTable === "bench" ? BENCH_PRESS_RM_TABLE : SQUAT_DEADLIFT_RM_TABLE;

	return (
		<div className="rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm">
			{/* Header - アコーディオン */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer"
			>
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
						<Table className="w-5 h-5 text-white" />
					</div>
					<div className="text-left">
						<p className="font-bold text-white text-base">RM換算表（参考）</p>
						<p className="text-sm text-purple-100">重量と回数から1RMを逆引き</p>
					</div>
				</div>
				{isOpen ? (
					<ChevronUp className="w-6 h-6 text-white" />
				) : (
					<ChevronDown className="w-6 h-6 text-white" />
				)}
			</button>

			{/* Content */}
			{isOpen && (
				<div className="bg-white dark:bg-gray-800">
					{/* Tab切り替え */}
					<div className="flex gap-2 p-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
						<button
							type="button"
							onClick={() => setActiveTable("bench")}
							className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
								activeTable === "bench"
									? "bg-blue-600 text-white shadow-md"
									: "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
							}`}
						>
							ベンチプレス
						</button>
						<button
							type="button"
							onClick={() => setActiveTable("squat_deadlift")}
							className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-all cursor-pointer ${
								activeTable === "squat_deadlift"
									? "bg-red-600 text-white shadow-md"
									: "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500"
							}`}
						>
							スクワット・デッドリフト
						</button>
					</div>

					{/* 計算式 */}
					<div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
						<p className="text-sm font-medium text-amber-800 dark:text-amber-200">
							計算式:{" "}
							{activeTable === "bench"
								? "重量 × 回数 ÷ 40 + 重量"
								: "重量 × 回数 ÷ 33.3 + 重量"}
						</p>
					</div>

					{/* Table */}
					<div
						className="overflow-x-auto overflow-y-auto"
						style={{ maxHeight: "70vh" }}
					>
						<table className="w-full border-collapse">
							<thead className="sticky top-0 z-20">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-bold text-white bg-slate-900 border-b-2 border-r-2 border-slate-600 sticky left-0 z-30 min-w-[100px] whitespace-nowrap">
										重量/回数
									</th>
									{tableData.reps.map((rep) => (
										<th
											key={rep}
											className="px-4 py-3 text-center text-sm font-bold text-white bg-slate-900 border-b-2 border-slate-600 min-w-[56px]"
										>
											{rep}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{tableData.weights.map((weight, index) => {
									const isEven = index % 2 === 0;
									return (
										<tr
											key={weight}
											className={
												isEven
													? "bg-slate-100 dark:bg-slate-600"
													: "bg-white dark:bg-slate-700"
											}
										>
											<td
												className={`px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white border-r-2 border-slate-300 dark:border-slate-500 sticky left-0 z-10 ${
													isEven
														? "bg-slate-100 dark:bg-slate-600"
														: "bg-white dark:bg-slate-700"
												}`}
											>
												{weight}
											</td>
											{tableData.reps.map((rep) => (
												<td
													key={rep}
													className="px-4 py-2.5 text-center text-sm font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-600"
												>
													{tableData.table[weight][rep]}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Footer - 参照元 */}
					<div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
						<a
							href={RM_TABLE_SOURCE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
						>
							<ExternalLink className="w-4 h-4" />
							参考: FWJ Magazine - RM換算表
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
