import Fastify from "fastify";
import dotenv from "dotenv";
import dbPlugin from "./plugins/db.js";
import errorHandler from "./plugins/errorHandler.js";

import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import protectedRoute from "./routes/protected.js";

dotenv.config();

const app = Fastify({ logger: true });

app.register(errorHandler);
app.register(dbPlugin);
app.register(registerRoute);
app.register(loginRoute);
app.register(protectedRoute);

app.get("/", async (request, reply) => {
  return { message: "API is working 🎯" };
});

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
