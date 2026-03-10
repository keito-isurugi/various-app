"use client";

import {
	CATEGORY_COLORS,
	MEMORY_FIELDS,
	MEMORY_GROUPS,
	MOVE_NAMES,
} from "@/data/pokemon-select-bug";
import type { MemoryState } from "@/types/pokemon-select-bug";

interface MemoryViewerProps {
	memory: MemoryState;
	menuItemToSwap: number;
	currentStep: number;
}

function toHex(value: number): string {
	return value.toString(16).toUpperCase().padStart(2, "0");
}

/** 種族番号→ポケモン名 */
const SPECIES_NAMES: Record<number, string> = {
	6: "リザードン",
};

/** タイプ番号→タイプ名 */
const TYPE_NAMES: Record<number, string> = {
	0: "ノーマル",
	2: "ひこう",
	10: "ほのお",
};

/** 1バイトの値からゲーム上の意味を返す（単独バイトのみ） */
function getSingleByteMeaning(offset: number, value: number): string {
	switch (offset) {
		case 0x00:
			return SPECIES_NAMES[value] ?? `No.${value}`;
		case 0x03:
			return `Lv.${value}`;
		case 0x04:
			return value === 0 ? "正常" : "異常";
		case 0x05:
		case 0x06:
			return TYPE_NAMES[value] ?? `${value}`;
		case 0x07:
			return `${value}`;
		case 0x08:
		case 0x09:
		case 0x0a:
		case 0x0b:
			return MOVE_NAMES[value] ?? (value === 0 ? "---" : `技${value}`);
		default:
			return `${value}`;
	}
}

/** 複数バイト値の計算パネルに表示するデータ */
function getMultiByteBreakdowns(bytes: number[]) {
	const hpHi = bytes[0x01] ?? 0;
	const hpLo = bytes[0x02] ?? 0;
	const hp = (hpHi << 8) | hpLo;

	const idHi = bytes[0x0c] ?? 0;
	const idLo = bytes[0x0d] ?? 0;
	const otid = (idHi << 8) | idLo;

	const expHi = bytes[0x0e] ?? 0;
	const expMid = bytes[0x0f] ?? 0;
	const expLo = bytes[0x10] ?? 0;
	const exp = (expHi << 16) | (expMid << 8) | expLo;

	return [
		{
			label: "HP",
			color:
				"bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700",
			parts: [
				{ name: "HP上", hex: toHex(hpHi), decimal: hpHi, multiplier: 256 },
				{ name: "HP下", hex: toHex(hpLo), decimal: hpLo, multiplier: 1 },
			],
			total: hp,
			formula: `${hpHi} × 256 + ${hpLo} × 1`,
		},
		{
			label: "トレーナーID",
			color:
				"bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700",
			parts: [
				{ name: "ID上", hex: toHex(idHi), decimal: idHi, multiplier: 256 },
				{ name: "ID下", hex: toHex(idLo), decimal: idLo, multiplier: 1 },
			],
			total: otid,
			formula: `${idHi} × 256 + ${idLo} × 1`,
		},
		{
			label: "経験値",
			color: "bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700",
			parts: [
				{
					name: "経験上",
					hex: toHex(expHi),
					decimal: expHi,
					multiplier: 65536,
				},
				{
					name: "経験中",
					hex: toHex(expMid),
					decimal: expMid,
					multiplier: 256,
				},
				{ name: "経験下", hex: toHex(expLo), decimal: expLo, multiplier: 1 },
			],
			total: exp,
			formula: `${expHi} × 65536 + ${expMid} × 256 + ${expLo} × 1`,
		},
	];
}

export function MemoryViewer({
	memory,
	menuItemToSwap,
	currentStep,
}: MemoryViewerProps) {
	const { bytes, highlightedOffsets, swapAnimation } = memory;
	const breakdowns = getMultiByteBreakdowns(bytes);

	return (
		<div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
			{/* タイトルと説明 */}
			<div className="mb-4">
				<h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-1">
					ポケモンのメモリ構造
				</h3>
				<p className="text-xs text-gray-500 dark:text-gray-400">
					ポケモン1匹分のデータは全44バイトありますが、ここではバグに関係する先頭17バイトを表示しています。
					各マスが1バイトのデータです。
					{currentStep === 0 &&
						"技データの直後に経験値が並んでいることに注目してください。"}
				</p>
			</div>

			{/* 入れ替えフラグ */}
			<div className="flex items-center gap-2 mb-4 p-2 rounded bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
					入れ替えフラグ:
				</span>
				<span
					className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
						menuItemToSwap !== 0
							? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 animate-pulse"
							: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
					}`}
				>
					{menuItemToSwap !== 0 ? `${menuItemToSwap}番目` : "OFF"}
				</span>
				<span className="text-[10px] text-gray-400 dark:text-gray-500">
					{menuItemToSwap !== 0
						? "セレクトボタンで選択された入れ替え対象がメモリに残っています"
						: "入れ替え対象は選択されていません"}
				</span>
			</div>

			{/* グループラベル行 */}
			<div className="grid grid-cols-17 gap-0.5 mb-0.5">
				{MEMORY_FIELDS.map((field) => {
					const group = MEMORY_GROUPS.find(
						(g) => field.offset >= g.startOffset && field.offset <= g.endOffset,
					);
					const isGroupStart = group && field.offset === group.startOffset;
					if (!isGroupStart) {
						return <div key={`group-${field.offset}`} />;
					}
					const span = group.endOffset - group.startOffset + 1;
					return (
						<div
							key={`group-${field.offset}`}
							className={`text-center text-[9px] font-bold ${group.color}`}
							style={{ gridColumn: `span ${span}` }}
						>
							{group.label}
						</div>
					);
				})}
			</div>

			{/* メモリグリッド */}
			<div className="grid grid-cols-17 gap-0.5 mb-1">
				{/* フィールド名行 */}
				{MEMORY_FIELDS.map((field) => (
					<div
						key={`name-${field.offset}`}
						className="text-center text-[8px] text-gray-500 dark:text-gray-400 leading-tight mb-0.5"
					>
						{field.name}
					</div>
				))}

				{/* データ行: 16進数バイト値 */}
				{MEMORY_FIELDS.map((field) => {
					const value = bytes[field.offset] ?? 0;
					const isHighlighted = highlightedOffsets.includes(field.offset);
					const isSwapSource = swapAnimation?.fromOffset === field.offset;
					const isSwapTarget = swapAnimation?.toOffset === field.offset;
					const isSwapping = isSwapSource || isSwapTarget;
					const colors = CATEGORY_COLORS[field.category] ?? {
						bg: "bg-gray-100",
						text: "text-gray-800",
					};

					let animationClass = "";
					if (swapAnimation?.phase === "move" && isSwapping) {
						animationClass = "animate-bounce";
					}

					return (
						<div
							key={`byte-${field.offset}`}
							className={`
								text-center font-mono text-sm font-bold py-1.5 rounded transition-all duration-300
								${colors.bg} ${colors.text}
								${isHighlighted ? "ring-2 ring-red-500 dark:ring-red-400 scale-110 z-10" : ""}
								${isSwapping ? `ring-2 ring-yellow-400 ${animationClass}` : ""}
							`}
						>
							{toHex(value)}
						</div>
					);
				})}

				{/* ゲーム上の意味行 */}
				{MEMORY_FIELDS.map((field) => {
					const value = bytes[field.offset] ?? 0;
					const meaning = getSingleByteMeaning(field.offset, value);
					return (
						<div
							key={`meaning-${field.offset}`}
							className="text-center text-[7px] text-gray-600 dark:text-gray-300 leading-tight mt-0.5 font-medium truncate"
							title={meaning}
						>
							{meaning}
						</div>
					);
				})}
			</div>

			{/* 複数バイト値の計算過程 */}
			<div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
				<h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
					データの読み方（複数バイトにまたがる値）
				</h4>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
					{breakdowns.map((item) => (
						<div
							key={item.label}
							className={`rounded-lg border p-2.5 ${item.color}`}
						>
							<div className="text-[10px] font-bold text-gray-700 dark:text-gray-300 mb-1.5">
								{item.label}
							</div>

							{/* 各バイトの内訳 */}
							<div className="space-y-0.5 mb-1.5">
								{item.parts.map((part) => (
									<div
										key={part.name}
										className="flex items-center justify-between text-[10px] font-mono"
									>
										<span className="text-gray-500 dark:text-gray-400">
											{part.name}:
										</span>
										<span className="text-gray-700 dark:text-gray-300">
											0x{part.hex} ={" "}
											<span className="font-bold">{part.decimal}</span>{" "}
											<span className="text-gray-400 dark:text-gray-500">
												× {part.multiplier.toLocaleString()}
											</span>
										</span>
									</div>
								))}
							</div>

							{/* 合計 */}
							<div className="border-t border-gray-300 dark:border-gray-600 pt-1">
								<div className="flex items-center justify-between">
									<span className="text-[10px] text-gray-500 dark:text-gray-400">
										合計:
									</span>
									<span className="text-sm font-bold text-gray-800 dark:text-gray-200">
										{item.total.toLocaleString()}
									</span>
								</div>
								<div className="text-[8px] text-gray-400 dark:text-gray-500 text-right mt-0.5">
									{item.formula}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* カテゴリ凡例 */}
			<div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
				{[
					{ category: "move", label: "技データ" },
					{ category: "otid", label: "トレーナーID" },
					{ category: "exp", label: "経験値" },
					{ category: "species", label: "種族" },
					{ category: "hp", label: "HP" },
					{ category: "level", label: "レベル" },
					{ category: "type", label: "タイプ" },
				].map(({ category, label }) => {
					const colors = CATEGORY_COLORS[category];
					return (
						<div key={category} className="flex items-center gap-1">
							<div
								className={`w-3 h-3 rounded ${colors?.bg ?? "bg-gray-200"}`}
							/>
							<span className="text-[10px] text-gray-500 dark:text-gray-400">
								{label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
