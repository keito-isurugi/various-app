"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { AppLayout } from "./RootLayout";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

/**
 * パスに応じてレイアウトを条件分岐するコンポーネント
 * サンプルページでは既存のヘッダー・フッターを表示しない
 */
export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({
	children,
}) => {
	const pathname = usePathname();

	// サンプルページ系のパスの場合は独立したレイアウトを使用
	const isSamplePage = pathname?.startsWith("/hp/sample/");

	if (isSamplePage) {
		// サンプルページ用の独立レイアウト
		return <div className="min-h-screen">{children}</div>;
	}

	// 通常ページ用のレイアウト
	return <AppLayout>{children}</AppLayout>;
};
