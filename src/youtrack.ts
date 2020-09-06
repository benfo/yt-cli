import axios from "axios";
import { UserConfig } from "./user-config";

export interface YouTrackCommand {
  query: string;
  issues: [{ id: string }];
  comment?: string;
}

export interface IssuesQuery {
  query: string;
  $top?: number;
  $skip?: number;
  fields?: string;
}

export interface Issue {
  id: string;
  idReadable?: string;
  summary?: string;
}
export default class {
  constructor(private config: UserConfig) {
    if (config.baseUrl == null) {
      throw Error("Config - baseUrl not set");
    }
    if (config.token == null) {
      throw Error("Config - token not set");
    }
  }

  async getIssues(params?: IssuesQuery): Promise<Issue[]> {
    const { data: issues } = await this.get("issues", params);
    return issues;
  }

  async getIssue(idReadable: string): Promise<{ id: string }> {
    const response = await this.get(`issues/${idReadable}`);
    return response.data;
  }

  async executeCommand(data: YouTrackCommand) {
    return await this.post("commands", data);
  }

  async addComment(
    idReadable: string,
    text: string,
    options?: { usesMarkdown: boolean }
  ) {
    return await this.post(`issues/${idReadable}/comments`, {
      text,
      ...options,
    });
  }

  private async post(resource: string, data: any) {
    return await axios.post(this.url(resource), data, {
      headers: this.headers,
    });
  }

  private async get(resource: string, params: any = {}) {
    return await axios.get(this.url(resource), {
      params,
      headers: this.headers,
    });
  }

  private url(resource: string): string {
    return `${this.config.baseUrl}/api/${resource}`;
  }

  get headers(): any {
    return {
      authorization: `Bearer ${this.config.token}`,
      contentType: "application/json",
    };
  }
}
