# `.well-known/`

This folder contains files that mobile devices on the Internet are programmed to check for at a specific path.

Since this folder is within the `public` folder, its contents—even this `README.md` file—will
be included in the build (and, as a result, deployed to the web server) verbatim.

> **Note:** To prevent this `README.md` file from being deployed, we may be able to employ a solution
> like [this one](https://github.com/vitejs/vite/discussions/7374#discussioncomment-8557938) to delete it from the
> build; but use a Node.js script instead of `rm` to delete the file,
> since we know `node` will be present on the system (I think Windows offers `del` instead of `rm`).
> ```shell
> node -e "const fs = require('fs'); fs.unlinkSync('path/to/file');"
> ```

## `apple-app-site-association`

This file is used for
[Apple/iOS universal links](https://capacitorjs.com/docs/guides/deep-links#create-site-association-file).

When someone using an iOS device that has the NMDC Field Notes mobile app installed on it,
taps on a link that begins with `https://fieldnotes.microbiomedata.org`;
the operating system on their device (i.e. iOS) will first check for the presence of this file on this web server.
This file essentially tells iOS that this web server trusts the mobile app to handle the link.

## `assetlinks.json` (coming soon)

This file—once we create it—will be used for
[Android universal links](https://capacitorjs.com/docs/guides/deep-links#create-site-association-file-1).

Coming soon...
