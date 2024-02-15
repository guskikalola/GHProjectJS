import * as dotenv from "dotenv";
import GraphQL from "./src/GraphQL.js";

dotenv.config();

let gql = new GraphQL(process.env.GITHUB_TOKEN);

gql.getProject("user", "guskikalola", 1)
  .then((project) =>{
    let list = project.getItems()
      .filter(item => item.iteration != undefined && (!item.dedication || !item.estimate) );
    console.log(list)
  });