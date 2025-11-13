// ===========================
// Smooth Scroll Enhancement
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarElement = document.querySelector('.navbar');
            const navLinks = document.querySelector('.nav-links');
            const navToggle = document.querySelector('.nav-toggle');
            const isMobileMenuOpen = navLinks && navLinks.classList.contains('open');
            const navHeight = navbarElement ? navbarElement.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            if (isMobileMenuOpen && navLinks && navToggle) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('is-active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// ===========================
// Navbar Scroll Effect
// ===========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 10) {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// Intersection Observer for Animations
// ===========================
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

// Observe elements that should animate
const animateElements = document.querySelectorAll('.library-card, .visual-card, .feature-item, .highlight-item, .stat-box');
animateElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    // 仅对初始不在视窗内的元素设置进入动画，避免首屏闪烁
    if (rect.top >= window.innerHeight) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    }
});

// ===========================
// Stats Counter Animation
// ===========================
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = progress * (end - start) + start;
        
        let displayValue;
        const sfx = (suffix || '').toLowerCase();
        if (sfx === 'm+') {
            // 对于百万级别，显示一位小数
            displayValue = (currentValue / 1000000).toFixed(1);
        } else if (sfx === 'k+') {
            // 对于千级别，显示整数或一位小数
            const kValue = currentValue / 1000;
            displayValue = kValue % 1 === 0 ? Math.floor(kValue) : kValue.toFixed(1);
        } else {
            // 其他情况显示整数
            displayValue = Math.floor(currentValue).toLocaleString();
        }

        // 保留传入后缀的大小写（如需要小写 k+）
        element.textContent = displayValue + (suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Observe hero stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const text = stat.textContent.trim();
                let value = 0;
                let suffix = '';

                // 支持 1,234+ / 1.2k+ / 1.2K+ / 1200+
                const lower = text.toLowerCase();
                const cleanedNumber = (str) => str.replace(/[,\s]/g, '');

                if (/k\+$/.test(lower)) {
                    const numPart = cleanedNumber(lower.replace(/k\+$/,''));
                    const base = parseFloat(numPart);
                    if (!isNaN(base)) {
                        value = base * 1000;
                        suffix = 'k+'; // 按需求小写
                    }
                } else if (/m\+$/.test(lower)) {
                    const numPart = cleanedNumber(lower.replace(/m\+$/,''));
                    const base = parseFloat(numPart);
                    if (!isNaN(base)) {
                        value = base * 1000000;
                        suffix = 'M+'; // 默认保持大写 M+
                    }
                } else if (/\+$/.test(lower)) {
                    const numPart = cleanedNumber(lower.replace(/\+$/,''));
                    const base = parseInt(numPart, 10);
                    if (!isNaN(base)) {
                        value = base;
                        suffix = '+';
                    }
                }

                if (value > 0) {
                    animateValue(stat, 0, value, 2000, suffix);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Also animate stats in authority section
const authorityStats = document.querySelector('.stats-card');
if (authorityStats) {
    const authorityStatsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    let value = 0;
                    let suffix = '';
                    
                    if (text.includes('M+')) {
                        value = parseFloat(text.replace('M+', '')) * 1000000;
                        suffix = 'M+';
                    } else if (text.includes('K+')) {
                        value = parseFloat(text.replace('K+', '')) * 1000;
                        suffix = 'K+';
                    } else if (text.includes('+')) {
                        value = parseInt(text.replace('+', ''));
                        suffix = '+';
                    }
                    
                    if (value > 0) {
                        stat.textContent = '0' + suffix;
                        setTimeout(() => {
                            animateValue(stat, 0, value, 2000, suffix);
                        }, 200);
                    }
                });
                authorityStatsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    authorityStatsObserver.observe(authorityStats);
}

// ===========================
// Chat Interface Animation
// ===========================
const chatMessages = document.querySelectorAll('.chat-message');
const chatObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            chatMessages.forEach((msg, index) => {
                setTimeout(() => {
                    msg.style.opacity = '1';
                    msg.style.transform = 'translateY(0)';
                }, index * 300);
            });
            chatObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

chatMessages.forEach(msg => {
    msg.style.opacity = '0';
    msg.style.transform = 'translateY(20px)';
    msg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

const chatInterface = document.querySelector('.chat-interface');
if (chatInterface) {
    chatObserver.observe(chatInterface);
}

// ===========================
// Library Cards Hover Effect
// ===========================
const libraryCards = document.querySelectorAll('.library-card');
libraryCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--primary-color)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--border-color)';
    });
});

// ===========================
// Mobile Menu Toggle
// ===========================
const navLinks = document.querySelector('.nav-links');
const navToggle = document.querySelector('.nav-toggle');

if (navLinks && navToggle) {
    let outsideClickHandlerBound = false;

    function closeMenu() {
        navLinks.classList.remove('open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
        if (outsideClickHandlerBound) {
            document.removeEventListener('click', handleOutsideClick);
            outsideClickHandlerBound = false;
        }
    }

    function openMenu() {
        navLinks.classList.add('open');
        navToggle.classList.add('is-active');
        navToggle.setAttribute('aria-expanded', 'true');
        if (!outsideClickHandlerBound) {
            document.addEventListener('click', handleOutsideClick);
            outsideClickHandlerBound = true;
        }
    }

    function handleOutsideClick(event) {
        if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
            closeMenu();
        }
    }

    const toggleMenu = (event) => {
        event.stopPropagation();
        if (navLinks.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const handleResize = () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    };

    navToggle.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', handleResize);
}

// ===========================
// Preload Important Images
// ===========================
const preloadImages = () => {
    // Add any critical images to preload here
    const images = [];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// ===========================
// Page Load Animations
// ===========================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    preloadImages();
});

// ===========================
// Keyboard Navigation Enhancement
// ===========================
document.addEventListener('keydown', (e) => {
    // ESC key to close any open modals (if implemented)
    if (e.key === 'Escape') {
        // Modal close logic here
    }
});

// ===========================
// External Links Security
// ===========================
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});

// ===========================
// Performance: Debounce Scroll Events
// ===========================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations if needed
const handleScroll = debounce(() => {
    // Additional scroll handling
}, 100);

window.addEventListener('scroll', handleScroll);

// ===========================
// Print Styling Support
// ===========================
window.addEventListener('beforeprint', () => {
    console.log('Preparing page for print...');
});

// ===========================
// Accessibility: Focus Visible
// ===========================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ===========================
// Console Message
// ===========================
console.log('%c🚀 sdcb.ai - Serving Dotnet, Constructing Brilliant', 
    'font-size: 16px; font-weight: bold; color: #0066ff;');
console.log('%cInterested in joining us? Check out our GitHub: https://github.com/sdcb', 
    'font-size: 12px; color: #666;');
