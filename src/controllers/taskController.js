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
/**
 * PUT /tasks/:id
 * Admins or project members only
 */
export async function updateTask(fastify, request, reply) {
  const { id } = request.params;
  const { title, description, dueDate, priority, status } = request.body;
  const { userId, role } = request.user;

  // 1) Fetch task with project membership
  const task = await fastify.prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });
  if (!task) {
    return reply.code(404).send({ error: "Task not found" });
  }

  // 2) Authorization
  const isMember = task.project.members.some((m) => m.userId === userId);
  if (role !== "ADMIN" && !isMember) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  // 3) Update
  const updated = await fastify.prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || undefined,
      status: status || undefined,
    },
  });

  return reply.send(updated);
}

/**
 * DELETE /tasks/:id
 * Admins or project members only
 */
export async function deleteTask(fastify, request, reply) {
  const { id } = request.params;
  const { userId, role } = request.user;

  // 1) Fetch task with project membership
  const task = await fastify.prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });
  if (!task) {
    return reply.code(404).send({ error: "Task not found" });
  }

  // 2) Authorization
  const isMember = task.project.members.some((m) => m.userId === userId);
  if (role !== "ADMIN" && !isMember) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  // 3) Delete
  await fastify.prisma.task.delete({ where: { id } });
  return reply.code(204).send();
}
