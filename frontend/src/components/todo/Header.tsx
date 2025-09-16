"use client";

import { cn } from "@/lib/utils";
import { BarChart3, Calendar, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navItems = [
		{ href: "/todo", label: "カレンダー", icon: Calendar },
		{ href: "/todo/dashboard", label: "ダッシュボード", icon: BarChart3 },
	];

	return (
		<header className="border-b bg-card text-card-foreground">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link href="/todo">
						<h1 className="text-2xl font-bold text-foreground">TODO アプリ</h1>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex gap-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium",
										isActive
											? "bg-primary text-primary-foreground"
											: "text-foreground hover:bg-accent hover:text-accent-foreground",
									)}
								>
									<Icon className="h-4 w-4" />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="md:hidden p-2 text-foreground"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="メニュー"
					>
						{isMobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>

				{/* Mobile Navigation */}
				{isMobileMenuOpen && (
					<nav className="md:hidden mt-4 flex flex-col gap-2">
						{navItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={cn(
										"flex items-center gap-2 px-4 py-3 rounded-md transition-colors text-sm font-medium",
										isActive
											? "bg-primary text-primary-foreground"
											: "text-foreground hover:bg-accent hover:text-accent-foreground",
									)}
								>
									<Icon className="h-4 w-4" />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>
				)}
			</div>
		</header>
	);
}
