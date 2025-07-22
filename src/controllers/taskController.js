import { sendMail } from "../services/emailService.js";

// CREATE TASK CONTROLLER
export async function createTask(fastify, request, reply) {
  const { projectId } = request.params;
  const {
    title,
    description,
    dueDate,
    priority,
    assignees = [],
  } = request.body;
  const { userId, role } = request.user;

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

  const task = await fastify.prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      priority,
      project: { connect: { id: projectId } },
      assignees: {
        connect: assignees.map((id) => ({ id })),
      },
    },
    include: { assignees: true },
  });

  // Notify assignees via email
  const subject = `New Task Assigned: ${task.title}`;
  const text = `You’ve been assigned the task "${task.title}", due on ${task.dueDate}.`;
  const html = `<p>You’ve been assigned <strong>${task.title}</strong>.</p>
                 <p>Due: ${task.dueDate}</p>`;

  for (const user of task.assignees) {
    try {
      await sendMail(user.email, subject, text, html);
    } catch (err) {
      fastify.log.error("Sendinblue error:", err);
    }
  }

  // Websocket notification
  const msg = JSON.stringify({ type: "TASK_ASSIGNED", task });
  for (const u of task.assignees) {
    const room = fastify.userRooms.get(u.id);
    if (room) room.forEach((sock) => sock.send(msg));
  }

  return reply.status(201).send(task);
}

// LIST TASKS CONTROLLER
export async function listTasks(fastify, request, reply) {
  const { projectId } = request.params;
  const { userId, role } = request.user;

  if (role !== "ADMIN") {
    const member = await fastify.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) {
      return reply.code(403).send({ error: "Forbidden: Not a project member" });
    }
  }

  const tasks = await fastify.prisma.task.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return reply.send(tasks);
}
// GET TASK BY ID CONTROLLER
export async function updateTask(fastify, request, reply) {
  const { id } = request.params;
  const { title, description, dueDate, priority, status, assignees } =
    request.body;
  const { userId, role } = request.user;

  const task = await fastify.prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });
  if (!task) {
    return reply.code(404).send({ error: "Task not found" });
  }

  const isMember = task.project.members.some((m) => m.userId === userId);
  if (role !== "ADMIN" && !isMember) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  const updated = await fastify.prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || undefined,
      status: status || undefined,
      assignees: assignees
        ? { set: assignees.map((id) => ({ id })) }
        : undefined,
    },
    include: { assignees: true },
  });

  // Websocket notification
  const msg = JSON.stringify({ type: "TASK_UPDATED", task: updated });
  for (const u of updated.assignees) {
    const room = fastify.userRooms.get(u.id);
    if (room) room.forEach((sock) => sock.send(msg));
  }

  return reply.send(updated);
}

// DELETE TASK CONTROLLER
export async function deleteTask(fastify, request, reply) {
  const { id } = request.params;
  const { userId, role } = request.user;

  const task = await fastify.prisma.task.findUnique({
    where: { id },
    include: { project: { include: { members: true } } },
  });
  if (!task) {
    return reply.code(404).send({ error: "Task not found" });
  }

  const isMember = task.project.members.some((m) => m.userId === userId);
  if (role !== "ADMIN" && !isMember) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  await fastify.prisma.task.delete({ where: { id } });
  return reply.code(204).send();
}
