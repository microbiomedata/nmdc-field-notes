import { delay, http, HttpResponse } from "msw";
import { Paginated, SubmissionMetadata } from "../api";
import { submissions } from "./fixtures";
import { setupServer } from "msw/node";
import config from '../config';

const { NMDC_SERVER_API_URL } = config;

export const handlers = [
  http.get<
    Record<string, never>,
    Record<string, never>,
    Paginated<SubmissionMetadata>
  >(`${NMDC_SERVER_API_URL}/metadata_submission`, async () => {
    return HttpResponse.json({
      count: submissions.length,
      results: submissions,
    });
  }),
  http.get<{ id: string }, Record<string, never>, SubmissionMetadata>(
    `${NMDC_SERVER_API_URL}/metadata_submission/:id`,
    async ({ params }) => {
      const { id } = params;
      return HttpResponse.json(submissions.find((s) => s.id === id));
    },
  ),
  http.patch<{ id: string }, SubmissionMetadata, SubmissionMetadata>(
    `${NMDC_SERVER_API_URL}/metadata_submission/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json();
      return HttpResponse.json({
        ...submissions.find((s) => s.id === id),
        ...body,
      });
    },
  ),
  http.get(`${NMDC_SERVER_API_URL}/me`, async () => {
    return HttpResponse.json("Test Testerson");
  }),
];

export const patchMetadataSubmissionError = http.patch<{ id: string }>(
  `${NMDC_SERVER_API_URL}/metadata_submission/:id`,
  async () => {
    // This delay helps tests validate optimistic updates before the request fails
    await delay(300);
    return new HttpResponse(null, { status: 500 });
  },
);

export const server = setupServer(...handlers);

export { delay };
