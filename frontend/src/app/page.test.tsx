import { render, screen } from "@testing-library/react";
import type React from "react";
import "@testing-library/jest-dom";
import HomePage from "./page";

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

describe("HomePage", () => {
	it("ヒーローセクションを表示する", () => {
		render(<HomePage />);

		// メインタイトルの確認
		expect(
			screen.getByRole("heading", { level: 1, name: /Welcome/i }),
		).toBeInTheDocument();

		// サブタイトルの確認
		expect(
			screen.getByText(/技術ブログとポートフォリオサイト/i),
		).toBeInTheDocument();
	});

	it("CTAボタンを表示する", () => {
		render(<HomePage />);

		const blogButton = screen.getByRole("link", { name: /ブログを読む/i });
		const aboutButton = screen.getByRole("link", { name: /私について/i });

		expect(blogButton).toBeInTheDocument();
		expect(blogButton).toHaveAttribute("href", "/blog/posts");
		expect(aboutButton).toBeInTheDocument();
		expect(aboutButton).toHaveAttribute("href", "/about");
	});

	it("特徴セクションを表示する", () => {
		render(<HomePage />);

		// セクションタイトル
		expect(screen.getByRole("heading", { name: /特徴/i })).toBeInTheDocument();

		// 各特徴の確認
		expect(screen.getByText(/技術記事/i)).toBeInTheDocument();
		expect(screen.getByText(/ポートフォリオ/i)).toBeInTheDocument();
		expect(screen.getByText(/オープンソース/i)).toBeInTheDocument();
	});

	it("最新記事セクションを表示する", () => {
		render(<HomePage />);

		// セクションタイトル
		expect(
			screen.getByRole("heading", { name: /最新の記事/i }),
		).toBeInTheDocument();

		// もっと見るリンク
		const moreLink = screen.getByRole("link", { name: /すべての記事を見る/i });
		expect(moreLink).toBeInTheDocument();
		expect(moreLink).toHaveAttribute("href", "/blog/posts");
	});
});
