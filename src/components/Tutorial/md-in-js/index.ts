import * as s1 from "./001.md";
import * as s2 from "./002.md";
import * as s3 from "./003.md";
import * as s4 from "./004.md";
import * as s5 from "./005.md";

type Section = {
  title: string;
  md: string; // Markdown content
};

// Put the sections into a specific order.
export const sections: Array<Section> = [
  { title: s1.title, md: s1.markdownContent },
  { title: s2.title, md: s2.markdownContent },
  { title: s3.title, md: s3.markdownContent },
  { title: s4.title, md: s4.markdownContent },
  { title: s5.title, md: s5.markdownContent },
];

export default sections;
