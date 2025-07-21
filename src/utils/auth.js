import jwt from "jsonwebtoken";

export async function authenticate(request, reply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new Error("No token");
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    request.user = payload;
  } catch {
    reply.code(401).send({ error: "Unauthorized" });
  }
}
