
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

const createUserBodySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email deve ter um formato válido'),
})

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    const { name, email } = createUserBodySchema.parse(request.body)

    const existingUser = await knex('users').where('email', email).first()

    if (existingUser) {
      return reply.status(400).send({
        error: 'Email já está em uso',
      })
    }

    const userId = randomUUID()
    const sessionId = randomUUID()

    await knex('users').insert({
      id: userId,
      name,
      email,
      session_id: sessionId,
    })

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    })

    return reply.status(201).send({
      message: 'Usuário criado com sucesso',
      user: {
        id: userId,
        name,
        email,
      },
    })
  })
} 
