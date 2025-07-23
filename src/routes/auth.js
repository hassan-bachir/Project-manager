// src/routes/auth.js

import {
  registerController,
  loginController,
} from "../controllers/authController.js";

import {
  registerBody,
  loginBody,
  loginResponse,
} from "../schemas/auth.schema.js";

export default async function authRoutes(fastify) {
  // POST /auth/register
  fastify.post(
    "/register",
    {
      schema: {
        summary: "Register a new user",
        tags: ["Auth"],
        body: registerBody,
        response: {
          201: {
            type: "object",
            properties: {
              message: { type: "string" },
              userId: { type: "string", format: "uuid" },
            },
          },
        },
      },
    },
    (request, reply) => registerController(fastify, request, reply)
  );

  // POST /auth/login
  fastify.post(
    "/login",
    {
      schema: {
        summary: "Log in and receive a JWT",
        tags: ["Auth"],
        body: loginBody,
        response: loginResponse,
      },
    },
    (request, reply) => loginController(fastify, request, reply)
  );
}
