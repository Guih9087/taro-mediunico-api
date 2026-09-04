// src/controllers/consultas.controller.js
const { tarologos } = require('./tarologos.controller');
const { clientes } = require('./cliente.controller'); // <-- Importação do banco de clientes

let consultas = [];

const agendarConsulta = (req, res, next) => {
    try {
        const { idTarologo, dataHora, duracaoMinutos } = req.body;
        const idCliente = req.usuario.id; 

        if (!dataHora) {
            const erro = new Error('A data e hora da consulta são obrigatórias.');
            erro.status = 400;
            throw erro;
        }

        const tarologo = tarologos.find(t => t.id === Number(idTarologo));

        if (!tarologo) {
            const erro = new Error('Tarólogo não encontrado.');
            erro.status = 404;
            throw erro;
        }

        if (tarologo.status !== 'APROVADO') {
            const erro = new Error('Este tarólogo não está disponível para consultas no momento.');
            erro.status = 400;
            throw erro;
        }

        const minutos = Number(duracaoMinutos) || 30;
        const inicioNovo = new Date(dataHora);
        const agora = new Date();

        if (isNaN(inicioNovo.getTime()) || inicioNovo <= agora) {
            const erro = new Error('A data e hora do agendamento devem ser no futuro.');
            erro.status = 400;
            throw erro;
        }

        const fimNovo = new Date(inicioNovo.getTime() + minutos * 60000);

        const conflitoHorario = consultas.some(c => {
            if (c.idTarologo !== Number(idTarologo) || c.status === 'CANCELADO') {
                return false;
            }
            const inicioExistente = new Date(c.dataHora);
            const fimExistente = new Date(inicioExistente.getTime() + c.duracaoMinutos * 60000);
            return (inicioNovo < fimExistente) && (fimNovo > inicioExistente);
        });

        if (conflitoHorario) {
            const erro = new Error('O tarólogo já possui um agendamento nesse intervalo de horário.');
            erro.status = 400;
            throw erro;
        }

        // ------------------ VALIDAÇÃO E DEBITO DE SALDO ------------------
        const cliente = clientes.find(c => c.id === idCliente);

        if (!cliente) {
            const erro = new Error('Cliente não encontrado.');
            erro.status = 404;
            throw erro;
        }

        const valorTotal = tarologo.valorMinuto * minutos;

        if (cliente.saldo < valorTotal) {
            const erro = new Error(`Saldo insuficiente. Você possui R$ ${cliente.saldo.toFixed(2)}, mas a consulta custa R$ ${valorTotal.toFixed(2)}.`);
            erro.status = 400;
            throw erro;
        }

        // Abate o valor do saldo do cliente
        cliente.saldo -= valorTotal;
        // ------------------------------------------------------------------

        const novaConsulta = {
            id: consultas.length > 0 ? consultas[consultas.length - 1].id + 1 : 1,
            idCliente,
            idTarologo: Number(idTarologo),
            dataHora: inicioNovo.toISOString(),
            duracaoMinutos: minutos,
            valorTotal,
            status: 'AGENDADO',
            criadoEm: new Date()
        };

        consultas.push(novaConsulta);

        return res.status(201).json({
            mensagem: 'Consulta agendada com sucesso!',
            consulta: novaConsulta,
            saldoRestante: cliente.saldo
        });
    } catch (error) {
        next(error);
    }
};

// ... (manter listarMinhasConsultas e alterarStatusConsulta iguais)

// Listar Consultas do Usuário Logado
const listarMinhasConsultas = (req, res, next) => {
    try {
        const idUsuario = req.usuario.id;
        const tipoUsuario = req.usuario.tipo;

        const minhasConsultas = consultas.filter(c => {
            if (tipoUsuario === 'TAROLOGO') {
                return c.idTarologo === idUsuario;
            }
            return c.idCliente === idUsuario;
        });

        return res.json(minhasConsultas);
    } catch (error) {
        next(error);
    }
};

// Atualizar Status da Consulta
const alterarStatusConsulta = (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusValidos = ['AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'CANCELADO'];
        if (!statusValidos.includes(status)) {
            const erro = new Error(`Status inválido. Use um dos seguintes: ${statusValidos.join(', ')}`);
            erro.status = 400;
            throw erro;
        }

        const consulta = consultas.find(c => c.id === Number(id));

        if (!consulta) {
            const erro = new Error('Consulta não encontrada.');
            erro.status = 404;
            throw erro;
        }

        consulta.status = status;

        return res.json({
            mensagem: `Status da consulta #${consulta.id} atualizado para ${status}.`,
            consulta
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    agendarConsulta,
    listarMinhasConsultas,
    alterarStatusConsulta,
    consultas
};