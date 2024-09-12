export const title = `Review relevant NMDC environment schemas`;

// language=Markdown
export const info = `
Schema for biosamples based on MIxS and other standards
`;

// Generate schemas Markdown from the TEMPLATES
import {createSchemasMD} from './util';
const rawMarkdownContent = createSchemasMD();

export const markdownContent = rawMarkdownContent.trim();

export default markdownContent;
