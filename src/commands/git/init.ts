import Command, { GitConfig } from "../../git-command";
import * as inquirer from "inquirer";
import { writeJSON } from "../../utils";

export class Init extends Command {
  async init() {
    this.isInitCommand = true;
    await super.init();
  }
  async run() {
    const notEmpty = (value: any) =>
      value.length > 0 ? true : "Cannot be empty";

    let response: any = await inquirer.prompt([
      {
        name: "developBranch",
        message: "Develop branch",
        type: "input",
        default: this.commandConfig.git.branch.develop,
        validate: notEmpty,
      },
      {
        name: "featureBranchPrefix",
        message: "Feature branch",
        type: "input",
        default: this.commandConfig.git.branch.feature,
        validate: notEmpty,
      },
      {
        name: "gitStartQuery",
        message: "Start feature YouTrack query",
        type: "input",
        default: this.commandConfig.git.start.query,
        validate: notEmpty,
      },
      {
        name: "gitStartQueryTop",
        message: "Number of results",
        type: "input",
        default: this.commandConfig.git.start.$top.toString(),
        validate: notEmpty,
      },
      {
        name: "gitStartCommand",
        message: "Start feature YouTrack command",
        type: "input",
        default: this.commandConfig.git.command.query,
        validate: notEmpty,
      },
    ]);

    const commandConfig: GitConfig = {
      git: {
        branch: {
          feature: response.featureBranchPrefix,
          develop: response.developBranch,
        },
        command: { query: response.gitStartCommand },
        start: {
          query: response.gitStartQuery,
          $top: response.gitStartQueryTop,
        },
      },
    };
    writeJSON(this.configPath, commandConfig);
  }
}
