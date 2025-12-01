// Smooth scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Botão do Jogo Corporativo
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
        
        // Restaura o botão
        button.innerHTML = '<i class="fas fa-gamepad"></i> Acessar o Jogo';
        button.disabled = false;
        
        // Mostra mensagem de sucesso
        showNotification('Jogo aberto em nova aba!', 'success');
    }, 1000);
});

// Feedback Game
document.addEventListener('DOMContentLoaded', function() {
    const optionButtons = document.querySelectorAll('.option-btn');
    const feedbackResult = document.getElementById('feedback-result');

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

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const response = responses[value];

            // Reset all buttons
            optionButtons.forEach(btn => {
                btn.style.borderColor = '#e2e5ee';
                btn.style.transform = 'translateY(0)';
            });

            // Highlight selected button
            this.style.borderColor = response.color;
            this.style.transform = 'translateY(-5px)';

            // Show feedback result
            feedbackResult.innerHTML = `
                <h3 style="color: ${response.color}; margin-bottom: 1rem;">${response.title}</h3>
                <p>${response.message}</p>
            `;
            feedbackResult.style.display = 'block';
            feedbackResult.classList.add('show');

            // Add to localStorage para possível análise posterior
            const feedbackData = {
                rating: value,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('conectahub_feedback', JSON.stringify(feedbackData));
        });
    });
});

// Form submission
document.querySelector('.contato-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nome: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        mensagem: this.querySelector('textarea').value
    };

    // Simulação de envio
    const button = this.querySelector('button');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
        button.style.background = '#4CAF50';
        
        // Reset form
        this.reset();
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 3000);
    }, 2000);
});

// Animação de entrada para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.valor-card, .norma-item, .tour-content, .contato-grid').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Efeito de digitação no hero
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Iniciar efeito de digitação quando a página carregar
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        setTimeout(() => {
            typeWriter(heroTitle, originalText);
        }, 500);
    }
});

// Sistema de logout (opcional - para adicionar um botão de logout)
function setupLogout() {
    // Criar botão de logout se o usuário estiver logado
    const userData = localStorage.getItem('conectahub_user');
    if (userData && JSON.parse(userData).loggedIn) {
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
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
        
        logoutBtn.addEventListener('mouseenter', function() {
            this.style.background = 'var(--accent)';
            this.style.color = 'white';
        });
        
        logoutBtn.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.color = 'var(--accent)';
        });
        
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('conectahub_user');
            window.location.href = 'login.html';
        });
        
        // Adicionar ao header
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(logoutBtn);
        }
        
        // Atualizar link de login para perfil
        const loginLink = document.querySelector('.nav-links a[href="login.html"]');
        if (loginLink) {
            loginLink.innerHTML = '<i class="fas fa-user"></i> Meu Perfil';
            loginLink.href = '#';
        }
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
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
    
    document.body.appendChild(notification);
    
    // Botão de fechar
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Remove automático após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    return colors[type] || '#2196F3';
}

// Adicionar estilos de animação para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 10px;
    }
`;
document.head.appendChild(notificationStyles);

// Chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setupLogout();
});