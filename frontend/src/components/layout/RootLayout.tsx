import type React from "react";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import { ScrollToTop } from "./ScrollToTop";

interface RootLayoutProps {
	children: React.ReactNode;
}

/**
 * アプリケーション全体の共通レイアウトコンポーネント
 * ヘッダー、メインコンテンツ、フッターの3層構造を提供
 */
export const AppLayout: React.FC<RootLayoutProps> = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen bg-background">
			<Header />
			<main className="flex-grow pt-20 lg:pt-24">{children}</main>
			<Footer />
			<ScrollToTop />
		</div>
	);
};
