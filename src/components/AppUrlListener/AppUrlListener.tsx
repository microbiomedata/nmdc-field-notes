/**
 * This component listens for the `appUrlOpen` event—which occurs when the app is opened via a URL—and, when it "hears"
 * such an event, it extracts the path portion of that URL and performs client-side navigation to that path.
 * This is related to universal links/deep links.
 *
 * This component is based upon the example at: https://capacitorjs.com/docs/guides/deep-links#react
 */

import React, { useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { PluginListenerHandle } from "@capacitor/core";

interface Props {}

const AppUrlListener: React.FC<Props> = () => {
  const history = useHistory();

  /**
   * Performs client-side navigation to the URL contained within the specified event object.
   */
  const onAppUrlOpen = useCallback(
    (event: URLOpenListenerEvent) => {
      console.debug("App was opened via URL:", event.url);

      // Extract the path from the URL.
      const url = new URL(event.url);
      const path = url.pathname;

      // If the path is non-empty, perform client-side navigation to it.
      if (path.length > 0) {
        console.debug(`Navigating to: ${path}`);
        history.push(path);
      }
    },
    [history],
  );

  // Keep track of the event listener that is attached to the `App`. This will allow us to detach it.
  const listenerRef = useRef<PluginListenerHandle>();

  /**
   * Attaches an event listener to the `App` and updates the ref accordingly.
   */
  const attachListener = useCallback(async () => {
    listenerRef.current = await App.addListener("appUrlOpen", onAppUrlOpen);
    console.debug("Attached a listener.", listenerRef.current);
  }, [onAppUrlOpen]);

  /**
   * Detaches an event listener from the `App` and updates the ref accordingly.
   */
  const detachListener = useCallback(() => {
    if (
      listenerRef.current !== undefined &&
      typeof listenerRef.current.remove === "function"
    ) {
      // Note: I use `then` here—instead of `await`—because TypeScript complains when the
      //       "cleanup" function returned by the `useEffect` callback is an `async` function.
      listenerRef.current.remove().then(() => {
        listenerRef.current = undefined;
        console.debug("Detached a listener.");
      });
    }
  }, []);

  useEffect(() => {
    // Attach a listener.
    attachListener().then(() => {
      console.debug("Listening.");
    });

    // Return a "cleanup" function that detaches the listener.
    return detachListener;
  }, [attachListener, detachListener]);

  // Note: There is nothing we want this component to render to the DOM.
  return null;
};

export default AppUrlListener;
