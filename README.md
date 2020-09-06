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
yt-cli/0.0.1 win32-x64 node-v12.18.1
$ yt --help [COMMAND]
USAGE
  $ yt COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`yt cmd ID COMMAND`](#yt-cmd-id-command)
* [`yt git:start [ISSUEID]`](#yt-gitstart-issueid)
* [`yt help [COMMAND]`](#yt-help-command)
* [`yt init`](#yt-init)
* [`yt issues`](#yt-issues)
* [`yt issues:comments:add [COMMENT]`](#yt-issuescommentsadd-comment)
* [`yt issues:open ID`](#yt-issuesopen-id)
* [`yt issues:query`](#yt-issuesquery)

## `yt cmd ID COMMAND`

```
USAGE
  $ yt cmd ID COMMAND

ARGUMENTS
  ID       The issues ID
  COMMAND  The command to run

OPTIONS
  --comment=comment
```

_See code: [src\commands\cmd.ts](https://github.com/benfo/yt-cli/blob/v0.0.1/src\commands\cmd.ts)_

## `yt git:start [ISSUEID]`

```
USAGE
  $ yt git:start [ISSUEID]

ARGUMENTS
  ISSUEID  The issue ID

OPTIONS
  -d, --description=description  A short, actionable description
  -p, --prefix=prefix            The branch prefix to use
  -y, --yes                      Accept defaults without prompting for input
```

_See code: [src\commands\git\start.ts](https://github.com/benfo/yt-cli/blob/v0.0.1/src\commands\git\start.ts)_

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

## `yt init`

```
USAGE
  $ yt init
```

_See code: [src\commands\init.ts](https://github.com/benfo/yt-cli/blob/v0.0.1/src\commands\init.ts)_

## `yt issues`

Provides access to issues

```
USAGE
  $ yt issues

OPTIONS
  -q, --query=query       [default: #me #issues sort by: updated]
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --skip=skip
  --sort=sort             property to sort by (prepend '-' for descending)
  --top=top               [default: 10]
```

_See code: [src\commands\issues\index.ts](https://github.com/benfo/yt-cli/blob/v0.0.1/src\commands\issues\index.ts)_

## `yt issues:comments:add [COMMENT]`

```
USAGE
  $ yt issues:comments:add [COMMENT]

OPTIONS
  -e, --editor
  --id=id         (required)

  --usesMarkdown  When `true`, the comment text is parsed as Markdown. When `false`, the comment text is parsed as
                  YouTrack Wiki. Changing this value does not transform the markup from one syntax to another.
```

_See code: [src\commands\issues\comments\add.ts](https://github.com/benfo/yt-cli/blob/v0.0.1/src\commands\issues\comments\add.ts)_

## `yt issues:open ID`

```
USAGE
  $ yt issues:open ID

ARGUMENTS
  ID  The issue ID
```

_See code: [src\commands\issues\open.ts](https://github.com/benfo/yt-cli/blob/v0.0.1/src\commands\issues\open.ts)_

## `yt issues:query`

Provides access to issues

```
USAGE
  $ yt issues:query

OPTIONS
  -q, --query=query       [default: #me #issues sort by: updated]
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --skip=skip
  --sort=sort             property to sort by (prepend '-' for descending)
  --top=top               [default: 10]
```

_See code: [src\commands\issues\query.ts](https://github.com/benfo/yt-cli/blob/v0.0.1/src\commands\issues\query.ts)_
<!-- commandsstop -->
