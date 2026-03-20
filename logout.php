<?php
// Inicia a sessão para o PHP saber qual usuário ele precisa desconectar
session_start();

// Limpa todas as variáveis da sessão (apaga o seu nome e o status de logado da memória)
session_unset();

// Destrói a sessão completamente no servidor
session_destroy();

// Redireciona você de volta para a tela de login
header("Location: login.php");
exit();
?>