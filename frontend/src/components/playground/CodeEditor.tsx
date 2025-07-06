import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { PlaygroundLanguage } from "../../types/playground";

interface CodeEditorProps {
	/** プログラミング言語 */
	language: PlaygroundLanguage;
	/** コードの値 */
	value: string;
	/** コード変更時のコールバック */
	onChange: (value: string) => void;
	/** 読み取り専用モード */
	readOnly?: boolean;
	/** 行番号の表示 */
	showLineNumbers?: boolean;
	/** フォントサイズ */
	fontSize?: number;
	/** テーマ */
	theme?: "light" | "dark";
	/** タブサイズ */
	tabSize?: number;
	/** エラー情報 */
	error?: {
		line?: number;
		message: string;
	};
	/** プレースホルダーテキスト */
	placeholder?: string;
	/** 追加のCSSクラス */
	className?: string;
}

/**
 * コードエディターコンポーネント
 * HTML、CSS、JavaScriptのコード編集機能を提供
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
	language,
	value,
	onChange,
	readOnly = false,
	showLineNumbers = true,
	fontSize = 14,
	theme = "light",
	tabSize = 2,
	error,
	placeholder,
	className = "",
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [lineCount, setLineCount] = useState(1);

	// デフォルトプレースホルダーの設定
	const getDefaultPlaceholder = (): string => {
		switch (language) {
			case "html":
				return "HTML コードを入力してください...\n例: <h1>Hello World</h1>";
			case "css":
				return "CSS コードを入力してください...\n例: body { margin: 0; }";
			case "javascript":
				return "JavaScript コードを入力してください...\n例: console.log('Hello World');";
			default:
				return "コードを入力してください...";
		}
	};

	// 行数の計算
	useEffect(() => {
		const lines = value.split("\n").length;
		setLineCount(lines);
	}, [value]);

	/**
	 * テキストエリアの変更ハンドラー
	 */
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		console.log("CodeEditor: 入力値が変更されました:", e.target.value);
		onChange(e.target.value);
	};

	/**
	 * キーダウンイベントのハンドラー
	 * タブキーでのインデント挿入を処理
	 */
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault();

			const textarea = textareaRef.current;
			if (!textarea) return;

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const tab = " ".repeat(tabSize);

			const newValue = value.substring(0, start) + tab + value.substring(end);
			onChange(newValue);

			// カーソル位置を調整
			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd = start + tab.length;
			}, 0);
		}
	};

	/**
	 * 行番号のレンダリング
	 */
	const renderLineNumbers = () => {
		if (!showLineNumbers) return null;

		const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

		return (
			<div className="line-numbers select-none">
				{lines.map((line) => (
					<div
						key={line}
						className={`line-number ${
							error?.line === line ? "error-line" : ""
						}`}
						style={{ fontSize: `${fontSize}px` }}
					>
						{line}
					</div>
				))}
			</div>
		);
	};

	/**
	 * エラー表示のレンダリング
	 */
	const renderError = () => {
		if (!error) return null;

		return (
			<div className="error-display">
				<div className="error-message">
					<span className="error-icon">⚠️</span>
					<span className="error-text">
						{error.line && `行 ${error.line}: `}
						{error.message}
					</span>
				</div>
			</div>
		);
	};

	return (
		<div
			data-testid="code-editor"
			className={`h-full flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white ${theme === "dark" ? "bg-gray-900 border-gray-600 text-gray-200" : ""} ${className}`}
		>
			{/* エディターヘッダー */}
			<div
				className={`flex items-center justify-between px-3 py-2 border-b ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}`}
			>
				<div className="flex items-center">
					<span
						className={`text-xs font-semibold uppercase tracking-wide ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`}
					>
						{language.toUpperCase()}
					</span>
				</div>
			</div>

			{/* エディター本体 */}
			<div className="flex flex-1 overflow-hidden">
				{showLineNumbers && (
					<div
						className={`px-2 py-3 text-right font-mono text-sm select-none min-w-12 ${
							theme === "dark"
								? "bg-gray-800 border-gray-600 text-gray-400"
								: "bg-gray-50 border-gray-200 text-gray-500"
						} border-r`}
					>
						{Array.from({ length: lineCount }, (_, i) => i + 1).map((line) => (
							<div
								key={line}
								className={`leading-6 ${error?.line === line ? (theme === "dark" ? "bg-red-900 text-red-300" : "bg-red-100 text-red-600") : ""}`}
								style={{ fontSize: `${fontSize}px` }}
							>
								{line}
							</div>
						))}
					</div>
				)}

				<div className="flex-1 relative">
					<textarea
						ref={textareaRef}
						value={value}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						readOnly={readOnly}
						disabled={readOnly}
						placeholder={placeholder || getDefaultPlaceholder()}
						className={`w-full h-full p-3 border-0 outline-none resize-none font-mono leading-6 bg-transparent focus:ring-0 focus:border-0 ${
							theme === "dark"
								? "text-gray-200 placeholder-gray-500"
								: "text-gray-900 placeholder-gray-400"
						} ${readOnly ? "cursor-not-allowed opacity-50" : "cursor-text"}`}
						style={{
							fontSize: `${fontSize}px`,
							tabSize: tabSize,
							whiteSpace: "pre",
							overflowWrap: "normal",
							wordWrap: "normal",
							pointerEvents: readOnly ? "none" : "auto",
						}}
						spellCheck={false}
						autoComplete="off"
						onFocus={() => console.log("CodeEditor: フォーカスされました")}
						onBlur={() => console.log("CodeEditor: フォーカスが外れました")}
						onClick={() => console.log("CodeEditor: クリックされました")}
						onInput={(e) =>
							console.log("CodeEditor: 入力イベント:", e.currentTarget.value)
						}
					/>
				</div>
			</div>

			{/* エラー表示 */}
			{error && (
				<div
					className={`px-3 py-2 border-t ${theme === "dark" ? "bg-red-900 border-red-700" : "bg-red-50 border-red-200"}`}
				>
					<div className="flex items-center gap-2 text-sm">
						<span className="text-base">⚠️</span>
						<span
							className={theme === "dark" ? "text-red-300" : "text-red-600"}
						>
							{error.line && `行 ${error.line}: `}
							{error.message}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};
