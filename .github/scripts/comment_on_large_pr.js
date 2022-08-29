module.exports = async ({github, context, core}) => {
    /** @type {string[]} */
    const labels = await github.rest.issues.listLabelsOnIssue({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: process.env.PR_NUMBER,
    })

    console.log(labels)
    return labels
}