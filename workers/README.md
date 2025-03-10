# Motivation

As originally created, the GPH site is a single Meteor server, which
can have multiple instances running in parallel across different
servers (Heroku "Dynos") to improve throughput handling. This works
well for client-initiated requests such as page loading, Puzzle
starting/stopping, team creation, and so on.

However, there is one piece of functionality that does not match well
with this type of configuration: there is a repeated process that
happens during gameplay where all active teams are polled to determine
if they have run out of time on a puzzle. This needs to happen
frequently so teams don't go beyond their time, but it does not need
to scale out in parallel in the same way web request servicing can be.

Instead, the "puzzle watcher" needs only a single running instance at
any given time. In order to achieve this, we make use of Heroku
"worker" dynos which can be scaled manually separately from the web
dynos. This means that the Watcher can run in its own, independent
Unix process without affecting the event loop of every single web
worker.

# Technical Details

> Note that some of this is Heroku-configuration-specific and may not
  apply directly to other hosting services.

The `Procfile` informs Heroku what resources are needed to run the
app. By default, it includes a single line for Web dynos based on the
"horse" buildpack. We add an additional configuration for starting and
running a separate Node process that watches for timed-out puzzles.

Note that because the Watcher is not running under the Meteor context,
we don't have access to some of the Meteor convenience functions (like
MongoDB collections or logging).

# Running Locally

You can run this app locally either with or without the separate
watcher process. Running `npm start` like normal will start the server
with the watcher running in the Meteor process (legacy setup).

If you'd like to run with the separate watcher process, you must:

* Start the server with `PUZZLE_WATCHER_IN_MAIN_PROCESS=false`
* Start the Watcher process

To start the server without the watcher process, either modify the
flag in the `package.json` file or run

```shell
meteor --settings settings-development
```

> If the env var is unset or set to `0` or `false`, the server will
  assume the worker is running instead.

The watcher can be started in two ways:

### Via Heroku CLI

This method is preferred as it exercises the configuration in the
`Procfile`. However, if you do not have the Heroku CLI installed, you
can use the second method.

```shell
MONGO_URL="mongodb://127.0.0.1:3001/meteor" heroku local worker
```

### Via Node

This option is suitable if you don't have the Heroku CLI. It should be
functionally equivalent.

```shell
MONGO_URL="mongodb://127.0.0.1:3001/meteor" node workers/puzzle-timeouts.js
```
