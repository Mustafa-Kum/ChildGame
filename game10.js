/************************************************
 *                OYUN 10 (Game10)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas10 = document.getElementById('gameCanvas10');
const ctx10 = canvas10.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas10.width = window.innerWidth;
canvas10.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage10 = GAME_ASSETS.loadImage('background');
const pinkFrame10 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame10 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame10 = GAME_ASSETS.loadImage('whiteFrame');
const headerImage10 = GAME_ASSETS.loadImage('header');
const carImage10 = GAME_ASSETS.loadImage('car');
const pumpkinImage10 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage10 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame10 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage10 = GAME_ASSETS.loadImage('boy');
const girlImage10 = GAME_ASSETS.loadImage('girl');
const cheese10 = GAME_ASSETS.loadImage('cheese');
const pear10 = GAME_ASSETS.loadImage('pear');
const pie10 = GAME_ASSETS.loadImage('pie');
const taxi10 = GAME_ASSETS.loadImage('taxi');
const donut10 = GAME_ASSETS.loadImage('donut');
const eight10 = GAME_ASSETS.loadImage('eight');
const elephant10 = GAME_ASSETS.loadImage('elephant');
const four10 = GAME_ASSETS.loadImage('four');
const grape10 = GAME_ASSETS.loadImage('grape');
const orange10 = GAME_ASSETS.loadImage('orange');
const six10 = GAME_ASSETS.loadImage('six');
const two10 = GAME_ASSETS.loadImage('two');
const greenframe10 = GAME_ASSETS.loadImage('greenframe');
const orangeframe10 = GAME_ASSETS.loadImage('orangeframe');
const purpleframe10 = GAME_ASSETS.loadImage('purpleframe');
const redframe10 = GAME_ASSETS.loadImage('redframe');
const leaf10 = GAME_ASSETS.loadImage('leaf');
const lowerletterb10 = GAME_ASSETS.loadImage('lowerletterb');
const lowerletterh10 = GAME_ASSETS.loadImage('lowerletterh');
const lowerletterm10 = GAME_ASSETS.loadImage('lowerletterm');
const lowerlettery10 = GAME_ASSETS.loadImage('lowerlettery');
const upperletterb10 = GAME_ASSETS.loadImage('upperletterb');
const upperletterh10 = GAME_ASSETS.loadImage('upperletterh');
const upperletterm10 = GAME_ASSETS.loadImage('upperletterm');
const upperlettery10 = GAME_ASSETS.loadImage('upperlettery');
const correct10 = GAME_ASSETS.loadImage('correct');
const wrong10 = GAME_ASSETS.loadImage('wrong');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound10 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer10 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding10 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound10 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic10 = GAME_ASSETS.loadAudio('background');
backgroundMusic10.loop = true;
backgroundMusic10.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let selectedTopFrame10 = null;
let selectedBottomFrame10 = null;
let arrowStartX10 = null;
let arrowStartY10 = null;
let currentMouseX10 = null;
let currentMouseY10 = null;
let isDrawingArrow10 = false;
let iconAnimations10 = {
    size: 0,
    opacity: 0
};
let correctFrame10 = null;
let wrongFrames10 = [];
let confetti10 = [];
let isConfettiActive10 = false;

/**
 * 5) Game Items
 */
let gameItems10 = {
    items: [
        { image: GAME_ASSETS.loadImage('lowerletterh'), letter: 'h', matches: 'H' },
        { image: GAME_ASSETS.loadImage('lowerlettery'), letter: 'y', matches: 'Y' },
        { image: GAME_ASSETS.loadImage('lowerletterm'), letter: 'm', matches: 'M' },
        { image: GAME_ASSETS.loadImage('lowerletterb'), letter: 'b', matches: 'B' }
    ],
    frames: [
        { image: GAME_ASSETS.loadImage('upperletterm'), letter: 'M', matches: 'm' },
        { image: GAME_ASSETS.loadImage('upperlettery'), letter: 'Y', matches: 'y' },
        { image: GAME_ASSETS.loadImage('upperletterh'), letter: 'H', matches: 'h' },
        { image: GAME_ASSETS.loadImage('upperletterb'), letter: 'B', matches: 'b' }
    ],
    currentSet: 0
};

/**
 * 6) Classes
 */
class Confetti10 {
    constructor() {
        this.x = Math.random() * canvas10.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx10.save();
        ctx10.translate(this.x, this.y);
        ctx10.rotate(this.rotation * Math.PI / 180);
        ctx10.fillStyle = this.color;
        ctx10.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx10.restore();
    }
}

/**
 * 7) Helper Functions
 */
function animateIcon10(isCorrect) {
    iconAnimations10.size = 0;
    iconAnimations10.opacity = 0;

    const animate = () => {
        iconAnimations10.size = Math.min(1, iconAnimations10.size + 0.1);
        iconAnimations10.opacity = Math.min(1, iconAnimations10.opacity + 0.1);

        if (iconAnimations10.size < 1) {
            requestAnimationFrame(animate);
        }

        if (!isCorrect && iconAnimations10.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations10.size -= 0.1;
                    if (iconAnimations10.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames10 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animate();
}

function startConfetti10() {
    isConfettiActive10 = true;
    confetti10 = [];
    for (let i = 0; i < 100; i++) {
        confetti10.push(new Confetti10());
    }

    setTimeout(() => {
        isConfettiActive10 = false;
        confetti10 = [];
    }, 3000);
}

function drawObjects10(frameX, frameY, frameWidth, frameHeight, object, frameName) {
    if (correctFrame10 === frameName) {
        const maxSize = frameWidth * 0.7;
        const currentSize = maxSize * (iconAnimations10.size);
        const correctX = frameX + (frameWidth - currentSize) / 2;
        const correctY = frameY + (frameHeight - currentSize) / 2;

        ctx10.globalAlpha = iconAnimations10.opacity;
        ctx10.drawImage(correct10, correctX, correctY, currentSize, currentSize);
        ctx10.globalAlpha = 1.0;
        return;
    }

    if (wrongFrames10.includes(frameName)) {
        const maxSize = frameWidth * 0.7;
        const currentSize = maxSize * (iconAnimations10.size);
        const wrongX = frameX + (frameWidth - currentSize) / 2;
        const wrongY = frameY + (frameHeight - currentSize) / 2;

        ctx10.globalAlpha = iconAnimations10.opacity;
        ctx10.drawImage(wrong10, wrongX, wrongY, currentSize, currentSize);
        ctx10.globalAlpha = 1.0;
        return;
    }

    const margin = frameWidth * 0.1;
    ctx10.drawImage(object.image,
        frameX + margin,
        frameY + margin,
        frameWidth - (margin * 2),
        frameHeight - (margin * 2)
    );
}

function drawArrow10(fromX, fromY, toX, toY) {
    ctx10.beginPath();
    ctx10.moveTo(fromX, fromY);
    ctx10.lineTo(toX, toY);
    ctx10.strokeStyle = '#FF69B4';
    ctx10.lineWidth = 4;
    ctx10.stroke();

    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLen = 20;

    ctx10.beginPath();
    ctx10.moveTo(toX, toY);
    ctx10.lineTo(
        toX - headLen * Math.cos(angle - Math.PI / 6),
        toY - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx10.lineTo(
        toX - headLen * Math.cos(angle + Math.PI / 6),
        toY - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx10.closePath();
    ctx10.fillStyle = '#FF69B4';
    ctx10.fill();
}

function checkMatch10(itemIndex, frameIndex) {
    const item = gameItems10.items[itemIndex];
    const frame = gameItems10.frames[frameIndex];
    return item.matches === frame.letter;
}

function draw10() {
    ctx10.clearRect(0, 0, canvas10.width, canvas10.height);
    ctx10.drawImage(backgroundImage10, 0, 0, canvas10.width, canvas10.height);

    const headerWidth = canvas10.width * 0.4;
    const headerHeight = headerWidth * (headerImage10.height / headerImage10.width);
    const headerX = (canvas10.width - headerWidth) / 2;
    const headerY = canvas10.height * 0.05;
    ctx10.drawImage(headerImage10, headerX, headerY, headerWidth, headerHeight);

    const frameWidth = canvas10.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas10.width * 0.02;
    const startX = (canvas10.width - (4 * frameWidth + 3 * spacing)) / 2;

    const topY = canvas10.height * 0.2;
    gameItems10.frames.forEach((frame, index) => {
        const frameX = startX + (frameWidth + spacing) * index;
        ctx10.drawImage(whiteFrame10, frameX, topY, frameWidth, frameHeight);
        drawObjects10(frameX, topY, frameWidth, frameHeight, frame, 'top' + index);
    });

    const bottomY = canvas10.height * 0.55;
    gameItems10.items.forEach((item, index) => {
        const frameX = startX + (frameWidth + spacing) * index;
        ctx10.drawImage(whiteFrame10, frameX, bottomY, frameWidth, frameHeight);
        drawObjects10(frameX, bottomY, frameWidth, frameHeight, item, 'bottom' + index);
    });

    if (isDrawingArrow10 && arrowStartX10 !== null && arrowStartY10 !== null) {
        drawArrow10(arrowStartX10, arrowStartY10, currentMouseX10, currentMouseY10);
    }
}

/**
 * 8) Event Handlers
 */
function handleMouseDown10(event) {
    const rect = canvas10.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas10.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas10.width * 0.02;
    const startX = (canvas10.width - (4 * frameWidth + 3 * spacing)) / 2;
    const bottomY = canvas10.height * 0.55;

    for (let i = 0; i < gameItems10.frames.length; i++) {
        const itemX = startX + (frameWidth + spacing) * i;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= bottomY && mouseY <= bottomY + frameHeight) {
            isDrawingArrow10 = true;
            selectedBottomFrame10 = i;
            arrowStartX10 = itemX + frameWidth/2;
            arrowStartY10 = bottomY + frameHeight/2;
            currentMouseX10 = mouseX;
            currentMouseY10 = mouseY;
            break;
        }
    }
}

function handleMouseUp10(event) {
    if (!isDrawingArrow10 || selectedBottomFrame10 === null) return;

    const rect = canvas10.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas10.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas10.width * 0.02;
    const startX = (canvas10.width - (4 * frameWidth + 3 * spacing)) / 2;
    const topY = canvas10.height * 0.2;

    for (let i = 0; i < gameItems10.frames.length; i++) {
        const frameX = startX + (frameWidth + spacing) * i;
        if (mouseX >= frameX && mouseX <= frameX + frameWidth &&
            mouseY >= topY && mouseY <= topY + frameHeight) {

            const matched = checkMatch10(selectedBottomFrame10, i);

            if (matched) {
                correctFrame10 = 'top' + i;
                animateIcon10(true);
                correctSound10.play();
                kidsapplauding10.play();
                startConfetti10();

                document.getElementById('idleGif10').style.display = 'none';
                const gif = document.getElementById('animatedGif10');
                gif.src = '';
                setTimeout(() => {
                    gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
                    gif.style.display = 'block';
                }, 0);

                setTimeout(() => {
                    isConfettiActive10 = false;
                    // Game10'u sola kaydır
                    document.getElementById("gameContainer10").style.transform = 'translateX(-100%)';
                    // Game11'i sağdan getir (eğer varsa)
                    const game11Container = document.getElementById("gameContainer11");
                    if (game11Container) {
                        game11Container.classList.add("slide-in");
                        if (typeof animate11 === 'function') {
                            animate11();
                        }
                    }
                    gif.style.display = 'none';
                    document.getElementById('idleGif10').style.display = 'block';
                    correctFrame10 = null;
                    wrongFrames10 = [];
                }, 2000);
            } else {
                wrongFrames10.push('top' + i);
                animateIcon10(false);
                wrongAnswer10.play();
            }
            break;
        }
    }

    isDrawingArrow10 = false;
    selectedBottomFrame10 = null;
    arrowStartX10 = null;
    arrowStartY10 = null;
}

function handleMouseMove10(event) {
    if (isDrawingArrow10) {
        const rect = canvas10.getBoundingClientRect();
        currentMouseX10 = event.clientX - rect.left;
        currentMouseY10 = event.clientY - rect.top;
    }
}

/**
 * 9) Event Listeners
 */
canvas10.addEventListener('mousedown', function(event) {
    backgroundMusic10.play();
    handleMouseDown10(event);
});

canvas10.addEventListener('mouseup', handleMouseUp10);
canvas10.addEventListener('mousemove', handleMouseMove10);

window.addEventListener('resize', function() {
    canvas10.width = window.innerWidth;
    canvas10.height = window.innerHeight;
    draw10();
});

/**
 * 10) Animation Loop
 */
function animate10() {
    ctx10.clearRect(0, 0, canvas10.width, canvas10.height);
    draw10();

    if (isDrawingArrow10 && arrowStartX10 !== null && arrowStartY10 !== null) {
        drawArrow10(arrowStartX10, arrowStartY10, currentMouseX10, currentMouseY10);
    }

    if (isConfettiActive10) {
        confetti10.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.y > canvas10.height) {
                confetti10.splice(index, 1);
            }
        });
    }

    requestAnimationFrame(animate10);
}

/**
 * 11) Initialize
 */
window.onload = function() {
    const gif10 = document.getElementById('animatedGif10');
    const idleGif10 = document.getElementById('idleGif10');
    
    gif10.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif10.style.display = 'none';
    
    idleGif10.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif10.style.display = 'block';
};

animate10(); 