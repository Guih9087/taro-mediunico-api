// src/schemas/consultas.schema.js
const { z } = require('zod');

const agendarConsultaSchema = z.object({
    body: z.object({
        idTarologo: z.number({
            required_error: 'O ID do tarólogo é obrigatório.',
            invalid_type_error: 'O ID do tarólogo deve ser um número.'
        }).positive('O ID do tarólogo deve ser um número positivo.'),
        
        dataHora: z.string({
            required_error: 'A data e hora são obrigatórias.'
        }).datetime({ message: 'A dataHora deve estar em um formato ISO8601 válido.' }),
        
        duracaoMinutos: z.number({
            invalid_type_error: 'A duração deve ser um número.'
        }).min(15, 'A duração mínima de consulta é 15 minutos.')
          .max(120, 'A duração máxima de consulta é 120 minutos.')
          .optional()
    })
});

module.exports = { agendarConsultaSchema };