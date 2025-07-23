import { authenticate } from "../utils/auth.js";
import { uploadAttachment } from "../controllers/attachmentController.js";

export default async function attachmentRoute(fastify) {
  // POST /tasks/:taskId/attachments
  fastify.post(
    "/tasks/:taskId/attachments",
    { preHandler: authenticate },
    (req, rep) => uploadAttachment(fastify, req, rep)
  );
}
