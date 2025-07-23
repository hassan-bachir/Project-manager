
// update project
{ "name": "Updated name", "status": "COMPLETED" }


// admin
{
  "email": "hassan@example.com",
  "password": "supersecret123"
}
// project
{
  "name": "My First Project",
  "description": "Quick test",
  "startDate": "2025-07-20T00:00:00.000Z",
  "endDate":   "2025-08-20T00:00:00.000Z"
}

//task
{
  "title":       "Design homepage",
  "description": "Create wireframes for the new homepage",
  "dueDate":     "2025-08-01T12:00:00.000Z",
  "priority":    "HIGH"
}
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
