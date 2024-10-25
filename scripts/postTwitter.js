// ローカル環境で動作確認する際に使用。GitHubActionsで実行する際はRepository secretsに環境変数を設定しておく
require("dotenv").config({ path: "../.env.local" });

const { TwitterApi } = require('twitter-api-v2');

// Instantiate with desired auth type (here's Bearer v2 auth)
// const twitterClient = new TwitterApi(process.env.BEARER_TOKEN);
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET
});
// Tell typescript it's a readonly app
// const readOnlyClient = twitterClient.readWrite;

async function postTweet() {
  // Play with the built in methods
  // const user = await readOnlyClient.v2.userByUsername('@isuke4977');
  await twitterClient.v2.tweet('Hello, this is a test.');
}

postTweet();
