import { authenticate } from "../utils/auth.js";

export default async function protectedRoute(fastify) {
  fastify.get(
    "/protected",
    { preHandler: authenticate },
    async (request, reply) => {
      const { userId } = request.user;
      return { message: `Hello ${userId}, you’re authenticated!` };
    }
  );
}
