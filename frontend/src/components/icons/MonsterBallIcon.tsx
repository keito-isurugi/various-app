import type React from "react";

interface MonsterBallIconProps {
	className?: string;
}

/**
 * モンスターボールアイコン（線画スタイル）
 * lucide-reactと同じインターフェースで使用可能
 */
export const MonsterBallIcon: React.FC<MonsterBallIconProps> = ({
	className,
}) => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>モンスターボール</title>
			{/* 外側の円 */}
			<circle cx="12" cy="12" r="10" />
			{/* 中央の横線 */}
			<line x1="2" y1="12" x2="22" y2="12" />
			{/* 中央の円（外側） */}
			<circle cx="12" cy="12" r="3" />
			{/* 中央の円（内側） */}
			<circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
		</svg>
	);
};
