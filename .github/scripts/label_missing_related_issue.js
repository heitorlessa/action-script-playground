module.exports = async ({github, context, core}) => {
    const {
      PR_ACTION,
      PR_AUTHOR,
      PR_BODY,
      PR_NUMBER,
      IGNORE_AUTHORS,
      BLOCK_LABEL,
      BLOCK_REASON_LABEL,
      PR_TITLE,
      PR_IS_MERGED
    } = require("./constants")

    core.info(`Action: ${PR_ACTION}`);
    core.info(`Author: ${PR_AUTHOR}`);
    core.info(`Number: ${PR_NUMBER}`);
    core.info(`Title: ${PR_TITLE}`);
    core.info(`Is it merged: ${PR_IS_MERGED}`);
    core.info(`Body: ${PR_BODY}`);

    core.info("PR Authors type");
    core.info(typeof(PR_AUTHOR));
    core.info(`Value: ${PR_AUTHOR}`);
    core.info(`Env value: ${process.env.PR_AUTHOR}`);

    // if (IGNORE_AUTHORS.indexOf(PR_AUTHOR.trim()) > -1) {
    //   return core.notice("Skipping as we don't need to label bots PRs.")
    // }
    // if (IGNORE_AUTHORS.includes(PR_AUTHOR)) {
    //   return core.notice("Skipping as we don't need to label bots PRs.")
    // }

    if (PR_ACTION != "opened") {
      return core.notice("Skipping as we only label open PRs")
    }

    const RELATED_ISSUE_REGEX = /Issue number:[^\d\r\n]+(?<issue>\d+)/;

    const isMatch = RELATED_ISSUE_REGEX.exec(PR_BODY);
    if (isMatch == null) {
        core.info(`No related issue found, maybe the author didn't use the template but there is one.`)

        let msg = "No related issues found. Please ensure there is an open issue related to this change to avoid significant delays or closure.";
        await github.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: msg,
          issue_number: PR_NUMBER,
        });

        return await github.rest.issues.addLabels({
          issue_number: PR_NUMBER,
          owner: context.repo.owner,
          repo: context.repo.repo,
          labels: [BLOCK_LABEL, BLOCK_REASON_LABEL]
        })
    }
}
