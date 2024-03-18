import GQLNode from "./GQLNode.js";
import Item from "./Item.js";

class Label extends GQLNode {
    /**
     * @param {string} nodeId 
     * @param {Item} item 
     */
    constructor(nodeId, item, name, description, color) {
        super(nodeId,item);

        this.name = name;
        this.description = description;
        this.color = color;
    }
}

export default Label;