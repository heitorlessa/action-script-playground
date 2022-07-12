module.exports = async ({github, context, core}) => {
    const action = process.env.PR_ACTION;
    const author = process.env.PR_AUTHOR;
    const ignoreAuthors = process.env.IGNORE_AUTHORS || []
    console.log(`Action: ${action}`)
    console.log(`Author: ${author}`)
    console.log(`Author ignore list: ${ignoreAuthors}`)
    if (ignoreAuthors.includes(author)) {
      core.notice("Skipping as we don't need to label bots PRs.");
      return
    }

    if (action != "opened") {
      core.notice("Skipping as we only label open PRs");
      return
    }
    // if ((ignoreAuthors.includes(author)) || (action == "edited")) {
      
    //   return
    // }

    const prBody = process.env.PR_BODY;
    const prNumber = process.env.PR_NUMBER;
    const blockLabel = process.env.BLOCK_LABEL;
    const blockReasonLabel = process.env.BLOCK_REASON_LABEL;

    const RELATED_ISSUE_REGEX = /Issue number:[^\d\r\n]+(?<issue>\d+)/;

    const isMatch = RELATED_ISSUE_REGEX.exec(prBody);
    if (isMatch == null) {
        core.info(`No related issue found, maybe the author didn't use the template but there is one.`)

        let msg = "No related issues found. Please ensure there is an open issue related to this change to avoid significant delays or closure.";
        await github.rest.issues.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          body: msg,
          issue_number: prNumber,
        });

        return await github.rest.issues.addLabels({
          issue_number: prNumber,
          owner: context.repo.owner,
          repo: context.repo.repo,
          labels: [blockLabel, blockReasonLabel]
        })
    }
}


