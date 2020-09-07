import * as fs from "fs";

export function normalize(
  value: string | undefined,
  maxLength: number
): string {
  if (value == null) return "";

  let normalizedValue: string = value
    ? value
        .trim()
        .toLowerCase()
        .replace(/([^a-zA-Z]+)/gi, "-")
    : "";

  return clamp(normalizedValue, maxLength, "-");
}

export function clamp(
  value: string,
  length: number,
  separator: string
): string {
  if (value.length <= length) return value;

  while (value.length > length) {
    const index = value.lastIndexOf(separator);
    if (index < 1) {
      value = value.substr(0, length);
      break;
    }

    value = value.substr(0, index);
  }
  return value;
}

export async function fileExists(path: string): Promise<boolean> {
  return new Promise((resolve, _) => {
    fs.exists(path, (exists) => {
      resolve(exists);
    });
  });
}

export async function readJSON(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

export async function writeJSON(path: string, data: any): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), "utf-8", (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
