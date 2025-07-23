import fp from "fastify-plugin";
import cron from "node-cron";
import { sendMail } from "../services/emailService.js";

export default fp(async function (fastify) {
  // Run every day at 8:00 AM server time
  cron.schedule("0 8 * * *", async () => {
    fastify.log.info("⏰ Running due‑soon reminder job");

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find tasks due between now and 24h from now, and not yet completed
    const tasks = await fastify.prisma.task.findMany({
      where: {
        dueDate: { gte: now, lt: in24Hours },
        status: { not: "COMPLETED" },
      },
      include: {
        assignees: { select: { email: true, id: true } },
      },
    });

    // Send one reminder per assignee per task
    for (const task of tasks) {
      const subject = `Reminder: "${task.title}" due soon`;
      const text = `Your task "${task.title}" is due at ${task.dueDate}.`;
      const html = `<p>Your task "<strong>${task.title}</strong>" is due on ${task.dueDate}.</p>`;

      for (const user of task.assignees) {
        try {
          await sendMail(user.email, subject, text, html);
          fastify.log.info(
            `✉️ Sent reminder for task ${task.id} to ${user.email}`
          );
        } catch (err) {
          fastify.log.error(`❌ Failed to send reminder to ${user.email}`, err);
        }
      }
    }
  });
});
