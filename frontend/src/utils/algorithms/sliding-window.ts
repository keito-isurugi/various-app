/**
 * src/utils/algorithms/sliding-window.ts
 *
 * スライディングウィンドウ（尺取り法）アルゴリズムの実装
 * 配列の部分列を効率的に探索する重要な技法
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * スライディングウィンドウ操作の種類
 */
type SlidingWindowOperationType =
	| "fixedSize" // 固定サイズのウィンドウ
	| "variableSize" // 可変サイズのウィンドウ
	| "maxSum" // 最大部分配列和
	| "minSum" // 最小部分配列和
	| "exactSum" // 指定された和の部分配列
	| "longestSubstring" // 最長部分文字列
	| "minWindow" // 最小ウィンドウ
	| "allWindows"; // 全ウィンドウの表示

/**
 * スライディングウィンドウアルゴリズムクラス
 *
 * 配列やリストの連続する部分列を効率的に処理する技法
 * 二重ループO(n²)をO(n)に改善する重要なアルゴリズム
 * 時間計算量: O(n)
 * 空間計算量: O(1)
 */
export class SlidingWindowAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "sliding-window",
		name: "スライディングウィンドウ（尺取り法）",
		description:
			"配列の連続する部分列を効率的に処理。ウィンドウをスライドさせてO(n)時間で最適解を発見",
		category: "other",
		timeComplexity: {
			best: "O(n)", // 最適な場合
			average: "O(n)", // 平均的な場合
			worst: "O(n)", // 最悪の場合
		},
		difficulty: 3, // 中級（概念理解と実装技術が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private originalArray: number[] = [];

	/**
	 * スライディングウィンドウ操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as SlidingWindowOperationType;
		const array = input.parameters?.array as number[] | undefined;
		const windowSize = input.parameters?.windowSize as number | undefined;
		const targetSum = input.parameters?.targetSum as number | undefined;
		const targetString = input.parameters?.targetString as string | undefined;
		const text = input.parameters?.text as string | undefined;

		// 配列の設定
		if (array) {
			this.originalArray = [...array];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `スライディングウィンドウ操作開始：${this.getOperationDescription(operation)}を実行`,
			array: [...this.originalArray],
			operation: "初期化",
			variables: {
				operation: operation,
				arraySize: this.originalArray.length,
				windowSize: windowSize || "可変",
				technique: this.getTechniqueDescription(operation),
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "fixedSize": {
				if (array && windowSize !== undefined) {
					result = this.performFixedSizeWindow(array, windowSize);
				} else {
					throw new Error(
						"固定サイズウィンドウには配列とウィンドウサイズが必要です",
					);
				}
				break;
			}

			case "variableSize": {
				if (array && targetSum !== undefined) {
					result = this.performVariableSizeWindow(array, targetSum);
				} else {
					throw new Error("可変サイズウィンドウには配列と目標値が必要です");
				}
				break;
			}

			case "maxSum": {
				if (array && windowSize !== undefined) {
					result = this.performMaxSumWindow(array, windowSize);
				} else {
					throw new Error(
						"最大和ウィンドウには配列とウィンドウサイズが必要です",
					);
				}
				break;
			}

			case "minSum": {
				if (array && windowSize !== undefined) {
					result = this.performMinSumWindow(array, windowSize);
				} else {
					throw new Error(
						"最小和ウィンドウには配列とウィンドウサイズが必要です",
					);
				}
				break;
			}

			case "exactSum": {
				if (array && targetSum !== undefined) {
					result = this.performExactSumWindow(array, targetSum);
				} else {
					throw new Error("指定和ウィンドウには配列と目標和が必要です");
				}
				break;
			}

			case "longestSubstring": {
				if (text) {
					result = this.performLongestSubstring(text);
				} else {
					throw new Error("最長部分文字列には文字列が必要です");
				}
				break;
			}

			case "minWindow": {
				if (text && targetString) {
					result = this.performMinWindow(text, targetString);
				} else {
					throw new Error("最小ウィンドウには文字列と対象文字列が必要です");
				}
				break;
			}

			case "allWindows": {
				if (array && windowSize !== undefined) {
					result = this.performAllWindows(array, windowSize);
				} else {
					throw new Error(
						"全ウィンドウ表示には配列とウィンドウサイズが必要です",
					);
				}
				break;
			}

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` スライディングウィンドウ操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
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
	 * 固定サイズウィンドウの実行
	 */
	private performFixedSizeWindow(
		array: number[],
		windowSize: number,
	): number[] {
		if (windowSize > array.length) {
			throw new Error("ウィンドウサイズが配列長を超えています");
		}

		const results: number[] = [];
		let currentSum = 0;

		this.steps.push({
			id: this.stepId++,
			description: `固定サイズ${windowSize}のスライディングウィンドウで各ウィンドウの和を計算`,
			array: [...array],
			operation: "固定ウィンドウ開始",
			variables: {
				windowSize: windowSize,
				maxWindows: array.length - windowSize + 1,
			},
		});

		// 最初のウィンドウの和を計算
		for (let i = 0; i < windowSize; i++) {
			currentSum += array[i];
		}

		results.push(currentSum);

		this.steps.push({
			id: this.stepId++,
			description: `初期ウィンドウ[0-${windowSize - 1}]の和: ${currentSum}`,
			array: [...array],
			highlight: Array.from({ length: windowSize }, (_, i) => i),
			operation: "初期ウィンドウ計算",
			variables: {
				windowStart: 0,
				windowEnd: windowSize - 1,
				currentSum: currentSum,
				windowElements: array.slice(0, windowSize),
			},
		});

		// ウィンドウをスライドしながら計算
		for (let i = windowSize; i < array.length; i++) {
			const removedElement = array[i - windowSize];
			const addedElement = array[i];
			currentSum = currentSum - removedElement + addedElement;
			results.push(currentSum);

			this.steps.push({
				id: this.stepId++,
				description: `ウィンドウ[${i - windowSize + 1}-${i}]: -${removedElement} +${addedElement} = ${currentSum}`,
				array: [...array],
				highlight: Array.from(
					{ length: windowSize },
					(_, j) => i - windowSize + 1 + j,
				),
				operation: "ウィンドウスライド",
				variables: {
					windowStart: i - windowSize + 1,
					windowEnd: i,
					removedElement: removedElement,
					addedElement: addedElement,
					currentSum: currentSum,
					windowElements: array.slice(i - windowSize + 1, i + 1),
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: "固定サイズウィンドウ処理完了",
			array: [...array],
			operation: "固定ウィンドウ完了",
			variables: {
				allResults: results,
				totalWindows: results.length,
				efficiency: "O(n)で全ウィンドウの和を計算",
			},
		});

		return results;
	}

	/**
	 * 可変サイズウィンドウの実行（尺取り法）
	 */
	private performVariableSizeWindow(
		array: number[],
		targetSum: number,
	): {
		found: boolean;
		start?: number;
		end?: number;
		sum?: number;
	} {
		let left = 0;
		let right = 0;
		let currentSum = 0;

		this.steps.push({
			id: this.stepId++,
			description: `尺取り法で和が${targetSum}になる部分配列を探索`,
			array: [...array],
			operation: "尺取り法開始",
			variables: {
				targetSum: targetSum,
				technique: "左右のポインタを調整してウィンドウサイズを変更",
			},
		});

		while (right < array.length) {
			// 右端を拡張
			currentSum += array[right];

			this.steps.push({
				id: this.stepId++,
				description: `右端を拡張: arr[${right}]=${array[right]}を追加, sum=${currentSum}`,
				array: [...array],
				highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
				operation: "右端拡張",
				variables: {
					left: left,
					right: right,
					currentSum: currentSum,
					addedElement: array[right],
					windowSize: right - left + 1,
				},
			});

			// 目標和に到達した場合
			if (currentSum === targetSum) {
				this.steps.push({
					id: this.stepId++,
					description: `【ポイント】目標和${targetSum}を発見！区間[${left}, ${right}]`,
					array: [...array],
					highlight: Array.from(
						{ length: right - left + 1 },
						(_, i) => left + i,
					),
					operation: "目標発見",
					variables: {
						found: true,
						start: left,
						end: right,
						sum: currentSum,
						solution: array.slice(left, right + 1),
					},
				});

				return { found: true, start: left, end: right, sum: currentSum };
			}

			// 和が目標を超えた場合、左端を縮小
			while (currentSum > targetSum && left <= right) {
				currentSum -= array[left];

				this.steps.push({
					id: this.stepId++,
					description: `和が大きすぎるため左端を縮小: arr[${left}]=${array[left]}を削除, sum=${currentSum}`,
					array: [...array],
					highlight:
						right >= left + 1
							? Array.from({ length: right - left }, (_, i) => left + 1 + i)
							: [],
					operation: "左端縮小",
					variables: {
						left: left + 1,
						right: right,
						currentSum: currentSum,
						removedElement: array[left],
						windowSize: Math.max(0, right - left),
					},
				});

				left++;

				// 目標和に到達した場合
				if (currentSum === targetSum && left <= right) {
					this.steps.push({
						id: this.stepId++,
						description: `【ポイント】目標和${targetSum}を発見！区間[${left}, ${right}]`,
						array: [...array],
						highlight: Array.from(
							{ length: right - left + 1 },
							(_, i) => left + i,
						),
						operation: "目標発見",
						variables: {
							found: true,
							start: left,
							end: right,
							sum: currentSum,
							solution: array.slice(left, right + 1),
						},
					});

					return { found: true, start: left, end: right, sum: currentSum };
				}
			}

			right++;
		}

		this.steps.push({
			id: this.stepId++,
			description: `探索完了：和が${targetSum}になる部分配列は見つかりませんでした`,
			array: [...array],
			operation: "探索終了",
			variables: {
				found: false,
				searchCompleted: true,
			},
		});

		return { found: false };
	}

	/**
	 * 最大和ウィンドウの実行
	 */
	private performMaxSumWindow(
		array: number[],
		windowSize: number,
	): {
		maxSum: number;
		startIndex: number;
		endIndex: number;
		window: number[];
	} {
		let maxSum = Number.NEGATIVE_INFINITY;
		let maxStartIndex = 0;
		let currentSum = 0;

		// 最初のウィンドウの和を計算
		for (let i = 0; i < windowSize; i++) {
			currentSum += array[i];
		}
		maxSum = currentSum;

		this.steps.push({
			id: this.stepId++,
			description: `最大和ウィンドウ探索：サイズ${windowSize}で最大の和を持つウィンドウを発見`,
			array: [...array],
			highlight: Array.from({ length: windowSize }, (_, i) => i),
			operation: "最大和探索開始",
			variables: {
				windowSize: windowSize,
				currentSum: currentSum,
				maxSum: maxSum,
				currentBestStart: maxStartIndex,
			},
		});

		// ウィンドウをスライドして最大和を探索
		for (let i = windowSize; i < array.length; i++) {
			currentSum = currentSum - array[i - windowSize] + array[i];

			this.steps.push({
				id: this.stepId++,
				description: `ウィンドウ[${i - windowSize + 1}-${i}]: sum=${currentSum} ${currentSum > maxSum ? "(新最大値!)" : ""}`,
				array: [...array],
				highlight: Array.from(
					{ length: windowSize },
					(_, j) => i - windowSize + 1 + j,
				),
				operation: "最大和更新チェック",
				variables: {
					windowStart: i - windowSize + 1,
					windowEnd: i,
					currentSum: currentSum,
					maxSum: maxSum,
					isNewMax: currentSum > maxSum,
				},
			});

			if (currentSum > maxSum) {
				maxSum = currentSum;
				maxStartIndex = i - windowSize + 1;

				this.steps.push({
					id: this.stepId++,
					description: ` 新しい最大和を発見！sum=${maxSum}, 区間[${maxStartIndex}, ${i}]`,
					array: [...array],
					highlight: Array.from(
						{ length: windowSize },
						(_, j) => maxStartIndex + j,
					),
					operation: "最大値更新",
					variables: {
						newMaxSum: maxSum,
						newMaxStart: maxStartIndex,
						newMaxEnd: i,
						maxWindow: array.slice(maxStartIndex, i + 1),
					},
				});
			}
		}

		const result = {
			maxSum: maxSum,
			startIndex: maxStartIndex,
			endIndex: maxStartIndex + windowSize - 1,
			window: array.slice(maxStartIndex, maxStartIndex + windowSize),
		};

		this.steps.push({
			id: this.stepId++,
			description: "最大和ウィンドウ探索完了",
			array: [...array],
			highlight: Array.from(
				{ length: windowSize },
				(_, i) => maxStartIndex + i,
			),
			operation: "最大和探索完了",
			variables: {
				finalResultString: `最大和=${result.maxSum}, 区間[${result.startIndex}, ${result.endIndex}], ウィンドウ=[${result.window.join(",")}]`,
				efficiency: "O(n)で最大和ウィンドウを発見",
			},
		});

		return result;
	}

	/**
	 * 最小和ウィンドウの実行
	 */
	private performMinSumWindow(
		array: number[],
		windowSize: number,
	): {
		minSum: number;
		startIndex: number;
		endIndex: number;
		window: number[];
	} {
		let minSum = Number.POSITIVE_INFINITY;
		let minStartIndex = 0;
		let currentSum = 0;

		// 最初のウィンドウの和を計算
		for (let i = 0; i < windowSize; i++) {
			currentSum += array[i];
		}
		minSum = currentSum;

		this.steps.push({
			id: this.stepId++,
			description: `最小和ウィンドウ探索：サイズ${windowSize}で最小の和を持つウィンドウを発見`,
			array: [...array],
			highlight: Array.from({ length: windowSize }, (_, i) => i),
			operation: "最小和探索開始",
			variables: {
				windowSize: windowSize,
				currentSum: currentSum,
				minSum: minSum,
				currentBestStart: minStartIndex,
			},
		});

		// ウィンドウをスライドして最小和を探索
		for (let i = windowSize; i < array.length; i++) {
			currentSum = currentSum - array[i - windowSize] + array[i];

			this.steps.push({
				id: this.stepId++,
				description: `ウィンドウ[${i - windowSize + 1}-${i}]: sum=${currentSum} ${currentSum < minSum ? "(新最小値!)" : ""}`,
				array: [...array],
				highlight: Array.from(
					{ length: windowSize },
					(_, j) => i - windowSize + 1 + j,
				),
				operation: "最小和更新チェック",
				variables: {
					windowStart: i - windowSize + 1,
					windowEnd: i,
					currentSum: currentSum,
					minSum: minSum,
					isNewMin: currentSum < minSum,
				},
			});

			if (currentSum < minSum) {
				minSum = currentSum;
				minStartIndex = i - windowSize + 1;

				this.steps.push({
					id: this.stepId++,
					description: ` 新しい最小和を発見！sum=${minSum}, 区間[${minStartIndex}, ${i}]`,
					array: [...array],
					highlight: Array.from(
						{ length: windowSize },
						(_, j) => minStartIndex + j,
					),
					operation: "最小値更新",
					variables: {
						newMinSum: minSum,
						newMinStart: minStartIndex,
						newMinEnd: i,
						minWindow: array.slice(minStartIndex, i + 1),
					},
				});
			}
		}

		const result = {
			minSum: minSum,
			startIndex: minStartIndex,
			endIndex: minStartIndex + windowSize - 1,
			window: array.slice(minStartIndex, minStartIndex + windowSize),
		};

		this.steps.push({
			id: this.stepId++,
			description: "最小和ウィンドウ探索完了",
			array: [...array],
			highlight: Array.from(
				{ length: windowSize },
				(_, i) => minStartIndex + i,
			),
			operation: "最小和探索完了",
			variables: {
				finalResultString: `最小和=${result.minSum}, 区間[${result.startIndex}, ${result.endIndex}], ウィンドウ=[${result.window.join(",")}]`,
				efficiency: "O(n)で最小和ウィンドウを発見",
			},
		});

		return result;
	}

	/**
	 * 指定和ウィンドウの実行
	 */
	private performExactSumWindow(
		array: number[],
		targetSum: number,
	): {
		found: boolean;
		windows: Array<{ start: number; end: number; sum: number }>;
	} {
		const foundWindows: Array<{ start: number; end: number; sum: number }> = [];
		let left = 0;
		let currentSum = 0;

		this.steps.push({
			id: this.stepId++,
			description: `指定和${targetSum}の全ての部分配列を探索`,
			array: [...array],
			operation: "指定和探索開始",
			variables: {
				targetSum: targetSum,
				technique: "尺取り法で全ての解を発見",
			},
		});

		for (let right = 0; right < array.length; right++) {
			currentSum += array[right];

			this.steps.push({
				id: this.stepId++,
				description: `右端拡張: arr[${right}]=${array[right]}を追加, sum=${currentSum}`,
				array: [...array],
				highlight: Array.from({ length: right - left + 1 }, (_, i) => left + i),
				operation: "範囲拡張",
				variables: {
					left: left,
					right: right,
					currentSum: currentSum,
					windowSize: right - left + 1,
				},
			});

			while (currentSum > targetSum && left <= right) {
				currentSum -= array[left];
				left++;

				this.steps.push({
					id: this.stepId++,
					description: `和が大きすぎるため左端縮小: 新sum=${currentSum}`,
					array: [...array],
					highlight:
						left <= right
							? Array.from({ length: right - left + 1 }, (_, i) => left + i)
							: [],
					operation: "範囲縮小",
					variables: {
						left: left,
						right: right,
						currentSum: currentSum,
						windowSize: Math.max(0, right - left + 1),
					},
				});
			}

			if (currentSum === targetSum) {
				foundWindows.push({ start: left, end: right, sum: currentSum });

				this.steps.push({
					id: this.stepId++,
					description: `【ポイント】指定和${targetSum}を発見！区間[${left}, ${right}] (解${foundWindows.length}個目)`,
					array: [...array],
					highlight: Array.from(
						{ length: right - left + 1 },
						(_, i) => left + i,
					),
					operation: "解発見",
					variables: {
						solutionIndex: foundWindows.length,
						start: left,
						end: right,
						sum: currentSum,
						window: array.slice(left, right + 1),
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `指定和探索完了：${foundWindows.length}個の解を発見`,
			array: [...array],
			operation: "指定和探索完了",
			variables: {
				totalSolutions: foundWindows.length,
				allSolutionsString: foundWindows
					.map((w) => `[${w.start},${w.end}]:${w.sum}`)
					.join(", "),
				efficiency: "O(n)で全ての解を発見",
			},
		});

		return {
			found: foundWindows.length > 0,
			windows: foundWindows,
		};
	}

	/**
	 * 最長部分文字列の実行
	 */
	private performLongestSubstring(text: string): {
		maxLength: number;
		startIndex: number;
		substring: string;
	} {
		const charSet = new Set<string>();
		let left = 0;
		let maxLength = 0;
		let maxStartIndex = 0;

		this.steps.push({
			id: this.stepId++,
			description: `文字列「${text}」で重複文字がない最長部分文字列を探索`,
			operation: "最長部分文字列開始",
			variables: {
				inputText: text,
				textLength: text.length,
				technique: "スライディングウィンドウでO(n)探索",
			},
		});

		for (let right = 0; right < text.length; right++) {
			const currentChar = text[right];

			// 重複文字が見つかるまで左端を移動
			while (charSet.has(currentChar)) {
				const leftChar = text[left];
				charSet.delete(leftChar);
				left++;

				this.steps.push({
					id: this.stepId++,
					description: `重複文字'${currentChar}'を除去：'${leftChar}'を削除, 左端=${left}`,
					operation: "重複除去",
					variables: {
						left: left,
						right: right,
						removedChar: leftChar,
						currentChar: currentChar,
						windowSize: right - left,
						currentWindow: text.slice(left, right),
					},
				});
			}

			charSet.add(currentChar);
			const currentLength = right - left + 1;

			this.steps.push({
				id: this.stepId++,
				description: `文字'${currentChar}'を追加：ウィンドウ「${text.slice(left, right + 1)}」長さ=${currentLength}`,
				operation: "文字追加",
				variables: {
					left: left,
					right: right,
					addedChar: currentChar,
					currentLength: currentLength,
					maxLength: maxLength,
					currentWindow: text.slice(left, right + 1),
					isNewMax: currentLength > maxLength,
				},
			});

			if (currentLength > maxLength) {
				maxLength = currentLength;
				maxStartIndex = left;

				this.steps.push({
					id: this.stepId++,
					description: ` 新最長部分文字列発見！「${text.slice(left, right + 1)}」長さ=${maxLength}`,
					operation: "最長更新",
					variables: {
						newMaxLength: maxLength,
						newMaxStart: maxStartIndex,
						newMaxEnd: right,
						maxSubstring: text.slice(maxStartIndex, right + 1),
					},
				});
			}
		}

		const result = {
			maxLength: maxLength,
			startIndex: maxStartIndex,
			substring: text.slice(maxStartIndex, maxStartIndex + maxLength),
		};

		this.steps.push({
			id: this.stepId++,
			description: "最長部分文字列探索完了",
			operation: "最長部分文字列完了",
			variables: {
				finalResultString: `長さ=${result.maxLength}, 開始=${result.startIndex}, 文字列="${result.substring}"`,
				efficiency: "O(n)で最長部分文字列を発見",
			},
		});

		return result;
	}

	/**
	 * 最小ウィンドウの実行
	 */
	private performMinWindow(
		text: string,
		target: string,
	): {
		found: boolean;
		minWindow?: string;
		startIndex?: number;
		length?: number;
	} {
		if (target.length === 0) return { found: false };

		// 目標文字の出現回数をカウント
		const targetCount = new Map<string, number>();
		for (const char of target) {
			targetCount.set(char, (targetCount.get(char) || 0) + 1);
		}

		const windowCount = new Map<string, number>();
		let left = 0;
		let right = 0;
		let formed = 0;
		const required = targetCount.size;
		let minLength = Number.POSITIVE_INFINITY;
		let minStartIndex = 0;

		this.steps.push({
			id: this.stepId++,
			description: `文字列「${text}」で「${target}」の全文字を含む最小ウィンドウを探索`,
			operation: "最小ウィンドウ開始",
			variables: {
				inputText: text,
				targetString: target,
				requiredCharsString: Array.from(targetCount.entries())
					.map(([char, count]) => `${char}:${count}`)
					.join(", "),
				required: required,
			},
		});

		while (right < text.length) {
			const rightChar = text[right];
			windowCount.set(rightChar, (windowCount.get(rightChar) || 0) + 1);

			if (
				targetCount.has(rightChar) &&
				windowCount.get(rightChar) === targetCount.get(rightChar)
			) {
				formed++;
			}

			this.steps.push({
				id: this.stepId++,
				description: `右端拡張：'${rightChar}'追加, formed=${formed}/${required}`,
				operation: "右端拡張",
				variables: {
					left: left,
					right: right,
					addedChar: rightChar,
					formed: formed,
					required: required,
					currentWindow: text.slice(left, right + 1),
					isValid: formed === required,
				},
			});

			// 全ての文字が含まれた場合、左端を縮小して最小ウィンドウを探索
			while (formed === required && left <= right) {
				const currentLength = right - left + 1;

				if (currentLength < minLength) {
					minLength = currentLength;
					minStartIndex = left;

					this.steps.push({
						id: this.stepId++,
						description: ` 新最小ウィンドウ発見！「${text.slice(left, right + 1)}」長さ=${currentLength}`,
						operation: "最小ウィンドウ更新",
						variables: {
							newMinLength: minLength,
							newMinStart: minStartIndex,
							newMinEnd: right,
							minWindow: text.slice(minStartIndex, right + 1),
						},
					});
				}

				const leftChar = text[left];
				const leftCharCount = windowCount.get(leftChar) ?? 0;
				windowCount.set(leftChar, leftCharCount - 1);

				if (
					targetCount.has(leftChar) &&
					(windowCount.get(leftChar) ?? 0) < (targetCount.get(leftChar) ?? 0)
				) {
					formed--;
				}

				this.steps.push({
					id: this.stepId++,
					description: `左端縮小：'${leftChar}'削除, formed=${formed}/${required}`,
					operation: "左端縮小",
					variables: {
						left: left + 1,
						right: right,
						removedChar: leftChar,
						formed: formed,
						required: required,
						currentWindow: text.slice(left + 1, right + 1),
						isValid: formed === required,
					},
				});

				left++;
			}

			right++;
		}

		const result =
			minLength === Number.POSITIVE_INFINITY
				? { found: false }
				: {
						found: true,
						minWindow: text.slice(minStartIndex, minStartIndex + minLength),
						startIndex: minStartIndex,
						length: minLength,
					};

		this.steps.push({
			id: this.stepId++,
			description: "最小ウィンドウ探索完了",
			operation: "最小ウィンドウ完了",
			variables: {
				finalResultString: result.found
					? `見つかった: "${result.minWindow}" (開始=${result.startIndex}, 長さ=${result.length})`
					: "見つからなかった",
				efficiency: "O(n)で最小ウィンドウを発見",
			},
		});

		return result;
	}

	/**
	 * 全ウィンドウの表示
	 */
	private performAllWindows(array: number[], windowSize: number): number[][] {
		const allWindows: number[][] = [];

		this.steps.push({
			id: this.stepId++,
			description: `サイズ${windowSize}の全ウィンドウを表示`,
			array: [...array],
			operation: "全ウィンドウ表示開始",
			variables: {
				windowSize: windowSize,
				totalWindows: array.length - windowSize + 1,
			},
		});

		for (let i = 0; i <= array.length - windowSize; i++) {
			const window = array.slice(i, i + windowSize);
			allWindows.push(window);

			this.steps.push({
				id: this.stepId++,
				description: `ウィンドウ${i + 1}: [${window.join(", ")}]`,
				array: [...array],
				highlight: Array.from({ length: windowSize }, (_, j) => i + j),
				operation: "ウィンドウ表示",
				variables: {
					windowIndex: i + 1,
					windowStart: i,
					windowEnd: i + windowSize - 1,
					window: window,
					windowSum: window.reduce((sum, val) => sum + val, 0),
				},
			});
		}

		this.steps.push({
			id: this.stepId++,
			description: "全ウィンドウ表示完了",
			array: [...array],
			operation: "全ウィンドウ表示完了",
			variables: {
				allWindowsString: allWindows
					.map((window) => `[${window.join(",")}]`)
					.join(", "),
				totalCount: allWindows.length,
			},
		});

		return allWindows;
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(
		operation: SlidingWindowOperationType,
	): string {
		const descriptions = {
			fixedSize: "固定サイズウィンドウ",
			variableSize: "可変サイズウィンドウ（尺取り法）",
			maxSum: "最大和ウィンドウ探索",
			minSum: "最小和ウィンドウ探索",
			exactSum: "指定和ウィンドウ探索",
			longestSubstring: "最長部分文字列探索",
			minWindow: "最小ウィンドウ探索",
			allWindows: "全ウィンドウ表示",
		};
		return descriptions[operation] || "ウィンドウ操作";
	}

	/**
	 * 技法の説明を取得
	 */
	private getTechniqueDescription(
		operation: SlidingWindowOperationType,
	): string {
		const techniques = {
			fixedSize: "固定サイズウィンドウのスライド処理",
			variableSize: "左右ポインタによる動的ウィンドウ調整",
			maxSum: "スライドによる効率的な最大値探索",
			minSum: "スライドによる効率的な最小値探索",
			exactSum: "尺取り法による全解探索",
			longestSubstring: "重複除去による最長部分文字列発見",
			minWindow: "動的ウィンドウによる最小範囲発見",
			allWindows: "全ウィンドウの系統的な表示",
		};
		return techniques[operation] || "ウィンドウ技法";
	}

	/**
	 * 効率性に関する注記を取得
	 */
	private getEfficiencyNote(operation: SlidingWindowOperationType): string {
		const notes = {
			fixedSize: "ナイーブ法O(n²) → スライディングウィンドウO(n)",
			variableSize: "二重ループO(n²) → 尺取り法O(n)",
			maxSum: "全パターン評価O(n²) → 効率的探索O(n)",
			minSum: "全パターン評価O(n²) → 効率的探索O(n)",
			exactSum: "全組み合わせO(n²) → 尺取り法O(n)",
			longestSubstring: "全部分文字列O(n³) → スライディングウィンドウO(n)",
			minWindow: "全部分文字列O(n³) → 動的ウィンドウO(n)",
			allWindows: "効率的なウィンドウ列挙",
		};
		return notes[operation] || "効率的なウィンドウ処理";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(
		operation: SlidingWindowOperationType,
	): string {
		const complexities = {
			fixedSize: "O(n)",
			variableSize: "O(n)",
			maxSum: "O(n)",
			minSum: "O(n)",
			exactSum: "O(n)",
			longestSubstring: "O(n)",
			minWindow: "O(n)",
			allWindows: "O(n)",
		};
		return complexities[operation] || "O(n)";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "fixedSize",
				array: [1, 3, 2, 6, -1, 4, 1, 8, 2],
				windowSize: 3,
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
スライディングウィンドウ（Sliding Window）と尺取り法（Two Pointers）は、配列やリストの連続する部分列を効率的に処理する重要なアルゴリズム技法です。二重ループのO(n²)処理をO(n)に改善できる強力な手法です。

🪟 **スライディングウィンドウの基本概念**
- 固定サイズまたは可変サイズのウィンドウを配列上でスライド
- ウィンドウ内の情報を効率的に更新
- 要素の追加・削除による状態管理
- 累積値の効率的な計算

【解析】**主要なパターンと計算量**
- 固定ウィンドウ: O(n) - 各要素を1回ずつ処理
- 可変ウィンドウ（尺取り法）: O(n) - 左右ポインタの線形移動
- 最大/最小値探索: O(n) - スライドによる効率的比較
- 部分文字列探索: O(n) - 文字集合の動的管理

【ポイント】**尺取り法（Two Pointers）**
- 左右2つのポインタで範囲を動的調整
- 条件に応じて範囲を拡張または縮小
- 目標値の探索や条件満足問題に有効
- メモリ効率も優秀（O(1)空間計算量）

【ヒント】**実装のポイント**
- ウィンドウの初期化：最初のウィンドウを別途計算
- 状態の更新：要素の追加・削除による差分更新
- 境界条件：配列の開始・終了での適切な処理
- 重複管理：文字列問題でのセットやマップ活用

 **代表的な応用パターン**
- **固定ウィンドウ**: 移動平均、固定期間の最大/最小値
- **可変ウィンドウ**: 指定和の部分配列、条件を満たす最長/最短部分列
- **文字列問題**: 重複なし最長部分文字列、全文字を含む最小ウィンドウ
- **最適化問題**: 制約下での最適解探索

【応用】**実世界での応用例**
- **データ解析**: 時系列データの移動平均、トレンド分析
- **ネットワーク**: パケット解析、フロー制御
- **ゲーム開発**: 連続コンボ判定、範囲攻撃判定
- **文字列処理**: テキスト解析、パターンマッチング

【計算量】**パフォーマンス特性**
- 時間計算量: O(n) - 各要素を定数回処理
- 空間計算量: O(1) または O(k) - ウィンドウサイズに依存
- 実装が比較的シンプル
- デバッグしやすい線形処理

【詳細】**他の手法との比較**
- vs ナイーブ法: O(n²) → O(n)の劇的改善
- vs 動的計画法: より少ないメモリで同等の効果
- vs 分割統治: 実装が簡単で理解しやすい

スライディングウィンドウと尺取り法は、「効率的な範囲処理」の基本パターンを学べる重要な技法です。競技プログラミングから実用アプリケーションまで幅広く活用される実践的なアルゴリズムです。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: SlidingWindowOperationType;
		array?: number[];
		windowSize?: number;
		targetSum?: number;
		text?: string;
		targetString?: string;
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "fixedSize",
				array: [1, 3, 2, 6, -1, 4, 1, 8, 2],
				windowSize: 3,
				description: "固定サイズ3のウィンドウで各和を計算",
				expectedResult: [6, 11, 7, 9, 4, 13, 11],
			},
			{
				operation: "maxSum",
				array: [1, 3, 2, 6, -1, 4, 1, 8, 2],
				windowSize: 3,
				description: "サイズ3のウィンドウで最大和を探索",
				expectedResult: {
					maxSum: 13,
					startIndex: 5,
					endIndex: 7,
					window: [4, 1, 8],
				},
			},
			{
				operation: "variableSize",
				array: [1, 4, 2, 3, 5],
				targetSum: 7,
				description: "和が7になる部分配列を尺取り法で探索",
				expectedResult: { found: true, start: 1, end: 2, sum: 7 },
			},
			{
				operation: "longestSubstring",
				text: "abcabcbb",
				description: "重複なしの最長部分文字列を発見",
				expectedResult: { maxLength: 3, startIndex: 0, substring: "abc" },
			},
			{
				operation: "exactSum",
				array: [1, 2, 3, 4, 5],
				targetSum: 5,
				description: "和が5の全部分配列を発見",
				expectedResult: {
					found: true,
					windows: [
						{ start: 1, end: 2, sum: 5 },
						{ start: 4, end: 4, sum: 5 },
					],
				},
			},
			{
				operation: "minWindow",
				text: "ADOBECODEBANC",
				targetString: "ABC",
				description: "文字列ABCを全て含む最小ウィンドウを発見",
				expectedResult: {
					found: true,
					minWindow: "BANC",
					startIndex: 9,
					length: 4,
				},
			},
		];
	}
}
