import { authenticate } from "../utils/auth.js";
import {
  createTaskBody,
  updateTaskBody,
  projectIdParams,
  taskIdParams,
  listTasksQuery,
  taskListResponse,
  taskResponse,
} from "../schemas/task.schema.js";
import {
  taskHistoryParams,
  historyResponse,
} from "../schemas/history.schema.js";
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
    {
      preHandler: authenticate,
      schema: {
        summary: "Create a new task in a project",
        tags: ["Tasks"],
        params: projectIdParams,
        body: createTaskBody,
        response: { 201: taskResponse },
      },
    },
    async (request, reply) => createTask(fastify, request, reply)
  );
  // List tasks
  // GET /projects/:projectId/tasks?search=<search>
  // This route allows filtering tasks by title or description and id
  fastify.get(
    "/projects/:projectId/tasks",
    {
      preHandler: authenticate,
      schema: {
        summary: "List tasks in a project (filter/search)",
        tags: ["Tasks"],
        params: projectIdParams,
        querystring: listTasksQuery,
        response: taskListResponse,
      },
    },
    async (request, reply) => listTasks(fastify, request, reply)
  );
  // Update a specific task by ID
  // PUT /tasks/:id
  fastify.put(
    "/tasks/:id",
    {
      preHandler: authenticate,
      schema: {
        summary: "Update an existing task",
        tags: ["Tasks"],
        params: taskIdParams,
        body: updateTaskBody,
        response: taskResponse,
      },
    },
    async (request, reply) => updateTask(fastify, request, reply)
  );
  // Delete a specific task by ID
  // DELETE /tasks/:id
  fastify.delete(
    "/tasks/:id",
    {
      preHandler: authenticate,
      schema: {
        summary: "Delete a task",
        tags: ["Tasks"],
        params: taskIdParams,
        response: { 204: { type: "null" } },
      },
    },
    async (request, reply) => deleteTask(fastify, request, reply)
  );
  // GET task history

  fastify.get(
    "/tasks/:id/history",
    {
      preHandler: authenticate,
      schema: {
        summary: "Get change history for a task",
        tags: ["Tasks", "History"],
        params: taskHistoryParams,
        response: historyResponse,
      },
    },
    (request, reply) => getTaskHistory(fastify, request, reply)
  );
}
