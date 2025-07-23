import fp from "fastify-plugin";
import Redis from "ioredis";

export default fp(async function (fastify) {
  // 1) Connect to Redis (local by default)
  const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

  // 2) Expose it as fastify.cache
  fastify.decorate("cache", redis);

  // 3) Clean up when Fastify shuts down
  fastify.addHook("onClose", async (_instance, done) => {
    await redis.quit();
    done();
  });
});
