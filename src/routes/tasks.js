import { authenticate } from "../utils/auth.js";
import { listTasksQuery } from "../schemas/task.schema.js";
import { taskHistoryParams } from "../schemas/history.schema.js";
import {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
  getTaskHistory,
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
    {
      preHandler: authenticate,
      schema: {
        querystring: listTasksQuery,
      },
    },
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
  // GET task history
  // GET /tasks/:id/history
  fastify.get(
    "/tasks/:id/history",
    {
      preHandler: authenticate,
      schema: {
        params: taskHistoryParams,
      },
    },
    (request, reply) => getTaskHistory(fastify, request, reply)
  );
}
