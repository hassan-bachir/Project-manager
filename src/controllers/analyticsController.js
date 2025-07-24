// GET /analytics/overview
// Returns total, completed, overdue tasks + overall completion rate

export async function getOverview(fastify, req, rep) {
  const now = new Date();

  const total = await fastify.prisma.task.count();
  const completed = await fastify.prisma.task.count({
    where: { status: "COMPLETED" },
  });
  const overdue = await fastify.prisma.task.count({
    where: {
      status: { not: "COMPLETED" },
      dueDate: { lt: now },
    },
  });

  // Calculate completion rate
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return rep.send({ total, completed, overdue, completionRate });
}

//GET /analytics/users/:id/stats
//Returns stats for one user: assigned, completed, overdue, rate

export async function getUserStats(fastify, req, rep) {
  const { id: userId } = req.params;
  const now = new Date();

  // Total assigned to this user
  const assigned = await fastify.prisma.task.count({
    where: { assignees: { some: { id: userId } } },
  });

  // Completed by this user
  const completed = await fastify.prisma.task.count({
    where: {
      assignees: { some: { id: userId } },
      status: "COMPLETED",
    },
  });

  // Overdue (assigned, not completed, dueDate < now)
  const overdue = await fastify.prisma.task.count({
    where: {
      assignees: { some: { id: userId } },
      status: { not: "COMPLETED" },
      dueDate: { lt: now },
    },
  });

  // Rate
  const completionRate =
    assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

  return rep.send({ userId, assigned, completed, overdue, completionRate });
}
