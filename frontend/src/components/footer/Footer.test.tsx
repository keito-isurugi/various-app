import { render, screen } from "@testing-library/react";
import type React from "react";
import "@testing-library/jest-dom";
import { Footer } from "./Footer";

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

describe("Footer", () => {
	it("コピーライトを表示する", () => {
		render(<Footer />);
		const currentYear = new Date().getFullYear();
		expect(
			screen.getByText(`© ${currentYear} kei-talk. All rights reserved.`),
		).toBeInTheDocument();
	});

	it("フッターナビゲーションリンクを表示する", () => {
		render(<Footer />);

		// プライバシーポリシーとTerms of Serviceリンクの存在を確認
		expect(
			screen.getByRole("link", { name: "プライバシーポリシー" }),
		).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "利用規約" })).toBeInTheDocument();
	});

	it("ソーシャルメディアリンクを表示する", () => {
		render(<Footer />);

		// ソーシャルメディアリンクの存在を確認
		expect(screen.getByRole("link", { name: "Twitter" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
	});

	it("外部リンクが新しいタブで開く", () => {
		render(<Footer />);

		const twitterLink = screen.getByRole("link", { name: "Twitter" });
		const githubLink = screen.getByRole("link", { name: "GitHub" });
		const linkedinLink = screen.getByRole("link", { name: "LinkedIn" });

		expect(twitterLink).toHaveAttribute("target", "_blank");
		expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
		expect(githubLink).toHaveAttribute("target", "_blank");
		expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
		expect(linkedinLink).toHaveAttribute("target", "_blank");
		expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("適切なスタイリングクラスを持つ", () => {
		const { container } = render(<Footer />);
		const footer = container.querySelector("footer");

		expect(footer).toHaveClass("bg-gray-50", "border-t");
	});
});
