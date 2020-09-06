import Command from "../../base-command";
import { flags } from "@oclif/command";
import * as inquirer from "inquirer";
import { exec } from "child_process";
import { execShellCommand } from "../../shell";

export class Git extends Command {
  static args = [{ name: "issueId", description: "The issue ID" }];
  static flags = {
    prefix: flags.string({
      description: "The branch prefix to use",
      default: "feature",
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
    let branchPrefix = flags.prefix;
    let branchName: string;

    if (!issueId) {
      const issues = await this.api.getIssues({
        query: "#me",
        $top: "5",
        fields: "id,idReadable,summary",
      });

      const choices = issues.map((issue: any) => {
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
      issueId = response.issue.idReadable;

      if (!description) {
        description = response.issue.summary;
      }
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
          default: this.normalize(description),
        },
      ]);

      branchName = response.name;
      branchPrefix = response.prefix;
      description = response.description;
    }

    const fullBranchName = this.buildBranchName(
      branchName,
      branchPrefix,
      this.normalize(description)
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
      const result = await execShellCommand(
        `git checkout -b ${fullBranchName}`
      );
      this.log(result);
    } catch (error) {
      this.error(error);
    }
  }

  private normalize(value: any) {
    return value
      ? value
          .trim()
          .toLowerCase()
          .replace(/([\s-]+)/gi, "-")
      : null;
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
