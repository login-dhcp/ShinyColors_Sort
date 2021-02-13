////////////////////////
// collapsible select buttons

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


/////////////////////////////////////////
// screen related things
function setVSScreen(value1, value2) {
    leftItem = findItemByName(value1);
    document.getElementById("sort_left_button").innerText = value1;
    var leftImage = document.getElementById('sort_left_image');
    if (leftImage && 'image' in leftItem) {
        leftImage.src = leftItem['image'];
        leftImage.width = configs['Imsize'][0];
        leftImage.height = configs['Imsize'][1]; 
    }
    var leftAudio = document.getElementById("sort_left_audio");
    if (leftAudio && 'audio' in leftItem) {
        leftAudio.src = leftItem['audio'];
    }
    var leftDescription = document.getElementById('sort_left_description');
    // leftDescription.innerText = `정보: ${get_description(leftItem)}`;
    // leftDescription.innerHTML = `${getDescriptionTable(leftItem)}`

    rightItem = findItemByName(value2);
    document.getElementById("sort_right_button").innerText = value2;
    var rightImage = document.getElementById('sort_right_image');
    if (rightImage && 'image' in rightItem) {
        rightImage.src = rightItem['image'];
        rightImage.width  = configs['Imsize'][0];
        rightImage.height  = configs['Imsize'][1];
    }
    var rightAudio = document.getElementById("sort_right_audio");
    if (rightAudio && 'audio' in rightItem) {
        rightAudio.src = rightItem['audio'];
    }
    var rightDescription = document.getElementById('sort_right_description');
    // rightDescription.innerText = `${get_description(rightItem)}`;
    // rightDescription.innerHTML = `${getDescriptionTable(rightItem)}`
}

function beatutify(results) {
    let result_str = 'Result<br />';
    for (let i = 0; i < results.length; i++) {
        result = results[i];
        name = result[1][0];
        rank = result[1][2];

        item = findItemByName(name);
        result_str += ` ${String(rank)}위: ${item['name']}<br />`
        if ('image' in item) {
            result_str += `<img class="img" src="${item['image']}" style='width:${configs['Imsize'][0]}; height:${configs['Imsize'][1]};'><br />`
        }
        if ('audio' in item) {
            result_str += `<audio controls src="${item['audio']}"></audio><br />`; // todo if 'audio' is in item.keys()
        }
    }
    return result_str;

}