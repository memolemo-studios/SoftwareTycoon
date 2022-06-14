**Thank you for your interest in contributing to Software Tycoon!**

## Requirements

We assume you know or understand these things before contributing to this project.

**I have resources to teach you for that. Thank me later!**

- Learned the basics of using the terminal

    - [Command Prompt](https://www.youtube.com/watch?v=MBBWVgE0ewk&list=PL6gx4Cwl9DGDV6SnbINlVUd0o2xT4JbMu) (for Windows)
    - Bash
        - [MacOS Mojave and older](https://www.youtube.com/watch?v=aKRYQsKR46I)
        - [Linux](https://www.youtube.com/watch?v=cBokz0LTizk)
    - [ZSH](https://www.youtube.com/watch?v=ogWoUU2DXBU) (MacOS Catalina and newer)

- Have knowledge of [TypeScript](https://typescriptlang.org), [Lua](https://lua.org) and basics of [ROBLOX Lua API](https://developer.roblox.com)

- [Git and GitHub](https://www.youtube.com/watch?v=RGOj5yH7evk) (if you're planning to publish your own Software Tycoon game)

## Getting Started

First, we'll need to setup the development environment for Software Tycoon.

To setup the development environment, you'll need to install
the required programs:

- [Node.js](https://nodejs.org)
- [roblox-ts](https://roblox-ts.com)
- [Git](https://git-scm.org)
- [Foreman](https://github.com/Roblox/foreman)
- [Yarn](https://classic.yarnpkg.com) (Optional)
- GNU Makefile

### Cloning the repository

To clone the repository, go to the terminal and copy and paste
this command below:

**Via HTTP:**
```sh
git clone https://github.com/memolemo-studios/SoftwareTycoon
```

**Via SSH (preferred):**
```sh
git clone git@github.com:memolemo-studios/SoftwareTycoon
```

**How it does**: It downloads the entire repository or the code
of the game and stores it depending on your current working directory.

If your current working directory is in home directory (`/home/your_username` or `C:\Users\YOUR_USERNAME`), SoftwareTycoon code folder stores here.

### Installing required programs

Don't freak out, we can install required programs with our good old friend, Foreman.

Run this command below to install necessary programs (available in [foremam.toml](foreman.toml) file):
```
foreman install
```

### Compiling the game

Before we compile the game, we need to install packages or required stuff for Software Tycoon.

**To install packages, type either**:
```sh
# NPM
npm install

# Yarn
yarn
```

Be patient because it takes awhile to get it up and running.

Once the installation of packages is done, compile the game by typing this command below:
```sh
# NPM
npm run compile && npm build

# Yarn
yarn compile && yarn build
```

`yarn compile` - compiles the game code from TypeScript to Roblox Lua (specifically Luau)

`yarn build` - combines all the assets, scripts and other stuff into a single file known as `game.rbxlx`

**Open it ROBLOX Studio (Windows and MacOS only) and enjoy making your modifications or do something with this game by a code editor.**

### Updating the repository

Let's say, there's an update in Software Tycoon and you want to tinker with it. You can update the repository by running this command:
```sh
# It will download and load the latest changes from the repository
git pull
```

**And... then compile it from the last section.**

## Commit guidelines
This repository restricts any commit messages that are not formatted according to conventional commits.

To learn more about styling commit messages, visit their [website](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).

## Unit Testing

**Software Tycoon** has a suite of automated unit tests in every `*.spec.ts` file.

1. Compile the game, as usual.
2. Run `yarn test` or `npm test` to execute tests.

You can run this process yourself if you have ROBLOX Studio installed. (Windows and MacOS only)
