import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StudyNavigationProps {
	currentIndex: number;
	totalQuestions: number;
	onPrevious: () => void;
	onNext: () => void;
	canGoPrevious: boolean;
	canGoNext: boolean;
}

export function StudyNavigation({
	currentIndex,
	totalQuestions,
	onPrevious,
	onNext,
	canGoPrevious,
	canGoNext,
}: StudyNavigationProps) {
	return (
		<div className="mt-8 flex items-center justify-between">
			<Button
				onClick={onPrevious}
				disabled={!canGoPrevious}
				variant="outline"
				size="lg"
				type="button"
			>
				<ChevronLeft className="h-5 w-5 mr-2" />
				前の問題
			</Button>

			<div className="text-sm text-muted-foreground">
				{currentIndex + 1} / {totalQuestions}
			</div>

			<Button
				onClick={onNext}
				disabled={!canGoNext}
				variant="outline"
				size="lg"
				type="button"
			>
				次の問題
				<ChevronRight className="h-5 w-5 ml-2" />
			</Button>
		</div>
	);
}
