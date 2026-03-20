<?php
// salvar_ordem.php
header("Content-Type: application/json"); 
require 'conexao.php'; 

$json = file_get_contents("php://input");
$dados = json_decode($json, true);

if ($dados) {
    // 1. Extrai as variáveis que chegaram do JS
    $cliente = $dados['cliente'];
    $descricao = $dados['descricao'];
    $material = $dados['material'];
    $espessura = $dados['espessura'];
    $arquivo_base64 = $dados['arquivoData']; 
    $arquivo_nome = $dados['arquivoNome'];
    
    // 2. Prepara a Query (Proteção contra SQL Injection usando o '?')
    $sql = "INSERT INTO ordens (cliente, descricao, material, espessura, arquivo_base64, arquivo_nome, data_envio) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    
    // Liga as 6 Strings aos parâmetros
    $stmt->bind_param("ssssss", $cliente, $descricao, $material, $espessura, $arquivo_base64, $arquivo_nome);

    // 3. Executa a inserção
    if ($stmt->execute()) {
        echo json_encode(["sucesso" => true, "id" => $conn->insert_id]);
    } else {
        echo json_encode(["sucesso" => false, "erro" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["sucesso" => false, "erro" => "Nenhum dado recebido pelo servidor."]);
}

$conn->close();
?>