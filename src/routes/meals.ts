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

const getMealParamsSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

const updateMealBodySchema = z.object({
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

  app.get(
    "/meals",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const userId = request.user!.id;

      const meals = await knex("meals")
        .where("user_id", userId)
        .orderBy("date_time", "desc")
        .select("*");

      return reply.status(200).send({
        meals,
        total: meals.length,
      });
    }
  );

  app.get(
    "/meals/metrics",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const userId = request.user!.id;

      const meals = await knex("meals")
        .where("user_id", userId)
        .orderBy("date_time", "asc")
        .select("*");

      const totalMeals = meals.length;
      const mealsOnDiet = meals.filter(meal => meal.is_on_diet).length;
      const mealsOffDiet = totalMeals - mealsOnDiet;

      let bestSequence = 0;
      let currentSequence = 0;

      for (const meal of meals) {
        if (meal.is_on_diet) {
          currentSequence++;
          bestSequence = Math.max(bestSequence, currentSequence);
        } else {
          currentSequence = 0;
        }
      }

      return reply.status(200).send({
        metrics: {
          totalMeals,
          mealsOnDiet,
          mealsOffDiet,
          bestDietSequence: bestSequence,
        },
      });
    }
  );

  app.get(
    "/meals/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { id } = getMealParamsSchema.parse(request.params);

      const userId = request.user!.id;

      const meal = await knex("meals")
        .where("id", id)
        .andWhere("user_id", userId)
        .first();

      if (!meal) {
        return reply.status(404).send({
          error: "Refeição não encontrada",
        });
      }

      return reply.status(200).send({
        meal,
      });
    }
  );

  app.put(
    "/meals/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { id } = getMealParamsSchema.parse(request.params);

      const { name, description, date_time, is_on_diet } =
        updateMealBodySchema.parse(request.body);

      const userId = request.user!.id;

      const existingMeal = await knex("meals")
        .where("id", id)
        .andWhere("user_id", userId)
        .first();

      if (!existingMeal) {
        return reply.status(404).send({
          error: "Refeição não encontrada",
        });
      }

      await knex("meals").where("id", id).andWhere("user_id", userId).update({
        name,
        description,
        date_time,
        is_on_diet,
      });

      return reply.status(200).send({
        message: "Refeição atualizada com sucesso",
        meal: {
          id,
          name,
          description,
          date_time,
          is_on_diet,
        },
      });
    }
  );

  app.delete(
    "/meals/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { id } = getMealParamsSchema.parse(request.params);

      const userId = request.user!.id;

      const existingMeal = await knex("meals")
        .where("id", id)
        .andWhere("user_id", userId)
        .first();

      if (!existingMeal) {
        return reply.status(404).send({
          error: "Refeição não encontrada",
        });
      }

      await knex("meals")
        .where("id", id)
        .andWhere("user_id", userId)
        .delete();

      return reply.status(200).send({
        message: "Refeição excluída com sucesso",
      });
    }
  );
}
