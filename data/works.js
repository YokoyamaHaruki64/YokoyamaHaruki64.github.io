// 配列に1件追加すると、作品一覧と詳細モーダルへ自動で反映されます。
// image は一覧用画像。動画は media: { type: "video", src: "assets/work.mp4" } または media: { type: "youtube", url: "https://youtu.be/動画ID" } を任意で設定します。
// 動画は詳細モーダル内で再生し、YouTubeは埋め込みプレーヤーと外部リンクを表示します。
// links は { label, url } の配列です。
// downloads は { label: "Windows版（ZIP）", url: "downloads/game.zip", filename: "game.zip" } の配列です。外部の配布URLも指定でき、filename は省略可能です。
// awards は { competition: "大会名", result: "銀賞", medal: "silver", year: "2026" } の配列です。result と year は省略可能です。
// isTeam はチーム制作なら true。mainTools は一覧で見せる主な開発環境・技術です。
// period は { duration: "4ヶ月", timing: "2025年10月〜2026年3月" } の形式です。
// index はおすすめ順、chronologicalIndex は時系列表示の新しい順です。同じ値はこの配列で上にある作品を優先します。
// 実作品に差し替える際は isSample を false にし、期間・体制なども更新します。
window.PORTFOLIO_WORKS = [
  {
    id: "furisuru-furisuru",
    index: 0,
    chronologicalIndex: 6,
    title: "ふりするフリスル",
    category: "2D Action",
    image: "assets/works/furisuru-title.png",
    imageAlt: "ゲーム「ふりするフリスル」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/Qo8GYWGb5pU" },
    isSample: false,
    isTeam: true,
    mainTools: ["C++", "DirectX 11"],
    tagline: "はねて、ふりして、飛びまわれ！",
    summary: "10人チームで制作した2Dバウンドアクション。サブリーダー兼リードプログラマーとして、フレームワークや物理エンジン、ステージエディタなど、制作の土台を担当しました。",
    role: "リードプログラマー / コード管理 / 2D簡易物理 / 描画 / フレームワーク設計・実装 / プレイヤー操作 / ステージエディタ制作",
    technologies: ["DirectX11", "C++", "Git", "GitHub"],
    period: { duration: "約5か月", timing: "2025年10月〜2026年3月初頭" },
    team: "プログラマー6名,プランナー1名,デザイナー3名",
    platform: "Windows11",
    awards: [
      { competition: "2年次進級制作展(HAL EVENT WEEK)", result: "銀賞", medal: "silver", year: "2026" },
    ],
    detailsPath: "data/details/furisuru-furisuru.md",
    downloads: [
      {
        label: "ふりするフリスル(Google Drive)",
        url: "https://drive.google.com/drive/folders/1wPGKzEvkjA-w7WpJFBTgQz5If4FzWBeB?usp=sharing",
        filename: "ふりするフリスル.zip"
      }
    ],
    links: []
  },
  {
    id: "machina-drive",
    index: 1,
    chronologicalIndex: 9,
    title: "Machina Drive",
    category: "3D Action",
    image: "assets/works/machinadrive-title.png",
    imageAlt: "ゲーム「Machina Drive」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/Tlb3Cqbm5iI" },
    isSample: false,
    isTeam: false,
    mainTools: ["C++", "DirectX 11", "ImGui"],
    tagline: "あがけ、最後の一瞬まで",
    summary: "DirectX 11で制作した3Dアクション。制限時間の中で敵に突進し、連続撃破を狙うウェーブサバイバルです。ImGui製エディタや独自のShaderDSLなど、制作環境の開発にも大きく力を入れました。",
    role: "個人制作",
    technologies: ["DirectX11", "C++", "ImGui" ,"Git", "GitHub"],
    period: { duration: "エディタ2週間 / ゲーム2週間", timing: "2026年8月〜9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [],
    detailsPath: "data/details/machina-drive.md",
    downloads: [
      {
        label: "Machina Drive(Google Drive)",
        url: "https://drive.google.com/drive/folders/1urZIzihgiL7bzM6LJLNKrzfIriVBvgNI?usp=sharing",
        filename: "MachinaDrive.zip"
      }
    ],
    links:
    [
      {
        label: "GitHubリポジトリ",
        url: "https://github.com/YokoyamaHaruki64/MachinaDrive",
      }
    ]
  },
  {
    id: "rockrock-explosion",
    index: 2,
    chronologicalIndex: 1,
    title: "RockRock☆Explosion!!",
    category: "3D Action",
    image: "assets/works/rockrockexplosion-title.png",
    imageAlt: "ゲーム「RockRock☆Explosion!!」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/jlnMevfWygQ" },
    isSample: false,
    isTeam: false,
    mainTools: ["Unity", "C#"],
    tagline: "今日からキミもボマー！",
    summary: "爆弾を投げて敵を爆破する3Dアクション。ローグライト風にウェーブごとに強化していき、爆風で敵の群れを吹き飛ばす爽快感を重視して制作しました。",
    role: "個人制作",
    technologies: ["Unity", "C#"],
    period: { duration: "2週間", timing: "2024年12月末〜2025年1月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [
      { competition: "1年次冬HAL三校合同コンテスト", result: "銀賞", medal: "silver", year: "2025"}],
    detailsPath: "data/details/rockrock-explosion.md",
    downloads: [
      {
        label: "RockRock☆Explosion!!(Google Drive)",
        url: "https://drive.google.com/drive/folders/1l0LEQuMpkzTEpCkzu4L6_PrNoDAIdLIn?usp=sharing",
        filename: "RockRockExplosion.zip"
      }
    ],
    links: []
  },
  {
    id: "full-burst",
    index: 3,
    chronologicalIndex: 5,
    title: "Full Burst!!",
    category: "3D Action",
    image: "assets/works/fullburst-title.png",
    imageAlt: "ゲーム「Full Burst!!」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/xT1L_y-cCxM" },
    isSample: false,
    isTeam: false,
    mainTools: ["C++", "DirectX11"],
    tagline: "放て、フルバースト！",
    summary: "DirectX 11で制作した3Dボス戦アクション。リムライトや影などの描画に挑戦しながら、レーザーを撃ちまくるボスとの戦闘を作りました。",
    role: "個人制作",
    technologies: ["C++", "DirectX11"],
    period: { duration: "2週間", timing: "2025年12月末〜2026年1月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [
      { competition: "2年次冬HAL三校合同コンテスト", result: "技術力賞", year: "2026"}],
    detailsPath: "data/details/full-burst.md",
    downloads: [
      {
        label: "Full Burst!!(Google Drive)",
        url: "https://drive.google.com/drive/folders/1MkebvVkr_tLHpqfK6HHFnQcUV4T1QYiK?usp=sharing",
        filename: "FullBurst.zip"
      }
    ],
    links: [
      {
        label: "GitHubリポジトリ",
        url: "https://github.com/YokoyamaHaruki64/full-burst",
      }
    ]
  },
  {
    id: "accel-arc",
    index: 4,
    chronologicalIndex: 3,
    title: "ACCEL ARC",
    category: "2D Action",
    image: "assets/works/accelarc-title.jpg",
    imageAlt: "ゲーム「ACCEL ARC」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/QXxv7N9SUy4" },
    isSample: false,
    isTeam: false,
    mainTools: ["C++", "Nintendo Switch"],
    tagline: "放て、レールガン！",
    summary: "Nintendo Switch向けに制作した2Dアクション。Joy-Conを振ってエネルギーを回復し、溜めてレールガンを撃つ瞬間の演出を追求しました。",
    role: "個人制作",
    technologies: ["C++", "Nintendo Switch"],
    period: { duration: "2週間", timing: "2025年9月" },
    team: "個人制作",
    platform: "Nintendo Switch",
    awards: [],
    detailsPath: "data/details/accel-arc.md",
    downloads: [
      {
      }
    ],
    links: []
  },
  {
    id: "nexustone",
    index: 5,
    chronologicalIndex: 4,
    title: "NEXUSTONE",
    category: "2D Puzzle",
    image: "assets/works/nexustone-title.png",
    imageAlt: "ゲーム「NEXUSTONE」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/ndeyapUNn6s" },
    isSample: false,
    isTeam: false,
    mainTools: ["C++", "DirectX11"],
    tagline: "",
    summary: "初めてDirectX 11で制作した落ち物パズル。ブロックを消して溜めた宝石のパワーを、虹色の宝石へ放つことでスコアを獲得します。",
    role: "個人制作",
    technologies: ["C++", "DirectX11"],
    period: { duration: "2週間", timing: "2025年9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [],
    detailsPath: "data/details/nexustone.md",
    downloads: [
      {
        label: "NEXUSTONE(Google Drive)",
        url: "https://drive.google.com/drive/folders/14c8_SxtjaMO1IMXPOaA_hKC411PGYOoo?usp=sharing",
        filename: "NEXUSTONE.zip"
      }
    ],
    links: [
      {
        label: "GitHubリポジトリ",
        url: "https://github.com/YokoyamaHaruki64/NEXUSTONE",
      }
    ]
  },
  {
    id: "stronglongjump",
    index: 6,
    chronologicalIndex: 8,
    title: "Strong Long Jump",
    category: "3D Minigame",
    image: "assets/works/stronglongjump-title.png",
    imageAlt: "ゲーム「Strong Long Jump」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/mQG01HcTHKE" },
    isSample: false,
    isTeam: false,
    mainTools: ["Unreal Engine"],
    tagline: "目指せ最高の「ダン！！」",
    summary: "Unreal Engineで制作した、走り幅跳びを題材にしたカジュアルゲーム。助走と踏切の一瞬で飛距離が決まります。",
    role: "個人制作",
    technologies: ["Unreal Engine"],
    period: { duration: "1週間", timing: "2026年9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [],
    detailsPath: "data/details/stronglongjump.md",
    downloads: [
      {
        label: "Strong Long Jump (Google Drive)",
        url: "https://drive.google.com/drive/folders/18WJdJsu01sa-HV2cRkIINOAajnQkySZM?usp=sharing",
        filename: "StrongLongJump.zip"
      }
    ],
    links: []
  },
  {
    id: "chronos-shot",
    index: 7,
    chronologicalIndex: 0,
    title: "Chronos Shot",
    category: "2D Shooting",
    image: "assets/works/chronosshot-title.png",
    imageAlt: "ゲーム「Chronos Shot」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/mUPFRQt6iQw" },
    isSample: false,
    isTeam: false,
    mainTools: ["Unity"],
    tagline: "時間を操って勝利を掴め！",
    summary: "初めて制作した2Dシューティング。Unityのビジュアルプログラミングで制作し、時間を遅くして弾幕の隙間を縫うことで攻略します。",
    role: "個人制作",
    technologies: ["Unity"],
    period: { duration: "3週間", timing: "2024年8月～2024年9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [ { competition: "1年次夏HAL三校合同コンテスト", result: "技術力賞", year: "2024"} ],
    detailsPath: "data/details/chronos-shot.md",
    downloads: [
      {
        label: "Chronos Shot(Google Drive)",
        url: "https://drive.google.com/drive/folders/1PF6MwdAo6WHbjKAiB_xF-5BNXyru1zqI?usp=sharing",
        filename: "ChronosShot.zip"
      }
    ],
    links: []
  },
    {
    id: "suisai-utopia",
    index: 8,
    chronologicalIndex: 2,
    title: "水彩ユートピア",
    category: "2D Console Action",
    image: "assets/works/suisaiutopia-title.png",
    imageAlt: "ゲーム「水彩ユートピア」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/pTQIeBc07bI" },
    isSample: false,
    isTeam: false,
    mainTools: ["C++"],
    tagline: "世界を自分色に染め上げろ！",
    summary: "コンソールで動作する2Dアクション。『スプ○トゥーン』を参考に、フルカラー描画で色を塗り合う陣取りゲームとして制作しました。",
    role: "個人制作",
    technologies: ["C++"],
    period: { duration: "1ヶ月", timing: "2025年1月～2025年2月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [{ competition: "1年次進級制作展(HAL EVENT WEEK)", result: "プログラミング賞", year: "2025"}],
    detailsPath: "data/details/suisai-utopia.md",
    downloads: [
    ],
    links: [
      {
        label: "GitHubリポジトリ",
        url: "https://github.com/YokoyamaHaruki64/suisai-utopia",
      }

    ]
  },
  {
    id: "project-hestia",
    index: 9,
    chronologicalIndex: 10,
    title: "Project Hestia",
    category: "Game Engine",
    isSample: false,
    isTeam: false,
    mainTools: ["C++23", "DirectX 12"],
    summary: "C++23とDirectX 12で開発中の自作ゲームエンジン。エンジン内部はArchetype型ECS、ゲーム側はScriptで書ける2層構成で、大量のオブジェクトを高速に処理することを目指しています。",
    role: "エンジンの設計・実装",
    technologies: ["C++23", "DirectX 12"],
    period: { duration: "開発中", timing: "2026年9月〜" },
    team: "個人制作",
    platform: "Windows",
    detailsPath: "data/details/project-hestia.md",
    downloads: [
    ],
    links: [
      {
        label: "GitHubリポジトリ",
        url: "https://github.com/YokoyamaHaruki64/Hestia",
      }
    ]

  },
];
