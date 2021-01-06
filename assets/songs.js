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
    document.getElementById("sort_left_audio").src = links['audio'][key1];

    let rightImage = document.getElementById('sort_right_image');
    // rightImage.src = "images/" + String(key2) + ".png";
    rightImage.src = links['image'][key2];
    rightImage.width = 256;
    rightImage.height = 256;
    document.getElementById("sort_right_button").innerText = key2;
    document.getElementById("sort_right_audio").src = links['audio'][key2];
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
    var checkboxs = document.querySelectorAll(`input[data-checkbox-id]`);
    for (let i = 0; i < checkboxs.length; i++) {
        // $(inputElements[i]).prop("checked", value);
        if (checkboxs[i].checked !== value) {
            checkboxs[i].click();
        }
    }
    return;
}

// code for parent checkboxs selecting all childs
$(function() {
    var checkboxs = document.querySelectorAll(`input[data-checkbox-id]`);
    for (let i = 0; i < checkboxs.length; i++) {
        var parent_checkbox_id = checkboxs[i].getAttribute('data-checkbox-id');
        var child_checkboxs = document.querySelectorAll(`input[data-checkbox-id^="${parent_checkbox_id}_"]`);
        // if isparent
        if (child_checkboxs.length != 0) {
            // link childs to parents
            $(checkboxs[i]).change(function() {
                var parent_checkbox_id = checkboxs[i].getAttribute('data-checkbox-id');
                var child_checkboxs = document.querySelectorAll(`input[data-checkbox-id^="${parent_checkbox_id}_"]`);
                for (let j = 0; j < child_checkboxs.length; j++) {
                    $(child_checkboxs[j]).prop('checked', $(this).prop('checked'));
                }
            });

            // 3 state checkboxs for parents
            for (let j = 0; j < child_checkboxs.length; j++) {
                child_checkboxs[j].addEventListener('change', function() {
                    let cnt = 0;
                    let my_checkbox_id = $(this).prop('dataset')['checkboxId'];
                    let parent_checkbox_id = my_checkbox_id.substring(0, my_checkbox_id.length - 3);
                    var parent_checkbox = document.querySelectorAll(`input[data-checkbox-id="${parent_checkbox_id}"]`);
                    var sibling_checkboxs = document.querySelectorAll(`input[data-checkbox-id^="${parent_checkbox_id}_"]`);

                    for (let k = 0; k < sibling_checkboxs.length; k++) {
                        if (sibling_checkboxs[k].checked) {
                            cnt += 1;
                        }
                    }

                    if (cnt === sibling_checkboxs.length) {
                        $(parent_checkbox).
                        prop("indeterminate", false).
                        prop('checked', true);
                    } else if (cnt === 0) {
                        $(parent_checkbox).
                        prop('indeterminate', false).
                        prop('checked', false);
                    } else {
                        $(parent_checkbox).prop('indeterminate', true);
                    }
                });
            }
        }
    }
});

// link startSort() to sort_start button
document.getElementById("sort_start").addEventListener("click", startSort, false);

// link select all/disselect all to buttons
document.getElementById("btn_select_all").addEventListener("click", selectAll(true), false);
document.getElementById("btn_select_none").addEventListener("click", selectAll(false), false);

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