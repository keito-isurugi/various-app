import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PreviewPanel } from "./PreviewPanel";

describe("PreviewPanel", () => {
	const defaultProps = {
		html: "<h1>Hello World</h1>",
		css: "h1 { color: blue; }",
		javascript: "console.log('Hello');",
		autoRefresh: true,
		onError: jest.fn(),
		onConsoleLog: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("基本的なプレビューが表示される", () => {
		render(<PreviewPanel {...defaultProps} />);

		// プレビューフレームが表示されることを確認
		expect(screen.getByTestId("preview-frame")).toBeInTheDocument();

		// ツールバーが表示されることを確認
		expect(screen.getByRole("button", { name: /更新/ })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /クリア/ })).toBeInTheDocument();
	});

	it("手動更新ボタンが機能する", async () => {
		render(<PreviewPanel {...defaultProps} autoRefresh={false} />);

		const refreshButton = screen.getByRole("button", { name: /更新/ });
		fireEvent.click(refreshButton);

		// プレビューが更新されることを確認
		await waitFor(() => {
			expect(screen.getByTestId("preview-frame")).toBeInTheDocument();
		});
	});

	it("クリアボタンが機能する", () => {
		render(<PreviewPanel {...defaultProps} />);

		const clearButton = screen.getByRole("button", { name: /クリア/ });
		fireEvent.click(clearButton);

		// プレビューがクリアされることを確認
		const frame = screen.getByTestId("preview-frame");
		expect(frame.innerHTML).toBe("");
	});

	it("デバイスサイズの切り替えが機能する", () => {
		render(<PreviewPanel {...defaultProps} />);

		// モバイルビューボタンを取得
		const mobileButton = screen.getByRole("button", { name: /モバイル/ });
		fireEvent.click(mobileButton);

		// プレビューフレームのサイズが変更されることを確認
		const frame = screen.getByTestId("preview-frame");
		expect(frame).toHaveClass("mobile-view");
	});

	it("自動更新が機能する", async () => {
		const { rerender } = render(<PreviewPanel {...defaultProps} />);

		// プロパティを変更
		rerender(<PreviewPanel {...defaultProps} html="<h2>Updated</h2>" />);

		// 自動更新により新しいコンテンツが表示されることを確認
		await waitFor(() => {
			const frame = screen.getByTestId("preview-frame");
			expect(frame.innerHTML).toContain("<h2>Updated</h2>");
		});
	});

	it("JavaScriptエラーが報告される", async () => {
		const onError = jest.fn();
		render(
			<PreviewPanel
				{...defaultProps}
				javascript="throw new Error('Test error');"
				onError={onError}
			/>,
		);

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "runtime",
					message: expect.stringContaining("Test error"),
				}),
			);
		});
	});

	it("コンソールログが捕捉される", async () => {
		const onConsoleLog = jest.fn();
		render(
			<PreviewPanel
				{...defaultProps}
				javascript="console.log('Test message');"
				onConsoleLog={onConsoleLog}
			/>,
		);

		await waitFor(() => {
			expect(onConsoleLog).toHaveBeenCalledWith(
				expect.objectContaining({
					level: "log",
					message: "Test message",
				}),
			);
		});
	});

	it("ローディング状態が表示される", () => {
		render(<PreviewPanel {...defaultProps} isLoading={true} />);

		expect(screen.getByText(/読み込み中/)).toBeInTheDocument();
		expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
	});

	it("エラー状態が表示される", () => {
		const error = {
			id: "1",
			type: "syntax" as const,
			message: "Syntax error in CSS",
			timestamp: new Date(),
		};

		render(<PreviewPanel {...defaultProps} errors={[error]} />);

		expect(screen.getByText("Syntax error in CSS")).toBeInTheDocument();
		expect(screen.getByText(/構文エラー/)).toBeInTheDocument();
	});

	it("フルスクリーンモードが機能する", () => {
		render(<PreviewPanel {...defaultProps} />);

		const fullscreenButton = screen.getByRole("button", {
			name: /フルスクリーン/,
		});
		fireEvent.click(fullscreenButton);

		// フルスクリーンクラスが適用されることを確認
		expect(screen.getByTestId("preview-panel")).toHaveClass("fullscreen");
	});

	it("ズーム機能が機能する", () => {
		render(<PreviewPanel {...defaultProps} zoom={150} />);

		const frame = screen.getByTestId("preview-frame");
		expect(frame).toHaveStyle({ transform: "scale(1.5)" });
	});

	it("レスポンシブプレビューが機能する", () => {
		render(<PreviewPanel {...defaultProps} responsive={true} />);

		// デスクトップ、タブレット、モバイルのビューが表示されることを確認
		expect(screen.getByText("デスクトップ")).toBeInTheDocument();
		expect(screen.getByText("タブレット")).toBeInTheDocument();
		expect(screen.getByText("モバイル")).toBeInTheDocument();
	});
});
