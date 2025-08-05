import { FetchClient, SubmissionMetadata } from "../api";
import { initAddressForm, initMultiOmicsForm, initStudyForm } from "../data";
import config from "../config";

export function generateSubmission(
  numberOfSamples: number,
): SubmissionMetadata {
  return {
    id: "1",
    author: {
      id: "1",
      is_admin: false,
      name: "",
      orcid: "",
    },
    status: "in-progress",
    created: "2021-01-01T00:00:00Z",
    author_orcid: "0000-0000-0000-0000",
    metadata_submission: {
      packageName: ["soil"],
      multiOmicsForm: initMultiOmicsForm(),
      addressForm: initAddressForm(),
      templates: ["soil"],
      studyForm: initStudyForm(),
      sampleData: {
        soil_data: Array.from({ length: numberOfSamples }, (_, i) => ({
          samp_name:
            (i % 3 === 0 ? "Silt" : i % 5 === 0 ? "Clay" : "Loam") + " " + i,
        })),
      },
    },
    locked_by: null,
    source_client: "field_notes",
    field_notes_metadata: {
      fieldVisibility: {
        soil: ["samp_name"],
      },
    },
    is_test_submission: false,
  };
}

export const submissions: () => SubmissionMetadata[] = () => [
  {
    metadata_submission: {
      packageName: ["host-associated", "soil"],
      addressForm: {
        shipper: {
          name: "",
          email: "",
          phone: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        expectedShippingDate: null,
        shippingConditions: "",
        sample: "",
        description: "",
        experimentalGoals: "",
        randomization: "",
        usdaRegulated: null,
        permitNumber: "",
        biosafetyLevel: "",
        irbOrHipaa: null,
        comments: "",
      },
      templates: ["host-associated", "soil"],
      studyForm: {
        studyName: "TEST 1",
        piName: "",
        piEmail: "user_1@example.org",
        piOrcid: "",
        linkOutWebpage: [],
        studyDate: null,
        description: "",
        notes: "",
        contributors: [],
        alternativeNames: [],
        fundingSources: [],
        GOLDStudyId: "",
        NCBIBioProjectId: "",
      },
      multiOmicsForm: initMultiOmicsForm(),
      sampleData: {
        soil_data: [],
        host_associated_data: [],
      },
    },
    status: "in-progress",
    id: "00000000-0000-0000-0000-000000000001",
    author_orcid: "0000-0000-0000-0001",
    created: "2024-01-01T00:00:00.000000",
    author: {
      id: "00000000-0000-0000-0001-000000000001",
      orcid: "0000-0000-0000-0001",
      name: "Test Tester",
      is_admin: true,
    },
    lock_updated: "2024-01-01T00:00:00.000000",
    locked_by: null,
    source_client: "submission_portal",
    is_test_submission: false,
  },
  {
    metadata_submission: {
      packageName: ["host-associated", "soil"],
      addressForm: {
        shipper: {
          name: "",
          email: "",
          phone: "",
          line1: "",
          line2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        expectedShippingDate: null,
        shippingConditions: "",
        sample: "",
        description: "",
        experimentalGoals: "",
        randomization: "",
        usdaRegulated: null,
        permitNumber: "",
        biosafetyLevel: "",
        irbOrHipaa: null,
        comments: "",
      },
      templates: ["host-associated", "soil"],
      studyForm: {
        studyName: "TEST 2",
        piName: "",
        piEmail: "user_2@example.org",
        piOrcid: "",
        linkOutWebpage: [],
        studyDate: null,
        description: "",
        notes: "",
        contributors: [],
        alternativeNames: [],
        fundingSources: [],
        GOLDStudyId: "",
        NCBIBioProjectId: "",
      },
      multiOmicsForm: initMultiOmicsForm(),
      sampleData: {
        soil_data: [],
        host_associated_data: [],
      },
    },
    status: "in-progress",
    id: "00000000-0000-0000-0000-000000000002",
    author_orcid: "0000-0000-0000-0002",
    created: "2024-01-02T00:00:00.000000",
    author: {
      id: "00000000-0000-0000-0001-000000000002",
      orcid: "0000-0000-0000-0002",
      name: "Test Tester 2",
      is_admin: true,
    },
    lock_updated: "2024-01-02T00:00:00.000000",
    locked_by: {
      id: "00000000-0000-0000-0001-000000000002",
      orcid: "0000-0000-0000-0002",
      name: "Test Tester 2",
      is_admin: true,
    },
    source_client: "field_notes",
    is_test_submission: false,
  },
];

/**
 * This is a subclass of FetchClient (similar to NmdcServerClient) that is used for testing error
 * handling. It calls endpoints that are only defined on the mock server used by tests (i.e. "fake")
 * and that do not exist on the real NMDC server.
 *
 * See also:
 * - `fakeErrorHandlers` in src/mocks/server.ts
 * - src/components/QueryErrorBanner/QueryErrorBanner.test.tsx
 */
export class FakeErrorTestClient extends FetchClient {
  private static readonly successEndpoint = "/_fake-error-tester";
  private static readonly errorEndpoint = "/_fake-error-tester?status=500";
  constructor() {
    super(config.NMDC_SERVER_API_URL);
  }
  getSuccess() {
    return this.fetch(FakeErrorTestClient.successEndpoint);
  }
  getError() {
    return this.fetch(FakeErrorTestClient.errorEndpoint);
  }
  postSuccess() {
    return this.fetch(FakeErrorTestClient.successEndpoint, {
      method: "POST",
    });
  }
  postError() {
    return this.fetch(FakeErrorTestClient.errorEndpoint, {
      method: "POST",
    });
  }
}
