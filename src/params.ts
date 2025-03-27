import { program } from "commander";

program
  .name("xamarin-reverse-tool")
  .description("CLI xamarin reverse-engineering tool")
  .version("0.0.1");

program
  .option("-d, --decompile [PATH]", "decompile with apktool and pyxamstore")
  .option("-o, --outdir [PATH]", "output files for decompile")
  .option("-c, --compile [PATH]", "Compile previously decompiled apk dir path")
  .option("--no-clean-up", "keep the tmp dir after compile", false)
  .option(
    "--no-sign",
    "prevent signing and zip-lining the apk on compile",
    false
  );

program.parse();
export const options = program.opts() as Options;

export type Options = {
  decompile?: string;
  compile?: string;
  outdir?: string;
  cleanUp: boolean;
  sign: boolean;
};
