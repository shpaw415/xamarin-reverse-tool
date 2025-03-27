import { init } from "./src/init";
import { options } from "./src/params";

import Decompile from "./src/decompiler";
import Compiler from "./src/compiler";
import { program } from "commander";
import { resolve } from "path";

init();

if (options.outdir) {
  options.outdir = resolve(options.outdir);
}
if (options.compile) {
  options.compile = resolve(options.compile);
}
if (options.decompile) {
  options.decompile = resolve(options.decompile);
}

await makeAndExit(
  "decompile",
  ["outdir"],
  async () =>
    await Decompile(options.decompile as string, options.outdir as string)
);

await makeAndExit(
  "compile",
  ["outdir"],
  async () =>
    await Compiler(options.compile as string, options.outdir as string)
);

async function makeAndExit(
  main_opt: keyof typeof options,
  other_opt: Array<keyof typeof options>,
  callback: () => void | Promise<void>
) {
  if (typeof options[main_opt] == "undefined") return;
  let missingOpt = false;

  for (const opt of other_opt) {
    if (typeof options[opt] == "undefined") {
      console.log("missing option: ", opt);
      missingOpt = true;
    }
  }
  if (!missingOpt) await callback();
  process.exit(0);
}

program.help();
