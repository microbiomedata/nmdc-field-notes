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
