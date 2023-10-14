import path from "node:path";
import { exec } from "node:child_process";
import chalk from "npm:chalk@5.3.0";

const flags = {
  verbose: "-verbose",
  root: ["-root", "-r"],
  to: "-to",
};

const flagValues = Object.values(flags).flat();
const flagArgs = Deno.args
  .filter((arg) => arg.startsWith("-"))
  .map((arg) => arg.split("=")[0]);

const args: string[] = Deno.args.filter((arg) =>
  flagArgs.every((flag) => !arg.startsWith(flag))
);
const verbose: boolean = Deno.args.includes(flags.verbose);
const to: boolean = Deno.args.includes(flags.to);
const root: string =
const root: string[] = Deno.args
  .filter((arg) => flags.root.some((rootFlag) => arg.startsWith(rootFlag)))
  .map((arg) => arg.split("=")[1]);

function log(...messages: Parameters<typeof console.log>) {
  if (verbose) {
    console.log(...messages);
  }
}

function isPath(arg: string): boolean {
  return (
    arg === "." ||
    arg === ".." ||
    arg.startsWith("~") ||
    arg.includes("/") ||
    arg.includes("\\")
  );
}

function getDirectories(lookupDir = Deno.cwd()): Promise<string[]> {
  try {
    Deno.chdir(path.resolve(lookupDir));
    return new Promise((resolve) => {
      exec("ls -d */", (error, stdout) => {
        if (error != null) {
          resolve([]);
        }

        const dirs: string[] = stdout.split("\n").filter((dir) => dir !== "");
        resolve(dirs);
      });
    });
  } catch {
    return Promise.resolve([]);
  }
}

async function buildPath(startFromDirectory = Deno.cwd()): Promise<string> {
  function construct(directory: string): string {
    try {
      Deno.chdir(startFromDirectory);
      return path.resolve(directory);
    } catch {
      return Deno.cwd();
    }
  }

  let destinationPath = path.resolve(startFromDirectory);

  // relative or absolute path
  if (args.length === 1 && isPath(args[0])) {
    return construct(args[0]);
  }

  // directory patterns
  if (args.length > 0 && args.every((arg) => !isPath(arg))) {
    for (const arg of args) {
      const directories = await getDirectories(destinationPath);
      const found = directories.find(
        (directory) =>
          directory.startsWith(arg) ||
          directory.endsWith(arg) ||
          directory.includes(arg)
      );

      if (found == null) {
        log(`${chalk.redBright("Could not match")} "${arg}"`);
        return construct(destinationPath);
      }

      destinationPath = path.join(destinationPath, found);
    }
  }
  return construct(destinationPath);
}

(async function (): Promise<void> {
  function printResult(result: string): void {
    if (to) {
      console.log(result);
    }
  }

  if (flagArgs.some((arg) => !flagValues.includes(arg))) {
    const invalidFlags = flagArgs.filter((arg) => !flagValues.includes(arg));
    log(chalk.redBright("Invalid flags:"), invalidFlags.join(", "));
    printResult("");
    return;
  }

  if (args.length > 1) {
    // mixed arguments
    if (args.some((arg) => isPath(arg.toString()))) {
      log(chalk.redBright("Path argument cannot be used with other arguments"));
      printResult("");
      return;
    }

    // many path arguments
    if (args.filter((arg) => isPath(arg.toString())).length > 1) {
      log(chalk.redBright("Only 1 path argument is allowed"));
      printResult("");
      return;
    }
  }

  if (root.length > 1) {
    log(chalk.redBright("Only 1 root is allowed"));
    printResult("");
    return;
  }

  const destinationPath = await buildPath(root.at(0));
  printResult(destinationPath);
})();
