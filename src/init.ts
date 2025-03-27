export function init() {
  CheckDependencies();
}

function installPyxamstore() {
  return Bun.spawnSync({
    cmd: [
      "pip3",
      "install",
      "-U",
      "git+https://github.com/AbhiTheModder/pyxamstore",
    ],
    stderr: "pipe",
    stdout: "inherit",
  });
}
function installObjection() {
  return Bun.spawnSync({
    cmd: ["pipx", "install", "objection"],
    stderr: "pipe",
    stdout: "inherit",
  });
}

const deps: Array<{
  name: string;
  callback: () => Bun.SyncSubprocess<"inherit", "pipe"> | void;
  onError?: () => void;
}> = [
  {
    name: "pipx",
    callback: () => {
      console.log("must install pipx");
      process.exit(0);
    },
  },
  {
    name: "pip3",
    callback: () => {
      console.log("must install pip3");
      process.exit(0);
    },
  },
  {
    name: "pyxamstore",
    callback: installPyxamstore,
    onError: () =>
      console.log(
        "you must install https://github.com/AbhiTheModder/pyxamstore manually"
      ),
  },
  {
    name: "objection",
    callback: installObjection,
  },
] as const;

function CheckDependencies() {
  for (const dep of deps) {
    if (!Bun.which(dep.name)) {
      console.log(`installing ${dep.name}`);
      const proc = dep.callback();
      const err = proc?.stderr.toString();
      if (err) {
        dep.onError?.();
        console.log(`${err}\n Error while installing ${dep.name}`);
      }
    }
  }
}
