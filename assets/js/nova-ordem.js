// Arquivo: /assets/js/nova-ordem.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nova-ordem-form');
    const fileInput = document.getElementById('plano-corte');
    const submitButton = form.querySelector('button[type="submit"]');

    // 1. Validação de Arquivo
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert("O arquivo é muito grande! O limite é 5MB.");
                this.value = "";
                return;
            }
            const fileName = file.name.toLowerCase();
            if (!fileName.endsWith('.pdf') && !fileName.endsWith('.dxf')) {
                alert("Apenas arquivos PDF ou DXF são permitidos.");
                this.value = "";
            }
        }
    });

    // 2. O Envio do Formulário 
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        submitButton.textContent = "Processando...";
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#ccc";

        const file = fileInput.files[0];

        // Agora passamos o arquivo real direto para a função, sem FileReader!
        if (file) {
            salvarOrdem(file);
        } else {
            salvarOrdem(null);
        }
    });

    // 3. Função de Salvar 
    function salvarOrdem(arquivoOriginal) {
        // Cria um formulário invisível no JS
        const formData = new FormData();
        
        formData.append('cliente', document.getElementById('cliente').value);
        formData.append('descricao', document.getElementById('descricao').value);
        
        const materialSelect = document.getElementById('material');
        formData.append('material', materialSelect.options[materialSelect.selectedIndex].text);
        
        const espessuraSelect = document.getElementById('espessura');
        formData.append('espessura', espessuraSelect.options[espessuraSelect.selectedIndex].text);

        // Adiciona o arquivo real. O navegador já sabe o nome e o tipo do arquivo automaticamente.
        if (arquivoOriginal) {
            formData.append('arquivo', arquivoOriginal);
        }

        // Apenas UM fetch, enviando o FormData limpo
        fetch('salvar_ordem.php', {
            method: 'POST',
            body: formData 
        })
        .then(response => response.json()) 
        .then(resultado => {
            if (resultado.sucesso) {
                alert(`Sucesso! Ordem #${resultado.id} salva no Banco de Dados.`);
                window.location.href = 'index.php';
            } else {
                alert('Erro ao salvar: ' + resultado.erro);
                resetarBotao();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro de conexão. Verifique se o XAMPP está ligado.');
            resetarBotao();
        });
    }

    function resetarBotao() {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar Ordem de Serviço";
        submitButton.style.backgroundColor = ""; 
    }
});