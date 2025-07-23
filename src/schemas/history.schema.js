// src/schemas/history.schema.js
export const taskHistoryParams = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
  },
  required: ["id"],
  additionalProperties: false,
};
/**
 * Response schema for GET /tasks/:id/history
 */
export const historyResponse = {
  200: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string", format: "uuid" },
        taskId: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        field: { type: "string" },
        oldValue: { type: ["string", "null"] },
        newValue: { type: ["string", "null"] },
        timestamp: { type: "string", format: "date-time" },
      },
      required: ["id", "taskId", "userId", "field", "timestamp"],
      additionalProperties: false,
    },
  },
};
