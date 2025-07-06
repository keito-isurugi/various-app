import type {
	ConsoleLog,
	ExecutionError,
	ValidationResult,
} from "../types/playground";

/**
 * コード実行結果の型定義
 */
export interface ExecutionResult {
	/** 実行が成功したかどうか */
	success: boolean;
	/** エラーリスト */
	errors: ExecutionError[];
	/** コンソールログリスト */
	consoleLogs: ConsoleLog[];
	/** 実行時間（ミリ秒） */
	executionTime: number;
}

/**
 * Playgroundエンジンのインターフェース
 */
export interface PlaygroundEngine {
	/** HTMLコードを実行する */
	executeHTML: (html: string) => ExecutionResult;
	/** CSSコードを実行する */
	executeCSS: (css: string) => ExecutionResult;
	/** JavaScriptコードを実行する */
	executeJavaScript: (js: string) => ExecutionResult;
	/** 全てのコードを実行する */
	executeAll: (html: string, css: string, js: string) => ExecutionResult;
	/** プレビューをクリアする */
	clear: () => void;
	/** コンソールログをクリアする */
	clearLogs: () => void;
}

/**
 * Playgroundエンジンの実装
 */
class PlaygroundEngineImpl implements PlaygroundEngine {
	private container: HTMLElement;
	private styleElement: HTMLStyleElement | null = null;
	private consoleLogs: ConsoleLog[] = [];

	constructor(container: HTMLElement) {
		this.container = container;
		this.setupConsoleInterception();
	}

	/**
	 * コンソールの出力を捕捉するための設定
	 */
	private setupConsoleInterception(): void {
		const interceptMethods = ["log", "info", "warn", "error", "debug"] as const;

		for (const method of interceptMethods) {
			const originalMethod = console[method];
			console[method] = (...args: unknown[]) => {
				// オリジナルのコンソールメソッドも呼び出す
				originalMethod.apply(console, args);

				// ログを記録
				this.addConsoleLog(method, args);
			};
		}
	}

	/**
	 * コンソールログを追加
	 */
	private addConsoleLog(level: ConsoleLog["level"], args: unknown[]): void {
		const log: ConsoleLog = {
			id: `log-${Date.now()}-${Math.random()}`,
			level,
			message: args
				.map((arg) =>
					typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg),
				)
				.join(" "),
			args,
			timestamp: new Date(),
		};

		this.consoleLogs.push(log);
	}

	/**
	 * エラーオブジェクトを作成
	 */
	private createError(
		type: ExecutionError["type"],
		message: string,
		file?: "html" | "css" | "javascript",
		line?: number,
		column?: number,
		stack?: string,
	): ExecutionError {
		return {
			id: `error-${Date.now()}-${Math.random()}`,
			type,
			message,
			file,
			line,
			column,
			stack,
			timestamp: new Date(),
		};
	}

	/**
	 * HTMLコードを実行
	 */
	executeHTML(html: string): ExecutionResult {
		const startTime = Date.now();
		const errors: ExecutionError[] = [];
		const initialLogCount = this.consoleLogs.length;

		try {
			// 安全性チェック: 危険なタグを除去
			const sanitizedHTML = this.sanitizeHTML(html);

			// HTMLをコンテナに挿入
			this.container.innerHTML = sanitizedHTML;
		} catch (error) {
			errors.push(
				this.createError(
					"runtime",
					error instanceof Error ? error.message : "HTML実行エラー",
					"html",
					undefined,
					undefined,
					error instanceof Error ? error.stack : undefined,
				),
			);
		}

		const executionTime = Date.now() - startTime;
		const newLogs = this.consoleLogs.slice(initialLogCount);

		return {
			success: errors.length === 0,
			errors,
			consoleLogs: newLogs,
			executionTime,
		};
	}

	/**
	 * CSSコードを実行
	 */
	executeCSS(css: string): ExecutionResult {
		const startTime = Date.now();
		const errors: ExecutionError[] = [];
		const initialLogCount = this.consoleLogs.length;

		try {
			// 既存のスタイル要素を削除
			if (this.styleElement) {
				this.styleElement.remove();
			}

			// 新しいスタイル要素を作成
			this.styleElement = document.createElement("style");

			// CSS構文の基本検証
			const validation = validateCSS(css);
			if (!validation.isValid) {
				for (const errorMsg of validation.errors) {
					errors.push(this.createError("syntax", errorMsg, "css"));
				}
				return {
					success: false,
					errors,
					consoleLogs: [],
					executionTime: Date.now() - startTime,
				};
			}

			// CSSを適用
			this.styleElement.textContent = css;
			document.head.appendChild(this.styleElement);
		} catch (error) {
			errors.push(
				this.createError(
					"runtime",
					error instanceof Error ? error.message : "CSS実行エラー",
					"css",
					undefined,
					undefined,
					error instanceof Error ? error.stack : undefined,
				),
			);
		}

		const executionTime = Date.now() - startTime;
		const newLogs = this.consoleLogs.slice(initialLogCount);

		return {
			success: errors.length === 0,
			errors,
			consoleLogs: newLogs,
			executionTime,
		};
	}

	/**
	 * JavaScriptコードを実行
	 */
	executeJavaScript(js: string): ExecutionResult {
		const startTime = Date.now();
		const errors: ExecutionError[] = [];
		const initialLogCount = this.consoleLogs.length;

		try {
			// JavaScript構文の基本検証
			const validation = validateJavaScript(js);
			if (!validation.isValid) {
				for (const errorMsg of validation.errors) {
					errors.push(this.createError("syntax", errorMsg, "javascript"));
				}
				return {
					success: false,
					errors,
					consoleLogs: [],
					executionTime: Date.now() - startTime,
				};
			}

			// サンドボックス化されたコンテキストでJavaScriptを実行
			const sandboxedFunction = new Function(
				"document",
				"window",
				"console",
				`
				try {
					${js}
				} catch (error) {
					throw error;
				}
				`,
			);

			// 制限されたグローバルオブジェクトを提供
			const sandboxDocument = {
				// 基本的なDOM操作メソッド
				getElementById: (id: string) => this.container.querySelector(`#${id}`),
				querySelector: (selector: string) =>
					this.container.querySelector(selector),
				querySelectorAll: (selector: string) =>
					this.container.querySelectorAll(selector),
				createElement: document.createElement.bind(document),

				// イベントリスナー関連
				addEventListener: (
					event: string,
					handler: EventListener,
					options?: boolean | AddEventListenerOptions,
				) => {
					// DOMContentLoadedイベントは即座に実行
					if (event === "DOMContentLoaded") {
						// タイムアウトを使って非同期で実行
						setTimeout(() => handler(new Event("DOMContentLoaded")), 0);
					} else {
						// その他のイベントは通常通りコンテナに追加
						this.container.addEventListener(event, handler, options);
					}
				},
				removeEventListener: (
					event: string,
					handler: EventListener,
					options?: boolean | EventListenerOptions,
				) => {
					this.container.removeEventListener(event, handler, options);
				},

				// よく使用されるプロパティ
				body: this.container,
				documentElement: this.container,
				head: document.head, // headは安全なので実際のものを使用

				// その他の便利メソッド
				createTextNode: document.createTextNode.bind(document),
				createDocumentFragment: document.createDocumentFragment.bind(document),
			};

			// 制限されたwindowオブジェクト
			const sandboxWindow = {
				document: sandboxDocument,
				console: console,
				setTimeout: window.setTimeout.bind(window),
				setInterval: window.setInterval.bind(window),
				clearTimeout: window.clearTimeout.bind(window),
				clearInterval: window.clearInterval.bind(window),
				// 必要に応じて他のAPIを追加
			};

			sandboxedFunction.call(
				this.container,
				sandboxDocument,
				sandboxWindow,
				console,
			);
		} catch (error) {
			const errorType = error instanceof SyntaxError ? "syntax" : "runtime";
			errors.push(
				this.createError(
					errorType,
					error instanceof Error ? error.message : "JavaScript実行エラー",
					"javascript",
					undefined,
					undefined,
					error instanceof Error ? error.stack : undefined,
				),
			);
		}

		const executionTime = Date.now() - startTime;
		const newLogs = this.consoleLogs.slice(initialLogCount);

		return {
			success: errors.length === 0,
			errors,
			consoleLogs: newLogs,
			executionTime,
		};
	}

	/**
	 * 全てのコードを順次実行
	 */
	executeAll(html: string, css: string, js: string): ExecutionResult {
		const startTime = Date.now();
		let allErrors: ExecutionError[] = [];
		let allLogs: ConsoleLog[] = [];

		// HTML → CSS → JavaScript の順で実行
		const htmlResult = this.executeHTML(html);
		allErrors = allErrors.concat(htmlResult.errors);
		allLogs = allLogs.concat(htmlResult.consoleLogs);

		const cssResult = this.executeCSS(css);
		allErrors = allErrors.concat(cssResult.errors);
		allLogs = allLogs.concat(cssResult.consoleLogs);

		const jsResult = this.executeJavaScript(js);
		allErrors = allErrors.concat(jsResult.errors);
		allLogs = allLogs.concat(jsResult.consoleLogs);

		return {
			success: allErrors.length === 0,
			errors: allErrors,
			consoleLogs: allLogs,
			executionTime: Date.now() - startTime,
		};
	}

	/**
	 * プレビューをクリア
	 */
	clear(): void {
		this.container.innerHTML = "";
		if (this.styleElement) {
			this.styleElement.remove();
			this.styleElement = null;
		}
	}

	/**
	 * コンソールログをクリア
	 */
	clearLogs(): void {
		this.consoleLogs = [];
	}

	/**
	 * HTMLの安全性チェック（基本的なサニタイズ）
	 */
	private sanitizeHTML(html: string): string {
		// 危険なタグを除去
		const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
		return html.replace(dangerousTags, "");
	}
}

/**
 * Playgroundエンジンのファクトリー関数
 */
export function createPlaygroundEngine(
	container: HTMLElement,
): PlaygroundEngine {
	return new PlaygroundEngineImpl(container);
}

/**
 * HTMLコードのバリデーション
 */
export function validateHTML(html: string): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	// 基本的なHTMLバリデーション
	if (html.trim() === "") {
		return { isValid: true, errors: [], warnings: [] };
	}

	// 簡単な構文チェック
	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");

		// パースエラーをチェック
		const parserErrors = doc.getElementsByTagName("parsererror");
		if (parserErrors.length > 0) {
			errors.push(`HTML構文エラー: ${parserErrors[0].textContent}`);
		}
	} catch (error) {
		errors.push(
			`HTML解析エラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
		);
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * CSSコードのバリデーション
 */
export function validateCSS(css: string): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (css.trim() === "") {
		return { isValid: true, errors: [], warnings: [] };
	}

	// 基本的な構文チェック
	try {
		// ブラケットの対応をチェック
		let braceCount = 0;
		for (const char of css) {
			if (char === "{") braceCount++;
			if (char === "}") braceCount--;
			if (braceCount < 0) {
				errors.push("CSS構文エラー: 閉じブラケット '｝' が多すぎます");
				break;
			}
		}

		if (braceCount > 0) {
			errors.push("CSS構文エラー: 開きブラケット '{' が閉じられていません");
		}

		// 基本的なプロパティ構文チェック
		const rules = css.split("}");
		for (let i = 0; i < rules.length - 1; i++) {
			const rule = rules[i];
			if (rule.includes("{")) {
				const [, declarations] = rule.split("{");
				if (declarations) {
					const props = declarations.split(";");
					for (const prop of props) {
						if (prop.trim() && !prop.includes(":")) {
							warnings.push(
								`CSS警告: プロパティ '${prop.trim()}' にコロンがありません`,
							);
						}
					}
				}
			}
		}
	} catch (error) {
		errors.push(
			`CSS解析エラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
		);
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * JavaScriptコードのバリデーション
 */
export function validateJavaScript(js: string): ValidationResult {
	const errors: string[] = [];
	const warnings: string[] = [];

	if (js.trim() === "") {
		return { isValid: true, errors: [], warnings: [] };
	}

	try {
		// 構文チェック（実行せずにパースのみ）
		new Function(js);
	} catch (error) {
		if (error instanceof SyntaxError) {
			errors.push(`JavaScript構文エラー: ${error.message}`);
		} else {
			errors.push(
				`JavaScript解析エラー: ${error instanceof Error ? error.message : "不明なエラー"}`,
			);
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}
