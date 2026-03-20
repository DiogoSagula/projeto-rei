<?php
// O trava.php já deve ter sido chamado no arquivo pai (ex: index.php), 
// mas por segurança, garantimos que a sessão existe para exibir o nome.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<header class="portal-header">
    <div class="container header-container">
        <div class="logo">
            <img src="assets/img/logo-rei.png" alt="Rei do Compensado">
        </div>
        
        <div class="user-info">
    <button id="theme-toggle" class="theme-toggle-btn" title="Alternar Tema">
        <i class="fa-solid fa-moon"></i> 
    </button>
    

        <div class="user-info">
            <span>Olá, <strong><?php echo htmlspecialchars($_SESSION['usuario_nome'] ?? 'Usuário'); ?></strong></span>
            <a href="logout.php" class="logout-button" title="Sair">
                Sair <i class="fas fa-sign-out-alt"></i>
            </a>
        </div>
    </div>
</header>

<nav class="portal-nav">
    <div class="container">
        <ul>
            <li>
                <a href="index.php" id="link-home">
                    <i class="fas fa-chart-line"></i> Dashboard
                </a>
            </li>
            <li>
                <a href="nova-ordem.php" id="link-nova">
                    <i class="fas fa-plus-circle"></i> Nova Ordem
                </a>
            </li>
            <li>
                <a href="relatorios.php" id="link-relatorios">
                    <i class="fas fa-file-alt"></i> Relatórios
                </a>
            </li>
        </ul>
    </div>
</nav>