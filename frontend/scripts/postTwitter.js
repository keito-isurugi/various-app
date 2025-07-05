require("dotenv").config({ path: "../.env.local" });

const { TwitterApi } = require("twitter-api-v2");

const twitterClient = new TwitterApi({
	appKey: process.env.TWITTER_API_KEY,
	appSecret: process.env.TWITTER_API_SECRET,
	accessToken: process.env.TWITTER_ACCESS_TOKEN,
	accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

async function postTweet() {
	await twitterClient.v2.tweet(
		"Qiitaの記事を更新しました。\nhttps://qiita.com/keito-isurugi/items/25d4168e3367c3a9be2e\n\nzennの記事を更新しました。\nhttps://zenn.dev/i_keito/articles/129872c8-f4a6-809f-a838-e3f430b36342\nブログ記事を更新しました。\nhttps://kei-talk.vercel.app/blog/posts/129872c8-f4a6-809f-a838-e3f430b36342",
	);
}

postTweet();
