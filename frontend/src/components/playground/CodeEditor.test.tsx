import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import type { PlaygroundLanguage } from "../../types/playground";
import { CodeEditor } from "./CodeEditor";

describe("CodeEditor", () => {
	const defaultProps = {
		language: "html" as PlaygroundLanguage,
		value: "<h1>Hello World</h1>",
		onChange: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("基本的なエディターが表示される", () => {
		render(<CodeEditor {...defaultProps} />);

		// エディターのテキストエリアが表示されることを確認
		const textarea = screen.getByRole("textbox");
		expect(textarea).toBeInTheDocument();
		expect(textarea).toHaveValue("<h1>Hello World</h1>");
	});

	it("言語に応じたプレースホルダーが表示される", () => {
		const { rerender } = render(
			<CodeEditor {...defaultProps} language="html" />,
		);
		expect(screen.getByPlaceholderText(/HTML/)).toBeInTheDocument();

		rerender(<CodeEditor {...defaultProps} language="css" />);
		expect(screen.getByPlaceholderText(/CSS/)).toBeInTheDocument();

		rerender(<CodeEditor {...defaultProps} language="javascript" />);
		expect(screen.getByPlaceholderText(/JavaScript/)).toBeInTheDocument();
	});

	it("コード変更時にonChangeが呼び出される", () => {
		const onChange = jest.fn();
		render(<CodeEditor {...defaultProps} onChange={onChange} />);

		const textarea = screen.getByRole("textbox");
		fireEvent.change(textarea, { target: { value: "<p>New content</p>" } });

		expect(onChange).toHaveBeenCalledWith("<p>New content</p>");
	});

	it("読み取り専用モードが機能する", () => {
		render(<CodeEditor {...defaultProps} readOnly={true} />);

		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveAttribute("readonly");
	});

	it("行番号が表示される", () => {
		render(<CodeEditor {...defaultProps} showLineNumbers={true} />);

		// 行番号表示要素が存在することを確認
		expect(screen.getByText("1")).toBeInTheDocument();
	});

	it("エラー状態が表示される", () => {
		const error = {
			line: 1,
			message: "Syntax error",
		};

		render(<CodeEditor {...defaultProps} error={error} />);

		// エラーメッセージが表示されることを確認
		expect(screen.getByText("Syntax error")).toBeInTheDocument();
		expect(screen.getByText(/行 1/)).toBeInTheDocument();
	});

	it("フォントサイズが適用される", () => {
		render(<CodeEditor {...defaultProps} fontSize={16} />);

		const textarea = screen.getByRole("textbox");
		expect(textarea).toHaveStyle({ fontSize: "16px" });
	});

	it("テーマクラスが適用される", () => {
		const { rerender } = render(<CodeEditor {...defaultProps} theme="light" />);
		expect(screen.getByTestId("code-editor")).toHaveClass("theme-light");

		rerender(<CodeEditor {...defaultProps} theme="dark" />);
		expect(screen.getByTestId("code-editor")).toHaveClass("theme-dark");
	});

	it("タブキーでインデントが挿入される", () => {
		const onChange = jest.fn();
		render(<CodeEditor {...defaultProps} onChange={onChange} />);

		const textarea = screen.getByRole("textbox");
		// カーソル位置を設定
		textarea.focus();
		textarea.setSelectionRange(0, 0);

		// Tabキーを押下
		fireEvent.keyDown(textarea, { key: "Tab", code: "Tab" });

		expect(onChange).toHaveBeenCalledWith("\t<h1>Hello World</h1>");
	});
});
