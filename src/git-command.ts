import simpleGit, { GitConstructError } from "simple-git";
import Command from "./base-command";
import { fileExists, readJSON } from "./utils";
import * as path from "path";
import { defaults } from "lodash";

export interface GitConfig {
  git: {
    branchPrefix: string;
    start: { query: string; $top: number };
    command: { query: string; comment?: string };
  };
}
const defaultConfig: GitConfig = {
  git: {
    branchPrefix: "feature",
    start: { query: "#me Submitted", $top: 25 },
    command: { query: "Assignee me" },
  },
};
const configFilename = "yt-cli.json";

export default abstract class GitCommand extends Command {
  git = simpleGit();

  //@ts-ignore
  gitRootPath: string;
  //@ts-ignore
  configPath: string;
  //@ts-ignore
  commandConfig: GitConfig;
  isInitCommand = false;

  async init() {
    await super.init();

    if (!(await this.git.checkIsRepo())) {
      this.error("You are not in a git repository");
    }

    this.gitRootPath = await this.git.revparse(["--show-toplevel"]);

    this.configPath = path.join(this.gitRootPath, configFilename);

    let fileConfig: Partial<GitConfig> | undefined;
    if (await fileExists(configFilename)) {
      fileConfig = await readJSON(this.configPath);
    }

    this.commandConfig = defaults(fileConfig, defaultConfig);

    if (!this.isInitCommand && !fileConfig)
      this.error(`${configFilename} not found. Please run git:init first`);
  }
}
