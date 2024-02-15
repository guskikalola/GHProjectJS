import Item from "../entities/Item.js";
import Iteration from "../entities/Iteration.js";
import Milestone from "../entities/Milestone.js";
import Project from "../entities/Project.js";
import { findField, parseFieldValues } from "../helpers.js";

class EntityFactory {

    constructor(con) {
        this._con = con;
    }


    /**
     * 
     * @param {string} id 
     * @returns {Promise<Project>}
     */
    buildProject(id) {
        return new Promise((resolve, reject) => {
            // let id = data["user"]["projectV2"]["id"];
            let project = new Project(id);
            this._con.query(`
              query{
                  node(id: "${id}") {
                      ... on ProjectV2 {
                        items(first: 100) {
                          nodes{
                            id
                            fieldValues(first: 13) {
                              nodes{                
                                ... on ProjectV2ItemFieldTextValue {
                                  text
                                  field {
                                    ... on ProjectV2FieldCommon {
                                      name
                                    }
                                  }
                                }
                                ... on ProjectV2ItemFieldNumberValue {
                                  number
                                  field {
                                    ... on ProjectV2FieldCommon {
                                      name
                                    }
                                  }
                                }
                                ... on ProjectV2ItemFieldDateValue {
                                  date
                                  field {
                                    ... on ProjectV2FieldCommon {
                                      name
                                    }
                                  }
                                }
                                ... on ProjectV2ItemFieldIterationValue {
                                  id
                                  title
                                  startDate
                                  duration
                                  field {
                                    ... on ProjectV2FieldCommon {
                                      name
                                    }
                                  }
                                }
                                ... on ProjectV2ItemFieldMilestoneValue {
                                  milestone {
                                    id
                                    closed
                                    closedAt
                                    dueOn
                                    title
                                    state
                                  }
                                  field {
                                    ... on ProjectV2FieldCommon {
                                      name
                                    }
                                  }
                                }
                                ... on ProjectV2ItemFieldSingleSelectValue {
                                  name
                                  field {
                                    ... on ProjectV2FieldCommon {
                                      name
                                    }
                                  }
                                }
                              }              
                            }
                            content{              
                              ... on DraftIssue {
                                title
                                body
                              }
                              ...on Issue {
                                title
                                assignees(first: 10) {
                                  nodes{
                                    login
                                  }
                                }
                              }
                              ...on PullRequest {
                                title
                                assignees(first: 10) {
                                  nodes{
                                    login
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
              `)
                .catch(reject)
                .then(res => {
                    let items = [];
                    for (let node of res["data"]["node"]["items"]["nodes"]) {
                        /*
                          let nodeId = node.id;
                          
                          let title = fields["Title"];
                          let startDate = fields["Start date"];
                          let endDate = fields["End date"];
                          let status = fields["Status"];
                          let estimate = fields["Estimate"] || 0;
                          let iterationTitle = fields["IterationTitle"]; // Has to be resolved, as this is an ID
                          let milestoneTitle = fields["MilestoneTitle"]; // Has to be resolved, as this is an ID
                          let iteration = iterationId ? new Iteration(iterationId,this._con, this, iterationTitle) : undefined;
                          let milestone = milestoneId ? new Milestone(milestoneId, this._con, this, milestoneTitle) : undefined;
                          */

                        let fields = parseFieldValues(node.fieldValues);
                        let iterationField = findField(node.fieldValues, "Iteration"); // Has to be resolved, as this is an ID
                        let milestoneField = findField(node.fieldValues, "Milestone"); // Has to be resolved, as this is an ID

                        let iteration, milestone;

                        if (iterationField != undefined) {
                            let itMatch = project.getIterations().find(it => it.id == iterationField.id);
                            if (itMatch != undefined) {
                                iteration = itMatch;
                            } else {
                                iteration = this.buildIteration(iterationField);
                                iteration.parent = project;
                            }
                        }

                        if (milestoneField != undefined) {
                            let msMatch = project.getMilestones().find(ms => ms.id == milestoneField.id);
                            if (msMatch != undefined) {
                                milestone = msMatch;
                            } else {
                                milestone = this.buildMilestone(milestoneField);
                                milestone.parent = project;
                            }
                        }

                        let item = this.buildItem(node);
                        item.parent = project;
                        item.milestone = milestone;
                        item.iteration = iteration;
                        items.push(item);
                    }

                    project._items = items;

                    resolve(project);
                })
        });
    }

    /**
     * 
     * @param {*} data 
     * @returns {Item}
     */
    buildItem(data) {
        let nodeId = data.id;
        let fields = parseFieldValues(data.fieldValues);

        let title = fields["Title"];
        let startDate = fields["Start date"];
        let endDate = fields["End date"];
        let status = fields["Status"];
        let estimate = fields["Estimate"] || 0;
        let dedication = fields["Dedication"] || 0;
        // let iterationId = fields["Iteration"]; // Has to be resolved, as this is an ID
        // let iterationTitle = fields["IterationTitle"]; // Has to be resolved, as this is an ID
        // let milestoneId = fields["Milestone"]; // Has to be resolved, as this is an ID
        // let milestoneTitle = fields["MilestoneTitle"]; // Has to be resolved, as this is an ID
        // let iteration = iterationId ? new Iteration(iterationId, this._con, this, iterationTitle) : undefined;
        // let milestone = milestoneId ? new Milestone(milestoneId, this._con, this, milestoneTitle) : undefined;
        let item = new Item(nodeId, undefined, title, startDate, endDate, status, estimate, undefined, undefined, dedication);

        return item;
    }

    /**
     * @returns {Iteration}
     */
    buildIteration(data) {
        let iteration = new Iteration(data.id);

        let startDate = new Date(data.startDate);
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + data.duration);

        iteration.title = data.title;
        iteration.startDate = startDate;
        iteration.endDate = endDate;

        return iteration;
    }

    /**
     * @returns {Milestone}
     */
    buildMilestone(data) {
        let milestone = new Milestone(data.milestone.id);

        /*
                                    id
                                    closed
                                    closedAt
                                    dueOn
                                    title
                                    state
        */
        milestone.title = data.milestone.title;
        milestone.dueOn = data.milestone.dueOn ? new Date(data.milestone.dueOn) : undefined;

        return milestone;
    }
}

export default EntityFactory;