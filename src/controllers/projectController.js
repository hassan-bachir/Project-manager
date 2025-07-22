// CREATE PROJECT CONTROLLER
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

// Get project by ID controller
export async function getProject(fastify, request, reply) {
  const { id } = request.params;
  const { userId, role } = request.user;

  // 1) Fetch the project (with its members)
  const project = await fastify.prisma.project.findUnique({
    where: { id },
    include: { members: true }, // you can add tasks here later
  });

  // 2) Not found?
  if (!project) {
    return reply.code(404).send({ error: "Project not found" });
  }

  // 3) If not admin, ensure they’re a member
  if (role !== "ADMIN") {
    const isMember = project.members.some((m) => m.userId === userId);
    if (!isMember) {
      return reply.code(403).send({ error: "Forbidden" });
    }
  }

  // 4) Return it
  return reply.send(project);
}

//  UPDATE PROJECT CONTROLLER
//  PUT /projects/:id
//  * Admins only
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
// DELETE /projects/:id
// * Admins only
export async function deleteProject(fastify, request, reply) {
  const { id } = request.params;
  const { role } = request.user;

  // 1) Ensure only admins can delete
  if (role !== "ADMIN") {
    return reply.code(403).send({ error: "Forbidden: Admins only" });
  }

  // 2) Delete the project; related ProjectMember rows cascade automatically
  await fastify.prisma.project.delete({
    where: { id },
  });

  // 3) Respond with no content
  return reply.code(204).send();
}
