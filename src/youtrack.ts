import axios from "axios";
import { UserConfig } from "./user-config";

export default class {
  constructor(private config: UserConfig) {
    if (config.baseUrl == null) {
      throw Error("Config - baseUrl not set");
    }
    if (config.token == null) {
      throw Error("Config - token not set");
    }
  }

  async getIssues(params?: any) {
    const { data: issues } = await this.get("issues", params);
    return issues;
  }

  async getIssue(idReadable: string) {
    return this.get(`issues/${idReadable}`);
  }

  async executeCommand(data: any) {
    return this.post("commands", data);
  }

  async addComment(
    idReadable: string,
    text: string,
    options?: { usesMarkdown: boolean }
  ) {
    return this.post(`issues/${idReadable}/comments`, { text, ...options });
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
