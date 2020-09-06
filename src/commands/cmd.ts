import { flags } from "@oclif/command";
import Command from "../base-command";
import { YouTrackCommand } from "../youtrack";

export class Cmd extends Command {
  static args = [
    { name: "id", description: "The issues ID", required: true },
    { name: "command", description: "The command to run", required: true },
  ];
  static flags = { comment: flags.string() };

  async run() {
    const { flags, args } = this.parse(Cmd);

    let id;
    try {
      const issue = await this.api.getIssue(args.id);
      id = issue.id;
    } catch (error) {
      this.error(error);
    }

    let data: YouTrackCommand = {
      query: args.command,
      issues: [{ id }],
    };

    if (flags.comment) {
      data = { ...data, ...{ comment: flags.comment } };
    }

    try {
      const response = await this.api.executeCommand(data);
    } catch ({ response }) {
      this.error(response.data.error_description);
    }
  }
}
