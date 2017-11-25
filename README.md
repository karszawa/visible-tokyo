# A_make-tokyo-great-again

## Members

唐澤弘明, 嶋田紅緒, 山田万太郎

## URL

https://visible-tokyo.firebaseapp.com

## Local development

### Requirements

```
$ node -v
v8.1.2
$ yarn -v
1.3.2
```

### Build

```
$ git clone git@github.com:InfovisHandsOn/A_make-tokyo-great-again.git
$ cd make-tokyo-great-again
$ yarn
$ npm start # visit localhost:3000
```

## Features

- 住宅探しの観点から東京都の各地域の特色を可視化する
- ひとめで地域ごとの特色がわかる地図を表示する
- 上京してきた大学生の引越しに役立てたい

## Data

優先度順

- 間取りごとの家賃
  - Home'sのAPIが使えるかもしれない
  - 先方の返事待ち
  - suumoをクローリングしたら30分で13万件ぐらい取れたのでこれをつかうことにした
- 駅までの距離
  - 100m、300m、600mの同心円を表示する
  - http://www.ekidata.jp/api/api_line.php
- 犯罪の発生件数
  - 表示方法未定
  - http://www.keishicho.metro.tokyo.jp/about_mpd/jokyo_tokei/jokyo/ninchikensu.html
- 勾配
  - ヒートマップ
  - https://fgd.gsi.go.jp/download/menu.php

## Pear review feedbacks

- 治安どうやって測る？　->　殺人なら100，万引きなら1みたいにするとか
- うるささもわかるといいね
- 人口が多いからその分犯罪が多く見えてしまうかも？　ー＞人口と犯罪のところ合わせたらいいのでは
- 家賃の相場はどう出すの？？　->　間取りごとに相場違うかもじゃん
- 街のおしゃれ度合いが出せたら？
- 大学ごとにどこに住んでいるか出せたらいいのか…？
- 最寄の駅までの平均所要時間
- 交通機関，アクセスが知りたい
- 交通機関可視化できたら面白そう　->　区切りがむずそう
- エリアごとの駅の数がわかるといいかな
- 土地代があるといいかも　（家賃ではなく


## Pear review feedbacks 2

- 地域ごとに1Kが多いとか知れたらいい
- 値段を入れてどこにどれくらい住めるか
- 目的地から何分か+家賃　でエリアが表示できたらいいですね

## Todo

- [x] 交通手段ごとの移動時間を出したほうが良い
- [x] クリックしたときに最寄りの路線にフォーカスさせる
- [x] 近い駅の距離一覧を出す (NOTE: 見ればわかるしいらない)
- [x] WebApp化
- [x] 近い駅の一覧に路線が表示されている (NOTE: 同上)
- [x] 移動距離が徒歩でしか表されていない
- [x] 説明がないのでわかりにくい (NOTE: わかりやすくした)
  - 目的地の設定
- [ ] 近辺の賃貸情報を表示する (NOTE: APIがなかった)
