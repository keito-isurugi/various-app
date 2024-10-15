## 概要
- Next.jsで作成したブログサイトです
- 記事はNotionで管理しています
- Notionで記事を作成、更新すると自動で下記の処理などを行います
  - Markdown形式で本リポジトリに保存される。commit, pushも自動で行う。
  - ブログサイトに自動で反映
  - Qiitaに記事を自動で投稿、更新
  - Zennに記事を自動で投稿、更新

## Notion API(ページ一覧取得、ページ詳細取得、マークダウン形式のファイルを保存)
- 公式ドキュメント：https://developers.notion.com/docs/getting-started
- ページ詳細のデータ構造
```
{
  object: 'page',
  id: 'f5e43de7-5a43-4241-b7e6-81a5caaaa42a',
  created_time: '2024-09-27T14:30:00.000Z',
  last_edited_time: '2024-09-27T14:55:00.000Z',
  created_by: { object: 'user', id: 'e49da549-a9e5-4132-a749-eae2df4a2363' },
  last_edited_by: { object: 'user', id: 'e49da549-a9e5-4132-a749-eae2df4a2363' },
  cover: null,
  icon: null,
  parent: {
    type: 'database_id',
    database_id: '10e872c8-f4a6-80a8-b9e2-fae0bf580e02'
  },
  archived: false,
  in_trash: false,
  properties: {
    created_at: {
      id: 'B%3CBu',
      type: 'created_time',
      created_time: '2024-09-27T14:30:00.000Z'
    },
    ID: { id: 'Bg%3B%5E', type: 'unique_id', unique_id: [Object] },
    tag: { id: 'YHfH', type: 'multi_select', multi_select: [Array] },
    updated_at: {
      id: 'fX%5DT',
      type: 'last_edited_time',
      last_edited_time: '2024-09-27T14:55:00.000Z'
    },
    title: { id: 'title', type: 'title', title: [Array] }
  },
  url: 'https://www.notion.so/f5e43de75a434241b7e681a5caaaa42a',
  public_url: null
}
```

## Qiita自動投稿(投稿、更新)
- 使用ライブラリ：[qiita](https://github.com/increments/qiita-js/tree/master)
- 公式ドキュメント：https://qiita.com/api/v2/docs#%E6%8A%95%E7%A8%BF

## Zenn自動投稿
- /articles内のファイルが更新が本リポジトリにcommitされることで自動投稿される
- 公式：https://zenn.dev/zenn/articles/connect-to-github