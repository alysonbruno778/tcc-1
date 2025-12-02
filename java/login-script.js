// Alternar entre login e cadastro
// Quando clica em uma aba (Login ou Criar Conta)
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove classe 'active' de todas as abas
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        // Adiciona 'active' na aba clicada
        this.classList.add('active');
        
        // Pega qual aba foi clicada (login ou register)
        const tabId = this.getAttribute('data-tab');
        // Esconde todos os formulários
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        // Mostra o formulário correspondente à aba clicada
        document.getElementById(`${tabId}-form`).classList.add('active');
        
        // Reconfigura os botões de mostrar senha
        setupPasswordToggle();
    });
});

// Links para alternar entre formulários (texto no rodapé)
document.querySelector('.switch-to-register').addEventListener('click', function(e) {
    e.preventDefault(); // Impede comportamento padrão do link
    document.querySelector('.auth-tab[data-tab="register"]').click(); // Clica na aba de cadastro
});

document.querySelector('.switch-to-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.auth-tab[data-tab="login"]').click(); // Clica na aba de login
});

// Função para mostrar/esconder senha
function setupPasswordToggle() {
    // Para cada campo de senha na página
    document.querySelectorAll('.password-container').forEach(container => {
        const input = container.querySelector('input.form-control');
        if (!input) return;

        // Garante que o input tem um ID
        if (!input.id) {
            input.id = 'pwd-' + Math.random().toString(36).slice(2, 9); // Cria ID aleatório
        }

        // Remove botões duplicados no mesmo container
        const toggles = Array.from(container.querySelectorAll('.toggle-password'));
        if (toggles.length > 1) {
            toggles.slice(1).forEach(b => b.remove()); // Mantém só o primeiro
        }

        // Cria botão se não existir
        let button = container.querySelector('.toggle-password');
        if (!button) {
            button = document.createElement('button');
            button.type = 'button';
            button.className = 'toggle-password';
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');
            button.innerHTML = '<i class="fas fa-eye"></i>';
            container.appendChild(button);
        }

        // Configura atributos do botão
        button.setAttribute('data-target', input.id);
        // Garante que tem ícone
        if (!button.querySelector('i')) button.innerHTML = '<i class="fas fa-eye"></i>';

        // Configura acessibilidade com base no tipo atual do input
        if (input.type === 'password') {
            button.setAttribute('aria-label', 'Mostrar senha');
            button.setAttribute('title', 'Mostrar senha');
            button.setAttribute('aria-pressed', 'false'); // Não está mostrando
            const ic = button.querySelector('i');
            if (ic) { ic.classList.remove('fa-eye-slash'); ic.classList.add('fa-eye'); }
        } else {
            button.setAttribute('aria-label', 'Ocultar senha');
            button.setAttribute('title', 'Ocultar senha');
            button.setAttribute('aria-pressed', 'true'); // Está mostrando
            const ic = button.querySelector('i');
            if (ic) { ic.classList.remove('fa-eye'); ic.classList.add('fa-eye-slash'); }
        }

        // Adiciona eventos apenas uma vez
        if (!button.dataset.toggleBound) {
            const toggleFn = function(e) {
                if (e) { e.preventDefault(); e.stopPropagation(); }
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const icon = this.querySelector('i');

                if (!passwordInput) return;

                // Verifica se está mostrando ou escondendo
                const nowShowing = passwordInput.type !== 'password';

                if (!nowShowing) {
                    // Mostra a senha
                    passwordInput.type = 'text';
                    if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
                    this.setAttribute('title', 'Ocultar senha');
                    this.setAttribute('aria-label', 'Ocultar senha');
                    this.setAttribute('aria-pressed', 'true');
                } else {
                    // Esconde a senha
                    passwordInput.type = 'password';
                    if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
                    this.setAttribute('title', 'Mostrar senha');
                    this.setAttribute('aria-label', 'Mostrar senha');
                    this.setAttribute('aria-pressed', 'false');
                }
            };

            // Evento de clique
            button.addEventListener('click', toggleFn);
            // Evento de teclado (Enter ou Espaço)
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    toggleFn.call(this, e);
                }
            });

            button.dataset.toggleBound = '1'; // Marca como configurado
        }
    });
}

// Validação do formulário de LOGIN
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede envio padrão
    
    // Pega valores dos campos
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const button = this.querySelector('button[type="submit"]');
    const originalHTML = button.innerHTML;
    
    // Validações básicas
    if (!email || !password) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    // Simulação de login (sem backend)
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    button.disabled = true;
    
    // Espera 1 segundo (simula comunicação com servidor)
    setTimeout(() => {
        // Busca usuários salvos no localStorage
        const users = getUsers();
        // Procura usuário com email e senha correspondentes
        const found = users.find(u => u.email && u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);

        if (found) {
            // Login bem-sucedido
            button.innerHTML = '<i class="fas fa-check"></i> Login realizado!';
            button.style.background = '#4CAF50'; // Verde
            button.disabled = true;

            // Salva dados de sessão no localStorage
            const userData = {
                email: found.email,
                name: found.name || '',
                loggedIn: true, // Marca como logado
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('conectahub_user', JSON.stringify(userData));

            // Redireciona para página principal após 1.2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        } else {
            // Credenciais inválidas
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Credenciais inválidas';
            button.style.background = '#F44336'; // Vermelho

            // Restaura botão após 2 segundos
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }
    }, 1000);
});

// Validação do formulário de CADASTRO
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Pega valores dos campos
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const terms = document.getElementById('terms').checked; // Checkbox de termos
    const button = this.querySelector('button');
    const originalHTML = button.innerHTML;
    
    // Validações básicas
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Por favor, insira um email válido.', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }
    
    if(password !== confirmPassword) {
        showMessage('As senhas não coincidem!', 'error');
        return;
    }
    
    if(!terms) {
        showMessage('Você precisa aceitar os termos e condições!', 'error');
        // Destaca visualmente o checkbox
        const termsLabel = document.querySelector('label[for="terms"]');
        termsLabel.style.color = '#F44336';
        termsLabel.style.fontWeight = 'bold';
        
        // Remove destaque após 3 segundos
        setTimeout(() => {
            termsLabel.style.color = '';
            termsLabel.style.fontWeight = '';
        }, 3000);
        return;
    }
    
    // Simulação de cadastro
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    button.disabled = true;
    
    setTimeout(() => {
        // Busca usuários existentes
        const users = getUsers();
        // Verifica se email já existe
        const exists = users.find(u => u.email && u.email.toLowerCase() === (email || '').toLowerCase());
        if (exists) {
            showMessage('Já existe uma conta com este email. Faça login.', 'error');
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.disabled = false;
            return;
        }

        // Cria novo usuário
        const newUser = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            registered: true,
            timestamp: new Date().toISOString()
        };
        users.push(newUser);
        setUsers(users); // Salva no localStorage

        // Mensagem de sucesso
        button.innerHTML = '<i class="fas fa-check"></i> Conta criada!';
        button.style.background = '#4CAF50';

        setTimeout(() => {
            showMessage('Conta criada com sucesso! Redirecionando para login...', 'success');

            // Muda para aba de login
            document.querySelector('.auth-tab[data-tab="login"]').click();

            // Preenche automaticamente o email no formulário de login
            document.getElementById('login-email').value = email;

            // Restaura botão
            button.innerHTML = '<i class="fas fa-user-plus"></i> Criar Conta';
            button.style.background = '';
            button.disabled = false;
            document.getElementById('register-form').reset(); // Limpa formulário
        }, 900);
    }, 1000);
});

// Recuperação de senha (simples)
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Digite seu email para recuperação de senha:');
    if (email && isValidEmail(email)) {
        showMessage(`Instruções de recuperação enviadas para: ${email}`, 'success');
    } else if (email) {
        showMessage('Por favor, insira um email válido.', 'error');
    }
});

// Função para validar formato de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regex para email válido
    return emailRegex.test(email);
}

// Função para mostrar mensagens flutuantes
function showMessage(message, type = 'info') {
    // Remove mensagens existentes
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Cria nova mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message auth-message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${getMessageIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Estilos da mensagem
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getMessageColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Retorna ícone correto para tipo de mensagem
function getMessageIcon(type) {
    const icons = {
        success: 'check-circle',     // ✓
        error: 'exclamation-circle', // !
        warning: 'exclamation-triangle', // △
        info: 'info-circle'          // i
    };
    return icons[type] || 'info-circle';
}

// Retorna cor correta para tipo de mensagem
function getMessageColor(type) {
    const colors = {
        success: '#4CAF50', // Verde
        error: '#F44336',   // Vermelho
        warning: '#FF9800', // Laranja
        info: '#2196F3'     // Azul
    };
    return colors[type] || '#2196F3';
}

// Adiciona estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggle(); // Configura botões de mostrar senha
    
    // Verifica se já existe usuário
    const userData = localStorage.getItem('conectahub_user');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.loggedIn) {
            // Se já está logado, vai para página principal
            window.location.href = 'index.html';
        } else if (user.registered) {
            // Se já registrado, foca no login e preenche email
            document.querySelector('.auth-tab[data-tab="login"]').click();
            document.getElementById('login-email').value = user.email || '';
            
            // Reconfigura botões após mudar de aba
            setTimeout(() => {
                setupPasswordToggle();
            }, 100);
        }
    }
});

// Também inicializa quando a window carrega completamente
window.addEventListener('load', function() {
    setupPasswordToggle();
});

// Chaves e funções para armazenar usuários no localStorage
const USERS_KEY = 'conectahub_users';
function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch(e) { return []; }
}
function setUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }