/************************************************
 *                OYUN 2 (Game2)
 ************************************************/

/**
 * 1) Canvas, context ve temel DOM elem. seçimi
 */
const canvas2 = document.getElementById("gameCanvas2");
const ctx2 = canvas2.getContext("2d");

// Canvas boyutları
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage2 = GAME_ASSETS.loadImage('background');
const whiteFrame2 = GAME_ASSETS.loadImage('whiteFrame');
const headerImage2 = GAME_ASSETS.loadImage('header');
const carImage2 = GAME_ASSETS.loadImage('car');
const pumpkinImage2 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage2 = GAME_ASSETS.loadImage('tractor');
const boyImage2 = GAME_ASSETS.loadImage('boy');
const girlImage2 = GAME_ASSETS.loadImage('girl');
const cheese2 = GAME_ASSETS.loadImage('cheese');
const pear2 = GAME_ASSETS.loadImage('pear');
const pie2 = GAME_ASSETS.loadImage('pie');
const taxi2 = GAME_ASSETS.loadImage('taxi');
const donut2 = GAME_ASSETS.loadImage('donut');
const eight2 = GAME_ASSETS.loadImage('eight');
const elephant2 = GAME_ASSETS.loadImage('elephant');
const four2 = GAME_ASSETS.loadImage('four');
const grape2 = GAME_ASSETS.loadImage('grape');
const orange2 = GAME_ASSETS.loadImage('orange');
const six2 = GAME_ASSETS.loadImage('six');
const two2 = GAME_ASSETS.loadImage('two');
const leaf2 = GAME_ASSETS.loadImage('leaf');
const squirle2 = GAME_ASSETS.loadImage('squirle');
const monkey2 = GAME_ASSETS.loadImage('monkey');
const zebra2 = GAME_ASSETS.loadImage('zebra');
const bull2 = GAME_ASSETS.loadImage('bull');
const correct2 = GAME_ASSETS.loadImage('correct');
const wrong2 = GAME_ASSETS.loadImage('wrong');
const tutorialHand2 = GAME_ASSETS.loadImage('tutorialHand');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound2 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer2 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding2 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound2 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic2 = GAME_ASSETS.loadAudio('background');
const smallSound2 = GAME_ASSETS.loadAudio('small');
const largeSound2 = GAME_ASSETS.loadAudio('large');

backgroundMusic2.loop = true;
backgroundMusic2.volume = 0.1;
smallSound2.volume = 0.85;
largeSound2.volume = 0.85;

/**
 * 5) Global değişkenler
 */
let isTutorialActive2 = true;
let isClickable2 = false;
let hoveredFrame2 = null;
let correctFrame2 = null;
let wrongFrames2 = [];
let tutorialStep2 = 0;

/**
 * Bu oyunda 4 adet “frame” (2x2 grid) olsun.
 * scale değeri büyük olan frame doğru kabul edilecek.
 */
let frameContents2 = {
    topLeft:   { image: carImage2, scale: 0.3 },  // small
    topRight:  { image: tractorImage2, scale: 0.5 },
    bottomLeft:{ image: boyImage2, scale: 0.4 },
    bottomRight:{ image: pumpkinImage2, scale: 0.6 } // largest
};

/**
 * 6) Tutorial (eller ve metin)
 */
let handPosition2 = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
let targetPosition2 = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
let handScale2 = 1;
let tutorialText = "";
let textPosition = { x: 0, y: 0 };
let textScale = 0;
let textOpacity = 0;
let isTextFadingOut = false;

/**
 * 7) Confetti için
 */
let confetti2 = [];
let isConfettiActive2 = false;
const COLORS2 = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

class Confetti2 {
    constructor() {
        this.x = Math.random() * canvas2.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS2[Math.floor(Math.random() * COLORS2.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }
    draw() {
        ctx2.save();
        ctx2.translate(this.x, this.y);
        ctx2.rotate(this.rotation * Math.PI / 180);
        ctx2.fillStyle = this.color;
        ctx2.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx2.restore();
    }
}

function startConfetti2() {
    isConfettiActive2 = true;
    confetti2 = [];
    for (let i = 0; i < 100; i++) {
        confetti2.push(new Confetti2());
    }
}

/**
 * 8) Tutorial adımları: "SMALL" ve "LARGE"
 *    (Örnek mantık: her frame’de scale farkına göre metin gösterimi)
 */
function moveToNextItem2() {
    const frameWidth2 = canvas2.width * 0.15;
    const frameHeight2 = frameWidth2;
    const spacing2 = canvas2.width * 0.02;
    const startX2 = (canvas2.width - (2 * frameWidth2 + spacing2)) / 2;
    const startY2 = (canvas2.height - (2 * frameHeight2 + spacing2)) / 2;

    // Frame’lerin merkez koordinatlarını hesaplayalım
    const frames = [
        {
            x: startX2 + frameWidth2 / 2,
            y: startY2 + frameHeight2 / 2,
            scale: frameContents2.topLeft.scale,
            name: 'topLeft'
        },
        {
            x: startX2 + frameWidth2 + spacing2 + frameWidth2 / 2,
            y: startY2 + frameHeight2 / 2,
            scale: frameContents2.topRight.scale,
            name: 'topRight'
        },
        {
            x: startX2 + frameWidth2 / 2,
            y: startY2 + frameHeight2 + spacing2 + frameHeight2 / 2,
            scale: frameContents2.bottomLeft.scale,
            name: 'bottomLeft'
        },
        {
            x: startX2 + frameWidth2 + spacing2 + frameWidth2 / 2,
            y: startY2 + frameHeight2 + spacing2 + frameHeight2 / 2,
            scale: frameContents2.bottomRight.scale,
            name: 'bottomRight'
        }
    ];

    // Tutorial bitti mi?
    if (tutorialStep2 >= frames.length) {
        setTimeout(() => {
            isTutorialActive2 = false;
            isClickable2 = true;
        }, 1000);
        return;
    }

    const currentFrame = frames[tutorialStep2];

    // Önce mevcut metni "fade out"
    isTextFadingOut = true;

    // Metin kapanınca yeni frame’e geç
    setTimeout(() => {
        targetPosition2.x = currentFrame.x;
        targetPosition2.y = currentFrame.y;
        textPosition.x = currentFrame.x;
        textPosition.y = currentFrame.y;

        // En büyük scale’i bul
        const maxScale = Math.max(
            frameContents2.topLeft.scale,
            frameContents2.topRight.scale,
            frameContents2.bottomLeft.scale,
            frameContents2.bottomRight.scale
        );

        // Bu frame en büyük mü?
        if (currentFrame.scale === maxScale) {
            tutorialText = "LARGE";
        } else {
            tutorialText = "SMALL";
        }

        textScale = 0;
        textOpacity = 0;
        isTextFadingOut = false;

        tutorialStep2++;

        // Bir sonraki item’e 2sn sonra geç
        setTimeout(() => {
            moveToNextItem2();
        }, 2000);

    }, 1000);
}

function updateTutorialHand2() {
    if (!isTutorialActive2) return;

    const speed = 0.02;
    handPosition2.x += (targetPosition2.x - handPosition2.x) * speed;
    handPosition2.y += (targetPosition2.y - handPosition2.y) * speed;

    // Hedefe yaklaştıysak, metin ve el hareketi 
    if (Math.abs(handPosition2.x - targetPosition2.x) < 10 &&
        Math.abs(handPosition2.y - targetPosition2.y) < 10) {
        handScale2 = 1 + 0.2 * Math.sin(Date.now() * 0.002);
        if (!isTextFadingOut) {
            textScale = Math.min(1, textScale + 0.015);
            textOpacity = Math.min(1, textOpacity + 0.015);

            // Metin tam görünür olduğunda, sesi çalalım
            if (textScale >= 1 && textOpacity >= 1) {
                if (tutorialText === "SMALL") {
                    smallSound2.play();
                } else if (tutorialText === "LARGE") {
                    largeSound2.play();
                }
            }
        }
    }

    // Metin fade-out
    if (isTextFadingOut) {
        textScale = Math.max(0, textScale - 0.015);
        textOpacity = Math.max(0, textOpacity - 0.015);
    }
}

function drawTutorialText2() {
    if (!isTutorialActive2 || !tutorialText) return;

    ctx2.save();
    ctx2.globalAlpha = textOpacity;

    const fontSize = 60 * textScale;
    ctx2.font = `${fontSize}px 'Fredoka One', cursive`;
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';

    // Outline
    ctx2.lineWidth = 8;
    ctx2.strokeStyle = '#000';
    ctx2.strokeText(tutorialText, textPosition.x, textPosition.y - 100);

    // Ana text
    ctx2.fillStyle = '#FF4081';
    ctx2.fillText(tutorialText, textPosition.x, textPosition.y - 100);

    // Parlaklık efekti
    ctx2.shadowColor = '#FFFFFF';
    ctx2.shadowBlur = 10;
    ctx2.fillStyle = '#FFFFFF';
    ctx2.globalAlpha = textOpacity * 0.3;
    ctx2.fillText(tutorialText, textPosition.x, textPosition.y - 100);

    ctx2.restore();
}

/**
 * 9) Doğru/yanlış kontrolü (en büyük scale doğru)
 */
let iconAnimations2 = {
    size: 0,
    opacity: 0
};

function animateIcon2(isCorrect2) {
    iconAnimations2.size = 0;
    iconAnimations2.opacity = 0;

    const animateIt = () => {
        iconAnimations2.size = Math.min(1, iconAnimations2.size + 0.1);
        iconAnimations2.opacity = Math.min(1, iconAnimations2.opacity + 0.1);

        if (iconAnimations2.size < 1) {
            requestAnimationFrame(animateIt);
        }

        if (!isCorrect2 && iconAnimations2.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations2.size -= 0.1;
                    if (iconAnimations2.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames2 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animateIt();
}

function drawObjects2(frameX, frameY, frameWidth, frameHeight, object, frameName) {
    // Doğru frame?
    if (correctFrame2 === frameName) {
        const maxSize = frameWidth * 0.7;
        const currentSize = maxSize * (iconAnimations2.size);
        const xPos = frameX + (frameWidth - currentSize) / 2;
        const yPos = frameY + (frameHeight - currentSize) / 2;
        ctx2.globalAlpha = iconAnimations2.opacity;
        ctx2.drawImage(correct2, xPos, yPos, currentSize, currentSize);
        ctx2.globalAlpha = 1.0;
        return;
    }

    // Yanlış frame?
    if (wrongFrames2.includes(frameName)) {
        const maxSize = frameWidth * 0.7;
        const currentSize = maxSize * (iconAnimations2.size);
        const xPos = frameX + (frameWidth - currentSize) / 2;
        const yPos = frameY + (frameHeight - currentSize) / 2;
        ctx2.globalAlpha = iconAnimations2.opacity;
        ctx2.drawImage(wrong2, xPos, yPos, currentSize, currentSize);
        ctx2.globalAlpha = 1.0;
        return;
    }

    // Normal çizim
    const objectSize = frameWidth * object.scale;
    const centerX = frameX + (frameWidth - objectSize) / 2;
    const centerY = frameY + (frameHeight - objectSize) / 2;
    ctx2.drawImage(object.image, centerX, centerY, objectSize, objectSize);
}

function checkAnswer2(selectedFrame) {
    const scales = {
        topLeft: frameContents2.topLeft.scale,
        topRight: frameContents2.topRight.scale,
        bottomLeft: frameContents2.bottomLeft.scale,
        bottomRight: frameContents2.bottomRight.scale
    };
    const maxScale = Math.max(...Object.values(scales));

    if (scales[selectedFrame] === maxScale) {
        // Doğru
        correctSound2.play();
        kidsapplauding2.play();
        startConfetti2();
        correctFrame2 = selectedFrame;
        animateIcon2(true);

        // Idle GIF kapat, animasyonlu GIF aç
        document.getElementById('idleGif2').style.display = 'none';
        const gif2 = document.getElementById('animatedGif2');
        gif2.style.display = 'block';

        // 3 saniye sonra geçişi başlat
        setTimeout(() => {
            isConfettiActive2 = false;
            
            // Game2'yi sola kaydır ve aynı anda Game3'ü sağdan getir
            const game2Container = document.getElementById("gameContainer2");
            game2Container.style.transform = 'translateX(-100%)';
            document.getElementById("gameContainer3").classList.add("slide-in");
            
            // Initialize game3
            if (typeof animate3 === 'function') {
                animate3();
            }
        }, 3000);

    } else {
        // Yanlış
        wrongAnswer2.play();
        wrongFrames2.push(selectedFrame);
        animateIcon2(false);
    }
}

/**
 * 10) Oyun reset
 */
function resetGame2() {
    isConfettiActive2 = false;
    correctFrame2 = null;
    wrongFrames2 = [];
    iconAnimations2.size = 0;
    iconAnimations2.opacity = 0;

    // Rastgele bir item seçelim (örnek)
    const allItems2 = [
        carImage2, pumpkinImage2, tractorImage2, boyImage2, girlImage2,
        cheese2, pear2, pie2, taxi2, donut2, eight2, elephant2, four2,
        grape2, orange2, six2, two2, leaf2, squirle2, monkey2, zebra2, bull2
    ];
    const randomItem2 = allItems2[Math.floor(Math.random() * allItems2.length)];

    // 4 adet rasgele scale
    const scales2 = [];
    for(let i=0; i<4; i++){
        scales2.push(0.3 + Math.random() * 0.4); // 0.3 ila 0.7 arası
    }

    frameContents2 = {
        topLeft:     { image: randomItem2, scale: scales2[0] },
        topRight:    { image: randomItem2, scale: scales2[1] },
        bottomLeft:  { image: randomItem2, scale: scales2[2] },
        bottomRight: { image: randomItem2, scale: scales2[3] }
    };

    // GIF sıfırla
    document.getElementById('animatedGif2').style.display = 'none';
    const idleGif2 = document.getElementById('idleGif2');
    idleGif2.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif2.style.display = 'block';

    draw2();
}

/**
 * 11) Oyun çizim fonksiyonu
 */
function draw2() {
    // Arka plan
    ctx2.drawImage(backgroundImage2, 0, 0, canvas2.width, canvas2.height);

    // Header
    const headerWidth2 = canvas2.width * 0.4;
    const headerHeight2 = headerWidth2 * (headerImage2.height / headerImage2.width);
    const headerX2 = (canvas2.width - headerWidth2) / 2;
    const headerY2 = canvas2.height * 0.05;
    ctx2.drawImage(headerImage2, headerX2, headerY2, headerWidth2, headerHeight2);

    // 2x2 grid
    const frameWidth2 = canvas2.width * 0.15;
    const frameHeight2 = frameWidth2;
    const spacing2 = canvas2.width * 0.02;
    const startX2 = (canvas2.width - (2 * frameWidth2 + spacing2)) / 2;
    const startY2 = (canvas2.height - (2 * frameHeight2 + spacing2)) / 2;

    // 4 frame çizimi
    ctx2.drawImage(whiteFrame2, startX2, startY2, frameWidth2, frameHeight2);
    ctx2.drawImage(whiteFrame2, startX2 + frameWidth2 + spacing2, startY2, frameWidth2, frameHeight2);
    ctx2.drawImage(whiteFrame2, startX2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2);
    ctx2.drawImage(whiteFrame2, startX2 + frameWidth2 + spacing2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2);

    // Nesneleri çiz
    drawObjects2(startX2, startY2, frameWidth2, frameHeight2, frameContents2.topLeft, 'topLeft');
    drawObjects2(startX2 + frameWidth2 + spacing2, startY2, frameWidth2, frameHeight2, frameContents2.topRight, 'topRight');
    drawObjects2(startX2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2, frameContents2.bottomLeft, 'bottomLeft');
    drawObjects2(startX2 + frameWidth2 + spacing2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2, frameContents2.bottomRight, 'bottomRight');

    // Tutorial bitmişse, frame'lere "SMALL/LARGE" yazabiliriz (opsiyonel).
    if (!isTutorialActive2) {
        ctx2.font = 'bold 24px "Fredoka One", cursive';
        ctx2.textAlign = 'center';
        ctx2.lineWidth = 4;
        ctx2.strokeStyle = '#000000';

        const drawFrameText = (text, x, y) => {
            ctx2.strokeText(text, x, y);
            ctx2.fillStyle = '#FF4081';
            ctx2.fillText(text, x, y);
        };

        const scales = {
            topLeft: frameContents2.topLeft.scale,
            topRight: frameContents2.topRight.scale,
            bottomLeft: frameContents2.bottomLeft.scale,
            bottomRight: frameContents2.bottomRight.scale
        };
        const maxScale = Math.max(...Object.values(scales));

        drawFrameText(
            scales.topLeft === maxScale ? 'LARGE' : 'SMALL',
            startX2 + frameWidth2 / 2,
            startY2 + frameHeight2 + 25
        );
        drawFrameText(
            scales.topRight === maxScale ? 'LARGE' : 'SMALL',
            startX2 + frameWidth2 + spacing2 + frameWidth2 / 2,
            startY2 + frameHeight2 + 25
        );
        drawFrameText(
            scales.bottomLeft === maxScale ? 'LARGE' : 'SMALL',
            startX2 + frameWidth2 / 2,
            startY2 + frameHeight2 + spacing2 + frameHeight2 + 25
        );
        drawFrameText(
            scales.bottomRight === maxScale ? 'LARGE' : 'SMALL',
            startX2 + frameWidth2 + spacing2 + frameWidth2 / 2,
            startY2 + frameHeight2 + spacing2 + frameHeight2 + 25
        );
    }

    // Hover highlight
    if (hoveredFrame2) {
        ctx2.shadowBlur = 25;
        ctx2.shadowColor = '#ffff00';
        ctx2.lineWidth = 5;

        const gradient2 = ctx2.createLinearGradient(0, 0, canvas2.width, canvas2.height);
        gradient2.addColorStop(0, '#ffff00');
        gradient2.addColorStop(0.5, '#ffffa0');
        gradient2.addColorStop(1, '#ffff00');
        ctx2.strokeStyle = gradient2;

        let highlightX2, highlightY2;

        if (hoveredFrame2 === 'topLeft') {
            highlightX2 = startX2;
            highlightY2 = startY2;
        } else if (hoveredFrame2 === 'topRight') {
            highlightX2 = startX2 + frameWidth2 + spacing2;
            highlightY2 = startY2;
        } else if (hoveredFrame2 === 'bottomLeft') {
            highlightX2 = startX2;
            highlightY2 = startY2 + frameHeight2 + spacing2;
        } else if (hoveredFrame2 === 'bottomRight') {
            highlightX2 = startX2 + frameWidth2 + spacing2;
            highlightY2 = startY2 + frameHeight2 + spacing2;
        }

        const cornerRadius2 = 15;
        function drawRoundedRect2(ctx, x, y, width, height, radius) {
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

        // Double stroke
        for (let i = 0; i < 2; i++) {
            drawRoundedRect2(ctx2, highlightX2, highlightY2, frameWidth2, frameHeight2, cornerRadius2);
            ctx2.stroke();
        }

        // Pulse animasyonu
        const pulseSize2 = Math.sin(Date.now() * 0.003) * 1.5;
        ctx2.lineWidth = 5 + pulseSize2;
        drawRoundedRect2(ctx2, highlightX2 - pulseSize2/2, highlightY2 - pulseSize2/2,
            frameWidth2 + pulseSize2, frameHeight2 + pulseSize2, cornerRadius2);
        ctx2.stroke();

        ctx2.shadowBlur = 0;
        ctx2.shadowColor = 'transparent';
    }
}

/**
 * 12) Event'ler
 */
function isClickInFrame2(x, y, fx, fy, fw, fh) {
    return (x >= fx && x <= fx + fw && y >= fy && y <= fy + fh);
}

canvas2.addEventListener('click', function(e) {
    if (isTutorialActive2) return; // Tutorial devam ediyorsa tıklamayı engelle

    const rect = canvas2.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const frameWidth2 = canvas2.width * 0.15;
    const frameHeight2 = frameWidth2;
    const spacing2 = canvas2.width * 0.02;
    const startX2 = (canvas2.width - (2 * frameWidth2 + spacing2)) / 2;
    const startY2 = (canvas2.height - (2 * frameHeight2 + spacing2)) / 2;

    if (isClickInFrame2(cx, cy, startX2, startY2, frameWidth2, frameHeight2)) {
        checkAnswer2('topLeft');
    } else if (isClickInFrame2(cx, cy, startX2 + frameWidth2 + spacing2, startY2, frameWidth2, frameHeight2)) {
        checkAnswer2('topRight');
    } else if (isClickInFrame2(cx, cy, startX2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2)) {
        checkAnswer2('bottomLeft');
    } else if (isClickInFrame2(cx, cy, startX2 + frameWidth2 + spacing2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2)) {
        checkAnswer2('bottomRight');
    }
});

let previousHoveredFrame2 = null;
canvas2.addEventListener('mousemove', function(e) {
    if (isTutorialActive2) return;

    const rect = canvas2.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const frameWidth2 = canvas2.width * 0.15;
    const frameHeight2 = frameWidth2;
    const spacing2 = canvas2.width * 0.02;
    const startX2 = (canvas2.width - (2 * frameWidth2 + spacing2)) / 2;
    const startY2 = (canvas2.height - (2 * frameHeight2 + spacing2)) / 2;

    let newHoveredFrame2 = null;

    if (isClickInFrame2(mx, my, startX2, startY2, frameWidth2, frameHeight2)) {
        newHoveredFrame2 = 'topLeft';
    } else if (isClickInFrame2(mx, my, startX2 + frameWidth2 + spacing2, startY2, frameWidth2, frameHeight2)) {
        newHoveredFrame2 = 'topRight';
    } else if (isClickInFrame2(mx, my, startX2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2)) {
        newHoveredFrame2 = 'bottomLeft';
    } else if (isClickInFrame2(mx, my, startX2 + frameWidth2 + spacing2, startY2 + frameHeight2 + spacing2, frameWidth2, frameHeight2)) {
        newHoveredFrame2 = 'bottomRight';
    }

    if (newHoveredFrame2 !== previousHoveredFrame2 && newHoveredFrame2 !== null) {
        mouseHoverSound2.play();
    }
    previousHoveredFrame2 = newHoveredFrame2;
    hoveredFrame2 = newHoveredFrame2;
    draw2();
});

window.addEventListener('resize', function() {
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
    draw2();
});

/**
 * 13) Animasyon döngüsü
 */
function animate2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    draw2();

    if (isConfettiActive2) {
        confetti2.forEach(p => {
            p.update();
            p.draw();
            if (p.y > canvas2.height) {
                p.y = -10;
                p.x = Math.random() * canvas2.width;
            }
        });
    }

    if (isTutorialActive2) {
        updateTutorialHand2();
        drawTutorialHand2();
        drawTutorialText2();
    }

    requestAnimationFrame(animate2);
}

/**
 * 14) El (tutorialHand) çizimi
 */
function drawTutorialHand2() {
    if (!isTutorialActive2) return;
    const baseSize2 = 100;
    const handSize2 = baseSize2 * handScale2;
    ctx2.save();
    ctx2.drawImage(tutorialHand2,
        handPosition2.x - handSize2/2,
        handPosition2.y - handSize2/2,
        handSize2,
        handSize2
    );
    ctx2.restore();
}

/**
 * 15) Sayfa yüklendiğinde idle GIF göster, animasyon GIF sakla
 */
window.onload = function() {
    const gif2 = document.getElementById('animatedGif2');
    const idle2 = document.getElementById('idleGif2');
    
    // İlk yüklemede tiger gif'ini yükle ama gizli tut
    gif2.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif2.style.display = 'none';
    
    // Idle gif'ini göster
    idle2.src = GAME_ASSETS.ASSETS.gifs.idle;
    idle2.style.display = 'block';
};

/**
 * 16) Tutorial'ı başlat
 *    (Bu örnekte 2 sn sonra devreye giriyor)
 */
setTimeout(() => {
    if (isTutorialActive2) {
        isClickable2 = false;
        handPosition2 = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
        targetPosition2 = { x: window.innerWidth / 2, y: window.innerHeight * 0.8 };
        setTimeout(() => {
            moveToNextItem2();
        }, 1000);
    }
}, 2000);

/**
 * 17) İlk çizim
 */
draw2();
