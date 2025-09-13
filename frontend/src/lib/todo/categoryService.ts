import { db } from "@/lib/firebase";
import type { Category, CategoryFormData } from "@/types/todo";
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
} from "firebase/firestore";

const CATEGORIES_COLLECTION = "categories";

export const categoryService = {
	async createCategory(data: CategoryFormData): Promise<string> {
		const categoryData: any = {
			title: data.title,
			color: data.color,
			createdAt: Timestamp.now(),
			updatedAt: Timestamp.now(),
		};

		// Only add optional fields if they have values
		if (data.description) {
			categoryData.description = data.description;
		}

		const docRef = await addDoc(
			collection(db, CATEGORIES_COLLECTION),
			categoryData,
		);
		return docRef.id;
	},

	async updateCategory(
		id: string,
		data: Partial<CategoryFormData>,
	): Promise<void> {
		const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
		const updateData: any = {
			updatedAt: Timestamp.now(),
		};

		// Only add fields that are provided
		if (data.title !== undefined) updateData.title = data.title;
		if (data.description !== undefined)
			updateData.description = data.description;
		if (data.color !== undefined) updateData.color = data.color;

		await updateDoc(categoryRef, updateData);
	},

	async deleteCategory(id: string): Promise<void> {
		await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
	},

	async getAllCategories(): Promise<Category[]> {
		const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("title"));

		const querySnapshot = await getDocs(q);
		return querySnapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				id: doc.id,
				...data,
				createdAt: data.createdAt.toDate(),
				updatedAt: data.updatedAt.toDate(),
			} as Category;
		});
	},
};
