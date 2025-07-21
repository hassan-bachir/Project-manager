import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function loginRoute(fastify, options) {
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    // 1. Validate input
    if (!email || !password) {
      return reply
        .status(400)
        .send({ error: "Email and password are required" });
    }

    // 2. Check if user exists
    const user = await fastify.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    // 4. Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return reply.send({ token });
  });
}
