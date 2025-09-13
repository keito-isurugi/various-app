import { db } from "@/lib/firebase";
import type { Todo, TodoFormData } from "@/types/todo";
import {
	Timestamp,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

const TODOS_COLLECTION = "todos";

export const todoService = {
	async createTodo(data: TodoFormData): Promise<string> {
		const todoData: any = {
			title: data.title,
			date: Timestamp.fromDate(data.date),
			duration: data.duration,
			completed: false,
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		};

		// Only add optional fields if they have values
		if (data.description) {
			todoData.description = data.description;
		}
		if (data.categoryId) {
			todoData.categoryId = data.categoryId;
		}

		const docRef = await addDoc(collection(db, TODOS_COLLECTION), todoData);
		return docRef.id;
	},

	async updateTodo(id: string, data: Partial<TodoFormData>): Promise<void> {
		const todoRef = doc(db, TODOS_COLLECTION, id);
		const updateData: any = {
			updatedAt: Timestamp.now(),
		};

		// Only add fields that are provided
		if (data.title !== undefined) updateData.title = data.title;
		if (data.description !== undefined)
			updateData.description = data.description;
		if (data.date) updateData.date = Timestamp.fromDate(data.date);
		if (data.duration !== undefined) updateData.duration = data.duration;
		if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;

		await updateDoc(todoRef, updateData);
	},

	async deleteTodo(id: string): Promise<void> {
		await deleteDoc(doc(db, TODOS_COLLECTION, id));
	},

	async toggleTodoComplete(id: string, completed: boolean): Promise<void> {
		const todoRef = doc(db, TODOS_COLLECTION, id);
		await updateDoc(todoRef, {
			completed,
			updatedAt: Timestamp.now(),
		});
	},

	async getTodosByDate(date: Date): Promise<Todo[]> {
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		const q = query(
			collection(db, TODOS_COLLECTION),
			where("date", ">=", Timestamp.fromDate(startOfDay)),
			where("date", "<=", Timestamp.fromDate(endOfDay)),
			orderBy("date"),
		);

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				date: data.date.toDate(),
				createdAt: data.createdAt.toDate(),
				updatedAt: data.updatedAt.toDate(),
			} as Todo;
		});
	},

	async getTodosByDateRange(startDate: Date, endDate: Date): Promise<Todo[]> {
		const q = query(
			collection(db, TODOS_COLLECTION),
			where("date", ">=", Timestamp.fromDate(startDate)),
			where("date", "<=", Timestamp.fromDate(endDate)),
			orderBy("date"),
		);

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				date: data.date.toDate(),
				createdAt: data.createdAt.toDate(),
				updatedAt: data.updatedAt.toDate(),
			} as Todo;
		});
	},

	async getAllTodos(): Promise<Todo[]> {
		const q = query(collection(db, TODOS_COLLECTION), orderBy("date", "desc"));

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				date: data.date.toDate(),
				createdAt: data.createdAt.toDate(),
				updatedAt: data.updatedAt.toDate(),
			} as Todo;
		});
	},
};
