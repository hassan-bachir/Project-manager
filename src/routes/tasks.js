import { authenticate } from "../utils/auth.js";
import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

export default async function tasksRoute(fastify) {
  // Create task under a project
  fastify.post(
    "/projects/:projectId/tasks",
    { preHandler: authenticate },
    async (request, reply) => createTask(fastify, request, reply)
  );
  // List tasks
  fastify.get(
    "/projects/:projectId/tasks",
    { preHandler: authenticate },
    async (request, reply) => listTasks(fastify, request, reply)
  );
  // PUT /tasks/:id
  fastify.put(
    "/tasks/:id",
    { preHandler: authenticate },
    async (request, reply) => updateTask(fastify, request, reply)
  );

  // DELETE /tasks/:id
  fastify.delete(
    "/tasks/:id",
    { preHandler: authenticate },
    async (request, reply) => deleteTask(fastify, request, reply)
  );
}
