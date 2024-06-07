import paths from "./paths";
import { Browser } from "@capacitor/browser";
import config from "./config";
import { isPlatform } from "@ionic/react";

let redirectHost: string;
if (isPlatform("capacitor")) {
  redirectHost = "org.microbiomedata.fieldnotes://";
} else if (window !== undefined) {
  redirectHost = window.location.origin;
} else {
  redirectHost = "";
}
export const REDIRECT_URI = redirectHost + paths.token;

export function initiateLogin() {
  return Browser.open({
    url: `${config.NMDC_SERVER_API_URL}/auth/login?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    windowName: "_self", // web only
  });
}

export async function closeBrowser() {
  try {
    // On web there is no browser to close, so just catch the error and move on
    return await Browser.close();
  } catch (e) {
    console.warn("Failed to close browser:", e);
  }
}
