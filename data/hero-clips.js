// Heroには data/works.js の全作品が並びます。この配列で各作品の素材を上書きできます。
// パスは index.html からの相対パスです。
// 動画は assets/hero/videos/、専用サムネイルは assets/hero/thumbnails/ に配置します。
// video が空の作品はサムネイルを表示し、作品詳細に案内します。
// 作品一覧にない動画は workId の代わりに title を指定できます。
window.PORTFOLIO_HERO_CLIPS = [
  {
    workId: "furisuru-furisuru",
    video: "", // 例: "assets/hero/videos/furisuru.mp4"
    thumbnail: "assets/works/furisuru-title.png", // 例: "assets/hero/thumbnails/furisuru.webp"
  },
  {
    workId: "machina-drive",
    video: "",
    thumbnail: "assets/works/machinadrive-title.png",
  },
  {
    workId: "full-burst",
    video: "",
    thumbnail: "assets/works/fullburst-title.png",
  },
  {
    workId: "accel-arc",
    video: "",
    thumbnail: "assets/works/accelarc-title.jpg",
  },
];
