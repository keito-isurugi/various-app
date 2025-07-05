"use client";

import React, { useState, useCallback } from "react";
import { CodeEditor } from "../../components/playground/CodeEditor";
import { PreviewPanel } from "../../components/playground/PreviewPanel";
import type { 
	PlaygroundLanguage, 
	ExecutionError, 
	ConsoleLog,
	EditorSettings,
	PlaygroundProject
} from "../../types/playground";

export default function PlaygroundPage() {
	// プロジェクト状態
	const [project, setProject] = useState<PlaygroundProject>({
		id: "default",
		name: "新しいプロジェクト",
		description: "HTML、CSS、JavaScriptの練習プロジェクト",
		htmlFile: {
			id: "html-1",
			name: "index.html",
			language: "html",
			content: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playground</title>
</head>
<body>
    <div class="container">
        <h1>Hello, Playground!</h1>
        <p>ここでHTML、CSS、JavaScriptを試してみましょう。</p>
        <button id="clickBtn">クリックしてください</button>
        <div id="result"></div>
    </div>
</body>
</html>`,
			lastModified: new Date(),
		},
		cssFile: {
			id: "css-1",
			name: "style.css",
			language: "css",
			content: `/* スタイルシート */
.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
    color: #2563eb;
    text-align: center;
    margin-bottom: 20px;
}

p {
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 20px;
}

#clickBtn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s ease;
}

#clickBtn:hover {
    background: #2563eb;
}

#result {
    margin-top: 20px;
    padding: 15px;
    background: #f0f9ff;
    border-left: 4px solid #3b82f6;
    border-radius: 4px;
    min-height: 20px;
}`,
			lastModified: new Date(),
		},
		jsFile: {
			id: "js-1",
			name: "script.js",
			language: "javascript",
			content: `// JavaScript コード
console.log('Playground が読み込まれました！');

const button = document.getElementById('clickBtn');
const result = document.getElementById('result');
let clickCount = 0;

if (button && result) {
    button.addEventListener('click', function() {
        clickCount++;
        result.innerHTML = \`
            <h3>ボタンがクリックされました！</h3>
            <p>クリック回数: <strong>\${clickCount}</strong></p>
            <p>現在時刻: \${new Date().toLocaleTimeString()}</p>
        \`;
        
        console.log(\`ボタンがクリックされました（\${clickCount}回目）\`);
    });
} else {
    console.log('ボタンまたは結果表示エリアが見つかりません');
}`,
			lastModified: new Date(),
		},
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	// UI状態
	const [activeFile, setActiveFile] = useState<PlaygroundLanguage>("html");
	const [showPreview, setShowPreview] = useState(true);
	const [showConsole, setShowConsole] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ExecutionError[]>([]);
	const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);

	// エディター設定
	const [editorSettings] = useState<EditorSettings>({
		fontSize: 14,
		tabSize: 2,
		wordWrap: true,
		lineNumbers: true,
		theme: "light",
		autoComplete: true,
	});

	/**
	 * ファイル内容の更新
	 */
	const handleFileChange = useCallback((content: string) => {
		console.log('Playground: ファイル変更が呼び出されました:', { activeFile, content: content.slice(0, 50) + '...' });
		setProject(prev => {
			const updatedProject = { ...prev };
			
			switch (activeFile) {
				case "html":
					updatedProject.htmlFile = {
						...prev.htmlFile,
						content,
						lastModified: new Date(),
					};
					break;
				case "css":
					updatedProject.cssFile = {
						...prev.cssFile,
						content,
						lastModified: new Date(),
					};
					break;
				case "javascript":
					updatedProject.jsFile = {
						...prev.jsFile,
						content,
						lastModified: new Date(),
					};
					break;
			}
			
			updatedProject.updatedAt = new Date();
			console.log('Playground: プロジェクトが更新されました:', updatedProject);
			return updatedProject;
		});
	}, [activeFile]);

	/**
	 * エラーハンドリング
	 */
	const handleError = useCallback((error: ExecutionError) => {
		setErrors(prev => {
			// 重複エラーを防ぐ
			const exists = prev.some(e => 
				e.type === error.type && 
				e.message === error.message && 
				e.file === error.file
			);
			if (exists) return prev;
			
			return [...prev.slice(-9), error]; // 最新10件を保持
		});
	}, []);

	/**
	 * コンソールログハンドリング
	 */
	const handleConsoleLog = useCallback((log: ConsoleLog) => {
		setConsoleLogs(prev => [...prev.slice(-49), log]); // 最新50件を保持
	}, []);

	/**
	 * エラーのクリア
	 */
	const clearErrors = () => {
		setErrors([]);
	};

	/**
	 * コンソールログのクリア
	 */
	const clearConsoleLogs = () => {
		setConsoleLogs([]);
	};

	/**
	 * タブの切り替え
	 */
	const handleTabChange = (language: PlaygroundLanguage) => {
		setActiveFile(language);
	};

	/**
	 * レイアウトの切り替え
	 */
	const togglePreview = () => {
		setShowPreview(!showPreview);
	};

	const toggleConsole = () => {
		setShowConsole(!showConsole);
	};

	// 現在のファイル情報を取得
	const getCurrentFile = () => {
		switch (activeFile) {
			case "html": return project.htmlFile;
			case "css": return project.cssFile;
			case "javascript": return project.jsFile;
			default: return project.htmlFile;
		}
	};

	const currentFile = getCurrentFile();

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			{/* ヘッダー */}
			<header className="flex items-center justify-between px-3 md:px-5 py-3 bg-white border-b border-gray-200 shadow-sm">
				<div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
					<h1 className="m-0 text-lg md:text-2xl font-bold text-gray-900 truncate">🚀 Code Playground</h1>
					<span className="hidden sm:inline text-sm md:text-base font-medium text-gray-500 truncate">{project.name}</span>
				</div>
				
				<div className="flex gap-1 md:gap-2 flex-wrap">
					<button
						type="button"
						onClick={togglePreview}
						className={`px-2 md:px-4 py-2 text-xs md:text-sm font-medium rounded-md border transition-all duration-200 ${
							showPreview 
								? "bg-blue-600 text-white border-blue-600" 
								: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
						}`}
					>
						<span className="md:hidden">👁️</span>
						<span className="hidden md:inline">👁️ プレビュー</span>
					</button>
					<button
						type="button"
						onClick={toggleConsole}
						className={`px-2 md:px-4 py-2 text-xs md:text-sm font-medium rounded-md border transition-all duration-200 ${
							showConsole 
								? "bg-blue-600 text-white border-blue-600" 
								: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
						}`}
					>
						<span className="md:hidden">📋 ({consoleLogs.length})</span>
						<span className="hidden md:inline">📋 コンソール ({consoleLogs.length})</span>
					</button>
					{errors.length > 0 && (
						<button
							type="button"
							onClick={clearErrors}
							className="px-2 md:px-4 py-2 text-xs md:text-sm font-medium bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-all duration-200"
						>
							<span className="md:hidden">⚠️ ({errors.length})</span>
							<span className="hidden md:inline">⚠️ エラー ({errors.length})</span>
						</button>
					)}
				</div>
			</header>

			{/* メインコンテンツ */}
			<main className="flex flex-1 overflow-hidden md:flex-row flex-col">
				{/* エディターセクション */}
				<section className={`flex flex-col bg-white md:border-r border-gray-200 ${showPreview ? "flex-1 md:h-auto h-1/2" : "flex-1"}`}>
					{/* ファイルタブ */}
					<div className="flex bg-gray-50 border-b border-gray-200">
						{[
							{ key: "html", label: "HTML", icon: "🌐" },
							{ key: "css", label: "CSS", icon: "🎨" },
							{ key: "javascript", label: "JavaScript", icon: "⚡" },
						].map(({ key, label, icon }) => (
							<button
								key={key}
								type="button"
								onClick={() => handleTabChange(key as PlaygroundLanguage)}
								className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
									activeFile === key
										? "bg-white text-blue-600 border-blue-600"
										: "text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900"
								}`}
							>
								{icon} {label}
							</button>
						))}
					</div>

					{/* コードエディター */}
					<div className="flex-1 overflow-hidden">
						<CodeEditor
							language={activeFile}
							value={currentFile.content}
							onChange={handleFileChange}
							fontSize={editorSettings.fontSize}
							theme={editorSettings.theme}
							tabSize={editorSettings.tabSize}
							showLineNumbers={editorSettings.lineNumbers}
							error={errors.find(e => e.file === activeFile)}
						/>
					</div>
				</section>

				{/* プレビューセクション */}
				{showPreview && (
					<section className="flex-1 bg-white md:h-auto h-1/2">
						<PreviewPanel
							html={project.htmlFile.content}
							css={project.cssFile.content}
							javascript={project.jsFile.content}
							autoRefresh={true}
							refreshInterval={1000}
							zoom={100}
							responsive={false}
							isLoading={isLoading}
							errors={errors}
							onError={handleError}
							onConsoleLog={handleConsoleLog}
						/>
					</section>
				)}
			</main>

			{/* コンソールパネル */}
			{showConsole && (
				<section className="h-64 bg-white border-t border-gray-200 flex flex-col">
					<div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
						<h3 className="m-0 text-base font-semibold text-gray-900">📋 コンソール</h3>
						<button
							type="button"
							onClick={clearConsoleLogs}
							className="px-3 py-1 text-xs bg-gray-100 text-gray-600 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
						>
							クリア
						</button>
					</div>
					<div className="flex-1 overflow-y-auto p-2 font-mono text-sm leading-relaxed">
						{consoleLogs.map((log) => (
							<div key={log.id} className={`flex gap-2 px-2 py-1 rounded mb-1 ${
								log.level === 'log' ? 'text-gray-900' :
								log.level === 'info' ? 'text-blue-600 bg-blue-50' :
								log.level === 'warn' ? 'text-yellow-600 bg-yellow-50' :
								log.level === 'error' ? 'text-red-600 bg-red-50' : 
								'text-gray-900'
							}`}>
								<span className="text-gray-400 text-xs min-w-20">
									{log.timestamp.toLocaleTimeString()}
								</span>
								<span className="text-gray-500 font-semibold min-w-12 text-xs">
									[{log.level.toUpperCase()}]
								</span>
								<span className="flex-1 break-words">{log.message}</span>
							</div>
						))}
						{consoleLogs.length === 0 && (
							<div className="text-center text-gray-400 italic py-5">
								コンソールログがありません
							</div>
						)}
					</div>
				</section>
			)}

		</div>
	);
}