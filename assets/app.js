function changeSortPhaseTo(value) {
    let elem = document.getElementById('sortMain');
    let phaseAttr = 'sort-phase';
    elem.setAttribute(phaseAttr, value);
    if (value === "done") {
        let startButton = document.getElementById("sortStart");
        startButton.innerText = "Retry?";

        let sortDescriptionMain = document.getElementById("sortDescriptionMain");
        sortDescriptionMain.innerText = "* 재시도하려면 Retry버튼을 눌러주세요";

    } else if (value === "ready") {
        let startButton = document.getElementById("sortStart");
        startButton.innerText = "Start";

        let sortDescriptionMain = document.getElementById("sortDescriptionMain");
        sortDescriptionMain.innerText = "* 비교할 인물들을 선택한 후 Start 버튼을 눌러주세요";

    }
}


///////////////////////////////////////////////
var Idols = {};
var Cands = {};
var max_score = 0;
var cur_score = 0;

function startSort() {
    let elem = document.getElementById('sortMain');
    let phaseAttr = 'sort-phase';
    let phase = elem.getAttribute(phaseAttr);
    if (phase == "done") {
        changeSortPhaseTo("ready");
        return;
    } else if (phase == "ready") {
        var inputElements = document.querySelectorAll('input[id^=entry]:checked');
        if (inputElements.length === 0) {
            alert('한 명 이상의 인물을 선택해주세요');
            return;
        } else {
            setIdols();
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

function setIdols() {
    var inputElements = document.querySelectorAll('input[id^=entry]:checked');

    Idols_new = {};
    for (let i = 0; i < inputElements.length; i++) {
        key = inputElements[i].labels[0].innerText;
        Idols_new[key] = 0;
    }
    Idols = Idols_new;
}

function setMaxScore() {
    let len_idols = Object.keys(Idols).length;
    max_score = Math.ceil(Math.log(len_idols)) + 1; //TODO
    cur_score = 0;
}


function initCands(cur_score) {
    Cands_new = {};
    for (let entry of Object.entries(Idols)) {
        if (entry[1] === cur_score) {
            Cands_new[entry[0]] = entry[1];
        }
    }
    Cands = Cands_new;
}

function setVSScreen(key1, key2) {
    let left = document.getElementById('sortLeftImage');
    left.src = "images/" + String(key1) + ".png";
    left.width = 568;
    left.height = 320;
    document.getElementById("sortLeftButton").innerText = key1;

    let right = document.getElementById('sortRightImage');
    right.src = "images/" + String(key2) + ".png";
    right.width = 568;
    right.height = 320;
    document.getElementById("sortRightButton").innerText = key2;
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
            key = Object.keys(Cands)[0];
            Idols[key] += 1;
        }
        cur_score += 1;
        initCands(cur_score);
        nextVS();
    }
}


function next(elemName) {
    let elem = document.getElementById(elemName);
    let key = elem.innerText;
    Idols[key] += 1;

    nextVS();
}


function showResult(result_str) {
    let elem = document.getElementById("sortResult");
    //elem.setAttribute(innerText, result_str);
    elem.innerHTML = result_str;
}

function getResult() {
    let result = Object.entries(Idols).sort(function(a, b) {
        return a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0;
    })

    for (let i = 0; i < result.length; i++) {
        idol = result[i];
        if (i == 0) {
            idol.push(1);
        } else {
            idol_ = result[i - 1];
            score = idol[1];
            score_ = idol_[1];
            if (score === score_) {
                idol.push(idol_[2]);
            } else {
                idol.push(i + 1);
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
        result_str += `<img class="img" src="images/${data[1][0]}.png" style='width:284; height:160;'>`;
        result_str += ' ' + String(data[1][2]) + '위: ';
        result_str += String(data[1][0]);
        result_str += '<br />'
    }
    return result_str;

}


function selectAll(value) {
    var inputElements = document.querySelectorAll('input[id^=entry]');
    for (let i=0; i<inputElements.length; i++) {
        inputElements[i].checked = value;
    }
    return;
}