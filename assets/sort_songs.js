function setVSScreen(key1, key2) {
    let leftImage = document.getElementById('sort_left_image');
    // leftImage.src = "images/" + String(key1) + ".png";
    leftImage.src = links['image'][key1];
    leftImage.width = 256;
    leftImage.height = 256;
    document.getElementById("sort_left_button").innerText = key1;
    document.getElementById("sort_left_audio").src = links['audio'][key1];

    let rightImage = document.getElementById('sort_right_image');
    // rightImage.src = "images/" + String(key2) + ".png";
    rightImage.src = links['image'][key2];
    rightImage.width = 256;
    rightImage.height = 256;
    document.getElementById("sort_right_button").innerText = key2;
    document.getElementById("sort_right_audio").src = links['audio'][key2];
}

function beatutify(result) {
    let result_str = 'Result<br />';
    for (let i = 0; i < result.length; i++) {
        data = result[i];
        result_str += ' ' + String(data[1][2]) + '위: ';
        result_str += String(data[1][0]);
        result_str += '<br />'
        result_str += `<img class="img" src="${links['image'][data[1][0]]}" style='width:256; height:256;'>`
        result_str += '<br />';
        result_str += `<audio controls src="${links['audio'][data[1][0]]}"></audio>`;
        result_str += '<br />';
    }
    return result_str;

}