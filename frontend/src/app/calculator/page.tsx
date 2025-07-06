"use client";

import React, { useState, useCallback } from "react";
import { CelestialBodySelector } from "../../components/calculator/CelestialBodySelector";
import { ParameterInput } from "../../components/calculator/ParameterInput";
import { ResultDisplay } from "../../components/calculator/ResultDisplay";
import type { CelestialBody } from "../../data/celestial-bodies";
import type {
	CalculationParameter,
	CalculationResult,
	ValidationResult,
} from "../../types/calculator";
import { SchwarzschildRadiusCalculator } from "../../utils/calculators/schwarzschild-radius";

/**
 * 計算ページのメインコンポーネント
 * 将来的に複数の計算機能をサポートする拡張可能な設計
 */
export default function CalculatorPage() {
	// 現在は1つの計算機のみサポート
	const calculator = new SchwarzschildRadiusCalculator();

	// 状態管理
	const [parameters, setParameters] = useState<CalculationParameter[]>(
		calculator.getExampleParameters(),
	);
	const [results, setResults] = useState<CalculationResult[]>([]);
	const [isCalculating, setIsCalculating] = useState(false);
	const [validationResult, setValidationResult] = useState<ValidationResult>({
		isValid: true,
		errors: [],
		warnings: [],
	});
	const [selectedCelestialBody, setSelectedCelestialBody] =
		useState<CelestialBody | null>(null);

	/**
	 * 天体選択ハンドラー
	 */
	const handleCelestialBodySelect = useCallback(
		(body: CelestialBody | null) => {
			setSelectedCelestialBody(body);

			if (body) {
				// 質量パラメータを更新
				setParameters((prev) =>
					prev.map((param) =>
						param.id === "mass" ? { ...param, value: body.mass } : param,
					),
				);
			}
		},
		[],
	);

	/**
	 * パラメータ変更ハンドラー
	 */
	const handleParameterChange = useCallback(
		(updatedParameter: CalculationParameter) => {
			setParameters((prev) =>
				prev.map((param) =>
					param.id === updatedParameter.id ? updatedParameter : param,
				),
			);

			// 手動で質量を変更した場合は天体選択をリセット
			if (updatedParameter.id === "mass") {
				setSelectedCelestialBody(null);
			}
		},
		[],
	);

	/**
	 * 計算実行
	 */
	const handleCalculate = useCallback(async () => {
		setIsCalculating(true);

		try {
			// バリデーション
			const validation = calculator.validateParameters(parameters);
			setValidationResult(validation);

			if (!validation.isValid) {
				setResults([]);
				return;
			}

			// 計算実行
			const calculationResults = calculator.calculate(parameters);
			setResults(calculationResults);
		} catch (error) {
			console.error("計算エラー:", error);
			setValidationResult({
				isValid: false,
				errors: [
					error instanceof Error
						? error.message
						: "計算中にエラーが発生しました",
				],
				warnings: [],
			});
			setResults([]);
		} finally {
			setIsCalculating(false);
		}
	}, [calculator, parameters]);

	/**
	 * 例の値を読み込み
	 */
	const handleLoadExample = useCallback(() => {
		const exampleParams = calculator.getExampleParameters();
		setParameters(exampleParams);
		setValidationResult({ isValid: true, errors: [], warnings: [] });
		setResults([]);
		setSelectedCelestialBody(null);
	}, [calculator]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* ページヘッダー */}
				<header className="mb-8 text-center">
					<h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
						物理計算ツール
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						各種物理量の計算を行うことができます。現在はシュワルツシルト半径の計算をサポートしています。
					</p>
				</header>

				{/* 計算機選択（将来の拡張用） */}
				<section className="mb-8">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
						計算タイプ
					</h2>
					<div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300">
						<h3 className="font-medium text-lg text-gray-900 dark:text-gray-100 mb-2">
							{calculator.displayName}
						</h3>
						<p className="text-gray-600 dark:text-gray-300 text-sm">
							{calculator.description}
						</p>
					</div>
				</section>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* 入力セクション */}
					<section className="space-y-6">
						<div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
									パラメータ入力
								</h2>
								<button
									type="button"
									onClick={handleLoadExample}
									className="px-3 py-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
								>
									例の値を読み込み
								</button>
							</div>

							{/* 天体選択 */}
							<div className="mb-6">
								<CelestialBodySelector
									selectedBodyId={selectedCelestialBody?.id || null}
									onBodySelect={handleCelestialBodySelect}
									disabled={isCalculating}
								/>
							</div>

							{/* パラメータ入力フォーム */}
							<div className="space-y-4">
								{parameters.map((parameter) => (
									<ParameterInput
										key={parameter.id}
										parameter={parameter}
										onChange={handleParameterChange}
										disabled={isCalculating}
									/>
								))}
							</div>

							{/* エラー・警告表示 */}
							{(validationResult.errors.length > 0 ||
								validationResult.warnings.length > 0) && (
								<div className="space-y-2">
									{validationResult.errors.map((error, index) => (
										<div
											key={`error-${index}`}
											className="flex items-center text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 p-3 rounded-md border border-red-200 dark:border-red-700/50"
										>
											<svg
												className="w-4 h-4 mr-2 flex-shrink-0"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											{error}
										</div>
									))}
									{validationResult.warnings.map((warning, index) => (
										<div
											key={`warning-${index}`}
											className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md border border-yellow-200 dark:border-yellow-700/50"
										>
											<svg
												className="w-4 h-4 mr-2 flex-shrink-0"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
													clipRule="evenodd"
												/>
											</svg>
											{warning}
										</div>
									))}
								</div>
							)}

							{/* 計算ボタン */}
							<button
								type="button"
								onClick={handleCalculate}
								disabled={isCalculating || !validationResult.isValid}
								className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
									isCalculating || !validationResult.isValid
										? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed scale-100"
										: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
								}`}
							>
								{isCalculating ? (
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										計算中...
									</div>
								) : (
									"計算実行"
								)}
							</button>
						</div>
					</section>

					{/* 結果セクション */}
					<section className="space-y-6">
						<div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-lg">
							<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
								計算結果
							</h2>

							{results.length > 0 ? (
								<div className="space-y-4">
									{results.map((result) => (
										<ResultDisplay key={result.id} result={result} />
									))}
								</div>
							) : (
								<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl p-8 text-center">
									<div className="text-gray-400 dark:text-gray-500 mb-4">
										<svg
											className="w-16 h-16 mx-auto"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1}
												d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<p className="text-gray-500 dark:text-gray-400 text-lg">
										パラメータを入力して「計算実行」ボタンを押してください
									</p>
								</div>
							)}
						</div>
					</section>
				</div>

				{/* 補足情報 */}
				<footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50 shadow-lg">
						<h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-lg">
							シュワルツシルト半径について
						</h3>
						<p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
							シュワルツシルト半径は、ある質量の物体がブラックホールになる際の事象の地平面の半径です。
							この半径以下に質量が圧縮されると、重力が非常に強くなり、光さえも脱出できなくなります。
							計算式は Rs = 2GM/c² で表され、Gは重力定数、Mは質量、cは光速です。
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
}
