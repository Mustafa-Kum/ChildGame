/************************************************
 *                OYUN 9 (Game9)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas9 = document.getElementById('gameCanvas9');
const ctx9 = canvas9.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas9.width = window.innerWidth;
canvas9.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage9 = GAME_ASSETS.loadImage('background');
const pinkFrame9 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame9 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame9 = GAME_ASSETS.loadImage('rightFrame');
const headerImage9 = GAME_ASSETS.loadImage('header');
const carImage9 = GAME_ASSETS.loadImage('car');
const pumpkinImage9 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage9 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame9 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage9 = GAME_ASSETS.loadImage('boy');
const girlImage9 = GAME_ASSETS.loadImage('girl');
const cheese9 = GAME_ASSETS.loadImage('cheese');
const pear9 = GAME_ASSETS.loadImage('pear');
const pie9 = GAME_ASSETS.loadImage('pie');
const taxi9 = GAME_ASSETS.loadImage('taxi');
const donut9 = GAME_ASSETS.loadImage('donut');
const eight9 = GAME_ASSETS.loadImage('eight');
const elephant9 = GAME_ASSETS.loadImage('elephant');
const four9 = GAME_ASSETS.loadImage('four');
const grape9 = GAME_ASSETS.loadImage('grape');
const orange9 = GAME_ASSETS.loadImage('orange');
const six9 = GAME_ASSETS.loadImage('six');
const two9 = GAME_ASSETS.loadImage('two');
const greenframe9 = GAME_ASSETS.loadImage('greenframe');
const orangeframe9 = GAME_ASSETS.loadImage('orangeframe');
const purpleframe9 = GAME_ASSETS.loadImage('purpleframe');
const redframe9 = GAME_ASSETS.loadImage('redframe');
const leaf9 = GAME_ASSETS.loadImage('leaf');
const squirle9 = GAME_ASSETS.loadImage('squirle');
const monkey9 = GAME_ASSETS.loadImage('monkey');
const zebra9 = GAME_ASSETS.loadImage('zebra');
const bull9 = GAME_ASSETS.loadImage('bull');
const orangebaloon9 = GAME_ASSETS.loadImage('orangebaloon');
const purplebaloon9 = GAME_ASSETS.loadImage('purplebaloon');
const redbaloon9 = GAME_ASSETS.loadImage('redbaloon');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound9 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer9 = GAME_ASSETS.loadAudio('wrong');
const balloonBoom9 = GAME_ASSETS.loadAudio('baloonboom');
const kidsapplauding9 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound9 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic9 = GAME_ASSETS.loadAudio('background');
backgroundMusic9.loop = true;
backgroundMusic9.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let particles9 = [];
let glowEffects9 = [];
let confetti9 = [];
const confettiColors9 = ['#FFD700', '#FF69B4', '#00CED1', '#98FB98', '#DDA0DD'];
let isConfettiActive9 = false;
let score9 = 0;
let gameActive9 = true;
const TOTAL_BALLOONS_TO_WIN9 = 5;
const BALLOON_SPEED9 = 0.5;

/**
 * 5) Sınıflar
 */
class Balloon9 {
    constructor(image) {
        this.image = image;
        this.width = 100;
        this.height = 205;
        this.speed = 0.8;
        this.angle = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02;
        this.wobbleDistance = 1.5;
        this.isPopped = false;
        this.resetPosition();
    }

    resetPosition() {
        const minX = canvas9.width * 0.1;
        const maxX = canvas9.width * 0.9 - this.width;
        this.x = minX + Math.random() * (maxX - minX);
        this.originalX = this.x;
        this.y = canvas9.height + Math.random() * 100;
    }

    reset() {
        this.isPopped = false;
        this.resetPosition();
        this.speed = 0.8 + Math.random() * 0.4;
        this.angle = Math.random() * Math.PI * 2;
    }

    update() {
        if (!this.isPopped) {
            this.y -= this.speed;
            this.angle += this.wobbleSpeed;
            this.x = this.originalX + Math.sin(this.angle) * this.wobbleDistance * 15;
            this.originalX += Math.sin(this.angle * 0.5) * 0.2;

            if (this.y < -this.height) {
                this.resetPosition();
            }
        }
    }

    draw(ctx) {
        if (!this.isPopped) {
            ctx.save();
            ctx.translate(this.x + this.width/2, this.y + this.height/2);
            ctx.rotate(Math.sin(this.angle) * 0.05);
            ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
            ctx.restore();
        }
    }
}

class GlowEffect9 {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 100;
        this.life = 1;
        this.decay = 0.04;
    }

    update() {
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `${this.color}33`);
        gradient.addColorStop(1, `${this.color}00`);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class BalloonParticle9 {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.color = color;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.gravity = 0.2;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.radius = Math.random() * 50 + 20;
    }

    update() {
        this.angle += this.rotationSpeed;
        this.x = this.startX + Math.cos(this.angle) * this.radius * (1 - this.life);
        this.y = this.startY + Math.sin(this.angle) * this.radius * (1 - this.life);
        this.y += this.gravity * (1 - this.life) * 15;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `${this.color}FF`);
        gradient.addColorStop(0.4, `${this.color}AA`);
        gradient.addColorStop(1, `${this.color}00`);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = this.life * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

class ConfettiParticle9 {
    constructor() {
        this.x = Math.random() * canvas9.width;
        this.y = 0;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = confettiColors9[Math.floor(Math.random() * confettiColors9.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx9.save();
        ctx9.translate(this.x, this.y);
        ctx9.rotate((this.rotation * Math.PI) / 180);
        ctx9.fillStyle = this.color;
        ctx9.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx9.restore();
    }
}

const balloons9 = {
    items: [
        new Balloon9(redbaloon9),
        new Balloon9(purplebaloon9),
        new Balloon9(orangebaloon9),
        new Balloon9(redbaloon9),
        new Balloon9(purplebaloon9)
    ]
};

/**
 * 6) Yardımcı fonksiyonlar
 */
function createExplosion9(x, y, color) {
    glowEffects9.push(new GlowEffect9(x, y, color));
    for (let i = 0; i < 40; i++) {
        particles9.push(new BalloonParticle9(x, y, color));
    }
}

function startConfetti9() {
    isConfettiActive9 = true;
    for (let i = 0; i < 100; i++) {
        confetti9.push(new ConfettiParticle9());
    }

    setTimeout(() => {
        isConfettiActive9 = false;
        confetti9 = [];
    }, 3000);
}

function draw9() {
    ctx9.clearRect(0, 0, canvas9.width, canvas9.height);
    ctx9.drawImage(backgroundImage9, 0, 0, canvas9.width, canvas9.height);

    const headerWidth = canvas9.width * 0.4;
    const headerHeight = headerWidth * (headerImage9.height / headerImage9.width);
    const headerX = (canvas9.width - headerWidth) / 2;
    const headerY = canvas9.height * 0.05;
    ctx9.drawImage(headerImage9, headerX, headerY, headerWidth, headerHeight);

    balloons9.items.forEach(balloon => {
        balloon.update();
        balloon.draw(ctx9);
    });
}

function getRandomSpeed9() {
    return BALLOON_SPEED9 + Math.random() * 1.5;
}

/**
 * 7) Event listeners
 */
canvas9.addEventListener('click', function(event) {
    if (!gameActive9) return;

    backgroundMusic9.play();

    const rect = canvas9.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    balloons9.items.forEach((balloon) => {
        if (!balloon.isPopped &&
            mouseX >= balloon.x &&
            mouseX <= balloon.x + balloon.width &&
            mouseY >= balloon.y &&
            mouseY <= balloon.y + balloon.height) {

            balloon.isPopped = true;
            score9++;

            balloonBoom9.play();

            const balloonCenterX = balloon.x + balloon.width/2;
            const balloonCenterY = balloon.y + balloon.height/2;

            let explosionColor;
            if (balloon.image === redbaloon9) explosionColor = '#FF6B6B';
            else if (balloon.image === purplebaloon9) explosionColor = '#9775FA';
            else explosionColor = '#FFB86C';

            createExplosion9(balloonCenterX, balloonCenterY, explosionColor);

            if (score9 >= TOTAL_BALLOONS_TO_WIN9) {
                gameActive9 = false;
                correctSound9.play();
                kidsapplauding9.play();

                document.getElementById('idleGif9').style.display = 'none';
                const gif = document.getElementById('animatedGif9');
                gif.src = '';
                setTimeout(() => {
                    gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
                    gif.style.display = 'block';
                }, 0);

                startConfetti9();

                setTimeout(() => {
                    isConfettiActive9 = false;
                    // Game9'u sola kaydır
                    document.getElementById("gameContainer9").style.transform = 'translateX(-100%)';
                    // Game10'u sağdan getir (eğer varsa)
                    const game10Container = document.getElementById("gameContainer10");
                    if (game10Container) {
                        game10Container.classList.add("slide-in");
                        if (typeof animate10 === 'function') {
                            animate10();
                        }
                    }
                    gif.style.display = 'none';
                    document.getElementById('idleGif9').style.display = 'block';
                    score9 = 0;
                    gameActive9 = true;
                    balloons9.items.forEach(b => {
                        b.isPopped = false;
                        b.resetPosition();
                    });
                }, 3000);
            }
        }
    });
});

window.addEventListener('resize', function() {
    canvas9.width = window.innerWidth;
    canvas9.height = window.innerHeight;
    draw9();
});

/**
 * 8) Animasyon döngüsü
 */
function animate9() {
    ctx9.clearRect(0, 0, canvas9.width, canvas9.height);
    draw9();

    glowEffects9 = glowEffects9.filter(effect => {
        effect.update();
        effect.draw(ctx9);
        return effect.life > 0;
    });

    particles9 = particles9.filter(particle => {
        particle.update();
        particle.draw(ctx9);
        return particle.life > 0;
    });

    if (isConfettiActive9) {
        confetti9.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.y > canvas9.height) {
                confetti9.splice(index, 1);
            }
        });
    }

    requestAnimationFrame(animate9);
}

/**
 * 9) Oyunu başlat
 */
window.onload = function() {
    const gif9 = document.getElementById('animatedGif9');
    const idleGif9 = document.getElementById('idleGif9');
    
    gif9.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif9.style.display = 'none';
    
    idleGif9.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif9.style.display = 'block';

    balloons9.items.forEach(balloon => {
        balloon.speed = getRandomSpeed9();
    });
};

animate9(); 