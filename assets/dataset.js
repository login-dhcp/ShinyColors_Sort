function findItemByKeyValue(key, value) {
    items = dataset['Items'];
    for (let i = 0; i < items.length; i++) {
        item = items[i];
        if (item[key] === value) {
            return item;
        }
    }
}

function findItemByName(value) {
    return findItemByKeyValue('name', value);
}

function get_description(data) {
    var clone = JSON.parse(JSON.stringify(data));

    keys_hide = configs['HideKeys'];
    for (let i = 0; i < keys_hide.length; i++) {
        key = keys_hide[i];
        if (key in clone) {
            delete clone[key];
        }
    }

    var str = JSON.stringify(clone, null, 2);
    return str
}

function getDescriptionTable(data) {
    var clone = JSON.parse(JSON.stringify(data));

    var table = '<table id=sort_result_table>';
    // add header as row
    var headers = Object.keys(data);
    var keys_hide = configs['HideKeys'];
    table += '<tr>';
    for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        if (!keys_hide.includes(header)) {
            table += '<th>' + header + '</th>';
        }
    }
    table += '</tr>';

    table += '<tr>'
    var entries = Object.entries(data);
    for (let i = 0; i < entries.length; i++) {
        entry = entries[i];
        if (!keys_hide.includes(entry[0])) {
            table += '<td>' + entry[1] + '</td>';
        }
    }
    table += '</tr>';
    table += '</table>';
    return table;
}


///////////////////
function csvToArray(data) {
    var textLines = data.split(/\r\n|\n/);
    var headers = textLines[0].split(',');
    var lines = [];

    for (var i = 1; i < textLines.length; i++) {
        var data = textLines[i].split(',');
        if (data.length == headers.length) {

            var item = {};
            for (var j = 0; j < headers.length; j++) {
                item[headers[j]] = data[j];
            }
            lines.push(item);
        }
    }
    return [lines, headers]
}


function datasetToCheckboxs(data, headers) {
    var table = '<table id=sort_list_table>';

    // add header as row
    table += '<tr>';
    for (var rowCell = 0; rowCell < headers.length; rowCell++) {
        table += '<th>' + headers[rowCell] + '</th>';
    }
    table += '</tr>';

    // add items
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        table += '<tr>';
        for (var j = 0; j < headers.length; j++) {
            table += '<td>';
            table += `<label style="cursor:pointer" for="sort_checkbox_${item['name']}">`;
            if (j === 0) {
                table += `<input type="checkbox" data-checkbox-id="${item['name']}" id="sort_checkbox_${item['name']}" class="select_one">`;
            }
            table += `${item[headers[j]]}`;
            table += '</label>';
            table += '</td>';
        }
        table += '</tr>';
    }
    table += '</table>';
    return table;
}

function buildHTMLWithDataset(text) {
    var parsed_data = csvToArray(text);
    var dataset_items = parsed_data[0];
    var dataset_headers = parsed_data[1];

    dataset = {};
    dataset['Items'] = dataset_items;

    var clone_items = JSON.parse(JSON.stringify(dataset_items));
    var clone_headers = JSON.parse(JSON.stringify(dataset_headers));
    keys_hide = configs['HideKeys'];
    for (let i = 0; i < keys_hide.length; i++) {
        key = keys_hide[i];
        if (clone_headers.includes(key)) {
            position = clone_headers.indexOf(key);
            clone_headers.splice(position, 1);
            for (let j = 0; j < clone_items.length; j++) {
                delete clone_items[j][key];
            }
        }
    }

    // var table = datasetToCheckboxs(dataset_items, dataset_headers);
    var table = datasetToCheckboxs(clone_items, clone_headers);
    document.getElementById("sort_list").insertAdjacentHTML('beforeend', table);
}