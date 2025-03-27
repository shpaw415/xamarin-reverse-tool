# xamarin-reverse-tool

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/shpaw415/xamarin-reverse-tool/refs/heads/main/install.sh | bash
```

Add 
```bash
export PATH=$HOME/.xamarin-reverse-tool/xamarin-reverse-tool:$PATH
```
to your .zshrc or .bashrc



## Usage

```cli-bash
Usage: xamarin-reverse-tool [options]

CLI xamarin reverse-engineering tool

Options:
  -V, --version           output the version number
  -d, --decompile [PATH]  decompile with apktool and pyxamstore
  -o, --outdir [PATH]     output files for decompile
  -c, --compile [PATH]    Compile previously decompiled apk dir path
  --no-clean-up           keep the tmp dir after compile
  --no-sign               prevent signing and zip-lining the apk on compile
  -h, --help              display help for command
```

## Decompile

```cli-bash
xamarin-reverse-tool -d app.apk -o ./analyse
```

## Recompile

```cli-bash
xamarin-reverse-tool -c ./analyse -o app.modded.apk
```


### Other tools

- dnspy for modifying classes in the DLLs
  - https://github.com/dnSpy/dnSpy.git
  
- vscode plugin for exploring the DLLs
  - [ilspy-vscode](https://marketplace.visualstudio.com/items?itemName=icsharpcode.ilspy-vscode)