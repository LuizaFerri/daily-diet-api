// Arquivo principal do servidor Fastify 
import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0', 
  })
  .then(() => {
    console.log(`🚀 Servidor rodando na porta ${env.PORT}!`)
  })
  .catch((err) => {
    console.error('❌ Erro ao iniciar servidor:', err)
    process.exit(1)
  }) 