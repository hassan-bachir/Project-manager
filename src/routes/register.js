import bcrypt from "bcrypt";

export default async function registerRoute(fastify, options) {
  fastify.post("/register", async (request, reply) => {
    const { name, email, password } = request.body;

    // 1. Validate inputs
    if (!name || !email || !password) {
      return reply.status(400).send({ error: "All fields are required" });
    }

    // 2. Check if user already exists
    const existingUser = await fastify.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.status(409).send({ error: "User already exists" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const newUser = await fastify.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return reply
      .status(201)
      .send({ message: "User registered!", userId: newUser.id });
  });
}
