# NMDC Field Notes

The NMDC metadata collection app designed for use in the field.

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

### Setup Capacitor environment

[Capacitor](https://capacitorjs.com/) is a library that gives the web application access to the device's native functionality (e.g. location, camera, and storage). Review the Capacitor [environment setup](https://capacitorjs.com/docs/getting-started/environment-setup) documentation and make sure you have the necessary dependencies installed.

### Start development server

Run the `dev` script defined in `package.json`.

```shell
npm run dev
```

That will start a development server, serving the web version of the mobile app.

> The development server is powered by [Vite](https://vitejs.dev/guide/cli.html#dev-server).

### Visit development server

We recommend you use your web browser's developer tools to [decrease the size of your web browser's viewport]((https://ionicframework.com/docs/developing/previewing#simulating-a-mobile-viewport)) so that it resembles the screen of a mobile device, then visit the development server. 

You can visit the development server at: 

- http://localhost:5173

#### Switching styles between iOS and Android

By default, Ionic will use the web browser's user agent to determine whether to style the web app like an iOS app or an Android app. For most web browser user agents, it will style it like an Android app. You can force a particular style by adding the `ionic:mode` [query parameter](https://ionicframework.com/docs/developing/tips#changing-mode) to the URL.

For example, to force Ionic to style the web app like an iOS app:

```diff
- http://localhost:5173/
+ http://localhost:5173/?ionic:mode=ios
```

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
