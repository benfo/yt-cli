import { flags } from "@oclif/command";
import { cli } from "cli-ux";
import axios from "axios";
import Command from "../../base-command";

export class Query extends Command {
  private resource = "/api/issues";
  static description = "Provides access to issues";

  static args = [{ name: "query", default: "#me #issues sort by: updated" }];
  static flags = {
    ...cli.table.flags(),
    top: flags.integer({ default: 10 }),
    skip: flags.integer({ default: 0 }),
  };

  async run() {
    const { flags, args } = this.parse(Query);

    const headers = { Authorization: `Bearer ${this.userConfig.token}` };
    const { data: issues } = await axios.get(
      `${this.userConfig.baseUrl}${this.resource}`,
      {
        headers,
        params: {
          $top: flags.top,
          $skip: flags.skip,
          fields: "id,idReadable,summary",
          query: args.query,
        },
      }
    );

    cli.table(
      issues,
      {
        idReadable: {},
        summary: {},
        id: { extended: true },
        link: {
          get: (row: any) =>
            `${this.userConfig.baseUrl}/issue/${row.idReadable}`,
          extended: true,
        },
      },
      {
        ...flags,
      }
    );
  }
}
