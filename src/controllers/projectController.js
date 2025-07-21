// src/controllers/projectController.js
/**
 * Creates a new project and adds the creator as a member.
 */
export async function createProject(fastify, request, reply) {
  const { name, description, startDate, endDate } = request.body;
  const { userId } = request.user;

  // 1) Create project + join‐table entry
  const project = await fastify.prisma.project.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      members: {
        create: { userId },
      },
    },
    include: { members: true },
  });

  // 2) Return the new project
  return reply.status(201).send(project);
}
export async function listProjects(fastify, request, reply) {
  const { userId, role } = request.user;

  let projects;
  if (role === "ADMIN") {
    // Admin: fetch all
    projects = await fastify.prisma.project.findMany({
      include: { members: true },
    });
  } else {
    // Regular user: only those where members.some.userId matches
    projects = await fastify.prisma.project.findMany({
      where: {
        members: { some: { userId } },
      },
      include: { members: true },
    });
  }

  return reply.send(projects);
}
