// src/middlewares/validar.middleware.js
const validar = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (error) {
        // O Zod armazena os detalhes dos erros no array 'issues'
        if (error.issues) {
            const mensagens = error.issues
                .map(err => `${err.path.slice(1).join('.')}: ${err.message}`)
                .join(' | ');

            const erroValidacao = new Error(`Dados inválidos: ${mensagens}`);
            erroValidacao.status = 400;
            return next(erroValidacao);
        }

        next(error);
    }
};

module.exports = validar;