import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import AboutPage from "./page";

describe("AboutPage", () => {
	it("ページタイトルを表示する", () => {
		render(<AboutPage />);
		expect(
			screen.getByRole("heading", { level: 1, name: /私について/i }),
		).toBeInTheDocument();
	});

	it("自己紹介セクションを表示する", () => {
		render(<AboutPage />);

		// プロフィール画像のプレースホルダー（SVGアイコン）
		const profileSection = screen
			.getByText(/ソフトウェアエンジニア/i)
			.closest("section");
		expect(profileSection).toBeInTheDocument();

		// 自己紹介文
		expect(screen.getByText(/ソフトウェアエンジニア/i)).toBeInTheDocument();
	});

	it("スキルセクションを表示する", () => {
		render(<AboutPage />);

		// セクションタイトル
		expect(
			screen.getByRole("heading", { name: /スキル/i }),
		).toBeInTheDocument();

		// スキルカテゴリー
		expect(screen.getByText(/フロントエンド/i)).toBeInTheDocument();
		expect(screen.getByText(/バックエンド/i)).toBeInTheDocument();
		expect(screen.getByText(/その他/i)).toBeInTheDocument();
	});

	it("経歴セクションを表示する", () => {
		render(<AboutPage />);

		// セクションタイトル
		expect(screen.getByRole("heading", { name: /経歴/i })).toBeInTheDocument();
	});

	it("連絡先リンクを表示する", () => {
		render(<AboutPage />);

		const contactLink = screen.getByRole("link", {
			name: /お問い合わせはこちら/i,
		});
		expect(contactLink).toBeInTheDocument();
		expect(contactLink).toHaveAttribute("href", "/contact");
	});
});
