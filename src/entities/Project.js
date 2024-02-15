import Item from "./Item.js";
import Iteration from "./Iteration.js";
import Milestone from "./Milestone.js";
import { parseFieldValues } from "../helpers.js";
import GQLNode from "./GQLNode.js";

class Project extends GQLNode {
  /**
   * 
   * @param {string} nodeId 
   */
  constructor(nodeId,items = [], milestones = [], iterations = []) {
    super(nodeId, null);

    this._items = items;
    this._milestones = milestones;
    this._iterations = iterations;
  }

  /**
   * 
   * @returns {Item[]}
   */
  getItems() {
    return this._items;
  }

  /**
   * 
   * @returns {Milestone[]}
   */
  getMilestones() {
    return this._milestones;
  }

  /**
   * 
   * @returns {Iteration[]}
   */
  getIterations() {
    return this._iterations;
  }
}

export default Project;