import { isBlobVersion, pathToAssembly, pathToBlob } from "./utils";
import { cpSync, rmSync, renameSync } from "fs";
import { normalize } from "path";
import { resolve } from "path";
import { options } from "./params";

export default async function _Compiler(apk_path: string, outdir: string) {
  return new Compiler(apk_path, outdir).make();
}

class Compiler {
  private tmp_path: string = normalize(import.meta.dirname + `/tmp`);
  private tmp_apk_path: string;
  private apk_path: string;
  private outFile: string;
  private uuid = Bun.randomUUIDv7();
  private tmp_apk_pathname: string;

  constructor(apk_dir_path: string, outFile: string) {
    this.outFile = resolve(outFile);
    this.tmp_apk_path = resolve(
      normalize(this.tmp_path + `/${apk_dir_path.split("/").pop()}`)
    );
    this.apk_path = resolve(apk_dir_path);

    this.tmp_apk_pathname = normalize(`${this.tmp_path}/${this.uuid}.apk`);
  }

  async make() {
    this.toTmp();
    await this.onBlobVersion();
    this.toAPK();
    this.signAPK();
    this.cleanup();
  }

  toAPK() {
    console.log("compiling to APK");
    const proc = Bun.spawnSync({
      cmd: [
        "java",
        "-jar",
        "apktool.jar",
        "b",
        this.tmp_apk_path,
        "-o",
        this.tmp_apk_pathname,
      ],
      cwd: import.meta.dirname,
      stderr: "pipe",
    });
    const err = proc.stderr.toString();
    if (err) {
      console.log(err);
      process.exit(1);
    }
  }
  signAPK() {
    if (options.sign) {
      return renameSync(this.tmp_apk_pathname, this.outFile);
    }
    console.log("Signing the apk");
    const proc = Bun.spawnSync({
      cmd: ["objection", "signapk", this.tmp_apk_pathname],
      stderr: "pipe",
    });
    const err = proc.stderr.toString();
    if (err) {
      console.log(err);
      process.exit(1);
    }
    rmSync(this.tmp_apk_pathname);
    const outfile = this.tmp_apk_pathname.split(".");
    outfile.pop();
    outfile.push("objection", "apk");
    const objectionAPKPath = outfile.join(".");
    renameSync(objectionAPKPath, this.outFile);
  }

  toTmp() {
    cpSync(this.apk_path, this.tmp_apk_path, {
      recursive: true,
    });
  }

  compileBlob() {
    console.log("Recompiling assemblies.blob and assemblies.manifest");
    const err = Bun.spawnSync({
      cwd: normalize(`${this.tmp_apk_path}/${pathToAssembly}`),
      cmd: ["pyxamstore", "pack"],
      stderr: "pipe",
    }).stderr.toString();

    if (err) {
      console.log(err);
      process.exit(1);
    }

    rmSync(normalize(`${this.tmp_apk_path}/${pathToBlob}`));
    rmSync(
      normalize(`${this.tmp_apk_path}/${pathToAssembly}/assemblies.manifest`)
    );
    renameSync(
      normalize(`${this.tmp_apk_path}/${pathToBlob}.new`),
      normalize(`${this.tmp_apk_path}/${pathToBlob}`)
    );
    renameSync(
      normalize(
        `${this.tmp_apk_path}/${pathToAssembly}/assemblies.manifest.new`
      ),
      normalize(`${this.tmp_apk_path}/${pathToAssembly}/assemblies.manifest`)
    );
  }

  async onBlobVersion() {
    if ((await isBlobVersion(this.apk_path)) == false) return;

    this.compileBlob();
  }
  cleanup() {
    if (options.cleanUp) return;
    console.log("cleaning-up");
    rmSync(this.tmp_apk_path, { recursive: true, force: true });
    rmSync(this.tmp_apk_pathname, { force: true });
  }
}
