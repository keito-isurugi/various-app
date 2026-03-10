"use client";

import { ITEM_LIST, MOVE_NAMES } from "@/data/pokemon-select-bug";
import type { GameScreenState } from "@/types/pokemon-select-bug";

interface GameScreenProps {
	gameScreen: GameScreenState;
	level: number;
}

/** ゲームボーイ風のカーソル */
function Cursor({ active }: { active: boolean }) {
	return (
		<span className={`mr-1 ${active ? "opacity-100" : "opacity-0"}`}>▶</span>
	);
}

function FieldScreen() {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-2">
			<div className="text-2xl">🌿</div>
			<div className="text-sm">フィールド</div>
			<div className="text-xs opacity-70">くさむら の ちかく にいる...</div>
		</div>
	);
}

function ItemsScreen({
	cursorPosition,
	selectPressed,
}: {
	cursorPosition: number;
	selectPressed: boolean;
}) {
	return (
		<div className="flex flex-col h-full">
			<div className="border-b-2 border-current pb-1 mb-2 font-bold text-sm">
				どうぐ
			</div>
			<div className="flex-1 overflow-hidden text-xs space-y-0.5">
				{ITEM_LIST.map((item, i) => {
					const isSelected = i === cursorPosition && selectPressed;
					const isCursor = i === cursorPosition;
					return (
						<div
							key={item}
							className={`flex items-center py-0.5 px-1 rounded ${
								isSelected ? "bg-current/20 font-bold" : ""
							}`}
						>
							<Cursor active={isCursor} />
							<span>
								{item}
								{isSelected && " ◀ SELECT"}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function BattleScreen({ message }: { message: string }) {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="text-3xl mb-2">⚔️</div>
					<div className="text-xs">VS やせいの コラッタ</div>
				</div>
			</div>
			{message && (
				<div className="border-t-2 border-current pt-2 mt-2 text-xs">
					{message}
				</div>
			)}
		</div>
	);
}

function BattleFightScreen({
	message,
	cursorPosition,
}: {
	message: string;
	cursorPosition: number;
}) {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 flex items-center justify-center">
				<div className="text-center">
					<div className="text-3xl mb-2">🔥</div>
					<div className="text-xs">{message}</div>
				</div>
			</div>
			<div className="border-t-2 border-current pt-2">
				<div className="grid grid-cols-2 gap-1 text-xs">
					<div>
						<Cursor active={cursorPosition === 0} />
						たたかう
					</div>
					<div>
						<Cursor active={false} />
						どうぐ
					</div>
					<div>
						<Cursor active={false} />
						ポケモン
					</div>
					<div>
						<Cursor active={false} />
						にげる
					</div>
				</div>
			</div>
		</div>
	);
}

function MoveSelectScreen({ cursorPosition }: { cursorPosition: number }) {
	const moves = [
		{ id: 0x35, name: "きりさく" },
		{ id: 0x34, name: "かえんほうしゃ" },
		{ id: 0x11, name: "つばさでうつ" },
		{ id: 0x0a, name: "ひっかく" },
	];

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 flex items-center justify-center">
				<div className="text-xs opacity-70">リザードン の こうげき！</div>
			</div>
			<div className="border-t-2 border-current pt-2">
				<div className="grid grid-cols-2 gap-1 text-xs">
					{moves.map((move, i) => (
						<div key={move.id}>
							<Cursor active={i === cursorPosition} />
							{move.name}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function SwapScreen({ message }: { message: string }) {
	return (
		<div className="flex flex-col h-full items-center justify-center">
			<div className="text-3xl mb-3 animate-pulse">⚠️</div>
			<div className="text-xs text-center font-bold">{message}</div>
			<div className="mt-3 text-xs opacity-70 text-center">
				きりさく → ？？？？
				<br />
				わざ の なまえ が おかしい！
			</div>
		</div>
	);
}

function LevelUpScreen({
	message,
	level,
}: {
	message: string;
	level: number;
}) {
	return (
		<div className="flex flex-col h-full items-center justify-center">
			<div className="text-4xl mb-3 animate-bounce">🎉</div>
			<div className="text-lg font-bold mb-2">Lv. {level}</div>
			<div className="text-xs text-center">{message}</div>
		</div>
	);
}

function BattleResultScreen({ message }: { message: string }) {
	return (
		<div className="flex flex-col h-full items-center justify-center">
			<div className="text-3xl mb-3">✨</div>
			<div className="text-xs text-center">{message}</div>
		</div>
	);
}

export function GameScreen({ gameScreen, level }: GameScreenProps) {
	const { screen, cursorPosition, selectPressed, message } = gameScreen;

	const renderScreen = () => {
		switch (screen) {
			case "field":
				return <FieldScreen />;
			case "menu":
				return <FieldScreen />;
			case "items":
				return (
					<ItemsScreen
						cursorPosition={cursorPosition}
						selectPressed={selectPressed}
					/>
				);
			case "battle":
				return <BattleScreen message={message} />;
			case "battle-fight":
				return (
					<BattleFightScreen
						message={message}
						cursorPosition={cursorPosition}
					/>
				);
			case "battle-moves":
				return <MoveSelectScreen cursorPosition={cursorPosition} />;
			case "battle-swap":
				return <SwapScreen message={message} />;
			case "level-up":
				return <LevelUpScreen message={message} level={level} />;
			case "battle-result":
				return <BattleResultScreen message={message} />;
			default: {
				return <FieldScreen />;
			}
		}
	};

	return (
		<div className="w-full max-w-[280px] mx-auto">
			{/* ゲームボーイ風フレーム */}
			<div className="bg-[#8b956d] rounded-lg p-3 shadow-lg border-4 border-[#4a4a4a]">
				{/* 液晶画面 */}
				<div
					className="bg-[#9bbc0f] text-[#0f380f] rounded p-3 min-h-[240px] flex flex-col"
					style={{ fontFamily: "monospace" }}
				>
					{renderScreen()}
				</div>
			</div>

			{/* ステータスバー */}
			<div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
				リザードン Lv.{level}
			</div>
		</div>
	);
}
