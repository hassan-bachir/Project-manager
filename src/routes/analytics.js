import { authenticate } from "../utils/auth.js";
import {
  getOverview,
  getUserStats,
} from "../controllers/analyticsController.js";
import {
  overviewResponse,
  userIdParams,
  userStatsResponse,
} from "../schemas/analytics.schema.js";

export default async function analyticsRoute(fastify) {
  // GET /analytics/overview
  fastify.get(
    "/analytics/overview",
    {
      preHandler: authenticate,
      schema: {
        summary: "Get overall task stats",
        tags: ["Analytics"],
        response: overviewResponse,
      },
    },
    (req, rep) => getOverview(fastify, req, rep)
  );

  // GET /analytics/users/:id/stats
  fastify.get(
    "/analytics/users/:id/stats",
    {
      preHandler: authenticate,
      schema: {
        summary: "Get stats for one user",
        tags: ["Analytics"],
        params: userIdParams,
        response: userStatsResponse,
      },
    },
    (req, rep) => getUserStats(fastify, req, rep)
  );
}
