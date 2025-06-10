// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// WhatsApp integration
function openWhatsApp() {
    const phoneNumber = "5199239996"; // Número oficial ELEV Dispositivos
    const message = "Olá! Gostaria de saber mais sobre a peça inovadora para colheitadeiras da ELEV Dispositivos.";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// FAQ toggle functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Form submission
function submitForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        city: formData.get('city'),
        equipment: formData.get('equipment')
    };
    
    // Here you would typically send the data to your backend
    // For now, we'll simulate a successful submission
    
    // Show success message
    alert('Obrigado! Sua solicitação foi enviada com sucesso. Nossa equipe entrará em contato em breve.');
    
    // Reset form
    event.target.reset();
    
    // Optional: Redirect to WhatsApp
    const message = `Olá! Acabei de enviar uma solicitação pelo site. Dados: Nome: ${data.name}, Telefone: ${data.phone}, Cidade: ${data.city}, Equipamento: ${data.equipment}`;
    const phoneNumber = "5199239996"; // Número oficial ELEV Dispositivos
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.spec-card, .stat, .badge');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state for animated elements
    const elements = document.querySelectorAll('.spec-card, .stat, .badge');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Add scroll listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Trigger initial animation check
    animateOnScroll();
});

// Mobile menu handling (if needed)
function handleMobileMenu() {
    // Add mobile menu functionality if header navigation is added later
    console.log('Mobile menu ready');
}

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(animateOnScroll, 100));

