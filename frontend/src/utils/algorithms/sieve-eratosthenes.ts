/**
 * src/utils/algorithms/sieve-eratosthenes.ts
 *
 * エラトステネスの篩（Sieve of Eratosthenes）アルゴリズムの実装
 * 指定した範囲内のすべての素数を効率的に列挙する古典的なアルゴリズム
 */

import type {
	Algorithm,
	AlgorithmInfo,
	AlgorithmInput,
	AlgorithmResult,
	AlgorithmStep,
} from "../../types/algorithm";

/**
 * 篩の各要素の状態を表す型
 */
interface SieveCell {
	number: number; // 数値
	isPrime: boolean; // 素数かどうか
	isMarked: boolean; // 篩で除外されたかどうか
	isCurrentPrime?: boolean; // 現在処理中の素数かどうか
	markedBy?: number; // どの素数によって除外されたか
	isNew?: boolean; // 新しく処理されたセルかどうか
}

/**
 * エラトステネスの篩アルゴリズムクラス
 *
 * 指定した上限以下のすべての素数を効率的に列挙
 * 時間計算量: O(n log log n)
 * 空間計算量: O(n)
 */
export class SieveEratosthenesAlgorithm implements Algorithm {
	readonly info: AlgorithmInfo = {
		id: "sieve-eratosthenes",
		name: "エラトステネスの篩",
		description:
			"古代ギリシャの数学者エラトステネスが考案した素数を効率的に列挙するアルゴリズム",
		category: "other",
		timeComplexity: {
			best: "O(n log log n)", // n は上限値
			average: "O(n log log n)",
			worst: "O(n log log n)",
		},
		difficulty: 2, // 初中級（アルゴリズムの理解は簡単だが効率性の理解が必要）
		spaceComplexity: "O(n)",
	};

	// クラス内で使用する変数
	private steps: AlgorithmStep[] = [];
	private stepId = 0;
	private sieve: SieveCell[] = [];
	private primes: number[] = [];
	private limit = 0;

	/**
	 * エラトステネスの篩を実行
	 * @param input 上限値（limit）
	 * @returns 実行結果とステップ履歴
	 */
	execute(input: AlgorithmInput): AlgorithmResult {
		// 入力検証と値の取得
		const limit = input.parameters?.limit as number;

		if (!limit || typeof limit !== "number") {
			throw new Error("上限値（limit）が必要です");
		}

		if (limit < 2) {
			throw new Error("上限値は2以上である必要があります");
		}

		if (!Number.isInteger(limit)) {
			throw new Error("上限値は整数である必要があります");
		}

		// 教育目的の制限
		if (limit > 1000) {
			throw new Error("教育目的のため、上限値は1000以下に制限されています");
		}

		// 初期化
		this.steps = [];
		this.stepId = 0;
		this.sieve = [];
		this.primes = [];
		this.limit = limit;

		// 初期状態のステップ
		this.steps.push({
			id: this.stepId++,
			description: `エラトステネスの篩開始：2から${limit}までの素数を列挙`,
			array: [],
			operation: "初期化",
			variables: {
				limit: limit,
				method: "エラトステネスの篩（古代ギリシャ、紀元前3世紀）",
				purpose: "指定範囲内のすべての素数を効率的に列挙",
				principle: "小さい素数の倍数を順次除外していく",
			},
		});

		// 篩を初期化
		this.initializeSieve(limit);

		// 篩を実行
		this.performSieve();

		// 素数を収集
		this.collectPrimes();

		// 完了ステップ
		this.steps.push({
			id: this.stepId++,
			description: ` 篩完了！2から${limit}までの素数：${this.primes.length}個見つかりました`,
			array: this.primes,
			operation: "完了",
			variables: {
				primes: this.primes,
				primeCount: this.primes.length,
				limit: limit,
				efficiency: `${limit}個の候補から${this.stepId}ステップで完了`,
				timeComplexity: "O(n log log n)",
				spaceComplexity: "O(n)",
			},
		});

		return {
			success: true,
			result: this.primes,
			steps: this.steps,
			executionSteps: this.steps,
			timeComplexity: this.info.timeComplexity.average,
			summary: {
				primeCount: this.primes.length,
				primes: this.primes,
				limit: limit,
				largestPrime: this.primes[this.primes.length - 1],
			},
		};
	}

	/**
	 * 篩を初期化
	 */
	private initializeSieve(limit: number): void {
		this.steps.push({
			id: this.stepId++,
			description: `篩を初期化：2から${limit}までの数を候補として設定`,
			array: [],
			operation: "篩初期化",
			variables: {
				range: `2 ～ ${limit}`,
				candidateCount: limit - 1,
				initialState: "すべて素数候補として設定",
				note: "0と1は素数ではないため除外",
			},
		});

		// 篩を初期化（2からlimitまで）
		this.sieve = [];
		for (let i = 2; i <= limit; i++) {
			this.sieve.push({
				number: i,
				isPrime: true, // 初期状態では全て素数候補
				isMarked: false,
				isNew: true,
			});
		}
	}

	/**
	 * 篩を実行
	 */
	private performSieve(): void {
		const sqrtLimit = Math.sqrt(this.limit);

		this.steps.push({
			id: this.stepId++,
			description: `篩の実行開始：√${this.limit} ≈ ${sqrtLimit.toFixed(2)} まで処理`,
			array: [],
			operation: "篩実行開始",
			variables: {
				sqrtLimit: Math.floor(sqrtLimit),
				explanation: "√nより大きい合成数の最小素因数は√n以下",
				optimization: "√nまでの素数のみ確認すれば十分",
			},
		});

		for (let i = 0; i < this.sieve.length; i++) {
			const current = this.sieve[i];

			// √limit を超えたら終了
			if (current.number > sqrtLimit) {
				this.steps.push({
					id: this.stepId++,
					description: `${current.number} > √${this.limit} のため篩の処理完了`,
					array: this.getCurrentNumbers(),
					operation: "篩処理完了",
					variables: {
						currentNumber: current.number,
						sqrtLimit: Math.floor(sqrtLimit),
						remaining: "残りはすべて素数として確定",
					},
				});
				break;
			}

			// 既に除外されている場合はスキップ
			if (current.isMarked) {
				continue;
			}

			// 素数として確定
			current.isCurrentPrime = true;
			this.resetNewFlags();
			current.isNew = true;

			this.steps.push({
				id: this.stepId++,
				description: `${current.number} は素数として確定：倍数を除外開始`,
				array: this.getCurrentNumbers(),
				highlight: [current.number],
				operation: "素数確定",
				variables: {
					prime: current.number,
					action: "この素数の倍数を除外",
					nextStep: `${current.number}² = ${current.number * current.number} から開始`,
				},
			});

			// この素数の倍数を除外
			this.markMultiples(current.number);

			current.isCurrentPrime = false;
		}
	}

	/**
	 * 指定された素数の倍数を除外
	 */
	private markMultiples(prime: number): void {
		const startFrom = prime * prime; // p² から開始（それより小さい倍数は既に処理済み）

		this.steps.push({
			id: this.stepId++,
			description: `${prime}の倍数を除外：${startFrom}から開始（${prime}×${prime}）`,
			array: this.getCurrentNumbers(),
			operation: "倍数除外開始",
			variables: {
				prime: prime,
				startFrom: startFrom,
				step: prime,
				reason: `${prime}²より小さい倍数は既に処理済み`,
			},
		});

		let markedCount = 0;

		for (let multiple = startFrom; multiple <= this.limit; multiple += prime) {
			const index = multiple - 2; // 配列のインデックス（2から始まるため）

			if (
				index >= 0 &&
				index < this.sieve.length &&
				!this.sieve[index].isMarked
			) {
				this.sieve[index].isPrime = false;
				this.sieve[index].isMarked = true;
				this.sieve[index].markedBy = prime;
				this.sieve[index].isNew = true;
				markedCount++;

				// 重要な除外の場合は詳細ステップを記録
				if (multiple <= this.limit && markedCount <= 5) {
					this.steps.push({
						id: this.stepId++,
						description: `${multiple} を除外（${prime} × ${multiple / prime}）`,
						array: this.getCurrentNumbers(),
						highlight: [multiple],
						operation: "合成数除外",
						variables: {
							composite: multiple,
							factor1: prime,
							factor2: multiple / prime,
							markedBy: prime,
						},
					});
				}
			}
		}

		this.steps.push({
			id: this.stepId++,
			description: `${prime}の倍数除外完了：${markedCount}個の合成数を除外`,
			array: this.getCurrentNumbers(),
			operation: "倍数除外完了",
			variables: {
				prime: prime,
				markedCount: markedCount,
				remainingCandidates: this.sieve.filter((cell) => !cell.isMarked).length,
			},
		});
	}

	/**
	 * 素数を収集
	 */
	private collectPrimes(): void {
		this.steps.push({
			id: this.stepId++,
			description: "除外されなかった数を素数として収集",
			array: [],
			operation: "素数収集開始",
			variables: {
				method: "isPrime = true かつ isMarked = false の数を収集",
			},
		});

		this.primes = this.sieve
			.filter((cell) => !cell.isMarked)
			.map((cell) => cell.number);

		this.steps.push({
			id: this.stepId++,
			description: `素数収集完了：${this.primes.length}個の素数を発見`,
			array: this.primes,
			highlight: this.primes,
			operation: "素数収集完了",
			variables: {
				primes: this.primes,
				count: this.primes.length,
				smallest: this.primes[0],
				largest: this.primes[this.primes.length - 1],
				density: `${((this.primes.length / (this.limit - 1)) * 100).toFixed(1)}%`,
			},
		});
	}

	/**
	 * 現在の数値配列を取得（表示用）
	 */
	private getCurrentNumbers(): number[] {
		return this.sieve.map((cell) => cell.number);
	}

	/**
	 * isNewフラグをリセット
	 */
	private resetNewFlags(): void {
		for (const cell of this.sieve) {
			cell.isNew = false;
		}
	}

	/**
	 * デフォルトの入力例を取得
	 */
	getDefaultInput(): AlgorithmInput {
		return {
			parameters: { limit: 30 },
		};
	}

	/**
	 * アルゴリズムの詳細説明を取得
	 */
	getExplanation(): string {
		return `
エラトステネスの篩（Sieve of Eratosthenes）は、紀元前3世紀の古代ギリシャの数学者エラトステネスによって考案された、指定した範囲内のすべての素数を効率的に列挙するアルゴリズムです。

【ポイント】**アルゴリズムの概要**
- 2からnまでの数を候補として用意
- 小さい素数から順に、その倍数を除外
- 除外されなかった数が素数

【解析】**動作原理**
1. 2からnまでの数をリストに書く
2. 最小の未処理数（素数）を選ぶ
3. その数の倍数（自分以外）を除外
4. √n まで繰り返す
5. 残った数がすべて素数

【計算量】**効率性の特徴**
- 時間計算量: O(n log log n) - 非常に効率的
- 空間計算量: O(n) - リニアな記憶領域
- √n までの処理で十分（最適化）

【詳細】**最適化のポイント**
- p² から倍数除外を開始（それより小さい倍数は処理済み）
- √n を超えた数の倍数チェック不要
- ビット配列による空間効率化も可能

 **実用的な応用**
- 暗号学での素数生成
- 数論研究での基礎計算
- 競技プログラミングでの前処理
- 数学教育での素数概念学習

【ヒント】**学習価値**
- 古典アルゴリズムの美しさ
- 効率的な除外法の考え方
- 数論とアルゴリズムの結合
- 最適化技法の理解

【詳細】**具体例（limit=30）**
- 候補: 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30
- 2の倍数除外後: 2,3,5,7,9,11,13,15,17,19,21,23,25,27,29
- 3の倍数除外後: 2,3,5,7,11,13,17,19,23,29
- 5の倍数除外後: 2,3,5,7,11,13,17,19,23,29
- 素数: 2,3,5,7,11,13,17,19,23,29（10個）

**重要なポイント**
- 2000年以上前のアルゴリズムが現代でも最適
- 素数の無限性と分布の理解
- 効率的な除外による計算量削減
- 数学的証明に基づく確実性
		`.trim();
	}

	/**
	 * 推奨する入力例を取得
	 */
	static getRecommendedInputs(): {
		limit: number;
		description: string;
		expectedPrimeCount: number;
		expectedPrimes: number[];
	}[] {
		return [
			{
				limit: 30,
				description: "基本例：理解しやすいサイズ",
				expectedPrimeCount: 10,
				expectedPrimes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
			},
			{
				limit: 50,
				description: "中規模例：効率性を実感",
				expectedPrimeCount: 15,
				expectedPrimes: [
					2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
				],
			},
			{
				limit: 100,
				description: "標準例：よく使われる範囲",
				expectedPrimeCount: 25,
				expectedPrimes: [
					2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
					67, 71, 73, 79, 83, 89, 97,
				],
			},
			{
				limit: 10,
				description: "小規模例：手計算可能",
				expectedPrimeCount: 4,
				expectedPrimes: [2, 3, 5, 7],
			},
			{
				limit: 200,
				description: "大規模例：効率性を体感",
				expectedPrimeCount: 46,
				expectedPrimes: [
					2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
					67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
					139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
				],
			},
			{
				limit: 500,
				description: "大型例：古典アルゴリズムの威力",
				expectedPrimeCount: 95,
				expectedPrimes: [], // 表示のため省略、実際には95個の素数
			},
		];
	}

	/**
	 * 指定した上限までの素数を解く（検証用）
	 * @param limit 上限値
	 * @returns 素数配列
	 */
	static solve(limit: number): number[] {
		if (limit < 2) return [];

		const isPrime = Array(limit + 1).fill(true);
		isPrime[0] = isPrime[1] = false;

		for (let i = 2; i * i <= limit; i++) {
			if (isPrime[i]) {
				for (let j = i * i; j <= limit; j += i) {
					isPrime[j] = false;
				}
			}
		}

		const primes: number[] = [];
		for (let i = 2; i <= limit; i++) {
			if (isPrime[i]) {
				primes.push(i);
			}
		}

		return primes;
	}

	/**
	 * 素数密度を計算
	 * @param primes 素数配列
	 * @param limit 上限値
	 * @returns 素数密度情報
	 */
	static analyzeDensity(
		primes: number[],
		limit: number,
	): {
		count: number;
		density: number;
		averageGap: number;
		largestGap: number;
	} {
		const count = primes.length;
		const density = (count / limit) * 100;

		if (count <= 1) {
			return { count, density, averageGap: 0, largestGap: 0 };
		}

		const gaps = [];
		for (let i = 1; i < primes.length; i++) {
			gaps.push(primes[i] - primes[i - 1]);
		}

		const averageGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
		const largestGap = Math.max(...gaps);

		return { count, density, averageGap, largestGap };
	}
}
