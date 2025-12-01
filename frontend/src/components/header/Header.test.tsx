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

	it("ナビゲーションメニューを表示する", () => {
		render(<Header />);

		// 各ナビゲーションリンクの存在を確認
		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "BIG3" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
	});

	it("ナビゲーションリンクが正しいURLを持つ", () => {
		render(<Header />);

		expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
			"href",
			"/",
		);
		expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
			"href",
			"/blog/posts",
		);
		expect(screen.getByRole("link", { name: "BIG3" })).toHaveAttribute(
			"href",
			"/big3",
		);
		expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
			"href",
			"/about",
		);
		expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
			"href",
			"/contact",
		);
	});

	it("適切なスタイリングクラスを持つ", () => {
		const { container } = render(<Header />);
		const header = container.querySelector("header");

		expect(header).toHaveClass("bg-white", "shadow-sm", "border-b");
	});

	it("レスポンシブ対応のクラスを持つ", () => {
		render(<Header />);
		const nav = screen.getByRole("navigation");

		// ナビゲーションがflexレイアウトを使用していることを確認
		expect(nav.querySelector("ul")).toHaveClass("flex");
	});
});
