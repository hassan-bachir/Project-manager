import { authenticate } from "../utils/auth.js";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

export default async function projectsRoute(fastify) {
  // Create a new project
  fastify.post("/", { preHandler: authenticate }, (request, reply) =>
    createProject(fastify, request, reply)
  );

  // List projects
  fastify.get("/", { preHandler: authenticate }, async (request, reply) =>
    listProjects(fastify, request, reply)
  );

  // GET /projects/:id
  fastify.get("/:id", { preHandler: authenticate }, async (request, reply) =>
    getProject(fastify, request, reply)
  );

  // PUT /projects/:id   (Admin only)
  fastify.put("/:id", { preHandler: authenticate }, async (request, reply) =>
    updateProject(fastify, request, reply)
  );

  // DELETE /projects/:id   (Admin only)
  fastify.delete("/:id", { preHandler: authenticate }, async (request, reply) =>
    deleteProject(fastify, request, reply)
  );
}
