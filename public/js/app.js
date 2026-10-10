// public/js/app.js

const API_URL = 'http://localhost:3000';
let socket;
let tokenUsuario = localStorage.getItem('token');
let usuarioLogado = JSON.parse(localStorage.getItem('usuario'));

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
    inicializarSocket();
});

// Alternar entre as telas do sistema baseada no perfil
function renderizarTelaPorPerfil() {
    const viewCliente = document.getElementById('view-cliente');
    const viewTarologo = document.getElementById('view-tarologo');
    const viewAdmin = document.getElementById('view-admin');

    // Esconde todas as telas primeiro
    viewCliente.classList.add('hidden');
    viewTarologo.classList.add('hidden');
    viewAdmin.classList.add('hidden');

    if (!usuarioLogado) {
        // Visitante vê o catálogo de tarólogos
        viewCliente.classList.remove('hidden');
        carregarTarologos();
        return;
    }

    if (usuarioLogado.perfil === 'admin') {
        viewAdmin.classList.remove('hidden');
    } else if (usuarioLogado.perfil === 'tarologo') {
        viewTarologo.classList.remove('hidden');
    } else {
        // Cliente padrão
        viewCliente.classList.remove('hidden');
        carregarTarologos();
    }
}

// 1. Carregar Tarólogos da API
async function carregarTarologos() {
    const grid = document.getElementById('grid-tarologos');
    try {
        const res = await fetch(`${API_URL}/tarologos`);
        const tarologos = await res.json();

        if (!Array.isArray(tarologos) || tarologos.length === 0) {
            grid.innerHTML = `<p style="color: var(--text-muted);">Nenhum tarólogo cadastrado no momento.</p>`;
            return;
        }

        grid.innerHTML = tarologos.map(t => `
            <div class="tarologo-card">
                <div>
                    <div class="tarologo-header">
                        <div class="avatar-placeholder">${(t.nome || 'T')[0]}</div>
                        <div>
                            <h3 class="tarologo-nome">${t.nome || 'Tarólogo(a)'}</h3>
                            <p class="tarologo-especialidade">Especialista em Tarot & Vidência</p>
                        </div>
                    </div>
                    <p class="tarologo-preco">R$ 150,00 / consulta</p>
                </div>
                <button onclick="contratarConsulta(${t.id || 1})" class="btn btn-outline" style="width: 100%;">
                    Agendar Consulta
                </button>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = `<p style="color: var(--danger);">Erro ao carregar tarólogos da API.</p>`;
    }
}

// 2. Autenticação (Login por Perfil)
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    const tipoPerfil = document.getElementById('login-tipo').value; // cliente, tarologo ou admin

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await res.json();

        if (res.ok) {
            tokenUsuario = data.token;
            usuarioLogado = { ...data.usuario, perfil: tipoPerfil };
            
            localStorage.setItem('token', tokenUsuario);
            localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
            
            fecharModalLogin();
            verificarSessao();
        } else {
            alert(`Erro: ${data.mensagem}`);
        }
    } catch (err) {
        alert('Erro ao tentar conectar com a API de login.');
    }
});

function verificarSessao() {
    const infoSpan = document.getElementById('usuario-info');
    const btnLogin = document.getElementById('btn-login');

    if (tokenUsuario && usuarioLogado) {
        infoSpan.textContent = `👤 ${usuarioLogado.email} (${usuarioLogado.perfil})`;
        infoSpan.classList.remove('hidden');
        btnLogin.textContent = 'Sair';
        btnLogin.onclick = logout;
    } else {
        infoSpan.classList.add('hidden');
        btnLogin.textContent = 'Entrar / Cadastrar';
        btnLogin.onclick = abrirModalLogin;
    }

    renderizarTelaPorPerfil();
}

function logout() {
    localStorage.clear();
    tokenUsuario = null;
    usuarioLogado = null;
    verificarSessao();
    window.location.reload();
}

// Modais
function abrirModalLogin() { document.getElementById('modal-login').classList.remove('hidden'); }
function fecharModalLogin() { document.getElementById('modal-login').classList.add('hidden'); }

function abrirModalChat(idConsulta) {
    document.getElementById('modal-chat').classList.remove('hidden');
    if (socket) {
        socket.emit('entrar_sala', idConsulta);
    }
}
function fecharModalChat() { document.getElementById('modal-chat').classList.add('hidden'); }

function contratarConsulta(idTarologo) {
    if (!tokenUsuario) {
        alert('Você precisa fazer login como cliente para agendar uma consulta!');
        abrirModalLogin();
        return;
    }
    alert('Consulta agendada com sucesso! Abrindo sala de atendimento...');
    abrirModalChat(1);
}

// 3. WebSockets
function inicializarSocket() {
    socket = io();

    socket.on('receber_mensagem', (data) => {
        const chatMessages = document.getElementById('chat-messages');
        const msgDiv = document.createElement('div');
        msgDiv.style.marginBottom = '0.75rem';
        msgDiv.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--primary);"><b>${data.emissor}</b> <span style="font-size: 0.7rem; color: var(--text-muted);">${data.horario}</span></div>
            <div style="font-size: 0.9rem; background: var(--bg-header); padding: 0.5rem 0.75rem; border-radius: 6px; margin-top: 0.2rem; border: 1px solid var(--border);">${data.mensagem}</div>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

document.getElementById('form-chat-mensagem').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    const mensagem = input.value.trim();

    if (mensagem && socket) {
        socket.emit('enviar_mensagem', {
            idConsulta: 1,
            emissor: usuarioLogado ? usuarioLogado.email.split('@')[0] : 'Usuário',
            mensagem
        });
        input.value = '';
    }
});