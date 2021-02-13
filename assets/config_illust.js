var configs = {};

configs.Imsize = [568, 320];
configs.HideKeys = ['image'];

///////////////////////////////
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "./src/dataset/dataset_illust.csv",
        dataType: "text",
        success: function(data) { buildHTMLWithDataset(data, ','); }
    });
});

// text = `name,unit,name_kr,name_jp,card_type,card_rarity,idx_in_rarity,image
// 【ほわっとスマイル】櫻木真乃,illumination STARS,사쿠라기 마노,櫻木真乃,P,SSR,1,https://shinycolors.info/wiki/특수:넘겨주기/file/【ほわっとスマイル】櫻木真乃.png?width=800
// 【ナチュラルモード】櫻木真乃,illumination STARS,사쿠라기 마노,櫻木真乃,P,SR,1,https://shinycolors.info/wiki/특수:넘겨주기/file/【ナチュラルモード】櫻木真乃.png?width=800`

// buildHTMLWithDataset(text);