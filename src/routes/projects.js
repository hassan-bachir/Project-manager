import { authenticate } from "../utils/auth.js";
import {
  createProject,
  listProjects,
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
}
