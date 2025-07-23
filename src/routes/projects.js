import { authenticate } from "../utils/auth.js";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import {
  createProjectBody,
  updateProjectBody,
  projectIdParams,
  listProjectsQuery,
  projectListResponse,
  projectResponse,
} from "../schemas/project.schema.js";
export default async function projectsRoute(fastify) {
  // POST /projects
  fastify.post(
    "/",
    {
      preHandler: authenticate,
      schema: {
        summary: "Create a new project",
        tags: ["Projects"],
        body: createProjectBody,
        response: {
          201: projectResponse,
        },
      },
    },
    (request, reply) => createProject(fastify, request, reply)
  );

  // GET /projects?search=
  fastify.get(
    "/",
    {
      preHandler: authenticate,
      schema: {
        summary: "List projects (optionally filtered by ?search=)",
        tags: ["Projects"],
        querystring: listProjectsQuery,
        response: projectListResponse,
      },
    },
    (request, reply) => listProjects(fastify, request, reply)
  );

  // GET /projects/:id
  fastify.get(
    "/:id",
    {
      preHandler: authenticate,
      schema: {
        summary: "Get a project by ID",
        tags: ["Projects"],
        params: projectIdParams,
        response: projectResponse,
      },
    },
    (request, reply) => getProject(fastify, request, reply)
  );

  // PUT /projects/:id
  fastify.put(
    "/:id",
    {
      preHandler: authenticate,
      schema: {
        summary: "Update a project (Admin only)",
        tags: ["Projects"],
        params: projectIdParams,
        body: updateProjectBody,
        response: projectResponse,
      },
    },
    (request, reply) => updateProject(fastify, request, reply)
  );

  // DELETE /projects/:id
  fastify.delete(
    "/:id",
    {
      preHandler: authenticate,
      schema: {
        summary: "Delete a project (Admin only)",
        tags: ["Projects"],
        params: projectIdParams,
        response: {
          204: { type: "null" },
        },
      },
    },
    (request, reply) => deleteProject(fastify, request, reply)
  );
}
