# NMDC Field Notes

NMDC Field Notes is a mobile app researchers can use to collect metadata in the field.

The app is currently in development.

## Development

### Install dependencies

#### Node.js and npm

Install [Node.js v20](https://nodejs.org/en/download/), which includes npm.

> Once you've done that, you'll be able to run Node.js via `$ node` and npm via `$ npm`.

#### Ionic CLI

Install the [Ionic CLI](https://ionicframework.com/docs/cli) globally.

```shell
npm install -g @ionic/cli
```

> The `-g` option tells npm you want it to install that package globally, which the Ionic CLI's authors recommend.
> Once you've done that, you'll be able to run the Ionic CLI via `$ ionic`.

#### npm packages

Install the npm packages upon which this project depends.

```shell
npm install
```

> That tells npm you want it to install all the packages listed in the `package-lock.json` file,
> which was programmatically generated from the manually-maintained `package.json` file.

### Set up Capacitor environment

[Capacitor](https://capacitorjs.com/) is a library that gives the web application access to the device's native functionality (e.g. location, camera, and storage). Review the Capacitor [environment setup](https://capacitorjs.com/docs/getting-started/environment-setup) documentation and make sure you have the necessary dependencies installed.

### Setup local environment

The application loads values from environment variables defined in a `.env.local` file. This file is not checked into source control. It is [loaded automatically by Vite](https://vitejs.dev/guide/env-and-mode), and the values are exposed on the `import.meta.env` object. You can copy the `.env.local.example` file to `.env.local` to get started.

```shell
cp .env.local.example .env.local
```

### Start development server

Run the `dev` script defined in `package.json`.

```shell
npm run dev
```

That will start a development server, serving the web version of the mobile app.

> The development server is powered by [Vite](https://vitejs.dev/guide/cli.html#dev-server).

### Visit development server

We recommend you use your web browser's developer tools to [decrease the size of your web browser's viewport](<(https://ionicframework.com/docs/developing/previewing#simulating-a-mobile-viewport)>) so that it resembles the screen of a mobile device, then visit the development server.

You can visit the development server at:

- http://localhost:5173

#### Switching styles between iOS and Android

By default, Ionic will use the web browser's user agent to determine whether to style the web app like an iOS app or an Android app. For most web browser user agents, it will style it like an Android app. You can force a particular style by adding the `ionic:mode` [query parameter](https://ionicframework.com/docs/developing/tips#changing-mode) to the URL.

For example, to force Ionic to style the web app like an _iOS_ app, you can modify the URL like this:

```diff
- http://localhost:5173/
+ http://localhost:5173/?ionic:mode=ios
```

### Run linter

Run the linter.

```shell
npm run lint
```

> That tells npm you want it to run the script named `lint`, defined in the `package.json` file.
> At the time of this writing, that script runs `eslint src`.

### Run automated tests

#### Unit tests

Run the unit tests.

```shell
npm run test.unit
```

> That tells npm you want it to run the script named `test.unit`, defined in the `package.json` file.
> At the time of this writing, that script runs `vitest`.

#### End-to-end tests

Assuming the development server is running, you can run the end-to-end tests with:

```shell
npm run test.e2e
```

> That tells npm you want it to run the script named `test.e2e`, defined in the `package.json` file.
> At the time of this writing, that script runs `cypress run`.

### (Optional) Run iOS simulator

Assuming you're using a Mac, here's how you can simulate the iOS version of the mobile app.

Download and install [Xcode](https://developer.apple.com/xcode/) (if you haven't already).

If either (a) this is your first time running the simulator, or (b) you have added a Capacitor plugin since the last time you ran the simulator; run:

```shell
ionic capacitor sync ios
```

Start the simulator with live reloading enabled.

```shell
ionic cap run ios --livereload --external
```

The simulator may take a few minutes to start. Eventually, the console will say "`Deploying App.app to <uuid>`" and the simulator will appear.

### Format code

We use [Prettier](https://prettier.io/) to ensure the files in this repository are formatted the way we want.

You can use it like this:

```shell
# Check whether any files are not formatted.
npx run format:check

# Format all files.
npx run format
```

The `.prettierignore` file tells Prettier which files we want it to
[ignore](https://prettier.io/docs/en/ignore#ignoring-files-prettierignore) (i.e. to _not_ format).

> The `.prettierignore` file automatically inherits from the `.gitignore` file.

The `prettier.config.js` file can be used to override Prettier's
default [configuration](https://prettier.io/docs/en/configuration).

> Also, the presence of the file signifies to [code editors](https://prettier.io/docs/en/editors)
> that this project uses Prettier; which may influence some features of the editor.

### Preview UI components

We use [Storybook](https://storybook.js.org/) to preview UI components in isolation.

> Storybook is an interactive directory of your UI components and their stories.
> In the past, you'd have to spin up the app, navigate to a page, and contort the UI into the right state. (...)
> With Storybook, you can skip all those steps and jump straight to working on a UI component in a specific state.
>
> Source: [Why Storybook?](https://storybook.js.org/docs/get-started/why-storybook#storybook-keeps-track-of-every-story)

You can start the Storybook web server by running:

```shell
npm run storybook
```

Once the Storybook web server is running, you will be able to access it at:

- http://localhost:6006
