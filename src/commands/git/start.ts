import Command from "../../base-command";
import { flags } from "@oclif/command";
import * as inquirer from "inquirer";
import { execShellCommand } from "../../shell";
import cli from "cli-ux";
import { normalize } from "../../utils";
import simpleGit, { SimpleGit } from "simple-git";
import { Issue } from "../../youtrack";

const git = simpleGit();

export class Git extends Command {
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
  };

  async run() {
    const { args, flags } = this.parse(Git);

    let issueId = args.issueId;
    let description = flags.description;
    let branchPrefix =
      flags.prefix || this.userConfig["git.branchPrefix"].feature;
    let branchName: string;

    if (!issueId) {
      const issues = await this.api.getIssues({
        query: this.userConfig["git.start"].query,
        $top: this.userConfig["git.start"].$top,
        fields: "id,idReadable,summary",
      });

      const choices = issues.map((issue: Issue) => {
        return {
          name: `${issue.idReadable} - ${issue.summary}`,
          value: issue,
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

      description = description ?? response.issue.summary;
      issueId = response.issue.idReadable;
    } else {
      const issue = await this.api.getIssue(issueId);
      if (!issue) {
        this.error(`Unable to find issue ${issueId}`);
      }

      description = description ?? issue.summary;
      issueId = issue.idReadable;
    }
    branchName = issueId;

    if (!flags.yes) {
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

    if (!flags.yes) {
      let response: any = await inquirer.prompt([
        {
          name: "ok",
          message: `Continue with ${fullBranchName}: ?`,
          type: "confirm",
          default: true,
        },
      ]);
      if (!response.ok) {
        return;
      }
    }

    try {
      cli.action.start(`Creating branch ${fullBranchName}`);

      try {
        await git.init();
        await git.checkoutLocalBranch(fullBranchName);
      } catch (e) {
        this.error(e);
      }

      // const gitResult = await execShellCommand(
      //   `git checkout -b ${fullBranchName}`
      // );
      cli.action.stop();
      // this.log(gitResult);

      cli.action.start(`Updating issue ${issueId}`);
      const issue = await this.api.getIssue(issueId);
      const cmdResult = this.api.executeCommand({
        query: this.userConfig["git.command"].query,
        comment: this.userConfig["git.command"].comment,
        issues: [{ id: issue.id }],
      });
      cli.action.stop();
    } catch (error) {
      this.error(error);
    }
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
