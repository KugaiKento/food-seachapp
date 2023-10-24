//ボタンを押すとこの関数が実行されサーバーサイドに情報を渡します
async function searchLocation() {
    const range = document.getElementById("range").value;
    const count = document.getElementById("count").value;

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // サーバーサイドに位置情報と検索パラメータを送信
            fetch('http://localhost:3000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude, range, count }),
            })
            .then(response => response.json())
            .then(data => {
                // サーバーサイドからの応答を処理
                console.log(data);
                // 帰ってきたjsonをもとにHTMLを生成する関数を実行
                displayDataInHTML(data);
            })
            .catch(error => {
                console.error('データの送信エラー:', error);
            });
        });
    } else {
        console.error("Geolocation is not available in this browser.");
    }
}
// HTML生成関数
async function displayDataInHTML(data) {
    const resultContainer = document.getElementById("result-container");
    const pagesContainer = document.getElementById("pages");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    let currentPage = 0;
    //一回の最大検索数
    const pageSize = 10; 

    // JSONデータから店舗情報の配列を取得
    const shops = data.results.shop;

    function updatePagination() {
        const totalPages = Math.ceil(shops.length / pageSize);
        pagesContainer.textContent = `ページ ${currentPage + 1} / ${totalPages}`;
        prevPageButton.disabled = currentPage === 0;
        nextPageButton.disabled = currentPage === totalPages - 1;
    }

    function displayCurrentPage() {
        // 結果コンテナをクリア
        resultContainer.innerHTML = '';

        // リストを生成
        const ul = document.createElement("ul");
        ul.style.listStyle = "none"; // リストのマーカーを非表示にする

        // 各店舗の情報を処理
        const startIndex = currentPage * pageSize;
        const endIndex = Math.min(startIndex + pageSize, shops.length);
        for (let i = startIndex; i < endIndex; i++) {
            const shop = shops[i];

            // リストアイテムを生成
            const li = document.createElement("li");
            // アイテム間の余白を設定
            li.style.marginBottom = "20px"; 
            li.classList.add("search-result");
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("search-result-item"); 

            // 画像を生成してリストアイテムに追加します
            if (shop.logo_image) {
                const img = document.createElement("img");
                // 画像URLを取得しています
                img.src = shop.photo.mobile.l; 
                img.alt = shop.name;
                li.appendChild(img);
                img.classList.add("search-img");
            }

            // 店舗名を <div> に追加
            const name = document.createElement("h3");
            name.textContent = `店舗名: ${shop.name}`;
            itemContainer.appendChild(name);
           
            // 住所を <div> に追加
            const address = document.createElement("p");
            address.textContent = `アクセス: ${shop.address}`;
            itemContainer.appendChild(address);

            // 詳細
            const link = document.createElement("a");
            link.href = shop.coupon_urls.pc;
            link.innerHTML = "詳細"
            link.classList.add("link")
            link.target = "blank"
            itemContainer.appendChild(link)

            // リストアイテムをリストに追加
            li.appendChild(itemContainer);
            // リストアイテムをリストに追加
            ul.appendChild(li);
        }
        // リストをコンテナに追加
        resultContainer.appendChild(ul);
    }
    // 初期表示
    displayCurrentPage();
    updatePagination();

    // 前へボタンのクリックすると前の検索結果の項目を表示
    prevPageButton.addEventListener("click", (event) => {
        event.preventDefault(); // デフォルトの動作を無効化
        if (currentPage > 0) {
            currentPage--;
            displayCurrentPage();
            updatePagination();
        }
    });

    // 次へボタンのクリックすると次の項目を表示
    nextPageButton.addEventListener("click", (event) => {
        event.preventDefault(); // デフォルトの動作を無効化
        const totalPages = Math.ceil(shops.length / pageSize);
        if (currentPage < totalPages - 1) {
            currentPage++;
            displayCurrentPage();
            updatePagination();
        }
    });
}


