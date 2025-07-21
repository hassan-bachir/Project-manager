import Fastify from "fastify";
import dotenv from "dotenv";
import dbPlugin from "./plugins/db.js";
import errorHandler from "./plugins/errorHandler.js";
import authRoutes from "./routes/auth.js";
import projectsRoute from "./routes/projects.js";
import protectedRoute from "./routes/protected.js";
import tasksRoute from "./routes/tasks.js";
dotenv.config();

const app = Fastify({ logger: true });

app.register(errorHandler);
app.register(dbPlugin);

app.register(authRoutes, { prefix: "/auth" });
app.register(projectsRoute, { prefix: "/projects" });
app.register(tasksRoute);
app.register(protectedRoute);

app.get("/users", async (request, reply) => {
  const users = await app.prisma.user.findMany();
  return users;
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server is running at ${address}`);
});
