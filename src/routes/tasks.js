import { authenticate } from "../utils/auth.js";
import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

export default async function tasksRoute(fastify) {
  // Create task under a project
  // POST /projects/:projectId/tasks
  fastify.post(
    "/projects/:projectId/tasks",
    { preHandler: authenticate },
    async (request, reply) => createTask(fastify, request, reply)
  );
  // List tasks
  // GET /projects/:projectId/tasks
  fastify.get(
    "/projects/:projectId/tasks",
    { preHandler: authenticate },
    async (request, reply) => listTasks(fastify, request, reply)
  );
  // Update a specific task by ID
  // PUT /tasks/:id
  fastify.put(
    "/tasks/:id",
    { preHandler: authenticate },
    async (request, reply) => updateTask(fastify, request, reply)
  );
  // Delete a specific task by ID
  // DELETE /tasks/:id
  fastify.delete(
    "/tasks/:id",
    { preHandler: authenticate },
    async (request, reply) => deleteTask(fastify, request, reply)
  );
}
