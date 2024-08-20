import React, { PropsWithChildren } from "react";

import styles from "./FixedCenteredMessage.module.css";

const FixedCenteredMessage: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div slot="fixed" className={styles.message}>
      {children}
    </div>
  );
};

export default FixedCenteredMessage;
