import * as path from "path";
import { IConfig } from "@oclif/config";
import { defaults } from "lodash";
import { fileExists, writeJSON, readJSON } from "./utils";

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
  let fileConfig: UserConfig | undefined;
  if (await fileExists(configFilePath)) {
    fileConfig = await readJSON(configFilePath);
  }

  const conf = defaults(envConfig, fileConfig, defaultConfig);
  return conf;
}

export async function save(
  configDir: string,
  config: UserConfig
): Promise<void> {
  await writeJSON(path.join(configDir, "config.json"), config);
}
