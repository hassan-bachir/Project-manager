import { authenticate } from "../utils/auth.js";
import { addComment, listComments } from "../controllers/commentController.js";
import { taskIdParams, createCommentBody } from "../schemas/comment.schema.js";

export default async function commentsRoute(fastify) {
  // Add a comment
  fastify.post(
    "/tasks/:taskId/comments",
    {
      preHandler: authenticate,
      schema: {
        params: taskIdParams,
        body: createCommentBody,
      },
    },
    (req, rep) => addComment(fastify, req, rep)
  );

  // List comments
  fastify.get(
    "/tasks/:taskId/comments",
    {
      preHandler: authenticate,
      schema: { params: taskIdParams },
    },
    (req, rep) => listComments(fastify, req, rep)
  );
}
