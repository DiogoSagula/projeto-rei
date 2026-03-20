<?php
// Inicia a sessão de forma segura
session_start();

// 1. PARTE PHP: Recebe os dados do JavaScript e valida no Banco
$json = file_get_contents("php://input");
$dados = json_decode($json, true);

if ($dados) {
    header("Content-Type: application/json");
    require 'conexao.php'; // Chama a conexão que criamos no passo anterior

    $usuario_tentativa = $dados['usuario'];
    $senha_tentativa = $dados['senha'];

    // Prepara a consulta para evitar Invasões (SQL Injection)
    $sql = "SELECT id, usuario, senha FROM usuarios WHERE usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $usuario_tentativa);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        $usuario_banco = $resultado->fetch_assoc();
        
        // Verifica se a senha bate com o Hash criptografado do banco
        if (password_verify($senha_tentativa, $usuario_banco['senha'])) {
            session_regenerate_id(true); 
            $_SESSION['logado'] = true;
            $_SESSION['usuario_nome'] = $usuario_banco['usuario'];

            echo json_encode(["sucesso" => true, "nome" => $usuario_banco['usuario']]);
        } else {
            echo json_encode(["sucesso" => false, "erro" => "Senha incorreta."]);
        }
    } else {
        echo json_encode(["sucesso" => false, "erro" => "Usuário não encontrado."]);
    }
    exit(); // Se foi uma tentativa de login, para de rodar a página aqui.
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Rei do Compensado</title>

    <link rel="stylesheet" href="assets/css/login.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body>

    <div class="login-container">
        <img src="assets/img/logo-rei.png" alt="Logo Rei do Compensado" class="login-logo">
        
        <h2>Acesso ao Painel de Gestão</h2>
        
        <form id="login-form"> 
            <div class="input-group">
                <label for="usuario">Usuário</label>
                <i class="fas fa-user"></i>
                <input type="text" id="usuario" name="usuario" placeholder="Digite seu nome de usuário" required>
            </div>
            
            <div class="input-group">
                <label for="password">Senha</label>
                <i class="fas fa-lock"></i>
                <input type="password" id="password" name="password" placeholder="Digite sua senha" required>
                <i class="fas fa-eye" id="togglePassword" style="cursor: pointer;"></i>
            </div>

            <p id="error-message" class="error-message" style="margin-top: 10px; font-weight: bold;"></p>
            
            <div class="options">
                <label class="remember-me">
                    <input type="checkbox" name="remember"> Lembrar-me
                </label>
                <a href="#">Esqueci minha senha</a>
            </div>
            
            <button type="submit" class="login-button">Entrar</button>
        </form>
    </div>

    <script src="assets/js/login.js"></script>

</body>
</html>