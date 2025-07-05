"use client";

import React, { useState, useCallback } from "react";
import { ParameterInput } from "../../components/calculator/ParameterInput";
import { ResultDisplay } from "../../components/calculator/ResultDisplay";
import { SchwarzschildRadiusCalculator } from "../../utils/calculators/schwarzschild-radius";
import type { 
	CalculationParameter, 
	CalculationResult, 
	ValidationResult 
} from "../../types/calculator";

/**
 * 計算ページのメインコンポーネント
 * 将来的に複数の計算機能をサポートする拡張可能な設計
 */
export default function CalculatorPage() {
	// 現在は1つの計算機のみサポート
	const calculator = new SchwarzschildRadiusCalculator();
	
	// 状態管理
	const [parameters, setParameters] = useState<CalculationParameter[]>(
		calculator.getExampleParameters()
	);
	const [results, setResults] = useState<CalculationResult[]>([]);
	const [isCalculating, setIsCalculating] = useState(false);
	const [validationResult, setValidationResult] = useState<ValidationResult>({
		isValid: true,
		errors: [],
		warnings: []
	});

	/**
	 * パラメータ変更ハンドラー
	 */
	const handleParameterChange = useCallback((updatedParameter: CalculationParameter) => {
		setParameters(prev => 
			prev.map(param => 
				param.id === updatedParameter.id ? updatedParameter : param
			)
		);
	}, []);

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
				errors: [error instanceof Error ? error.message : "計算中にエラーが発生しました"],
				warnings: []
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
	}, [calculator]);

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			{/* ページヘッダー */}
			<header className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					物理計算ツール
				</h1>
				<p className="text-gray-600">
					各種物理量の計算を行うことができます。現在はシュワルツシルト半径の計算をサポートしています。
				</p>
			</header>

			{/* 計算機選択（将来の拡張用） */}
			<section className="mb-8">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">計算タイプ</h2>
				<div className="bg-white p-4 rounded-lg border border-gray-200">
					<h3 className="font-medium text-lg text-gray-900">{calculator.displayName}</h3>
					<p className="text-gray-600 text-sm mt-1">{calculator.description}</p>
				</div>
			</section>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 入力セクション */}
				<section className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gray-800">パラメータ入力</h2>
						<button
							type="button"
							onClick={handleLoadExample}
							className="text-blue-600 hover:text-blue-800 text-sm font-medium"
						>
							例の値を読み込み
						</button>
					</div>

					{/* パラメータ入力フォーム */}
					<div className="space-y-4">
						{parameters.map(parameter => (
							<ParameterInput
								key={parameter.id}
								parameter={parameter}
								onChange={handleParameterChange}
								disabled={isCalculating}
							/>
						))}
					</div>

					{/* エラー・警告表示 */}
					{(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
						<div className="space-y-2">
							{validationResult.errors.map((error, index) => (
								<div key={`error-${index}`} className="flex items-center text-red-600 text-sm">
									<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
									{error}
								</div>
							))}
							{validationResult.warnings.map((warning, index) => (
								<div key={`warning-${index}`} className="flex items-center text-yellow-600 text-sm">
									<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
						className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
							isCalculating || !validationResult.isValid
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-blue-600 text-white hover:bg-blue-700"
						}`}
					>
						{isCalculating ? "計算中..." : "計算実行"}
					</button>
				</section>

				{/* 結果セクション */}
				<section className="space-y-6">
					<h2 className="text-xl font-semibold text-gray-800">計算結果</h2>
					
					{results.length > 0 ? (
						<div className="space-y-4">
							{results.map(result => (
								<ResultDisplay key={result.id} result={result} />
							))}
						</div>
					) : (
						<div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
							<div className="text-gray-400 mb-2">
								<svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							</div>
							<p className="text-gray-500">
								パラメータを入力して「計算実行」ボタンを押してください
							</p>
						</div>
					)}
				</section>
			</div>

			{/* 補足情報 */}
			<footer className="mt-12 pt-8 border-t border-gray-200">
				<div className="bg-blue-50 rounded-lg p-6">
					<h3 className="font-semibold text-blue-900 mb-2">シュワルツシルト半径について</h3>
					<p className="text-blue-800 text-sm leading-relaxed">
						シュワルツシルト半径は、ある質量の物体がブラックホールになる際の事象の地平面の半径です。
						この半径以下に質量が圧縮されると、重力が非常に強くなり、光さえも脱出できなくなります。
						計算式は Rs = 2GM/c² で表され、Gは重力定数、Mは質量、cは光速です。
					</p>
				</div>
			</footer>
		</div>
	);
}