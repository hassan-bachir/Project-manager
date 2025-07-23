export const taskIdParams = {
  type: "object",
  required: ["taskId"],
  properties: {
    taskId: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

export const createCommentBody = {
  type: "object",
  required: ["content"],
  properties: {
    content: { type: "string", minLength: 1 },
  },
  additionalProperties: false,
};

// Response schema for a single comment
export const commentResponse = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    taskId: { type: "string", format: "uuid" },
    userId: { type: "string", format: "uuid" },
    content: { type: "string" },
    createdAt: { type: "string", format: "date-time" },
  },
  required: ["id", "taskId", "userId", "content", "createdAt"],
  additionalProperties: false,
};

// 201 response when creating
export const createCommentResponse = {
  201: commentResponse,
};

// 200 response when listing
export const listCommentsResponse = {
  200: {
    type: "array",
    items: commentResponse,
  },
};
