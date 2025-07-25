/************************************************
 *                OYUN 7 (Game7)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas7 = document.getElementById('gameCanvas7');
const ctx7 = canvas7.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas7.width = window.innerWidth;
canvas7.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage7 = GAME_ASSETS.loadImage('background');
const pinkFrame7 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame7 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame7 = GAME_ASSETS.loadImage('rightFrame');
const headerImage7 = GAME_ASSETS.loadImage('header');
const carImage7 = GAME_ASSETS.loadImage('car');
const pumpkinImage7 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage7 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame7 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage7 = GAME_ASSETS.loadImage('boy');
const girlImage7 = GAME_ASSETS.loadImage('girl');
const cheese7 = GAME_ASSETS.loadImage('cheese');
const pear7 = GAME_ASSETS.loadImage('pear');
const pie7 = GAME_ASSETS.loadImage('pie');
const taxi7 = GAME_ASSETS.loadImage('taxi');
const donut7 = GAME_ASSETS.loadImage('donut');
const eight7 = GAME_ASSETS.loadImage('eight');
const elephant7 = GAME_ASSETS.loadImage('elephant');
const four7 = GAME_ASSETS.loadImage('four');
const grape7 = GAME_ASSETS.loadImage('grape');
const orange7 = GAME_ASSETS.loadImage('orange');
const six7 = GAME_ASSETS.loadImage('six');
const two7 = GAME_ASSETS.loadImage('two');
const greenframe7 = GAME_ASSETS.loadImage('greenframe');
const orangeframe7 = GAME_ASSETS.loadImage('orangeframe');
const purpleframe7 = GAME_ASSETS.loadImage('purpleframe');
const redframe7 = GAME_ASSETS.loadImage('redframe');
const leaf7 = GAME_ASSETS.loadImage('leaf');
const correct7 = GAME_ASSETS.loadImage('correct');
const wrong7 = GAME_ASSETS.loadImage('wrong');
const squirle7 = GAME_ASSETS.loadImage('squirle');
const redbaloon7 = GAME_ASSETS.loadImage('redbaloon');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound7 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer7 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding7 = GAME_ASSETS.loadAudio('kidsapplauding');
const backgroundMusic7 = GAME_ASSETS.loadAudio('background');
backgroundMusic7.loop = true;
backgroundMusic7.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let correctMatches7 = new Array(4).fill(false);
let wrongFrames7 = [];
let iconAnimations7 = {
    size: 0,
    opacity: 0
};

let selectedTopFrame7 = null;
let selectedBottomFrame7 = null;
let arrowStartX7 = null;
let arrowStartY7 = null;
let currentMouseX7 = null;
let currentMouseY7 = null;
let isDrawingArrow7 = false;

let gameItems7 = {
    items: [
        { image: grape7, color: 'purple' },
        { image: orange7, color: 'orange' },
        { image: donut7, color: 'pink' },
        { image: leaf7, color: 'green' }
    ],
    frames: [
        { image: greenframe7, color: 'green' },
        { image: redframe7, color: 'pink' },
        { image: purpleframe7, color: 'purple' },
        { image: orangeframe7, color: 'orange' }
    ],
    items2: [
        { image: eight7, color: 'purple' },
        { image: squirle7, color: 'orange' },
        { image: girlImage7, color: 'pink' },
        { image: leaf7, color: 'green' }
    ],
    frames2: [
        { image: greenframe7, color: 'green' },
        { image: redframe7, color: 'pink' },
        { image: purpleframe7, color: 'purple' },
        { image: orangeframe7, color: 'orange' }
    ],
    items3: [
        { image: four7, color: 'purple' },
        { image: pumpkinImage7, color: 'orange' },
        { image: redbaloon7, color: 'pink' },
        { image: leaf7, color: 'green' }
    ],
    frames3: [
        { image: greenframe7, color: 'green' },
        { image: redframe7, color: 'pink' },
        { image: purpleframe7, color: 'purple' },
        { image: orangeframe7, color: 'orange' }
    ],
    currentSet: 0
};

/**
 * 5) Confetti için değişkenler ve sınıf
 */
let confetti7 = [];
let isConfettiActive7 = false;
const COLORS7 = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

class Confetti7 {
    constructor() {
        this.x = Math.random() * canvas7.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS7[Math.floor(Math.random() * COLORS7.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx7.save();
        ctx7.translate(this.x, this.y);
        ctx7.rotate(this.rotation * Math.PI / 180);
        ctx7.fillStyle = this.color;
        ctx7.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx7.restore();
    }
}

/**
 * 6) Yardımcı fonksiyonlar
 */
function startConfetti7() {
    isConfettiActive7 = true;
    confetti7 = [];
    for (let i = 0; i < 100; i++) {
        confetti7.push(new Confetti7());
    }

    setTimeout(() => {
        isConfettiActive7 = false;
        confetti7 = [];
    }, 1000);
}

function animateIcon7(isCorrect) {
    iconAnimations7.size = 0;
    iconAnimations7.opacity = 0;

    const animate = () => {
        iconAnimations7.size = Math.min(1, iconAnimations7.size + 0.1);
        iconAnimations7.opacity = Math.min(1, iconAnimations7.opacity + 0.1);

        if (iconAnimations7.size < 1) {
            requestAnimationFrame(animate);
        }

        if (!isCorrect && iconAnimations7.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations7.size -= 0.1;
                    if (iconAnimations7.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames7 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animate();
}

function checkAllMatches7() {
    return correctMatches7.every(match => match === true);
}

function loadNextSet7() {
    gameItems7.currentSet++;
    if (gameItems7.currentSet === 1) {
        gameItems7.items = gameItems7.items2;
        gameItems7.frames = gameItems7.frames2;
    } else if (gameItems7.currentSet === 2) {
        gameItems7.items = gameItems7.items3;
        gameItems7.frames = gameItems7.frames3;
    }
    correctMatches7 = new Array(4).fill(false);
    wrongFrames7 = [];
}

function drawArrow7(fromX, fromY, toX, toY) {
    ctx7.beginPath();
    ctx7.moveTo(fromX, fromY);
    ctx7.lineTo(toX, toY);
    ctx7.strokeStyle = '#FF69B4';
    ctx7.lineWidth = 4;
    ctx7.stroke();

    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = 20;

    ctx7.beginPath();
    ctx7.moveTo(toX, toY);
    ctx7.lineTo(
        toX - headLen * Math.cos(angle - Math.PI / 6),
        toY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx7.lineTo(
        toX - headLen * Math.cos(angle + Math.PI / 6),
        toY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx7.closePath();
    ctx7.fillStyle = '#FF69B4';
    ctx7.fill();
}

function draw7() {
    ctx7.clearRect(0, 0, canvas7.width, canvas7.height);
    ctx7.drawImage(backgroundImage7, 0, 0, canvas7.width, canvas7.height);

    const headerWidth = canvas7.width * 0.4;
    const headerHeight = headerWidth * (headerImage7.height / headerImage7.width);
    const headerX = (canvas7.width - headerWidth) / 2;
    const headerY = canvas7.height * 0.05;
    ctx7.drawImage(headerImage7, headerX, headerY, headerWidth, headerHeight);

    const frameWidth = canvas7.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas7.width * 0.02;
    const startX = (canvas7.width - (4 * frameWidth + 3 * spacing)) / 2;
    const topY = canvas7.height * 0.2;

    gameItems7.items.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;
        ctx7.drawImage(whiteFrame7, itemX, topY, frameWidth, frameHeight);

        if (wrongFrames7.includes('top' + index)) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations7.size);
            const wrongX = itemX + (frameWidth - currentSize) / 2;
            const wrongY = topY + (frameHeight - currentSize) / 2;

            ctx7.globalAlpha = iconAnimations7.opacity;
            ctx7.drawImage(wrong7, wrongX, wrongY, currentSize, currentSize);
            ctx7.globalAlpha = 1.0;
            return;
        }

        if (!correctMatches7[index]) {
            ctx7.drawImage(item.image,
                itemX + frameWidth * 0.1,
                topY + frameHeight * 0.1,
                frameWidth * 0.8,
                frameHeight * 0.8
            );
        } else {
            ctx7.drawImage(correct7,
                itemX + frameWidth * 0.25,
                topY + frameHeight * 0.25,
                frameWidth * 0.5,
                frameHeight * 0.5
            );
        }
    });

    const bottomY = canvas7.height * 0.55;
    gameItems7.frames.forEach((frame, index) => {
        const frameX = startX + (frameWidth + spacing) * index;
        ctx7.drawImage(frame.image, frameX, bottomY, frameWidth, frameHeight);
    });

    if (isDrawingArrow7 && arrowStartX7 !== null && arrowStartY7 !== null) {
        drawArrow7(arrowStartX7, arrowStartY7, currentMouseX7, currentMouseY7);
    }
}

/**
 * 7) Event listeners
 */
canvas7.addEventListener('mousedown', function(event) {
    backgroundMusic7.play();
    const rect = canvas7.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas7.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas7.width * 0.02;
    const startX = (canvas7.width - (4 * frameWidth + 3 * spacing)) / 2;
    const bottomY = canvas7.height * 0.55;

    for (let i = 0; i < gameItems7.frames.length; i++) {
        const itemX = startX + (frameWidth + spacing) * i;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= bottomY && mouseY <= bottomY + frameHeight) {
            isDrawingArrow7 = true;
            selectedBottomFrame7 = i;
            arrowStartX7 = itemX + frameWidth/2;
            arrowStartY7 = bottomY + frameHeight/2;
            currentMouseX7 = mouseX;
            currentMouseY7 = mouseY;
            break;
        }
    }
});

canvas7.addEventListener('mouseup', function(event) {
    if (!isDrawingArrow7) return;

    const rect = canvas7.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas7.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas7.width * 0.02;
    const startX = (canvas7.width - (4 * frameWidth + 3 * spacing)) / 2;
    const topY = canvas7.height * 0.2;

    for (let i = 0; i < gameItems7.items.length; i++) {
        const itemX = startX + (frameWidth + spacing) * i;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= topY && mouseY <= topY + frameHeight) {
            if (gameItems7.items[i].color === gameItems7.frames[selectedBottomFrame7].color) {
                correctSound7.play();
                kidsapplauding7.play();
                startConfetti7();
                correctMatches7[i] = true;

                document.getElementById('idleGif7').style.display = 'none';
                const gif = document.getElementById('animatedGif7');
                gif.src = '';
                setTimeout(() => {
                    gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
                    gif.style.display = 'block';
                }, 0);

                if (checkAllMatches7()) {
                    setTimeout(() => {
                        isConfettiActive7 = false;
                        // Game7'yi sola kaydır
                        document.getElementById("gameContainer7").style.transform = 'translateX(-100%)';
                        // Game8'i sağdan getir
                        document.getElementById("gameContainer8").classList.add("slide-in");
                        if (typeof animate8 === 'function') {
                            animate8();
                        }
                        gif.style.display = 'none';
                        document.getElementById('idleGif7').style.display = 'block';
                        correctMatches7 = new Array(4).fill(false);
                    }, 2000);
                } else {
                    setTimeout(() => {
                        gif.style.display = 'none';
                        document.getElementById('idleGif7').style.display = 'block';
                    }, 2000);
                }
            } else {
                wrongAnswer7.play();
                wrongFrames7.push('top' + i);
                animateIcon7(false);
            }
            break;
        }
    }

    isDrawingArrow7 = false;
    selectedBottomFrame7 = null;
    arrowStartX7 = null;
    arrowStartY7 = null;
});

canvas7.addEventListener('mousemove', function(event) {
    if (isDrawingArrow7) {
        const rect = canvas7.getBoundingClientRect();
        currentMouseX7 = event.clientX - rect.left;
        currentMouseY7 = event.clientY - rect.top;
    }
});

window.addEventListener('resize', function() {
    canvas7.width = window.innerWidth;
    canvas7.height = window.innerHeight;
    draw7();
});

/**
 * 8) Animasyon döngüsü
 */
function animate7() {
    ctx7.clearRect(0, 0, canvas7.width, canvas7.height);
    draw7();

    if (isDrawingArrow7 && arrowStartX7 !== null && arrowStartY7 !== null) {
        drawArrow7(arrowStartX7, arrowStartY7, currentMouseX7, currentMouseY7);
    }

    if (isConfettiActive7) {
        confetti7.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (particle.y > canvas7.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas7.width;
            }
        });
    }

    requestAnimationFrame(animate7);
}

/**
 * 9) Oyunu başlat
 */
window.onload = function() {
    const gif7 = document.getElementById('animatedGif7');
    const idleGif7 = document.getElementById('idleGif7');
    
    gif7.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif7.style.display = 'none';
    
    idleGif7.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif7.style.display = 'block';
};

animate7(); 