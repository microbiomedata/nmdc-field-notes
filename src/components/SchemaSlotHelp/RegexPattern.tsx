import React from "react";
import styles from "./RegexPattern.module.css";

interface RegexPatternProps {
  pattern: string;
}

const RegexPattern: React.FC<RegexPatternProps> = ({ pattern }) => {
  return <div className={styles.pattern}>{pattern}</div>;
};

export default RegexPattern;
