import type { Metadata } from "next";
import localFont from "next/font/local";
import "../css/globals.css";
import { AppLayout } from "../components/layout/RootLayout";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "kei-talk - 技術ブログとポートフォリオ",
	description: "プログラミングと技術に関する記事、開発実績を紹介するサイト",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AppLayout>{children}</AppLayout>
			</body>
		</html>
	);
}
