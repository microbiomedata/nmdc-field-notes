import React from "react";
import styles from "./RegexPattern.module.css";

// @ts-expect-error Version v0.3.1 of `regex-colorizer` is from 2012 and does not include type information.
import { colorizeText } from "regex-colorizer";

interface RegexPatternProps {
  pattern: string;
}

const RegexPattern: React.FC<RegexPatternProps> = ({ pattern }) => {
  // Note: The `colorizeText` function will wrap various parts of the pattern within HTML elements, some of which
  //       have classes defined on them. We can then style those HTML elements (see `RegexPattern.module.css`).
  const htmlWeTrust = { __html: colorizeText(pattern) };
  return <div className={styles.pattern} dangerouslySetInnerHTML={htmlWeTrust}></div>;
};

export default RegexPattern;
