// Arquivo: /assets/js/login.js

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const userInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('error-message');
    const rememberCheckbox = document.querySelector('input[name="remember"]');

    // 1. Verifica se tem usuário salvo no "Lembrar-me"
    const salvoUsuario = localStorage.getItem('usuarioLembrado');
    if (salvoUsuario) {
        userInput.value = salvoUsuario;
        rememberCheckbox.checked = true;
    }

    // 2. Mostrar/Esconder Senha
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // 3. Login CONECTADO AO BANCO
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const usuarioDigitado = userInput.value.trim();
        const senhaDigitada = passwordInput.value.trim();

        // Limpa mensagem de erro antiga
        errorMessage.textContent = "Verificando...";
        errorMessage.style.color = "#666";

        fetch('login.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                usuario: usuarioDigitado, 
                senha: senhaDigitada 
            })
        })
        .then(response => response.json())
        .then(resultado => {
            if (resultado.sucesso) {
                // Lógica do "Lembrar-me"
                if (rememberCheckbox.checked) {
                    localStorage.setItem('usuarioLembrado', usuarioDigitado);
                } else {
                    localStorage.removeItem('usuarioLembrado');
                }

                // Salva sessão para o Header usar
                sessionStorage.setItem('usuarioLogado', resultado.nome);

                errorMessage.style.color = "green";
                errorMessage.textContent = "Login autorizado! Entrando...";
                
                setTimeout(() => {
                    // ATUALIZADO AQUI PARA .PHP
                    window.location.href = 'index.php';
                }, 800);

            } else {
                // ERRO (Senha ou Usuário errados)
                errorMessage.style.color = "#ef4444";
                errorMessage.textContent = resultado.erro;
                
                // Animaçãozinha de erro
                loginForm.classList.add('shake');
                setTimeout(() => loginForm.classList.remove('shake'), 500);
            }
        })
        .catch(error => {
            console.error(error);
            errorMessage.textContent = "Erro de conexão com o servidor.";
        });
    });
});