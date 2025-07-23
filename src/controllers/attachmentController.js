import fs from "fs";
import path from "path";

export async function uploadAttachment(fastify, request, reply) {
  const { taskId } = request.params;
  const { userId, role } = request.user;

  const task = await fastify.prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { members: true } } },
  });
  if (!task) return reply.code(404).send({ error: "Task not found" });
  const isMember = task.project.members.some((m) => m.userId === userId);
  if (role !== "ADMIN" && !isMember) {
    return reply.code(403).send({ error: "Forbidden" });
  }

  const data = await request.file();
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const filename = `${Date.now()}-${data.filename}`;
  const filepath = path.join(uploadDir, filename);
  await data.toFile(filepath);

  const attachment = await fastify.prisma.attachment.create({
    data: {
      task: { connect: { id: taskId } },
      filename: data.filename,
      mimeType: data.mimetype,
      url: `/uploads/${filename}`,
    },
  });

  return reply.status(201).send(attachment);
}
