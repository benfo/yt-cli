import Command from "@oclif/command";
import { load as loadConfig, UserConfig } from "./user-config";
import api from "./youtrack";

export default abstract class extends Command {
  private _userConfig!: UserConfig;
  private _api!: api;

  get userConfig(): UserConfig {
    return this._userConfig;
  }
  get api(): api {
    return this._api;
  }

  async init() {
    this._userConfig = await loadConfig(this.config);
    this._api = new api(this.userConfig);
  }
}
