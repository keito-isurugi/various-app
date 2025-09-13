import type {
	Category,
	CategoryFormData,
	Todo,
	TodoFormData,
} from "@/types/todo";

const TODOS_KEY = "todos";
const CATEGORIES_KEY = "categories";

// Helper functions
const generateId = () =>
	Math.random().toString(36).substring(2) + Date.now().toString(36);

const getFromStorage = <T>(key: string): T[] => {
	if (typeof window === "undefined") return [];
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]) => {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(data));
};

// Todo Service
export const localTodoService = {
	async createTodo(data: TodoFormData): Promise<string> {
		const todos = getFromStorage<Todo>(TODOS_KEY);
		const newTodo: Todo = {
			id: generateId(),
			...data,
			completed: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		todos.push(newTodo);
		saveToStorage(TODOS_KEY, todos);
		return newTodo.id;
	},

	async updateTodo(id: string, data: Partial<TodoFormData>): Promise<void> {
		const todos = getFromStorage<Todo>(TODOS_KEY);
		const index = todos.findIndex((t) => t.id === id);
		if (index !== -1) {
			todos[index] = {
				...todos[index],
				...data,
				date: data.date || todos[index].date,
				updatedAt: new Date(),
			};
			saveToStorage(TODOS_KEY, todos);
		}
	},

	async deleteTodo(id: string): Promise<void> {
		const todos = getFromStorage<Todo>(TODOS_KEY);
		const filtered = todos.filter((t) => t.id !== id);
		saveToStorage(TODOS_KEY, filtered);
	},

	async toggleTodoComplete(id: string, completed: boolean): Promise<void> {
		const todos = getFromStorage<Todo>(TODOS_KEY);
		const index = todos.findIndex((t) => t.id === id);
		if (index !== -1) {
			todos[index].completed = completed;
			todos[index].updatedAt = new Date();
			saveToStorage(TODOS_KEY, todos);
		}
	},

	async getTodosByDate(date: Date): Promise<Todo[]> {
		const todos = getFromStorage<Todo>(TODOS_KEY);
		const startOfDay = new Date(date);
		startOfDay.setHours(0, 0, 0, 0);
		const endOfDay = new Date(date);
		endOfDay.setHours(23, 59, 59, 999);

		return todos
			.map((todo) => ({
				...todo,
				date: new Date(todo.date),
				createdAt: new Date(todo.createdAt),
				updatedAt: new Date(todo.updatedAt),
			}))
			.filter((todo) => {
				const todoDate = new Date(todo.date);
				return todoDate >= startOfDay && todoDate <= endOfDay;
			})
			.sort((a, b) => a.date.getTime() - b.date.getTime());
	},

	async getTodosByDateRange(startDate: Date, endDate: Date): Promise<Todo[]> {
		const todos = getFromStorage<Todo>(TODOS_KEY);
		return todos
			.map((todo) => ({
				...todo,
				date: new Date(todo.date),
				createdAt: new Date(todo.createdAt),
				updatedAt: new Date(todo.updatedAt),
			}))
			.filter((todo) => {
				const todoDate = new Date(todo.date);
				return todoDate >= startDate && todoDate <= endDate;
			})
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	},

	async getAllTodos(): Promise<Todo[]> {
		const todos = getFromStorage<Todo>(TODOS_KEY);
		return todos.map((todo) => ({
			...todo,
			date: new Date(todo.date),
			createdAt: new Date(todo.createdAt),
			updatedAt: new Date(todo.updatedAt),
		}));
	},
};

// Category Service
export const localCategoryService = {
	async createCategory(data: CategoryFormData): Promise<string> {
		const categories = getFromStorage<Category>(CATEGORIES_KEY);
		const newCategory: Category = {
			id: generateId(),
			...data,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		categories.push(newCategory);
		saveToStorage(CATEGORIES_KEY, categories);
		return newCategory.id;
	},

	async updateCategory(
		id: string,
		data: Partial<CategoryFormData>,
	): Promise<void> {
		const categories = getFromStorage<Category>(CATEGORIES_KEY);
		const index = categories.findIndex((c) => c.id === id);
		if (index !== -1) {
			categories[index] = {
				...categories[index],
				...data,
				updatedAt: new Date(),
			};
			saveToStorage(CATEGORIES_KEY, categories);
		}
	},

	async deleteCategory(id: string): Promise<void> {
		const categories = getFromStorage<Category>(CATEGORIES_KEY);
		const filtered = categories.filter((c) => c.id !== id);
		saveToStorage(CATEGORIES_KEY, filtered);
	},

	async getAllCategories(): Promise<Category[]> {
		const categories = getFromStorage<Category>(CATEGORIES_KEY);
		return categories
			.map((cat) => ({
				...cat,
				createdAt: new Date(cat.createdAt),
				updatedAt: new Date(cat.updatedAt),
			}))
			.sort((a, b) => a.title.localeCompare(b.title));
	},
};
