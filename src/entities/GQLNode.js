import GraphQL from "../GraphQL.js";

class GQLNode {
    /**
     * @param {string} id 
     * @param {GQLNode} parent
     */
    constructor(id, parent) {
        this.id = id;
        this.parent = parent;
    }
}

export default GQLNode;