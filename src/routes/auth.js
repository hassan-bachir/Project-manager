import {
  registerController,
  loginController,
} from "../controllers/authController.js";

export default async function authRoutes(fastify) {
  fastify.post("/register", async (request, reply) => {
    return registerController(fastify, request, reply);
  });

  fastify.post("/login", async (request, reply) => {
    return loginController(fastify, request, reply);
  });
}
