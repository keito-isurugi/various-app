import type { MemoryField, StepDefinition } from "@/types/pokemon-select-bug";

/**
 * party_struct のメモリフィールド定義（オフセット 0x00〜0x10）
 * pokered 逆アセンブリに基づく
 */
export const MEMORY_FIELDS: MemoryField[] = [
	{ name: "種族", offset: 0x00, size: 1, category: "species" },
	{ name: "HP上", offset: 0x01, size: 1, category: "hp" },
	{ name: "HP下", offset: 0x02, size: 1, category: "hp" },
	{ name: "レベル", offset: 0x03, size: 1, category: "level" },
	{ name: "状態", offset: 0x04, size: 1, category: "status" },
	{ name: "タイプ1", offset: 0x05, size: 1, category: "type" },
	{ name: "タイプ2", offset: 0x06, size: 1, category: "type" },
	{ name: "捕獲率", offset: 0x07, size: 1, category: "catchRate" },
	{ name: "技1", offset: 0x08, size: 1, category: "move" },
	{ name: "技2", offset: 0x09, size: 1, category: "move" },
	{ name: "技3", offset: 0x0a, size: 1, category: "move" },
	{ name: "技4", offset: 0x0b, size: 1, category: "move" },
	{ name: "ID上", offset: 0x0c, size: 1, category: "otid" },
	{ name: "ID下", offset: 0x0d, size: 1, category: "otid" },
	{ name: "経験上", offset: 0x0e, size: 1, category: "exp" },
	{ name: "経験中", offset: 0x0f, size: 1, category: "exp" },
	{ name: "経験下", offset: 0x10, size: 1, category: "exp" },
];

/**
 * メモリのグループ定義（MemoryViewer でグループラベルを表示するため）
 */
export const MEMORY_GROUPS = [
	{
		label: "ポケモンの基本情報",
		startOffset: 0x00,
		endOffset: 0x07,
		color: "text-gray-500 dark:text-gray-400",
	},
	{
		label: "技スロット（1〜4番目）",
		startOffset: 0x08,
		endOffset: 0x0b,
		color: "text-blue-600 dark:text-blue-400",
	},
	{
		label: "トレーナーID（5〜6番目）",
		startOffset: 0x0c,
		endOffset: 0x0d,
		color: "text-yellow-600 dark:text-yellow-400",
	},
	{
		label: "経験値（7〜9番目）",
		startOffset: 0x0e,
		endOffset: 0x10,
		color: "text-red-600 dark:text-red-400",
	},
];

/**
 * 技スロットの開始オフセット（0x08）からの相対位置で
 * 「7番目」= offset 0x0E = 経験値上位バイト
 */
export const MOVE_SLOT_START = 0x08;

/** 初期メモリ値（リザードン Lv.36 を想定） */
export const INITIAL_MEMORY: number[] = [
	0x06, // 0x00: Species = リザードン (6)
	0x00, // 0x01: HP hi
	0x7d, // 0x02: HP lo (125)
	0x24, // 0x03: Level = 36
	0x00, // 0x04: Status = 正常
	0x0a, // 0x05: Type1 = ほのお
	0x02, // 0x06: Type2 = ひこう
	0x2d, // 0x07: CatchRate = 45
	0x35, // 0x08: Move1 = きりさく (0x35 = 53)
	0x34, // 0x09: Move2 = かえんほうしゃ (0x34 = 52)
	0x11, // 0x0A: Move3 = つばさでうつ (0x11 = 17)
	0x0a, // 0x0B: Move4 = ひっかく (0x0A = 10)
	0x12, // 0x0C: OT ID hi
	0x34, // 0x0D: OT ID lo
	0x00, // 0x0E: Exp hi  ← 7番目（技スロットから数えて）
	0xbc, // 0x0F: Exp mid ← 8番目
	0x4f, // 0x10: Exp lo  ← 9番目
	// 経験値 = 0x00BC4F = 48,207（Lv.36相当）
];

/** 技名マッピング（主要なもの） */
export const MOVE_NAMES: Record<number, string> = {
	10: "ひっかく",
	17: "つばさでうつ",
	52: "かえんほうしゃ",
	53: "きりさく",
};

/** カテゴリの表示色（Tailwind クラス） */
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
	species: {
		bg: "bg-purple-200 dark:bg-purple-900",
		text: "text-purple-800 dark:text-purple-200",
	},
	hp: {
		bg: "bg-green-200 dark:bg-green-900",
		text: "text-green-800 dark:text-green-200",
	},
	level: {
		bg: "bg-teal-200 dark:bg-teal-900",
		text: "text-teal-800 dark:text-teal-200",
	},
	status: {
		bg: "bg-gray-200 dark:bg-gray-700",
		text: "text-gray-800 dark:text-gray-200",
	},
	type: {
		bg: "bg-orange-200 dark:bg-orange-900",
		text: "text-orange-800 dark:text-orange-200",
	},
	catchRate: {
		bg: "bg-gray-200 dark:bg-gray-700",
		text: "text-gray-800 dark:text-gray-200",
	},
	move: {
		bg: "bg-blue-200 dark:bg-blue-900",
		text: "text-blue-800 dark:text-blue-200",
	},
	otid: {
		bg: "bg-yellow-200 dark:bg-yellow-900",
		text: "text-yellow-800 dark:text-yellow-200",
	},
	exp: {
		bg: "bg-red-200 dark:bg-red-900",
		text: "text-red-800 dark:text-red-200",
	},
	statExp: {
		bg: "bg-pink-200 dark:bg-pink-900",
		text: "text-pink-800 dark:text-pink-200",
	},
	dv: {
		bg: "bg-indigo-200 dark:bg-indigo-900",
		text: "text-indigo-800 dark:text-indigo-200",
	},
	pp: {
		bg: "bg-cyan-200 dark:bg-cyan-900",
		text: "text-cyan-800 dark:text-cyan-200",
	},
};

/**
 * シミュレーションのステップ定義
 * 7番目バグ（レベル100バグ）のシナリオ
 */
export const STEPS: StepDefinition[] = [
	{
		title: "初期状態",
		description:
			"リザードン Lv.36 で冒険中。下のメモリマップを確認してみましょう。",
		technicalDetail:
			"下に表示されているのは、ゲーム内でポケモン1匹分のデータがメモリ上にどう並んでいるかを表したものです。技データの直後にトレーナーIDと経験値が隙間なく並んでいます。この「隙間なく並んでいる」ことがバグの鍵になります。",
		gameScreen: {
			screen: "field",
			cursorPosition: 0,
			selectPressed: false,
			message: "",
		},
		menuItemToSwap: 0x00,
		memoryHighlights: [],
		swapAnimation: null,
		memoryChanges: [],
		level: 36,
		experience: 48207,
	},
	{
		title: "メニューを開く → どうぐ",
		description: "スタートボタンでメニューを開き、「どうぐ」を選択します。",
		technicalDetail:
			"この時点では入れ替えフラグは未設定（OFF）です。まだ何も起きていません。",
		gameScreen: {
			screen: "items",
			cursorPosition: 0,
			selectPressed: false,
			message: "",
		},
		menuItemToSwap: 0x00,
		memoryHighlights: [],
		swapAnimation: null,
		memoryChanges: [],
		level: 36,
		experience: 48207,
	},
	{
		title: "7番目でセレクトボタン押下",
		description:
			"道具リストの7番目にカーソルを合わせてセレクトボタンを押します。ゲーム内部で「入れ替えフラグ」がセットされます。",
		technicalDetail:
			"セレクトボタンを押すと、ゲームはメモリ内に「7番目を入れ替え対象として選んだ」という情報を記録します。本来はもう一度セレクトを押して入れ替え先を選ぶための仕組みです。",
		gameScreen: {
			screen: "items",
			cursorPosition: 6,
			selectPressed: true,
			message: "▶ 7ばんめ を えらんだ！",
		},
		menuItemToSwap: 0x07,
		memoryHighlights: [],
		swapAnimation: null,
		memoryChanges: [],
		level: 36,
		experience: 48207,
	},
	{
		title: "Bボタン×2 でメニューを閉じる",
		description:
			"Bボタンを2回押してどうぐリストとメニューを閉じます。しかし入れ替えフラグはクリアされません！",
		technicalDetail:
			"【バグの核心】通常、メニューを閉じれば入れ替えフラグもリセットされるべきですが、赤・緑・青ではプログラムミスにより「7番目を入れ替える」という情報がメモリに残ったままになります。これがセレクトバグの根本原因です。",
		gameScreen: {
			screen: "field",
			cursorPosition: 0,
			selectPressed: false,
			message: "",
		},
		menuItemToSwap: 0x07,
		memoryHighlights: [],
		swapAnimation: null,
		memoryChanges: [],
		level: 36,
		experience: 48207,
	},
	{
		title: "草むらでエンカウント！",
		description: "草むらに入って野生ポケモンとエンカウントします。",
		technicalDetail:
			"戦闘が開始されますが、入れ替えフラグ（7番目）はメモリに残ったままです。ゲームはメニューを閉じた後にこの値をチェックしないので、気づかれることなく次の操作に引き継がれます。",
		gameScreen: {
			screen: "battle",
			cursorPosition: 0,
			selectPressed: false,
			message: "やせいの コラッタ が あらわれた！",
		},
		menuItemToSwap: 0x07,
		memoryHighlights: [],
		swapAnimation: null,
		memoryChanges: [],
		level: 36,
		experience: 48207,
	},
	{
		title: "「たたかう」→ 技を選択",
		description:
			"「たたかう」を選び、技リストが表示されます。ここで技を選択すると…",
		technicalDetail:
			"技選択画面で技を選ぶと、ゲームは入れ替え処理を実行します。入れ替えフラグに「7番目」が残っているため、「選んだ技と7番目の技を入れ替える」処理が走ります。しかしポケモンの技は4つしかありません。では「7番目」とは何でしょう？ メモリマップの技スロットから数えて7番目の位置を見てみましょう。",
		gameScreen: {
			screen: "battle-moves",
			cursorPosition: 0,
			selectPressed: false,
			message: "",
		},
		menuItemToSwap: 0x07,
		memoryHighlights: [0x08, 0x0e],
		swapAnimation: null,
		memoryChanges: [],
		level: 36,
		experience: 48207,
	},
	{
		title: "スワップ実行！ 範囲外アクセス発生",
		description:
			"技1（きりさく）と「7番目の技」がスワップされます。しかし7番目の技は存在せず、その位置には経験値の上位バイトが格納されています！",
		technicalDetail:
			"ゲームは技1の位置と「技スロットから7番目」の位置のデータを入れ替えます。メモリマップを見ると、技スロットの7番目は経験値の先頭バイトに当たります。技1の値（きりさく=0x35）が経験値の先頭に書き込まれ、経験値の先頭（0x00）が技1の位置に書き込まれます。",
		gameScreen: {
			screen: "battle-swap",
			cursorPosition: 0,
			selectPressed: false,
			message: "わざの ひょうじが バグった！",
		},
		menuItemToSwap: 0x07,
		memoryHighlights: [0x08, 0x0e],
		swapAnimation: {
			fromOffset: 0x08,
			toOffset: 0x0e,
			phase: "move",
		},
		memoryChanges: [
			{ offset: 0x08, value: 0x00 },
			{ offset: 0x0e, value: 0x35 },
		],
		level: 36,
		experience: 48207,
	},
	{
		title: "経験値が激変！",
		description:
			"経験値の上位バイトが書き換わったことで、経験値が一気に跳ね上がりました！",
		technicalDetail:
			"経験値は3バイトで表現されます。先頭バイトが 0x00 → 0x35 に変わると、経験値は 48,207 → 3,521,615 に激増します。これはレベル100到達に必要な経験値（約100万）を大幅に超えています。別の技で敵を倒して経験値を取得すると…",
		gameScreen: {
			screen: "battle-fight",
			cursorPosition: 1,
			selectPressed: false,
			message: "かえんほうしゃ で こうげき！",
		},
		menuItemToSwap: 0x00,
		memoryHighlights: [0x0e, 0x0f, 0x10],
		swapAnimation: null,
		memoryChanges: [],
		level: 36,
		experience: 3521615,
	},
	{
		title: "レベル100到達！",
		description:
			"経験値取得時にレベル再計算が行われ、レベルが一気に100まで上がりました！",
		technicalDetail:
			"ゲームは経験値テーブルを参照してレベルを計算します。経験値 3,521,615 はどの成長タイプでもレベル100の必要経験値を超えているため、レベルが上限の100にカンストします。これが「7番目バグ」の全貌です。",
		gameScreen: {
			screen: "level-up",
			cursorPosition: 0,
			selectPressed: false,
			message: "リザードン の レベルが 100 に あがった！",
		},
		menuItemToSwap: 0x00,
		memoryHighlights: [0x03, 0x0e, 0x0f, 0x10],
		swapAnimation: null,
		memoryChanges: [{ offset: 0x03, value: 0x64 }],
		level: 100,
		experience: 3521615,
	},
];

/** どうぐリストの表示データ */
export const ITEM_LIST = [
	"キズぐすり",
	"モンスターボール",
	"どくけし",
	"まひなおし",
	"ピーピーエイド",
	"エフェクトガード",
	"スペシャルアップ",
	"プラスパワー",
	"ディフェンダー",
	"スピーダー",
];
