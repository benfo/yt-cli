import { exec } from "child_process";

export function execShellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error: any, stdout: any, stderr: any) => {
      if (error) {
        reject(stderr);
        return;
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
