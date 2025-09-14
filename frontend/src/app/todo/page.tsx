"use client";

import { CSVImportModal } from "@/components/todo/CSVImportModal";
import { CalendarViewV2 } from "@/components/todo/CalendarViewV2";
import { Header } from "@/components/todo/Header";
import { ProgressSection } from "@/components/todo/ProgressSection";
import { TodoList } from "@/components/todo/TodoList";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function TodoPage() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [refreshKey, setRefreshKey] = useState(0);
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);

	const handleTodoChange = () => {
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<div className="min-h-screen bg-background">
			<Header />

			<main className="container mx-auto px-4 py-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold">カレンダー</h2>
					<Button
						variant="outline"
						onClick={() => setIsImportModalOpen(true)}
						className="flex items-center gap-2"
					>
						<Upload className="h-4 w-4" />
						CSVインポート
					</Button>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
					<div>
						<CalendarViewV2
							key={refreshKey}
							selectedDate={selectedDate}
							onSelectDate={setSelectedDate}
						/>
					</div>

					<div className="space-y-6">
						<TodoList
							selectedDate={selectedDate}
							onTodoChange={handleTodoChange}
						/>
						<ProgressSection
							selectedDate={selectedDate}
							key={`progress-${refreshKey}`}
						/>
					</div>
				</div>
			</main>

			<CSVImportModal
				isOpen={isImportModalOpen}
				onClose={() => setIsImportModalOpen(false)}
				onImportComplete={handleTodoChange}
			/>
		</div>
	);
}
