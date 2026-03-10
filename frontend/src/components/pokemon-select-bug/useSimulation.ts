"use client";

import { INITIAL_MEMORY, STEPS } from "@/data/pokemon-select-bug";
import type { SimulationState } from "@/types/pokemon-select-bug";
import { useCallback, useMemo, useState } from "react";

function buildState(stepIndex: number): SimulationState {
	const step = STEPS[stepIndex];
	if (!step) {
		return buildState(0);
	}

	// メモリバイト列を構築（ステップ0からstepIndexまでの変更を累積適用）
	const bytes = [...INITIAL_MEMORY];
	for (let i = 0; i <= stepIndex; i++) {
		const s = STEPS[i];
		if (s) {
			for (const change of s.memoryChanges) {
				bytes[change.offset] = change.value;
			}
		}
	}

	return {
		currentStep: stepIndex,
		totalSteps: STEPS.length,
		menuItemToSwap: step.menuItemToSwap,
		memory: {
			bytes,
			highlightedOffsets: step.memoryHighlights,
			swapAnimation: step.swapAnimation,
		},
		gameScreen: step.gameScreen,
		level: step.level,
		experience: step.experience,
	};
}

export function useSimulation() {
	const [stepIndex, setStepIndex] = useState(0);

	const state = useMemo(() => buildState(stepIndex), [stepIndex]);
	const currentStepDef = STEPS[stepIndex];

	const goNext = useCallback(() => {
		setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
	}, []);

	const goPrev = useCallback(() => {
		setStepIndex((prev) => Math.max(prev - 1, 0));
	}, []);

	const reset = useCallback(() => {
		setStepIndex(0);
	}, []);

	return {
		state,
		currentStepDef,
		goNext,
		goPrev,
		reset,
	};
}
