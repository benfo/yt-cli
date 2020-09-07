import Command from "../../git-command";
import { flags } from "@oclif/command";
import * as inquirer from "inquirer";
import cli from "cli-ux";
import { normalize } from "../../utils";
import { Issue } from "../../youtrack";

export class Start extends Command {
  static args = [{ name: "issueId", description: "The issue ID" }];
  static flags = {
    prefix: flags.string({
      description: "The branch prefix to use",
      char: "p",
    }),
    description: flags.string({
      description: "A short, actionable description",
      char: "d",
    }),
    yes: flags.boolean({
      description: "Accept defaults without prompting for input",
      char: "y",
      default: false,
    }),
    ["no-branch"]: flags.boolean({
      description: "Do not create a branch for this issue.",
    }),
  };

  async run() {
    const { args, flags } = this.parse(Start);

    let issueId = args.issueId;
    let description = flags.description;
    let branchPrefix = flags.prefix || this.commandConfig.git.branchPrefix;
    let branchName: string;

    const issue = await this.getIssue(issueId);

    description = description ?? issue.summary;
    issueId = issue.idReadable;
    branchName = issueId;

    if (!flags.yes && !flags["no-branch"]) {
      let response: any = await inquirer.prompt([
        {
          name: "name",
          message: "Branch name",
          type: "input",
          default: branchName,
          validate: (value) => (value.length > 0 ? true : "Cannot be empty"),
        },
        {
          name: "prefix",
          message: "Branch prefix",
          type: "input",
          default: branchPrefix,
        },
        {
          name: "description",
          message: "Branch description",
          type: "input",
          default: normalize(description, 50),
        },
      ]);

      branchName = response.name;
      branchPrefix = response.prefix;
      description = response.description;
    }

    const fullBranchName = this.buildBranchName(
      branchName,
      branchPrefix,
      normalize(description, 50)
    );

    if (!flags.yes && !flags["no-branch"]) {
      let response: any = await inquirer.prompt([
        {
          name: "ok",
          message: `About to create a branch ${fullBranchName}. Ok?`,
          type: "confirm",
          default: true,
        },
      ]);
      if (!response.ok) {
        return;
      }
    }

    if (!flags["no-branch"]) {
      await this.checkOutBranch(fullBranchName);
    }
    await this.updateIssue(issueId);
  }

  private async getIssue(issueId: string): Promise<Issue> {
    if (issueId) {
      const issue = await this.api.getIssue(issueId);
      if (!issue) {
        this.error(`Unable to find issue ${issueId}`);
      }
      return issue;
    }

    const issues = await this.api.getIssues({
      query: this.commandConfig.git.start.query,
      $top: this.commandConfig.git.start.$top,
      fields: "id,idReadable,summary",
    });

    const choices = issues.map((item: Issue) => {
      return {
        name: `${item.idReadable} - ${item.summary}`,
        value: item,
      };
    });

    let response: any = await inquirer.prompt([
      {
        name: "issue",
        message: "Select an issue",
        type: "list",
        choices,
      },
    ]);

    return response.issue;
  }

  async updateIssue(issueId: any) {
    try {
      cli.action.start(`Updating issue ${issueId}`);
      const issue = await this.api.getIssue(issueId);
      this.api.executeCommand({
        query: this.commandConfig.git.command.query,
        comment: this.commandConfig.git.command.comment,
        issues: [{ id: issue.id }],
      });
      cli.action.stop();
    } catch (error) {
      this.error(error);
    }
  }

  private async checkOutBranch(name: string) {
    cli.action.start(`Creating branch ${name}`);

    try {
      await this.git.checkoutLocalBranch(name);
    } catch (error) {
      this.error(error);
    }

    cli.action.stop();
  }

  private buildBranchName(name: string, prefix?: string, description?: string) {
    if (prefix) {
      name = `${prefix}/${name}`;
    }
    if (description) {
      name = `${name}-${description}`;
    }
    return name;
  }
}
