yt-cli
======

A CLI for YouTrack

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/yt-cli.svg)](https://npmjs.org/package/yt-cli)
[![Downloads/week](https://img.shields.io/npm/dw/yt-cli.svg)](https://npmjs.org/package/yt-cli)
[![License](https://img.shields.io/npm/l/yt-cli.svg)](https://github.com/benfo/yt-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g yt-cli
$ yt COMMAND
running command...
$ yt (-v|--version|version)
yt-cli/0.0.0 win32-x64 node-v12.18.1
$ yt --help [COMMAND]
USAGE
  $ yt COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yt hello [FILE]`](#yt-hello-file)
* [`yt help [COMMAND]`](#yt-help-command)

## `yt hello [FILE]`

describe the command here

```
USAGE
  $ yt hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ yt hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/benfo/yt-cli/blob/v0.0.0/src\commands\hello.ts)_

## `yt help [COMMAND]`

display help for yt

```
USAGE
  $ yt help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src\commands\help.ts)_
<!-- commandsstop -->
