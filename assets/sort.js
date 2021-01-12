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
var Cands_league = [];
var max_score = 0;
var cur_score = 0;
var sort_method = "original";

function startSort() {
    var selector = document.querySelector('input[name="sort_method"]:checked');
    if (selector) {
        sort_method = selector.value;
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
    } else {
        alert('소트 방법을 선택해주세요')
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
    if (sort_method === 'tournament') {
        let len_entry = Object.keys(entryList).length;
        max_score = Math.ceil(Math.log(len_entry)) + 1; //TODO
        cur_score = 0;
    } else if (sort_method === 'league') {
        let len_entry = Object.keys(entryList).length;
        max_score = len_entry - 1;
        cur_score = 0;
    } else {
        alert('notImplementedError');
    }

}


function initCands(cur_score) {
    Cands_new = {};
    for (let entry of Object.entries(entryList)) {
        if (entry[1] === cur_score) {
            Cands_new[entry[0]] = entry[1];
        }
    }
    Cands = Cands_new;

    if (sort_method === 'league') {
        Cands_league = [];
        for (let i = 0; i < Object.keys(Cands).length; i++) {
            for (let j = i + 1; j < Object.keys(Cands).length; j++) {
                Cands_league.push([i, j]);
            }
        }
    }
}

function nextVS_tournament() {
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

function nextVS_league() {
    if (Cands_league.length > 0) {
        var rnd = Math.floor(Math.random() * Cands_league.length);
        compare = Cands_league[rnd];
        Cands_league.splice(rnd, 1);

        idx1 = compare[0];
        idx2 = compare[1];
        if (Math.random() > 0.5) {
            [idx1, idx2] = [idx2, idx1];
        }

        key1 = Object.keys(Cands)[idx1];
        key2 = Object.keys(Cands)[idx2];

        setVSScreen(key1, key2);
    } else {
        if (Cands_league.length === 0) {
            changeSortPhaseTo('done');
            getResult();
            return;
        }
    }
}


function nextVS() {
    if (cur_score === max_score) {
        changeSortPhaseTo('done');
        getResult();
        return;
    }

    if (sort_method == 'tournament') {
        nextVS_tournament();
    } else if (sort_method == 'league') {
        nextVS_league();
    } else {
        alsert('notImplementedError');
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

function selectAll() {
    changeAllCheckboxTo(true);
}

function selectNone() {
    changeAllCheckboxTo(false);
}

function changeAllCheckboxTo(value) {
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
document.getElementById("btn_select_all").addEventListener("click", selectAll, false);
document.getElementById("btn_select_none").addEventListener("click", selectNone, false);


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