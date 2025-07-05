import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import ContactPage from "./page";

describe("ContactPage", () => {
	it("ページタイトルを表示する", () => {
		render(<ContactPage />);
		expect(
			screen.getByRole("heading", { level: 1, name: /お問い合わせ/i }),
		).toBeInTheDocument();
	});

	it("問い合わせフォームのフィールドを表示する", () => {
		render(<ContactPage />);

		// 各フォームフィールドのラベル
		expect(screen.getByLabelText(/お名前/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/件名/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/お問い合わせ内容/i)).toBeInTheDocument();
	});

	it("必須フィールドが正しく設定されている", () => {
		render(<ContactPage />);

		expect(screen.getByLabelText(/お名前/i)).toHaveAttribute("required");
		expect(screen.getByLabelText(/メールアドレス/i)).toHaveAttribute(
			"required",
		);
		expect(screen.getByLabelText(/件名/i)).toHaveAttribute("required");
		expect(screen.getByLabelText(/お問い合わせ内容/i)).toHaveAttribute(
			"required",
		);
	});

	it("送信ボタンを表示する", () => {
		render(<ContactPage />);

		const submitButton = screen.getByRole("button", { name: /送信する/i });
		expect(submitButton).toBeInTheDocument();
		expect(submitButton).toHaveAttribute("type", "submit");
	});

	it("メールアドレスフィールドが正しいタイプを持つ", () => {
		render(<ContactPage />);

		const emailField = screen.getByLabelText(/メールアドレス/i);
		expect(emailField).toHaveAttribute("type", "email");
	});

	it("お問い合わせ内容フィールドがテキストエリアである", () => {
		render(<ContactPage />);

		const messageField = screen.getByLabelText(/お問い合わせ内容/i);
		expect(messageField.tagName).toBe("TEXTAREA");
	});

	it("注意事項を表示する", () => {
		render(<ContactPage />);

		expect(screen.getByText(/返信までに数日/i)).toBeInTheDocument();
	});
});
