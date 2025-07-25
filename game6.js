/************************************************
 *                OYUN 6 (Game6)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas6 = document.getElementById('gameCanvas6');
const ctx6 = canvas6.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas6.width = window.innerWidth;
canvas6.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage6 = GAME_ASSETS.loadImage('background');
const pinkFrame6 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame6 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame6 = GAME_ASSETS.loadImage('rightFrame');
const headerImage6 = GAME_ASSETS.loadImage('header');
const carImage6 = GAME_ASSETS.loadImage('car');
const pumpkinImage6 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage6 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame6 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage6 = GAME_ASSETS.loadImage('boy');
const girlImage6 = GAME_ASSETS.loadImage('girl');
const cheese6 = GAME_ASSETS.loadImage('cheese');
const pear6 = GAME_ASSETS.loadImage('pear');
const pie6 = GAME_ASSETS.loadImage('pie');
const taxi6 = GAME_ASSETS.loadImage('taxi');
const donut6 = GAME_ASSETS.loadImage('donut');
const eight6 = GAME_ASSETS.loadImage('eight');
const elephant6 = GAME_ASSETS.loadImage('elephant');
const four6 = GAME_ASSETS.loadImage('four');
const grape6 = GAME_ASSETS.loadImage('grape');
const orange6 = GAME_ASSETS.loadImage('orange');
const six6 = GAME_ASSETS.loadImage('six');
const two6 = GAME_ASSETS.loadImage('two');
const correct6 = GAME_ASSETS.loadImage('correct');
const wrong6 = GAME_ASSETS.loadImage('wrong');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound6 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer6 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding6 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound6 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic6 = GAME_ASSETS.loadAudio('background');
backgroundMusic6.loop = true;
backgroundMusic6.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let selectedTopFrame6 = null;
let selectedBottomFrame6 = null;
let arrowStartX6 = null;
let arrowStartY6 = null;
let currentMouseX6 = null;
let currentMouseY6 = null;
let isDrawingArrow6 = false;
let correctMatches6 = new Array(4).fill(false);
let wrongFrames6 = [];
let iconAnimations6 = {
    size: 0,
    opacity: 0
};

let gameItems6 = {
    set1: [
        { image: grape6, number: 8, count: 8 },
        { image: orange6, number: 6, count: 6 },
        { image: donut6, number: 2, count: 2 },
        { image: elephant6, number: 4, count: 4 }
    ],
    numbers: [
        { image: eight6, value: 8 },
        { image: six6, value: 6 },
        { image: two6, value: 2 },
        { image: four6, value: 4 }
    ],
    currentSet: 0
};

/**
 * 5) Confetti için değişkenler ve sınıf
 */
let confetti6 = [];
let isConfettiActive6 = false;
const COLORS6 = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

class Confetti6 {
    constructor() {
        this.x = Math.random() * canvas6.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS6[Math.floor(Math.random() * COLORS6.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx6.save();
        ctx6.translate(this.x, this.y);
        ctx6.rotate(this.rotation * Math.PI / 180);
        ctx6.fillStyle = this.color;
        ctx6.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx6.restore();
    }
}

/**
 * 6) Yardımcı fonksiyonlar
 */
function startConfetti6() {
    isConfettiActive6 = true;
    confetti6 = [];
    for (let i = 0; i < 100; i++) {
        confetti6.push(new Confetti6());
    }

    setTimeout(() => {
        isConfettiActive6 = false;
        confetti6 = [];
    }, 1000);
}

function animateIcon6(isCorrect) {
    iconAnimations6.size = 0;
    iconAnimations6.opacity = 0;

    const animate = () => {
        iconAnimations6.size = Math.min(1, iconAnimations6.size + 0.1);
        iconAnimations6.opacity = Math.min(1, iconAnimations6.opacity + 0.1);

        if (iconAnimations6.size < 1) {
            requestAnimationFrame(animate);
        }

        if (!isCorrect && iconAnimations6.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations6.size -= 0.1;
                    if (iconAnimations6.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames6 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animate();
}

function checkAllMatches6() {
    return correctMatches6.every(match => match === true);
}

function drawArrow6(fromX, fromY, toX, toY) {
    ctx6.beginPath();
    ctx6.moveTo(fromX, fromY);
    ctx6.lineTo(toX, toY);
    ctx6.strokeStyle = '#FF69B4';
    ctx6.lineWidth = 4;
    ctx6.stroke();

    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = 20;

    ctx6.beginPath();
    ctx6.moveTo(toX, toY);
    ctx6.lineTo(
        toX - headLen * Math.cos(angle - Math.PI / 6),
        toY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx6.lineTo(
        toX - headLen * Math.cos(angle + Math.PI / 6),
        toY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx6.closePath();
    ctx6.fillStyle = '#FF69B4';
    ctx6.fill();
}

function draw6() {
    ctx6.clearRect(0, 0, canvas6.width, canvas6.height);
    ctx6.drawImage(backgroundImage6, 0, 0, canvas6.width, canvas6.height);

    const headerWidth = canvas6.width * 0.4;
    const headerHeight = headerWidth * (headerImage6.height / headerImage6.width);
    const headerX = (canvas6.width - headerWidth) / 2;
    const headerY = canvas6.height * 0.05;
    ctx6.drawImage(headerImage6, headerX, headerY, headerWidth, headerHeight);

    const frameWidth = canvas6.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas6.width * 0.02;
    const startX = (canvas6.width - (4 * frameWidth + 3 * spacing)) / 2;
    const topY = canvas6.height * 0.2;

    // Üst frame'leri çiz
    gameItems6.set1.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;

        ctx6.drawImage(whiteFrame6, itemX, topY, frameWidth, frameHeight);

        if (wrongFrames6.includes('top' + index)) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations6.size);
            const wrongX = itemX + (frameWidth - currentSize) / 2;
            const wrongY = topY + (frameHeight - currentSize) / 2;

            ctx6.globalAlpha = iconAnimations6.opacity;
            ctx6.drawImage(wrong6, wrongX, wrongY, currentSize, currentSize);
            ctx6.globalAlpha = 1.0;
            return;
        }

        if (!correctMatches6[index]) {
            const itemSize = frameWidth * 0.2;
            const rows = Math.ceil(Math.sqrt(item.count));
            const cols = Math.ceil(item.count / rows);
            const horizontalSpacing = frameWidth * 0.08;
            const verticalSpacing = frameHeight * 0.08;

            for(let i = 0; i < item.count; i++) {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const x = itemX + (col * (itemSize + horizontalSpacing)) + frameWidth * 0.12;
                const y = topY + (row * (itemSize + verticalSpacing)) + frameHeight * 0.12;
                ctx6.drawImage(item.image, x, y, itemSize, itemSize);
            }
        } else {
            ctx6.drawImage(correct6,
                itemX + frameWidth * 0.25,
                topY + frameHeight * 0.25,
                frameWidth * 0.5,
                frameHeight * 0.5
            );
        }
    });

    // Alt frame'leri çiz
    const bottomY = canvas6.height * 0.55;
    gameItems6.numbers.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;
        ctx6.drawImage(whiteFrame6, itemX, bottomY, frameWidth, frameHeight);
        ctx6.drawImage(item.image,
            itemX + frameWidth * 0.1,
            bottomY + frameHeight * 0.1,
            frameWidth * 0.8,
            frameHeight * 0.8
        );
    });

    if (isDrawingArrow6 && arrowStartX6 !== null && arrowStartY6 !== null) {
        drawArrow6(arrowStartX6, arrowStartY6, currentMouseX6, currentMouseY6);
    }
}

function resetGame6() {
    isConfettiActive6 = false;
    correctMatches6 = new Array(4).fill(false);
    wrongFrames6 = [];
    iconAnimations6.size = 0;
    iconAnimations6.opacity = 0;

    const gif = document.getElementById('animatedGif6');
    gif.style.display = 'none';
    document.getElementById('idleGif6').style.display = 'block';
}

/**
 * 7) Event listeners
 */
canvas6.addEventListener('mousedown', function(event) {
    backgroundMusic6.play();
    const rect = canvas6.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas6.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas6.width * 0.02;
    const startX = (canvas6.width - (4 * frameWidth + 3 * spacing)) / 2;
    const bottomY = canvas6.height * 0.6;

    for (let i = 0; i < gameItems6.numbers.length; i++) {
        const itemX = startX + (frameWidth + spacing) * i;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= bottomY && mouseY <= bottomY + frameHeight) {
            isDrawingArrow6 = true;
            selectedBottomFrame6 = i;
            arrowStartX6 = itemX + frameWidth/2;
            arrowStartY6 = bottomY + frameHeight/2;
            currentMouseX6 = mouseX;
            currentMouseY6 = mouseY;
            break;
        }
    }
});

canvas6.addEventListener('mouseup', function(event) {
    if (!isDrawingArrow6) return;

    const rect = canvas6.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas6.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas6.width * 0.02;
    const startX = (canvas6.width - (4 * frameWidth + 3 * spacing)) / 2;
    const topY = canvas6.height * 0.25;

    for (let i = 0; i < gameItems6.set1.length; i++) {
        const itemX = startX + (frameWidth + spacing) * i;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= topY && mouseY <= topY + frameHeight) {

            if (gameItems6.set1[i].number === gameItems6.numbers[selectedBottomFrame6].value) {
                correctSound6.play();
                kidsapplauding6.play();
                startConfetti6();
                correctMatches6[i] = true;

                document.getElementById('idleGif6').style.display = 'none';
                const gif = document.getElementById('animatedGif6');
                gif.src = '';
                setTimeout(() => {
                    gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
                    gif.style.display = 'block';
                }, 0);

                if (checkAllMatches6()) {
                    setTimeout(() => {
                        isConfettiActive6 = false;
                        // Game6'yı sola kaydır
                        document.getElementById("gameContainer6").style.transform = 'translateX(-100%)';
                        // Game7'yi sağdan getir
                        document.getElementById("gameContainer7").classList.add("slide-in");
                        if (typeof animate7 === 'function') {
                            animate7();
                        }
                        gif.style.display = 'none';
                        document.getElementById('idleGif6').style.display = 'block';
                        correctMatches6 = new Array(4).fill(false);
                    }, 2000);
                } else {
                    setTimeout(() => {
                        gif.style.display = 'none';
                        document.getElementById('idleGif6').style.display = 'block';
                    }, 2000);
                }
            } else {
                wrongAnswer6.play();
                wrongFrames6.push('top' + i);
                animateIcon6(false);
            }
            break;
        }
    }

    isDrawingArrow6 = false;
    selectedBottomFrame6 = null;
    arrowStartX6 = null;
    arrowStartY6 = null;
});

canvas6.addEventListener('mousemove', function(event) {
    if (isDrawingArrow6) {
        const rect = canvas6.getBoundingClientRect();
        currentMouseX6 = event.clientX - rect.left;
        currentMouseY6 = event.clientY - rect.top;
    }
});

window.addEventListener('resize', function() {
    canvas6.width = window.innerWidth;
    canvas6.height = window.innerHeight;
    draw6();
});

/**
 * 8) Animasyon döngüsü
 */
function animate6() {
    ctx6.clearRect(0, 0, canvas6.width, canvas6.height);
    draw6();

    if (isDrawingArrow6 && arrowStartX6 !== null && arrowStartY6 !== null) {
        drawArrow6(arrowStartX6, arrowStartY6, currentMouseX6, currentMouseY6);
    }

    if (isConfettiActive6) {
        confetti6.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (particle.y > canvas6.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas6.width;
            }
        });
    }

    requestAnimationFrame(animate6);
}

/**
 * 9) Oyunu başlat
 */
window.onload = function() {
    const gif6 = document.getElementById('animatedGif6');
    const idleGif6 = document.getElementById('idleGif6');
    
    gif6.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif6.style.display = 'none';
    
    idleGif6.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif6.style.display = 'block';
};

animate6(); 