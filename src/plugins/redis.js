import fp from "fastify-plugin";
import Redis from "ioredis";

export default fp(async function (fastify) {
  const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

  fastify.decorate("cache", redis);

  fastify.addHook("onClose", async (_instance, done) => {
    await redis.quit();
    done();
  });
});
