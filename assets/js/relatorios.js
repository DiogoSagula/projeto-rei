document.addEventListener('DOMContentLoaded', () => {
    // 1. VARIÁVEL GLOBAL PARA GUARDAR AS ORDENS
    let ordens = [];

    // 2. BUSCAR DADOS DO BANCO (Substituindo o LocalStorage)
    function carregarDadosDosRelatorios() {
        fetch('listar_ordens.php')
            .then(response => {
                if (!response.ok) throw new Error("Erro na rede");
                return response.json();
            })
            .then(dados => {
                ordens = dados; // Salva os dados na memória
                atualizarContadores(ordens); // Atualiza os números nos cards
            })
            .catch(error => {
                console.error("Erro ao carregar relatórios:", error);
                // Caso dê erro, pelo menos não quebra a tela, só zera os contadores
                atualizarContadores([]); 
            });
    }

    // Inicia a busca assim que a página carregar
    carregarDadosDosRelatorios();

    // 3. CONFIGURAR MODAL
    const modal = document.getElementById('modal-lista-pedidos');
    const btnFechar = modal.querySelector('.modal-close');
    const tbody = document.getElementById('lista-pedidos-body');
    const tituloModal = document.getElementById('modal-titulo-lista');

    // Funções para fechar o modal
    const fecharModal = () => modal.classList.add('hidden');
    btnFechar.addEventListener('click', fecharModal);
    
    // Fecha se clicar fora do conteúdo do modal (na parte escura)
    modal.addEventListener('click', (e) => {
        if(e.target === modal) fecharModal();
    });

    // 4. ADICIONAR CLIQUE NOS CARDS
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', () => {
            const statusAlvo = card.getAttribute('data-status');
            const nomeStatus = card.querySelector('.card-title').textContent;
            
            abrirListaDePedidos(statusAlvo, nomeStatus);
        });
    });

    // --- FUNÇÕES AUXILIARES ---

    function atualizarContadores(lista) {
        const contagem = {
            recebido: 0,
            aguardando: 0,
            produzindo: 0,
            pronto: 0,
            retirado: 0
        };

        lista.forEach(ordem => {
            if (contagem.hasOwnProperty(ordem.status)) {
                contagem[ordem.status]++;
            } else if (ordem.status === 'retirado') {
                contagem.retirado++;
            }
        });

        document.getElementById('recebido-valor').textContent = contagem.recebido || 0;
        document.getElementById('aguardando-valor').textContent = contagem.aguardando || 0;
        document.getElementById('produzindo-valor').textContent = contagem.produzindo || 0;
        document.getElementById('pronto-valor').textContent = contagem.pronto || 0;
        document.getElementById('finalizado-valor').textContent = contagem.retirado || 0;
    }

    function abrirListaDePedidos(status, titulo) {
        const pedidosFiltrados = ordens.filter(ordem => ordem.status === status);

        tituloModal.textContent = `${titulo} (${pedidosFiltrados.length})`;
        tbody.innerHTML = '';

        if (pedidosFiltrados.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 20px; color: #64748b;">Nenhum pedido encontrado.</td></tr>`;
        } else {
            pedidosFiltrados.forEach(pedido => {
                const tr = document.createElement('tr');
                
                // Trata campos que podem estar vazios
                const cliente = pedido.cliente || '---';
                
                tr.innerHTML = `
                    <td style="font-weight: bold; color: #0f172a;">${pedido.id_visual || pedido.id}</td>
                    <td>${cliente}</td>
                    <td>${pedido.descricao}</td>
                    <td>${pedido.data}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        modal.classList.remove('hidden');
    }
});