# NMDC Field Notes

The NMDC metadata collection app designed for use in the field.

## Development

### Install dependencies 

You need to have the [Ionic CLI](https://ionicframework.com/docs/cli) installed. It is recommended to install this globally:

```shell
npm install -g @ionic/cli
```

Install the project dependencies:

```shell
npm install
```

### Environment setup for Capacitor

[Capacitor](https://capacitorjs.com/) is a library which provides access to native device functionality (location, camera, storage, etc) to the web application. Review their [Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup) documentation and make sure you have the necessary dependencies installed.

### Run the development server

Run

```shell
npm run dev
```

This will start a development server on `localhost:5173`. It is recommended that you use your browser's developer tools to [view it in a mobile-sized viewport](https://ionicframework.com/docs/developing/previewing#simulating-a-mobile-viewport). 

Ionic includes logic to automatically switch between iOS and Material styles based on the browsers user agent. For most browsers you will see Material by default. This can be manually overridden by adding the `ionic:mode` [query parameter](https://ionicframework.com/docs/developing/tips#changing-mode) to any URL, for example `http://localhost:5173/?ionic:mode=ios`

### View on an iOS simulator 

To run on an iOS simulator, first download and install [Xcode](https://developer.apple.com/xcode/) if you haven't already. 

If this is your first time running the simulator _or_ you have added a Capacitor plugin since the last time you ran the simulator run:

```shell
ionic capacitor sync ios
```

Start the simulator with live reloading enabled by running:

```shell
ionic cap run ios --livereload --external
```

This may take a minute or so to start initially. You should see the message `Deploying App.app to <uuid>` written to the console and then the simulator window should open.

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
that this project uses Prettier; which may influence some features of the editor.
