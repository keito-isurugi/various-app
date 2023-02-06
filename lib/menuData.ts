const menuData = [
  {
    name: '記事',
    id: 'article',
    menus: [
      {name: 'Web記事更新', url: '/article'},
      {name: 'エクセル記事DB更新', url: '/pending'},
      {name: '記事画像アップ', url: '/pending'},
      {name: '記事動画アップ', url: '/pending'},
    ],
  },
  {
    name: '民間',
    id: 'private_construction',
    menus: [
      {name: 'Web民間更新', url: '/private_construction'},
      {name: 'エクセル民間DB更新', url: '/pending'},
      {name: '民間DB削除', url: '/pending'},
    ]
  },
  {
    name: '知事許可',
    id: 'governor_permission',
    menus: [
      {name: 'Web知事許可更新', url: '/governor_permission'},
      {name: 'エクセル知事許可DB更新', url: '/pending'},
      {name: '知事許可DB削除', url: '/pending'},
    ]
  },
]

export default menuData