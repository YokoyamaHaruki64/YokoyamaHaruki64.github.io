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
    chronologicalIndex: 1,
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
    chronologicalIndex: 0,
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
    chronologicalIndex: 2,
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
  }
];
