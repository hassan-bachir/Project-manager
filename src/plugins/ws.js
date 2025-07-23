import fp from "fastify-plugin";
import fastifyWebsocket from "@fastify/websocket";
import jwt from "jsonwebtoken";

export default fp(async function (fastify) {
  fastify.register(fastifyWebsocket);

  const userRooms = new Map();
  fastify.decorate("userRooms", userRooms);

  fastify.get(
    "/ws",
    {
      websocket: true,

      schema: {
        querystring: {
          type: "object",
          required: ["token"],
          properties: {
            token: { type: "string" },
          },
        },
      },
    },
    (connection, req) => {
      let payload;
      try {
        payload = jwt.verify(req.query.token, process.env.JWT_SECRET);
      } catch {
        return connection.socket.close(1008, "Unauthorized");
      }

      const userId = payload.userId;
      const socket = connection.socket;

      // Add this socket to the user’s room
      if (!userRooms.has(userId)) userRooms.set(userId, new Set());
      userRooms.get(userId).add(socket);

      socket.on("close", () => {
        const room = userRooms.get(userId);
        if (!room) return;
        room.delete(socket);
        if (room.size === 0) userRooms.delete(userId);
      });
    }
  );
});
