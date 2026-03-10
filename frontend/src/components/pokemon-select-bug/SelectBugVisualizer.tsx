"use client";

import { GameScreen } from "./GameScreen";
import { MemoryViewer } from "./MemoryViewer";
import { StepControls } from "./StepControls";
import { StepExplanation } from "./StepExplanation";
import { useSimulation } from "./useSimulation";

export function SelectBugVisualizer() {
	const { state, currentStepDef, goNext, goPrev, reset } = useSimulation();

	if (!currentStepDef) {
		return null;
	}

	return (
		<div className="w-full max-w-4xl mx-auto space-y-4">
			{/* 上部: ゲーム画面 + 解説パネル */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* ゲームボーイ風画面 */}
				<div className="flex items-start justify-center">
					<GameScreen gameScreen={state.gameScreen} level={state.level} />
				</div>

				{/* 解説パネル */}
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
					<StepExplanation
						step={currentStepDef}
						currentStep={state.currentStep}
						totalSteps={state.totalSteps}
						experience={state.experience}
					/>
				</div>
			</div>

			{/* 中部: メモリマップ */}
			<MemoryViewer
				memory={state.memory}
				menuItemToSwap={state.menuItemToSwap}
				currentStep={state.currentStep}
			/>

			{/* 下部: 操作ボタン */}
			<StepControls
				currentStep={state.currentStep}
				totalSteps={state.totalSteps}
				onPrev={goPrev}
				onNext={goNext}
				onReset={reset}
			/>
		</div>
	);
}
