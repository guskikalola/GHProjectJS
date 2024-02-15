import GraphQL from "../GraphQL.js";
import GQLNode from "./GQLNode.js";
import Project from "./Project.js";

class Milestone extends GQLNode {
    /**
     * 
     * @param {string} nodeId 
     * @param {GraphQL} con 
     * @param {string} title
     */
    constructor(nodeId, project, title, dueOn) {
        super(nodeId,project);
        this.title = title;
        this.dueOn = dueOn;
    }
}

export default Milestone;