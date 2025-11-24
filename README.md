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

## License

Apache 2.0
