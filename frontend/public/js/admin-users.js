// admin-users.js
// Script para gerenciar a tela de usuários do admin

(function() {
    // Utilizar localStorage para simulação
    const LS_KEY = 'agendai_users';
    const LS_EMPRESAS = 'agendai_companies';

    // Utilitário para gerar ID
    function gerarId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    // Carregar empresas para o select
    function carregarEmpresasSelect() {
        const select = document.getElementById('usuarioEmpresa');
        if (!select) return;
        select.innerHTML = '<option value="">Selecione uma empresa</option>';
        let empresas = [];
        try {
            empresas = JSON.parse(localStorage.getItem(LS_EMPRESAS)) || [];
        } catch {}
        empresas.forEach(emp => {
            const opt = document.createElement('option');
            opt.value = emp.id;
            opt.textContent = emp.name;
            select.appendChild(opt);
        });
    }

    // Carregar usuários na tabela
    function carregarUsuarios() {
        const tbody = document.querySelector('#tabelaUsuarios tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem(LS_KEY)) || [];
        } catch {}
        let empresas = [];
        try {
            empresas = JSON.parse(localStorage.getItem(LS_EMPRESAS)) || [];
        } catch {}
        usuarios.forEach(usuario => {
            const empresa = empresas.find(e => e.id == usuario.empresaId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${empresa ? empresa.name : '-'}</td>
                <td>${usuario.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" data-edit="${usuario.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" data-del="${usuario.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Abrir modal para novo usuário
    function abrirModalNovo() {
        document.getElementById('modalUsuarioLabel').textContent = 'Novo Usuário';
        document.getElementById('formUsuario').reset();
        document.getElementById('usuarioId').value = '';
        carregarEmpresasSelect();
        const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
        modal.show();
    }

    // Abrir modal para editar usuário
    function abrirModalEditar(id) {
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem(LS_KEY)) || [];
        } catch {}
        const usuario = usuarios.find(u => u.id == id);
        if (!usuario) return;
        document.getElementById('modalUsuarioLabel').textContent = 'Editar Usuário';
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('usuarioNome').value = usuario.nome;
        document.getElementById('usuarioEmail').value = usuario.email;
        document.getElementById('usuarioSenha').value = usuario.senha;
        carregarEmpresasSelect();
        document.getElementById('usuarioEmpresa').value = usuario.empresaId;
        document.getElementById('usuarioStatus').value = usuario.status;
        const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
        modal.show();
    }

    // Salvar usuário (novo ou edição)
    function salvarUsuario() {
        const id = document.getElementById('usuarioId').value;
        const nome = document.getElementById('usuarioNome').value.trim();
        const email = document.getElementById('usuarioEmail').value.trim();
        const senha = document.getElementById('usuarioSenha').value;
        const empresaId = document.getElementById('usuarioEmpresa').value;
        const status = document.getElementById('usuarioStatus').value;
        if (!nome || !email || !senha || !empresaId || !status) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem(LS_KEY)) || [];
        } catch {}
        if (id) {
            // Editar
            const idx = usuarios.findIndex(u => u.id == id);
            if (idx >= 0) {
                usuarios[idx] = { id, nome, email, senha, empresaId, status };
            }
        } else {
            // Novo
            usuarios.push({ id: gerarId(), nome, email, senha, empresaId, status });
        }
        localStorage.setItem(LS_KEY, JSON.stringify(usuarios));
        bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
        carregarUsuarios();
    }

    // Excluir usuário
    function excluirUsuario(id) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem(LS_KEY)) || [];
        } catch {}
        usuarios = usuarios.filter(u => u.id != id);
        localStorage.setItem(LS_KEY, JSON.stringify(usuarios));
        carregarUsuarios();
    }

    // Eventos
    function conectarEventoBotaoNovoUsuario() {
        const btn = document.getElementById('btnNovoUsuario');
        if (btn) {
            btn.onclick = null;
            btn.addEventListener('click', function() {
                document.getElementById('modalUsuarioLabel').textContent = 'Novo Usuário';
                document.getElementById('formUsuario').reset();
                document.getElementById('usuarioId').value = '';
                carregarEmpresasSelect();
                // Não abrir o modal via JS, pois o Bootstrap já faz isso pelo data-bs-toggle/data-bs-target
            }, { once: false });
        }
    }

    // Atualizar select de empresas automaticamente quando houver alteração no localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === LS_EMPRESAS) {
            carregarEmpresasSelect();
        }
    });

    // Observer para detectar mudanças locais (mesmo sem reload)
    let lastEmpresas = localStorage.getItem(LS_EMPRESAS);
    setInterval(function() {
        const atual = localStorage.getItem(LS_EMPRESAS);
        if (atual !== lastEmpresas) {
            lastEmpresas = atual;
            carregarEmpresasSelect();
        }
    }, 1500);

    document.addEventListener('DOMContentLoaded', function() {
        carregarUsuarios();
        conectarEventoBotaoNovoUsuario();
        document.getElementById('btnSalvarUsuario').onclick = salvarUsuario;
        document.querySelector('#tabelaUsuarios tbody').onclick = function(e) {
            if (e.target.closest('[data-edit]')) {
                abrirModalEditar(e.target.closest('[data-edit]').getAttribute('data-edit'));
            } else if (e.target.closest('[data-del]')) {
                excluirUsuario(e.target.closest('[data-del]').getAttribute('data-del'));
            }
        };
    });
})(); 