function findItemByKeyValue(key, value) {
    items = dataset['Items'];
    for (i=0; i<items.length; i++) {
        item = items[i];
        if (item[key] === value) {
            return item;
        }
    }
}

function findItemByName(value) {
    return findItemByKeyValue('name', value);
}

const itemToHTML = (data) => {
    return `<li><label style="cursor:pointer">
<input type="checkbox" data-checkbox-id=">${data['name']}" class="select_one">
<span title='${get_description(data)}'>${data['name']}</span>
</label></li>`
};

$(parse_dataset())

function parse_dataset() {
    checkboxs = document.getElementById("sort_list");

    sort_items = dataset['Items'];

    for (let i = 0; i < sort_items.length; i++) {
        checkboxs.insertAdjacentHTML('beforeend', itemToHTML(sort_items[i]));
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


////////////////////
function get_description(data) {
    const clone = JSON.parse(JSON.stringify(data));
    delete clone['image'];
    delete clone['audio'];
    var str = JSON.stringify(clone, null, 2);
    return str
}