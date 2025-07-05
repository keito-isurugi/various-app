"use client";
export default function ImageTagAdminPage() {
	return <div>ImageTagAdminPage</div>;
}
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// // タグの型定義
// type Tag = {
//     id: number;
//     name: string;
// };

// // 画像の型定義（タグ情報を含む）
// type Image = {
//     id: number;
//     image_path: string;
//     display_flag: boolean;
//     tags: Tag[]; // 画像に紐づいているタグの情報
// };

// export default function TagImageManagement() {
//     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

//     // 状態管理
//     const [tags, setTags] = useState<Tag[]>([]);
//     const [images, setImages] = useState<Image[]>([]);
//     const [selectedTags, setSelectedTags] = useState<number[]>([]);
//     const [selectedImages, setSelectedImages] = useState<number[]>([]);
//     const [loading, setLoading] = useState(false);

//     // 初期処理: タグ一覧を取得
//     useEffect(() => {
//         const fetchTags = async () => {
//             try {
//                 const res = await axios.get(`${apiBaseUrl}/tags`);
//                 setTags(res.data);
//             } catch (error) {
//                 console.error('Failed to fetch tags:', error);
//             }
//         };
//         fetchTags();
//     }, [apiBaseUrl]);

//     // 選択したタグに紐づいていない画像を取得
//     useEffect(() => {
//         if (selectedTags.length === 0) {
//             setImages([]); // タグが選択解除されたら画像を空に
//             return;
//         }

//         const fetchUntaggedImages = async () => {
//             setLoading(true);
//             try {
//                 const res = await axios.post(`${apiBaseUrl}/images/un_tagged`, {
//                     tag_ids: selectedTags,
//                 });
//                 setImages(res.data); // レスポンスの画像はタグ情報を含む
//             } catch (error) {
//                 console.error('Failed to fetch untagged images:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUntaggedImages();
//     }, [selectedTags, apiBaseUrl]);

//     // タグの選択・選択解除
//     const toggleTagSelection = (tagId: number) => {
//         setSelectedTags((prev) =>
//             prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
//         );
//     };

//     // 画像の選択・選択解除
//     const toggleImageSelection = (imageId: number) => {
//         setSelectedImages((prev) =>
//             prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
//         );
//     };

//     // 一括で選択解除
//     const clearSelections = () => {
//         setSelectedTags([]);
//         setSelectedImages([]);
//     };

//     // 画像とタグを紐づける処理
//     const bindTagsToImages = async () => {
//         setLoading(true);
//         try {
//             await axios.post(`${apiBaseUrl}/image-tags/multi`, {
//                 image_ids: selectedImages,
//                 tag_ids: selectedTags,
//             });
//             alert('タグと画像が紐づけられました！');
//             setSelectedImages([]); // 紐づけ後は選択を解除
//         } catch (error) {
//             console.error('Failed to bind tags and images:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto py-8">
//             <h1 className="text-2xl font-bold mb-4">タグと画像の管理</h1>

//             {/* タグリスト */}
//             <div className="mb-6">
//                 <h2 className="text-xl font-semibold mb-2">タグ一覧</h2>
//                 <div className="flex flex-wrap gap-2">
//                     {tags.map((tag) => (
//                         <button
//                             key={tag.id}
//                             onClick={() => toggleTagSelection(tag.id)}
//                             className={`px-4 py-2 rounded text-black ${
//                                 selectedTags.includes(tag.id) ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                             }`}
//                         >
//                             {tag.name}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* 画像リスト */}
//             <div className="mb-6">
//                 <h2 className="text-xl font-semibold mb-2">画像一覧</h2>
//                 {loading && <p className="text-gray-500">読み込み中...</p>}
//                 {!loading && images?.length === 0 && <p className="text-gray-500">画像がありません。</p>}
//                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {images?.map((image) => (
//                         <div
//                             key={image.id}
//                             className={`relative border rounded ${
//                                 selectedImages.includes(image.id) ? 'border-blue-500' : ''
//                             }`}
//                             onClick={() => toggleImageSelection(image.id)}
//                         >
//                             {/* 画像情報 */}
//                             <img
//                                 src={`${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT_EXTERNAL}/${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}/${image.image_path}`}
//                                 alt="画像"
//                                 className="w-full h-40 object-cover rounded"
//                             />
//                             {/* タグ情報 */}
//                             <div className="mt-2">
//                                 <p className="text-sm font-semibold">タグ:</p>
//                                 <div className="flex flex-wrap gap-1 mt-1">
//                                     {image.tags.map((tag) => (
//                                         <span
//                                             key={tag.id}
//                                             className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded"
//                                         >
//                                             {tag.name}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* アクションボタン */}
//             <div className="flex gap-4">
//                 <button
//                     onClick={clearSelections}
//                     className="px-4 py-2 bg-gray-500 text-white rounded"
//                 >
//                     選択をすべて解除
//                 </button>
//                 <button
//                     onClick={bindTagsToImages}
//                     disabled={selectedTags.length === 0 || selectedImages.length === 0}
//                     className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-green-200"
//                 >
//                     選択中のタグと画像を紐づける
//                 </button>
//             </div>
//         </div>
//     );
// }
