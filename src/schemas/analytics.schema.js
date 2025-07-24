// Params for /analytics/users/:id/stats
export const userIdParams = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

// Response for overview
export const overviewResponse = {
  200: {
    type: "object",
    properties: {
      total: { type: "integer" },
      completed: { type: "integer" },
      overdue: { type: "integer" },
      completionRate: { type: "integer", description: "Percent 0–100" },
    },
    required: ["total", "completed", "overdue", "completionRate"],
  },
};

// Response for per‑user stats
export const userStatsResponse = {
  200: {
    type: "object",
    properties: {
      userId: { type: "string", format: "uuid" },
      assigned: { type: "integer" },
      completed: { type: "integer" },
      overdue: { type: "integer" },
      completionRate: { type: "integer", description: "Percent 0–100" },
    },
    required: ["userId", "assigned", "completed", "overdue", "completionRate"],
  },
};
