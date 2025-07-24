// src/controllers/userController.js

// list users
export async function listUsers(fastify, request, reply) {
  if (request.user.role !== "ADMIN") {
    return reply.code(403).send({ error: "Forbidden" });
  }
  const users = await fastify.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return reply.send(users);
}

// update user role
export async function updateUserRole(fastify, request, reply) {
  const { id } = request.params;
  const { role } = request.body;
  if (request.user.role !== "ADMIN") {
    return reply.code(403).send({ error: "Forbidden" });
  }
  const user = await fastify.prisma.user.findUnique({ where: { id } });
  if (!user) {
    return reply.code(404).send({ error: "User not found" });
  }
  const updated = await fastify.prisma.user.update({
    where: { id },
    data: { role },
  });

  delete updated.password;
  return reply.send(updated);
}
// delete user
export async function deleteUser(fastify, request, reply) {
  const { id } = request.params;
  if (request.user.role !== "ADMIN") {
    return reply.code(403).send({ error: "Forbidden" });
  }

  await fastify.prisma.user.delete({ where: { id } });
  return reply.code(204).send();
}
