// public/js/app.js

const API_URL = 'http://localhost:3000';
let socket;
let tokenUsuario = localStorage.getItem('token');
let usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
let modoCadastro = false; // Controla se a modal está em modo Login ou Cadastro

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    verificarSessao();
    inicializarSocket();
    configurarEventosDOM();
});

// Configuração segura de eventos (evita bloqueios de CSP do navegador)
function configurarEventosDOM() {
    const btnLoginNav = document.getElementById('btn-login');
    if (btnLoginNav) {
        btnLoginNav.addEventListener('click', () => {
            if (tokenUsuario) {
                logout();
            } else {
                abrirModalLogin();
            }
        });
    }

    const btnFechar = document.getElementById('btn-fechar-modal');
    if (btnFechar) btnFechar.addEventListener('click', fecharModalLogin);

    const btnOlhinho = document.getElementById('btn-toggle-senha');
    if (btnOlhinho) {
        btnOlhinho.addEventListener('click', () => {
            const inputSenha = document.getElementById('login-senha');
            if (inputSenha) {
                inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password';
            }
        });
    }

    const linkAlternar = document.getElementById('link-alternar-modo');
    if (linkAlternar) {
        linkAlternar.addEventListener('click', (e) => {
            e.preventDefault();
            modoCadastro = !modoCadastro;
            atualizarModoModal();
        });
    }

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', lidarComSubmissaoAuth);
    }
}

function atualizarModoModal() {
    const titulo = document.getElementById('modal-titulo');
    const grupoNome = document.getElementById('grupo-nome');
    const grupoTipoCadastro = document.getElementById('grupo-tipo-cadastro');
    const btnSubmit = document.getElementById('btn-submit-auth');
    const textoAlternancia = document.getElementById('texto-alternancia');
    const linkAlternar = document.getElementById('link-alternar-modo');

    if (modoCadastro) {
        if (titulo) titulo.textContent = 'Criar Nova Conta';
        if (grupoNome) grupoNome.style.display = 'block';
        if (grupoTipoCadastro) grupoTipoCadastro.style.display = 'block'; // Mostra seletor Cliente/Tarólogo
        if (btnSubmit) btnSubmit.textContent = 'Cadastrar';
        if (textoAlternancia) textoAlternancia.textContent = 'Já tem uma conta?';
        if (linkAlternar) linkAlternar.textContent = 'Faça login';
    } else {
        if (titulo) titulo.textContent = 'Acessar a Plataforma';
        if (grupoNome) grupoNome.style.display = 'none';
        if (grupoTipoCadastro) grupoTipoCadastro.style.display = 'none'; // Esconde no login
        if (btnSubmit) btnSubmit.textContent = 'Entrar';
        if (textoAlternancia) textoAlternancia.textContent = 'Não tem uma conta?';
        if (linkAlternar) linkAlternar.textContent = 'Cadastre-se';
    }
}

// Lidar com o cadastro direcionando para a rota correta (Cliente ou Tarólogo)
async function lidarComSubmissaoAuth(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    if (modoCadastro) {
        const nome = document.getElementById('cadastro-nome').value;
        const tipoEscolhido = document.getElementById('cadastro-tipo').value; // 'cliente' ou 'tarologo'

        // Define a rota de cadastro conforme a escolha do usuário
        const endpoint = tipoEscolhido === 'tarologo' ? `${API_URL}/tarologos` : `${API_URL}/clientes`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Conta criada com sucesso! Faça seu login agora.');
                modoCadastro = false;
                atualizarModoModal();
            } else {
                alert(`Erro no cadastro: ${data.mensagem}`);
            }
        } catch (err) {
            alert('Erro ao tentar conectar com a API de cadastro.');
        }
    } else {
        // Login automático
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await res.json();

            if (res.ok) {
                tokenUsuario = data.token;
                usuarioLogado = data.usuario;
                
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
    }
}

// Controle de Telas por Perfil
function renderizarTelaPorPerfil() {
    const viewCliente = document.getElementById('view-cliente');
    const viewTarologo = document.getElementById('view-tarologo');
    const viewAdmin = document.getElementById('view-admin');

    if (!viewCliente || !viewTarologo || !viewAdmin) return;

    viewCliente.classList.add('hidden');
    viewTarologo.classList.add('hidden');
    viewAdmin.classList.add('hidden');

    if (!usuarioLogado) {
        viewCliente.classList.remove('hidden');
        carregarTarologos();
        return;
    }

    const tipo = (usuarioLogado.tipo || usuarioLogado.perfil || '').toUpperCase();

    if (tipo === 'ADMIN') {
        viewAdmin.classList.remove('hidden');
        carregarEstatisticasAdmin();
    } else if (tipo === 'TAROLOGO') {
        viewTarologo.classList.remove('hidden');
        carregarEstatisticasTarologo();
    } else {
        viewCliente.classList.remove('hidden');
        carregarTarologos();
    }
}

// 1. Carregar Tarólogos da API
async function carregarTarologos() {
    const grid = document.getElementById('grid-tarologos');
    if (!grid) return;

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

// 2. Modais
function abrirModalLogin() {
    const modal = document.getElementById('modal-login');
    if (modal) modal.classList.remove('hidden');
}

function fecharModalLogin() {
    const modal = document.getElementById('modal-login');
    if (modal) modal.classList.add('hidden');
}

function abrirModalChat(idConsulta) {
    const modal = document.getElementById('modal-chat');
    if (modal) modal.classList.remove('hidden');
    if (socket) socket.emit('entrar_sala', idConsulta);
}

function fecharModalChat() {
    const modal = document.getElementById('modal-chat');
    if (modal) modal.classList.add('hidden');
}

// 3. Verificação de Sessão
function verificarSessao() {
    const infoSpan = document.getElementById('usuario-info');
    const btnLogin = document.getElementById('btn-login');

    if (tokenUsuario && usuarioLogado) {
        if (infoSpan) {
            infoSpan.textContent = `👤 ${usuarioLogado.email} (${usuarioLogado.tipo || usuarioLogado.perfil})`;
            infoSpan.classList.remove('hidden');
        }
        if (btnLogin) btnLogin.textContent = 'Sair';
    } else {
        if (infoSpan) infoSpan.classList.add('hidden');
        if (btnLogin) btnLogin.textContent = 'Entrar / Cadastrar';
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

// 4. Lidar com Login ou Cadastro via API de forma automática
async function lidarComSubmissaoAuth(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    if (modoCadastro) {
        // Cadastro automático de Cliente
        const nome = document.getElementById('cadastro-nome').value;
        try {
            const res = await fetch(`${API_URL}/clientes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Conta criada com sucesso! Faça seu login agora.');
                modoCadastro = false;
                atualizarModoModal();
            } else {
                alert(`Erro no cadastro: ${data.mensagem}`);
            }
        } catch (err) {
            alert('Erro ao tentar conectar com a API de cadastro.');
        }
    } else {
        // Login automático (O backend descobre se é Admin, Tarólogo ou Cliente pelo e-mail)
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await res.json();

            if (res.ok) {
                tokenUsuario = data.token;
                usuarioLogado = data.usuario; // O backend já retorna o tipo correto (ADMIN, TAROLOGO, CLIENTE)
                
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
    }
}

// Estatísticas reais via API
async function carregarEstatisticasAdmin() {
    try {
        const res = await fetch(`${API_URL}/admin/estatisticas`, {
            headers: { 'Authorization': `Bearer ${tokenUsuario}` }
        });
        if (!res.ok) return;
        const dados = await res.json();
        
        const elClientes = document.getElementById('admin-total-clientes');
        const elTarologos = document.getElementById('admin-total-tarologos');
        const elFaturamento = document.getElementById('admin-faturamento-global');

        if (elClientes) elClientes.textContent = dados.totalClientes;
        if (elTarologos) elTarologos.textContent = dados.totalTarologos;
        if (elFaturamento) elFaturamento.textContent = `R$ ${dados.faturamentoGlobal.toFixed(2).replace('.', ',')}`;
    } catch (err) {
        console.error('Erro ao buscar estatísticas do admin:', err);
    }
}

async function carregarEstatisticasTarologo() {
    try {
        const res = await fetch(`${API_URL}/tarologos/estatisticas`, {
            headers: { 'Authorization': `Bearer ${tokenUsuario}` }
        });
        if (!res.ok) return;
        const dados = await res.json();
        
        const elConsultas = document.getElementById('tarologo-consultas');
        const elLucro = document.getElementById('tarologo-lucro');
        const elFila = document.getElementById('tarologo-fila');

        if (elConsultas) elConsultas.textContent = dados.consultasRealizadas;
        if (elLucro) elLucro.textContent = `R$ ${dados.lucroAcumulado.toFixed(2).replace('.', ',')}`;
        if (elFila) elFila.textContent = dados.filaPendentes;
    } catch (err) {
        console.error('Erro ao buscar estatísticas do tarólogo:', err);
    }
}

function contratarConsulta(idTarologo) {
    if (!tokenUsuario) {
        alert('Você precisa fazer login como cliente para agendar uma consulta!');
        abrirModalLogin();
        return;
    }
    alert('Consulta agendada com sucesso! Abrindo sala de atendimento...');
    abrirModalChat(1);
}

// 5. WebSockets
function inicializarSocket() {
    socket = io();

    socket.on('receber_mensagem', (data) => {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

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

const formChat = document.getElementById('form-chat-mensagem');
if (formChat) {
    formChat.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const mensagem = input.value.trim();

        if (mensagem && socket) {
            socket.emit('enviar_mensagem', {
                idConsulta: 1,
                emissor: usuarioLogado ? (usuarioLogado.nome || usuarioLogado.email.split('@')[0]) : 'Usuário',
                mensagem
            });
            input.value = '';
        }
    });
}