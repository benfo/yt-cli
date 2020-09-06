import { flags } from "@oclif/command";
import { cli } from "cli-ux";
import Command from "../../base-command";

export class Query extends Command {
  private resource = "/api/issues";
  static description = "Provides access to issues";

  static flags = {
    ...cli.table.flags(),
    top: flags.integer({ default: 10 }),
    skip: flags.integer({ default: 0 }),
    query: flags.string({ char: "q", default: "#me #issues sort by: updated" }),
  };

  async run() {
    const { flags } = this.parse(Query);

    const issues = await this.api.getIssues({
      $top: flags.top,
      $skip: flags.skip,
      fields: "id,idReadable,summary",
      query: flags.query,
    });

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
