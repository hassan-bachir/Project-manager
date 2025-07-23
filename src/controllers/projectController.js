// CREATE PROJECT CONTROLLER
export async function createProject(fastify, request, reply) {
  const { name, description, startDate, endDate } = request.body;
  const { userId } = request.user;

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

  return reply.status(201).send(project);
}

// LIST PROJECTS CONTROLLER
// QUERY PROJECTS
export async function listProjects(fastify, request, reply) {
  const { userId, role } = request.user;
  const { search } = request.query;

  const baseWhere = role === "ADMIN" ? {} : { members: { some: { userId } } };

  const where = {
    ...baseWhere,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const projects = await fastify.prisma.project.findMany({
    where,
    include: { members: true },
  });

  return reply.send(projects);
}

// Get project by ID controller
export async function getProject(fastify, request, reply) {
  const { id } = request.params;
  const { userId, role } = request.user;

  const project = await fastify.prisma.project.findUnique({
    where: { id },
    include: { members: true },
  });

  if (!project) {
    return reply.code(404).send({ error: "Project not found" });
  }

  if (role !== "ADMIN") {
    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      return reply.code(403).send({ error: "Forbidden" });
    }
  }

  return reply.send(project);
}

//  UPDATE PROJECT CONTROLLER
//  Admins only
export async function updateProject(fastify, request, reply) {
  const { userId, role } = request.user;
  if (role !== "ADMIN") {
    return reply.code(403).send({ error: "Forbidden: Admins only" });
  }

  const { id } = request.params;
  const data = request.body;

  const project = await fastify.prisma.project.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });

  return reply.send(project);
}
// DELETE PROJECT CONTROLLER
// Admins only
export async function deleteProject(fastify, request, reply) {
  const { id } = request.params;
  const { role } = request.user;

  if (role !== "ADMIN") {
    return reply.code(403).send({ error: "Forbidden: Admins only" });
  }

  await fastify.prisma.project.delete({
    where: { id },
  });

  return reply.code(204).send();
}
