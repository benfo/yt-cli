import Command from "../../base-command";
import { cli } from "cli-ux";

export class Open extends Command {
  static args = [{ name: "id", required: true, description: "The issue ID" }];

  async run() {
    const { args } = this.parse(Open);
    await cli.open(`${this.userConfig.baseUrl}/issue/${args.id}`);
  }
}
