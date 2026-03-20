// Arquivo: /assets/js/global.js

// 1. VERIFICA O TEMA SALVO IMEDIATAMENTE 
const temaSalvo = localStorage.getItem('temaReiCompensado');
if (temaSalvo === 'escuro') {
    document.body.classList.add('dark-mode');
}

document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("header-container");

    // 2. Carrega o Header
    if (headerContainer) {
        fetch("assets/components/header.php")
            .then(response => {
                if (!response.ok) throw new Error("Falha ao carregar o menu");
                return response.text();
            })
            .then(data => {
                headerContainer.innerHTML = data;
                highlightActiveLink(); 
                configurarBotaoTema(); 
                
                // --- NOVIDADE AQUI: Inicia os links suaves depois que o menu existe ---
                configurarLinksSuaves(); 
            })
            .catch(erro => console.error(erro));
    }
});

// --- FUNÇÃO PARA TRANSIÇÃO DE PÁGINAS SEM PISCAR ---
function configurarLinksSuaves() {
    // Pega todos os links dentro do menu principal
    const linksMenu = document.querySelectorAll('.portal-nav a');

    linksMenu.forEach(link => {
        link.addEventListener('click', function(evento) {
            // Se o usuário clicar na página que ele JÁ ESTÁ, não faz nada
            if (this.classList.contains('active')) return;

            // 1. Impede o navegador de mudar de página na mesma hora
            evento.preventDefault(); 
            
            // Guarda o destino do link (ex: relatorios.php)
            const destino = this.href;

            // 2. Adiciona a classe que faz a tela sumir suavemente
            document.body.classList.add('saindo-da-pagina');

            // 3. Espera 300 milissegundos (o tempo da animação do CSS) e aí sim muda a página
            setTimeout(() => {
                window.location.href = destino;
            }, 150);
        });
    });
}

// --- FUNÇÃO DO BOTÃO SOL E LUA ---
function configurarBotaoTema() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const isDark = document.body.classList.contains('dark-mode');
    toggleBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const ficouEscuro = document.body.classList.contains('dark-mode');
        localStorage.setItem('temaReiCompensado', ficouEscuro ? 'escuro' : 'claro');
        toggleBtn.innerHTML = ficouEscuro ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}

// Função para destacar o link da página atual
function highlightActiveLink() {
    const path = window.location.pathname;
    const page = path.split("/").pop(); 

    let activeId = "";
    if (page === "index.php" || page === "") activeId = "link-home";
    if (page === "nova-ordem.php") activeId = "link-nova";
    if (page === "relatorios.php") activeId = "link-relatorios"; 

    if (activeId) {
        const link = document.getElementById(activeId);
        if (link) link.classList.add("active"); 
    }
}

// Função de Deslogar
function logout() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = "login.php";
}