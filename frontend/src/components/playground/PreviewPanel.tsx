import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ConsoleLog, ExecutionError } from "../../types/playground";
import { createPlaygroundEngine } from "../../utils/playground-engine";

interface PreviewPanelProps {
	/** HTMLコード */
	html: string;
	/** CSSコード */
	css: string;
	/** JavaScriptコード */
	javascript: string;
	/** 自動更新の有効/無効 */
	autoRefresh?: boolean;
	/** 更新間隔（ミリ秒） */
	refreshInterval?: number;
	/** ズーム倍率 */
	zoom?: number;
	/** レスポンシブプレビューモード */
	responsive?: boolean;
	/** ローディング状態 */
	isLoading?: boolean;
	/** エラーリスト */
	errors?: ExecutionError[];
	/** エラー発生時のコールバック */
	onError?: (error: ExecutionError) => void;
	/** コンソールログ出力時のコールバック */
	onConsoleLog?: (log: ConsoleLog) => void;
	/** 追加のCSSクラス */
	className?: string;
}

type DeviceType = "desktop" | "tablet" | "mobile";

interface DeviceConfig {
	name: string;
	width: number;
	height: number;
	icon: string;
}

/**
 * プレビューパネルコンポーネント
 * HTML、CSS、JavaScriptのリアルタイムプレビューを表示
 */
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
	html,
	css,
	javascript,
	autoRefresh = true,
	refreshInterval = 1000,
	zoom = 100,
	responsive = false,
	isLoading = false,
	errors = [],
	onError,
	onConsoleLog,
	className = "",
}) => {
	const frameRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<ReturnType<typeof createPlaygroundEngine> | null>(
		null,
	);
	const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

	// デバイス設定
	const deviceConfigs: Record<DeviceType, DeviceConfig> = {
		desktop: { name: "デスクトップ", width: 1200, height: 800, icon: "🖥️" },
		tablet: { name: "タブレット", width: 768, height: 1024, icon: "📱" },
		mobile: { name: "モバイル", width: 375, height: 667, icon: "📱" },
	};

	/**
	 * プレビューエンジンの初期化
	 */
	useEffect(() => {
		if (frameRef.current && !engineRef.current) {
			engineRef.current = createPlaygroundEngine(frameRef.current);
		}
	}, []);

	/**
	 * コードの実行
	 */
	const executeCode = useCallback(() => {
		if (!engineRef.current) return;

		try {
			// HTML → CSS → JavaScript の順で実行し、JavaScriptは少し遅延
			const htmlResult = engineRef.current.executeHTML(html);
			const cssResult = engineRef.current.executeCSS(css);

			// JavaScriptの実行を少し遅延させる
			setTimeout(() => {
				if (!engineRef.current) return;

				const jsResult = engineRef.current.executeJavaScript(javascript);

				// 全ての結果をまとめて処理
				const allErrors = [
					...htmlResult.errors,
					...cssResult.errors,
					...jsResult.errors,
				];
				const allLogs = [
					...htmlResult.consoleLogs,
					...cssResult.consoleLogs,
					...jsResult.consoleLogs,
				];

				// エラーがあれば報告
				if (allErrors.length > 0 && onError) {
					for (const error of allErrors) {
						onError(error);
					}
				}

				// コンソールログがあれば報告
				if (allLogs.length > 0 && onConsoleLog) {
					for (const log of allLogs) {
						onConsoleLog(log);
					}
				}
			}, 50); // 50ms遅延

			setLastUpdate(new Date());
		} catch (error) {
			if (onError) {
				onError({
					id: `preview-error-${Date.now()}`,
					type: "runtime",
					message:
						error instanceof Error ? error.message : "プレビュー実行エラー",
					timestamp: new Date(),
				});
			}
		}
	}, [html, css, javascript, onError, onConsoleLog]);

	/**
	 * 自動更新の処理
	 */
	useEffect(() => {
		if (!autoRefresh) return;

		const timer = setTimeout(executeCode, refreshInterval);
		return () => clearTimeout(timer);
	}, [autoRefresh, refreshInterval, executeCode]);

	/**
	 * 手動更新
	 */
	const handleRefresh = () => {
		executeCode();
	};

	/**
	 * プレビューのクリア
	 */
	const handleClear = () => {
		if (engineRef.current) {
			engineRef.current.clear();
		}
	};

	/**
	 * デバイスタイプの変更
	 */
	const handleDeviceChange = (device: DeviceType) => {
		setDeviceType(device);
	};

	/**
	 * フルスクリーンの切り替え
	 */
	const handleFullscreenToggle = () => {
		setIsFullscreen(!isFullscreen);
	};

	/**
	 * ツールバーのレンダリング
	 */
	const renderToolbar = () => (
		<div className="preview-toolbar">
			{/* 更新ボタン */}
			<button
				type="button"
				onClick={handleRefresh}
				className="toolbar-button"
				title="プレビューを更新"
			>
				🔄 更新
			</button>

			{/* クリアボタン */}
			<button
				type="button"
				onClick={handleClear}
				className="toolbar-button"
				title="プレビューをクリア"
			>
				🗑️ クリア
			</button>

			{/* デバイス切り替え */}
			{responsive && (
				<div className="device-selector">
					{Object.entries(deviceConfigs).map(([key, config]) => (
						<button
							key={key}
							type="button"
							onClick={() => handleDeviceChange(key as DeviceType)}
							className={`device-button ${deviceType === key ? "active" : ""}`}
							title={config.name}
						>
							{config.icon} {config.name}
						</button>
					))}
				</div>
			)}

			{/* フルスクリーンボタン */}
			<button
				type="button"
				onClick={handleFullscreenToggle}
				className="toolbar-button"
				title="フルスクリーン切り替え"
			>
				{isFullscreen ? "📉 戻る" : "📈 フルスクリーン"}
			</button>

			{/* 最終更新時刻 */}
			<div className="last-update">
				最終更新: {lastUpdate.toLocaleTimeString()}
			</div>
		</div>
	);

	// デバイス設定の取得
	const currentDevice = deviceConfigs[deviceType];
	const frameStyle = responsive
		? {
				width: `${currentDevice.width}px`,
				height: `${currentDevice.height}px`,
				transform: `scale(${zoom / 100})`,
				transformOrigin: "top left",
			}
		: {
				transform: `scale(${zoom / 100})`,
				transformOrigin: "top left",
			};

	return (
		<div
			data-testid="preview-panel"
			className={`flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden ${
				isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
			} ${className}`}
		>
			{/* ツールバー */}
			<div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap gap-2">
				<div className="flex items-center gap-2">
					{/* 更新ボタン */}
					<button
						type="button"
						onClick={handleRefresh}
						className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
						title="プレビューを更新"
					>
						🔄 更新
					</button>

					{/* クリアボタン */}
					<button
						type="button"
						onClick={handleClear}
						className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
						title="プレビューをクリア"
					>
						🗑️ クリア
					</button>
				</div>

				{/* デバイス切り替え */}
				{responsive && (
					<div className="flex gap-1">
						{Object.entries(deviceConfigs).map(([key, config]) => (
							<button
								key={key}
								type="button"
								onClick={() => handleDeviceChange(key as DeviceType)}
								className={`px-2 py-1 text-xs rounded border transition-colors ${
									deviceType === key
										? "bg-blue-600 text-white border-blue-600"
										: "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
								}`}
								title={config.name}
							>
								{config.icon} {config.name}
							</button>
						))}
					</div>
				)}

				<div className="flex items-center gap-2">
					{/* フルスクリーンボタン */}
					<button
						type="button"
						onClick={handleFullscreenToggle}
						className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
						title="フルスクリーン切り替え"
					>
						{isFullscreen ? "📉 戻る" : "📈 フルスクリーン"}
					</button>

					{/* 最終更新時刻 */}
					<div className="text-xs text-gray-500">
						最終更新: {lastUpdate.toLocaleTimeString()}
					</div>
				</div>
			</div>

			{/* プレビューコンテンツ */}
			<div className="flex-1 relative overflow-auto">
				{isLoading && (
					<div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10">
						<div
							data-testid="loading-spinner"
							className="text-3xl animate-spin mb-3"
						>
							⭐
						</div>
						<div className="text-sm text-gray-600">読み込み中...</div>
					</div>
				)}

				<div className="p-5 overflow-auto">
					<div
						data-testid="preview-frame"
						ref={frameRef}
						className={`w-full min-h-96 bg-white border border-gray-200 rounded overflow-auto ${
							deviceType === "mobile"
								? "border-2 border-gray-800 rounded-2xl"
								: ""
						}`}
						style={frameStyle}
					/>
				</div>

				{/* エラー表示 */}
				{errors.length > 0 && (
					<div className="bg-red-50 border-t border-red-200 p-3 max-h-48 overflow-y-auto">
						<h4 className="text-sm font-semibold text-red-900 mb-2">
							⚠️ エラー
						</h4>
						{errors.map((error) => (
							<div
								key={error.id}
								className={`mb-2 p-2 bg-white border rounded ${
									error.type === "syntax"
										? "border-l-4 border-l-yellow-500"
										: error.type === "runtime"
											? "border-l-4 border-l-red-500"
											: "border-gray-200"
								}`}
							>
								<div className="flex gap-2 mb-1 text-xs">
									<span className="font-semibold text-red-600">
										{error.type === "syntax"
											? "構文エラー"
											: error.type === "runtime"
												? "実行エラー"
												: error.type === "network"
													? "ネットワークエラー"
													: "エラー"}
									</span>
									{error.file && (
										<span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
											{error.file}
										</span>
									)}
									{error.line && (
										<span className="text-gray-500">行 {error.line}</span>
									)}
								</div>
								<div className="text-sm text-gray-900">{error.message}</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
