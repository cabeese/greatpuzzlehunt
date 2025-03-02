# The Great Puzzle Hunt
An on-line and in person real-time puzzle scavenger hunt!

## Development Setup (As of Meteor 3)

> Meteor 3 considerably modified the install process. The instructions here are brief because of that, but may be incomplete.

You should have NodeJS (and possibly Python) installed on your machine. Then:

```bash
npx meteor
```

The [Meteor docs](https://docs.meteor.com/about/install.html) have further details.

After installing meteor and cloning this repository, run

```bash
npm start
```

to start the server. Then navigate to `localhost:3000` to see the page.

## Development Setup Prior to Meteor 3

> NOTE: These instructions are for older versions of the project using Meteor@2.

1. Install `python2` if you don't already have it (needed for nvm). You'll likely also need `build-essential` and `coreutils` package if on a fresh Linux install.)

2. Install [NVM](https://github.com/creationix/nvm)

3. Install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/). You may want to install the version used in the Heroku mLab instance (as of Spring 2020, that's `3.6.9`). Also read the section about preventing `apt-get` from updating your mongodb install when you're not watching.

4. Install [Meteor](https://www.meteor.com/install)

5. Use NVM to install Node 8.12 (mirroring Heroku) and set an alias for that version as meteor.  If you want to use [yarn](https://code.facebook.com/posts/1840075619545360) as well install yarn.

  ```bash
  $ nvm install 8.12.0
  $ nvm alias meteor 8.12.0
  $ nvm use meteor
  $ npm i -g yarn # optional, if using yarn
  ```
6. Clone the repo

  ```bash
  $ git clone git@github.com:cabeese/greatpuzzlehunt.git
  ```
7. CD into the repo and install NPM packages

  ```bash
  $ cd greatpuzzlehunt/
  $ npm install  # or use `yarn install`
  ```
8. If you'd like to, edit the `settings-development.json` file, but don't commit these changes to the repo.

9. Run the application using the scripts define in `package.json`

  ```
  $ npm start
  ```

10. In another shell you can connect to the Meteor server with the Meteor shell (much like rails console).
  ```
  $ meteor shell
  ```

# Scripts

A few handy scripts exist in the `scripts/` directory.

* `sh scripts/hh_export.sh` will export all the users in the database. Used for "hold harmless" records.
* `sh scripts/update-heroku-config` will update the configuration settings in Heroku based on the `settings-prod.json` file.
* `sh restore_db.sh` will restore the local MongoDB database with the contents of a Mongo "dump" file `gph-mongo.dump`

# Troubleshooting

You might see an error message about not having the right version of bcrypt/missing bcrypt. Just manually install it:

```bash
$ meteor npm install bcrypt
```

If you get a @babel/runtime error, reinstall the correct babel runtime version:

```bash
$ meteor npm install @babel/runtime@7.0.0-beta.55
```

If you're developing on Windows, you may encounter a cannot find  module 'fibers' error. To fix this, run the following command:

```bash
meteor update --release 1.6.1.2-rc.0
```
