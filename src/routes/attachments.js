import { authenticate } from "../utils/auth.js";
import { uploadAttachment } from "../controllers/attachmentController.js";

import {
  taskIdParams,
  createAttachmentBody,
  attachmentResponse,
} from "../schemas/attachment.schema.js";

export default async function attachmentRoute(fastify) {
  // POST /tasks/:taskId/attachments
  fastify.post(
    "/tasks/:taskId/attachments",
    {
      preHandler: authenticate,
      schema: {
        summary: "Upload an attachment to a task",
        tags: ["Attachments"],
        consumes: ["multipart/form-data"],
        params: taskIdParams,
        body: createAttachmentBody,
        response: attachmentResponse,
      },
    },
    (req, rep) => uploadAttachment(fastify, req, rep)
  );
}
