// src/schemas/history.schema.js
export const taskHistoryParams = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
  },
  required: ["id"],
  additionalProperties: false,
};
