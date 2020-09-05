import * as fs from "fs-extra";
import * as path from "path";
import { homedir } from "os";
import { IConfig } from "@oclif/config";

export interface UserConfig {
  baseUrl?: string;
  token?: string;
}

const defaultConfig: UserConfig = {};

const envConfig: Partial<UserConfig> = {
  baseUrl: process.env.YT_CLI_BASE_URL,
  token: process.env.YT_CLI_TOKEN,
};

export async function load(config: IConfig): Promise<UserConfig> {
  const configFilePath = path.join(config.configDir, "config.json");
  let fileConfig: UserConfig;
  if (await fs.pathExists(configFilePath)) {
    fileConfig = await fs.readJSON(configFilePath);
  } else {
    fileConfig = {};
  }

  const conf = Object.assign(defaultConfig, fileConfig);
  conf.baseUrl = envConfig.baseUrl || conf.baseUrl;
  conf.token = envConfig.token || conf.token;
  return conf;
}

export async function save(
  configDir: string,
  config: UserConfig
): Promise<void> {
  fs.writeJSON(path.join(configDir, "config.json"), config);
}
