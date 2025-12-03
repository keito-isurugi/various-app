import type { Metadata } from "next";
import "../css/globals.css";
import { ConditionalLayout } from "../components/layout/ConditionalLayout";

export const metadata: Metadata = {
	title: "技術ブログとポートフォリオ",
	description: "プログラミングと技術に関する記事、開発実績を紹介するサイト",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja" suppressHydrationWarning>
			<body
				className="antialiased bg-background text-foreground"
				suppressHydrationWarning
			>
				<ConditionalLayout>{children}</ConditionalLayout>
			</body>
		</html>
	);
}
