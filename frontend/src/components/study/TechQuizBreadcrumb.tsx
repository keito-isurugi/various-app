"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface TechQuizBreadcrumbProps {
	items: BreadcrumbItem[];
}

export function TechQuizBreadcrumb({ items }: TechQuizBreadcrumbProps) {
	return (
		<nav className="mb-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
			<Link
				href="/study/techquiz"
				className="flex items-center gap-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
			>
				<Home className="h-4 w-4" />
				<span>Tech Quiz</span>
			</Link>

			{items.map((item, index) => (
				<div key={item.label} className="flex items-center gap-2">
					<ChevronRight className="h-4 w-4" />
					{item.href ? (
						<Link
							href={item.href}
							className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
						>
							{item.label}
						</Link>
					) : (
						<span className="font-medium text-gray-900 dark:text-gray-100">
							{item.label}
						</span>
					)}
				</div>
			))}
		</nav>
	);
}
