const {
  PR_ACTION,
  PR_BODY,
  PR_NUMBER,
  IGNORE_AUTHORS,
  BLOCK_LABEL,
  BLOCK_REASON_LABEL,
  PR_TITLE,
  PR_IS_MERGED,
  PR_AUTHOR
} = require("./constants")

module.exports = async ({github, context, core}) => {
    core.debug(`[Debug]
      Action: ${PR_ACTION}
      Author: ${PR_AUTHOR}
      Number: ${PR_NUMBER}
      Title: ${PR_TITLE}
      Is it merged: ${PR_IS_MERGED}
      Authors Ignore list: ${IGNORE_AUTHORS}      
      Body: ${PR_BODY}
    `)

    if (IGNORE_AUTHORS.includes(PR_AUTHOR) > -1) {
      return core.notice("[IndexOf] Skipping as we don't need to label bots PRs.")
    }

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
