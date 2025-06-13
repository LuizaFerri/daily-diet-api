import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      created_at: string;
      session_id?: string;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date_time: string;
      is_on_diet: boolean;
      created_at: string;
    };
  }
}

declare module "fastify" {
  export interface FastifyRequest {
    user?: {
      id: string;
      name: string;
      email: string;
      created_at: string;
      session_id?: string;
    };
  }
}
