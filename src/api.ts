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

// TODO: replace the `object` types with the actual types
export interface MetadataSubmission {
  packageName: string;
  contextForm: object;
  addressForm: object;
  templates: string[];
  studyForm: StudyForm;
  multiOmicsForm: object;
  sampleData: object;
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

  protected async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    responseType: "json" | "text" = "json",
  ): Promise<T> {
    const init = {
      ...this.defaultOptions,
      ...options,
    };
    const response = await fetch(this.baseUrl + endpoint, init);
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }
    return response[responseType]();
  }
}

class NmdcServerClient extends FetchClient {
  constructor() {
    super(import.meta.env.VITE_NMDC_SERVER_API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getSubmissionList(pagination: PaginationOptions = {}) {
    pagination = {
      limit: 10,
      offset: 0,
      ...pagination,
    };
    const query = new URLSearchParams(pagination as Record<string, string>);
    return this.fetch<Paginated<SubmissionMetadata>>(
      `/metadata_submission?${query}`,
    );
  }

  async getSubmission(id: string) {
    return this.fetch<SubmissionMetadata>(`/metadata_submission/${id}`);
  }

  async updateSubmission(id: string, data: Partial<SubmissionMetadata>) {
    return this.fetch<SubmissionMetadata>(`/metadata_submission/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.fetch<string>("/me", {}, "text");
  }
}

const nmdcServerClient = new NmdcServerClient();

export { nmdcServerClient };
