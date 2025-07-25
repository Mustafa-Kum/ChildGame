/************************************************
 *                OYUN 5 (Game5)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas5 = document.getElementById('gameCanvas5');
const ctx5 = canvas5.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas5.width = window.innerWidth;
canvas5.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage5 = GAME_ASSETS.loadImage('background');
const pinkFrame5 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame5 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame5 = GAME_ASSETS.loadImage('rightFrame');
const headerImage5 = GAME_ASSETS.loadImage('header');
const carImage5 = GAME_ASSETS.loadImage('car');
const pumpkinImage5 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage5 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame5 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage5 = GAME_ASSETS.loadImage('boy');
const girlImage5 = GAME_ASSETS.loadImage('girl');
const cheese5 = GAME_ASSETS.loadImage('cheese');
const pear5 = GAME_ASSETS.loadImage('pear');
const pie5 = GAME_ASSETS.loadImage('pie');
const taxi5 = GAME_ASSETS.loadImage('taxi');
const donut5 = GAME_ASSETS.loadImage('donut');
const eight5 = GAME_ASSETS.loadImage('eight');
const elephant5 = GAME_ASSETS.loadImage('elephant');
const four5 = GAME_ASSETS.loadImage('four');
const grape5 = GAME_ASSETS.loadImage('grape');
const orange5 = GAME_ASSETS.loadImage('orange');
const six5 = GAME_ASSETS.loadImage('six');
const two5 = GAME_ASSETS.loadImage('two');
const leaf5 = GAME_ASSETS.loadImage('leaf');
const squirle5 = GAME_ASSETS.loadImage('squirle');
const monkey5 = GAME_ASSETS.loadImage('monkey');
const zebra5 = GAME_ASSETS.loadImage('zebra');
const bull5 = GAME_ASSETS.loadImage('bull');
const questionMark5 = GAME_ASSETS.loadImage('questionmark');
const correct5 = GAME_ASSETS.loadImage('correct');
const wrong5 = GAME_ASSETS.loadImage('wrong');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound5 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer5 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding5 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound5 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic5 = GAME_ASSETS.loadAudio('background');
backgroundMusic5.loop = true;
backgroundMusic5.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let hoveredFrame5 = null;
let previousHoveredFrame5 = null;
let correctFrame5 = null;
let wrongFrames5 = [];
let iconAnimations5 = {
    size: 0,
    opacity: 0
};

let gameItems5 = {
    set1: [
        { image: taxi5, id: 'taxi', category: 'vehicle' },
        { image: cheese5, id: 'cheese', category: 'food' },
        { image: pie5, id: 'pie', category: 'food' },
        { image: pear5, id: 'pear', category: 'food' }
    ],
    currentSet: 0
};

/**
 * 5) Confetti için değişkenler ve sınıf
 */
let confetti5 = [];
let isConfettiActive5 = false;
const COLORS5 = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

class Confetti5 {
    constructor() {
        this.x = Math.random() * canvas5.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS5[Math.floor(Math.random() * COLORS5.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx5.save();
        ctx5.translate(this.x, this.y);
        ctx5.rotate(this.rotation * Math.PI / 180);
        ctx5.fillStyle = this.color;
        ctx5.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx5.restore();
    }
}

/**
 * 6) Yardımcı fonksiyonlar
 */
function startConfetti5() {
    isConfettiActive5 = true;
    confetti5 = [];
    for (let i = 0; i < 100; i++) {
        confetti5.push(new Confetti5());
    }
}

function animateIcon5(isCorrect) {
    iconAnimations5.size = 0;
    iconAnimations5.opacity = 0;

    const animate = () => {
        iconAnimations5.size = Math.min(1, iconAnimations5.size + 0.1);
        iconAnimations5.opacity = Math.min(1, iconAnimations5.opacity + 0.1);

        if (iconAnimations5.size < 1) {
            requestAnimationFrame(animate);
        }

        if (!isCorrect && iconAnimations5.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations5.size -= 0.1;
                    if (iconAnimations5.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames5 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animate();
}

function drawRoundedRect5(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function draw5() {
    ctx5.clearRect(0, 0, canvas5.width, canvas5.height);
    ctx5.drawImage(backgroundImage5, 0, 0, canvas5.width, canvas5.height);

    const headerWidth = canvas5.width * 0.4;
    const headerHeight = headerWidth * (headerImage5.height / headerImage5.width);
    const headerX = (canvas5.width - headerWidth) / 2;
    const headerY = canvas5.height * 0.05;
    ctx5.drawImage(headerImage5, headerX, headerY, headerWidth, headerHeight);

    const frameWidth = canvas5.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas5.width * 0.02;
    const startX = (canvas5.width - (4 * frameWidth + 3 * spacing)) / 2;
    const startY = canvas5.height * 0.3;

    gameItems5.set1.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;

        ctx5.drawImage(whiteFrame5, itemX, startY, frameWidth, frameHeight);

        if (correctFrame5 === index) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations5.size);
            const correctX = itemX + (frameWidth - currentSize) / 2;
            const correctY = startY + (frameHeight - currentSize) / 2;

            ctx5.globalAlpha = iconAnimations5.opacity;
            ctx5.drawImage(correct5, correctX, correctY, currentSize, currentSize);
            ctx5.globalAlpha = 1.0;
        }
        else if (wrongFrames5.includes(index)) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations5.size);
            const wrongX = itemX + (frameWidth - currentSize) / 2;
            const wrongY = startY + (frameHeight - currentSize) / 2;

            ctx5.globalAlpha = iconAnimations5.opacity;
            ctx5.drawImage(wrong5, wrongX, wrongY, currentSize, currentSize);
            ctx5.globalAlpha = 1.0;
        }
        else {
            ctx5.drawImage(item.image,
                itemX + frameWidth * 0.1,
                startY + frameHeight * 0.1,
                frameWidth * 0.8,
                frameHeight * 0.8
            );
        }
    });

    if (hoveredFrame5) {
        ctx5.shadowBlur = 25;
        ctx5.shadowColor = '#ffff00';
        ctx5.lineWidth = 3;

        const gradient = ctx5.createLinearGradient(0, 0, canvas5.width, canvas5.height);
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.5, '#ffffa0');
        gradient.addColorStop(1, '#ffff00');

        ctx5.strokeStyle = gradient;

        let highlightX, highlightY;
        const highlightW = frameWidth;
        const highlightH = frameHeight;
        const cornerRadius = 20;

        const startX = (canvas5.width - (4 * frameWidth + 3 * spacing)) / 2;
        const startY = canvas5.height * 0.3;

        if (hoveredFrame5 === 0) {
            highlightX = startX;
            highlightY = startY;
        } else if (hoveredFrame5 === 1) {
            highlightX = startX + frameWidth + spacing;
            highlightY = startY;
        } else if (hoveredFrame5 === 2) {
            highlightX = startX + (frameWidth + spacing) * 2;
            highlightY = startY;
        } else if (hoveredFrame5 === 3) {
            highlightX = startX + (frameWidth + spacing) * 3;
            highlightY = startY;
        }

        for (let i = 0; i < 2; i++) {
            drawRoundedRect5(ctx5, highlightX, highlightY, highlightW, highlightH, cornerRadius);
            ctx5.stroke();
        }

        const pulseSize = Math.sin(Date.now() * 0.003) * 1.5;
        ctx5.lineWidth = 3 + pulseSize;
        drawRoundedRect5(ctx5, highlightX - pulseSize/2, highlightY - pulseSize/2,
            highlightW + pulseSize, highlightH + pulseSize, cornerRadius);
        ctx5.stroke();

        ctx5.shadowBlur = 0;
        ctx5.shadowColor = 'transparent';
    }
}

function checkAnswer5(selectedItemId) {
    const currentItems = gameItems5.set1;
    const differentItem = currentItems.find(item =>
        currentItems.filter(i => i.category === item.category).length === 1
    );

    if (!differentItem || !selectedItemId) return;

    const selectedIndex = currentItems.findIndex(item => item.id === selectedItemId);

    if (selectedItemId === differentItem.id) {
        correctFrame5 = selectedIndex;
        animateIcon5(true);

        correctSound5.play();
        kidsapplauding5.play();
        startConfetti5();

        document.getElementById('idleGif5').style.display = 'none';
        const gif = document.getElementById('animatedGif5');
        gif.src = '';
        setTimeout(() => {
            gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
            gif.style.display = 'block';
        }, 0);

        setTimeout(() => {
            isConfettiActive5 = false;
            document.getElementById("gameContainer5").style.transform = 'translateX(-100%)';
            document.getElementById("gameContainer6").classList.add("slide-in");
            if (typeof animate6 === 'function') {
                animate6();
            }
            gif.style.display = 'none';
            document.getElementById('idleGif5').style.display = 'block';
            shuffleGameItems5();
        }, 2000);
    } else {
        wrongFrames5.push(selectedIndex);
        animateIcon5(false);
        wrongAnswer5.play();
    }
}

function shuffleGameItems5() {
    isConfettiActive5 = false;
    correctFrame5 = null;
    wrongFrames5 = [];
    iconAnimations5.size = 0;
    iconAnimations5.opacity = 0;

    const allSets = [
        [
            { image: taxi5, id: 'taxi', category: 'vehicle' },
            { image: donut5, id: 'donut', category: 'food' },
            { image: pie5, id: 'pie', category: 'food' },
            { image: cheese5, id: 'cheese', category: 'food' }
        ],
        [
            { image: elephant5, id: 'elephant', category: 'animal' },
            { image: two5, id: 'two', category: 'number' },
            { image: four5, id: 'four', category: 'number' },
            { image: six5, id: 'six', category: 'number' }
        ],
        [
            { image: grape5, id: 'grape', category: 'fruit' },
            { image: orange5, id: 'orange', category: 'fruit' },
            { image: pear5, id: 'pear', category: 'fruit' },
            { image: tractorImage5, id: 'tractor', category: 'vehicle' }
        ],
        [
            { image: monkey5, id: 'monkey', category: 'animal' },
            { image: zebra5, id: 'zebra', category: 'animal' },
            { image: bull5, id: 'bull', category: 'animal' },
            { image: boyImage5, id: 'boy', category: 'human' }
        ],
        [
            { image: elephant5, id: 'elephant', category: 'animal' },
            { image: monkey5, id: 'monkey', category: 'animal' },
            { image: zebra5, id: 'zebra', category: 'animal' },
            { image: taxi5, id: 'taxi', category: 'vehicle' }
        ]
    ];

    const previousSet = [...gameItems5.set1];
    let newSet;
    do {
        newSet = allSets[Math.floor(Math.random() * allSets.length)];
    } while (JSON.stringify(newSet) === JSON.stringify(previousSet) && allSets.length > 1);

    gameItems5.set1 = [...newSet].sort(() => Math.random() - 0.5);
    draw5();
}

/**
 * 7) Event listeners
 */
canvas5.addEventListener('click', function(event) {
    backgroundMusic5.play();

    const rect = canvas5.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas5.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas5.width * 0.02;
    const startX = (canvas5.width - (4 * frameWidth + 3 * spacing)) / 2;
    const startY = canvas5.height * 0.3;

    gameItems5.set1.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= startY && mouseY <= startY + frameHeight) {
            if (item && item.id) {
                checkAnswer5(item.id);
            }
        }
    });
});

canvas5.addEventListener('mousemove', function(event) {
    const rect = canvas5.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas5.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas5.width * 0.02;
    const startX = (canvas5.width - (4 * frameWidth + 3 * spacing)) / 2;
    const startY = canvas5.height * 0.2;

    let newHoveredFrame = null;

    for (let i = 0; i < 4; i++) {
        const frameX = startX + (frameWidth + spacing) * i;
        if (mouseX >= frameX && mouseX <= frameX + frameWidth &&
            mouseY >= startY && mouseY <= startY + frameHeight) {
            newHoveredFrame = i;
            break;
        }
    }

    if (newHoveredFrame !== previousHoveredFrame5 && newHoveredFrame !== null) {
        mouseHoverSound5.play();
    }

    previousHoveredFrame5 = newHoveredFrame;

    if (newHoveredFrame !== hoveredFrame5) {
        hoveredFrame5 = newHoveredFrame;
        draw5();
    }
});

window.addEventListener('resize', function() {
    canvas5.width = window.innerWidth;
    canvas5.height = window.innerHeight;
    draw5();
});

/**
 * 8) Animasyon döngüsü
 */
function animate5() {
    ctx5.clearRect(0, 0, canvas5.width, canvas5.height);
    draw5();

    if (isConfettiActive5) {
        confetti5.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (particle.y > canvas5.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas5.width;
            }
        });
    }

    requestAnimationFrame(animate5);
}

/**
 * 9) Oyunu başlat
 */
window.onload = function() {
    const gif5 = document.getElementById('animatedGif5');
    const idleGif5 = document.getElementById('idleGif5');
    
    gif5.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif5.style.display = 'none';
    
    idleGif5.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif5.style.display = 'block';
};

shuffleGameItems5();
animate5(); 