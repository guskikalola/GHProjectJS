function parseFieldValues(fieldValues) {
    let parsed = {};
    for (let item of fieldValues["nodes"]) {
        if (item["field"] == undefined) continue;

        let fieldName = item["field"]["name"];
        let value = undefined;
        if (item["text"] != undefined) {
            value = item["text"];
        }
        else if (item["name"] != undefined) {
            value = item["name"];
        } else if (item["number"] != undefined) {
            value = item["number"];
        } else if (item["id"] != undefined) {
            value = item["id"];
        }
        else {
            value = new Date(item["date"]);
        }

        if (fieldName == "Iteration")
            parsed["IterationTitle"] = item["title"];

        if (fieldName == "Milestone")
            parsed["MilestoneTitle"] = item["title"];

        parsed[fieldName] = value;
    }
    return parsed;
}

function findField(fieldValues,name) {
    for (let item of fieldValues["nodes"]) {
        if (item["field"] == undefined) continue;
        
        if (item["field"]["name"] == name) return item;
    }

    return undefined;
}

export { parseFieldValues, findField };