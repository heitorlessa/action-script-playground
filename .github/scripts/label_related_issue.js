module.exports = async ({github, context, core}) => {
    const fs = require('fs');
    const pr = JSON.parse(fs.readFileSync('./pr.txt', 'utf-8').trim());

    console.dir(pr,{depth:null})
    core.info("Payload as it comes..")
    core.info(JSON.stringify(pr));

    const query = `query linkedIssues($pr:URI!) {
        resource(url:$pr) {
          ... on PullRequest {
            closingIssuesReferences(first: 10) {
              nodes {
                number
              }
            }
          }
        }
    }`;

    let variables = {pr: "https://github.com/heitorlessa/action-script-playground/pull/20"}
    const result = await github.graphql(query, variables)
    console.dir(result,{depth:null})

    return pr
}
