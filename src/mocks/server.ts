import { delay, http, HttpResponse } from "msw";
import { Paginated, SubmissionMetadata, TokenResponse } from "../api";
import { submissions as submissionsFixture } from "./fixtures";
import { setupServer } from "msw/node";
import config from "../config";
import { initSubmission } from "../data";

const { NMDC_SERVER_API_URL } = config;

let submissions = submissionsFixture;

export const handlers = [
  http.get<
    Record<string, never>,
    Record<string, never>,
    Paginated<SubmissionMetadata>
  >(`${NMDC_SERVER_API_URL}/api/metadata_submission`, async () => {
    return HttpResponse.json({
      count: submissions.length,
      results: submissions,
    });
  }),
  http.get<{ id: string }, Record<string, never>, SubmissionMetadata>(
    `${NMDC_SERVER_API_URL}/api/metadata_submission/:id`,
    async ({ params }) => {
      const { id } = params;
      return HttpResponse.json(submissions.find((s) => s.id === id));
    },
  ),
  http.patch<{ id: string }, SubmissionMetadata, SubmissionMetadata>(
    `${NMDC_SERVER_API_URL}/api/metadata_submission/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json();
      return HttpResponse.json({
        ...submissions.find((s) => s.id === id),
        ...body,
      });
    },
  ),
  http.post<Record<never, never>, SubmissionMetadata, SubmissionMetadata>(
    `${NMDC_SERVER_API_URL}/api/metadata_submission`,
    async ({ request }) => {
      const body = await request.json();
      const submission: SubmissionMetadata = {
        author: {
          id: "",
          orcid: "",
          name: "",
          is_admin: false,
        },
        author_orcid: "",
        created: "",
        id: "",
        lock_updated: "",
        locked_by: undefined,
        status: "",
        ...initSubmission(),
      };
      // TODO: this should be a true deep merge between the empty submission and the incoming body,
      // But for now this is good enough for the tests
      submission.metadata_submission.studyForm.studyName =
        body.metadata_submission?.studyForm?.studyName || "";
      submission.metadata_submission.studyForm.piEmail =
        body.metadata_submission?.studyForm?.piEmail || "";
      submissions.push(submission);
      return HttpResponse.json(submission);
    },
  ),
  http.delete<{ id: string }>(
    `${NMDC_SERVER_API_URL}/api/metadata_submission/:id`,
    async ({ params }) => {
      const { id } = params;
      submissions = submissions.filter((s) => s.id !== id);
      return new HttpResponse(null, { status: 204 });
    },
  ),
  http.get(`${NMDC_SERVER_API_URL}/api/me`, async () => {
    return HttpResponse.json({
      id: "1",
      orcid: "0000-0000-0000-0000",
      name: "Test Testerson",
      is_admin: false,
    });
  }),
  http.post<Record<never, never>, { refresh_token: string }, TokenResponse>(
    `${NMDC_SERVER_API_URL}/auth/refresh`,
    async () => {
      return HttpResponse.json({
        access_token: "refreshed-access-token",
        token_type: "bearer",
        expires: 3600,
      });
    },
  ),
];

export const patchMetadataSubmissionError = http.patch<{ id: string }>(
  `${NMDC_SERVER_API_URL}/api/metadata_submission/:id`,
  async () => {
    // This delay helps tests validate optimistic updates before the request fails
    await delay(300);
    return new HttpResponse(null, { status: 500 });
  },
);

export const tokenExchangeError = http.post<
  Record<never, never>,
  { refresh_token: string },
  { detail: string }
>(`${NMDC_SERVER_API_URL}/auth/refresh`, async () => {
  return HttpResponse.json(
    {
      detail: "Could not validate credentials",
    },
    { status: 401 },
  );
});

export const server = setupServer(...handlers);

export { delay };
