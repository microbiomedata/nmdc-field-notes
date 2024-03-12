import config from "./config";

export interface Paginated<Type> {
  count: number;
  readonly results: Type[];
}

export interface Contributor {
  name: string;
  orcid: string;
  roles: string[];
}

export interface StudyForm {
  studyName: string;
  piName: string;
  piEmail: string;
  piOrcid: string;
  linkOutWebpage: string[];
  studyDate: Nullable<string>;
  description: string;
  notes?: string;
  contributors: Contributor[];
}

export interface SampleData {
  _index: number;
  [key: string]: string | number;
}

// TODO: replace the `object` types with the actual types
export interface MetadataSubmission {
  packageName: string;
  contextForm: object;
  addressForm: object;
  templates: string[];
  studyForm: StudyForm;
  multiOmicsForm: object;
  sampleData: Record<string, SampleData[]>;
}

export interface User {
  id: string;
  orcid: string;
  name: string;
  is_admin: boolean;
}

export interface SubmissionMetadata {
  metadata_submission: MetadataSubmission;
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

  protected async json<T>(
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
    const submissions = await this.json<Paginated<SubmissionMetadata>>(
      `/metadata_submission?${query}`,
    );
    submissions.results.forEach((submission) => {
      NmdcServerClient.injectStableSampleIndexes(submission);
    });
    return submissions;
  }

  async getSubmission(id: string) {
    const submission = await this.json<SubmissionMetadata>(
      `/metadata_submission/${id}`,
    );
    NmdcServerClient.injectStableSampleIndexes(submission);
    return submission;
  }

  async updateSubmission(id: string, data: Partial<SubmissionMetadata>) {
    return this.json<SubmissionMetadata>(`/metadata_submission/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async createSubmission(data: DeepPartial<SubmissionMetadata>) {
    return this.json<SubmissionMetadata>("/metadata_submission", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteSubmission(id: string) {
    return this.fetch(`/metadata_submission/${id}`, {
      method: "DELETE",
    });
  }

  async getCurrentUser() {
    return this.json<string>("/me");
  }
}

const nmdcServerClient = new NmdcServerClient();

export { nmdcServerClient };
