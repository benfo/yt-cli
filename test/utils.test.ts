import { clamp } from "../src/utils";
import { expect } from "chai";

describe("clamp", () => {
  it("should return a string of not more than", () => {
    let result = clamp("a-long-string-that-should-be-clamped", 10, "-");
    expect(result).to.equal("a-long");

    result = clamp("short-string", 10, "-");
    expect(result).to.equal("short");

    result = clamp("a long string that should be clamped", 10, "-");
    expect(result).to.equal("a long str");
  });
});
