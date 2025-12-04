"use client";

import {
	Award,
	Clock,
	Home,
	ListChecks,
	PieChart,
	RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TechQuizQuickNav() {
	const pathname = usePathname();

	const navItems = [
		{ href: "/study/techquiz", label: "ホーム", icon: Home },
		{ href: "/study/techquiz/practice", label: "演習", icon: RefreshCw },
		{ href: "/study/techquiz/questions", label: "問題一覧", icon: ListChecks },
		{ href: "/study/techquiz/review", label: "復習", icon: Clock },
		{ href: "/study/techquiz/dashboard", label: "統計", icon: PieChart },
		{ href: "/study/techquiz/test", label: "テスト", icon: Award },
	];

	return (
		<nav className="mb-6 flex flex-wrap gap-2">
			{navItems.map((item) => {
				const isActive = pathname === item.href;
				const Icon = item.icon;
				return (
					<Link
						key={item.href}
						href={item.href}
						className={`
							inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
							${
								isActive
									? "bg-blue-600 text-white"
									: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
							}
						`}
					>
						<Icon className="h-4 w-4" />
						<span>{item.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
