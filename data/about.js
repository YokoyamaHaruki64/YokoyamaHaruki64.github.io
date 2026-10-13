// 各配列へ1件追加するだけで、Aboutの該当欄に反映されます。
// 趣味・興味分野: { title: "項目名", description: "紹介文" }
// 資格: { name: "資格名", acquired: "2026.03", status: "合格", issuer: "発行元", note: "補足" }
// 資格は name のみ必須。実際の取得内容を入力し、任意項目は省略できます。
// 掲載順は配列の順。件数・列数・カードの高さを指定する必要はありません。
window.PORTFOLIO_ABOUT = {
  hobbies: [
    { title: "VJ" },
    { title: "TRPG" }
  ],
  interests: [
    { title: "最適化" },
    { title: "レンダリング" },
    { title: "ゲームプログラム全般" }
  ],
  qualifications: [
    {
      name: "色彩検定3級",
      acquired: "2024/11",
      status: "合格"
    },
    {
      name: "応用情報技術者試験",
      acquired: "2025/07",
      status: "合格"
    },
    {
      name: "CGエンジニア検定エキスパート",
      acquired: "2025/08",
      status: "合格"
    },
    {
      name: "画像処理エンジニア検定エキスパート",
      acquired: "2026/09",
      status: "合格"
    }
  ],
  valuesAreDraft: true,
  values: [
    {
      title: "触って気持ちいい体験を。",
      description: "入力への反応、キャラクターの動き、画面の変化。小さな手触りまで考えたゲームをつくっていきたいです。"
    },
    {
      title: "変化を受け止める設計を。",
      description: "試して、直して、また試す。その繰り返しを支えられるように、機能の役割が分かるコードを目指します。"
    },
    {
      title: "「なぜ？」を、その先へ。",
      description: "動いた理由も、動かなかった理由も確かめる。気づきを次の制作に活かしながら、できることを広げていきたいです。"
    }
  ]
};
