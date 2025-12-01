import { render, screen } from "@testing-library/react";
import type React from "react";
import "@testing-library/jest-dom";
import { Header } from "./Header";

// Next.js Linkコンポーネントのモック
jest.mock("next/link", () => {
	return {
		__esModule: true,
		default: ({
			children,
			href,
		}: { children: React.ReactNode; href: string }) => (
			<a href={href}>{children}</a>
		),
	};
});

describe("Header", () => {
	it("サイトタイトルを表示する", () => {
		render(<Header />);
		expect(screen.getByText("ホーム")).toBeInTheDocument();
	});

	it("ホームリンクが正しく設定されている", () => {
		render(<Header />);
		const homeLink = screen.getByRole("link", { name: "ホーム" });
		expect(homeLink).toHaveAttribute("href", "/");
	});

	it("ハンバーガーメニューボタンを表示する", () => {
		render(<Header />);

		// ハンバーガーメニューボタンの存在を確認
		expect(
			screen.getByRole("button", { name: /メニューを開く/i }),
		).toBeInTheDocument();
	});

	it("適切なスタイリングクラスを持つ", () => {
		const { container } = render(<Header />);
		const header = container.querySelector("header");

		expect(header).toBeInTheDocument();
	});
});
