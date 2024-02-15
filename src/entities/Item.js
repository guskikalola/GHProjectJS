import GQLNode from "./GQLNode.js";
import Iteration from "./Iteration.js";
import Milestone from "./Milestone.js";
import Project from "./Project.js";

class Item extends GQLNode {
    /**
     * 
     * @param {string} nodeId 
     * @param {Project} project 
     * @param {string} title 
     * @param {Date} startDate 
     * @param {Date} endDate 
     * @param {string} status 
     * @param {number} estimate 
     * @param {Iteration} iteration 
     * @param {Milestone} milestone 
     * @param {number} dedication 
     */
    constructor(nodeId,project,title, startDate, endDate, status, estimate, iteration, milestone, dedication) {
        super(nodeId,project);

        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.estimate = estimate; 
        this.iteration = iteration;
        this.milestone = milestone;
        this.dedication = dedication; 
    }
}

export default Item;