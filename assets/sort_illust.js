function setVSScreen(key1, key2) {
    let leftImage = document.getElementById('sort_left_image');
    leftImage.src = "src/illust/" + String(key1) + ".png";
    // leftImage.src = links['image'][key1];
    leftImage.width = 568;
    leftImage.height = 320;
    document.getElementById("sort_left_button").innerText = key1;
    // document.getElementById("sort_left_audio").src = links['audio'][key1];

    let rightImage = document.getElementById('sort_right_image');
    rightImage.src = "src/illust/" + String(key2) + ".png";
    // rightImage.src = links['image'][key2];
    rightImage.width = 568;
    rightImage.height = 320;
    document.getElementById("sort_right_button").innerText = key2;
    // document.getElementById("sort_right_audio").src = links['audio'][key2];
}

function beatutify(result) {
    let result_str = 'Result<br />';
    for (let i = 0; i < result.length; i++) {
        data = result[i];
        result_str += ' ' + String(data[1][2]) + '위: ';
        result_str += String(data[1][0]);
        result_str += '<br />'
        result_str += `<img class="img" src="src/illust/${data[1][0]}.png" style='width:568; height:320;'>`
        // result_str += '<br />';
        // result_str += `<audio controls src="${links['audio'][data[1][0]]}"></audio>`;
        result_str += '<br />';
    }
    return result_str;

}