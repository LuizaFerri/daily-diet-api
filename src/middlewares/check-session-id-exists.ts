import { FastifyRequest, FastifyReply } from "fastify";
import { knex } from "../database";

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionId = request.cookies.sessionId;

  if (!sessionId) {
    return reply.status(401).send({
      error: "Não autorizado. Faça login primeiro.",
    });
  }

  const user = await knex("users").where("session_id", sessionId).first();

  if (!user) {
    return reply.status(401).send({
      error: "Sessão inválida. Faça login novamente.",
    });
  }

  request.user = user;
}
