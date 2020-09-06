import { expect, test } from "@oclif/test";

describe("hello", () => {
  test.stdout().command(["cmd", "a"]).exit(2).it("exits with status 2");
});
