/**
 * POST /projects/:projectId/tasks
 * Only project members (and admins) can create tasks
 */
export async function createTask(fastify, request, reply) {
  const { projectId } = request.params;
  const { title, description, dueDate, priority } = request.body;
  const { userId, role } = request.user;

  // 1) Check membership (or admin)
  if (role !== "ADMIN") {
    const member = await fastify.prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
    if (!member) {
      return reply.code(403).send({ error: "Forbidden: Not a project member" });
    }
  }

  // 2) Create task
  const task = await fastify.prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      priority, // expect "LOW"|"MEDIUM"|"HIGH"
      project: { connect: { id: projectId } },
      // leave assignees to a separate endpoint if you like
    },
  });

  return reply.status(201).send(task);
}

/**
 * GET /projects/:projectId/tasks
 * - Admins see all tasks for any project
 * - Users see tasks only if they’re a member
 */
export async function listTasks(fastify, request, reply) {
  const { projectId } = request.params;
  const { userId, role } = request.user;

  // 1) If not admin, verify membership
  if (role !== "ADMIN") {
    const member = await fastify.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) {
      return reply.code(403).send({ error: "Forbidden: Not a project member" });
    }
  }

  // 2) Fetch tasks
  const tasks = await fastify.prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return reply.send(tasks);
}
