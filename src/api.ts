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

function restFetchClient(baseUrl: string, defaultOptions: RequestInit = {}) {
  async function _fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const init = {
      ...defaultOptions,
      ...options,
    }
    const response = await fetch(baseUrl + endpoint, init);
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }
    return response.json();
  }

  return {
    fetch: _fetch,
  }
}

const nmdcServerClient = restFetchClient(
  import.meta.env.VITE_NMDC_SERVER_API_URL,
  {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

export async function getSubmissionList(options: PaginationOptions = {}): Promise<Paginated<SubmissionMetadata>> {
  options = {
    limit: 10,
    offset: 0,
    ...options,
  }
  const query = new URLSearchParams(options as Record<string, string>);
  return nmdcServerClient.fetch(`/metadata_submission?${query}`);
}

export async function getSubmission(id: string): Promise<SubmissionMetadata> {
  return nmdcServerClient.fetch(`/metadata_submission/${id}`);
}

export async function updateSubmission(id: string, data: Partial<SubmissionMetadata>): Promise<SubmissionMetadata> {
  return nmdcServerClient.fetch(`/metadata_submission/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}