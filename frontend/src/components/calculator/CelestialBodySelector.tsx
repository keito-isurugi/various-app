"use client";

import type React from "react";
import {
	celestialBodies,
	getCelestialBodiesByCategory,
} from "../../data/celestial-bodies";
import type { CelestialBody } from "../../data/celestial-bodies";
import { formatMass, getMassComparison } from "../../utils/mass-comparison";

interface CelestialBodySelectorProps {
	selectedBodyId: string | null;
	onBodySelect: (body: CelestialBody | null) => void;
	disabled?: boolean;
}

export const CelestialBodySelector: React.FC<CelestialBodySelectorProps> = ({
	selectedBodyId,
	onBodySelect,
	disabled = false,
}) => {
	const solarSystemBodies = getCelestialBodiesByCategory("solar_system");
	const stars = getCelestialBodiesByCategory("star");

	const selectedBody = selectedBodyId
		? celestialBodies.find((body) => body.id === selectedBodyId)
		: null;

	const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const bodyId = event.target.value;
		if (bodyId === "") {
			onBodySelect(null);
		} else {
			const body = celestialBodies.find((b) => b.id === bodyId);
			onBodySelect(body || null);
		}
	};

	return (
		<div className="space-y-3">
			<label
				htmlFor="celestial-body-selector"
				className="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>
				天体を選択
			</label>
			<select
				id="celestial-body-selector"
				value={selectedBodyId || ""}
				onChange={handleSelectChange}
				disabled={disabled}
				className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
					backgroundPosition: "right 0.5rem center",
					backgroundRepeat: "no-repeat",
					backgroundSize: "1.5em 1.5em",
				}}
			>
				<option value="">手動で質量を入力</option>
				<optgroup label="太陽系の天体">
					{solarSystemBodies.map((body) => (
						<option key={body.id} value={body.id}>
							{body.nameJa} ({body.name})
						</option>
					))}
				</optgroup>
				<optgroup label="恒星">
					{stars.map((body) => (
						<option key={body.id} value={body.id}>
							{body.nameJa} ({body.name})
						</option>
					))}
				</optgroup>
			</select>
			{selectedBody && (
				<div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-md p-3">
					<div className="text-sm text-blue-800 dark:text-blue-200">
						<div className="font-medium">
							{selectedBody.nameJa} ({selectedBody.name})
						</div>
						<div className="text-xs mt-1 text-blue-600 dark:text-blue-300">
							質量: {formatMass(selectedBody.mass)}
						</div>
						<div className="text-xs mt-1 text-blue-600 dark:text-blue-300 font-medium">
							{getMassComparison(selectedBody.mass).description}
						</div>
						{selectedBody.description && (
							<div className="text-xs mt-1 text-blue-600 dark:text-blue-300">
								{selectedBody.description}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
