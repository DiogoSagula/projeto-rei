document.addEventListener('DOMContentLoaded', () => {
    
    // Lista global para guardar as ordens carregadas
    let listaDeOrdens = [];

    const tableBody = document.getElementById('orders-table-body');
    const noResultsRow = document.getElementById('no-results-row');

    // --- 1. CARREGAR DADOS DO BANCO (BACKEND) ---
    function carregarOrdens() {
        // Chama o arquivo PHP que lê o banco
        fetch('listar_ordens.php')
            .then(response => response.json())
            .then(dados => {
                listaDeOrdens = dados; // Guarda na memória
                renderizarTabela(listaDeOrdens);
                
                // Removido o truque do localStorage! Agora o relatorios.js faz o próprio fetch.
            })
            .catch(error => {
                console.error('Erro ao buscar ordens:', error);
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Erro de conexão com o Banco de Dados.</td></tr>';
            });
    }

    // --- 2. DESENHAR A TABELA ---
    function renderizarTabela(ordens) {
        // Limpa a tabela
        tableBody.innerHTML = ''; 
        tableBody.appendChild(noResultsRow);

        if (ordens.length === 0) {
            noResultsRow.style.display = 'table-row';
            return;
        }

        noResultsRow.style.display = 'none';

        ordens.forEach(ordem => {
            const tr = document.createElement('tr');
            
            // Cria a linha HTML
            tr.innerHTML = `
                <td><strong>${ordem.id_visual}</strong></td>
                <td>${ordem.descricao}</td>
                <td>${ordem.data}</td>
                <td><span class="status status-${ordem.status}">${ordem.statusTexto}</span></td>
                <td>
                    <button class="details-button" data-id="${ordem.id}">Ver Detalhes</button>
                </td>
            `;
            // Insere na tabela
            tableBody.insertBefore(tr, noResultsRow);
        });

        adicionarEventosBotoes();
    }

    // --- 3. MODAL DE DETALHES ---
    const modalOverlay = document.getElementById('order-details-modal');
    const btnFecharModal = document.querySelector('.modal-close');
    
    function abrirModal(idReal) {
        const ordem = listaDeOrdens.find(o => o.id == idReal);
        if (!ordem) return;

        // Preenche os textos básicos
        document.getElementById('modal-title').textContent = `Ordem ${ordem.id_visual}`;
        document.getElementById('modal-description').textContent = ordem.descricao;
        document.getElementById('modal-date').textContent = ordem.data;
        document.getElementById('modal-status-select').value = ordem.status;

        // SEGURANÇA: Guarda o ID real direto nos botões de ação do Modal
        document.querySelector('.save-status-button-modal').setAttribute('data-id', idReal);
        document.getElementById('delete-order-button').setAttribute('data-id', idReal);

        // --- LÓGICA DO ANEXO (COM PROTEÇÃO) ---
        const areaAnexo = document.getElementById('area-anexo');
        const linkDownload = document.getElementById('btn-download-anexo');

        // Só tenta mexer no anexo se os elementos existirem no HTML
        if (areaAnexo && linkDownload) {
            if (ordem.arquivo_nome) {
                areaAnexo.style.display = 'flex';
                // Assumindo que o PHP retorna o Base64 completo em arquivoData
                linkDownload.href = ordem.arquivoData; 
                linkDownload.download = ordem.arquivo_nome;
                linkDownload.textContent = `Baixar ${ordem.arquivo_nome}`;
            } else {
                areaAnexo.style.display = 'none';
            }
        }
        // ---------------------------------------

        modalOverlay.classList.remove('hidden');
    }

    function fecharModal() {
        modalOverlay.classList.add('hidden');
    }

    btnFecharModal.addEventListener('click', fecharModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) fecharModal();
    });

    function adicionarEventosBotoes() {
        document.querySelectorAll('.details-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                abrirModal(id);
            });
        });
    }

    // --- 4. FILTROS ---
    document.getElementById('filter-button').addEventListener('click', () => {
        const termo = document.getElementById('search-input').value.toLowerCase();
        const status = document.getElementById('status-filter').value;

        const filtrados = listaDeOrdens.filter(o => {
            const textoMatch = o.id_visual.toLowerCase().includes(termo) || 
                               o.descricao.toLowerCase().includes(termo);
            const statusMatch = status === "" || o.status === status;
            return textoMatch && statusMatch;
        });

        renderizarTabela(filtrados);
    });

    // INICIALIZAÇÃO
    carregarOrdens(); // Agora busca do PHP!

    // --- LÓGICA DE SALVAR STATUS ---
    const btnSalvar = document.querySelector('.save-status-button-modal');
    
    btnSalvar.addEventListener('click', (e) => {
        // Agora pegamos o ID de forma 100% segura, direto do botão!
        const idReal = e.target.getAttribute('data-id'); 
        const novoStatus = document.getElementById('modal-status-select').value;

        fetch('atualizar_status.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: idReal, status: novoStatus })
        })
        .then(r => r.json())
        .then(res => {
            if(res.sucesso) {
                fecharModal();    // Fecha a janela
                carregarOrdens(); // Atualiza a tabela na hora
            } else {
                alert('Erro ao atualizar.');
            }
        });
    });

    // --- LÓGICA DE EXCLUIR ---
    const btnExcluir = document.getElementById('delete-order-button');

    btnExcluir.addEventListener('click', (e) => {
        if(!confirm("Tem certeza que deseja apagar esta ordem do banco de dados?")) return;

        // Agora pegamos o ID de forma 100% segura, direto do botão!
        const idReal = e.target.getAttribute('data-id'); 

        fetch('excluir_ordem.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: idReal })
        })
        .then(r => r.json())
        .then(res => {
            if(res.sucesso) {
                fecharModal();
                carregarOrdens(); 
            } else {
                alert('Erro ao excluir: ' + res.erro);
            }
        });
    });

});