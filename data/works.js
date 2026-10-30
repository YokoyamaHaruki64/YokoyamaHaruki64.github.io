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
    summary: "チームで制作した2Dアクションゲーム。リードプログラマーを務め、コード管理や全体の設計、プレイヤーを主に担当しました。",
    role: "リードプログラマー / コード管理 / 2D簡易物理 / 描画 / フレームワーク設計・実装 / プレイヤー操作 / ステージエディタ制作",
    technologies: ["DirectX11", "C++", "Git", "GitHub"],
    period: { duration: "4ヶ月", timing: "2025年10月〜2026年3月頭" },
    team: "プログラマー6名,プランナー1名,デザイナー3名",
    platform: "Windows11",
    awards: [
      { competition: "2年次進級制作展(HAL EVENT WEEK)", result: "銀賞", medal: "silver", year: "2026" },
    ],
    points: ["初めてのチーム制作でリードプログラマーとして制作を牽引", "フレームワークやそれに伴う描画と物理演算の実装、ステージエディタの制作まで幅広く担当", "入力バッファや操作方法などを検討し、プレイヤーの操作感を改善"],
    details: [
      {
        heading: "担当範囲",
        text: "リードプログラマーとして、プログラム全体の管理と制作進行を担当しました。担当内容は多岐にわたり、描画、物理を含むフレームワーク全般やステージエディタなども担当しました。また、プレイヤーの動作を実装し、操作感を調整しました。"
      },
      {
        heading: "フレームワークについて",
        text: "チームで開発するため、授業で学んだことを実際のプロジェクトで使うという思想のもと、フレームワークを設計・実装しました。\nGameObjectを継承する形で作ったため、拡張性が低く反省点となりましたが、チームでの開発を通して、フレームワーク設計の重要性を学ぶことができました。"
      },
      {
        heading: "プレイヤー操作について",
        text: "本作の肝であるプレイヤー操作の実装を担当しました。ゲーム特有のアクションが多く、どう操作するのが直感的で楽しいかを検討し、数値調整やステート管理を行いました。結果、もちもちとしたプレイヤーの表現と、操作感の良いゲームに仕上げることができました。"
      },
      {
        heading: "物理演算について",
        text: "2Dの簡易物理演算を実装しました。衝突判定はSATによるOBBと円形の判定を実装し、衝突解決は反発係数を考慮した速度の反射と、重なりを解消する位置補正のみを行いました。"
      },
      {
        heading: "ステージエディタについて",
        text: "あるゲームを参考にステージエディタを制作しました。タイル単位で配置し、json形式で保存・読み込みを行うようにしました。このエディタによって複数のステージを制作でき、ボリュームアップやバランス調整に役立ちました。"
      },
      {
        heading: "チーム制作エピソード",
        text: "マスターアップ1か月前に大幅な仕様変更の提案があり、変更に対するリスクヘッジや、面白さを確認する期限を設け、専用のブランチを切って検証を行いました。結果、変更は採用となり、より直感的で楽しいゲームになりました。"
      }
    ],
    downloads: [],
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
    summary: "個人制作の3Dアクションゲーム。制限時間が迫る中、敵に突進して倒していくゲームです。操作をシンプルにし、画面演出などで爽快感を演出することを意識しました。",
    role: "個人制作",
    technologies: ["DirectX11", "C++", "ImGui" ,"Git", "GitHub"],
    period: { duration: "エディタ2週間 / ゲーム2週間", timing: "2026年8月〜9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [],
    points: ["ゲームエディタの制作", "ShaderLab風独自ShaderDSLの開発", "PostProcess演出の実装"],
    details: [
      { heading: "エディタについて",
        text: "Unityのエディタ機能を参考に、独自のゲームエディタを制作しました。GUIはImGuiで構築し、下記の機能などを実装しました。"
      },
      { heading: "エディタ機能-01 独自ShaderDSL",
        text: "ShaderLabを参考に、HLSLを記述できる独自のShaderDSLを設計・実装しました。全てのShaderをこれで記述し、PostProcessも簡単に追加できました"
      },
      { heading: "エディタ機能-02 Serialize",
        text: "SceneやPrefabなどのデータをシリアライズして保存・復元する機能を実装しました。C++のまま型を推論してデータを扱っています。"
      },
      { heading: "エディタ機能-03 EditorGUI",
        text: "各オブジェクトのプロパティを表示・編集する機能を実装しました。前述のSerializerと連携して、データの変更を即座に反映させます。"
      },
      { heading: "AgentAIの活用",
        text: "今回の制作から本格的にAIを活用し、自分で設計をし、AIが実装を行うプロセスを構築しました。"
      },
      { heading: "次の課題",
        text: "エディタとゲーム部分が密結合になっているなど、責務分離に問題がありました。現在はその反省を生かし、別のプロジェクトでエンジン部分の開発を行っています。"
      }
    ],
    downloads: [
      {
        label: "Machina Drive(Google Drive)",
        url: "https://drive.google.com/drive/folders/1urZIzihgiL7bzM6LJLNKrzfIriVBvgNI?usp=sharing",
        filename: "MachinaDrive.zip"
      }
    ],
    links: []
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
    summary: "爆弾を投げて敵を爆破する3Dアクションローグライト。爆風による吹っ飛びやプレイヤーアクションによる爽快感を重視して制作しました。",
    role: "個人制作",
    technologies: ["Unity", "C#"],
    period: { duration: "2週間", timing: "2024年12月末〜2025年1月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [
      { competition: "1年次冬HAL三校合同コンテスト", result: "銀賞", medal: "silver", year: "2025"}],
    points: ["3種類の爆弾の使い分け", "敵の群れを吹き飛ばす爽快感", "爆風を利用したプレイヤーアクション"],
    details: [
        {
          heading: "ゲーム体験",
          text: "大量の敵を倒すようなゲームを作りたい！から始まり、大量に敵を倒せるもの→爆弾という発想になりました。爆風で敵を吹き飛ばす処理とパラメータを最後まで調整し、爽快感を重視したゲーム体験を目指しました。"
        },
        {
          heading: "爆風アクション",
          text: "プレイヤーはダメージを受けずに爆風で吹っ飛ぶことができます。爆風の吹き飛びを利用して、高くジャンプするというアクションを実装しました。爆風のパラメータは敵とプレイヤーでそれぞれ調整し、操作感と爽快感を両立させました。"
        }
    ],
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
    summary: "ボスとの戦闘に特化した3Dアクションゲーム。ボス挙動やプレイヤーの攻撃のヒット感を強く意識して制作しました。",
    role: "個人制作",
    technologies: ["C++", "DirectX11"],
    period: { duration: "2週間", timing: "2025年12月末〜2026年1月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [
      { competition: "2年次冬HAL三校合同コンテスト", result: "技術力賞", year: "2026"}],
    points: ["ShadowMapによる影の描画", "インスタンシング描画による描画負荷の軽減","ボスの状態変化による戦闘の変化"],
    details: [
        {
          heading: "影の描画",
          text: "ShadowMapを用いて影の描画をしました。ShadowMapで影を描画する原理を理解し、実装しました。初めてのDirectX11での3D描画で、影の描画を実装することは大きな挑戦でしたが、影の描画によってゲームの臨場感が増しました。"
        },
        {
          heading: "インスタンシング描画",
          text: "フィールドのブロックを個別オブジェクトとして描画しており、描画負荷が大きくなっていました。負荷の軽減方法を調べてインスタンシングという技術を知り、その仕組みを理解し実装することで、描画負荷を大幅に軽減することができました。"
        },
        {
          heading: "ボスの状態変化",
          text: "ボスの状態変化によって戦闘の変化を意識して制作しました。ボスの体力が減ると攻撃が激化し、避けるのが大変になります。また、状態変化に応じてボスの光り方や背景にも変化を加えて、戦闘の変化を視覚的に表現しました。"
        }
    ],
    downloads: [
    ],
    links: []
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
    summary: "Nintendo Switch向けに制作した2Dアクションゲーム。レールガンを打つ際の演出を強く意識して制作しました。",
    role: "個人制作",
    technologies: ["C++", "Nintendo Switch"],
    period: { duration: "2週間", timing: "2025年9月" },
    team: "個人制作",
    platform: "Nintendo Switch",
    awards: [],
    points: ["レールガンの演出","Switch向けの操作感", "TrailRendererの再実装"],
    details: [
        {
          heading: "レールガンの射撃演出",
          text: "レールガンの射撃の瞬間を追求しました。撃つ直前に画面を暗くしたりや音をフェードアウトしたりし、撃った瞬間の爆発力をより強く感じられるようにしました。溜めて解放するという純粋なカタルシスのみを追い求めました。"
        },
        {
          heading: "Nintendo Switchでの開発",
          text: "学校の開発環境を活用して、Nintendo Switch向けのゲーム開発を行いました。Joy-Conだからこそできる操作を利用しようと考え、チャージする動作を振るという形で表現しました。アクション操作を行いながら行うため、感度を上げて振る動作を軽くし、操作感を調整しました。"
        },
        {
          heading: "TrailRendererの再実装",
          text: "以前の作品でTrailRendererを実装していましたが、描画ライブラリが違うため再度実装しました。前回の課題点(頂点管理が重いなど)を改善し、より軽量なTrailRendererを実装しました。"
        }
    ],
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
    title: "NEXSUSTONE",
    category: "2D Puzzle",
    image: "assets/works/nexustone-title.png",
    imageAlt: "ゲーム「NEXSUSTONE」のタイトル画面",
    media: { type: "youtube", url: "https://youtu.be/ndeyapUNn6s" },
    isSample: false,
    isTeam: false,
    mainTools: ["C++", "DirectX11"],
    tagline: "",
    summary: "落ち物パズルゲーム。落ちてくるブロックを消すだけでなく、消したブロックによってチャージして攻撃することでスコアを獲得できます。",
    role: "個人制作",
    technologies: ["C++", "DirectX11"],
    period: { duration: "2週間", timing: "2025年9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [],
    points: ["初めてのDirectX","TrailRendererの実装", "2Dパーティクルの作成"],
    details: [
        {
          heading: "DirectX11での2D描画",
          text: "初めてDirectX11を扱いました。GPUレンダリングの流れから、DirectX11の描画パイプラインまで理解し、2D描画を実装しました。"
        },
        {
          heading: "TrailRendererの実装",
          text: "UnityのTrailRendererを参考に魔法エフェクトのひとつとして実装しました。2DQuadでほとんどの描画を行っていた中で、TrailRendererは頂点を動的に生成して描画するため、描画の仕組みを理解する良い経験になりました。"
        },
        {
          heading: "2Dパーティクル",
          text: "タイトル画面背景や、カーソル追従のパーティクルを作成しました。頭の中で思い描いていたイメージが、DirectXによって実際に実現できることに感動しました。"
        }
    ],
    downloads: [
      {
      }
    ],
    links: []
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
    summary: "UE5ぷちコンで制作した3Dミニゲーム。走り幅跳びの踏切をテーマ「だん」として、より遠くへ飛ぶことを目指すゲームです。",
    role: "個人制作",
    technologies: ["Unreal Engine"],
    period: { duration: "1週間", timing: "2026年9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [],
    points: ["初めてのUnrealEngine","一瞬に全てをつぎ込むゲーム性", "気軽に出来るカジュアルゲーム"],
    details: [
        {
          heading: "初めてのUnrealEngine",
          text: "UnrealEngineを初めて触り、ブループリントでゲームを制作しました。今まで触ったエンジンや自分のフレームワークにはない機能や設計思想が違う機能が多く、自分の制作に生かせる知見を得ることができました。"
        },
        {
          heading: "カジュアルなゲーム性",
          text: "制作期間が短いこともあり、シンプルなゲーム性にしました。アイテムを集めることでより記録を狙えるが、その分踏切も難しくなるというリスクとリターンのバランスを意識しました。"
        }
    ],
    downloads: [
      {
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
    summary: "初めてUnityで制作した2Dシューティング。時を遅くして弾の間を縫うように避けることで、激しい弾幕を攻略します。",
    role: "個人制作",
    technologies: ["Unity"],
    period: { duration: "3週間", timing: "2024年8月～2024年9月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [ { competition: "1年次夏HAL三校合同コンテスト", result: "技術力賞", year: "2024"} ],
    points: ["初めてのゲーム制作", "時間操作システム", "追尾弾の実装"],
    details: [
        {
          heading: "初めてのゲーム制作",
          text: "自分の最初の作品ということで、とても思い出のある作品です。今見ると粗削りな部分もありますが、自分の考えるように動くものを作っていくというゲーム作りの楽しさを知ることができました。"
        },
        {
          heading: "Unityのビジュアルプログラミング",
          text: "Unityのビジュアルプログラミングで制作しました。コードを書かずにゲームを作るのにあたり、便利な点と不便な点の両方を知ることができました。特に時間操作周りの実装や複雑な計算式はコードで書く方が楽だと感じました。"
        },
        {
          heading: "時間操作システム",
          text: "普通なら避けられないような弾幕を、時間を遅くすることで避けられるようにしました。遅くできる時間をリソースとして扱い、逆に加速することでリソースを回復するという駆け引きが生まれるようにしました。"
        },
        {
          heading: "綺麗な弾幕",
          text: "弾幕の見た目を綺麗にするため、弾の描画にTrailRendererを使用しました。TrailRendererはUnityの機能で、弾の軌跡を描画することができます。"
        },
        {
          heading: "追尾弾の実装",
          text: "自機の最終段階に追尾弾を実装しました。参考動画を見てC#の計算式やコードをビジュアルプログラミングに置き換えて実装しました。立式して解くという基本的な数学ですが、ゲーム制作においてはとても重要な知識であることを学びました。"
        }
    ],
    downloads: [
      {
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
    summary: "コンソールで動作する2Dアクション。コンソールでのフルカラー描画を実装し、色を塗り合う陣取りゲームです。",
    role: "個人制作",
    technologies: ["C++"],
    period: { duration: "1ヶ月", timing: "2025年1月～2025年2月" },
    team: "個人制作",
    platform: "Windows11",
    awards: [{ competition: "1年次進級制作展(HAL EVENT WEEK)", result: "プログラミング賞", year: "2025"}],
    points: ["コンソールでのフルカラー描画", "csvによるデータ管理", "コンソールでのアクションゲーム"],
    details: [
        {
          heading: "フルカラー描画",
          text: "コンソールの背景色と文字色を組み合わせて、フルカラー描画を実装しました。基本色はパレットで作っておいていつでも使えるようにし、必要な部分はグラデーションなどを計算して動的に作るようにしました。"
        },
        {
          heading: "描画の最適化",
          text: "std::coutで描画をしていたのですが、フルカラー描画をする都合上描画が重くなりました。そのため、前回フレームとの差分のみを抽出して位置や色データを取得し、文字列に変換、まとめて出力することで描画負荷を軽減しました。"
        },
        {
          heading: "csvによるデータ管理",
          text: "csvをパースし、ゲーム内のデータを管理する仕組みを実装しました。Excelから作成したcsvには不要なデータが含まれることがあるため、パース時に不要なデータを除外するようにしました。このデータはステージ構造のみならず、アニメーションやタイトル画面などの描画にも利用しました。"
        },
        {
          heading: "当たり判定の調整",
          text: "コンソール描画が特殊なため、当たり判定を見た目と一致させるために式や数値を調整しました。少しのずれが整数座標での描画においては大きなずれとなるため、どのケースでもずれることのないように調整しました。"
        }
    ],
    downloads: [
      {
      }
    ],
    links: []
  },

];
