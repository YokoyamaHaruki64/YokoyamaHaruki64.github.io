// 配列に1件追加すると、カルーセル・概要・モーダルへ自動で反映されます。
// image は一覧用画像。動画は media: { type: "video", src: "assets/work.mp4" } または media: { type: "youtube", url: "https://youtu.be/動画ID" } を任意で設定します。
// 動画は詳細モーダル内で再生し、YouTubeは埋め込みプレーヤーと外部リンクを表示します。
// links は { label, url } の配列です。
// 実作品に差し替える際は isSample を false にし、期間・体制なども更新します。
window.PORTFOLIO_WORKS = [
  {
    id: "furisuru-furisuru",
    title: "ふりするフリスル",
    category: "2D Action",
    image: "assets/furisuru-title.png",
    imageAlt: "ゲームタイトル「ふりするフリスル」のロゴ",
    isSample: false,
    tagline: "はねて、ふりして、飛びまわれ！",
    summary: "チーム制作で開発した2Dアクションゲーム。リードプログラマーを務め、コード管理や全体の設計、プレイヤーを主に担当しました。",
    role: "リードプログラマー / コード管理 / 2D簡易物理 / 描画 / フレームワーク設計・実装 / プレイヤー操作 / ステージエディタ制作",
    technologies: ["DirectX11", "C++", "Git", "GitHub"],
    period: "4ヶ月（2025年10月～2026年3月）",
    team: "プログラマー6名,プランナー1名,デザイナー3名",
    platform: "Windows11",
    points: ["初めてのチーム制作で、リードプログラマーとして制作を牽引", "フレームワークやそれに伴う描画と物理演算の実装、ステージエディタの制作まで幅広く担当", "入力バッファや操作方法などを検討し、プレイヤーの操作感を改善"],
    details: [
      { heading: "担当範囲", text: "リードプログラマーとして、プログラム全体の管理と制作進行を担当しました。担当内容は多岐にわたり、描画、物理を含むフレームワーク全般やステージエディタなども担当しました。また、プレイヤーの動作を実装し、操作感を調整しました。" },
      { heading: "課題と設計", text: "ジャンプ入力が受け付けられない場面を減らすため、入力バッファと接地判定を分離する構成を想定しています。採用した理由や比較した方法をここで説明します。" },
      { heading: "検証・次の課題", text: "操作感の検証条件、改善前後の比較、残っている制約を掲載する欄です。現時点では実装・計測結果はありません。" }
    ],
    links: []
  },
  {
    id: "prism-puzzle",
    title: "Prism Puzzle",
    category: "PUZZLE",
    image: "assets/work-prism.svg",
    imageAlt: "紫色の立体ブロックを組み合わせた仮作品のイメージ",
    isSample: true,
    tagline: "組み合わせから、答えを見つける。",
    summary: "ブロックを組み替えて道をつなぐパズル。盤面管理と、操作に応じたフィードバックを想定しています。",
    role: "盤面管理 / パズル判定 / UI（想定）",
    technologies: ["Unity", "C#"],
    period: "未設定",
    team: "チーム制作（想定・人数未設定）",
    platform: "Windows（想定）",
    points: ["盤面データと見た目を分離する構成", "取り消し・やり直しを扱う操作履歴の管理"],
    details: [
      { heading: "担当範囲", text: "盤面の状態管理、クリア判定、操作UIを担当する想定です。実作品では自分の担当範囲が分かる画面や処理図を添えてください。" },
      { heading: "課題と設計", text: "パズルのルール追加に対応するため、盤面の状態と表示を独立させる設計例です。操作履歴を保存し、取り消しや再実行へ利用する構成を想定しています。" },
      { heading: "検証・次の課題", text: "境界条件での判定や操作履歴の整合性を検証する欄です。現時点では実装・計測結果はありません。" }
    ],
    links: []
  },
  {
    id: "little-garden",
    title: "Little Garden",
    category: "SIMULATION",
    image: "assets/work-garden.svg",
    imageAlt: "緑の木々と小さな庭を描いた仮作品のイメージ",
    isSample: true,
    tagline: "小さな世界を、育てていく。",
    summary: "小さな庭を育てるシミュレーション。時間経過による変化と、セーブ・ロードを想定しています。",
    role: "成長システム / セーブ・ロード（想定）",
    technologies: ["Unity", "C#", "JSON"],
    period: "未設定",
    team: "個人制作（想定）",
    platform: "Windows（想定）",
    points: ["成長パラメータをデータで管理", "保存データのバージョンと互換性を考慮"],
    details: [
      { heading: "担当範囲", text: "植物の成長、時間管理、セーブとロードを実装する想定です。ゲーム全体の中で担当機能が果たす役割を説明する欄です。" },
      { heading: "課題と設計", text: "植物の種類を増やしやすいよう、成長条件を独立したデータとして管理する構成例です。セーブデータの更新や欠損への対応方針も記載します。" },
      { heading: "検証・次の課題", text: "長時間経過時の挙動や保存・復元の検証結果を掲載する欄です。現時点では実装・計測結果はありません。" }
    ],
    links: []
  },
  {
    id: "render-lab",
    title: "Render Lab",
    category: "TECHNICAL DEMO",
    image: "assets/work-render.svg",
    imageAlt: "黄色のワイヤーフレームを描いた仮の描画デモのイメージ",
    isSample: true,
    tagline: "画面の向こうの、仕組みを知る。",
    summary: "シェーダーや描画処理を試す技術デモ。表現と処理負荷を比較する作品案です。",
    role: "描画処理 / シェーダー / 計測（想定）",
    technologies: ["C++", "DirectX", "HLSL"],
    period: "未設定",
    team: "個人制作（想定）",
    platform: "Windows（想定）",
    points: ["描画パスの責務とデータの流れを整理", "同一条件で表現と処理負荷を比較"],
    details: [
      { heading: "担当範囲", text: "描画処理とシェーダーの実装、表示結果の比較を行う想定です。技術検証としての目的と対象範囲を記載します。" },
      { heading: "課題と設計", text: "見た目と描画コストのバランスを検証するサンプルです。パラメータを変更しやすくし、比較条件をそろえる方針を想定しています。" },
      { heading: "検証・次の課題", text: "計測環境、フレーム時間、画質の比較を載せる欄です。現時点では実装・計測結果はありません。" }
    ],
    links: []
  }
];
