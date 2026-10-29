// 各配列へ1件追加するだけで、Aboutの該当欄に反映されます。
// 趣味・興味分野: { title: "項目名", description: "紹介文" }
// 資格: { name: "資格名", acquired: "2026.03", status: "合格", issuer: "発行元", note: "補足" }
// 資格は name のみ必須。実際の取得内容を入力し、任意項目は省略できます。
// 掲載順は配列の順。件数・列数・カードの高さを指定する必要はありません。
window.PORTFOLIO_ABOUT = {
  hobbies: [
    {
      title: "VRVJ",
      lead: "曲の盛り上がりに映像をドンピシャで合わせる瞬間が最高に気持ちいい",
      description: "VRChatのイベントを中心にVJとして出演しています。用意した映像を選び、ビートに合わせて切り替えたり、エフェクトをかけたりするプリVJが主な活動です。\n\n曲の雰囲気に合わせて色を選び、曲調やジャンルによって切り替えの頻度や10種類以上のエフェクトを使い分けています。VRChatのイベントがリアル開催された際にも出演しています。",
      photos: [
        { src: "assets/hobbys/VRVJ.jpg", width: 3840, height: 2160, alt: "大型スクリーンの映像とピンクの光が広がるVRChatのイベント会場", caption: "VRChatでのイベント風景" },
        { src: "assets/hobbys/IMG_2799.jpg", width: 2880, height: 2160, alt: "VJの操作卓越しに見える会場と大型スクリーン", caption: "VRChatのイベントがリアル開催された際の出演風景" }
      ]
    },
    {
      title: "TRPG — CoC",
      description: "クトゥルフ神話TRPG（CoC）を、主にプレイヤーとして遊んでいます。シナリオ終盤で、それまでの出来事や手がかりがつながる瞬間が好きです。プレイヤー同士の掛け合いから生まれる感動も、楽しみの一つです。"
    }
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
  ]
};
