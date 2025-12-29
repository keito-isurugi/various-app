export type Combi = {
	id: string;
	name: string;
};

export type Judge = {
	id: string;
	name: string;
};

export type Tournament = {
	id: string;
	year: number;
	period: 1 | 2;
	judgeIds: string[];
};

export type Stage = "first" | "final";

export type Performance = {
	id: string;
	tournamentId: string;
	combiId: string;
	stage: Stage;
	order: number;
	totalScore?: number;
	totalVotes?: number;
	rank: number;
};

export type Score = {
	performanceId: string;
	judgeId: string;
	score: number;
};
