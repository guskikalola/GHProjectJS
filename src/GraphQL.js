import Project from "./entities/Project.js";
import EntityFactory from "./factory/EntityFactory.js";

class GraphQL {
    /**
     * 
     * @param {string} token 
     */
    constructor(token) {
        this.endpoint = "https://api.github.com/graphql";
        this.token = token;
        this._ef = new EntityFactory(this);
    }

    /**
     * 
     * @param {string} query 
     */
    query(query) {
        return new Promise((resolve, reject) => {
            fetch(this.endpoint, {
                headers: {
                    "Authorization": `bearer ${this.token}`
                },
                method: "POST",
                body: JSON.stringify({ "query": query })

            })
                .then(res => res.json())
                .then(json => {
                    if (json["errors"] != undefined) {
                        console.log(json)
                        reject(json)
                    } else { resolve(json) }
                })
        });
    }

    /**
     * 
     * @param {"user"|"organization"} scope 
     * @param {string} login 
     * @param {int} number 
     * @returns {Promise<Project>}
     */
    getProject(scope, login, number) {
        return new Promise((resolve, reject) => {
            this.query(`
                query {
                    ${scope}(login: "${login}"){
                        projectV2(number: ${number}) {
                            id
                        }
                    }
                }
            `)
                .catch(reject)
                .then(res => {
                    resolve(this._ef.buildProject(res["data"]["user"]["projectV2"]["id"]));
                });
        });
    }
}

export default GraphQL;