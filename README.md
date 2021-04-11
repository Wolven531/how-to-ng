# How To NG

This repository is used to demonstrate various Angular techniques

## Requirements

* NodeJS (running version 14.x.x)
* NPM (running version 6.x.x)

## Scripts

### Important

* `npm run build` - Compiles a complete `dist` folder for simple FTP-style deployment
* `npm run serve` - Starts the application locally on prt 8080 and opens the system's default browser to the application
* `npm start` - Starts the application locally
* `npm test` - Runs the unit tests and reports code coverage

### Miscellaneous

* Angular related
	* `npm run ng`
* Git related
	* `npm run write-git-commit-to-file` - used to bump the version listed in version.info (during precommit hook)
	* `npm run prepare` - used to setup the Husky CLI tool
* Heroku related
	* `npm run heroku-postbuild` - used by Heroku to generate a deployable directory (`dist`)
	* `npm run heroku-prebuild` - used by Heroku to install application dependencies
	* `npm run start:heroku` - used by Heroku to start the application
* NodeJS / NPM related
	* `npm run prebuild` - generic script that installs dependencies prior to a build step

### Notes

This project was seeded [using this guide](https://elements.heroku.com/buttons/pbraswell/heroku-angular-seed)
