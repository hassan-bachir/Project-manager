import { authenticate } from "../utils/auth.js";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { listProjectsQuery } from "../schemas/project.schema.js";

export default async function projectsRoute(fastify) {
  // Create a new project
  // POST /projects
  fastify.post("/", { preHandler: authenticate }, (request, reply) =>
    createProject(fastify, request, reply)
  );

  // List projects (with optional ?search=)
  // GET /projects?search=<search>
  // This route allows searching projects by name or description
  fastify.get(
    "/",
    {
      preHandler: authenticate,
      schema: {
        querystring: listProjectsQuery,
      },
    },
    async (request, reply) => listProjects(fastify, request, reply)
  );

  // Get a specific project by ID
  // GET /projects/:id
  fastify.get("/:id", { preHandler: authenticate }, async (request, reply) =>
    getProject(fastify, request, reply)
  );
  // Update a specific project by ID
  // PUT /projects/:id   (Admin only)
  fastify.put("/:id", { preHandler: authenticate }, async (request, reply) =>
    updateProject(fastify, request, reply)
  );
  // Delete a specific project by ID
  // DELETE /projects/:id   (Admin only)
  fastify.delete("/:id", { preHandler: authenticate }, async (request, reply) =>
    deleteProject(fastify, request, reply)
  );
}
