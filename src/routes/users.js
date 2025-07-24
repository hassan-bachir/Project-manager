import { authenticate } from "../utils/auth.js";
import {
  listUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import {
  userIdParams,
  userListResponse,
  userResponse,
  updateUserRoleBody,
  updateUserRoleResponse,
  deleteUserResponse,
} from "../schemas/user.schema.js";

export default async function usersRoute(fastify) {
  // GET /users
  fastify.get(
    "/users",
    {
      preHandler: authenticate,
      schema: {
        summary: "List all users (Admin only)",
        tags: ["Users"],
        response: userListResponse,
      },
    },
    (req, rep) => listUsers(fastify, req, rep)
  );

  // PUT /users/:id/role
  fastify.put(
    "/users/:id/role",
    {
      preHandler: authenticate,
      schema: {
        summary: "Change a user’s role (Admin only)",
        tags: ["Users"],
        params: userIdParams,
        body: updateUserRoleBody,
        response: updateUserRoleResponse,
      },
    },
    (req, rep) => updateUserRole(fastify, req, rep)
  );

  // DELETE /users/:id
  fastify.delete(
    "/users/:id",
    {
      preHandler: authenticate,
      schema: {
        summary: "Delete a user (Admin only)",
        tags: ["Users"],
        params: userIdParams,
        response: deleteUserResponse,
      },
    },
    (req, rep) => deleteUser(fastify, req, rep)
  );
}
