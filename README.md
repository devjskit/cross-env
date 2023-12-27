# @devjskit/cross-env

Run scripts that set and use environment variables across platforms

## The problem

Most Windows command prompts will choke when you set environment variables with
`NODE_ENV=production` like that. (The exception is [Bash on Windows][win-bash],
which uses native Bash.) Similarly, there's a difference in how windows and
POSIX commands utilize environment variables. With POSIX, you use: `$ENV_VAR`
and on windows you use `%ENV_VAR%`.

## This solution

`@devjskit/cross-env` makes it so you can have a single command without worrying about
setting or using the environment variable properly for the platform. Just set it
like you would if it's running on a POSIX system, and `@devjskit/cross-env` will take care
of setting it properly.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev @devjskit/cross-env
```

> WARNING! Make sure that when you're installing packages that you spell things
> correctly to avoid [mistakenly installing malware][malware]

> NOTE : Version 7 of cross-env only supports Node.js 10 and higher

## Usage

I use this in my npm scripts:

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

Ultimately, the command that is executed (using [`cross-spawn`][cross-spawn])
is:

```
webpack --config build/webpack.config.js
```

The `NODE_ENV` environment variable will be set by `cross-env`

You can set multiple environment variables at a time:

```json
{
  "scripts": {
    "build": "cross-env FIRST_ENV=one SECOND_ENV=two node ./my-program"
  }
}
```

You can also split a command into several ones, or separate the environment
variables declaration from the actual command execution. You can do it this way:

```json
{
  "scripts": {
    "parentScript": "cross-env GREET=\"Joe\" npm run childScript",
    "childScript": "cross-env-shell \"echo Hello $GREET\""
  }
}
```

Where `childScript` holds the actual command to execute and `parentScript` sets
the environment variables to use. Then instead of run the childScript you run
the parent. This is quite useful for launching the same command with different
env variables or when the environment variables are too long to have everything
in one line. It also means that you can use `$GREET` env var syntax even on
Windows which would usually require it to be `%GREET%`.

If you precede a dollar sign with an odd number of backslashes the expression
statement will not be replaced. Note that this means backslashes after the JSON
string escaping took place. `"FOO=\\$BAR"` will not be replaced.
`"FOO=\\\\$BAR"` will be replaced though.

Lastly, if you want to pass a JSON string (e.g., when using [ts-loader]), you
can do as follows:

```json
{
  "scripts": {
    "test": "cross-env TS_NODE_COMPILER_OPTIONS={\\\"module\\\":\\\"commonjs\\\"} node some_file.test.ts"
  }
}
```

Pay special attention to the **triple backslash** `(\\\)` **before** the
**double quotes** `(")` and the **absence** of **single quotes** `(')`. Both of
these conditions have to be met in order to work both on Windows and UNIX.

## `cross-env` vs `cross-env-shell`

The `cross-env` module exposes two bins: `cross-env` and `cross-env-shell`. The
first one executes commands using [`cross-spawn`][cross-spawn], while the second
one uses the `shell` option from Node's `spawn`.

The main use case for `cross-env-shell` is when you need an environment variable
to be set across an entire inline shell script, rather than just one command.

For example, if you want to have the environment variable apply to several
commands in series then you will need to wrap those in quotes and use
`cross-env-shell` instead of `cross-env`.

```json
{
  "scripts": {
    "greet": "cross-env-shell GREETING=Hi NAME=Joe \"echo $GREETING && echo $NAME\""
  }
}
```

The rule of thumb is: if you want to pass to `cross-env` a command that contains
special shell characters _that you want interpreted_, then use
`cross-env-shell`. Otherwise stick to `cross-env`.

On Windows you need to use `cross-env-shell`, if you want to handle
[signal events](https://nodejs.org/api/process.html#process_signal_events)
inside of your program. A common case for that is when you want to capture a
`SIGINT` event invoked by pressing `Ctrl + C` on the command-line interface.

## Windows Issues

Please note that `npm` uses `cmd` by default and that doesn't support command
substitution, so if you want to leverage that, then you need to update your
`.npmrc` to set the `script-shell` to powershell.

## Inspiration

I originally created this to solve a problem I was having with my npm scripts in
[angular-formly][angular-formly]. This made contributing to the project much
easier for Windows users.

## Issues

_Looking to contribute? Look for the [Good First Issue][good-first-issue]
label._

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

[**See Bugs**][bugs]

### 💡 Feature Requests

This project is in maintenance mode and no new feature requests will be considered.
