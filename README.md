## GitKamaji

GitKamaji lets you use Windows Git clients while transparently executing all Git operations inside WSL. It translates commands, fixes paths, and provides a seamless cross-environment workflow between Windows tools and your WSL Git setup.

![18d82fc0b11c1b6ee405c012905b719b](https://github.com/user-attachments/assets/f723f557-563f-4a38-9787-407c49e6a26f)

## Features

Run Git from Windows clients while using WSL’s Git.

Automatic command translation and path normalization.

No need to install or configure Git separately on Windows.

Lightweight, fast, and easy to integrate.

## How It Works

GitKamaji sits between the Windows Git client and your WSL Git installation.
When a Git command is executed on Windows, GitKamaji forwards it to WSL, adjusts paths, and returns the output back to the client transparently.

## Roadmap

Improved error handling

Better Windows/WSL path resolution

Optional logging and metrics

## Build from source

Requirements: [Bun](https://bun.sh) installed.

```bash
bun install
bun run build
```

This produces the following executables under `dist/`:

- `dist/git.exe`
- `dist/bash.exe`
- `dist/sh.exe`

The project is compiled with `bun build --compile --target=bun-windows-x64`, so you can cross-compile the Windows binaries from Linux/macOS as well. The runtime is embedded, so the resulting `.exe` files run on Windows without Bun installed.

> Compiled binaries are distributed through GitHub Releases (versioning still to be defined), so you normally do not need to build them yourself.

## License

Apache 2.0
