import path from "node:path";
import { exec } from "node:child_process";
import chalk from "npm:chalk@5.3.0";

const flags = {
  verbose: "-verbose",
  root: "-root",
  sd: "-sd",
} as const;

const flagValues = Object.values(flags);

const args = Deno.args.filter((arg) =>
  flagValues.every((flag) => !arg.startsWith(flag))
);

const verbose = Deno.args.includes(flags.verbose);
const sd = Deno.args.includes(flags.sd);
const root =
  Deno.args.find((arg) => arg.startsWith(flags.root))?.split("=")[1] ?? ".";

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

function getDirectories(lookupDir = "."): Promise<string[]> {
  try {
    Deno.chdir(path.resolve(lookupDir));

    return new Promise((resolve, reject) => {
      exec("ls -d */", (error, stdout) => {
        if (error != null) {
          reject(error);
        }

        const dirs: string[] = stdout.split("\n").filter((dir) => dir !== "");
        resolve(dirs);
      });
    });
  } catch {
    return Promise.reject(new Error("Something went wrong"));
  }
}

async function buildPath(): Promise<string> {
  const currentDirectory = root ?? Deno.cwd();
  let destinationPath = path.resolve(root ?? ".");

  function construct(directory: string): string {
    try {
      Deno.chdir(currentDirectory);
      return path.resolve(directory);
    } catch {
      return path.resolve(".");
    }
  }

  // relative or absolute path
  if (args.length === 1 && isPath(args[0])) {
    return construct(args[0]);
  }

  // directory patterns
  if (args.length > 0 && args.every((arg) => !isPath(arg))) {
    try {
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
    } catch {
      // do nothing
    }
  }
  return construct(destinationPath);
}

(async function (): Promise<void> {
  function printResult(result: string): void {
    if (sd) {
      console.log(result);
    }
  }

  if (Array.isArray(root)) {
    log(chalk.redBright("Only 1 root is allowed"));
    printResult("");
    return;
  }

  if (args.length > 1) {
    const manyPathArgs =
      args.filter((arg) => isPath(arg.toString())).length > 1;
    const mixedArgs = args.some((arg) => isPath(arg.toString()));

    if (manyPathArgs) {
      log(chalk.redBright("Only 1 path argument is allowed"));
      printResult("");
      return;
    }

    if (mixedArgs) {
      log(chalk.redBright("Path argument cannot be used with other arguments"));
      printResult("");
      return;
    }
  }

  const destinationPath = await buildPath();
  printResult(destinationPath);
})();
