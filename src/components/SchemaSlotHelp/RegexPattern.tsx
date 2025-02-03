import React from "react";
import styles from "./RegexPattern.module.css";

interface RegexPatternProps {
  pattern: string;
}

const RegexPattern: React.FC<RegexPatternProps> = ({ pattern }) => {
  return <div className={`${styles.pattern} ion-padding`}>{pattern}</div>;
};

export default RegexPattern;
