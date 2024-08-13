import * as s1 from "./fieldwork-001.md";
import * as s2 from "./fieldwork-002.md";

type Section = {
  title: string;
  md: string; // Markdown content
};

// Put the sections into a specific order.
const sections: Array<Section> = [
  { title: s1.title, md: s1.markdownContent },
  { title: s2.title, md: s2.markdownContent },
];

const header = "Fieldwork";
const info =
  "Are you planning a trip to the field to collect samples and metadata? Here is some general guidance for conducting fieldwork as well as links to more specific information depending on your environment/sample type(s).\n\n" +
  "Note: This guidance is not meant to be exhaustive and there are other considerations for fieldwork. Please consult your institutional policies regarding safety and security in the field and review existing fieldwork guidance. Review the protocols, guides from other groups or publications if you wish to more directly compare samples or data.";

export const fieldworkChecklist = {
  header: header,
  info: info,
  sections: sections,
};

export default fieldworkChecklist;
