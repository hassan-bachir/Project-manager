import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
  fastify.setErrorHandler((err, request, reply) => {
    if (err.validation) {
      return reply.status(400).send({
        error: "Bad Request",
        message: err.message,
      });
    }

    if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
      return reply.status(err.statusCode).send({
        error: err.name,
        message: err.message,
      });
    }

    request.log.error(err);
    reply.status(500).send({
      error: "Internal Server Error",
      message: "Something went wrong",
    });
  });
});
