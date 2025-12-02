// Smooth scrolling para links de navegação
// Quando clica em links que começam com # (âncora), faz rolagem suave até a seção
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Impede o comportamento padrão do link
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Rola suavemente até o elemento alvo
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Botão do Jogo Corporativo
// Quando clica no botão do jogo, mostra animação de carregamento e abre o jogo
document.getElementById('jogo-button').addEventListener('click', function() {
    const button = this;
    
    // Animação de carregamento
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    button.disabled = true;
    
    setTimeout(() => {
        // LINK DO JOGO - Jogo corporativo no itch.io
        const linkJogo = 'https://izabel-godinho.itch.io/connecthub-o-tour';
        
        // Abre o jogo em uma nova aba
        window.open(linkJogo, '_blank');
        
        // Restaura o botão ao estado original
        button.innerHTML = '<i class="fas fa-gamepad"></i> Acessar o Jogo';
        button.disabled = false;
        
        // Mostra mensagem de sucesso
        showNotification('Jogo aberto em nova aba!', 'success');
    }, 1000); // Espera 1 segundo (simula carregamento)
});

// Feedback Game
// Sistema de votação para avaliar a comunicação da empresa
document.addEventListener('DOMContentLoaded', function() {
    const optionButtons = document.querySelectorAll('.option-btn'); // Botões de opção
    const feedbackResult = document.getElementById('feedback-result'); // Área do resultado

    // Respostas possíveis para cada opção
    const responses = {
        excelente: {
            title: '🎉 Excelente!',
            message: 'Que bom que você está satisfeito com nossa comunicação! Continuaremos trabalhando para manter essa qualidade.',
            color: '#4CAF50'
        },
        bom: {
            title: '👍 Ótimo!',
            message: 'Obrigado pelo feedback positivo! Vamos continuar melhorando nossos processos de comunicação.',
            color: '#2196F3'
        },
        regular: {
            title: '😐 Obrigado pelo feedback',
            message: 'Agradecemos sua honestidade. Estamos sempre buscando melhorar e seu feedback nos ajuda nesse processo.',
            color: '#FF9800'
        },
        ruim: {
            title: '💪 Trabalhando para melhorar',
            message: 'Agradecemos por compartilhar sua opinião. Levaremos seu feedback em consideração e trabalharemos para melhorar nossa comunicação interna.',
            color: '#F44336'
        }
    };

    // Adiciona evento de clique em cada botão de opção
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value'); // Pega o valor da opção
            const response = responses[value]; // Pega a resposta correspondente

            // Remove destaque de todos os botões
            optionButtons.forEach(btn => {
                btn.style.borderColor = '#e2e5ee';
                btn.style.transform = 'translateY(0)';
            });

            // Destaca o botão selecionado
            this.style.borderColor = response.color;
            this.style.transform = 'translateY(-5px)';

            // Mostra o resultado do feedback
            feedbackResult.innerHTML = `
                <h3 style="color: ${response.color}; margin-bottom: 1rem;">${response.title}</h3>
                <p>${response.message}</p>
            `;
            feedbackResult.style.display = 'block';
            feedbackResult.classList.add('show');

            // Salva o feedback no localStorage para análise posterior
            const feedbackData = {
                rating: value,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('conectahub_feedback', JSON.stringify(feedbackData));
        });
    });
});

// Form submission
// Quando o formulário de contato é enviado
document.querySelector('.contato-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário
    
    // Pega os dados do formulário
    const formData = {
        nome: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        mensagem: this.querySelector('textarea').value
    };

    // Simulação de envio (sem backend real)
    const button = this.querySelector('button');
    const originalText = button.innerHTML;
    
    // Mostra animação de carregamento
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;

    setTimeout(() => {
        // Simula envio bem-sucedido após 2 segundos
        button.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
        button.style.background = '#4CAF50';
        
        // Limpa o formulário
        this.reset();
        
        // Restaura o botão após 3 segundos
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }, 2000);
});

// Animação de entrada para elementos
// Faz elementos aparecerem suavemente quando entram na tela
const observerOptions = {
    threshold: 0.1, // Quando 10% do elemento está visível
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { // Se o elemento está visível
            entry.target.style.opacity = '1'; // Torna visível
            entry.target.style.transform = 'translateY(0)'; // Remove deslocamento
        }
    });
}, observerOptions);

// Observar elementos para animação
// Aplica animação de entrada nos elementos selecionados
document.querySelectorAll('.valor-card, .norma-item, .tour-content, .contato-grid').forEach(el => {
    el.style.opacity = '0'; // Começa invisível
    el.style.transform = 'translateY(20px)'; // Começa 20px abaixo
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // Animação suave
    observer.observe(el); // Começa a observar o elemento
});

// Efeito de digitação no hero
// Simula texto sendo digitado no título principal
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = ''; // Limpa o conteúdo
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i); // Adiciona uma letra
            i++;
            setTimeout(type, speed); // Chama a si mesmo após delay
        }
    }
    type();
}

// Iniciar efeito de digitação quando a página carregar
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = ''; // Limpa o título
        setTimeout(() => {
            typeWriter(heroTitle, originalText); // Começa o efeito de digitação
        }, 500); // Espera 0.5 segundos
    }
});

// Sistema de logout (opcional)
// Adiciona botão de logout se usuário estiver logado
function setupLogout() {
    // Verifica se existe usuário logado
    const userData = localStorage.getItem('conectahub_user');
    if (userData && JSON.parse(userData).loggedIn) {
        // Cria botão de logout
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
        // Estilos do botão
        logoutBtn.style.cssText = `
            background: transparent;
            border: 2px solid var(--accent);
            color: var(--accent);
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 15px;
            transition: all 0.3s ease;
        `;
        
        // Efeitos hover do botão
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.background = 'var(--accent)';
            this.style.color = 'white';
        });
        
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.color = 'var(--accent)';
        });
        
        // Ação de logout
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('conectahub_user'); // Remove dados do usuário
            window.location.href = 'login.html'; // Redireciona para login
        });
        
        // Adiciona o botão ao menu
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(logoutBtn);
        }
        
        // Muda o link de login para "Meu Perfil"
        const loginLink = document.querySelector('.nav-links a[href="login.html"]');
        if (loginLink) {
            loginLink.innerHTML = '<i class="fas fa-user"></i> Meu Perfil';
            loginLink.href = '#'; // Remove link para login
        }
    }
}

// Sistema de notificações
// Mostra mensagens flutuantes na tela
function showNotification(message, type = 'info') {
    // Cria elemento da notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Estilos da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
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
    
    document.body.appendChild(notification); // Adiciona à página
    
    // Botão para fechar notificação
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300); // Remove após animação
    });
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Retorna ícone correto para cada tipo de notificação
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Retorna cor correta para cada tipo de notificação
function getNotificationColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    return colors[type] || '#2196F3';
}

// Adiciona estilos CSS para animações das notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 10px;
    }
`;
document.head.appendChild(notificationStyles); // Adiciona ao cabeçalho da página

// Chama a função de logout quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    setupLogout();
});