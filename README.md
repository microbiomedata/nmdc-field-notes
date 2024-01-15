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
