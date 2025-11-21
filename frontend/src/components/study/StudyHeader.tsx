import { Button } from "@/components/ui/button";
import type { Language } from "@/types/study";
import { BookOpen, Languages, RefreshCw } from "lucide-react";
import Link from "next/link";

interface StudyHeaderProps {
	onLanguageToggle: () => void;
	currentLanguage: Language;
	onNewSession: () => void;
}

export function StudyHeader({
	onLanguageToggle,
	currentLanguage,
	onNewSession,
}: StudyHeaderProps) {
	return (
		<header className="border-b bg-card">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<Link
						href="/study/techquiz/practice"
						className="flex items-center gap-2"
					>
						<BookOpen className="h-6 w-6 text-primary" />
						<h1 className="text-2xl font-bold">Tech Quiz</h1>
					</Link>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onLanguageToggle}
							className="flex items-center gap-2"
							type="button"
						>
							<Languages className="h-4 w-4" />
							{currentLanguage === "ja" ? "日本語" : "English"}
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onNewSession}
							className="flex items-center gap-2"
							type="button"
						>
							<RefreshCw className="h-4 w-4" />
							新しいセット
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
