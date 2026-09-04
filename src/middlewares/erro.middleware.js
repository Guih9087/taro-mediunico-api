// src/middlewares/erro.middleware.js

const manipuladorDeErros = (err, req, res, next) => {
    // Exibe o erro detalhado no terminal para você debugar
    console.error('❌ ERRO CAPTURADO:', err.stack);

    // Se o erro tiver um status personalizado usa ele, senão assume 500 (Erro Interno)
    const statusCode = err.status || err.statusCode || 500;
    const mensagem = err.message || 'Ocorreu um erro interno no servidor.';

    return res.status(statusCode).json({
        sucesso: false,
        status: statusCode,
        mensagem: mensagem
    });
};

module.exports = manipuladorDeErros;