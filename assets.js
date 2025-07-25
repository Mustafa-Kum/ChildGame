// Shared image assets
const ASSETS = {
    images: {
        background: 'GameBackground.png',
        pinkFrame: 'PinkFrame.png',
        whiteFrame: 'WhiteFrame.png',
        rightFrame: 'WhiteFrame.png',
        header: 'Header.png',
        car: 'Car.png',
        pumpkin: 'Pumpkin.png',
        tractor: 'Traktor.png',
        horizontalPinkFrame: 'HorizontalPinkFrame.png',
        boy: 'boyImage.png',
        girl: 'girlImage.png',
        cheese: 'cheese.png',
        pear: 'pear.png',
        pie: 'pie.png',
        taxi: 'taxi.png',
        donut: 'donut.png',
        eight: 'eight.png',
        elephant: 'elephant.png',
        four: 'four.png',
        grape: 'grape.png',
        orange: 'orange.png',
        six: 'six.png',
        two: 'two.png',
        greenframe: 'greenframe.png',
        orangeframe: 'orangeframe.png',
        purpleframe: 'purpleframe.png',
        redframe: 'redframe.png',
        leaf: 'leaf.png',
        squirle: 'squirle.png',
        monkey: 'monkey.png',
        zebra: 'zebra.png',
        bull: 'bull.png',
        orangebaloon: 'orangebaloon.png',
        purplebaloon: 'purplebaloon.png',
        redbaloon: 'redbaloon.png',
        correct: 'correct.png',
        wrong: 'wrongAnswer.png',
        tutorialHand: 'tutorialHand.png',
        questionmark: 'questionmark.png',
        lowerletterb: 'lowerletterb.png',
        lowerletterh: 'lowerletterh.png',
        lowerletterm: 'lowerletterm.png',
        lowerlettery: 'lowerlettery.png',
        upperletterb: 'upperletterb.png',
        upperletterh: 'upperletterh.png',
        upperletterm: 'upperletterm.png',
        upperlettery: 'upperlettery.png',
    },
    gifs: {
        idle: 'idleGif.gif',
        tiger: 'tiger.gif'
    },
    audio: {
        correct: 'KidYayVoice.MP3',
        wrong: 'WrongAnswer.MP3',
        one: '1.MP3',
        two: '2.MP3',
        three: '3.MP3',
        four: '4.MP3',
        five: '5.MP3',
        six: '6.MP3',
        kidsapplauding: 'Kidsapplauding.MP3',
        mouseHover: 'MouseHoverSound.MP3',
        background: 'BackgroundMusic.mp3',
        small: 'small.mp3',
        large: 'large.mp3'
    }
};

// Preloaded assets storage
const preloadedAssets = {
    images: {},
    gifs: {},
    audio: {}
};

// Preload all assets function
function preloadAllAssets(onProgress, onComplete) {
    let totalAssets = Object.keys(ASSETS.images).length + 
                      Object.keys(ASSETS.gifs).length + 
                      Object.keys(ASSETS.audio).length;
    let loadedAssets = 0;

    function updateProgress() {
        loadedAssets++;
        if (onProgress) {
            onProgress(loadedAssets / totalAssets * 100);
        }
        if (loadedAssets === totalAssets && onComplete) {
            onComplete();
        }
    }

    // Preload images
    Object.entries(ASSETS.images).forEach(([key, src]) => {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress;
        img.src = src;
        preloadedAssets.images[key] = img;
    });

    // Preload GIFs
    Object.entries(ASSETS.gifs).forEach(([key, src]) => {
        const img = new Image();
        img.onload = updateProgress;
        img.onerror = updateProgress;
        img.src = src;
        preloadedAssets.gifs[key] = img;
    });

    // Preload audio
    Object.entries(ASSETS.audio).forEach(([key, src]) => {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', updateProgress, { once: true });
        audio.addEventListener('error', updateProgress, { once: true });
        audio.src = src;
        preloadedAssets.audio[key] = audio;
    });
}

// Asset loader functions now use preloaded assets
function loadImage(key) {
    return preloadedAssets.images[key] || new Image();
}

function loadGif(key) {
    return preloadedAssets.gifs[key] || new Image();
}

function loadAudio(key) {
    return preloadedAssets.audio[key] || new Audio();
}

// Export the assets and loader functions
window.GAME_ASSETS = {
    ASSETS,
    loadImage,
    loadGif,
    loadAudio,
    preloadAllAssets
}; 