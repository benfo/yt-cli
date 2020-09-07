import Command from "../../git-command";
import cli from "cli-ux";
import { Issue } from "../../youtrack";
export class Comment extends Command {
  static args = [
    {
      name: "comment",
      description: "The comment that you want to add to the issue.",
    },
  ];

  async run() {
    const { args } = this.parse(Comment);

    const branch = await this.getBranch();
    const issue = await this.fetchIssue(branch.current);

    let comment = args.comment;
    if (!comment) {
      comment = await cli.prompt("Type a comment");
    }
    await this.addComment(issue, comment);
  }

  private async addComment(issue: Issue, comment: any) {
    cli.action.start("Adding comment");
    await this.api.addComment(issue.idReadable, comment);
    cli.action.stop();
  }

  private async fetchIssue(branchName: string) {
    const issueIdMatch = /(?:\w+\/)?(\w+-\d+)/.exec(branchName);
    if (!issueIdMatch) {
      this.error("Unable to determine the issue id in the current branch");
    }
    cli.action.start(`Fetching issue ${issueIdMatch[1]}`);
    const issue = await this.api.getIssue(issueIdMatch[1]);
    cli.action.stop();
    return issue;
  }

  private async getBranch() {
    if (!(await this.git.checkIsRepo())) {
      this.error("You are not in a git repository");
    }

    return await this.git.branch();
  }
}
