<?php
require 'conexao.php'; // Usa a sua conexão que já está funcionando

// A senha que vamos cadastrar
$senha_desejada = "123";

// O PHP gera a criptografia correta e atualizada
$senha_segura = password_hash($senha_desejada, PASSWORD_DEFAULT);

// Atualiza a senha lá no seu banco de dados
$sql = "UPDATE usuarios SET senha = ? WHERE usuario = 'diogo'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $senha_segura);

if ($stmt->execute()) {
    echo "<h1 style='color: green;'>Sucesso!</h1>";
    echo "<p>A senha do usuário <b>diogo</b> foi atualizada para <b>123</b> no banco de dados.</p>";
    echo "<a href='login.php'>Voltar para o Login</a>";
} else {
    echo "Erro: " . $conn->error;
}
?>