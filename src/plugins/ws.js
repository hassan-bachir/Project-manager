// src/plugins/ws.js
import fp from "fastify-plugin";
import fastifyWebsocket from "@fastify/websocket";
import jwt from "jsonwebtoken";

export default fp(async function (fastify) {
  // a) Enable WebSocket support
  fastify.register(fastifyWebsocket);

  // b) Map userId → Set of sockets
  const userRooms = new Map();
  fastify.decorate("userRooms", userRooms);

  // c) Define the WebSocket route
  fastify.get(
    "/ws",
    {
      websocket: true,
      // require a token query param for auth
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
        // Verify the JWT to get userId
        payload = jwt.verify(req.query.token, process.env.JWT_SECRET);
      } catch {
        // invalid token → close connection
        return connection.socket.close(1008, "Unauthorized");
      }

      const userId = payload.userId;
      const socket = connection.socket;

      // Add this socket to the user’s room
      if (!userRooms.has(userId)) userRooms.set(userId, new Set());
      userRooms.get(userId).add(socket);

      // Remove it on disconnect
      socket.on("close", () => {
        const room = userRooms.get(userId);
        if (!room) return;
        room.delete(socket);
        if (room.size === 0) userRooms.delete(userId);
      });
    }
  );
});
