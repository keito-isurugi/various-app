"use client";

import { Button } from "@/components/ui/button";
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
		{
			href: "/study/techquiz",
			label: "ホーム",
			icon: Home,
		},
		{
			href: "/study/techquiz/practice",
			label: "演習",
			icon: RefreshCw,
		},
		{
			href: "/study/techquiz/questions",
			label: "問題一覧",
			icon: ListChecks,
		},
		{
			href: "/study/techquiz/review",
			label: "復習",
			icon: Clock,
		},
		{
			href: "/study/techquiz/dashboard",
			label: "統計",
			icon: PieChart,
		},
		{
			href: "/study/techquiz/test",
			label: "テスト",
			icon: Award,
		},
	];

	return (
		<div className="mb-6 flex flex-wrap gap-2">
			{navItems.map((item) => {
				const isActive = pathname === item.href;
				const Icon = item.icon;
				return (
					<Link key={item.href} href={item.href}>
						<Button
							type="button"
							variant={isActive ? "default" : "outline"}
							size="sm"
							className="gap-1"
						>
							<Icon className="h-4 w-4" />
							<span>{item.label}</span>
						</Button>
					</Link>
				);
			})}
		</div>
	);
}
