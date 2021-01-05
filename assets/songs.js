function changeSortPhaseTo(value) {
    let elem = document.getElementById('sort_main');
    let phaseAttr = 'sort-phase';
    elem.setAttribute(phaseAttr, value);
    if (value === "done") {
        let startButton = document.getElementById("sort_start");
        startButton.innerText = "Retry?";

        let sortDescriptionMain = document.getElementById("sort_description_main");
        sortDescriptionMain.innerText = "* 재시도하려면 Retry버튼을 눌러주세요";

    } else if (value === "ready") {
        let startButton = document.getElementById("sort_start");
        startButton.innerText = "Start";

        let sortDescriptionMain = document.getElementById("sort_description_main");
        sortDescriptionMain.innerText = "* 비교할 인물들을 선택한 후 Start 버튼을 눌러주세요";

    }
}


///////////////////////////////////////////////
var entryList = {};
var Cands = {};
var max_score = 0;
var cur_score = 0;


function startSort() {
    let elem = document.getElementById('sort_main');
    let phaseAttr = 'sort-phase';
    let phase = elem.getAttribute(phaseAttr);
    if (phase == "done") {
        changeSortPhaseTo("ready");
        return;
    } else if (phase == "ready") {
        if (getEntryList().length === 0) {
            alert('목록에서 한 개 이상 선택해주세요');
            return;
        } else {
            setCands();
            setMaxScore();
            initCands(cur_score);
            changeSortPhaseTo('ongoing');
            nextVS();
            return;
        }
    } else {
        alert('진행중인 소트를 끝내거나 창을 새로고침해주세요')
        return;
    }
}

function getEntryList() {
    let entrySelected = document.querySelectorAll('input[class^=select_one]:checked');
    return entrySelected;
}


function setCands() {
    let entrySelected = getEntryList();
    var entryList_new = {};
    for (let i = 0; i < entrySelected.length; i++) {
        let elem = entrySelected[i].nextElementSibling;
        let key = elem.innerText;
        // key = checked_boxs[i].labels[0].innerText;
        entryList_new[key] = 0;
    }
    entryList = entryList_new;
}

function setMaxScore() {
    let len_entry = Object.keys(entryList).length;
    max_score = Math.ceil(Math.log(len_entry)) + 1; //TODO
    cur_score = 0;
}


function initCands(cur_score) {
    Cands_new = {};
    for (let entry of Object.entries(entryList)) {
        if (entry[1] === cur_score) {
            Cands_new[entry[0]] = entry[1];
        }
    }
    Cands = Cands_new;
}

function setVSScreen(key1, key2) {
    let leftImage = document.getElementById('sort_left_image');
    // leftImage.src = "images/" + String(key1) + ".png";
    leftImage.src = links['image'][key1];
    leftImage.width = 256;
    leftImage.height = 256;
    document.getElementById("sort_left_button").innerText = key1;
    document.getElementById("sort_left_audio").src=links['audio'][key1];

    let rightImage = document.getElementById('sort_right_image');
    // rightImage.src = "images/" + String(key2) + ".png";
    rightImage.src = links['image'][key2];
    rightImage.width = 256;
    rightImage.height = 256;
    document.getElementById("sort_right_button").innerText = key2;
    document.getElementById("sort_right_audio").src=links['audio'][key2];
}

function nextVS() {
    if (cur_score === max_score) {
        changeSortPhaseTo('done');
        getResult();
        return;
    }

    len_cands = Object.keys(Cands).length
    if (len_cands > 1) {
        let rnd1 = Math.floor(Math.random() * Object.keys(Cands).length);
        key1 = Object.keys(Cands)[rnd1];
        delete Cands[key1];

        let rnd2 = Math.floor(Math.random() * Object.keys(Cands).length);
        key2 = Object.keys(Cands)[rnd2];
        delete Cands[key2];
        setVSScreen(key1, key2);
    } else {
        if (len_cands === 1) {
            if (cur_score + 1 === max_score) {
                changeSortPhaseTo('done');
                getResult();
                return;
            } else {
                key = Object.keys(Cands)[0];
                entryList[key] += 1;
            }
        }
        cur_score += 1;
        initCands(cur_score);
        nextVS();
    }
}


function next(elemName) {
    let elem = document.getElementById(elemName);
    let key = elem.innerText;
    entryList[key] += 1;

    nextVS();
}


function showResult(result_str) {
    let elem = document.getElementById("sort_result");
    //elem.setAttribute(innerText, result_str);
    elem.innerHTML = result_str;
}

function getResult() {
    let result = Object.entries(entryList).sort(function(a, b) {
        return a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0;
    })

    for (let i = 0; i < result.length; i++) {
        entry = result[i];
        if (i == 0) {
            entry.push(1);
        } else {
            entry_ = result[i - 1];
            score = entry[1];
            score_ = entry_[1];
            if (score === score_) {
                entry.push(entry_[2]);
            } else {
                entry.push(i + 1);
            }
        }
    }

    result = Object.entries(result).sort(function(a, b) {
        return a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0;
    })
    result_str = beatutify(result);
    showResult(result_str);
}

function beatutify(result) {
    let result_str = 'Result<br />';
    for (let i = 0; i < result.length; i++) {
        data = result[i];
        result_str += ' ' + String(data[1][2]) + '위: ';
        result_str += String(data[1][0]);
        result_str += '<br />'
        result_str += `<img class="img" src="${links['image'][data[1][0]]}" style='width:256; height:256;'>`
        // result_str += '<br />';
        result_str += `<audio controls src="${links['audio'][data[1][0]]}"></audio>`;
        result_str += '<br />';
    }
    return result_str;

}


function selectAll(value) {
    // inputElements = document.querySelectorAll(`input[id^=entry_]`);
    inputElements = document.querySelectorAll(`input[id^=select_all]`);
    for (let i = 0; i < inputElements.length; i++) {
        // $(inputElements[i]).prop("checked", value);
        if (inputElements[i].checked !== value) {
            inputElements[i].click();
        }
    }
    return;
}

//////

$(function() {
    var selectmanyList = document.querySelectorAll(`input[data-id^=album]`);
    console.log('i', selectmanyList);
    for (let i = 0; i < selectmanyList.length; i++) {
        let entry = selectmanyList[i].getAttribute('data-id').split(":")[1];
        console.log(entry);

        e = selectmanyList[i];
        for (let j=0; j<10; j++) {
            console.log('e', e);
            e = e.nextElementSibling;
            console.log('ee', e);
        }

        $(selectmanyList[i]).change(function() {
            select_ones = document.querySelectorAll(`input[id^=entry_${entry}_]`);
            for (let j = 0; j < select_ones.length; j++) {
                $(select_ones[j]).prop('checked', $(this).prop('checked'));
            }
        });

        select_ones = document.querySelectorAll(`input[id^=entry_${entry}]`);
        for (let j = 0; j < select_ones.length; j++) {
            select_one = select_ones[j];
            select_one.addEventListener('change', function() {
                let cnt = 0;

                select_ones_ = document.querySelectorAll(`input[id^=entry_${entry}]`);
                for (let k = 0; k < select_ones_.length; k++) {
                    if (select_ones_[k].checked) {
                        cnt += 1;
                    }
                }
                if (cnt === select_ones.length) {
                    $(selectmanyList[i]).
                    prop("indeterminate", false).
                    prop('checked', true);
                } else if (cnt === 0) {
                    $(selectmanyList[i]).
                    prop('indeterminate', false).
                    prop('checked', false);
                } else {
                    $(selectmanyList[i]).prop('indeterminate', true);
                }
            });
        }
    }

});


function open_collapsed() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", open_collapsed);
}