import GQLNode from "./GQLNode.js";
import Project from "./Project.js";

class Iteration extends GQLNode {
    /**
     * 
     * @param {string} nodeId 
     * @param {Project} project 
     * @param {string} title
     */
    constructor(nodeId,project, title, startDate, endDate) {
        super(nodeId, project);
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export default Iteration;