// src/plugins/errorHandler.js
import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
  fastify.setErrorHandler((err, request, reply) => {
    // 1) Schema validation errors
    if (err.validation) {
      // err.message contains the list of failures
      return reply.status(400).send({
        error: "Bad Request",
        message: err.message,
      });
    }

    // 2) Other controlled errors (e.g. 401, 403 from your code)
    if (err.statusCode && err.statusCode >= 400 && err.statusCode < 500) {
      return reply.status(err.statusCode).send({
        error: err.name,
        message: err.message,
      });
    }

    // 3) Unexpected / unhandled errors
    request.log.error(err); // logs stack to your logger
    reply.status(500).send({
      error: "Internal Server Error",
      message: "Something went wrong",
    });
  });
});
