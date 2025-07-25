/************************************************
 *                OYUN 4 (Game4)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas4 = document.getElementById('gameCanvas4');
const ctx4 = canvas4.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas4.width = window.innerWidth;
canvas4.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage4 = GAME_ASSETS.loadImage('background');
const pinkFrame4 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame4 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame4 = GAME_ASSETS.loadImage('rightFrame');
const headerImage4 = GAME_ASSETS.loadImage('header');
const carImage4 = GAME_ASSETS.loadImage('car');
const pumpkinImage4 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage4 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame4 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage4 = GAME_ASSETS.loadImage('boy');
const girlImage4 = GAME_ASSETS.loadImage('girl');
const cheese4 = GAME_ASSETS.loadImage('cheese');
const pear4 = GAME_ASSETS.loadImage('pear');
const pie4 = GAME_ASSETS.loadImage('pie');
const taxi4 = GAME_ASSETS.loadImage('taxi');
const donut4 = GAME_ASSETS.loadImage('donut');
const elephant4 = GAME_ASSETS.loadImage('elephant');
const grape4 = GAME_ASSETS.loadImage('grape');
const orange4 = GAME_ASSETS.loadImage('orange');
const leaf4 = GAME_ASSETS.loadImage('leaf');
const squirle4 = GAME_ASSETS.loadImage('squirle');
const monkey4 = GAME_ASSETS.loadImage('monkey');
const zebra4 = GAME_ASSETS.loadImage('zebra');
const bull4 = GAME_ASSETS.loadImage('bull');
const questionMark4 = GAME_ASSETS.loadImage('questionmark');
const correct4 = GAME_ASSETS.loadImage('correct');
const wrong4 = GAME_ASSETS.loadImage('wrong');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound4 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer4 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding4 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound4 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic4 = GAME_ASSETS.loadAudio('background');
backgroundMusic4.loop = true;
backgroundMusic4.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let pattern4 = {
    items: [pumpkinImage4, carImage4, pumpkinImage4, null], // Son eleman soru işareti olacak
    current: []
};

let isDragging4 = false;
let draggedItem4 = null;
let draggedItemX4 = 0;
let draggedItemY4 = 0;
let offsetX4 = 0;
let offsetY4 = 0;
let originalDragPosition4 = { x: 0, y: 0 };
let correctFrame4 = null;
let wrongFrames4 = [];
let iconAnimations4 = {
    size: 0,
    opacity: 0
};

/**
 * 5) Confetti için değişkenler ve sınıf
 */
let confetti4 = [];
let isConfettiActive4 = false;
const COLORS4 = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

class Confetti4 {
    constructor() {
        this.x = Math.random() * canvas4.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS4[Math.floor(Math.random() * COLORS4.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx4.save();
        ctx4.translate(this.x, this.y);
        ctx4.rotate(this.rotation * Math.PI / 180);
        ctx4.fillStyle = this.color;
        ctx4.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx4.restore();
    }
}

/**
 * 6) Oyun itemları
 */
let availableItems4 = [
    { image: pumpkinImage4, id: 'pumpkin' },
    { image: carImage4, id: 'car' },
    { image: boyImage4, id: 'boy' }
];

/**
 * 7) Yardımcı fonksiyonlar
 */
function startConfetti4() {
    isConfettiActive4 = true;
    confetti4 = [];
    for (let i = 0; i < 100; i++) {
        confetti4.push(new Confetti4());
    }
}

function animateIcon4(isCorrect) {
    iconAnimations4.size = 0;
    iconAnimations4.opacity = 0;

    const animate = () => {
        iconAnimations4.size = Math.min(1, iconAnimations4.size + 0.1);
        iconAnimations4.opacity = Math.min(1, iconAnimations4.opacity + 0.1);

        if (iconAnimations4.size < 1) {
            requestAnimationFrame(animate);
        }

        if (!isCorrect && iconAnimations4.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations4.size -= 0.1;
                    if (iconAnimations4.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames4 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animate();
}

function shufflePatternAndItems4() {
    // Kullanılabilecek tüm itemlar
    const allItems4 = [
        { image: pumpkinImage4, id: 'pumpkin' },
        { image: carImage4, id: 'car' },
        { image: boyImage4, id: 'boy' },
        { image: girlImage4, id: 'girl' },
        { image: cheese4, id: 'cheese' },
        { image: pear4, id: 'pear' },
        { image: pie4, id: 'pie' },
        { image: taxi4, id: 'taxi' },
        { image: donut4, id: 'donut' },
        { image: elephant4, id: 'elephant' },
        { image: grape4, id: 'grape' },
        { image: orange4, id: 'orange' },
        { image: leaf4, id: 'leaf' },
        { image: squirle4, id: 'squirle' },
        { image: monkey4, id: 'monkey' },
        { image: zebra4, id: 'zebra' },
        { image: bull4, id: 'bull' }
    ];

    // Pattern için rastgele 2 item seç
    let item1 = allItems4[Math.floor(Math.random() * allItems4.length)];
    let item2 = allItems4[Math.floor(Math.random() * allItems4.length)];

    // Aynı item seçildiyse değiştir
    while (item1.id === item2.id) {
        item2 = allItems4[Math.floor(Math.random() * allItems4.length)];
    }

    // Yeni pattern: item1, item2, item1, soru işareti
    pattern4 = {
        items: [item1.image, item2.image, item1.image, null],
        answer: item2.image
    };

    // Alt panel için rastgele 3 item seç
    availableItems4 = [...allItems4]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    // Doğru cevabın alt panelde olduğundan emin ol
    if (!availableItems4.some(item => item.image === item2.image)) {
        // Rastgele bir pozisyona doğru cevabı ekle
        const randomPos = Math.floor(Math.random() * 3);
        availableItems4[randomPos] = {image: item2.image, id: item2.id};
    }
}

function resetGame4() {
    isConfettiActive4 = false;
    correctFrame4 = null;
    wrongFrames4 = [];
    iconAnimations4.size = 0;
    iconAnimations4.opacity = 0;
    shufflePatternAndItems4();
    draw4();
}

function checkDropLocation4(x, y) {
    const frameWidth = canvas4.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas4.width * 0.02;
    const startX = (canvas4.width - (4 * frameWidth + 3 * spacing)) / 2;
    const startY = canvas4.height * 0.2;

    // Soru işaretinin olduğu son frame'in konumu
    const lastFrameX = startX + (frameWidth + spacing) * 3;

    // Mouse'un son frame üzerinde olup olmadığını kontrol et
    if (x >= lastFrameX && x <= lastFrameX + frameWidth &&
        y >= startY && y <= startY + frameHeight) {

        // Doğru item sürükleniyorsa
        if (draggedItem4.image === pattern4.items[1]) {
            pattern4.items[3] = draggedItem4.image;
            correctFrame4 = 3;
            animateIcon4(true);
            startConfetti4();
            correctSound4.play();
            kidsapplauding4.play();

            document.getElementById('idleGif4').style.display = 'none';
            const gif = document.getElementById('animatedGif4');
            gif.src = '';
            setTimeout(() => {
                gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
                gif.style.display = 'block';
            }, 0);

            setTimeout(() => {
                isConfettiActive4 = false;
                // Game4'ü sola kaydır
                document.getElementById("gameContainer4").style.transform = 'translateX(-100%)';
                // Game5'i sağdan getir
                document.getElementById("gameContainer5").classList.add("slide-in");
                // Initialize game5
                if (typeof animate5 === 'function') {
                    animate5();
                }
                gif.style.display = 'none';
                document.getElementById('idleGif4').style.display = 'block';
                resetGame4();
            }, 2000);

            return true;
        } else {
            wrongFrames4.push(3);
            animateIcon4(false);
            wrongAnswer4.play();
            return false;
        }
    }
    return false;
}

/**
 * 8) Çizim fonksiyonları
 */
function draw4() {
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);
    ctx4.drawImage(backgroundImage4, 0, 0, canvas4.width, canvas4.height);

    const headerWidth = canvas4.width * 0.4;
    const headerHeight = headerWidth * (headerImage4.height / headerImage4.width);
    const headerX = (canvas4.width - headerWidth) / 2;
    const headerY = canvas4.height * 0.05;
    ctx4.drawImage(headerImage4, headerX, headerY, headerWidth, headerHeight);

    const frameWidth = canvas4.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas4.width * 0.02;
    const startX = (canvas4.width - (4 * frameWidth + 3 * spacing)) / 2;
    const startY = canvas4.height * 0.2;

    // Pattern'i çiz
    for(let i = 0; i < 4; i++) {
        ctx4.drawImage(whiteFrame4,
            startX + (frameWidth + spacing) * i,
            startY,
            frameWidth,
            frameHeight);

        if (correctFrame4 === i) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations4.size);
            const correctX = startX + (frameWidth + spacing) * i + (frameWidth - currentSize) / 2;
            const correctY = startY + (frameHeight - currentSize) / 2;

            ctx4.globalAlpha = iconAnimations4.opacity;
            ctx4.drawImage(correct4, correctX, correctY, currentSize, currentSize);
            ctx4.globalAlpha = 1.0;
            continue;
        }

        if (wrongFrames4.includes(i)) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations4.size);
            const wrongX = startX + (frameWidth + spacing) * i + (frameWidth - currentSize) / 2;
            const wrongY = startY + (frameHeight - currentSize) / 2;

            ctx4.globalAlpha = iconAnimations4.opacity;
            ctx4.drawImage(wrong4, wrongX, wrongY, currentSize, currentSize);
            ctx4.globalAlpha = 1.0;
            continue;
        }

        if (i === 3 && pattern4.items[i] === null) {
            ctx4.drawImage(questionMark4,
                startX + (frameWidth + spacing) * i + frameWidth * 0.1,
                startY + frameHeight * 0.1,
                frameWidth * 0.8,
                frameHeight * 0.8);
        } else if (pattern4.items[i]) {
            ctx4.drawImage(pattern4.items[i],
                startX + (frameWidth + spacing) * i + frameWidth * 0.1,
                startY + frameHeight * 0.1,
                frameWidth * 0.8,
                frameHeight * 0.8);
        }
    }

    // Alt panel
    const bottomPanelY = canvas4.height * 0.6;
    const bottomPanelHeight = frameHeight;
    const bottomPanelWidth = canvas4.width * 0.7;

    ctx4.drawImage(horizontalPinkFrame4,
        (canvas4.width - bottomPanelWidth) / 2,
        bottomPanelY,
        bottomPanelWidth,
        bottomPanelHeight);

    availableItems4.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;
        const itemY = bottomPanelY + 20;

        if (!isDragging4 || draggedItem4 !== item) {
            ctx4.drawImage(item.image,
                itemX,
                itemY,
                frameWidth * 0.8,
                frameHeight * 0.8);
        }
    });

    if (isDragging4 && draggedItem4) {
        ctx4.drawImage(draggedItem4.image,
            draggedItemX4,
            draggedItemY4,
            frameWidth * 0.8,
            frameHeight * 0.8);
    }
}

/**
 * 9) Event listeners
 */
canvas4.addEventListener('mousedown', function(event) {
    const rect = canvas4.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    availableItems4.forEach((item, index) => {
        const frameWidth = canvas4.width * 0.15;
        const frameHeight = frameWidth;
        const spacing = canvas4.width * 0.02;
        const startX = (canvas4.width - (4 * frameWidth + 3 * spacing)) / 2;
        const bottomPanelY = canvas4.height * 0.6;
        const itemX = startX + (frameWidth + spacing) * index;
        const itemY = bottomPanelY + 20;

        if (x >= itemX && x <= itemX + frameWidth * 0.8 &&
            y >= itemY && y <= itemY + frameHeight * 0.8) {
            isDragging4 = true;
            draggedItem4 = item;
            offsetX4 = x - itemX;
            offsetY4 = y - itemY;
            draggedItemX4 = itemX;
            draggedItemY4 = itemY;
        }
    });
});

canvas4.addEventListener('mousemove', function(event) {
    if (isDragging4 && draggedItem4) {
        const rect = canvas4.getBoundingClientRect();
        draggedItemX4 = event.clientX - rect.left - offsetX4;
        draggedItemY4 = event.clientY - rect.top - offsetY4;
        requestAnimationFrame(draw4);
    }
});

canvas4.addEventListener('mouseup', function(event) {
    if (isDragging4 && draggedItem4) {
        const rect = canvas4.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const isDropped = checkDropLocation4(x, y);

        if (!isDropped) {
            draggedItemX4 = originalDragPosition4.x;
            draggedItemY4 = originalDragPosition4.y;
        }

        isDragging4 = false;
        draggedItem4 = null;
        requestAnimationFrame(draw4);
    }
});

window.addEventListener('resize', function() {
    canvas4.width = window.innerWidth;
    canvas4.height = window.innerHeight;
    draw4();
});

/**
 * 10) Animasyon döngüsü
 */
function animate4() {
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);
    draw4();

    if (isConfettiActive4) {
        confetti4.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (particle.y > canvas4.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas4.width;
            }
        });
    }

    requestAnimationFrame(animate4);
}

/**
 * 11) Oyunu başlat
 */
window.onload = function() {
    const gif4 = document.getElementById('animatedGif4');
    const idleGif4 = document.getElementById('idleGif4');
    
    gif4.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif4.style.display = 'none';
    
    idleGif4.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif4.style.display = 'block';
};

shufflePatternAndItems4();
animate4(); 