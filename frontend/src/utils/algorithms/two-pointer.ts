/**
 * src/utils/algorithms/two-pointer.ts
 *
 * 2 pointer法アルゴリズムの実装
 * 配列の探索・操作を効率化する重要な技法
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 2 pointer法操作の種類
 */
type TwoPointerOperationType =
	| "twoSum" // 二つの数の和
	| "threeSum" // 三つの数の和
	| "oppositeSum" // 対向ポインタでの和探索
	| "removeDuplicates" // 重複除去
	| "reverseArray" // 配列の反転
	| "isPalindrome" // 回文判定
	| "containerWater" // 最大の水の容量
	| "sortedSquares" // ソート済み配列の二乗
	| "mergeSorted"; // ソート済み配列のマージ

/**
 * 2 pointer法アルゴリズムクラス
 *
 * 配列やリストに対して2つのポインタを使用して効率的に操作
 * ソートされた配列での探索や配列の操作を高速化
 * 時間計算量: O(n) または O(n log n)
 * 空間計算量: O(1)
 */
export class TwoPointerAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "two-pointer",
		name: "2 pointer法",
		description:
			"2つのポインタを使って配列を効率的に処理。ソート済み配列での探索や操作をO(n)で実現",
		category: "other",
		timeComplexity: {
			best: "O(n)", // 最適な場合
			average: "O(n)", // 平均的な場合
			worst: "O(n²)", // 最悪の場合（3Sum等）
		},
		difficulty: 3, // 中級（パターン理解と応用力が必要）
		spaceComplexity: "O(1)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private originalArray: number[] = [];

	/**
	 * 2 pointer法操作を実行
	 * @param input 入力データと操作指定
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 初期化
		this.steps = [];
		this.stepId = 0;

		// 入力パラメータの取得
		const operation = input.parameters?.operation as TwoPointerOperationType;
		const array = input.parameters?.array as number[] | undefined;
		const target = input.parameters?.target as number | undefined;
		const text = input.parameters?.text as string | undefined;
		const array1 = input.parameters?.array1 as number[] | undefined;
		const array2 = input.parameters?.array2 as number[] | undefined;

		// 配列の設定
		if (array) {
			this.originalArray = [...array];
		}

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `2 pointer法操作開始：${this.getOperationDescription(operation)}を実行`,
			array: [...this.originalArray],
			operation: "初期化",
			variables: {
				operation: operation,
				arraySize: this.originalArray.length,
				technique: this.getTechniqueDescription(operation),
			},
		});

		let result: any;

		// 操作の実行
		switch (operation) {
			case "twoSum": {
				if (array && target !== undefined) {
					result = this.performTwoSum(array, target);
				} else {
					throw new Error("Two Sumには配列と目標値が必要です");
				}
				break;
			}

			case "threeSum": {
				if (array && target !== undefined) {
					result = this.performThreeSum(array, target);
				} else {
					throw new Error("Three Sumには配列と目標値が必要です");
				}
				break;
			}

			case "oppositeSum": {
				if (array && target !== undefined) {
					result = this.performOppositeSum(array, target);
				} else {
					throw new Error("対向ポインタ探索には配列と目標値が必要です");
				}
				break;
			}

			case "removeDuplicates": {
				if (array) {
					result = this.performRemoveDuplicates(array);
				} else {
					throw new Error("重複除去には配列が必要です");
				}
				break;
			}

			case "reverseArray": {
				if (array) {
					result = this.performReverseArray(array);
				} else {
					throw new Error("配列反転には配列が必要です");
				}
				break;
			}

			case "isPalindrome": {
				if (text) {
					result = this.performIsPalindrome(text);
				} else {
					throw new Error("回文判定には文字列が必要です");
				}
				break;
			}

			case "containerWater": {
				if (array) {
					result = this.performContainerWater(array);
				} else {
					throw new Error("最大水容量計算には配列が必要です");
				}
				break;
			}

			case "sortedSquares": {
				if (array) {
					result = this.performSortedSquares(array);
				} else {
					throw new Error("ソート済み二乗には配列が必要です");
				}
				break;
			}

			case "mergeSorted": {
				if (array1 && array2) {
					result = this.performMergeSorted(array1, array2);
				} else {
					throw new Error("ソート済み配列マージには2つの配列が必要です");
				}
				break;
			}

			default:
				throw new Error(`未対応の操作: ${operation}`);
		}

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 2 pointer法操作完了！${this.getOperationDescription(operation)}が正常に実行されました`,
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
	 * Two Sum問題の実行
	 */
	private performTwoSum(
		array: number[],
		target: number,
	): {
		found: boolean;
		indices?: [number, number];
		values?: [number, number];
		sum?: number;
	} {
		// まず配列をソート（インデックス情報を保持）
		const indexedArray = array.map((value, index) => ({
			value,
			originalIndex: index,
		}));
		indexedArray.sort((a, b) => a.value - b.value);
		const sortedArray = indexedArray.map((item) => item.value);

		this.steps.push({
			id: this.stepId++,
			description: `Two Sum問題：配列をソートして2つのポインタで和=${target}を探索`,
			array: sortedArray,
			operation: "Two Sum開始",
			variables: {
				originalArray: array,
				sortedArray: sortedArray,
				target: target,
				technique: "左右ポインタによる効率探索",
			},
		});

		let left = 0;
		let right = sortedArray.length - 1;

		while (left < right) {
			const currentSum = sortedArray[left] + sortedArray[right];

			this.steps.push({
				id: this.stepId++,
				description: `arr[${left}]=${sortedArray[left]} + arr[${right}]=${sortedArray[right]} = ${currentSum}`,
				array: sortedArray,
				highlight: [left, right],
				operation: "和の計算",
				variables: {
					left: left,
					right: right,
					leftValue: sortedArray[left],
					rightValue: sortedArray[right],
					currentSum: currentSum,
					target: target,
					comparison:
						currentSum === target
							? "一致!"
							: currentSum < target
								? "小さい"
								: "大きい",
				},
			});

			if (currentSum === target) {
				const result = {
					found: true,
					indices: [
						indexedArray[left].originalIndex,
						indexedArray[right].originalIndex,
					] as [number, number],
					values: [sortedArray[left], sortedArray[right]] as [number, number],
					sum: currentSum,
				};

				this.steps.push({
					id: this.stepId++,
					description: `【ポイント】目標和${target}を発見！値[${sortedArray[left]}, ${sortedArray[right]}]`,
					array: sortedArray,
					highlight: [left, right],
					operation: "Two Sum発見",
					variables: {
						resultString: `インデックス[${result.indices.join(",")}], 値[${result.values.join(",")}], 和=${result.sum}`,
						solution: `${sortedArray[left]} + ${sortedArray[right]} = ${target}`,
					},
				});

				return result;
			}

			if (currentSum < target) {
				left++;
				this.steps.push({
					id: this.stepId++,
					description: `和が小さいため左ポインタを右へ移動: left=${left}`,
					array: sortedArray,
					highlight: [left, right],
					operation: "左ポインタ移動",
					variables: {
						left: left,
						right: right,
						reason: "和を大きくするため",
					},
				});
			} else {
				right--;
				this.steps.push({
					id: this.stepId++,
					description: `和が大きいため右ポインタを左へ移動: right=${right}`,
					array: sortedArray,
					highlight: [left, right],
					operation: "右ポインタ移動",
					variables: {
						left: left,
						right: right,
						reason: "和を小さくするため",
					},
				});
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `Two Sum探索完了：和が${target}になるペアは見つかりませんでした`,
			array: sortedArray,
			operation: "Two Sum終了",
			variables: {
				found: false,
				searchCompleted: true,
			},
		});

		return { found: false };
	}

	/**
	 * Three Sum問題の実行
	 */
	private performThreeSum(
		array: number[],
		target: number,
	): {
		found: boolean;
		triplets: Array<{
			indices: [number, number, number];
			values: [number, number, number];
			sum: number;
		}>;
	} {
		const sortedArray = [...array].sort((a, b) => a - b);
		const triplets: Array<{
			indices: [number, number, number];
			values: [number, number, number];
			sum: number;
		}> = [];

		this.steps.push({
			id: this.stepId++,
			description: `Three Sum問題：和が${target}になる3つの数の組み合わせを探索`,
			array: sortedArray,
			operation: "Three Sum開始",
			variables: {
				originalArray: array,
				sortedArray: sortedArray,
				target: target,
				technique: "固定+2ポインタの組み合わせ",
			},
		});

		for (let i = 0; i < sortedArray.length - 2; i++) {
			// 重複をスキップ
			if (i > 0 && sortedArray[i] === sortedArray[i - 1]) continue;

			const fixed = sortedArray[i];
			let left = i + 1;
			let right = sortedArray.length - 1;
			const remainingTarget = target - fixed;

			this.steps.push({
				id: this.stepId++,
				description: `固定値 arr[${i}]=${fixed}, 残り2つで和=${remainingTarget}を探索`,
				array: sortedArray,
				highlight: [i],
				operation: "固定値設定",
				variables: {
					fixedIndex: i,
					fixedValue: fixed,
					remainingTarget: remainingTarget,
					searchRange: `[${left}, ${right}]`,
				},
			});

			while (left < right) {
				const currentSum = fixed + sortedArray[left] + sortedArray[right];

				this.steps.push({
					id: this.stepId++,
					description: `${fixed} + ${sortedArray[left]} + ${sortedArray[right]} = ${currentSum}`,
					array: sortedArray,
					highlight: [i, left, right],
					operation: "三つ和計算",
					variables: {
						fixed: fixed,
						leftValue: sortedArray[left],
						rightValue: sortedArray[right],
						currentSum: currentSum,
						target: target,
						comparison:
							currentSum === target
								? "一致!"
								: currentSum < target
									? "小さい"
									: "大きい",
					},
				});

				if (currentSum === target) {
					const triplet = {
						indices: [i, left, right] as [number, number, number],
						values: [fixed, sortedArray[left], sortedArray[right]] as [
							number,
							number,
							number,
						],
						sum: currentSum,
					};
					triplets.push(triplet);

					this.steps.push({
						id: this.stepId++,
						description: `【ポイント】解発見！[${fixed}, ${sortedArray[left]}, ${sortedArray[right]}] = ${target}`,
						array: sortedArray,
						highlight: [i, left, right],
						operation: "Three Sum発見",
						variables: {
							solutionIndex: triplets.length,
							tripletString: `インデックス[${triplet.indices.join(",")}], 値[${triplet.values.join(",")}], 和=${triplet.sum}`,
						},
					});

					// 重複をスキップして次へ
					while (left < right && sortedArray[left] === sortedArray[left + 1])
						left++;
					while (left < right && sortedArray[right] === sortedArray[right - 1])
						right--;
					left++;
					right--;
				} else if (currentSum < target) {
					left++;
				} else {
					right--;
				}
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `Three Sum探索完了：${triplets.length}個の解を発見`,
			array: sortedArray,
			operation: "Three Sum完了",
			variables: {
				totalSolutions: triplets.length,
				allTripletsString: triplets
					.map((t) => `[${t.values.join(",")}]`)
					.join(", "),
			},
		});

		return {
			found: triplets.length > 0,
			triplets: triplets,
		};
	}

	/**
	 * 対向ポインタでの和探索
	 */
	private performOppositeSum(
		array: number[],
		target: number,
	): {
		found: boolean;
		pairs: Array<{
			indices: [number, number];
			values: [number, number];
			sum: number;
		}>;
	} {
		const pairs: Array<{
			indices: [number, number];
			values: [number, number];
			sum: number;
		}> = [];
		let left = 0;
		let right = array.length - 1;

		this.steps.push({
			id: this.stepId++,
			description: `対向ポインタで和=${target}を探索（ソート済み配列前提）`,
			array: [...array],
			operation: "対向ポインタ開始",
			variables: {
				target: target,
				leftStart: left,
				rightStart: right,
			},
		});

		while (left < right) {
			const currentSum = array[left] + array[right];

			this.steps.push({
				id: this.stepId++,
				description: `arr[${left}]=${array[left]} + arr[${right}]=${array[right]} = ${currentSum}`,
				array: [...array],
				highlight: [left, right],
				operation: "対向ポインタ計算",
				variables: {
					left: left,
					right: right,
					leftValue: array[left],
					rightValue: array[right],
					currentSum: currentSum,
					target: target,
				},
			});

			if (currentSum === target) {
				const pair = {
					indices: [left, right] as [number, number],
					values: [array[left], array[right]] as [number, number],
					sum: currentSum,
				};
				pairs.push(pair);

				this.steps.push({
					id: this.stepId++,
					description: `【ポイント】対象ペア発見！[${array[left]}, ${array[right]}] = ${target}`,
					array: [...array],
					highlight: [left, right],
					operation: "ペア発見",
					variables: {
						solutionIndex: pairs.length,
						pairString: `インデックス[${pair.indices.join(",")}], 値[${pair.values.join(",")}], 和=${pair.sum}`,
					},
				});

				left++;
				right--;
			} else if (currentSum < target) {
				left++;
				this.steps.push({
					id: this.stepId++,
					description: "和が小さいため左ポインタを右へ",
					array: [...array],
					highlight: [left, right],
					operation: "左ポインタ移動",
					variables: { left: left, right: right },
				});
			} else {
				right--;
				this.steps.push({
					id: this.stepId++,
					description: "和が大きいため右ポインタを左へ",
					array: [...array],
					highlight: [left, right],
					operation: "右ポインタ移動",
					variables: { left: left, right: right },
				});
			}
		}

		return {
			found: pairs.length > 0,
			pairs: pairs,
		};
	}

	/**
	 * 重複除去の実行
	 */
	private performRemoveDuplicates(array: number[]): {
		uniqueArray: number[];
		removedCount: number;
		newLength: number;
	} {
		if (array.length === 0) {
			return { uniqueArray: [], removedCount: 0, newLength: 0 };
		}

		const result = [...array];
		let writeIndex = 1; // 書き込み位置

		this.steps.push({
			id: this.stepId++,
			description: "ソート済み配列から重複要素を除去（in-place）",
			array: [...result],
			operation: "重複除去開始",
			variables: {
				technique: "2ポインタによるin-place重複除去",
				writeIndex: writeIndex,
			},
		});

		for (let readIndex = 1; readIndex < array.length; readIndex++) {
			this.steps.push({
				id: this.stepId++,
				description: `読み取り位置[${readIndex}]=${array[readIndex]} vs 前の要素=${array[readIndex - 1]}`,
				array: [...result],
				highlight: [readIndex - 1, readIndex],
				operation: "重複チェック",
				variables: {
					readIndex: readIndex,
					writeIndex: writeIndex,
					currentValue: array[readIndex],
					previousValue: array[readIndex - 1],
					isDuplicate: array[readIndex] === array[readIndex - 1],
				},
			});

			if (array[readIndex] !== array[readIndex - 1]) {
				result[writeIndex] = array[readIndex];

				this.steps.push({
					id: this.stepId++,
					description: `新しい値発見：位置${writeIndex}に${array[readIndex]}を書き込み`,
					array: [...result],
					highlight: [writeIndex],
					operation: "値書き込み",
					variables: {
						writeIndex: writeIndex,
						writtenValue: array[readIndex],
						newWriteIndex: writeIndex + 1,
					},
				});

				writeIndex++;
			} else {
				this.steps.push({
					id: this.stepId++,
					description: `重複値${array[readIndex]}をスキップ`,
					array: [...result],
					highlight: [readIndex],
					operation: "重複スキップ",
					variables: {
						skippedValue: array[readIndex],
						writeIndex: writeIndex,
					},
				});
			}
		}

		const uniqueArray = result.slice(0, writeIndex);
		const removedCount = array.length - writeIndex;

		this.steps.push({
			id: this.stepId++,
			description: "重複除去完了",
			array: uniqueArray,
			operation: "重複除去完了",
			variables: {
				originalLength: array.length,
				newLength: writeIndex,
				removedCount: removedCount,
				uniqueArray: uniqueArray,
				efficiency: "O(n)時間、O(1)空間",
			},
		});

		return {
			uniqueArray: uniqueArray,
			removedCount: removedCount,
			newLength: writeIndex,
		};
	}

	/**
	 * 配列反転の実行
	 */
	private performReverseArray(array: number[]): number[] {
		const result = [...array];
		let left = 0;
		let right = result.length - 1;

		this.steps.push({
			id: this.stepId++,
			description: "2ポインタを使って配列を in-place で反転",
			array: [...result],
			operation: "配列反転開始",
			variables: {
				leftStart: left,
				rightStart: right,
				technique: "両端からの要素交換",
			},
		});

		while (left < right) {
			this.steps.push({
				id: this.stepId++,
				description: `位置${left}(${result[left]}) と 位置${right}(${result[right]}) を交換`,
				array: [...result],
				highlight: [left, right],
				operation: "要素交換",
				variables: {
					left: left,
					right: right,
					leftValue: result[left],
					rightValue: result[right],
				},
			});

			// 要素を交換
			const temp = result[left];
			result[left] = result[right];
			result[right] = temp;

			this.steps.push({
				id: this.stepId++,
				description: `交換完了：[${left}]=${result[left]}, [${right}]=${result[right]}`,
				array: [...result],
				highlight: [left, right],
				operation: "交換完了",
				variables: {
					left: left,
					right: right,
					newLeftValue: result[left],
					newRightValue: result[right],
				},
			});

			left++;
			right--;
		}

		this.steps.push({
			id: this.stepId++,
			description: "配列反転完了",
			array: [...result],
			operation: "配列反転完了",
			variables: {
				originalArray: array,
				reversedArray: result,
				swapCount: Math.floor(array.length / 2),
			},
		});

		return result;
	}

	/**
	 * 回文判定の実行
	 */
	private performIsPalindrome(text: string): {
		isPalindrome: boolean;
		processedText: string;
		comparedPairs: Array<{ left: string; right: string; match: boolean }>;
	} {
		// 英数字のみを抽出して小文字化
		const processedText = text.toLowerCase().replace(/[^a-z0-9]/g, "");
		const comparedPairs: Array<{
			left: string;
			right: string;
			match: boolean;
		}> = [];

		let left = 0;
		let right = processedText.length - 1;

		this.steps.push({
			id: this.stepId++,
			description: `回文判定：「${text}」→「${processedText}」`,
			operation: "回文判定開始",
			variables: {
				originalText: text,
				processedText: processedText,
				textLength: processedText.length,
				technique: "両端からの文字比較",
			},
		});

		while (left < right) {
			const leftChar = processedText[left];
			const rightChar = processedText[right];
			const isMatch = leftChar === rightChar;

			comparedPairs.push({ left: leftChar, right: rightChar, match: isMatch });

			this.steps.push({
				id: this.stepId++,
				description: `位置${left}:'${leftChar}' vs 位置${right}:'${rightChar}' → ${isMatch ? "一致" : "不一致"}`,
				operation: "文字比較",
				variables: {
					left: left,
					right: right,
					leftChar: leftChar,
					rightChar: rightChar,
					isMatch: isMatch,
					remainingLength: right - left + 1,
				},
			});

			if (!isMatch) {
				this.steps.push({
					id: this.stepId++,
					description: `回文ではありません：'${leftChar}' ≠ '${rightChar}'`,
					operation: "回文判定失敗",
					variables: {
						result: false,
						failureReason: `位置${left}と${right}で文字不一致`,
					},
				});

				return {
					isPalindrome: false,
					processedText: processedText,
					comparedPairs: comparedPairs,
				};
			}

			left++;
			right--;
		}

		this.steps.push({
			id: this.stepId++,
			description: `回文です：「${processedText}」は前から読んでも後ろから読んでも同じ`,
			operation: "回文判定成功",
			variables: {
				result: true,
				comparedPairsString: comparedPairs
					.map((p) => `'${p.left}'='${p.right}'(${p.match ? "*" : "×"})`)
					.join(", "),
				totalComparisons: comparedPairs.length,
			},
		});

		return {
			isPalindrome: true,
			processedText: processedText,
			comparedPairs: comparedPairs,
		};
	}

	/**
	 * 最大水容量の実行
	 */
	private performContainerWater(heights: number[]): {
		maxArea: number;
		bestLeft: number;
		bestRight: number;
		bestHeight: number;
		bestWidth: number;
	} {
		let left = 0;
		let right = heights.length - 1;
		let maxArea = 0;
		let bestLeft = 0;
		let bestRight = 0;

		this.steps.push({
			id: this.stepId++,
			description: "最大の水の容量を計算（Container With Most Water問題）",
			array: heights,
			operation: "最大容量計算開始",
			variables: {
				heights: heights,
				technique: "2ポインタで効率的に最大面積を探索",
			},
		});

		while (left < right) {
			const height = Math.min(heights[left], heights[right]);
			const width = right - left;
			const area = height * width;

			this.steps.push({
				id: this.stepId++,
				description: `面積計算：高さ=min(${heights[left]}, ${heights[right]})=${height}, 幅=${width}, 面積=${area}`,
				array: heights,
				highlight: [left, right],
				operation: "面積計算",
				variables: {
					left: left,
					right: right,
					leftHeight: heights[left],
					rightHeight: heights[right],
					minHeight: height,
					width: width,
					area: area,
					maxArea: maxArea,
					isNewMax: area > maxArea,
				},
			});

			if (area > maxArea) {
				maxArea = area;
				bestLeft = left;
				bestRight = right;

				this.steps.push({
					id: this.stepId++,
					description: ` 新最大面積発見！面積=${area} (位置${left}-${right})`,
					array: heights,
					highlight: [left, right],
					operation: "最大面積更新",
					variables: {
						newMaxArea: maxArea,
						bestPositions: [bestLeft, bestRight],
						bestDimensions: `${height} × ${width}`,
					},
				});
			}

			// より低い壁のポインタを移動
			if (heights[left] < heights[right]) {
				this.steps.push({
					id: this.stepId++,
					description: `左の壁(${heights[left]})が低いため左ポインタを移動`,
					array: heights,
					highlight: [left + 1, right],
					operation: "左ポインタ移動",
					variables: {
						movedFrom: left,
						movedTo: left + 1,
						reason: "左の壁がより低い",
					},
				});
				left++;
			} else {
				this.steps.push({
					id: this.stepId++,
					description: `右の壁(${heights[right]})が低いため右ポインタを移動`,
					array: heights,
					highlight: [left, right - 1],
					operation: "右ポインタ移動",
					variables: {
						movedFrom: right,
						movedTo: right - 1,
						reason: "右の壁がより低い",
					},
				});
				right--;
			}
		}

		const result = {
			maxArea: maxArea,
			bestLeft: bestLeft,
			bestRight: bestRight,
			bestHeight: Math.min(heights[bestLeft], heights[bestRight]),
			bestWidth: bestRight - bestLeft,
		};

		this.steps.push({
			id: this.stepId++,
			description: "最大水容量計算完了",
			array: heights,
			highlight: [bestLeft, bestRight],
			operation: "最大容量計算完了",
			variables: {
				finalResultString: `最大容量=${result.maxArea}, 位置[${result.bestLeft},${result.bestRight}], 高さ=${result.bestHeight}, 幅=${result.bestWidth}`,
				efficiency: "O(n)で最大面積を発見",
			},
		});

		return result;
	}

	/**
	 * ソート済み配列の二乗
	 */
	private performSortedSquares(array: number[]): number[] {
		const result: number[] = new Array(array.length);
		let left = 0;
		let right = array.length - 1;
		let writeIndex = array.length - 1; // 後ろから埋める

		this.steps.push({
			id: this.stepId++,
			description: "ソート済み配列の各要素を二乗してソート順を維持",
			array: array,
			operation: "ソート済み二乗開始",
			variables: {
				originalArray: array,
				technique: "2ポインタで大きい二乗値から配置",
			},
		});

		while (left <= right) {
			const leftSquare = array[left] * array[left];
			const rightSquare = array[right] * array[right];

			this.steps.push({
				id: this.stepId++,
				description: `${array[left]}² = ${leftSquare} vs ${array[right]}² = ${rightSquare}`,
				array: array,
				highlight: [left, right],
				operation: "二乗値比較",
				variables: {
					left: left,
					right: right,
					leftValue: array[left],
					rightValue: array[right],
					leftSquare: leftSquare,
					rightSquare: rightSquare,
					writeIndex: writeIndex,
					largerSquare: leftSquare >= rightSquare ? leftSquare : rightSquare,
				},
			});

			if (leftSquare >= rightSquare) {
				result[writeIndex] = leftSquare;
				this.steps.push({
					id: this.stepId++,
					description: `${leftSquare}の方が大きいため位置${writeIndex}に配置, 左ポインタ移動`,
					array: array,
					highlight: [left],
					operation: "左値選択",
					variables: {
						selectedValue: leftSquare,
						writeIndex: writeIndex,
						resultSoFar: [...result],
					},
				});
				left++;
			} else {
				result[writeIndex] = rightSquare;
				this.steps.push({
					id: this.stepId++,
					description: `${rightSquare}の方が大きいため位置${writeIndex}に配置, 右ポインタ移動`,
					array: array,
					highlight: [right],
					operation: "右値選択",
					variables: {
						selectedValue: rightSquare,
						writeIndex: writeIndex,
						resultSoFar: [...result],
					},
				});
				right--;
			}

			writeIndex--;
		}

		this.steps.push({
			id: this.stepId++,
			description: "ソート済み二乗配列の構築完了",
			array: result,
			operation: "ソート済み二乗完了",
			variables: {
				originalArray: array,
				squaredArray: result,
				efficiency: "O(n)でソート順を維持",
			},
		});

		return result;
	}

	/**
	 * ソート済み配列のマージ
	 */
	private performMergeSorted(array1: number[], array2: number[]): number[] {
		const result: number[] = [];
		let i = 0;
		let j = 0;

		this.steps.push({
			id: this.stepId++,
			description: "2つのソート済み配列をマージ",
			operation: "配列マージ開始",
			variables: {
				array1: array1,
				array2: array2,
				array1Length: array1.length,
				array2Length: array2.length,
				technique: "2ポインタによる効率的マージ",
			},
		});

		while (i < array1.length && j < array2.length) {
			this.steps.push({
				id: this.stepId++,
				description: `比較：array1[${i}]=${array1[i]} vs array2[${j}]=${array2[j]}`,
				operation: "要素比較",
				variables: {
					i: i,
					j: j,
					value1: array1[i],
					value2: array2[j],
					resultLength: result.length,
					smaller: array1[i] <= array2[j] ? array1[i] : array2[j],
				},
			});

			if (array1[i] <= array2[j]) {
				result.push(array1[i]);
				this.steps.push({
					id: this.stepId++,
					description: `array1[${i}]=${array1[i]}の方が小さいため追加`,
					operation: "array1要素追加",
					variables: {
						addedValue: array1[i],
						fromArray: "array1",
						newI: i + 1,
						resultSoFar: [...result],
					},
				});
				i++;
			} else {
				result.push(array2[j]);
				this.steps.push({
					id: this.stepId++,
					description: `array2[${j}]=${array2[j]}の方が小さいため追加`,
					operation: "array2要素追加",
					variables: {
						addedValue: array2[j],
						fromArray: "array2",
						newJ: j + 1,
						resultSoFar: [...result],
					},
				});
				j++;
			}
		}

		// 残りの要素を追加
		while (i < array1.length) {
			result.push(array1[i]);
			this.steps.push({
				id: this.stepId++,
				description: `array1の残り要素${array1[i]}を追加`,
				operation: "array1残り追加",
				variables: {
					addedValue: array1[i],
					i: i,
					resultSoFar: [...result],
				},
			});
			i++;
		}

		while (j < array2.length) {
			result.push(array2[j]);
			this.steps.push({
				id: this.stepId++,
				description: `array2の残り要素${array2[j]}を追加`,
				operation: "array2残り追加",
				variables: {
					addedValue: array2[j],
					j: j,
					resultSoFar: [...result],
				},
			});
			j++;
		}

		this.steps.push({
			id: this.stepId++,
			description: "配列マージ完了",
			operation: "配列マージ完了",
			variables: {
				array1: array1,
				array2: array2,
				mergedArray: result,
				totalElements: result.length,
				efficiency: "O(n + m)で2つの配列をマージ",
			},
		});

		return result;
	}

	/**
	 * 操作の説明を取得
	 */
	private getOperationDescription(operation: TwoPointerOperationType): string {
		const descriptions = {
			twoSum: "Two Sum問題",
			threeSum: "Three Sum問題",
			oppositeSum: "対向ポインタでの和探索",
			removeDuplicates: "重複要素の除去",
			reverseArray: "配列の反転",
			isPalindrome: "回文判定",
			containerWater: "最大水容量計算",
			sortedSquares: "ソート済み配列の二乗",
			mergeSorted: "ソート済み配列のマージ",
		};
		return descriptions[operation] || "2ポインタ操作";
	}

	/**
	 * 技法の説明を取得
	 */
	private getTechniqueDescription(operation: TwoPointerOperationType): string {
		const techniques = {
			twoSum: "ソート+対向ポインタによる効率探索",
			threeSum: "固定+2ポインタの組み合わせ",
			oppositeSum: "両端からの線形探索",
			removeDuplicates: "読み書きポインタによるin-place処理",
			reverseArray: "両端からの要素交換",
			isPalindrome: "両端からの文字比較",
			containerWater: "貪欲法+2ポインタ最適化",
			sortedSquares: "絶対値比較による効率ソート",
			mergeSorted: "2ポインタによる線形マージ",
		};
		return techniques[operation] || "2ポインタ技法";
	}

	/**
	 * 効率性に関する注記を取得
	 */
	private getEfficiencyNote(operation: TwoPointerOperationType): string {
		const notes = {
			twoSum: "ナイーブ法O(n²) → ソート+2ポインタO(n log n)",
			threeSum: "3重ループO(n³) → ソート+2ポインタO(n²)",
			oppositeSum: "全組み合わせO(n²) → 対向ポインタO(n)",
			removeDuplicates: "新配列作成O(n)空間 → in-place O(1)空間",
			reverseArray: "新配列作成O(n)空間 → in-place O(1)空間",
			isPalindrome: "文字列作成O(n)空間 → 直接比較O(1)空間",
			containerWater: "全組み合わせO(n²) → 貪欲+2ポインタO(n)",
			sortedSquares: "ソートO(n log n) → 2ポインタO(n)",
			mergeSorted: "効率的なO(n + m)線形マージ",
		};
		return notes[operation] || "効率的な2ポインタ処理";
	}

	/**
	 * 操作の時間計算量を取得
	 */
	private getOperationComplexity(operation: TwoPointerOperationType): string {
		const complexities = {
			twoSum: "O(n log n)", // ソートが必要
			threeSum: "O(n²)", // 外側ループ × 2ポインタ
			oppositeSum: "O(n)",
			removeDuplicates: "O(n)",
			reverseArray: "O(n)",
			isPalindrome: "O(n)",
			containerWater: "O(n)",
			sortedSquares: "O(n)",
			mergeSorted: "O(n + m)",
		};
		return complexities[operation] || "O(n)";
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: {
				operation: "twoSum",
				array: [2, 7, 11, 15],
				target: 9,
			},
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
2 pointer法（Two Pointers）は、配列やリストに対して2つのポインタを使用して効率的に操作を行う重要なアルゴリズム技法です。線形時間での探索や操作を可能にし、多くの問題でナイーブ法を大幅に改善できます。

 **2 pointer法の基本概念**
- 配列に対して2つのインデックス（ポインタ）を使用
- ポインタの移動ルールによって効率的な処理を実現
- ソート済み配列での威力を最大限発揮
- 空間効率も優秀（多くの場合O(1)）

【解析】**主要なパターンと計算量**
- 対向ポインタ: O(n) - 両端から中央へ
- 同方向ポインタ: O(n) - 読み書きポインタによる処理
- 固定+移動: O(n²) - 一つを固定してもう一つを移動
- 条件付き移動: O(n) - 条件に応じた動的移動

【ポイント】**代表的なパターン**
- **対向ポインタ**: 両端から中央に向かって移動
  - Two Sum, 回文判定, 配列反転
- **同方向ポインタ**: 読み取りと書き込みで異なる速度
  - 重複除去, 条件フィルタリング
- **固定ポインタ**: 一つを固定してもう一つを移動
  - Three Sum, Four Sum

【ヒント】**実装のポイント**
- ソート済み配列での活用が基本
- ポインタの移動条件を明確に定義
- 境界条件の適切な処理
- 重複要素の処理方法

 **主要な応用問題**
- **Sum問題**: Two Sum, Three Sum, Four Sum
- **配列操作**: 重複除去, 配列反転, マージ
- **文字列**: 回文判定, パターンマッチング
- **幾何問題**: 最大面積, 最小距離

【応用】**実世界での応用例**
- **データ処理**: 重複データの除去とクリーニング
- **文字列解析**: テキスト処理とパターン検出
- **数値計算**: 効率的な数値探索アルゴリズム
- **ゲーム開発**: 衝突判定, 範囲チェック

【計算量】**パフォーマンス特性**
- 時間計算量: O(n) ～ O(n²) - 問題に応じて
- 空間計算量: O(1) - 多くの場合追加メモリ不要
- 実装が直感的で理解しやすい
- デバッグが容易

【詳細】**他の手法との比較**
- vs ナイーブ法: 大幅な時間計算量改善
- vs ハッシュテーブル: 空間効率に優れる
- vs 分割統治: 実装が簡単

2 pointer法は、「効率的な線形処理」の基本パターンを学べる重要な技法です。ソートされたデータの性質を活用して、シンプルな実装で高い性能を実現する実践的なアルゴリズムです。
		`.trim();
	}

	/**
	 * 推奨される操作例を取得
	 */
	static getRecommendedOperations(): {
		operation: TwoPointerOperationType;
		array?: number[];
		target?: number;
		text?: string;
		array1?: number[];
		array2?: number[];
		description: string;
		expectedResult: any;
	}[] {
		return [
			{
				operation: "twoSum",
				array: [2, 7, 11, 15],
				target: 9,
				description: "ソート済み配列で和が9になるペアを探索",
				expectedResult: {
					found: true,
					indices: [0, 1],
					values: [2, 7],
					sum: 9,
				},
			},
			{
				operation: "reverseArray",
				array: [1, 2, 3, 4, 5],
				description: "配列をin-placeで反転",
				expectedResult: [5, 4, 3, 2, 1],
			},
			{
				operation: "isPalindrome",
				text: "A man a plan a canal Panama",
				description: "文字列が回文かどうかを判定",
				expectedResult: {
					isPalindrome: true,
					processedText: "amanaplanacanalpanama",
				},
			},
			{
				operation: "removeDuplicates",
				array: [1, 1, 2, 2, 3, 4, 4, 5],
				description: "ソート済み配列から重複を除去",
				expectedResult: {
					uniqueArray: [1, 2, 3, 4, 5],
					removedCount: 3,
					newLength: 5,
				},
			},
			{
				operation: "containerWater",
				array: [1, 8, 6, 2, 5, 4, 8, 3, 7],
				description: "最大の水の容量を計算",
				expectedResult: {
					maxArea: 49,
					bestLeft: 1,
					bestRight: 8,
					bestHeight: 7,
					bestWidth: 7,
				},
			},
			{
				operation: "mergeSorted",
				array1: [1, 3, 5],
				array2: [2, 4, 6],
				description: "2つのソート済み配列をマージ",
				expectedResult: [1, 2, 3, 4, 5, 6],
			},
		];
	}
}
