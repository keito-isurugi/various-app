/**
 * Playground機能の型定義
 * HTML, CSS, JavaScriptのコードエディターとプレビュー機能で使用
 */

/**
 * サポートされるプログラミング言語
 */
export type PlaygroundLanguage = "html" | "css" | "javascript";

/**
 * コードファイルの情報
 */
export interface CodeFile {
	/** ファイルID */
	id: string;
	/** ファイル名 */
	name: string;
	/** プログラミング言語 */
	language: PlaygroundLanguage;
	/** コード内容 */
	content: string;
	/** 最終更新日時 */
	lastModified: Date;
}

/**
 * Playgroundプロジェクトの情報
 */
export interface PlaygroundProject {
	/** プロジェクトID */
	id: string;
	/** プロジェクト名 */
	name: string;
	/** プロジェクトの説明 */
	description?: string;
	/** HTMLファイル */
	htmlFile: CodeFile;
	/** CSSファイル */
	cssFile: CodeFile;
	/** JavaScriptファイル */
	jsFile: CodeFile;
	/** 作成日時 */
	createdAt: Date;
	/** 最終更新日時 */
	updatedAt: Date;
}

/**
 * エディターの設定
 */
export interface EditorSettings {
	/** フォントサイズ */
	fontSize: number;
	/** タブサイズ */
	tabSize: number;
	/** ワードラップの有効/無効 */
	wordWrap: boolean;
	/** 行番号の表示/非表示 */
	lineNumbers: boolean;
	/** テーマ（light/dark） */
	theme: "light" | "dark";
	/** 自動補完の有効/無効 */
	autoComplete: boolean;
}

/**
 * プレビューの表示設定
 */
export interface PreviewSettings {
	/** 自動更新の有効/無効 */
	autoRefresh: boolean;
	/** 更新間隔（ミリ秒） */
	refreshInterval: number;
	/** モバイルプレビューモード */
	mobileMode: boolean;
	/** プレビューの拡大率 */
	zoom: number;
}

/**
 * 実行時エラーの情報
 */
export interface ExecutionError {
	/** エラーID */
	id: string;
	/** エラーの種類 */
	type: "syntax" | "runtime" | "network" | "security";
	/** エラーメッセージ */
	message: string;
	/** エラーが発生したファイル */
	file?: PlaygroundLanguage;
	/** エラーが発生した行番号 */
	line?: number;
	/** エラーが発生した列番号 */
	column?: number;
	/** エラーのスタックトレース */
	stack?: string;
	/** エラー発生日時 */
	timestamp: Date;
}

/**
 * コンソールログの情報
 */
export interface ConsoleLog {
	/** ログID */
	id: string;
	/** ログレベル */
	level: "log" | "info" | "warn" | "error" | "debug";
	/** ログメッセージ */
	message: string;
	/** ログの引数（オブジェクトなど） */
	args?: unknown[];
	/** ログ出力日時 */
	timestamp: Date;
}

/**
 * テンプレートの情報
 */
export interface PlaygroundTemplate {
	/** テンプレートID */
	id: string;
	/** テンプレート名 */
	name: string;
	/** テンプレートの説明 */
	description: string;
	/** 難易度レベル */
	level: "beginner" | "intermediate" | "advanced";
	/** カテゴリ */
	category: string;
	/** HTMLテンプレート */
	htmlTemplate: string;
	/** CSSテンプレート */
	cssTemplate: string;
	/** JavaScriptテンプレート */
	jsTemplate: string;
	/** プレビュー画像URL */
	previewImage?: string;
	/** 学習ポイント */
	learningPoints: string[];
	/** 作成者 */
	author?: string;
}

/**
 * Playgroundの状態管理
 */
export interface PlaygroundState {
	/** 現在のプロジェクト */
	currentProject: PlaygroundProject | null;
	/** エディター設定 */
	editorSettings: EditorSettings;
	/** プレビュー設定 */
	previewSettings: PreviewSettings;
	/** 実行時エラーリスト */
	errors: ExecutionError[];
	/** コンソールログリスト */
	consoleLogs: ConsoleLog[];
	/** 現在選択中のファイル */
	activeFile: PlaygroundLanguage;
	/** プレビューの表示/非表示 */
	showPreview: boolean;
	/** コンソールの表示/非表示 */
	showConsole: boolean;
	/** ローディング状態 */
	isLoading: boolean;
}

/**
 * ファイル操作の結果
 */
export interface FileOperationResult {
	/** 操作が成功したかどうか */
	success: boolean;
	/** エラーメッセージ */
	error?: string;
	/** 操作されたファイル */
	file?: CodeFile;
}

/**
 * プロジェクト操作の結果
 */
export interface ProjectOperationResult {
	/** 操作が成功したかどうか */
	success: boolean;
	/** エラーメッセージ */
	error?: string;
	/** 操作されたプロジェクト */
	project?: PlaygroundProject;
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
	/** バリデーションが成功したかどうか */
	isValid: boolean;
	/** エラーメッセージのリスト */
	errors: string[];
	/** 警告メッセージのリスト */
	warnings: string[];
}
