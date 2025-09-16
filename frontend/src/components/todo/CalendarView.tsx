"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalendarViewProps {
	selectedDate: Date;
	onSelectDate: (date: Date) => void;
}

export function CalendarView({
	selectedDate,
	onSelectDate,
}: CalendarViewProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>カレンダー</CardTitle>
			</CardHeader>
			<CardContent>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => date && onSelectDate(date)}
					className="rounded-md border"
				/>
			</CardContent>
		</Card>
	);
}
