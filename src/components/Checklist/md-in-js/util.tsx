import config from "../../../config";
import { TEMPLATES } from "../../../api";

// Generate schemas Markdown from the TEMPLATES
export function createSchemasMD() {
  let schemasMD = '';

  Object.keys(TEMPLATES).forEach((schema) => {
    schemasMD += `* [${TEMPLATES[schema].displayName}](${config.NMDC_SCHEMA_BASE_URL}/${TEMPLATES[schema].schemaClass}/)\n`
  });

  return schemasMD;
}

