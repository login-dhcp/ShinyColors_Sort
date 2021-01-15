const songToHTML = (data) => {
    return `<li><label style="cursor:pointer">
<input type="checkbox" data-checkbox-id="${data['series']}_${data['album']}_${data['song']}" class="select_one">
<span>${data['name']}</span>
</label></li>`
};

const albumToHTML = (data) => {
    html = `<li>
<label style="cursor:pointer">
    <input type="checkbox" data-checkbox-id="${data['series']}_${data['album']}" class="select"><span>${data['name']}</span>
</label>
<div class="collapsible"> | 펼치기</div>
<ul class="collapsible_content">`

    songs_list = dataset['Songs'];

    var songs_cnt = 0;
    for (let i = 0; i < songs_list.length; i++) { // TODO use better algorithm
        song = songs_list[i];
        if (song['album'] === data['album']) {
            songs_cnt += 1;
            html = html.concat(' ', songToHTML(song));
        }
    }
    html = html.concat(' ', '</ul></li>');
    if (songs_cnt === 0) {
        return ''
    } else { return html }

};

const seriesToHTML = (data) => {
    series_common = 'THE IDOLM@STER SHINY COLORS';
    if (data['name'].startsWith(series_common)) {
        name = data['name'].replace(series_common, '');
    } else {
        name = data['name'];
    }

    // html = `<ul><span>${name} series</span><li>`
    html = `<ul><li>`
    html = html.concat('', `<label style="cursor:pointer">
        <input type="checkbox" data-checkbox-id="${data['series']}" class="select"><span>${name} series</span>
    </label><div class="collapsible"> | 펼치기</div>
    <ul class="collapsible_content">`)


    albums_list = dataset['Albums'];

    var albums_cnt = 0;
    for (let i = 0; i < albums_list.length; i++) { // TODO use better algorithm
        album = albums_list[i];
        if (album['series'] === data['series']) {
            albums_cnt += 1;
            html = html.concat(' ', albumToHTML(album));
        }
    }
    html = html.concat(' ', '</ul></li></ul>');
        if (albums_cnt === 0) {
        return ''
    } else { return html }
}


$(parse_dataset())
function parse_dataset() {
    // checkboxs = document.getElementById("sort_list_checkbox");
    checkboxs = document.getElementById("sort_list");

    series = dataset['Series'];
    for (let i = 0; i < series.length; i++) {
        checkboxs.insertAdjacentHTML('beforeend', seriesToHTML(series[i]));
    }

    var coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

}