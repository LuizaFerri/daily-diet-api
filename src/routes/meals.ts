import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

const createMealBodySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date_time: z.string().min(1, "Data e hora são obrigatórias"),
  is_on_diet: z.boolean(),
});

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    "/meals",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { name, description, date_time, is_on_diet } =
        createMealBodySchema.parse(request.body);

      const userId = request.user!.id;

      const mealId = randomUUID();

      await knex("meals").insert({
        id: mealId,
        user_id: userId,
        name,
        description,
        date_time,
        is_on_diet,
      });

      return reply.status(201).send({
        message: "Refeição registrada com sucesso",
        meal: {
          id: mealId,
          name,
          description,
          date_time,
          is_on_diet,
        },
      });
    }
  );

 
}
