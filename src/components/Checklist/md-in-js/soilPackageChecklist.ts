import * as s1 from "./soilPackage-001.md";
import * as s2 from "./soilPackage-002.md";
import * as s3 from "./soilPackage-003.md";
import * as s4 from "./soilPackage-004.md";
import * as s5 from "./soilPackage-005.md";

type Section = {
  title: string;
  md: string; // Markdown content
};

// Put the sections into a specific order.
const sections: Array<Section> = [
  { title: s1.title, md: s1.markdownContent },
  { title: s2.title, md: s2.markdownContent },
  { title: s3.title, md: s3.markdownContent },
  { title: s4.title, md: s4.markdownContent },
  { title: s5.title, md: s5.markdownContent },
];

const header = "Soil Package";
const info =
  "Are you planning a trip to the field to collect soil samples and metadata? " +
  "Below we have listed the NMDC soil package required metadata fields to ensure " +
  "you pack the right tools and make required measurements in the field!\n\n" +
  "Note: The NMDC metadata requirements also encompass fields required by NCBI and " +
  "the Genomic Standards Consortium (GSC)";

export const soilPackageChecklist = {
  header: header,
  info: info,
  sections: sections,
};

export default soilPackageChecklist;
