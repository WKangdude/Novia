function createStars() {
    const container = document.getElementById('stars-container');
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 3 + 2;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        container.appendChild(star);
    }
}

function createFireflies() {
    const container = document.getElementById('firefly-container');
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');
        const size = Math.random() * 5 + 2;
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${Math.random() * 100}%`;
        animateFirefly(firefly);
        container.appendChild(firefly);
    }
}

function animateFirefly(el) {
    const duration = 10000 + Math.random() * 10000;
    const keyframes = [
        { transform: `translate(0, 0) scale(0)`, opacity: 0 },
        { opacity: 0.6, offset: 0.2 },
        { transform: `translate(${Math.random()*200 - 100}px, ${Math.random()*-200}px) scale(1)`, opacity: 0.8, offset: 0.5 },
        { transform: `translate(${Math.random()*200 - 100}px, -100vh) scale(0)`, opacity: 0 }
    ];
    el.animate(keyframes, {
        duration: duration,
        iterations: Infinity,
        delay: Math.random() * 5000
    });
}

const flowerContainer = document.getElementById('flower-container');
const flowerCenter = document.getElementById('flower-center');

function createPeony() {
    // Limpiamos contenido previo por seguridad
    flowerCenter.innerHTML = '';

    const numberOfPetals = 65; 
    // Detectar si es móvil (ancho menor a 768px)
    const isMobile = window.innerWidth < 768;
    
    // Factor de escala global: Reduce la flor al 55% en móviles, 85% en escritorio
    const globalScale = isMobile ? 0.55 : 0.85;

    for (let i = 0; i < numberOfPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // Ángulo áureo para distribución perfecta
        const angle = (i * 137.5) * (Math.PI / 180);
        
        // --- Ajuste de Simetría ---
        // En lugar de una escala exponencial agresiva, usamos una más suave
        // Antes: 0.2 + (i * 0.04) -> Crecía demasiado rápido
        const growthRate = isMobile ? 0.015 : 0.02; 
        const scale = 0.2 + (i * growthRate); 

        const hue = 330 + Math.random() * 15; 
        const lightness = 45 + (i * 0.5); 
        
        // --- Ajuste de Forma Circular ---
        // Reducimos la aleatoriedad drásticamente.
        // El tamaño base crece con 'i' para que los pétalos externos sean siempre más grandes
        const baseWidth = 60 + (i * 0.5); 
        const baseHeight = 90 + (i * 0.8);
        
        // Variación aleatoria pequeña (+/- 5px) para que no se vea "artificial" pero sí simétrica
        const randomVarW = (Math.random() * 10) - 5; 
        const randomVarH = (Math.random() * 10) - 5;
        
        // Aplicamos el tamaño ajustado por el factor global (móvil/escritorio)
        petal.style.width = `${(baseWidth + randomVarW) * globalScale}px`; 
        petal.style.height = `${(baseHeight + randomVarH) * globalScale}px`;
        
        petal.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 85%, ${lightness}%, 0.9), hsla(${hue}, 95%, 20%, 0.2))`;
        
        // Estado inicial
        petal.style.transform = `translate(-50%, -50%) rotate(${angle}rad) scale(0)`;
        petal.style.zIndex = i;

        flowerCenter.appendChild(petal);

        setTimeout(() => {
            // Ajuste de dispersión (distance)
            // En móviles juntamos un poco más los pétalos (1.5) que en escritorio (2.0)
            const spreadFactor = isMobile ? 1.5 : 2.0;
            const distance = (i * spreadFactor) * globalScale;
            
            petal.style.transform = `translate(calc(-50% + ${Math.cos(angle)*distance}px), calc(-50% + ${Math.sin(angle)*distance}px)) rotate(${angle * 57.29}deg) scale(${scale})`;
            petal.style.opacity = 1;
        }, 1500 + (i * 40));
    }
}

window.onload = () => {
    createStars();
    createFireflies();
    createPeony();

    setTimeout(() => {
        flowerContainer.style.opacity = 1;
    }, 100);

    setTimeout(() => {
        flowerCenter.classList.add('flower-breathing');
    }, 6000);

    setTimeout(() => {
        document.getElementById('content').classList.add('visible');
    }, 4000); 
};

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const contentDiv = document.getElementById('content');
const successMsg = document.getElementById('success-message');

let growthFactor = 1;

noBtn.addEventListener('click', () => {
    growthFactor += 0.5;
    yesBtn.style.transform = `scale(${growthFactor})`;
    
    const noTexts = ["¿Segura?", "¿En serio?", "Neta?", "Nahhhh", "Yo se que quieres"];
    if (growthFactor < 40) {
        noBtn.innerText = noTexts[Math.floor(Math.random() * noTexts.length)];
    }
});

yesBtn.addEventListener('click', () => {
    contentDiv.style.opacity = '0';
    setTimeout(() => contentDiv.style.display = 'none', 1000);
    
    flowerContainer.style.transition = 'opacity 2s ease';
    flowerContainer.style.opacity = '0'; 
    
    setTimeout(() => {
        successMsg.style.display = 'block';
        startFallingPetals();
    }, 500);
});

function startFallingPetals() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ffc0cb', '#ff69b4', '#ff1493', '#db7093', '#ffb7c5'];

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 15 + 10;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.sway = Math.random() * 0.05 + 0.02;
        this.swayCount = Math.random() * Math.PI * 2;
        this.opacity = Math.random() * 0.5 + 0.4; 
    }

    Particle.prototype.update = function() {
        this.y += this.speedY;
        this.swayCount += this.sway;
        this.x += Math.sin(this.swayCount) * 0.5;
        this.rotation += 0.5;
        
        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }

    Particle.prototype.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff69b4';
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 1.8, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    for (let i = 0; i < 120; i++) {
        particles.push(new Particle());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animatePetals);
    }
    animatePetals();
}

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
