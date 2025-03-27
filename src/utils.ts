import { normalize } from "path";

export const pathToAssembly = "/unknown/assemblies" as const;
export const pathToBlob = "/unknown/assemblies/assemblies.blob" as const;

export function isBlobVersion(path: string) {
  console.log(normalize(`${path}/${pathToBlob}`));
  return Bun.file(normalize(`${path}/${pathToBlob}`)).exists();
}
