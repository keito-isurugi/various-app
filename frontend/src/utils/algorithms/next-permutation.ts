/**
 * src/utils/algorithms/next-permutation.ts
 *
 * next_permutation（順列全列挙）アルゴリズムの実装
 * 辞書順での順列生成を効率的に行う重要な技法
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 順列操作の種類
 */
type PermutationOperationType =
	| "nextPermutation" // 次の順列を生成
	| "allPermutations" // 全順列の列挙
	| "permutationRank" // 順列のランク計算
	| "kthPermutation" // k番目の順列
	| "permutationCycle" // 順列の周期性
	| "lexicographic" // 辞書順比較
	| "permutationInverse" // 逆順列
	| "permutationCompose"; // 順列の合成

/**
 * next_permutation アルゴリズムクラス
 *
 * 辞書順で次の順列を効率的に生成する標準的なアルゴリズム
 * C++のstd::next_permutationと同等の機能を提供
 * 時間計算量: O(n) (平均的にはO(1))
 * 空間計算量: O(1)
 */
export class NextPermutationAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "next-permutation",
		name: "next_permutation（順列全列挙）",
		description:
			"辞書順で次の順列を効率的に生成。n!通りの順列を系統的に列挙する標準アルゴリズム",
		category: "other",
		timeComplexity: {
			best: "O(1)", // 最適な場合（末尾交換のみ）
			average: "O(n)", // 平均的な場合
			worst: "O(n)", // 最悪の場合（全体の並び替え）
		},
		difficulty: 4, // 中上級（アルゴリズムの理解と実装技術が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private originalArray: number[] = [];

	/**
	 * 順列操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as PermutationOperationType;
		const array = input.parameters?.array as number[] | undefined;
		const k = input.parameters?.k as number | undefined;
		const maxPermutations = input.parameters?.maxPermutations as
			| number
			| undefined;

		// 配列の設定
		if (array) {
			this.originalArray = [...array];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `順列操作開始：${this.getOperationDescription(operation)}を実行`,
			array: [...this.originalArray],
			operation: "初期化",
			variables: {
				operation: operation,
				arraySize: this.originalArray.length,
				totalPermutations: this.factorial(this.originalArray.length),
				technique: this.getTechniqueDescription(operation),
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "nextPermutation": {
				if (array) {
					result = this.performNextPermutation(array);
				} else {
					throw new Error("次順列生成には配列が必要です");
				}
				break;
			}

			case "allPermutations": {
				if (array) {
					result = this.performAllPermutations(array, maxPermutations);
				} else {
					throw new Error("全順列列挙には配列が必要です");
				}
				break;
			}

			case "permutationRank": {
				if (array) {
					result = this.performPermutationRank(array);
				} else {
					throw new Error("順列ランク計算には配列が必要です");
				}
				break;
			}

			case "kthPermutation": {
				if (array && k !== undefined) {
					result = this.performKthPermutation(array, k);
				} else {
					throw new Error("k番目順列生成には配列とkが必要です");
				}
				break;
			}

			case "permutationCycle": {
				if (array) {
					result = this.performPermutationCycle(array);
				} else {
					throw new Error("順列周期性には配列が必要です");
				}
				break;
			}

			case "lexicographic": {
				if (array) {
					result = this.performLexicographicComparison(array);
				} else {
					throw new Error("辞書順比較には配列が必要です");
				}
				break;
			}

			case "permutationInverse": {
				if (array) {
					result = this.performPermutationInverse(array);
				} else {
					throw new Error("逆順列計算には配列が必要です");
				}
				break;
			}

			case "permutationCompose": {
				if (array) {
					result = this.performPermutationCompose(array);
				} else {
					throw new Error("順列合成には配列が必要です");
				}
				break;
			}

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: `🎉 順列操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
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
	 * 次の順列を生成（next_permutationアルゴリズム）
	 */
	private performNextPermutation(array: number[]): {
		hasNext: boolean;
		nextPermutation?: number[];
		steps: string[];
	} {
		const result = [...array];
		const stepDescriptions: string[] = [];
		const n = result.length;

		this.steps.push({
			id: this.stepId++,
			description: `next_permutationアルゴリズム：配列[${array.join(", ")}]の次の辞書順順列を生成`,
			array: [...result],
			operation: "next_permutation開始",
			variables: {
				currentPermutation: array,
				arraySize: n,
				algorithm: "標準的なnext_permutationアルゴリズム",
			},
		});

		// Step 1: 右から最初の降順でない位置を見つける
		let i = n - 2;
		while (i >= 0 && result[i] >= result[i + 1]) {
			this.steps.push({
				id: this.stepId++,
				description: `位置${i}: ${result[i]} >= ${result[i + 1]} なので左へ移動`,
				array: [...result],
				highlight: [i, i + 1],
				operation: "ピボット探索",
				variables: {
					position: i,
					currentValue: result[i],
					nextValue: result[i + 1],
					isDescending: result[i] >= result[i + 1],
				},
			});
			i--;
		}

		stepDescriptions.push(`ステップ1: ピボット位置${i}を発見`);

		if (i < 0) {
			this.steps.push({
				id: this.stepId++,
				description: "❌ これが最後の順列です（降順配列）",
				array: [...result],
				operation: "最後の順列",
				variables: {
					result: false,
					reason: "配列が完全に降順のため次の順列は存在しません",
				},
			});

			return {
				hasNext: false,
				steps: stepDescriptions,
			};
		}

		this.steps.push({
			id: this.stepId++,
			description: `🎯 ピボット発見：位置${i} (値=${result[i]})`,
			array: [...result],
			highlight: [i],
			operation: "ピボット確定",
			variables: {
				pivotIndex: i,
				pivotValue: result[i],
				description: "右から最初の昇順位置",
			},
		});

		// Step 2: ピボットより大きい最小の要素を右側から見つける
		let j = n - 1;
		while (result[j] <= result[i]) {
			this.steps.push({
				id: this.stepId++,
				description: `位置${j}: ${result[j]} <= ${result[i]} なので左へ移動`,
				array: [...result],
				highlight: [i, j],
				operation: "交換相手探索",
				variables: {
					searchPosition: j,
					searchValue: result[j],
					pivotValue: result[i],
					isValidSwap: result[j] > result[i],
				},
			});
			j--;
		}

		this.steps.push({
			id: this.stepId++,
			description: `🔄 交換相手発見：位置${j} (値=${result[j]})`,
			array: [...result],
			highlight: [i, j],
			operation: "交換相手確定",
			variables: {
				swapIndex: j,
				swapValue: result[j],
				pivotIndex: i,
				pivotValue: result[i],
				reason: `${result[j]} > ${result[i]}の最小値`,
			},
		});

		stepDescriptions.push(`ステップ2: 交換相手位置${j}を発見`);

		// Step 3: ピボットと交換相手を交換
		const temp = result[i];
		result[i] = result[j];
		result[j] = temp;

		this.steps.push({
			id: this.stepId++,
			description: `交換実行：位置${i}と位置${j}を交換`,
			array: [...result],
			highlight: [i, j],
			operation: "ピボット交換",
			variables: {
				beforeSwap_i: temp,
				beforeSwap_j: result[i],
				afterSwap_i: result[i],
				afterSwap_j: result[j],
				swapPositions: [i, j],
			},
		});

		stepDescriptions.push(`ステップ3: 位置${i}と${j}を交換`);

		// Step 4: ピボットより右の部分を反転
		this.steps.push({
			id: this.stepId++,
			description: `位置${i + 1}以降を反転して最小の辞書順にする`,
			array: [...result],
			highlight: Array.from({ length: n - i - 1 }, (_, k) => i + 1 + k),
			operation: "反転開始",
			variables: {
				reverseStart: i + 1,
				reverseEnd: n - 1,
				reverseLength: n - i - 1,
			},
		});

		let left = i + 1;
		let right = n - 1;
		while (left < right) {
			this.steps.push({
				id: this.stepId++,
				description: `反転：位置${left}(${result[left]}) ↔ 位置${right}(${result[right]})`,
				array: [...result],
				highlight: [left, right],
				operation: "要素反転",
				variables: {
					leftPos: left,
					rightPos: right,
					leftValue: result[left],
					rightValue: result[right],
				},
			});

			const reverseTemp = result[left];
			result[left] = result[right];
			result[right] = reverseTemp;
			left++;
			right--;
		}

		stepDescriptions.push(`ステップ4: 位置${i + 1}以降を反転`);

		this.steps.push({
			id: this.stepId++,
			description: `✅ 次の順列生成完了：[${result.join(", ")}]`,
			array: [...result],
			operation: "next_permutation完了",
			variables: {
				originalPermutation: array,
				nextPermutation: result,
				algorithm: "next_permutationアルゴリズム",
				steps: stepDescriptions,
			},
		});

		return {
			hasNext: true,
			nextPermutation: result,
			steps: stepDescriptions,
		};
	}

	/**
	 * 全順列の列挙
	 */
	private performAllPermutations(array: number[], maxCount = 24): number[][] {
		const permutations: number[][] = [];
		const current = [...array].sort((a, b) => a - b); // 最初の辞書順
		let count = 0;

		this.steps.push({
			id: this.stepId++,
			description: `全順列列挙：最初の辞書順[${current.join(", ")}]から開始`,
			array: [...current],
			operation: "全順列開始",
			variables: {
				startingPermutation: current,
				maxCount: maxCount,
				totalPossible: this.factorial(array.length),
			},
		});

		permutations.push([...current]);

		this.steps.push({
			id: this.stepId++,
			description: `順列1: [${current.join(", ")}] を追加`,
			array: [...current],
			operation: "順列追加",
			variables: {
				permutationIndex: 1,
				permutation: [...current],
			},
		});

		while (count < maxCount - 1) {
			const nextResult = this.performNextPermutationInternal(current);

			if (!nextResult.hasNext) {
				this.steps.push({
					id: this.stepId++,
					description: "全順列の列挙完了（最後の順列に到達）",
					array: [...current],
					operation: "全順列完了",
					variables: {
						totalGenerated: permutations.length,
						reason: "最後の順列に到達",
					},
				});
				break;
			}

			count++;
			permutations.push([...current]);

			this.steps.push({
				id: this.stepId++,
				description: `順列${permutations.length}: [${current.join(", ")}] を追加`,
				array: [...current],
				operation: "順列追加",
				variables: {
					permutationIndex: permutations.length,
					permutation: [...current],
					generatedSoFar: permutations.length,
				},
			});

			if (count >= maxCount - 1) {
				this.steps.push({
					id: this.stepId++,
					description: `制限数${maxCount}に到達したため列挙を終了`,
					array: [...current],
					operation: "制限到達",
					variables: {
						totalGenerated: permutations.length,
						maxCount: maxCount,
						reason: "指定された最大数に到達",
					},
				});
				break;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: "全順列列挙完了",
			array: [...current],
			operation: "全順列完了",
			variables: {
				totalPermutations: permutations.length,
				permutationsSummary: permutations
					.map((p) => `[${p.join(",")}]`)
					.join(", "),
				isComplete: count < maxCount - 1,
			},
		});

		return permutations;
	}

	/**
	 * 順列のランク計算
	 */
	private performPermutationRank(array: number[]): {
		rank: number;
		calculation: Array<{
			position: number;
			value: number;
			smaller: number;
			contribution: number;
		}>;
	} {
		const n = array.length;
		const sorted = [...array].sort((a, b) => a - b);
		const calculation: Array<{
			position: number;
			value: number;
			smaller: number;
			contribution: number;
		}> = [];
		let rank = 0;

		this.steps.push({
			id: this.stepId++,
			description: `順列ランク計算：配列[${array.join(", ")}]の辞書順での位置を計算`,
			array: [...array],
			operation: "ランク計算開始",
			variables: {
				permutation: array,
				sortedElements: sorted,
				totalPermutations: this.factorial(n),
			},
		});

		for (let i = 0; i < n; i++) {
			const current = array[i];
			const remaining = sorted.filter((x) => x !== null);
			const smallerCount = remaining.filter((x) => x < current).length;
			const contribution = smallerCount * this.factorial(n - i - 1);

			calculation.push({
				position: i,
				value: current,
				smaller: smallerCount,
				contribution: contribution,
			});

			rank += contribution;

			this.steps.push({
				id: this.stepId++,
				description: `位置${i}: 値${current}, より小さい要素=${smallerCount}個, 貢献度=${contribution}`,
				array: [...array],
				highlight: [i],
				operation: "ランク計算",
				variables: {
					position: i,
					currentValue: current,
					remainingElements: [...remaining],
					smallerCount: smallerCount,
					factorial: this.factorial(n - i - 1),
					contribution: contribution,
					runningRank: rank,
				},
			});

			// 使用した要素を削除
			const index = sorted.indexOf(current);
			if (index !== -1) {
				sorted[index] = null as any;
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `順列ランク計算完了：ランク=${rank} (0-indexed)`,
			array: [...array],
			operation: "ランク計算完了",
			variables: {
				finalRank: rank,
				oneIndexedRank: rank + 1,
				calculationString: calculation
					.map(
						(c) =>
							`位置${c.position}:値${c.value}(小${c.smaller}個,貢献${c.contribution})`,
					)
					.join(" | "),
				totalContribution: rank,
			},
		});

		return {
			rank: rank,
			calculation: calculation,
		};
	}

	/**
	 * k番目の順列を生成
	 */
	private performKthPermutation(
		array: number[],
		k: number,
	): {
		kthPermutation: number[];
		construction: Array<{ step: number; choice: number; remaining: number[] }>;
	} {
		const sorted = [...array].sort((a, b) => a - b);
		const n = sorted.length;
		const result: number[] = [];
		const construction: Array<{
			step: number;
			choice: number;
			remaining: number[];
		}> = [];
		let remainingK = k;

		this.steps.push({
			id: this.stepId++,
			description: `k番目順列生成：${k}番目(0-indexed)の順列を構築`,
			array: sorted,
			operation: "k番目順列開始",
			variables: {
				k: k,
				oneIndexedK: k + 1,
				sortedElements: sorted,
				totalPermutations: this.factorial(n),
			},
		});

		for (let i = 0; i < n; i++) {
			const factorial = this.factorial(n - i - 1);
			const index = Math.floor(remainingK / factorial);
			const choice = sorted[index];

			construction.push({
				step: i,
				choice: choice,
				remaining: [...sorted],
			});

			result.push(choice);
			sorted.splice(index, 1);
			remainingK = remainingK % factorial;

			this.steps.push({
				id: this.stepId++,
				description: `ステップ${i + 1}: k=${remainingK + index * factorial}, ${factorial}で割ると商=${index}, 選択=${choice}`,
				array: [...result],
				operation: "要素選択",
				variables: {
					step: i + 1,
					currentK: remainingK + index * factorial,
					factorial: factorial,
					quotient: index,
					selectedValue: choice,
					remainingElements: [...sorted],
					newK: remainingK,
					resultSoFar: [...result],
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: `k番目順列生成完了：[${result.join(", ")}]`,
			array: [...result],
			operation: "k番目順列完了",
			variables: {
				k: k,
				kthPermutation: result,
				constructionString: construction
					.map((c) => `step${c.step}:選択${c.choice}`)
					.join(" → "),
			},
		});

		return {
			kthPermutation: result,
			construction: construction,
		};
	}

	/**
	 * 順列の周期性を調べる
	 */
	private performPermutationCycle(array: number[]): {
		cycleLength: number;
		cycleDemo: number[][];
		backToOriginal: boolean;
	} {
		const original = [...array];
		const current = [...array];
		const cycleDemo: number[][] = [];
		let cycleLength = 0;
		const maxCycles = 10; // デモ用制限

		this.steps.push({
			id: this.stepId++,
			description: `順列周期性：配列[${array.join(", ")}]がnext_permutationで元に戻るまでの回数`,
			array: [...current],
			operation: "周期性開始",
			variables: {
				originalPermutation: original,
				maxCycles: maxCycles,
			},
		});

		cycleDemo.push([...current]);

		do {
			const nextResult = this.performNextPermutationInternal(current);

			if (!nextResult.hasNext) {
				// 最後に到達したら最初に戻る
				current.sort((a, b) => a - b);
			}

			cycleLength++;
			cycleDemo.push([...current]);

			this.steps.push({
				id: this.stepId++,
				description: `サイクル${cycleLength}: [${current.join(", ")}] ${this.arraysEqual(current, original) ? "(元の配列に戻った!)" : ""}`,
				array: [...current],
				operation: "サイクル進行",
				variables: {
					cycleNumber: cycleLength,
					currentPermutation: [...current],
					isBackToOriginal: this.arraysEqual(current, original),
				},
			});

			if (cycleLength >= maxCycles) {
				this.steps.push({
					id: this.stepId++,
					description: `デモ制限${maxCycles}に到達したため終了`,
					array: [...current],
					operation: "制限到達",
					variables: {
						maxCycles: maxCycles,
						reason: "デモ制限到達",
					},
				});
				break;
			}
		} while (!this.arraysEqual(current, original) && cycleLength < maxCycles);

		const backToOriginal = this.arraysEqual(current, original);

		this.steps.push({
			id: this.stepId++,
			description: backToOriginal
				? `周期性確認完了：${cycleLength}回で元の配列に戻りました`
				: `周期性デモ完了：${maxCycles}回以内では元に戻りませんでした`,
			array: [...current],
			operation: "周期性完了",
			variables: {
				cycleLength: cycleLength,
				backToOriginal: backToOriginal,
				totalPermutations: this.factorial(array.length),
				cycleDemonstrationString: cycleDemo
					.map((perm) => `[${perm.join(",")}]`)
					.join(" → "),
			},
		});

		return {
			cycleLength: cycleLength,
			cycleDemo: cycleDemo,
			backToOriginal: backToOriginal,
		};
	}

	/**
	 * 辞書順比較のデモ
	 */
	private performLexicographicComparison(array: number[]): {
		comparisons: Array<{
			perm1: number[];
			perm2: number[];
			result: string;
			position: number;
		}>;
	} {
		const current = [...array].sort((a, b) => a - b);
		const comparisons: Array<{
			perm1: number[];
			perm2: number[];
			result: string;
			position: number;
		}> = [];
		const permutationsToCompare = 5;

		this.steps.push({
			id: this.stepId++,
			description: "辞書順比較：順列の辞書順での大小関係をデモ",
			array: [...current],
			operation: "辞書順比較開始",
			variables: {
				startingPermutation: current,
				comparisonsToShow: permutationsToCompare,
			},
		});

		let prev = [...current];

		for (let i = 0; i < permutationsToCompare; i++) {
			const nextResult = this.performNextPermutationInternal(current);

			if (!nextResult.hasNext) break;

			const compareResult = this.lexicographicCompare(prev, current);
			comparisons.push({
				perm1: [...prev],
				perm2: [...current],
				result: compareResult.result,
				position: compareResult.position,
			});

			this.steps.push({
				id: this.stepId++,
				description: `比較${i + 1}: [${prev.join(", ")}] ${compareResult.result} [${current.join(", ")}] (位置${compareResult.position}で決定)`,
				array: [...current],
				operation: "辞書順比較",
				variables: {
					comparison: i + 1,
					permutation1: [...prev],
					permutation2: [...current],
					result: compareResult.result,
					decisionPosition: compareResult.position,
				},
			});

			prev = [...current];
		}

		this.steps.push({
			id: this.stepId++,
			description: "辞書順比較デモ完了",
			array: [...current],
			operation: "辞書順比較完了",
			variables: {
				totalComparisons: comparisons.length,
				allComparisonsString: comparisons
					.map(
						(c) => `[${c.perm1.join(",")}] ${c.result} [${c.perm2.join(",")}]`,
					)
					.join(" | "),
			},
		});

		return { comparisons };
	}

	/**
	 * 逆順列の計算
	 */
	private performPermutationInverse(array: number[]): {
		inverse: number[];
		mapping: Array<{
			original: number;
			position: number;
			inversePosition: number;
		}>;
	} {
		const n = array.length;
		const inverse = new Array(n);
		const mapping: Array<{
			original: number;
			position: number;
			inversePosition: number;
		}> = [];

		this.steps.push({
			id: this.stepId++,
			description: `逆順列計算：順列[${array.join(", ")}]の逆順列を構築`,
			array: [...array],
			operation: "逆順列開始",
			variables: {
				originalPermutation: array,
				explanation: "inverse[array[i]] = i の関係",
			},
		});

		for (let i = 0; i < n; i++) {
			const value = array[i];
			inverse[value] = i;

			mapping.push({
				original: value,
				position: i,
				inversePosition: value,
			});

			this.steps.push({
				id: this.stepId++,
				description: `inverse[${value}] = ${i} (位置${i}の値${value}が逆順列の位置${value}に${i}を配置)`,
				array: [...array],
				highlight: [i],
				operation: "逆順列構築",
				variables: {
					currentIndex: i,
					currentValue: value,
					inverseAssignment: `inverse[${value}] = ${i}`,
					inverseSoFar: [...inverse],
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: `逆順列計算完了：[${inverse.join(", ")}]`,
			array: inverse,
			operation: "逆順列完了",
			variables: {
				originalPermutation: array,
				inversePermutation: inverse,
				mappingString: mapping
					.map((m) => `${m.original}→pos${m.position}`)
					.join(", "),
				verification: "perm[inverse[i]] = i および inverse[perm[i]] = i",
			},
		});

		return {
			inverse: inverse,
			mapping: mapping,
		};
	}

	/**
	 * 順列の合成
	 */
	private performPermutationCompose(array: number[]): {
		composition: number[];
		operations: Array<{
			step: number;
			input: number;
			intermediate: number;
			output: number;
		}>;
	} {
		// 自己合成として実装（perm(perm(i))）
		const composition = new Array(array.length);
		const operations: Array<{
			step: number;
			input: number;
			intermediate: number;
			output: number;
		}> = [];

		this.steps.push({
			id: this.stepId++,
			description: `順列合成：順列[${array.join(", ")}]の自己合成 perm(perm(i))を計算`,
			array: [...array],
			operation: "順列合成開始",
			variables: {
				originalPermutation: array,
				operation: "perm ∘ perm",
			},
		});

		for (let i = 0; i < array.length; i++) {
			const intermediate = array[i];
			const final = array[intermediate];
			composition[i] = final;

			operations.push({
				step: i,
				input: i,
				intermediate: intermediate,
				output: final,
			});

			this.steps.push({
				id: this.stepId++,
				description: `composition[${i}] = perm[perm[${i}]] = perm[${intermediate}] = ${final}`,
				array: [...array],
				highlight: [i, intermediate],
				operation: "合成計算",
				variables: {
					index: i,
					firstApplication: intermediate,
					secondApplication: final,
					compositionStep: `${i} → ${intermediate} → ${final}`,
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: `順列合成完了：[${composition.join(", ")}]`,
			array: composition,
			operation: "順列合成完了",
			variables: {
				originalPermutation: array,
				compositionResult: composition,
				operationsString: operations
					.map((op) => `${op.input}→${op.intermediate}→${op.output}`)
					.join(", "),
			},
		});

		return {
			composition: composition,
			operations: operations,
		};
	}

	/**
	 * 内部用のnext_permutation（ステップ記録なし）
	 */
	private performNextPermutationInternal(array: number[]): {
		hasNext: boolean;
	} {
		const n = array.length;
		let i = n - 2;

		while (i >= 0 && array[i] >= array[i + 1]) {
			i--;
		}

		if (i < 0) {
			return { hasNext: false };
		}

		let j = n - 1;
		while (array[j] <= array[i]) {
			j--;
		}

		// 交換
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;

		// 反転
		let left = i + 1;
		let right = n - 1;
		while (left < right) {
			const reverseTemp = array[left];
			array[left] = array[right];
			array[right] = reverseTemp;
			left++;
			right--;
		}

		return { hasNext: true };
	}

	/**
	 * 辞書順比較
	 */
	private lexicographicCompare(
		a: number[],
		b: number[],
	): { result: string; position: number } {
		for (let i = 0; i < Math.min(a.length, b.length); i++) {
			if (a[i] < b[i]) {
				return { result: "<", position: i };
			}
			if (a[i] > b[i]) {
				return { result: ">", position: i };
			}
		}
		return { result: "=", position: -1 };
	}

	/**
	 * 配列の等価性チェック
	 */
	private arraysEqual(a: number[], b: number[]): boolean {
		return a.length === b.length && a.every((val, i) => val === b[i]);
	}

	/**
	 * 階乗計算
	 */
	private factorial(n: number): number {
		if (n <= 1) return 1;
		let result = 1;
		for (let i = 2; i <= n; i++) {
			result *= i;
		}
		return result;
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(operation: PermutationOperationType): string {
		const descriptions = {
			nextPermutation: "次の順列生成",
			allPermutations: "全順列の列挙",
			permutationRank: "順列のランク計算",
			kthPermutation: "k番目の順列生成",
			permutationCycle: "順列の周期性",
			lexicographic: "辞書順比較",
			permutationInverse: "逆順列計算",
			permutationCompose: "順列の合成",
		};
		return descriptions[operation] || "順列操作";
	}

	/**
	 * 技法の説明を取得
	 */
	private getTechniqueDescription(operation: PermutationOperationType): string {
		const techniques = {
			nextPermutation: "標準的なnext_permutationアルゴリズム",
			allPermutations: "辞書順での系統的順列生成",
			permutationRank: "階乗進法による位置計算",
			kthPermutation: "直接的な順列構築",
			permutationCycle: "順列群の周期性の研究",
			lexicographic: "辞書順での順列比較",
			permutationInverse: "逆写像による順列変換",
			permutationCompose: "順列の関数合成",
		};
		return techniques[operation] || "順列技法";
	}

	/**
	 * 効率性に関する注記を取得
	 */
	private getEfficiencyNote(operation: PermutationOperationType): string {
		const notes = {
			nextPermutation: "平均O(1)、最悪O(n)で次順列を生成",
			allPermutations: "全n!順列をO(n!)時間で系統的生成",
			permutationRank: "O(n²)で順列の辞書順位置を計算",
			kthPermutation: "O(n²)で指定位置の順列を直接構築",
			permutationCycle: "群論的性質の実証",
			lexicographic: "O(n)での効率的順列比較",
			permutationInverse: "O(n)での逆順列構築",
			permutationCompose: "O(n)での順列合成",
		};
		return notes[operation] || "効率的な順列処理";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(operation: PermutationOperationType): string {
		const complexities = {
			nextPermutation: "O(n)",
			allPermutations: "O(n!)",
			permutationRank: "O(n²)",
			kthPermutation: "O(n²)",
			permutationCycle: "O(k×n)", // k: 周期長
			lexicographic: "O(n)",
			permutationInverse: "O(n)",
			permutationCompose: "O(n)",
		};
		return complexities[operation] || "O(n)";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "nextPermutation",
				array: [1, 2, 3, 4],
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
next_permutation（順列全列挙）は、辞書順で次の順列を効率的に生成する標準的なアルゴリズムです。C++のstd::next_permutationと同等の機能を提供し、全ての順列を系統的に列挙することができます。

🔄 **next_permutationアルゴリズムの原理**
- 辞書順で次に大きい順列を生成
- 4つのステップで効率的に実現
- 平均的にはO(1)時間での実行
- in-place操作によるメモリ効率

📊 **アルゴリズムの4ステップ**
1. **ピボット発見**: 右から最初の昇順位置を特定
2. **交換相手探索**: ピボットより大きい最小値を発見
3. **要素交換**: ピボットと交換相手を交換
4. **部分反転**: ピボット以降を昇順に並び替え

💡 **実装の核心概念**
- **辞書順**: 文字列の辞書順と同じ原理
- **最小変更**: 必要最小限の変更で次順列を生成
- **効率性**: 不要な計算を避ける巧妙な設計
- **完全性**: 全ての順列を漏れなく生成

🌟 **順列の重要な応用**
- **組み合わせ最適化**: 全解の系統的探索
- **暗号学**: 鍵空間の探索と分析
- **グラフ理論**: 頂点の順序づけ問題
- **スケジューリング**: タスクの順序最適化

🚀 **実世界での応用例**
- **経路最適化**: 巡回セールスマン問題の解法
- **リソース管理**: 処理順序の最適化
- **ゲーム開発**: 可能手順の列挙
- **データ分析**: 順序統計と順序検定

⚡ **パフォーマンス特性**
- 時間計算量: 平均O(1)、最悪O(n)
- 空間計算量: O(1) - in-place操作
- 全順列生成: O(n! × n)
- 実装の簡潔性と効率性の両立

🔍 **関連する重要概念**
- **順列のランク**: 辞書順での位置計算
- **k番目順列**: 直接的な順列構築
- **逆順列**: 順列の逆写像
- **順列の合成**: 関数としての順列操作

📈 **学習価値と応用範囲**
- **アルゴリズム設計**: 効率的な状態遷移の設計
- **数学的理解**: 順列群と組み合わせ論の実践
- **最適化手法**: 全探索の系統的アプローチ
- **計算複雑性**: 時間とメモリのトレードオフ

🎯 **実装のポイント**
- 境界条件の適切な処理
- オーバーフローの回避
- インデックス操作の正確性
- 最適化可能な部分の特定

next_permutationは、「効率的な順列生成」の標準的手法を学べる重要なアルゴリズムです。数学的な美しさと実用的な効率性を兼ね備えた、組み合わせ論とアルゴリズム設計の傑作です。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: PermutationOperationType;
		array?: number[];
		k?: number;
		maxPermutations?: number;
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "nextPermutation",
				array: [1, 2, 3],
				description: "[1,2,3]の次の辞書順順列を生成",
				expectedResult: { hasNext: true, nextPermutation: [1, 3, 2] },
			},
			{
				operation: "allPermutations",
				array: [1, 2, 3],
				maxPermutations: 6,
				description: "[1,2,3]の全順列を辞書順で列挙",
				expectedResult: [
					[1, 2, 3],
					[1, 3, 2],
					[2, 1, 3],
					[2, 3, 1],
					[3, 1, 2],
					[3, 2, 1],
				],
			},
			{
				operation: "kthPermutation",
				array: [1, 2, 3, 4],
				k: 8,
				description: "[1,2,3,4]の8番目(0-indexed)の順列を生成",
				expectedResult: { kthPermutation: [2, 3, 1, 4] },
			},
			{
				operation: "permutationRank",
				array: [2, 1, 4, 3],
				description: "順列[2,1,4,3]の辞書順での位置を計算",
				expectedResult: { rank: 6 },
			},
			{
				operation: "lexicographic",
				array: [1, 2, 3],
				description: "順列の辞書順比較をデモンストレーション",
				expectedResult: "辞書順比較結果",
			},
		];
	}
}
