<?php
// listar_ordens.php
header("Content-Type: application/json");
require 'conexao.php'; // Usa a conexão do projeto novo

// Busca as ordens da mais nova para a mais antiga
$sql = "SELECT id, cliente, descricao, material, espessura, status, data_envio, arquivo_nome, arquivo_base64 
        FROM ordens 
        ORDER BY created_at DESC";

$result = $conn->query($sql);

$ordens = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Formata a data do banco (2026-03-18) para o padrão BR (18/03/2026)
        $dataOriginal = $row['data_envio'];
        $row['data'] = date("d/m/Y", strtotime($dataOriginal));
        
        // Mapeamento de texto do status para ficar bonito na tela verde/amarela/roxa
        switch ($row['status']) {
            case 'recebido': $row['statusTexto'] = "Pedido Recebido"; break;
            case 'aguardando': $row['statusTexto'] = "Aguardando Produção"; break;
            case 'produzindo': $row['statusTexto'] = "Produzindo"; break;
            case 'pronto': $row['statusTexto'] = "Pronto"; break;
            case 'retirado': $row['statusTexto'] = "Retirado ou Encaminhado"; break;
            default: $row['statusTexto'] = ucfirst($row['status']);
        }

        // Adiciona "#" e preenche com zeros no ID (Ex: #0015)
        $row['id_visual'] = "#" . str_pad($row['id'], 4, "0", STR_PAD_LEFT);

        // Prepara o link do anexo se existir
        if ($row['arquivo_base64']) {
            $row['arquivoData'] = $row['arquivo_base64'];
        }

        $ordens[] = $row;
    }
}

echo json_encode($ordens);
$conn->close();
?>