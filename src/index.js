import Fastify from "fastify";
import dotenv from "dotenv";
import dbPlugin from "./plugins/db.js";
import errorHandler from "./plugins/errorHandler.js";
import authRoutes from "./routes/auth.js";
import projectsRoute from "./routes/projects.js";
import analyticsRoute from "./routes/analytics.js";
import tasksRoute from "./routes/tasks.js";
import wsPlugin from "./plugins/ws.js";
import cronPlugin from "./plugins/cron.js";
import commentsRoute from "./routes/comments.js";
import multipart from "@fastify/multipart";
import attachmentRoute from "./routes/attachments.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import usersRoute from "./routes/users.js";
// import redisPlugin from "./plugins/redis.js";
dotenv.config();

const app = Fastify({ logger: true });

app.register(swagger, {
  openapi: {
    info: {
      title: "Project Manager API",
      description: "generated docs for Project Manager API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000", description: "Local server" }],
  },
});
app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: { docExpansion: "list" },
  uiHooks: {
    onRequest: (_req, _reply, next) => next(),
    preHandler: (_req, _reply, next) => next(),
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

app.register(wsPlugin);
// app.register(redisPlugin);
app.register(errorHandler);
app.register(dbPlugin);
app.register(cronPlugin);
app.register(multipart, {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

app.register(authRoutes, { prefix: "/auth" });
app.register(projectsRoute, { prefix: "/projects" });
app.register(tasksRoute);
app.register(commentsRoute);
app.register(analyticsRoute);
app.register(attachmentRoute);
app.register(usersRoute);

const PORT = process.env.PORT || 3000;
app.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server is running at ${address}`);
});
