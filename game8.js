/************************************************
 *                OYUN 8 (Game8)
 ************************************************/

/**
 * 1) Canvas ve context tanımlamaları
 */
const canvas8 = document.getElementById('gameCanvas8');
const ctx8 = canvas8.getContext('2d');

// Canvas boyutunu pencereye göre ayarla
canvas8.width = window.innerWidth;
canvas8.height = window.innerHeight;

/**
 * 2) Resimlerin yüklenmesi - artık preloaded
 */
const backgroundImage8 = GAME_ASSETS.loadImage('background');
const pinkFrame8 = GAME_ASSETS.loadImage('pinkFrame');
const whiteFrame8 = GAME_ASSETS.loadImage('whiteFrame');
const rightFrame8 = GAME_ASSETS.loadImage('rightFrame');
const headerImage8 = GAME_ASSETS.loadImage('header');
const carImage8 = GAME_ASSETS.loadImage('car');
const pumpkinImage8 = GAME_ASSETS.loadImage('pumpkin');
const tractorImage8 = GAME_ASSETS.loadImage('tractor');
const horizontalPinkFrame8 = GAME_ASSETS.loadImage('horizontalPinkFrame');
const boyImage8 = GAME_ASSETS.loadImage('boy');
const girlImage8 = GAME_ASSETS.loadImage('girl');
const cheese8 = GAME_ASSETS.loadImage('cheese');
const pear8 = GAME_ASSETS.loadImage('pear');
const pie8 = GAME_ASSETS.loadImage('pie');
const taxi8 = GAME_ASSETS.loadImage('taxi');
const donut8 = GAME_ASSETS.loadImage('donut');
const eight8 = GAME_ASSETS.loadImage('eight');
const elephant8 = GAME_ASSETS.loadImage('elephant');
const four8 = GAME_ASSETS.loadImage('four');
const grape8 = GAME_ASSETS.loadImage('grape');
const orange8 = GAME_ASSETS.loadImage('orange');
const six8 = GAME_ASSETS.loadImage('six');
const two8 = GAME_ASSETS.loadImage('two');
const greenframe8 = GAME_ASSETS.loadImage('greenframe');
const orangeframe8 = GAME_ASSETS.loadImage('orangeframe');
const purpleframe8 = GAME_ASSETS.loadImage('purpleframe');
const redframe8 = GAME_ASSETS.loadImage('redframe');
const leaf8 = GAME_ASSETS.loadImage('leaf');
const squirle8 = GAME_ASSETS.loadImage('squirle');
const monkey8 = GAME_ASSETS.loadImage('monkey');
const zebra8 = GAME_ASSETS.loadImage('zebra');
const bull8 = GAME_ASSETS.loadImage('bull');
const correct8 = GAME_ASSETS.loadImage('correct');
const wrong8 = GAME_ASSETS.loadImage('wrong');

/**
 * 3) Ses dosyaları - artık preloaded
 */
const correctSound8 = GAME_ASSETS.loadAudio('correct');
const wrongAnswer8 = GAME_ASSETS.loadAudio('wrong');
const kidsapplauding8 = GAME_ASSETS.loadAudio('kidsapplauding');
const mouseHoverSound8 = GAME_ASSETS.loadAudio('mouseHover');
const backgroundMusic8 = GAME_ASSETS.loadAudio('background');
backgroundMusic8.loop = true;
backgroundMusic8.volume = 0.1;

/**
 * 4) Global değişkenler
 */
let iconAnimations8 = {
    size: 0,
    opacity: 0
};
let correctMatch8 = null;
let wrongFrames8 = [];
let hoveredFrame8 = null;
let previousHoveredFrame8 = null;

const animalPool8 = [
    { image: monkey8, isCorrect: false },
    { image: zebra8, isCorrect: false },
    { image: bull8, isCorrect: false },
    { image: elephant8, isCorrect: false }
];

const gameItems8 = {
    items: [],
    currentSet: 0,
    resetItems: function() {
        // 3 rastgele hayvan seç
        const randomAnimals = getRandomAnimals8(3);

        // Yeni items dizisini oluştur
        this.items = [
            ...randomAnimals.slice(0, 2), // İlk 2 rastgele hayvan
            { image: squirle8, isCorrect: true }, // Squirrel her zaman var
            randomAnimals[2] // Son rastgele hayvan
        ];

        // Pozisyonları karıştır
        this.items.sort(() => 0.5 - Math.random());
    }
};

gameItems8.resetItems();

/**
 * 5) Confetti için değişkenler ve sınıf
 */
let confetti8 = [];
let isConfettiActive8 = false;
const COLORS8 = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

class Confetti8 {
    constructor() {
        this.x = Math.random() * canvas8.width;
        this.y = -10;
        this.width = 10;
        this.height = 10;
        this.speed = 3 + Math.random() * 5;
        this.color = COLORS8[Math.floor(Math.random() * COLORS8.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        ctx8.save();
        ctx8.translate(this.x, this.y);
        ctx8.rotate(this.rotation * Math.PI / 180);
        ctx8.fillStyle = this.color;
        ctx8.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx8.restore();
    }
}

/**
 * 6) Yardımcı fonksiyonlar
 */
function startConfetti8() {
    isConfettiActive8 = true;
    confetti8 = [];
    for (let i = 0; i < 100; i++) {
        confetti8.push(new Confetti8());
    }
}

function animateIcon8(isCorrect) {
    iconAnimations8.size = 0;
    iconAnimations8.opacity = 0;

    const animate = () => {
        iconAnimations8.size = Math.min(1, iconAnimations8.size + 0.1);
        iconAnimations8.opacity = Math.min(1, iconAnimations8.opacity + 0.1);

        if (iconAnimations8.size < 1) {
            requestAnimationFrame(animate);
        }

        if (!isCorrect && iconAnimations8.size >= 1) {
            setTimeout(() => {
                const scaleDown = () => {
                    iconAnimations8.size -= 0.1;
                    if (iconAnimations8.size > 0) {
                        requestAnimationFrame(scaleDown);
                    } else {
                        wrongFrames8 = [];
                    }
                };
                scaleDown();
            }, 1000);
        }
    };

    animate();
}

function getRandomAnimals8(count) {
    const shuffled = [...animalPool8].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function draw8() {
    ctx8.clearRect(0, 0, canvas8.width, canvas8.height);
    ctx8.drawImage(backgroundImage8, 0, 0, canvas8.width, canvas8.height);

    const headerWidth = canvas8.width * 0.4;
    const headerHeight = headerWidth * (headerImage8.height / headerImage8.width);
    const headerX = (canvas8.width - headerWidth) / 2;
    const headerY = canvas8.height * 0.05;
    ctx8.drawImage(headerImage8, headerX, headerY, headerWidth, headerHeight);

    const frameWidth = canvas8.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas8.width * 0.02;
    const startX = (canvas8.width - (4 * frameWidth + 3 * spacing)) / 2;
    const itemsY = canvas8.height * 0.3;

    gameItems8.items.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;

        ctx8.drawImage(whiteFrame8, itemX, itemsY, frameWidth, frameHeight);

        if (wrongFrames8.includes(index)) {
            const maxSize = frameWidth * 0.7;
            const currentSize = maxSize * (iconAnimations8.size);
            const wrongX = itemX + (frameWidth - currentSize) / 2;
            const wrongY = itemsY + (frameHeight - currentSize) / 2;

            ctx8.globalAlpha = iconAnimations8.opacity;
            ctx8.drawImage(wrong8, wrongX, wrongY, currentSize, currentSize);
            ctx8.globalAlpha = 1.0;
            return;
        }

        if (correctMatch8 === index) {
            const maxSize = frameWidth * 0.7;
            const correctX = itemX + (frameWidth - maxSize) / 2;
            const correctY = itemsY + (frameHeight - maxSize) / 2;
            ctx8.drawImage(correct8, correctX, correctY, maxSize, maxSize);
        } else {
            ctx8.drawImage(item.image,
                itemX + frameWidth * 0.1,
                itemsY + frameHeight * 0.1,
                frameWidth * 0.8,
                frameHeight * 0.8
            );
        }

        if (hoveredFrame8 === index) {
            ctx8.strokeStyle = '#FFD700';
            ctx8.lineWidth = 3;
            ctx8.strokeRect(itemX, itemsY, frameWidth, frameHeight);
        }
    });
}

/**
 * 7) Event listeners
 */
canvas8.addEventListener('click', function(event) {
    backgroundMusic8.play();

    const rect = canvas8.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas8.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas8.width * 0.02;
    const startX = (canvas8.width - (4 * frameWidth + 3 * spacing)) / 2;
    const itemsY = canvas8.height * 0.3;

    gameItems8.items.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= itemsY && mouseY <= itemsY + frameHeight) {
            if (item.isCorrect) {
                correctSound8.play();
                kidsapplauding8.play();
                startConfetti8();
                correctMatch8 = index;
                animateIcon8(true);

                document.getElementById('idleGif8').style.display = 'none';
                const gif = document.getElementById('animatedGif8');
                gif.src = '';
                setTimeout(() => {
                    gif.src = GAME_ASSETS.ASSETS.gifs.tiger;
                    gif.style.display = 'block';
                }, 0);

                setTimeout(() => {
                    isConfettiActive8 = false;
                    // Game8'i sola kaydır
                    document.getElementById("gameContainer8").style.transform = 'translateX(-100%)';
                    // Game9'u sağdan getir
                    document.getElementById("gameContainer9").classList.add("slide-in");
                    if (typeof animate9 === 'function') {
                        animate9();
                    }
                    gif.style.display = 'none';
                    document.getElementById('idleGif8').style.display = 'block';
                    correctMatch8 = null;
                    wrongFrames8 = [];
                    gameItems8.resetItems();
                }, 2000);
            } else {
                wrongAnswer8.play();
                wrongFrames8.push(index);
                animateIcon8(false);
            }
        }
    });
});

canvas8.addEventListener('mousemove', function(event) {
    const rect = canvas8.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const frameWidth = canvas8.width * 0.15;
    const frameHeight = frameWidth;
    const spacing = canvas8.width * 0.02;
    const startX = (canvas8.width - (4 * frameWidth + 3 * spacing)) / 2;
    const itemsY = canvas8.height * 0.3;

    let newHoveredFrame = null;

    gameItems8.items.forEach((item, index) => {
        const itemX = startX + (frameWidth + spacing) * index;
        if (mouseX >= itemX && mouseX <= itemX + frameWidth &&
            mouseY >= itemsY && mouseY <= itemsY + frameHeight) {
            newHoveredFrame = index;
        }
    });

    if (newHoveredFrame !== previousHoveredFrame8 && newHoveredFrame !== null) {
        mouseHoverSound8.play();
    }

    previousHoveredFrame8 = newHoveredFrame;
    hoveredFrame8 = newHoveredFrame;
});

window.addEventListener('resize', function() {
    canvas8.width = window.innerWidth;
    canvas8.height = window.innerHeight;
    draw8();
});

/**
 * 8) Animasyon döngüsü
 */
function animate8() {
    ctx8.clearRect(0, 0, canvas8.width, canvas8.height);
    draw8();

    if (isConfettiActive8) {
        confetti8.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (particle.y > canvas8.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas8.width;
            }
        });
    }

    requestAnimationFrame(animate8);
}

/**
 * 9) Oyunu başlat
 */
window.onload = function() {
    const gif8 = document.getElementById('animatedGif8');
    const idleGif8 = document.getElementById('idleGif8');
    
    gif8.src = GAME_ASSETS.ASSETS.gifs.tiger;
    gif8.style.display = 'none';
    
    idleGif8.src = GAME_ASSETS.ASSETS.gifs.idle;
    idleGif8.style.display = 'block';
};

animate8(); 