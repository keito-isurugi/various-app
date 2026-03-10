/** メモリフィールドのカテゴリ */
export type MemoryCategory =
	| "species"
	| "hp"
	| "level"
	| "status"
	| "type"
	| "catchRate"
	| "move"
	| "otid"
	| "exp"
	| "statExp"
	| "dv"
	| "pp";

/** ゲーム画面の種類 */
export type GameScreenType =
	| "field"
	| "menu"
	| "items"
	| "battle"
	| "battle-fight"
	| "battle-moves"
	| "battle-swap"
	| "battle-result"
	| "level-up";

/** メモリの1フィールド定義 */
export interface MemoryField {
	name: string;
	offset: number;
	size: number;
	category: MemoryCategory;
}

/** スワップアニメーション状態 */
export interface SwapAnimation {
	fromOffset: number;
	toOffset: number;
	phase: "idle" | "lift" | "move" | "drop" | "done";
}

/** メモリ状態 */
export interface MemoryState {
	bytes: number[];
	highlightedOffsets: number[];
	swapAnimation: SwapAnimation | null;
}

/** ゲーム画面状態 */
export interface GameScreenState {
	screen: GameScreenType;
	cursorPosition: number;
	selectPressed: boolean;
	message: string;
}

/** シミュレーション全体の状態 */
export interface SimulationState {
	currentStep: number;
	totalSteps: number;
	menuItemToSwap: number;
	memory: MemoryState;
	gameScreen: GameScreenState;
	level: number;
	experience: number;
}

/** ステップ定義 */
export interface StepDefinition {
	title: string;
	description: string;
	technicalDetail: string;
	gameScreen: GameScreenState;
	menuItemToSwap: number;
	memoryHighlights: number[];
	swapAnimation: SwapAnimation | null;
	memoryChanges: { offset: number; value: number }[];
	level: number;
	experience: number;
}
