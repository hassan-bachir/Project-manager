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
// QUERY TASKS
export async function listTasks(fastify, request, reply) {
  const { projectId } = request.params;
  const { userId, role } = request.user;
  const { status, priority, dueAfter, dueBefore, search } = request.query;

  if (role !== "ADMIN") {
    const member = await fastify.prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });
    if (!member) {
      return reply.code(403).send({ error: "Forbidden: Not a project member" });
    }
  }

  const where = { projectId };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (dueAfter) {
    where.dueDate = { ...(where.dueDate || {}), gte: new Date(dueAfter) };
  }
  if (dueBefore) {
    where.dueDate = { ...(where.dueDate || {}), lt: new Date(dueBefore) };
  }

  if (search) {
    where.OR = [
      { id: { equals: search } },
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const tasks = await fastify.prisma.task.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return reply.send(tasks);
}

// UPDATE TASK CONTROLLER
export async function updateTask(fastify, request, reply) {
  const { id } = request.params;
  const { title, description, dueDate, priority, status, assignees } =
    request.body;
  const { userId, role } = request.user;

  const original = await fastify.prisma.task.findUnique({
    where: { id },
    include: {
      project: { include: { members: true } },
      assignees: { select: { id: true } },
    },
  });
  if (!original) {
    return reply.code(404).send({ error: "Task not found" });
  }

  const isMember = original.project.members.some((m) => m.userId === userId);
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
        ? { set: assignees.map((uid) => ({ id: uid })) }
        : undefined,
    },
    include: { assignees: { select: { id: true } } },
  });

  const msg = JSON.stringify({ type: "TASK_UPDATED", task: updated });
  for (const u of updated.assignees) {
    const room = fastify.userRooms.get(u.id);
    if (room) room.forEach((sock) => sock.send(msg));
  }

  const changes = [];

  if (title != null && original.title !== updated.title) {
    changes.push({ field: "title", old: original.title, new: updated.title });
  }
  if (description != null && original.description !== updated.description) {
    changes.push({
      field: "description",
      old: original.description,
      new: updated.description,
    });
  }
  if (
    dueDate != null &&
    original.dueDate?.toISOString() !== updated.dueDate.toISOString()
  ) {
    changes.push({
      field: "dueDate",
      old: original.dueDate.toISOString(),
      new: updated.dueDate.toISOString(),
    });
  }
  if (priority != null && original.priority !== updated.priority) {
    changes.push({
      field: "priority",
      old: original.priority,
      new: updated.priority,
    });
  }
  if (status != null && original.status !== updated.status) {
    changes.push({
      field: "status",
      old: original.status,
      new: updated.status,
    });
  }
  if (assignees) {
    const oldIds = original.assignees.map((a) => a.id).sort();
    const newIds = updated.assignees.map((a) => a.id).sort();
    if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
      changes.push({
        field: "assignees",
        old: JSON.stringify(oldIds),
        new: JSON.stringify(newIds),
      });
    }
  }

  for (const c of changes) {
    await fastify.prisma.taskHistory.create({
      data: {
        taskId: id,
        userId: userId,
        field: c.field,
        oldValue: c.old,
        newValue: c.new,
      },
    });
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
// GET TASK HISTORY CONTROLLER
export async function getTaskHistory(fastify, request, reply) {
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

  const history = await fastify.prisma.taskHistory.findMany({
    where: { taskId: id },
    orderBy: { timestamp: "asc" },
  });

  return reply.send(history);
}
