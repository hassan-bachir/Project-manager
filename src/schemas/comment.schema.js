export const taskIdParams = {
  type: "object",
  properties: { taskId: { type: "string", format: "uuid" } },
  required: ["taskId"],
  additionalProperties: false,
};

export const createCommentBody = {
  type: "object",
  properties: { content: { type: "string", minLength: 1 } },
  required: ["content"],
  additionalProperties: false,
};
