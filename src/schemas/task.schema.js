export const listTasksQuery = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["TODO", "IN_PROGRESS", "COMPLETED"],
    },
    priority: {
      type: "string",
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    dueAfter: {
      type: "string",
      format: "date-time",
    },
    dueBefore: {
      type: "string",
      format: "date-time",
    },
    search: { type: "string" },
  },
  additionalProperties: false,
};
