// Alternar entre login e cadastro
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Ativar aba clicada
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Mostrar formulário correspondente
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(`${tabId}-form`).classList.add('active');
        
        // Reconfigurar os botões de visualizar senha
        setupPasswordToggle();
    });
});

// Links para alternar entre formulários
document.querySelector('.switch-to-register').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.auth-tab[data-tab="register"]').click();
});

document.querySelector('.switch-to-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.auth-tab[data-tab="login"]').click();
});

// Função para alternar visibilidade da senha - CORRIGIDA
function setupPasswordToggle() {
    // Remove todos os event listeners antigos
    document.querySelectorAll('.toggle-password').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Adicionar event listeners aos botões (click + keyboard)
    document.querySelectorAll('.toggle-password').forEach(button => {
        const toggleFn = function(e) {
            if (e) { e.preventDefault(); e.stopPropagation(); }
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (!passwordInput) return;

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
                this.setAttribute('title', 'Ocultar senha');
                this.setAttribute('aria-label', 'Ocultar senha');
            } else {
                passwordInput.type = 'password';
                if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
                this.setAttribute('title', 'Mostrar senha');
                this.setAttribute('aria-label', 'Mostrar senha');
            }
        };

        button.addEventListener('click', toggleFn);

        // suportar ativação por teclado (Enter / Space)
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                toggleFn.call(this, e);
            }
        });
    });
}

// Validação do formulário de login - CORRIGIDA
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
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
    
    // Simulação de login
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    button.disabled = true;
    
    setTimeout(() => {
        // Simulação: validar contra lista de usuários no localStorage
        const users = getUsers();
        const found = users.find(u => u.email && u.email.toLowerCase() === (email || '').toLowerCase() && u.password === password);

        if (found) {
            button.innerHTML = '<i class="fas fa-check"></i> Login realizado!';
            button.style.background = '#4CAF50';
            button.disabled = true;

            // Salvar dados de sessão
            const userData = {
                email: found.email,
                name: found.name || '',
                loggedIn: true,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('conectahub_user', JSON.stringify(userData));

            // Redirecionar após login bem-sucedido
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        } else {
            // usuário não encontrado ou senha incorreta
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Credenciais inválidas';
            button.style.background = '#F44336';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
                button.disabled = false;
            }, 2000);
        }
    }, 1000);
});

// Validação do formulário de cadastro - CORRIGIDA
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const terms = document.getElementById('terms').checked;
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
        // Destacar visualmente o checkbox
        const termsLabel = document.querySelector('label[for="terms"]');
        termsLabel.style.color = '#F44336';
        termsLabel.style.fontWeight = 'bold';
        
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
        // Simulação de cadastro: gravar usuário na lista (sem backend)
        const users = getUsers();
        const exists = users.find(u => u.email && u.email.toLowerCase() === (email || '').toLowerCase());
        if (exists) {
            showMessage('Já existe uma conta com este email. Faça login.', 'error');
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.disabled = false;
            return;
        }

        const newUser = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            registered: true,
            timestamp: new Date().toISOString()
        };
        users.push(newUser);
        setUsers(users);

        // Mensagem e transição para login (não faz login automaticamente)
        button.innerHTML = '<i class="fas fa-check"></i> Conta criada!';
        button.style.background = '#4CAF50';

        setTimeout(() => {
            showMessage('Conta criada com sucesso! Redirecionando para login...', 'success');

            // Mudar para aba de login
            document.querySelector('.auth-tab[data-tab="login"]').click();

            // Preencher automaticamente o email no login
            document.getElementById('login-email').value = email;

            button.innerHTML = '<i class="fas fa-user-plus"></i> Criar Conta';
            button.style.background = '';
            button.disabled = false;
            document.getElementById('register-form').reset();
        }, 900);
    }, 1000);
});

// Recuperação de senha
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Digite seu email para recuperação de senha:');
    if (email && isValidEmail(email)) {
        showMessage(`Instruções de recuperação enviadas para: ${email}`, 'success');
    } else if (email) {
        showMessage('Por favor, insira um email válido.', 'error');
    }
});

// Função para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para mostrar mensagens
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
    
    // Adiciona estilos
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
    
    // Remove a mensagem após 5 segundos
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
}

// Função auxiliar para ícones de mensagem
function getMessageIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Função auxiliar para cores de mensagem
function getMessageColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    return colors[type] || '#2196F3';
}

// Adicionar estilos de animação para mensagens
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggle();
    
    const userData = localStorage.getItem('conectahub_user');
    if (userData) {
        const user = JSON.parse(userData);
        if (user.loggedIn) {
            // Se já estiver logado, redirecionar para a página principal
            window.location.href = 'index.html';
        } else if (user.registered) {
            // Se já estiver registrado, focar no login e preencher email
            document.querySelector('.auth-tab[data-tab="login"]').click();
            document.getElementById('login-email').value = user.email || '';
            
            // Reconfigurar botões após mudar de aba
            setTimeout(() => {
                setupPasswordToggle();
            }, 100);
        }
    }
});

// Também inicializar quando a window carregar completamente
window.addEventListener('load', function() {
    setupPasswordToggle();
});

// Helpers para armazenamento de usuários
const USERS_KEY = 'conectahub_users';
function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch(e) { return []; }
}
function setUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }