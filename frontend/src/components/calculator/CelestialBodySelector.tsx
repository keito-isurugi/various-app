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
		<div className="space-y-4">
			<label
				htmlFor="celestial-body-selector"
				className="block text-sm font-semibold text-foreground flex items-center gap-2"
			>
				<span className="text-lg">🌌</span>
				天体を選択
			</label>

			<div className="relative">
				<select
					id="celestial-body-selector"
					value={selectedBodyId || ""}
					onChange={handleSelectChange}
					disabled={disabled}
					className="input appearance-none bg-background pr-12 text-lg font-medium cursor-pointer disabled:cursor-not-allowed hover:border-primary transition-colors"
				>
					<option value="">🌟 手動で質量を入力</option>
					<optgroup label="🪐 太陽系の天体">
						{solarSystemBodies.map((body) => (
							<option key={body.id} value={body.id}>
								{body.nameJa} ({body.name})
							</option>
						))}
					</optgroup>
					<optgroup label="⭐ 恒星">
						{stars.map((body) => (
							<option key={body.id} value={body.id}>
								{body.nameJa} ({body.name})
							</option>
						))}
					</optgroup>
				</select>

				{/* Custom dropdown arrow */}
				<div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
					<svg
						className="w-5 h-5 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Dropdown arrow</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</div>

			{selectedBody && (
				<div className="card bg-primary/5 border-primary/20 animate-slide-up">
					<div className="p-4">
						<div className="flex items-start gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shrink-0">
								<span className="text-white text-lg">
									{selectedBody.category === "solar_system" ? "🪐" : "⭐"}
								</span>
							</div>
							<div className="flex-1 min-w-0">
								<div className="font-bold text-foreground text-lg">
									{selectedBody.nameJa}
								</div>
								<div className="text-sm text-muted-foreground mb-2">
									{selectedBody.name}
								</div>
								<div className="space-y-1">
									<div className="text-sm">
										<span className="font-medium text-foreground">質量:</span>{" "}
										<span className="font-bold text-primary">
											{formatMass(selectedBody.mass)}
										</span>
									</div>
									{selectedBody.radius && (
										<div className="text-sm">
											<span className="font-medium text-foreground">半径:</span>{" "}
											<span className="font-bold text-primary">
												{selectedBody.radius >= 1e6
													? `${(selectedBody.radius / 1e6).toFixed(2)} × 10⁶ m`
													: `${selectedBody.radius.toExponential(2)} m`}
											</span>
										</div>
									)}
									<div className="text-sm text-muted-foreground">
										<span className="font-medium">比較:</span>{" "}
										{getMassComparison(selectedBody.mass).description}
									</div>
									{selectedBody.description && (
										<div className="text-sm text-muted-foreground mt-2 p-2 bg-secondary rounded-lg">
											{selectedBody.description}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
