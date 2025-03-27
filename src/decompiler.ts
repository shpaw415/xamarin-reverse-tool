import { normalize } from "path";
import { isBlobVersion, pathToAssembly } from "./utils";

export default async function Decompile(path: string, outdir: string) {
  const res = Bun.spawnSync({
    cmd: ["java", "-jar", "./apktool.jar", "d", path, "-o", outdir],
    cwd: import.meta.dirname,
    stderr: "pipe",
  });
  const err = res.stderr.toString();
  if (err) {
    console.log(err);
    process.exit(1);
  }
  if (await isBlobVersion(outdir)) {
    Bun.spawnSync({
      cmd: ["pyxamstore", "unpack"],
      cwd: normalize(`${outdir}${pathToAssembly}`),
    });
    console.log(
      `Decompiled dlls in ${normalize(
        `${outdir}${pathToAssembly}/out`
      )} (with pyxamstore)`
    );
  } else {
    console.log(
      `Decompiled dlls in ${normalize(
        `${outdir}${pathToAssembly}`
      )}\nLook like The old xamarin dll handling (did not need pyxamstore)`
    );
  }
}
