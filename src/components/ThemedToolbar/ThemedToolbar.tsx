import React from "react";
import { IonToolbar } from "@ionic/react";

import classes from "./ThemedToolbar.module.css";

interface ThemedToolbarProps extends React.ComponentProps<typeof IonToolbar> {}

const ThemedToolbar: React.FC<ThemedToolbarProps> = (props) => {
  return <IonToolbar {...props} className={classes.themedBackground} />;
};

export default ThemedToolbar;
