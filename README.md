This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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

## Qiita API(投稿)
- 使用ライブラリ：[qiita](https://github.com/increments/qiita-js/tree/master)
- 公式ドキュメント：https://qiita.com/api/v2/docs#%E6%8A%95%E7%A8%BF
## Zenn自動投稿
- 作成中