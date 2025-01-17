"use client";

import { useState, useEffect } from "react";

// タグデータ型
interface Tag {
    id: number;
    name: string;
}

const ManageTagsPage = () => {
    const [tags, setTags] = useState<Tag[]>([]); // タグ一覧
    const [newTag, setNewTag] = useState(""); // 新規タグ入力欄
    const [editingTag, setEditingTag] = useState<{ id: number; name: string } | null>(null); // 編集中のデータ

    // タグ一覧取得
    const fetchTags = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/tags");
            if (!response.ok) throw new Error("Failed to fetch tags");
            const data = await response.json();
            setTags(data);
        } catch (err) {
            console.error(err);
        }
    };

    // タグを登録
    const handleSaveTag = async () => {
        if (!newTag.trim()) return; // 入力欄が空の場合無視
        try {
            const response = await fetch("http://localhost:8080/api/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTag }),
            });
            if (!response.ok) throw new Error("Failed to create tag");
            setNewTag(""); // 入力欄をクリア
            fetchTags(); // 更新
        } catch (err) {
            console.error(err);
        }
    };

    // タグを削除
    const handleDeleteTag = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tags/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete tag");
            fetchTags(); // 更新
        } catch (err) {
            console.error(err);
        }
    };

    // 編集ボタン押下処理
    const handleEditTag = (tag: Tag) => {
        setEditingTag(tag); // 編集モードに変更
    };

    // タグを更新
    const handleUpdateTag = async () => {
        if (!editingTag || !editingTag.name.trim()) return;
        try {
            const response = await fetch(`http://localhost:8080/api/tags/${editingTag.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingTag.id, name: editingTag.name }),
            });
            if (!response.ok) throw new Error("Failed to update tag");
            setEditingTag(null); // 編集モードを解除
            fetchTags(); // 更新
        } catch (err) {
            console.error(err);
        }
    };

    // 初回読み込み時、データ取得
    useEffect(() => {
        fetchTags();
    }, []);

    return (
        <div className="p-6">
            {/* タイトル */}
            <h1 className="text-2xl font-bold mb-6">タグ管理</h1>

            {/* 新規タグ登録 */}
            <div className="mb-6 flex gap-2">
                <input
                    className="border p-2 rounded-md flex-1 text-black"
                    type="text"
                    placeholder="新しいタグを入力"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={handleSaveTag}
                >
                    保存
                </button>
            </div>

            {/* タグ一覧 */}
            <ul className="space-y-4">
                {tags.map((tag) => (
                    <li key={tag.id} className="flex justify-between items-center">
                        {/* 編集モード */}
                        {editingTag?.id === tag.id ? (
                            <div className="flex gap-2 flex-1">
                                <input
                                    className="border p-2 rounded-md flex-1 text-black"
                                    type="text"
                                    value={editingTag.name}
                                    onChange={(e) =>
                                        setEditingTag({ ...editingTag, name: e.target.value })
                                    }
                                />
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                    onClick={handleUpdateTag}
                                >
                                    更新
                                </button>
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => setEditingTag(null)}
                                >
                                    キャンセル
                                </button>
                            </div>
                        ) : (
                            // 通常表示モード
                            <>
                                <span>{tag.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                                        onClick={() => handleEditTag(tag)}
                                    >
                                        編集
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                        onClick={() => handleDeleteTag(tag.id)}
                                    >
                                        削除
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageTagsPage;
