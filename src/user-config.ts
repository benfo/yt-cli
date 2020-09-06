import * as fs from "fs";
import * as path from "path";
import { IConfig } from "@oclif/config";
import { defaults } from "lodash";

export interface LocalConfig {
  ["git.branchPrefix"]: { feature: string };
  ["git.start"]: { query: string; $top: number };
  ["git.command"]: { query: string; comment?: string };
}

export interface UserConfig extends LocalConfig {
  baseUrl?: string;
  token?: string;
}

const defaultConfig: UserConfig = {
  "git.branchPrefix": { feature: "feature" },
  "git.start": { query: "#me Submitted", $top: 25 },
  "git.command": { query: "Assignee me" },
};

const envConfig: Partial<UserConfig> = {
  baseUrl: process.env.YT_CLI_BASE_URL,
  token: process.env.YT_CLI_TOKEN,
};

export function getLocalConfigFilePath() {
  return path.join(process.cwd(), "yt-cli.json");
}

export async function load(config: IConfig): Promise<UserConfig> {
  const configFilePath = path.join(config.configDir, "config.json");
  let fileConfig: UserConfig | undefined;
  if (await fileExists(configFilePath)) {
    fileConfig = await readJSON(configFilePath);
  }

  const localConfigFilePath = await getLocalConfigFilePath();
  let localConfig: UserConfig | undefined;
  if (await fileExists(localConfigFilePath)) {
    localConfig = await readJSON(localConfigFilePath);
  }

  const conf = defaults(envConfig, localConfig, fileConfig, defaultConfig);
  return conf;
}

async function fileExists(path: string): Promise<boolean> {
  return new Promise((resolve, _) => {
    fs.exists(path, (exists) => {
      resolve(exists);
    });
  });
}

async function readJSON(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

async function writeJSON(path: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), "utf-8", (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export async function saveLocal(config: Partial<LocalConfig>): Promise<void> {
  await writeJSON(getLocalConfigFilePath(), config);
}

export async function save(
  configDir: string,
  config: UserConfig
): Promise<void> {
  await writeJSON(path.join(configDir, "config.json"), config);
}
