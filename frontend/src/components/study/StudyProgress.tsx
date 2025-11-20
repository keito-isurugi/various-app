import { Progress } from "@/components/ui/progress";

interface StudyProgressProps {
	currentIndex: number;
	totalQuestions: number;
}

export function StudyProgress({
	currentIndex,
	totalQuestions,
}: StudyProgressProps) {
	const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between text-sm">
				<span className="font-medium text-muted-foreground">
					進捗: {currentIndex + 1} / {totalQuestions}
				</span>
				<span className="text-xs text-muted-foreground">
					{Math.round(progressPercentage)}%
				</span>
			</div>
			<Progress value={progressPercentage} className="h-2" />
		</div>
	);
}
