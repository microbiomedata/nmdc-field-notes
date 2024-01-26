import {http, HttpResponse} from "msw";
import {Paginated, SubmissionMetadata} from "../api";
import {submissions} from "./fixtures";
import {setupServer} from "msw/node";

const { VITE_NMDC_SERVER_API_URL } = import.meta.env;

export const handlers = [
  http.get<
    Record<string, never>,
    Record<string, never>,
    Paginated<SubmissionMetadata>
  >(
    `${VITE_NMDC_SERVER_API_URL}/metadata_submission`,
    async () => {
      return HttpResponse.json({
        count: submissions.length,
        results: submissions
      })
    }
  ),
  http.get<
    { id: string },
    Record<string, never>,
    SubmissionMetadata
  >(
    `${VITE_NMDC_SERVER_API_URL}/metadata_submission/:id`,
    async ({ params }) => {
      const { id } = params;
      return HttpResponse.json(submissions.find(s => s.id === id))
    }
  ),
  http.patch<
    { id: string },
    SubmissionMetadata,
    SubmissionMetadata
  >(
    `${VITE_NMDC_SERVER_API_URL}/metadata_submission/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json();
      return HttpResponse.json({
        ...submissions.find(s => s.id === id),
        ...body
      })
    }
  ),
]

export const server = setupServer(...handlers);
