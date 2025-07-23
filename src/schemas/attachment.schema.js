export const taskIdParams = {
  type: "object",
  required: ["taskId"],
  properties: {
    taskId: { type: "string", format: "uuid" },
  },
  additionalProperties: false,
};

// Schema for the file upload in the request body
export const createAttachmentBody = {
  type: "object",
  required: ["file"],
  properties: {
    file: { type: "string", format: "binary" },
  },
  additionalProperties: false,
};

// Response schema for the uploaded attachment
export const attachmentResponse = {
  201: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      taskId: { type: "string", format: "uuid" },
      filename: { type: "string" },
      mimeType: { type: "string" },
      url: { type: "string" },
      uploadedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "taskId", "filename", "mimeType", "url", "uploadedAt"],
    additionalProperties: false,
  },
};
