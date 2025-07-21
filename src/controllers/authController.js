// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * POST /register
 */
export async function registerController(fastify, request, reply) {
  console.log("➡️ [authController] Headers:", request.headers);
  console.log("➡️ [authController] Body:", request.body);
  const { name, email, password } = request.body;

  // Validate inputs
  if (!name || !email || !password) {
    return reply.status(400).send({ error: "All fields are required" });
  }

  // Check for existing user
  const existing = await fastify.prisma.user.findUnique({ where: { email } });
  if (existing) {
    return reply.status(409).send({ error: "User already exists" });
  }

  // Hash & save
  const hashed = await bcrypt.hash(password, 10);
  const user = await fastify.prisma.user.create({
    data: { name, email, password: hashed },
  });

  return reply
    .status(201)
    .send({ message: "User registered!", userId: user.id });
}

/**
 * POST /login
 */
export async function loginController(fastify, request, reply) {
  const { email, password } = request.body;

  // Validate input
  if (!email || !password) {
    return reply.status(400).send({ error: "Email and password are required" });
  }

  // Lookup & verify
  const user = await fastify.prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  // Sign token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return reply.send({ token });
}
