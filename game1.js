/************************************************
 *                OYUN 1 (Game1)
 ************************************************/

/**
 * 1) Gerekli DOM elemanlarını, canvas ve context'i al.
 */
const canvas1 = document.getElementById("gameCanvas1");
const ctx = canvas1.getContext("2d");

// Canvas boyutlarını ekrana göre ayarla
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;

// Preload all assets before starting the game
let assetsLoaded = false;
GAME_ASSETS.preloadAllAssets(
    (progress) => {
        // Update loading progress if needed
        console.log(`Loading assets: ${progress.toFixed(1)}%`);
    },
    () => {
        console.log('All assets loaded!');
        assetsLoaded = true;
        animate(); // Start game1 animation after assets are loaded
    }
);

/**
 * 2) Resimlerin yüklenmesi
 */
const backgroundImage = GAME_ASSETS.loadImage('background');
const pinkFrame = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame = GAME_ASSETS.loadImage('rightFrame');
const headerImage = GAME_ASSETS.loadImage('header');
const carImage = GAME_ASSETS.loadImage('car');
const pumpkinImage = GAME_ASSETS.loadImage('pumpkin');
const tractorImage = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage = GAME_ASSETS.loadImage('boy');
const girlImage = GAME_ASSETS.loadImage('girl');
const cheese = GAME_ASSETS.loadImage('cheese');
const pear = GAME_ASSETS.loadImage('pear');
const pie = GAME_ASSETS.loadImage('pie');
const taxi = GAME_ASSETS.loadImage('taxi');
const donut = GAME_ASSETS.loadImage('donut');
const eight = GAME_ASSETS.loadImage('eight');
const elephant = GAME_ASSETS.loadImage('elephant');
const four = GAME_ASSETS.loadImage('four');
const grape = GAME_ASSETS.loadImage('grape');
const orange = GAME_ASSETS.loadImage('orange');
const six = GAME_ASSETS.loadImage('six');
const two = GAME_ASSETS.loadImage('two');
const greenframe = GAME_ASSETS.loadImage('greenframe');
const orangeframe = GAME_ASSETS.loadImage('orangeframe');
const purpleframe = GAME_ASSETS.loadImage('purpleframe');
const redframe = GAME_ASSETS.loadImage('redframe');
const leaf = GAME_ASSETS.loadImage('leaf');
const squirle = GAME_ASSETS.loadImage('squirle');
const monkey = GAME_ASSETS.loadImage('monkey');
const zebra = GAME_ASSETS.loadImage('zebra');
const bull = GAME_ASSETS.loadImage('bull');
const orangebaloon = GAME_ASSETS.loadImage('orangebaloon');
const purplebaloon = GAME_ASSETS.loadImage('purplebaloon');
const redbaloon = GAME_ASSETS.loadImage('redbaloon');
const correct = GAME_ASSETS.loadImage('correct');
const wrong = GAME_ASSETS.loadImage('wrong');
const tutorialHand = GAME_ASSETS.loadImage('tutorialHand');

/**
 * 3) Toplam resim sayısını izle ve yüklemelerin bitmesini bekle.
 */
let loadedImages = 0;
let isTutorialActive = true;
let totalImages = 37;

// Her resim yüklendikçe sayaç artar.
function imageLoaded() {
    loadedImages++;
    if (loadedImages === totalImages) {
        animate();
    }
}

// onload event'leri
backgroundImage.onload = imageLoaded;
pinkFrame.onload = imageLoaded;
whiteFrame.onload = imageLoaded;
rightFrame.onload = imageLoaded;
headerImage.onload = imageLoaded;
carImage.onload = imageLoaded;
pumpkinImage.onload = imageLoaded;
tractorImage.onload = imageLoaded;
horizontalPinkFrame.onload = imageLoaded;
boyImage.onload = imageLoaded;
girlImage.onload = imageLoaded;
cheese.onload = imageLoaded;
pear.onload = imageLoaded;
pie.onload = imageLoaded;
taxi.onload = imageLoaded;
donut.onload = imageLoaded;
eight.onload = imageLoaded;
elephant.onload = imageLoaded;
four.onload = imageLoaded;
grape.onload = imageLoaded;
orange.onload = imageLoaded;
six.onload = imageLoaded;
two.onload = imageLoaded;
greenframe.onload = imageLoaded;
orangeframe.onload = imageLoaded;
purpleframe.onload = imageLoaded;
redframe.onload = imageLoaded;
leaf.onload = imageLoaded;
squirle.onload = imageLoaded;
monkey.onload = imageLoaded;
zebra.onload = imageLoaded;
bull.onload = imageLoaded;
orangebaloon.onload = imageLoaded;
purplebaloon.onload = imageLoaded;
redbaloon.onload = imageLoaded;
correct.onload = imageLoaded;
wrong.onload = imageLoaded;
tutorialHand.onload = imageLoaded;

/**
 * 4) Oyun ses dosyaları
 */
const correctSound = GAME_ASSETS.loadAudio('correct');
const wrongAnswer = GAME_ASSETS.loadAudio('wrong');
const oneSound = GAME_ASSETS.loadAudio('one');
const twoSound = GAME_ASSETS.loadAudio('two');
const threeSound = GAME_ASSETS.loadAudio('three');
const fourSound = GAME_ASSETS.loadAudio('four');
const fiveSound = GAME_ASSETS.loadAudio('five');
const sixSound = GAME_ASSETS.loadAudio('six');
const kidsapplauding = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic = GAME_ASSETS.loadAudio('background');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.1;

/**
 * 5) Tutorial, animasyon, confetti vs. için global değişkenler
 */
let frameContents = {
    left: {
        image: carImage,
        count: 2
    },
    middle: {
        image: pumpkinImage,
        count: 3
    },
    right: {
        image: tractorImage,
        count: 4
    }
};

let loaded = false;
let isClickable = false;  // Tıklamaları kontrol
let hoveredFrame = null;
let correctFrame = null;
let wrongFrames = [];
let tutorialStep = 0;

// Elin (tutorialHand) animasyonu
let handPosition = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
let targetPosition = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
let handScale = 1;

// Sayı gösterim animasyonu
let countText = "";
let countTextPosition = { x: 0, y: 0 };
let countTextScale = 0;
let countTextOpacity = 0;

// Confetti
let confetti = [];
let isConfettiActive = false;
const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

// Confetti sınıfı
class ConfettiPiece {
    constructor() {
        this.x = Math.random() * canvas1.width;
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
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.restore();
    }
}

/**
 * 6) Rastgele nesneler, sayılar, vs. (Örnek)
 */
const gameObjects = {
    foods: [cheese, pear, pie, donut, grape, orange],
    vehicles: [carImage, taxi, tractorImage],
    animals: [elephant, squirle, monkey, zebra, bull],
    numbers: [two, four, six, eight],
    decorations: [leaf, pumpkinImage]
};

function getRandomImage(category) {
    const images = gameObjects[category];
    return images[Math.floor(Math.random() * images.length)];
}

/**
 * 7) Konfeti başlatma fonksiyonu
 */
function startConfetti() {
    isConfettiActive = true;
    confetti = [];
    for (let i = 0; i < 100; i++) {
        confetti.push(new ConfettiPiece());
    }
}

/**
 * 8) Tutorial (öğretici) ile ilgili fonksiyonlar
 */
function moveToNextItem() {
    // Kaç adet item var -> left, middle, right
    const frameData = [
        { frame: 'left', items: frameContents.left.count },
        { frame: 'middle', items: frameContents.middle.count },
        { frame: 'right', items: frameContents.right.count }
    ];

    const currentFrame = frameData[Math.floor(tutorialStep / 5)];
    if (!currentFrame) {
        // Tutorial bitti
        isTutorialActive = false;
        isClickable = true;
        return;
    }

    const itemIndex = tutorialStep % 5;
    if (itemIndex >= currentFrame.items) {
        // Bir sonraki frame'e geç
        tutorialStep = Math.floor(tutorialStep / 5 + 1) * 5;
        setTimeout(moveToNextItem, 1000);
        return;
    }

    // Frame pozisyonlarını hesapla
    const spacing = canvas1.width * 0.02;
    const frameWidth = canvas1.width * 0.2;
    const frameHeight = frameWidth * (pinkFrame.height / pinkFrame.width);
    const totalWidth = 3 * frameWidth + 2 * spacing;
    const startX = (canvas1.width - totalWidth) / 2;
    const frameY = (canvas1.height - frameHeight) / 2 + canvas1.height * 0.05;

    // Item pozisyonu
    const margin = frameWidth * 0.15;
    const objectSize = Math.min(frameWidth - margin * 2, frameHeight - margin * 2) * 0.7;
    const row = Math.floor(itemIndex / 2);
    const col = itemIndex % 2;

    let frameX = startX;
    if (currentFrame.frame === 'middle') frameX += frameWidth + spacing;
    if (currentFrame.frame === 'right') frameX += 2 * frameWidth + 2 * spacing;

    targetPosition.x = frameX + margin + col * objectSize + objectSize/2;
    targetPosition.y = frameY + margin + row * objectSize + objectSize/2;

    // Sayı pozisyonu
    countTextPosition = {
        x: targetPosition.x,
        y: targetPosition.y - objectSize/2 - 20
    };
    countText = (itemIndex + 1).toString();
    countTextScale = 0;
    countTextOpacity = 0;

    // Sayı sesini çal
    switch (itemIndex + 1) {
        case 1: oneSound.play(); break;
        case 2: twoSound.play(); break;
        case 3: threeSound.play(); break;
        case 4: fourSound.play(); break;
        case 5: fiveSound.play(); break;
        case 6: sixSound.play(); break;
    }

    tutorialStep++;
    setTimeout(moveToNextItem, 2500);
}

function updateTutorialHand() {
    if (!isTutorialActive) return;
    const speed = 0.02;
    handPosition.x += (targetPosition.x - handPosition.x) * speed;
    handPosition.y += (targetPosition.y - handPosition.y) * speed;

    if (Math.abs(handPosition.x - targetPosition.x) < 10 &&
        Math.abs(handPosition.y - targetPosition.y) < 10) {
        // El yerine ulaşınca scale animasyonu
        handScale = 1 + 0.2 * Math.sin(Date.now() * 0.002);

        // Metin animasyonu
        countTextScale = Math.min(1, countTextScale + 0.03);
        countTextOpacity = Math.min(1, countTextOpacity + 0.03);
    }
}

function drawTutorialHand() {
    if (!isTutorialActive) return;
    const baseHandSize = 100;
    const handSize = baseHandSize * handScale;
    ctx.save();
    ctx.drawImage(
        tutorialHand,
        handPosition.x - handSize/2,
        handPosition.y - handSize/2,
        handSize,
        handSize
    );
    ctx.restore();

    if (countText) {
        ctx.save();
        ctx.globalAlpha = countTextOpacity;
        const fontSize = 60 * countTextScale;
        ctx.font = `${fontSize}px 'Fredoka One', cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Outline
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(countText, countTextPosition.x, countTextPosition.y);

        // Ana renk
        ctx.fillStyle = '#FF4081';
        ctx.fillText(countText, countTextPosition.x, countTextPosition.y);

        // Parlaklık efekti
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = countTextOpacity * 0.3;
        ctx.fillText(countText, countTextPosition.x, countTextPosition.y);
        ctx.restore();
    }
}

/**
 * 9) Doğru/yanlış cevap kontrolü ve animasyonlar
 */
let iconAnimations = { size: 0, opacity: 0 };

function animateIcon(isCorrect) {
    iconAnimations.size = 0;
    iconAnimations.opacity = 0;

    const anim = () => {
        iconAnimations.size = Math.min(1, iconAnimations.size + 0.1);
        iconAnimations.opacity = Math.min(1, iconAnimations.opacity + 0.1);

        if (iconAnimations.size < 1) {
            requestAnimationFrame(anim);
        }

        // Yanlış cevapta 1sn sonra kaybolma
        if (!isCorrect && iconAnimations.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations.size -= 0.1;
                    if (iconAnimations.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };
    anim();
}

function drawObjects(frameX, frameY, frameWidth, frameHeight, object, frameName) {
    // Doğru frame mi?
    if (correctFrame === frameName) {
        const maxSize = frameWidth * 0.7;
        const currentSize = maxSize * iconAnimations.size;
        const xPos = frameX + (frameWidth - currentSize) / 2;
        const yPos = frameY + (frameHeight - currentSize) / 2;
        ctx.globalAlpha = iconAnimations.opacity;
        ctx.drawImage(correct, xPos, yPos, currentSize, currentSize);
        ctx.globalAlpha = 1.0;
        return;
    }
    // Yanlış frame mi?
    if (wrongFrames.includes(frameName)) {
        const maxSize = frameWidth * 0.7;
        const currentSize = maxSize * iconAnimations.size;
        const xPos = frameX + (frameWidth - currentSize) / 2;
        const yPos = frameY + (frameHeight - currentSize) / 2;
        ctx.globalAlpha = iconAnimations.opacity;
        ctx.drawImage(wrong, xPos, yPos, currentSize, currentSize);
        ctx.globalAlpha = 1.0;
        return;
    }

    // Normal nesneleri çiz
    if (!isTutorialActive && isClickable) {
        ctx.save();
        const fontSize = frameWidth * 0.15;
        ctx.font = `${fontSize}px 'Fredoka One', cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Outline
        ctx.lineWidth = fontSize * 0.15;
        ctx.strokeStyle = '#000000';
        ctx.strokeText(
            object.count.toString(),
            frameX + frameWidth/2,
            frameY + frameHeight + fontSize
        );
        // Ana text
        ctx.fillStyle = '#FF4081';
        ctx.fillText(
            object.count.toString(),
            frameX + frameWidth/2,
            frameY + frameHeight + fontSize
        );

        // Parlaklık
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.3;
        ctx.fillText(
            object.count.toString(),
            frameX + frameWidth/2,
            frameY + frameHeight + fontSize
        );
        ctx.restore();
    }

    // Nesnenin kendisini (count kadar) çiz
    const margin = frameWidth * 0.15;
    const usableWidth = frameWidth - (margin * 2);
    const usableHeight = frameHeight - (margin * 2);
    const objectSize = Math.min(usableWidth, usableHeight) * 0.7;
    const padding = objectSize * 0.1;

    for (let i = 0; i < object.count; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const startX = frameX + (frameWidth - (2 * objectSize + padding)) / 2;
        const startY = frameY + (frameHeight - (3 * objectSize + 2 * padding)) / 2;
        const x = startX + (col * (objectSize + padding));
        const y = startY + (row * (objectSize + padding));
        ctx.drawImage(object.image, x, y, objectSize, objectSize);
    }
}

/**
 * 10) Kazanınca ne olacak?
 *     - Konfetti, sesler, 2 saniye bekleme,
 *       birinci oyunu sola kaydırıp ikinci oyunu ortaya getirme
 */
function checkAnswer(selectedFrame) {
    const counts = {
        left: frameContents.left.count,
        middle: frameContents.middle.count,
        right: frameContents.right.count
    };
    const minCount = Math.min(...Object.values(counts));
    if (counts[selectedFrame] === minCount) {
        // Doğru cevap
        correctSound.play();
        kidsapplauding.play();
        startConfetti();
        correctFrame = selectedFrame;
        animateIcon(true);

        // Idle GIF kapat, animasyonlu GIF aç
        document.getElementById('idleGif1').style.display = 'none';
        const gif = document.getElementById('animatedGif1');
        gif.style.display = 'block';

        // 2 saniye sonra ikinci oyuna geç
        setTimeout(() => {
            isConfettiActive = false;
            // Oyunu resetlemeden önce, sayfayı kaydır:
            slideToGame2();
        }, 3000);

    } else {
        // Yanlış cevap
        wrongAnswer.play();
        wrongFrames.push(selectedFrame);
        animateIcon(false);
    }
}

function slideToGame2() {
    // Assets are already preloaded, so we can transition smoothly
    document.getElementById("gameContainer1").classList.add("slide-out-left");
    
    // Start game2 immediately as assets are ready
    setTimeout(() => {
        document.getElementById("gameContainer2").classList.add("slide-in");
        // Initialize game2
        if (typeof animate2 === 'function') {
            animate2();
        }
    }, 0);
}

/**
 * 11) Oyun reset (doğru cevap bulunduktan sonra tekrar yenilenmesi)
 */
function resetGame() {
    isClickable = true;
    isConfettiActive = false;
    correctFrame = null;
    wrongFrames = [];
    iconAnimations.size = 0;
    iconAnimations.opacity = 0;

    // Rastgele kategoriler seç
    const categories = Object.keys(gameObjects);
    const selectedCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 3);

    let numbers = [1, 2, 3, 4, 5]; // Örnek sayılar

    // Üç frame'e de rastgele image + sayı
    frameContents.left = {
        image: getRandomImage(selectedCategories[0]),
        count: numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]
    };
    frameContents.middle = {
        image: getRandomImage(selectedCategories[1]),
        count: numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]
    };
    frameContents.right = {
        image: getRandomImage(selectedCategories[2]),
        count: numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0]
    };

    // GIF sıfırla
    document.getElementById('animatedGif1').style.display = 'none';
    const idleGif = document.getElementById('idleGif1');
    idleGif.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif.style.display = 'block';

    draw();
}

/**
 * 12) Oyun çizim ve animasyon döngüsü
 */
function draw() {
    // Arka plan
    ctx.drawImage(backgroundImage, 0, 0, canvas1.width, canvas1.height);

    // Header
    const headerWidth = canvas1.width * 0.4;
    const headerHeight = headerWidth * (headerImage.height / headerImage.width);
    const headerX = (canvas1.width - headerWidth) / 2;
    const headerY = canvas1.height * 0.05;
    ctx.drawImage(headerImage, headerX, headerY, headerWidth, headerHeight);

    // Frame hesapları
    const spacing = canvas1.width * 0.02;
    const frameWidth = canvas1.width * 0.2;
    const frameHeight = frameWidth * (pinkFrame.height / pinkFrame.width);
    const totalWidth = 3 * frameWidth + 2 * spacing;
    const startX = (canvas1.width - totalWidth) / 2;
    const verticalOffset = canvas1.height * 0.05;
    const frameY = (canvas1.height - frameHeight) / 2 + verticalOffset;

    const leftFrameX = startX;
    const pinkFrameX = startX + frameWidth + spacing;
    const rightFrameX = startX + 2 * frameWidth + 2 * spacing;

    // Frame'leri çiz
    ctx.drawImage(whiteFrame, leftFrameX, frameY, frameWidth, frameHeight);
    ctx.drawImage(pinkFrame, pinkFrameX, frameY, frameWidth, frameHeight);
    ctx.drawImage(rightFrame, rightFrameX, frameY, frameWidth, frameHeight);

    // Nesneleri çiz
    drawObjects(leftFrameX, frameY, frameWidth, frameHeight, frameContents.left, 'left');
    drawObjects(pinkFrameX, frameY, frameWidth, frameHeight, frameContents.middle, 'middle');
    drawObjects(rightFrameX, frameY, frameWidth, frameHeight, frameContents.right, 'right');

    // Hover efekti
    if (hoveredFrame) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ffff00';
        ctx.lineWidth = 3;
        const gradient = ctx.createLinearGradient(0, 0, canvas1.width, canvas1.height);
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.5, '#ffffa0');
        gradient.addColorStop(1, '#ffff00');
        ctx.strokeStyle = gradient;

        let highlightX, highlightY;
        let highlightW = frameWidth;
        let highlightH = frameHeight;

        if (hoveredFrame === 'left') {
            highlightX = leftFrameX;
            highlightY = frameY;
        } else if (hoveredFrame === 'middle') {
            highlightX = pinkFrameX;
            highlightY = frameY;
        } else if (hoveredFrame === 'right') {
            highlightX = rightFrameX;
            highlightY = frameY;
        }

        const cornerRadius = 35;
        function drawRoundedRect(ctx, x, y, width, height, radius) {
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

        // Çift çizgi efekti (daha parlak neon)
        for (let i = 0; i < 2; i++) {
            drawRoundedRect(ctx, highlightX, highlightY, highlightW, highlightH, cornerRadius);
            ctx.stroke();
        }

        // Hafif pulse
        const pulseSize = Math.sin(Date.now() * 0.003) * 1.5;
        ctx.lineWidth = 3 + pulseSize;
        drawRoundedRect(
            ctx,
            highlightX - pulseSize/2,
            highlightY - pulseSize/2,
            highlightW + pulseSize,
            highlightH + pulseSize,
            cornerRadius
        );
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }
}

/**
 * 13) Mouse / dokunma event’leri
 */
function isClickInFrame(x, y, frameX, frameY, frameW, frameH) {
    return x >= frameX && x <= frameX + frameW &&
        y >= frameY && y <= frameY + frameH;
}

// Tıklama -> Cevabı kontrol
canvas1.addEventListener('click', function(event) {
    backgroundMusic.play();
    if (!isClickable) return;
    const rect = canvas1.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const spacing = canvas1.width * 0.02;
    const frameWidth = canvas1.width * 0.2;
    const frameHeight = frameWidth * (pinkFrame.height / pinkFrame.width);
    const totalWidth = 3 * frameWidth + 2 * spacing;
    const startX = (canvas1.width - totalWidth) / 2;
    const verticalOffset = canvas1.height * 0.2;
    const frameY = (canvas1.height - frameHeight) / 2 + verticalOffset;

    const leftFrameX = startX;
    const pinkFrameX = startX + frameWidth + spacing;
    const rightFrameX = startX + 2 * frameWidth + 2 * spacing;

    if (isClickInFrame(x, y, leftFrameX, frameY, frameWidth, frameHeight)) {
        checkAnswer('left');
    } else if (isClickInFrame(x, y, pinkFrameX, frameY, frameWidth, frameHeight)) {
        checkAnswer('middle');
    } else if (isClickInFrame(x, y, rightFrameX, frameY, frameWidth, frameHeight)) {
        checkAnswer('right');
    }
});

// Mouse hover
let previousHoveredFrame = null;
canvas1.addEventListener('mousemove', function(event) {
    const rect = canvas1.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    const spacing = canvas1.width * 0.02;
    const frameWidth = canvas1.width * 0.2;
    const frameHeight = frameWidth * (pinkFrame.height / pinkFrame.width);
    const totalWidth = 3 * frameWidth + 2 * spacing;
    const startX = (canvas1.width - totalWidth) / 2;
    const verticalOffset = canvas1.height * 0.05;
    const frameY = (canvas1.height - frameHeight) / 2 + verticalOffset;

    const leftFrameX = startX;
    const pinkFrameX = startX + frameWidth + spacing;
    const rightFrameX = startX + 2 * frameWidth + 2 * spacing;

    let newHoveredFrame = null;
    if (isClickInFrame(mx, my, leftFrameX, frameY, frameWidth, frameHeight)) {
        newHoveredFrame = 'left';
    } else if (isClickInFrame(mx, my, pinkFrameX, frameY, frameWidth, frameHeight)) {
        newHoveredFrame = 'middle';
    } else if (isClickInFrame(mx, my, rightFrameX, frameY, frameWidth, frameHeight)) {
        newHoveredFrame = 'right';
    }

    if (newHoveredFrame !== previousHoveredFrame && newHoveredFrame !== null) {
        mouseHoverSound.play();
    }
    previousHoveredFrame = newHoveredFrame;
    hoveredFrame = newHoveredFrame;
    draw();
});

/**
 * 14) Pencere boyutu değişince canvas'ı yeniden boyutla
 */
window.addEventListener('resize', function() {
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    draw();
});

/**
 * 15) Oyunun ana animasyon döngüsü
 */
function animate() {
    ctx.clearRect(0, 0, canvas1.width, canvas1.height);
    draw();

    if (isConfettiActive) {
        confetti.forEach(p => {
            p.update();
            p.draw();
            if (p.y > canvas1.height) {
                p.y = -10;
                p.x = Math.random() * canvas1.width;
            }
        });
    }

    if (isTutorialActive) {
        updateTutorialHand();
        drawTutorialHand();
    }

    requestAnimationFrame(animate);
}

// Sayfa yüklendiğinde animasyonlu GIF'i gizleyip idle GIF'i gösterir
window.onload = function() {
    const gif = document.getElementById('animatedGif1');
    const idleGif = document.getElementById('idleGif1');
    
    // İlk yüklemede tiger gif'ini yükle ama gizli tut
    gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif.style.display = 'none';
    
    // Idle gif'ini göster
    idleGif.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif.style.display = 'block';
};

/**
 * 16) Tutorial'ı başlatma. (Örnek: 2 sn sonra tutorial devreye giriyor)
 */
setTimeout(() => {
    if (isTutorialActive) {
        isClickable = false;
        handPosition = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
        targetPosition = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
        setTimeout(() => { moveToNextItem(); }, 1000);
    }
}, 2000);

/**
 * 17) İlk çizim tetikleme (eğer resimler hızlı yüklendiyse)
 */
draw();

/**
 * 18) Oyun döngüsü
 *    Tüm resimler yüklendiğinde, animate() fonksiyonu devreye girecektir.
 */
