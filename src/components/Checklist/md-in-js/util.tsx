import config from "../../../config";
import { TemplateName, TEMPLATES } from "../../../api";

// Generate schemas Markdown from the TEMPLATES
export function createSchemasMD() {
  let schemasMD = "";

  Object.keys(TEMPLATES).forEach((schema) => {
    const template = TEMPLATES[schema as TemplateName];
    schemasMD += `* [${template.displayName}](${config.NMDC_SUBMISSION_SCHEMA_DOCS_BASE_URL}/${template.schemaClass}/)\n`;
  });

  return schemasMD;
}
