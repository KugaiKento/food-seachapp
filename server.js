const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
dotenv.config(); // .env ファイルから環境変数を読み込む
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async (req, res) => {
    //クライアントの入力情報を受け取りその後返します
    // 緯度、経度、検索範囲、検索数の情報をクライアントから取得
    const { latitude, longitude, range, count } = req.body;
    console.log("受け取った位置情報 - 緯度:", latitude, "経度:", longitude);

    const apiKey = "apiキーを入れてください";

    // グルメサーチAPIからjsonを取得
    const apiUrl = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${apiKey}&lat=${latitude}&lng=${longitude}&range=${range}&count=${count}&format=json`;

    try {
        const apiResponse = await axios.get(apiUrl);
        res.json(apiResponse.data);
    } catch (err) {
        console.error('外部APIからデータを取得中にエラーが発生しました:', err);
        res.status(500).json({ error: 'エラーが発生しました' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`サーバーがポート ${port} で実行中です`);
});
