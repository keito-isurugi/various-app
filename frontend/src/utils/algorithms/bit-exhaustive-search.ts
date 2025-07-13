/**
 * src/utils/algorithms/bit-exhaustive-search.ts
 *
 * ビット全探索アルゴリズムの実装
 * 組み合わせ問題を効率的に解く重要な技法
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * ビット全探索操作の種類
 */
type BitExhaustiveSearchOperationType =
	| "allSubsets" // 全部分集合の列挙
	| "subsetSum" // 部分集合の和問題
	| "maxSubsetSum" // 最大部分集合和
	| "knapsack" // ナップサック問題（小規模）
	| "bitCount" // ビット演算の基本
	| "combinationSum" // 組み合わせ和
	| "minimumSubset" // 最小部分集合
	| "exactSubsets"; // 指定条件の部分集合

/**
 * ビット全探索アルゴリズムクラス
 *
 * ビット演算を使用して全ての組み合わせを効率的に探索
 * 2^n通りの組み合わせを系統的に列挙・評価
 * 時間計算量: O(2^n × 処理時間)
 * 空間計算量: O(1) または O(結果の数)
 */
export class BitExhaustiveSearchAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "bit-exhaustive-search",
		name: "ビット全探索",
		description:
			"ビット演算で全組み合わせを系統的に探索。2^n通りの部分集合から最適解を効率的に発見",
		category: "other",
		timeComplexity: {
			best: "O(2^n)", // 最適な場合
			average: "O(2^n)", // 平均的な場合
			worst: "O(2^n)", // 最悪の場合
		},
		difficulty: 3, // 中級（ビット演算の理解が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private originalArray: number[] = [];

	/**
	 * ビット全探索操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters
			?.operation as BitExhaustiveSearchOperationType;
		const array = input.parameters?.array as number[] | undefined;
		const target = input.parameters?.target as number | undefined;
		const capacity = input.parameters?.capacity as number | undefined;
		const weights = input.parameters?.weights as number[] | undefined;
		const values = input.parameters?.values as number[] | undefined;

		// 配列の設定
		if (array) {
			this.originalArray = [...array];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `ビット全探索操作開始：${this.getOperationDescription(operation)}を実行`,
			array: [...this.originalArray],
			operation: "初期化",
			variables: {
				operation: operation,
				arraySize: this.originalArray.length,
				totalCombinations: 2 ** this.originalArray.length,
				technique: this.getTechniqueDescription(operation),
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "allSubsets": {
				if (array) {
					result = this.performAllSubsets(array);
				} else {
					throw new Error("全部分集合の列挙には配列が必要です");
				}
				break;
			}

			case "subsetSum": {
				if (array && target !== undefined) {
					result = this.performSubsetSum(array, target);
				} else {
					throw new Error("部分集合和問題には配列と目標値が必要です");
				}
				break;
			}

			case "maxSubsetSum": {
				if (array) {
					result = this.performMaxSubsetSum(array);
				} else {
					throw new Error("最大部分集合和には配列が必要です");
				}
				break;
			}

			case "knapsack": {
				if (weights && values && capacity !== undefined) {
					result = this.performKnapsack(weights, values, capacity);
				} else {
					throw new Error("ナップサック問題には重さ、価値、容量が必要です");
				}
				break;
			}

			case "bitCount": {
				if (array) {
					result = this.performBitCount(array);
				} else {
					throw new Error("ビット演算の説明には配列が必要です");
				}
				break;
			}

			case "combinationSum": {
				if (array && target !== undefined) {
					result = this.performCombinationSum(array, target);
				} else {
					throw new Error("組み合わせ和には配列と目標値が必要です");
				}
				break;
			}

			case "minimumSubset": {
				if (array && target !== undefined) {
					result = this.performMinimumSubset(array, target);
				} else {
					throw new Error("最小部分集合には配列と目標値が必要です");
				}
				break;
			}

			case "exactSubsets": {
				if (array && target !== undefined) {
					result = this.performExactSubsets(array, target);
				} else {
					throw new Error("指定条件部分集合には配列と条件が必要です");
				}
				break;
			}

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🎉 ビット全探索操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
			array: [...this.originalArray],
			operation: "完了",
			variables: {
				result: result,
				totalSteps: this.steps.length,
				technique: this.getTechniqueDescription(operation),
				efficiency: this.getEfficiencyNote(operation),
			},
		});

		return {
			success: true,
			result: result,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.getOperationComplexity(operation),
			summary: {
				operation: operation,
				operationResult: result,
				arraySize: this.originalArray.length,
				totalSteps: this.steps.length,
				technique: this.getTechniqueDescription(operation),
			},
		};
	}

	/**
	 * 全部分集合の列挙
	 */
	private performAllSubsets(array: number[]): number[][] {
		const subsets: number[][] = [];
		const n = array.length;
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `配列[${array.join(", ")}]の全部分集合を列挙 (${totalCombinations}通り)`,
			array: [...array],
			operation: "全部分集合開始",
			variables: {
				arraySize: n,
				totalCombinations: totalCombinations,
				binaryPattern: "0から2^n-1まで",
			},
		});

		for (let mask = 0; mask < totalCombinations; mask++) {
			const subset: number[] = [];
			const binaryRepresentation = mask.toString(2).padStart(n, "0");

			this.steps.push({
				id: this.stepId++,
				description: `mask=${mask} (${binaryRepresentation}) を処理`,
				array: [...array],
				operation: "ビットマスク処理",
				variables: {
					mask: mask,
					binaryRepresentation: binaryRepresentation,
					decimalValue: mask,
				},
			});

			for (let i = 0; i < n; i++) {
				if ((mask >> i) & 1) {
					subset.push(array[i]);

					this.steps.push({
						id: this.stepId++,
						description: `ビット${i}が1なので arr[${i}]=${array[i]}を追加`,
						array: [...array],
						highlight: [i],
						operation: "要素追加",
						variables: {
							bitPosition: i,
							elementValue: array[i],
							currentSubset: [...subset],
							bitCheck: `(${mask} >> ${i}) & 1 = ${(mask >> i) & 1}`,
						},
					});
				} else {
					this.steps.push({
						id: this.stepId++,
						description: `ビット${i}が0なので arr[${i}]=${array[i]}をスキップ`,
						array: [...array],
						operation: "要素スキップ",
						variables: {
							bitPosition: i,
							elementValue: array[i],
							bitCheck: `(${mask} >> ${i}) & 1 = ${(mask >> i) & 1}`,
						},
					});
				}
			}

			subsets.push(subset);

			this.steps.push({
				id: this.stepId++,
				description: `部分集合${subsets.length}: [${subset.join(", ")}] を生成`,
				array: [...array],
				operation: "部分集合完成",
				variables: {
					subsetIndex: subsets.length,
					subset: subset,
					subsetSize: subset.length,
					mask: mask,
					binaryPattern: binaryRepresentation,
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: "全部分集合の列挙完了",
			array: [...array],
			operation: "全部分集合完了",
			variables: {
				totalSubsets: subsets.length,
				allSubsets: subsets
					.map((subset) => `[${subset.join(", ")}]`)
					.join(", "),
				verification: `2^${n} = ${totalCombinations}`,
			},
		});

		return subsets;
	}

	/**
	 * 部分集合和問題の実行
	 */
	private performSubsetSum(
		array: number[],
		target: number,
	): {
		found: boolean;
		solutions: Array<{ subset: number[]; sum: number; mask: number }>;
	} {
		const solutions: Array<{ subset: number[]; sum: number; mask: number }> =
			[];
		const n = array.length;
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `部分集合和問題：配列から和が${target}になる部分集合を全探索`,
			array: [...array],
			operation: "部分集合和開始",
			variables: {
				targetSum: target,
				arraySize: n,
				totalCombinations: totalCombinations,
			},
		});

		for (let mask = 0; mask < totalCombinations; mask++) {
			const subset: number[] = [];
			let sum = 0;

			// 部分集合を構築
			for (let i = 0; i < n; i++) {
				if ((mask >> i) & 1) {
					subset.push(array[i]);
					sum += array[i];
				}
			}

			const binaryRepresentation = mask.toString(2).padStart(n, "0");

			this.steps.push({
				id: this.stepId++,
				description: `mask=${mask} (${binaryRepresentation}): [${subset.join(", ")}] = ${sum}`,
				array: [...array],
				highlight: subset.map((val) => array.indexOf(val)),
				operation: "部分集合評価",
				variables: {
					mask: mask,
					binaryPattern: binaryRepresentation,
					subset: subset,
					sum: sum,
					target: target,
					isMatch: sum === target,
					difference: Math.abs(sum - target),
				},
			});

			if (sum === target) {
				solutions.push({ subset: [...subset], sum: sum, mask: mask });

				this.steps.push({
					id: this.stepId++,
					description: `🎯 解発見！部分集合[${subset.join(", ")}] = ${target} (解${solutions.length}個目)`,
					array: [...array],
					highlight: subset.map((val) => array.indexOf(val)),
					operation: "解発見",
					variables: {
						solutionIndex: solutions.length,
						solutionSubset: `[${subset.join(", ")}]`,
						solutionSum: sum,
						solutionMask: mask,
						binaryPattern: binaryRepresentation,
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `部分集合和問題完了：${solutions.length}個の解を発見`,
			array: [...array],
			operation: "部分集合和完了",
			variables: {
				totalSolutions: solutions.length,
				solutionSummary: solutions
					.map((sol) => `[${sol.subset.join(", ")}]=${sol.sum}`)
					.join("; "),
				searchCompleted: true,
			},
		});

		return {
			found: solutions.length > 0,
			solutions: solutions,
		};
	}

	/**
	 * 最大部分集合和の実行
	 */
	private performMaxSubsetSum(array: number[]): {
		maxSum: number;
		bestSubset: number[];
		bestMask: number;
	} {
		let maxSum = Number.NEGATIVE_INFINITY;
		let bestSubset: number[] = [];
		let bestMask = 0;
		const n = array.length;
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `最大部分集合和：全${totalCombinations}通りから最大の和を探索`,
			array: [...array],
			operation: "最大部分集合和開始",
			variables: {
				arraySize: n,
				totalCombinations: totalCombinations,
				currentMax: maxSum,
			},
		});

		for (let mask = 0; mask < totalCombinations; mask++) {
			const subset: number[] = [];
			let sum = 0;

			for (let i = 0; i < n; i++) {
				if ((mask >> i) & 1) {
					subset.push(array[i]);
					sum += array[i];
				}
			}

			const binaryRepresentation = mask.toString(2).padStart(n, "0");
			const isNewMax = sum > maxSum;

			this.steps.push({
				id: this.stepId++,
				description: `[${subset.join(", ")}] = ${sum} ${isNewMax ? "(新最大値!)" : ""}`,
				array: [...array],
				highlight: subset.map((val) => array.indexOf(val)),
				operation: "最大値更新チェック",
				variables: {
					mask: mask,
					binaryPattern: binaryRepresentation,
					subset: subset,
					sum: sum,
					currentMax: maxSum,
					isNewMax: isNewMax,
				},
			});

			if (sum > maxSum) {
				maxSum = sum;
				bestSubset = [...subset];
				bestMask = mask;

				this.steps.push({
					id: this.stepId++,
					description: `🏆 新最大値更新！最大和=${maxSum}, 部分集合=[${bestSubset.join(", ")}]`,
					array: [...array],
					highlight: bestSubset.map((val) => array.indexOf(val)),
					operation: "最大値更新",
					variables: {
						newMaxSum: maxSum,
						newBestSubset: bestSubset,
						newBestMask: bestMask,
						improvement: sum - (maxSum - sum),
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: "最大部分集合和探索完了",
			array: [...array],
			highlight: bestSubset.map((val) => array.indexOf(val)),
			operation: "最大部分集合和完了",
			variables: {
				finalMaxSum: maxSum,
				finalBestSubset: bestSubset,
				finalBestMask: bestMask,
				binaryPattern: bestMask.toString(2).padStart(n, "0"),
			},
		});

		return {
			maxSum: maxSum,
			bestSubset: bestSubset,
			bestMask: bestMask,
		};
	}

	/**
	 * 小規模ナップサック問題の実行
	 */
	private performKnapsack(
		weights: number[],
		values: number[],
		capacity: number,
	): {
		maxValue: number;
		selectedItems: number[];
		totalWeight: number;
		selectedMask: number;
	} {
		let maxValue = 0;
		let selectedItems: number[] = [];
		let bestWeight = 0;
		let selectedMask = 0;
		const n = weights.length;
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `ナップサック問題：容量${capacity}で価値最大化`,
			operation: "ナップサック開始",
			variables: {
				weights: weights,
				values: values,
				capacity: capacity,
				itemCount: n,
				totalCombinations: totalCombinations,
			},
		});

		for (let mask = 0; mask < totalCombinations; mask++) {
			const currentItems: number[] = [];
			let totalWeight = 0;
			let totalValue = 0;

			for (let i = 0; i < n; i++) {
				if ((mask >> i) & 1) {
					currentItems.push(i);
					totalWeight += weights[i];
					totalValue += values[i];
				}
			}

			const binaryRepresentation = mask.toString(2).padStart(n, "0");
			const isValid = totalWeight <= capacity;
			const isNewMax = isValid && totalValue > maxValue;

			this.steps.push({
				id: this.stepId++,
				description: `アイテム[${currentItems.join(", ")}]: 重さ=${totalWeight}, 価値=${totalValue} ${!isValid ? "(容量超過)" : isNewMax ? "(新最大値!)" : ""}`,
				operation: "組み合わせ評価",
				variables: {
					mask: mask,
					binaryPattern: binaryRepresentation,
					selectedItems: currentItems,
					totalWeight: totalWeight,
					totalValue: totalValue,
					capacity: capacity,
					isValid: isValid,
					isNewMax: isNewMax,
					weightRatio: `${totalWeight}/${capacity}`,
				},
			});

			if (isValid && totalValue > maxValue) {
				maxValue = totalValue;
				selectedItems = [...currentItems];
				bestWeight = totalWeight;
				selectedMask = mask;

				this.steps.push({
					id: this.stepId++,
					description: `🎒 新最適解！価値=${maxValue}, 重さ=${bestWeight}, アイテム=[${selectedItems.join(", ")}]`,
					operation: "最適解更新",
					variables: {
						newMaxValue: maxValue,
						newSelectedItems: selectedItems,
						newTotalWeight: bestWeight,
						newSelectedMask: selectedMask,
						efficiency: (maxValue / bestWeight).toFixed(2),
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: "ナップサック問題解決完了",
			operation: "ナップサック完了",
			variables: {
				finalMaxValue: maxValue,
				finalSelectedItems: selectedItems,
				finalTotalWeight: bestWeight,
				finalSelectedMask: selectedMask,
				capacityUsage: `${bestWeight}/${capacity} (${((bestWeight / capacity) * 100).toFixed(1)}%)`,
			},
		});

		return {
			maxValue: maxValue,
			selectedItems: selectedItems,
			totalWeight: bestWeight,
			selectedMask: selectedMask,
		};
	}

	/**
	 * ビット演算の基本説明
	 */
	private performBitCount(array: number[]): {
		demonstrations: Array<{
			mask: number;
			binary: string;
			subset: number[];
			operations: Array<{ bit: number; operation: string; result: number }>;
		}>;
	} {
		const demonstrations: Array<{
			mask: number;
			binary: string;
			subset: number[];
			operations: Array<{ bit: number; operation: string; result: number }>;
		}> = [];

		const n = Math.min(array.length, 4); // 例示のため最大4要素
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `ビット演算の基本：配列の最初${n}要素でビット演算を詳解`,
			array: array.slice(0, n),
			operation: "ビット演算解説開始",
			variables: {
				demonstrationSize: n,
				totalCombinations: totalCombinations,
				binarySystem: "各ビットが要素の選択/非選択を表現",
			},
		});

		for (let mask = 0; mask < Math.min(totalCombinations, 8); mask++) {
			const subset: number[] = [];
			const operations: Array<{
				bit: number;
				operation: string;
				result: number;
			}> = [];
			const binary = mask.toString(2).padStart(n, "0");

			this.steps.push({
				id: this.stepId++,
				description: `mask=${mask} → 2進数=${binary}のビット演算`,
				array: array.slice(0, n),
				operation: "ビット演算詳細",
				variables: {
					mask: mask,
					binaryRepresentation: binary,
					explanation: "右からi番目のビットがarr[i]の選択を表す",
				},
			});

			for (let i = 0; i < n; i++) {
				const shifted = mask >> i;
				const result = shifted & 1;
				const operation = `(${mask} >> ${i}) & 1`;

				operations.push({
					bit: i,
					operation: operation,
					result: result,
				});

				this.steps.push({
					id: this.stepId++,
					description: `ビット${i}: ${operation} = ${result} → arr[${i}]=${array[i]}を${result ? "選択" : "非選択"}`,
					array: array.slice(0, n),
					highlight: result ? [i] : [],
					operation: "ビット判定",
					variables: {
						bitPosition: i,
						maskValue: mask,
						shiftedValue: shifted,
						andResult: result,
						elementValue: array[i],
						isSelected: result === 1,
						operationDetail: `${mask} >> ${i} = ${shifted}, ${shifted} & 1 = ${result}`,
					},
				});

				if (result) {
					subset.push(array[i]);
				}
			}

			demonstrations.push({
				mask: mask,
				binary: binary,
				subset: [...subset],
				operations: [...operations],
			});

			this.steps.push({
				id: this.stepId++,
				description: `結果：mask=${mask}で部分集合[${subset.join(", ")}]を生成`,
				array: array.slice(0, n),
				highlight: subset.map((val) => array.indexOf(val)),
				operation: "ビット演算結果",
				variables: {
					mask: mask,
					resultSubset: `[${subset.join(", ")}]`,
					subsetSize: subset.length,
					operationsSummary: operations
						.map((op) => `bit${op.bit}=${op.result}`)
						.join(", "),
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: "ビット演算の基本解説完了",
			array: array.slice(0, n),
			operation: "ビット演算解説完了",
			variables: {
				totalDemonstrations: demonstrations.length,
				keyPoints: [
					"mask値が部分集合の選択パターンを表現",
					"右シフト(>>)で特定ビットを取得",
					"AND演算(&1)で0/1判定",
					"2^n通りの全組み合わせを表現可能",
				],
			},
		});

		return { demonstrations };
	}

	/**
	 * 組み合わせ和の実行
	 */
	private performCombinationSum(
		array: number[],
		target: number,
	): {
		foundCombinations: Array<{ subset: number[]; sum: number; size: number }>;
		exactMatches: number;
		closestSum: number;
	} {
		const foundCombinations: Array<{
			subset: number[];
			sum: number;
			size: number;
		}> = [];
		let exactMatches = 0;
		let closestSum = Number.POSITIVE_INFINITY;
		let closestDifference = Number.POSITIVE_INFINITY;

		const n = array.length;
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `組み合わせ和：目標${target}に最も近い組み合わせと完全一致を探索`,
			array: [...array],
			operation: "組み合わせ和開始",
			variables: {
				target: target,
				arraySize: n,
				totalCombinations: totalCombinations,
			},
		});

		for (let mask = 0; mask < totalCombinations; mask++) {
			const subset: number[] = [];
			let sum = 0;

			for (let i = 0; i < n; i++) {
				if ((mask >> i) & 1) {
					subset.push(array[i]);
					sum += array[i];
				}
			}

			const difference = Math.abs(sum - target);
			const isExactMatch = sum === target;
			const isCloser = difference < closestDifference;

			foundCombinations.push({
				subset: [...subset],
				sum: sum,
				size: subset.length,
			});

			this.steps.push({
				id: this.stepId++,
				description: `[${subset.join(", ")}] = ${sum}, 差=${difference} ${isExactMatch ? "(完全一致!)" : isCloser ? "(最接近更新)" : ""}`,
				array: [...array],
				highlight: subset.map((val) => array.indexOf(val)),
				operation: "組み合わせ評価",
				variables: {
					subset: subset,
					sum: sum,
					target: target,
					difference: difference,
					isExactMatch: isExactMatch,
					isCloser: isCloser,
					closestSoFar: closestSum,
				},
			});

			if (isExactMatch) {
				exactMatches++;
			}

			if (isCloser) {
				closestSum = sum;
				closestDifference = difference;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: "組み合わせ和探索完了",
			array: [...array],
			operation: "組み合わせ和完了",
			variables: {
				totalCombinations: foundCombinations.length,
				exactMatches: exactMatches,
				closestSum: closestSum,
				closestDifference: closestDifference,
			},
		});

		return {
			foundCombinations: foundCombinations,
			exactMatches: exactMatches,
			closestSum: closestSum,
		};
	}

	/**
	 * 最小部分集合の実行
	 */
	private performMinimumSubset(
		array: number[],
		target: number,
	): {
		found: boolean;
		minSubset?: number[];
		minSize?: number;
		minSum?: number;
	} {
		let found = false;
		let minSubset: number[] = [];
		let minSize = Number.POSITIVE_INFINITY;
		let minSum = 0;

		const n = array.length;
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `最小部分集合：和が${target}以上になる最小サイズの部分集合を探索`,
			array: [...array],
			operation: "最小部分集合開始",
			variables: {
				target: target,
				arraySize: n,
				totalCombinations: totalCombinations,
				condition: `sum >= ${target}`,
			},
		});

		for (let mask = 1; mask < totalCombinations; mask++) {
			// 空集合をスキップ
			const subset: number[] = [];
			let sum = 0;

			for (let i = 0; i < n; i++) {
				if ((mask >> i) & 1) {
					subset.push(array[i]);
					sum += array[i];
				}
			}

			const meetsCondition = sum >= target;
			const isSmaller = subset.length < minSize;

			this.steps.push({
				id: this.stepId++,
				description: `[${subset.join(", ")}] = ${sum}, サイズ=${subset.length} ${!meetsCondition ? "(条件未満)" : isSmaller ? "(新最小!)" : ""}`,
				array: [...array],
				highlight: subset.map((val) => array.indexOf(val)),
				operation: "最小サイズチェック",
				variables: {
					subset: subset,
					sum: sum,
					size: subset.length,
					target: target,
					meetsCondition: meetsCondition,
					currentMinSize: minSize,
					isSmaller: isSmaller && meetsCondition,
				},
			});

			if (meetsCondition && subset.length < minSize) {
				found = true;
				minSubset = [...subset];
				minSize = subset.length;
				minSum = sum;

				this.steps.push({
					id: this.stepId++,
					description: `🎯 新最小部分集合発見！サイズ=${minSize}, 和=${minSum}, 集合=[${minSubset.join(", ")}]`,
					array: [...array],
					highlight: minSubset.map((val) => array.indexOf(val)),
					operation: "最小集合更新",
					variables: {
						newMinSubset: minSubset,
						newMinSize: minSize,
						newMinSum: minSum,
						efficiency: (minSum / minSize).toFixed(2),
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: found ? "最小部分集合探索完了" : "条件を満たす部分集合なし",
			array: [...array],
			highlight: found ? minSubset.map((val) => array.indexOf(val)) : [],
			operation: "最小部分集合完了",
			variables: {
				found: found,
				resultSubset: found ? `[${minSubset.join(", ")}]` : "none",
				resultSize: found ? minSize : 0,
				resultSum: found ? minSum : 0,
			},
		});

		return found
			? { found: true, minSubset, minSize, minSum }
			: { found: false };
	}

	/**
	 * 指定条件の部分集合
	 */
	private performExactSubsets(
		array: number[],
		condition: number,
	): {
		matchingSubsets: Array<{ subset: number[]; sum: number; product: number }>;
		conditionType: string;
	} {
		const matchingSubsets: Array<{
			subset: number[];
			sum: number;
			product: number;
		}> = [];
		const conditionType = "sum equals target"; // 例：和が指定値と等しい

		const n = array.length;
		const totalCombinations = 2 ** n;

		this.steps.push({
			id: this.stepId++,
			description: `指定条件部分集合：条件「和=${condition}」を満たす部分集合を全探索`,
			array: [...array],
			operation: "指定条件開始",
			variables: {
				condition: condition,
				conditionType: conditionType,
				arraySize: n,
				totalCombinations: totalCombinations,
			},
		});

		for (let mask = 0; mask < totalCombinations; mask++) {
			const subset: number[] = [];
			let sum = 0;
			let product = 1;

			for (let i = 0; i < n; i++) {
				if ((mask >> i) & 1) {
					subset.push(array[i]);
					sum += array[i];
					product *= array[i];
				}
			}

			const meetsCondition = sum === condition;

			this.steps.push({
				id: this.stepId++,
				description: `[${subset.join(", ")}]: 和=${sum}, 積=${product} ${meetsCondition ? "(条件一致!)" : ""}`,
				array: [...array],
				highlight: subset.map((val) => array.indexOf(val)),
				operation: "条件判定",
				variables: {
					subset: subset,
					sum: sum,
					product: product,
					condition: condition,
					meetsCondition: meetsCondition,
				},
			});

			if (meetsCondition) {
				matchingSubsets.push({
					subset: [...subset],
					sum: sum,
					product: product,
				});

				this.steps.push({
					id: this.stepId++,
					description: `✅ 条件合致！部分集合[${subset.join(", ")}] (解${matchingSubsets.length}個目)`,
					array: [...array],
					highlight: subset.map((val) => array.indexOf(val)),
					operation: "条件合致",
					variables: {
						matchIndex: matchingSubsets.length,
						matchingSubset: `[${subset.join(", ")}] sum=${sum} product=${product}`,
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `指定条件部分集合探索完了：${matchingSubsets.length}個の解を発見`,
			array: [...array],
			operation: "指定条件完了",
			variables: {
				totalMatches: matchingSubsets.length,
				matchesSummary: matchingSubsets
					.map((match) => `[${match.subset.join(", ")}]=${match.sum}`)
					.join("; "),
				searchCompleted: true,
			},
		});

		return {
			matchingSubsets: matchingSubsets,
			conditionType: conditionType,
		};
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(
		operation: BitExhaustiveSearchOperationType,
	): string {
		const descriptions = {
			allSubsets: "全部分集合の列挙",
			subsetSum: "部分集合和問題",
			maxSubsetSum: "最大部分集合和",
			knapsack: "小規模ナップサック問題",
			bitCount: "ビット演算の基本",
			combinationSum: "組み合わせ和探索",
			minimumSubset: "最小部分集合探索",
			exactSubsets: "指定条件部分集合",
		};
		return descriptions[operation] || "ビット全探索";
	}

	/**
	 * 技法の説明を取得
	 */
	private getTechniqueDescription(
		operation: BitExhaustiveSearchOperationType,
	): string {
		const techniques = {
			allSubsets: "2^n通りの全組み合わせを系統的に列挙",
			subsetSum: "ビットマスクによる効率的な部分集合探索",
			maxSubsetSum: "全組み合わせから最適解を発見",
			knapsack: "制約条件下での価値最大化",
			bitCount: "ビット演算の原理と応用",
			combinationSum: "目標値に対する最適組み合わせ探索",
			minimumSubset: "条件を満たす最小サイズ集合の発見",
			exactSubsets: "特定条件を満たす全集合の列挙",
		};
		return techniques[operation] || "ビット全探索技法";
	}

	/**
	 * 効率性に関する注記を取得
	 */
	private getEfficiencyNote(
		operation: BitExhaustiveSearchOperationType,
	): string {
		const notes = {
			allSubsets: "完全な組み合わせ列挙をO(2^n)で実現",
			subsetSum: "動的計画法と比較して実装が簡潔",
			maxSubsetSum: "全探索による確実な最適解発見",
			knapsack: "小規模問題での確実な最適解",
			bitCount: "ビット演算の効率性とパワーを実証",
			combinationSum: "柔軟な条件設定での探索",
			minimumSubset: "制約最適化の系統的解法",
			exactSubsets: "複数条件での効率的フィルタリング",
		};
		return notes[operation] || "効率的なビット全探索";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(
		operation: BitExhaustiveSearchOperationType,
	): string {
		const complexities = {
			allSubsets: "O(2^n)",
			subsetSum: "O(2^n)",
			maxSubsetSum: "O(2^n)",
			knapsack: "O(2^n)",
			bitCount: "O(2^n)",
			combinationSum: "O(2^n)",
			minimumSubset: "O(2^n)",
			exactSubsets: "O(2^n)",
		};
		return complexities[operation] || "O(2^n)";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "subsetSum",
				array: [3, 1, 4, 2, 5],
				target: 6,
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
ビット全探索（Bit Exhaustive Search）は、ビット演算を使用して全ての組み合わせを系統的に探索する重要なアルゴリズム技法です。2^n通りの部分集合を効率的に列挙・評価することで、組み合わせ最適化問題を解決できます。

🔢 **ビット演算の基本原理**
- n個の要素 → 2^n通りの部分集合
- ビットマスク（0〜2^n-1）で全組み合わせを表現
- i番目のビットが1 → i番目の要素を選択
- 右シフト(>>)とAND演算(&)でビット判定

📊 **主要な操作と計算量**
- 全組み合わせ生成: O(2^n) - 系統的な列挙
- 部分集合和問題: O(2^n) - 動的計画法の代替
- 最適化問題: O(2^n) - 確実な最適解発見
- 制約付き探索: O(2^n) - 条件フィルタリング

💡 **ビット演算の実装パターン**
- **基本パターン**: \`for (mask = 0; mask < (1 << n); mask++)\`
- **ビット判定**: \`if ((mask >> i) & 1)\`
- **部分集合構築**: マスクに基づく要素選択
- **条件評価**: 構築した部分集合の評価

🌟 **代表的な応用問題**
- **部分集合和**: 指定された和になる組み合わせ
- **ナップサック**: 容量制約下での価値最大化
- **組み合わせ最適化**: 複数条件での最適解探索
- **制約充足**: 特定条件を満たす組み合わせ発見

🚀 **実世界での応用例**
- **リソース配分**: 限られたリソースの最適割り当て
- **スケジューリング**: タスクの組み合わせ最適化
- **ゲーム理論**: 戦略の組み合わせ分析
- **機械学習**: 特徴選択とモデル最適化

⚡ **パフォーマンス特性**
- 時間計算量: O(2^n) - 指数的増加
- 空間計算量: O(1) - 追加メモリ最小限
- 実装の簡潔性: ビット演算による直感的コード
- 確実性: 全探索による最適解保証

🔍 **他の手法との比較**
- vs 動的計画法: 実装が簡潔、メモリ効率良好
- vs 再帰的探索: スタックオーバーフローなし
- vs 貪欲法: 最適解を確実に発見

📈 **適用範囲と制限**
- **適用可能**: n ≤ 20程度（実用的な範囲）
- **制限事項**: 指数的時間のため大規模データには不適
- **最適使用**: 小〜中規模の組み合わせ最適化
- **学習価値**: ビット演算と全探索の基本理解

🎯 **学習のポイント**
- ビット演算の理解と活用
- 全探索の系統的アプローチ
- 制約条件の効率的処理
- 計算量とトレードオフの理解

ビット全探索は、「完全な探索による確実な解法」を学べる重要な技法です。ビット演算の力を活用して、組み合わせ問題を効率的かつ確実に解決する実践的なアルゴリズムです。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: BitExhaustiveSearchOperationType;
		array?: number[];
		target?: number;
		capacity?: number;
		weights?: number[];
		values?: number[];
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "allSubsets",
				array: [1, 2, 3],
				description: "配列[1,2,3]の全部分集合を列挙",
				expectedResult: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]],
			},
			{
				operation: "subsetSum",
				array: [3, 1, 4, 2, 5],
				target: 6,
				description: "和が6になる部分集合を全探索",
				expectedResult: {
					found: true,
					solutions: [
						{ subset: [1, 5], sum: 6 },
						{ subset: [4, 2], sum: 6 },
					],
				},
			},
			{
				operation: "bitCount",
				array: [10, 20, 30, 40],
				description: "ビット演算の基本動作を詳細解説",
				expectedResult: "ビット演算の原理説明",
			},
			{
				operation: "knapsack",
				weights: [2, 3, 4, 5],
				values: [3, 4, 5, 6],
				capacity: 8,
				description: "容量8のナップサック問題を解決",
				expectedResult: { maxValue: 9, selectedItems: [0, 1], totalWeight: 5 },
			},
			{
				operation: "maxSubsetSum",
				array: [-1, 2, -3, 4, -5],
				description: "最大部分集合和を発見",
				expectedResult: { maxSum: 6, bestSubset: [2, 4] },
			},
		];
	}
}
