<?php
// Função simples para carregar as variáveis do arquivo .env para o PHP
function carregarEnv($caminho) {
    if (!file_exists($caminho)) {
        return false;
    }

    $linhas = file($caminho, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($linhas as $linha) {
        // Ignora linhas que são comentários
        if (strpos(trim($linha), '#') === 0) {
            continue;
        }

        // Divide a linha entre NOME e VALOR
        if (strpos($linha, '=') !== false) {
            list($nome, $valor) = explode('=', $linha, 2);
            $nome = trim($nome);
            $valor = trim($valor);

            // Define a variável de ambiente no PHP
            putenv("$nome=$valor");
            $_ENV[$nome] = $valor;
        }
    }
}

// Carrega o arquivo .env da raiz do projeto
carregarEnv(__DIR__ . '/.env');

// Agora usamos as variáveis carregadas do .env
$host    = getenv('DB_HOST');
$usuario = getenv('DB_USER');
$senha   = getenv('DB_PASS');
$banco   = getenv('DB_NAME');

// Cria a conexão usando MySQLi (como você já estava usando)
$conn = new mysqli($host, $usuario, $senha, $banco);

// Verifica se houve erro
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>