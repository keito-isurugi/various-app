require('dotenv').config({ path: '../.env.local' });

// require in commonjs env
const Qiita = require('qiita-js');

// set your token
Qiita.setToken(process.env.QIITA_ACCESS_TOKEN);
Qiita.setEndpoint('https://qiita.com');

// 記事の内容
const postdata = {
  title: '吾輩は猫である',
  body: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当が.....',
  private: false,
  tags: [{name: '小説'}]
};

// 記事投稿
Qiita.Resources.Item.create_item(postdata)
.then((result) => {
  console.log(result)
})
