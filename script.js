// ========================================
// КОНФЕТТІ
// ========================================

class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pieces = [];
        this.colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', 
            '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e2',
            '#f8b739', '#ff85a2'
        ];
        
        this.resize();
        this.createConfetti();
        this.isAnimating = true;
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createConfetti() {
        const count = 150;
        for (let i = 0; i < count; i++) {
            this.pieces.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                speed: Math.random() * 3 + 2,
                size: Math.random() * 8 + 5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.5,
                swing: Math.random() * 2 - 1,
                swingSpeed: Math.random() * 0.05
            });
        }
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.pieces.forEach(piece => {
            piece.y += piece.speed;
            piece.x += Math.sin(piece.y * piece.swingSpeed) * piece.swing;
            piece.rotation += piece.rotationSpeed;
            
            if (piece.y > this.canvas.height + 20) {
                piece.y = -20;
                piece.x = Math.random() * this.canvas.width;
            }
            
            this.ctx.save();
            this.ctx.translate(piece.x, piece.y);
            this.ctx.rotate((piece.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = piece.opacity;
            this.ctx.fillStyle = piece.color;
            this.ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// ҚҰРЫЛҒЫ АНЫҚТАУ
// ========================================

function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    
    const isMobileUA = mobileKeywords.test(userAgent);
    const isMobileScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileUA || (isMobileScreen && isTouchDevice);
}

let currentVideo = null;
let confettiInstance = null;

function showAppropriateVideo() {
    const desktopVideo = document.getElementById('desktop-video');
    const mobileVideo = document.getElementById('mobile-video');
    
    if (currentVideo) {
        currentVideo.pause();
        currentVideo.removeEventListener('ended', onVideoEnded);
    }
    
    if (isMobileDevice()) {
        mobileVideo.style.display = 'block';
        desktopVideo.style.display = 'none';
        currentVideo = mobileVideo;
    } else {
        desktopVideo.style.display = 'block';
        mobileVideo.style.display = 'none';
        currentVideo = desktopVideo;
    }
    
    currentVideo.addEventListener('ended', onVideoEnded);
}

function onVideoEnded() {
    console.log('Видео аяқталды!');
    
    // 1 секунд күту
    setTimeout(() => {
        console.log('Видеоны блюрлеу...');
        
        // ВИДЕОНЫ БЛЮРЛЕУ
        const videoContainer = document.getElementById('video-container');
        videoContainer.classList.add('video-blur');
        
        // iframe ЖҮКТЕУ ЖӘНЕ КӨРСЕТУ
        const cakeIframe = document.getElementById('cake-iframe');
        
        // iframe жүктелгеннен кейін
        cakeIframe.onload = function() {
            console.log('Торт файлы жүктелді!');
            
            // 0.5 секунд күту
            setTimeout(() => {
                console.log('Торт анимациясын көрсету...');
                cakeIframe.classList.add('show');
            }, 500);
        };
        
        // iframe src орнату (блюрден КЕЙІН)
        cakeIframe.src = 'birthday-cake.html';
        
    }, 1000);
}

function startVideoWithSound() {
    if (currentVideo) {
        currentVideo.muted = false;
        currentVideo.volume = 1.0;
        
        currentVideo.play().then(() => {
            console.log('Видео дыбыспен басталды!');
            
            const overlay = document.getElementById('start-overlay');
            overlay.classList.add('hidden');
            
        }).catch(err => {
            console.error('Қате:', err);
        });
    }
}

// ========================================
// ІСКЕ ҚОСУ
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Конфетті
    const canvas = document.getElementById('confetti-canvas');
    confettiInstance = new Confetti(canvas);
    
    // iframe алдын ала жасыру
    const cakeIframe = document.getElementById('cake-iframe');
    cakeIframe.classList.remove('show');
    
    // Бейне
    showAppropriateVideo();
    
    // Старт
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', startVideoWithSound);
    
    const overlay = document.getElementById('start-overlay');
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            startVideoWithSound();
        }
    });
});

window.addEventListener('resize', () => {
    const wasPlaying = currentVideo && !currentVideo.paused;
    const wasMuted = currentVideo && currentVideo.muted;
    const currentTime = currentVideo ? currentVideo.currentTime : 0;
    
    showAppropriateVideo();
    
    if (wasPlaying && currentVideo) {
        currentVideo.muted = wasMuted;
        currentVideo.currentTime = currentTime;
        currentVideo.play();
    }
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const wasPlaying = currentVideo && !currentVideo.paused;
        const wasMuted = currentVideo && currentVideo.muted;
        const currentTime = currentVideo ? currentVideo.currentTime : 0;
        
        showAppropriateVideo();
        
        if (wasPlaying && currentVideo) {
            currentVideo.muted = wasMuted;
            currentVideo.currentTime = currentTime;
            currentVideo.play();
        }
    }, 100);
});