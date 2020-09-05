import { flags } from "@oclif/command";
import Command from "../../../base-command";
import { cli } from "cli-ux";

export class Add extends Command {
  static args = [{ name: "comment" }];
  static flags = {
    id: flags.string({ required: true }),
    usesMarkdown: flags.boolean({
      default: false,
      description:
        "When `true`, the comment text is parsed as Markdown. When `false`, the comment text is parsed as YouTrack Wiki. Changing this value does not transform the markup from one syntax to another.",
    }),
    editor: flags.boolean({ char: "e" }),
  };

  async run() {
    const { args, flags } = this.parse(Add);

    let text = args.comment;
    if (!text) {
      text = await cli.prompt("comment");
    }

    const response = await this.api.addComment(flags.id, text, {
      usesMarkdown: flags.usesMarkdown,
    });

    if (response.status === 200) {
      this.log(`Comment added.`);
      this.log(
        `${this.userConfig.baseUrl}/issue/${flags.id}#focus=streamItem-${response.data.id}.0-0`
      );
    } else {
      this.error(`Unable to create issue.`);
    }
  }
}
