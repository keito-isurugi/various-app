export default (req, res) => {
  const page = req.query.page //クエリパラメータの取得
  let result = [];
  if (page < 5) {
    //0～99を返す
    result = [...Array(100).keys()].map(i => i + page * 100)
  }

  //処理成功
  res.statusCode = 200
  res.json(result)
}