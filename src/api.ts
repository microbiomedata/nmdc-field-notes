import config from "./config";
import { SchemaDefinition } from "./linkml-metamodel";

export interface Paginated<Type> {
  count: number;
  readonly results: Type[];
}

export interface Contributor {
  name: string;
  orcid: string;
  roles: string[];
}

export interface ContextForm {
  datasetDoi: string;
  dataGenerated: Nullable<boolean>;
  facilityGenerated: Nullable<boolean>;
  facilities: string[];
  award: Nullable<string>;
  otherAward: string;
}

export interface Address {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface AddressForm {
  shipper: Address;
  expectedShippingDate: Nullable<Date>;
  shippingConditions: string;
  sample: string;
  description: string;
  experimentalGoals: string;
  randomization: string;
  usdaRegulated: Nullable<boolean>;
  permitNumber: string;
  biosafetyLevel: string;
  irbOrHipaa: Nullable<boolean>;
  comments: string;
}

export interface StudyForm {
  studyName: string;
  piName: string;
  piEmail: string;
  piOrcid: string;
  linkOutWebpage: string[];
  studyDate: Nullable<string>;
  description: string;
  notes: string;
  contributors: Contributor[];
}

export interface MultiOmicsForm {
  alternativeNames: string[];
  studyNumber: string;
  GOLDStudyId: string;
  JGIStudyId: string;
  NCBIBioProjectId: string;
  omicsProcessingTypes: string[];
}

export type SampleDataValue =
  | string
  | number
  | boolean
  | string[]
  | null
  | undefined;

export interface SampleData {
  _index: number;
  [key: string]: SampleDataValue;
}

// This should eventually come from the schema itself
// See: https://github.com/microbiomedata/submission-schema/issues/186
export interface TemplateInfo {
  displayName: string;
  schemaClass?: string;
  sampleDataSlot?: string;
}
export const TEMPLATES: Record<string, TemplateInfo> = {
  air: {
    displayName: "air",
    schemaClass: "AirInterface",
    sampleDataSlot: "air_data",
  },
  "built environment": {
    displayName: "built environment",
    schemaClass: "BuiltEnvInterface",
    sampleDataSlot: "built_env_data",
  },
  "host-associated": {
    displayName: "host-associated",
    schemaClass: "HostAssociatedInterface",
    sampleDataSlot: "host_associated_data",
  },
  "hydrocarbon resources-cores": {
    displayName: "hydrocarbon resources - cores",
    schemaClass: "HcrCoresInterface",
    sampleDataSlot: "hcr_cores_data",
  },
  "hydrocarbon resources-fluids_swabs": {
    displayName: "hydrocarbon resources - fluids swabs",
    schemaClass: "HcrFluidsSwabsInterface",
    sampleDataSlot: "hcr_fluids_swabs_data",
  },
  "microbial mat_biofilm": {
    displayName: "microbial mat_biofilm",
    schemaClass: "BiofilmInterface",
    sampleDataSlot: "biofilm_data",
  },
  "miscellaneous natural or artificial environment": {
    displayName: "miscellaneous natural or artificial environment",
    schemaClass: "MiscEnvsInterface",
    sampleDataSlot: "misc_envs_data",
  },
  "plant-associated": {
    displayName: "plant-associated",
    schemaClass: "PlantAssociatedInterface",
    sampleDataSlot: "plant_associated_data",
  },
  sediment: {
    displayName: "sediment",
    schemaClass: "SedimentInterface",
    sampleDataSlot: "sediment_data",
  },
  soil: {
    displayName: "soil",
    schemaClass: "SoilInterface",
    sampleDataSlot: "soil_data",
  },
  water: {
    displayName: "water",
    schemaClass: "WaterInterface",
    sampleDataSlot: "water_data",
  },
};

export interface MetadataSubmission {
  packageName: keyof typeof TEMPLATES;
  contextForm: ContextForm;
  addressForm: AddressForm;
  templates: string[];
  studyForm: StudyForm;
  multiOmicsForm: MultiOmicsForm;
  sampleData: Record<string, SampleData[]>;
}

export interface User {
  id: string;
  orcid: string;
  name: string;
  is_admin: boolean;
}

export interface SubmissionMetadataCreate {
  metadata_submission: MetadataSubmission;
}

export interface SubmissionMetadata extends SubmissionMetadataCreate {
  status: string;
  id: string;
  author_orcid: string;
  created: string;
  author: User;
  lock_updated?: string;
  locked_by: Nullable<User>;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

class FetchClient {
  private readonly baseUrl: string;
  private readonly defaultOptions: RequestInit;

  constructor(baseUrl: string, defaultOptions: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = defaultOptions;
  }

  setBearerToken(token: string) {
    this.defaultOptions.headers = {
      ...this.defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  protected async fetch(endpoint: string, options: RequestInit = {}) {
    const init = {
      ...this.defaultOptions,
      ...options,
    };
    const response = await fetch(this.baseUrl + endpoint, init);
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }
    return response;
  }

  protected async fetchJson<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await this.fetch(endpoint, options);
    return response.json();
  }
}

class NmdcServerClient extends FetchClient {
  constructor() {
    super(config.NMDC_SERVER_API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Injects the "_index" property into each sample in the submission's sampleData.
   *
   * Because the submission portal backend needs to be tolerant of storing "invalid" data, some
   * samples could essentially be empty. Therefore, there are no existing fields we can treat as a
   * key (or persistent identifier). The samples are essentially identified by their position in the
   * array. However, because the SampleList component allows the user to filter samples, we need to
   * keep track of the original index of each sample.
   */
  private static injectStableSampleIndexes(submission: SubmissionMetadata) {
    Object.values(submission.metadata_submission.sampleData).map((samples) => {
      samples.forEach((sample, index) => {
        sample["_index"] = index;
      });
    });
  }

  async getSubmissionList(pagination: PaginationOptions = {}) {
    pagination = {
      limit: 10,
      offset: 0,
      ...pagination,
    };
    const query = new URLSearchParams(pagination as Record<string, string>);
    const submissions = await this.fetchJson<Paginated<SubmissionMetadata>>(
      `/api/metadata_submission?${query}`,
    );
    submissions.results.forEach((submission) => {
      NmdcServerClient.injectStableSampleIndexes(submission);
    });
    return submissions;
  }

  async getSubmission(id: string) {
    const submission = await this.fetchJson<SubmissionMetadata>(
      `/api/metadata_submission/${id}`,
    );
    NmdcServerClient.injectStableSampleIndexes(submission);
    return submission;
  }

  async updateSubmission(id: string, data: Partial<SubmissionMetadata>) {
    return this.fetchJson<SubmissionMetadata>(
      `/api/metadata_submission/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  }

  async createSubmission(data: SubmissionMetadataCreate) {
    return this.fetchJson<SubmissionMetadata>("/api/metadata_submission", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteSubmission(id: string) {
    return this.fetch(`/api/metadata_submission/${id}`, {
      method: "DELETE",
    });
  }

  async getCurrentUser() {
    return this.fetchJson<string>("/api/me");
  }

  async getSubmissionSchema() {
    return this.fetchJson<SchemaDefinition>(
      `/static/submission_schema/submission_schema.json`,
    );
  }
}

const nmdcServerClient = new NmdcServerClient();

export { nmdcServerClient };
