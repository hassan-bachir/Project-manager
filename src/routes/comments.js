import { authenticate } from "../utils/auth.js";
import { addComment, listComments } from "../controllers/commentController.js";
import {
  taskIdParams,
  createCommentBody,
  createCommentResponse,
  listCommentsResponse,
} from "../schemas/comment.schema.js";
export default async function commentsRoute(fastify) {
  // Add a comment
  fastify.post(
    "/tasks/:taskId/comments",
    {
      preHandler: authenticate,
      schema: {
        summary: "Add a comment to a task",
        tags: ["Comments"],
        params: taskIdParams,
        body: createCommentBody,
        response: createCommentResponse,
      },
    },
    (req, rep) => addComment(fastify, req, rep)
  );

  // List comments
  fastify.get(
    "/tasks/:taskId/comments",
    {
      preHandler: authenticate,
      schema: {
        summary: "List all comments for a task",
        tags: ["Comments"],
        params: taskIdParams,
        response: listCommentsResponse,
      },
    },
    (req, rep) => listComments(fastify, req, rep)
  );
}
