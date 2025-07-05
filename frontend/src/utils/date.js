export const formatDateToJapanese = (dateString) => {
	const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

	// Dateオブジェクトを生成
	const date = new Date(dateString);

	// 年、月、日、曜日、時、分を取得
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const dayOfWeek = daysOfWeek[date.getDay()];
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	// フォーマットに合わせて整形
	return `${year}/${month}/${day}/(${dayOfWeek}) ${hours}:${minutes}`;
};
