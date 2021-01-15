function findSongByKey(key) {
    songs = dataset['Songs'];
    for (let i=0; i<songs.length; i++) {
        song = songs[i];
        if (song['name'] === key) {
            return song;
        }
    }
}


function setVSScreen(key1, key2) {
    leftSong = findSongByKey(key1);
    let leftImage = document.getElementById('sort_left_image');
    leftImage.src = leftSong['image'];
    leftImage.width = 256;
    leftImage.height = 256;
    document.getElementById("sort_left_button").innerText = key1;
    document.getElementById("sort_left_audio").src = leftSong['audio'];

    rightSong = findSongByKey(key2);
    let rightImage = document.getElementById('sort_right_image');
    rightImage.src = rightSong['image'];
    rightImage.width = 256;
    rightImage.height = 256;
    document.getElementById("sort_right_button").innerText = key2;
    document.getElementById("sort_right_audio").src = rightSong['audio'];
}

function beatutify(results) {
    let result_str = 'Result<br />';
    for (let i = 0; i < results.length; i++) {
        result = results[i];
        key = result[1][0];
        rank = result[1][2];

        song = findSongByKey(key);
        result_str += ` ${String(rank)}위: ${song['name']}<br />`
        result_str += `<img class="img" src="${song['image']}" style='width:256; height:256;'><br />`
        result_str += `<audio controls src="${song['audio']}"></audio><br />`;
    }
    return result_str;

}