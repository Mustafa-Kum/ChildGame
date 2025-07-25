/************************************************
 *                OYUN 3 (Game3)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas3 = document.getElementById('gameCanvas3');
const ctx3 = canvas3.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas3.width = window.innerWidth;
canvas3.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage3 = GAME_ASSETS.loadImage('background');
const pinkFrame3 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame3 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame3 = GAME_ASSETS.loadImage('rightFrame');
const headerImage3 = GAME_ASSETS.loadImage('header');
const carImage3 = GAME_ASSETS.loadImage('car');
const pumpkinImage3 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage3 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame3 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage3 = GAME_ASSETS.loadImage('boy');
const girlImage3 = GAME_ASSETS.loadImage('girl');
const cheese3 = GAME_ASSETS.loadImage('cheese');
const pear3 = GAME_ASSETS.loadImage('pear');
const pie3 = GAME_ASSETS.loadImage('pie');
const taxi3 = GAME_ASSETS.loadImage('taxi');
const donut3 = GAME_ASSETS.loadImage('donut');
const elephant3 = GAME_ASSETS.loadImage('elephant');
const grape3 = GAME_ASSETS.loadImage('grape');
const orange3 = GAME_ASSETS.loadImage('orange');
const leaf3 = GAME_ASSETS.loadImage('leaf');
const squirle3 = GAME_ASSETS.loadImage('squirle');
const monkey3 = GAME_ASSETS.loadImage('monkey');
const zebra3 = GAME_ASSETS.loadImage('zebra');
const bull3 = GAME_ASSETS.loadImage('bull');
const correct3 = GAME_ASSETS.loadImage('correct');
const wrong3 = GAME_ASSETS.loadImage('wrong');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound3 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer3 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding3 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound3 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic3 = GAME_ASSETS.loadAudio('background');
backgroundMusic3.loop = true;
backgroundMusic3.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let isDragging3 = false;
let draggedItem3 = null;
let draggedItemX3 = 0;
let draggedItemY3 = 0;
let offsetX3 = 0;
let offsetY3 = 0;
let originalDragPosition3 = { x: 0, y: 0 };
let correctFrame3 = null;
let wrongFrames3 = [];
let iconAnimations3 = {
    size: 0,
    opacity: 0
};

/**
 * 5) Confetti için değişkenler ve sınıf
 */
let confetti3 = [];
let isConfettiActive3 = false;
const COLORS3 = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

class Confetti3 {
    constructor() {
        this.x = Math.random() * canvas3.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS3[Math.floor(Math.random() * COLORS3.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx3.save();
        ctx3.translate(this.x, this.y);
        ctx3.rotate(this.rotation * Math.PI / 180);
        ctx3.fillStyle = this.color;
        ctx3.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx3.restore();
    }
}

/**
 * 6) Oyun itemları ve frame içerikleri
 */
let availableItems3 = [
    { image: girlImage3, matched: false },
    { image: boyImage3, matched: false },
    { image: carImage3, matched: false },
    { image: pumpkinImage3, matched: false },
    { image: cheese3, matched: false },
    { image: pear3, matched: false },
    { image: pie3, matched: false },
    { image: taxi3, matched: false },
    { image: donut3, matched: false },
    { image: elephant3, matched: false },
    { image: grape3, matched: false },
    { image: orange3, matched: false },
    { image: leaf3, matched: false },
    { image: squirle3, matched: false },
    { image: monkey3, matched: false },
    { image: zebra3, matched: false },
    { image: bull3, matched: false }
];

const allItems3 = [
    { image: girlImage3 },
    { image: boyImage3 },
    { image: carImage3 },
    { image: pumpkinImage3 },
    { image: cheese3 },
    { image: pear3 },
    { image: pie3 },
    { image: taxi3 },
    { image: donut3 },
    { image: elephant3 },
    { image: grape3 },
    { image: orange3 },
    { image: leaf3 },
    { image: squirle3 },
    { image: monkey3 },
    { image: zebra3 },
    { image: bull3 }
];

let frameImages3 = [];
let frameContents3 = {};

/**
 * 7) Yardımcı fonksiyonlar
 */
function startConfetti3() {
    isConfettiActive3 = true;
    confetti3 = [];
    for (let i = 0; i < 100; i++) {
        confetti3.push(new Confetti3());
    }
}

function animateIcon3(isCorrect) {
    iconAnimations3.size = 0;
    iconAnimations3.opacity = 0;

    const animate = () => {
        iconAnimations3.size = Math.min(1, iconAnimations3.size + 0.1);
        iconAnimations3.opacity = Math.min(1, iconAnimations3.opacity + 0.1);

        if (iconAnimations3.size < 1) {
            requestAnimationFrame(animate);
        }

        if (!isCorrect && iconAnimations3.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations3.size -= 0.1;
                    if (iconAnimations3.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames3 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animate();
}

function selectRandomItems3() {
    let shuffled = [...allItems3].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 4);

    frameImages3 = selected.map(item => item.image);
    availableItems3 = selected.map(item => ({
        image: item.image,
        matched: false
    }));

    frameContents3 = {
        topLeft: {
            image: frameImages3[0],
            selected: false
        },
        topRight: {
            image: frameImages3[1],
            selected: false
        },
        bottomLeft: {
            image: frameImages3[2],
            selected: false
        },
        bottomRight: {
            image: frameImages3[3],
            selected: false
        }
    };
}

function resetGame3() {
    isConfettiActive3 = false;
    correctFrame3 = null;
    wrongFrames3 = [];
    iconAnimations3.size = 0;
    iconAnimations3.opacity = 0;
    selectRandomItems3();

    availableItems3.forEach(item => {
        item.matched = false;
    });

    // Scale değerlerini ayarla
    const scales = [];
    for(let i = 0; i < 4; i++) {
        scales.push(0.3 + Math.random() * 0.4);
    }

    frameContents3.topLeft.scale = scales[0];
    frameContents3.topRight.scale = scales[1];
    frameContents3.bottomLeft.scale = scales[2];
    frameContents3.bottomRight.scale = scales[3];

    draw3();
}

function checkDropLocation3(x, y) {
    const frameWidth = canvas3.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas3.width * 0.02;
    const startX = (canvas3.width - (4 * frameWidth + 3 * spacing)) / 2;
    const startY = canvas3.height * 0.2;

    for (let i = 0; i < 4; i++) {
        const frameX = startX + (frameWidth + spacing) * i;
        if (x >= frameX && x <= frameX + frameWidth &&
            y >= startY && y <= startY + frameHeight) {

            if (draggedItem3.image === frameImages3[i]) {
                draggedItem3.matched = true;
                correctSound3.play();
                kidsapplauding3.play();
                startConfetti3();
                correctFrame3 = `frame${i}`;
                animateIcon3(true);

                const allMatched = availableItems3.every(item => item.matched);
                if (allMatched) {
                    setTimeout(() => {
                        isConfettiActive3 = false;
                        // Game3'ü sola kaydır
                        document.getElementById("gameContainer3").style.transform = 'translateX(-100%)';
                        // Game4'ü sağdan getir
                        document.getElementById("gameContainer4").classList.add("slide-in");
                        // Initialize game4
                        if (typeof animate4 === 'function') {
                            animate4();
                        }
                    }, 3000);
                }

                document.getElementById('idleGif3').style.display = 'none';
                const gif = document.getElementById('animatedGif3');
                gif.src = '';
                setTimeout(() => {
                    gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
                    gif.style.display = 'block';
                }, 0);

                setTimeout(() => {
                    correctFrame3 = null;
                    gif.style.display = 'none';
                    document.getElementById('idleGif3').style.display = 'block';
                }, 2000);

                return true;
            } else {
                wrongAnswer3.play();
                wrongFrames3.push(`frame${i}`);
                animateIcon3(false);
                return false;
            }
        }
    }
    return false;
}

/**
 * 8) Çizim fonksiyonları
 */
function draw3() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx3.drawImage(backgroundImage3, 0, 0, canvas3.width, canvas3.height);

    const headerWidth = canvas3.width * 0.4;
    const headerHeight = headerWidth * (headerImage3.height / headerImage3.width);
    const headerX = (canvas3.width - headerWidth) / 2;
    const headerY = canvas3.height * 0.05;
    ctx3.drawImage(headerImage3, headerX, headerY, headerWidth, headerHeight);

    const frameWidth = canvas3.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas3.width * 0.02;
    const startX = (canvas3.width - (4 * frameWidth + 3 * spacing)) / 2;
    const startY = canvas3.height * 0.2;

    // Üst frame'leri çiz
    for(let i = 0; i < 4; i++) {
        const currentFrameName = `frame${i}`;
        const frameX = startX + (frameWidth + spacing) * i;
        const frameY = startY;

        ctx3.drawImage(whiteFrame3, frameX, frameY, frameWidth, frameHeight);

        if (correctFrame3 === currentFrameName) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations3.size);
            const correctX = frameX + (frameWidth - currentSize) / 2;
            const correctY = frameY + (frameHeight - currentSize) / 2;

            ctx3.globalAlpha = iconAnimations3.opacity;
            ctx3.drawImage(correct3, correctX, correctY, currentSize, currentSize);
            ctx3.globalAlpha = 1.0;
            continue;
        }

        if (wrongFrames3.includes(currentFrameName)) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations3.size);
            const wrongX = frameX + (frameWidth - currentSize) / 2;
            const wrongY = frameY + (frameHeight - currentSize) / 2;

            ctx3.globalAlpha = iconAnimations3.opacity;
            ctx3.drawImage(wrong3, wrongX, wrongY, currentSize, currentSize);
            ctx3.globalAlpha = 1.0;
            continue;
        }

        const matchedItem = availableItems3.find(item =>
            item.matched && item.image === frameImages3[i]);
        if (matchedItem) {
            ctx3.drawImage(matchedItem.image,
                frameX + frameWidth * 0.1,
                frameY + frameHeight * 0.1,
                frameWidth * 0.8,
                frameHeight * 0.8);
        } else {
            ctx3.save();
            ctx3.globalAlpha = 0.3;
            ctx3.drawImage(frameImages3[i],
                frameX + frameWidth * 0.1,
                frameY + frameHeight * 0.1,
                frameWidth * 0.8,
                frameHeight * 0.8);
            ctx3.restore();
        }
    }

    // Alt panel ve itemları çiz
    const bottomPanelY = canvas3.height * 0.6;
    const bottomPanelHeight = frameHeight;
    const bottomPanelWidth = canvas3.width * 0.7;

    ctx3.drawImage(horizontalPinkFrame3,
        (canvas3.width - bottomPanelWidth) / 2,
        bottomPanelY,
        bottomPanelWidth,
        bottomPanelHeight);

    availableItems3.forEach((item, index) => {
        if (!item.matched && (!isDragging3 || item !== draggedItem3)) {
            const itemX = startX + (frameWidth + spacing) * index;
            const itemY = bottomPanelY + (bottomPanelHeight - frameHeight) / 2 + 20;

            ctx3.drawImage(item.image,
                itemX,
                itemY,
                frameWidth * 0.8,
                frameHeight * 0.8);
        }
    });

    if (isDragging3 && draggedItem3) {
        ctx3.drawImage(draggedItem3.image,
            draggedItemX3,
            draggedItemY3,
            frameWidth * 0.8,
            frameHeight * 0.8);
    }
}

/**
 * 9) Event listeners
 */
canvas3.addEventListener('mousedown', function(event) {
    const rect = canvas3.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const frameWidth = canvas3.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas3.width * 0.02;
    const startX = (canvas3.width - (4 * frameWidth + 3 * spacing)) / 2;
    const bottomPanelY = canvas3.height * 0.6;

    availableItems3.forEach((item, index) => {
        if (!item.matched) {
            const itemX = startX + (frameWidth + spacing) * index;
            const itemY = bottomPanelY + (frameHeight - frameHeight) / 2 + 20;

            if (x >= itemX && x <= itemX + frameWidth * 0.8 &&
                y >= itemY && y <= itemY + frameHeight * 0.8) {
                isDragging3 = true;
                draggedItem3 = item;
                offsetX3 = x - itemX;
                offsetY3 = y - itemY;
                originalDragPosition3 = { x: itemX, y: itemY };
            }
        }
    });
});

canvas3.addEventListener('mousemove', function(event) {
    if (isDragging3 && draggedItem3) {
        const rect = canvas3.getBoundingClientRect();
        draggedItemX3 = event.clientX - rect.left - offsetX3;
        draggedItemY3 = event.clientY - rect.top - offsetY3;
        requestAnimationFrame(draw3);
    }
});

canvas3.addEventListener('mouseup', function(event) {
    if (isDragging3 && draggedItem3) {
        const rect = canvas3.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const isDropped = checkDropLocation3(x, y);

        if (!isDropped) {
            draggedItemX3 = originalDragPosition3.x;
            draggedItemY3 = originalDragPosition3.y;
        }

        isDragging3 = false;
        draggedItem3 = null;
        requestAnimationFrame(draw3);
    }
});

window.addEventListener('resize', function() {
    canvas3.width = window.innerWidth;
    canvas3.height = window.innerHeight;
    draw3();
});

/**
 * 10) Animasyon döngüsü
 */
function animate3() {
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    draw3();

    if (isConfettiActive3) {
        confetti3.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (particle.y > canvas3.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas3.width;
            }
        });
    }

    requestAnimationFrame(animate3);
}

/**
 * 11) Oyunu başlat
 */
window.onload = function() {
    const gif3 = document.getElementById('animatedGif3');
    const idleGif3 = document.getElementById('idleGif3');
    
    gif3.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif3.style.display = 'none';
    
    idleGif3.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif3.style.display = 'block';
};

selectRandomItems3();
animate3(); 