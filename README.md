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

The application loads values from environment variables defined in a `.env.local` file.

> That file is intentionally not stored in the Git repository. That file is [loaded automatically by Vite](https://vitejs.dev/guide/env-and-mode), which exposes the environment variables via the `import.meta.env` object. The application's `config.ts` file then uses that object to make a `config` object—and the rest of the application uses that `config` object instead of directly accessing the `import.meta.env` object.

You can copy the `.env.local.example` file to `.env.local` to get started.

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

### Using a local `nmdc-server`

If you want your local Field Notes instance to work with a local `nmdc-server` instance, there are a few environment variables to set on the server side.

The `NMDC_CORS_ALLOW_ORIGINS` variable controls which origins are allowed to make CORS requests to the server. It is a comma-separated list of origins. Add `http://127.0.0.1:8100` to allow requests from the web-based interface. Add `capacitor://localhost` and `https://localhost` to allow requests from device simulators. So for example, in the `nmdc-server` `.env` file:

```
NMDC_CORS_ALLOW_ORIGINS=capacitor://localhost,https://localhost,http://127.0.0.1:8100
```

The `NMDC_LOGIN_REDIRECT_ALLOW_ORIGINS` variable controls which origins are allowed to redirect to after login. It is a comma-separated list of origins. Add `http://127.0.0.1:8100` to allow redirects to the web-based interface. Add `org.microbiomedata.fieldnotes://` to allow redirects to mobile apps. So for example, in the `nmdc-server` `.env` file:

```
NMDC_LOGIN_REDIRECT_ALLOW_ORIGINS=http://127.0.0.1:8100,org.microbiomedata.fieldnotes://
```

### Using the dev `nmdc-server`

Alternatively, you can have your local Field Notes instance talk to the dev `nmdc-server` instance. In that case, you can set the `NMDC_SERVER_URL` environment variable in your `.env.local` file to `https://data-dev.microbiomedata.org`.

### Visit development server

We recommend you use your web browser's developer tools to [decrease the size of your web browser's viewport](<(https://ionicframework.com/docs/developing/previewing#simulating-a-mobile-viewport)>) so that it resembles the screen of a mobile device, then visit the development server.

You can visit the development server at:

- http://127.0.0.1:8100

#### Switching styles between iOS and Android

By default, Ionic will use the web browser's user agent to determine whether to style the web app like an iOS app or an Android app. For most web browser user agents, it will style it like an Android app. You can force a particular style by adding the `ionic:mode` [query parameter](https://ionicframework.com/docs/developing/tips#changing-mode) to the URL, as shown below.

##### Force iOS style

```diff
- http://127.0.0.1:8100/
+ http://127.0.0.1:8100/?ionic:mode=ios
```

##### Force Android style

```diff
- http://127.0.0.1:8100/
+ http://127.0.0.1:8100/?ionic:mode=md
```

> The `md` stands for [Material Design](https://material.google.com).

### Run linter

Run the linter.

```shell
npm run lint
```

> That tells npm you want it to run the script named `lint`, defined in the `package.json` file.
> At the time of this writing, that script runs `eslint src`.

### Run circular import check

Identify circular imports using the [`madge`](https://github.com/pahen/madge) package.

```shell
npm run check.imports
```

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
npm run check.format

# Format all files.
npm run format
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

### Add an environment variable

Here's how you can introduce a new environment variable to the code base:

1. Add its TypeScript type information to the `ImportMetaEnv` interface in `src/vite-env.d.ts`
2. Add its name and an example value to `.env.local.example`
3. Add the variable to the `Config` interface and the `config` object in `config.ts`
4. Elsewhere in the code base, access the variable via the `config` object exported by `config.ts` (instead of
   accessing `import.meta.env.{NAME}` directly)

### Make a release

Creating a release involves three steps: 

* Increment the build number and optionally update the version number
* Create and distribute a new Android build
* Create and distribute a new iOS build

#### Incrementing build and version numbers

**Decide**: Are you releasing a new **build** or a new **version**?

<details>
<summary>How do I choose?</summary>

* A build release is a new **internal** release of the app. It may be thought of as a release candidate. It implies a new `buildNumber` in `package.json`. This corresponds to a new "build number" in [iOS terms](https://help.apple.com/xcode/mac/current/#/devba7f53ad4) or "versionCode" in [Android terms](https://developer.android.com/studio/publish/versioning). New builds do not go through Apple's approval process when released to TestFlight.
* A version release is a new **general** release of the app. It implies a new `version` number in `package.json` _and_ new `buildNumber`. The commit where these numbers are updated is also tagged. The new `version` corresponds to a new "version number" in [iOS terms](https://help.apple.com/xcode/mac/current/#/devba7f53ad4) or "versionName" in [Android terms](https://developer.android.com/studio/publish/versioning). There will typically be several build releases before a version release.

</details>

1. Ensure you are on the main branch and have the latest changes.
   ```shell
   git checkout main && git pull
   ```
2. Update build and (optionally) version numbers.
   1. If this is a **build** release, run the following commands to increment the build number.
      ```shell
      npm run release -- build
      git push
      ```
   2. If this is a **version** release, decide whether the new version will be a patch, minor, or major version. Then, run the following commands to create a new version commit and tag. **NOTE**: During the beta testing period, use only minor or patch versions.
      ```shell
      npm run release -- patch  # (or "minor" or "major")
      git push --follow-tags
      ```

3. If this is a **version** release, check [GitHub Actions](https://github.com/microbiomedata/nmdc-field-notes/actions) to ensure that pushing the version tag triggered the workflow that creates a new GitHub Release. Ensure that the workflow completed successfully.

#### Create and Distribute a new Android Build

<details>
<summary>One-time keystore setup</summary>

1. Obtain two passwords from other developers: the keystore decryption password and the keystore password. Save these securely in a password manager.
2. Download the encrypted keystore file from NERSC.
   ```shell
   scp <user>@dtn01.nersc.gov:/global/cfs/cdirs/m3408/nmdc-field-notes/android-keystore/org.microbiomedata.fieldnotes.keystore.tar.gz.enc .
   ```
3. Decrypt the keystore file into the `android` directory. Enter the keystore decryption password when prompted.
   ```shell
   openssl enc -d -aes256 -pbkdf2 -in ./org.microbiomedata.fieldnotes.keystore.tar.gz.enc | tar xz -C ./android
   ```
4. Remove the encrypted keystore file.
   ```shell
   rm org.microbiomedata.fieldnotes.keystore.tar.gz.enc
   ```

</details>

1. Build the Android APK file.
   1. Open the Android project in Android Studio.
      ```shell
      ionic capacitor open android
      ```
   2. In the toolbar, click `Build` > `Generate Signed App Bundle / APK...`
   3. Select "APK" and click "Next"
   4. Enter the following information and click "Next"
      - Key store path: `<project root>/android/org.microbiomedata.fieldnotes.keystore`
      - Key store password: `<keystore password>`
      - Key alias: `nmdc field notes`
      - Key password: `<keystore password>`
   5. Select the "release" build variant and click "Create"
   6. Wait for the gradle build to complete. Look for notification saying "Build completed successfully for module 'android.app.main' with 1 build variant."
2. Distribute the APK file via the GitHub Release.
   1. Make a copy of the APK file with the version and build numbers in the filename.
      ```shell
      npm run rename.apk 
      ```
   2. Edit the vX.Y.Z [GitHub Release](https://github.com/microbiomedata/nmdc-field-notes/releases) and attach the `org.microbiomedata.fieldnotes-vX.Y.Z-build.N.apk` file to it. **NOTE**: If this is a **build** release there may be one or more existing APK files attached to the release. This is expected.
   3. The APK file can now be deleted from your local project root.
      ```shell
      rm org.microbiomedata.fieldnotes-*.apk
      ```

#### Create and Distribute a new iOS Build

> [!NOTE]
> These instructions are based around distributing via TestFlight for the beta release period. These will be updated later to include App Store distribution once a stable release is ready.

1. Create the iOS build:
   1. Open the iOS project in Xcode.
      ```shell
      ionic capacitor open ios
      ```
   2. "[Create an archive of the app](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases#Create-an-archive-of-your-app)" by clicking (in the toolbar) `Product` > `Archive`
   3. "[Select the method of distribution](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases#Select-a-method-for-distribution)" to be TestFlight & App Store
   4. Click the "Validate App" button to validate the build with respect to App Store Connect
   5. Click the "Distribute App" button to upload the build to App Store Connect
2. Distribute the iOS build via TestFlight:
   1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
   2. Go to `Apps` > `NMDC Field Notes` > `TestFlight`
   3. Under "iOS Builds," find the newly-uploaded build (in the table of all builds)
   4. If it says "Missing Compliance", click "Manage", select "None of the algorithms mentioned above", and click "Save". The words "Ready to Submit" will take the place of the "Missing Compliance" message.
   5. In the sidebar, click on one of the tester groups (e.g. NMDC iOS Developers)
   6. Add the newly-uploaded build to this group (by clicking the `+` button next to "Builds"). At this point the people in that tester group will receive an email telling them that a new build is available to test (and that they can get it by opening the TestFlight app).
   7. Repeat the previous two substeps for the other tester groups.

## License / Copyright

NMDC Field Notes Phone Application (NMDC Field Notes) Copyright (c) 2024, The Regents of the University of California,
through Lawrence Berkeley National Laboratory, and Triad National Security, LLC through Los Alamos National Laboratory (subject
to receipt of any required approvals from the U.S. Dept. of Energy). All rights reserved.

If you have questions about your rights to use or distribute this software,
please contact Berkeley Lab's Intellectual Property Office at
IPO@lbl.gov.

NOTICE. This Software was developed under funding from the U.S. Department
of Energy and the U.S. Government consequently retains certain rights. As
such, the U.S. Government has been granted for itself and others acting on
its behalf a paid-up, nonexclusive, irrevocable, worldwide license in the
Software to reproduce, distribute copies to the public, prepare derivative
works, and perform publicly and display publicly, and to permit others to do so.
