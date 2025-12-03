"use client";

import type React from "react";
import { AppLayout } from "./RootLayout";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

/**
 * パスに応じてレイアウトを条件分岐するコンポーネント
 */
export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({
	children,
}) => {
	return <AppLayout>{children}</AppLayout>;
};
