// addComment
export async function addComment(fastify, request, reply) {
  const { taskId } = request.params;
  const { userId, role } = request.user;
  const { content } = request.body;

  const task = await fastify.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } },
  });
  if (!task) return reply.code(404).send({ error: "Task not found" });
  const isMember = task.project.members.some((m) => m.userId === userId);
  if (role !== "ADMIN" && !isMember) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  const comment = await fastify.prisma.comment.create({
    data: {
      content,
      task: { connect: { id: taskId } },
      author: { connect: { id: userId } },
    },
    include: { author: { select: { id: true, name: true } } },
  });
  // Notify WebSocket clients about the new comment
  const msg = JSON.stringify({ type: "COMMENT_ADDED", comment });

  for (const a of task.project.members) {
    const room = fastify.userRooms.get(a.userId);
    room?.forEach((sock) => sock.send(msg));
  }

  return reply.status(201).send(comment);
}

// listComments
export async function listComments(fastify, request, reply) {
  const { taskId } = request.params;
  const comments = await fastify.prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
    include: { author: { select: { id: true, name: true } } },
  });
  return reply.send(comments);
}
