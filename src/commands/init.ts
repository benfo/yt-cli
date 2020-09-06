import Command from "../base-command";
import * as inquirer from "inquirer";
import { saveLocal } from "../user-config";

export class Init extends Command {
  async run() {
    const notEmpty = (value: any) =>
      value.length > 0 ? true : "Cannot be empty";

    let response: any = await inquirer.prompt([
      {
        name: "featureBranchPrefix",
        message: "Feature branch prefix",
        type: "input",
        default: this.userConfig["git.branchPrefix"].feature,
        validate: notEmpty,
      },
      {
        name: "gitStartQuery",
        message: "Start feature YouTrack query",
        type: "input",
        default: this.userConfig["git.start"].query,
        validate: notEmpty,
      },
      {
        name: "gitStartQueryTop",
        message: "Number of results",
        type: "input",
        default: this.userConfig["git.start"].$top,
        validate: notEmpty,
      },
      {
        name: "gitStartCommand",
        message: "Start feature YouTrack command",
        type: "input",
        default: this.userConfig["git.command"].query,
        validate: notEmpty,
      },
    ]);

    saveLocal({
      "git.branchPrefix": { feature: response.featureBranchPrefix },
      "git.command": { query: response.gitStartCommand },
      "git.start": {
        query: response.gitStartQuery,
        $top: response.gitStartQueryTop,
      },
    });
  }
}
