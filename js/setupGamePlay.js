var gameOptions = {
    gameplaySound: true,
    voicesSound: true,
    shootingMethod: 'single',
    tutorial4Shown: false
}

var useChromeStorage;
try {
    var chromeStorage = window.chrome.storage.sync;
    if (chromeStorage) {
        useChromeStorage = true;
    } else {
        useChromeStorage = false;
    }
} catch (e) {
    useChromeStorage = false;
}

function fetchStoredGameOptions() {
    if (useChromeStorage) {
        chrome.storage.sync.get("gameplaySound", function (fetchedData) {
            if (fetchedData.gameplaySound) {
                gameOptions.gameplaySound = fetchedData.gameplaySound;
            }
        });

        chrome.storage.sync.get("voicesSound", function (fetchedData) {
            if (fetchedData.voicesSound) {
                gameOptions.voicesSound = fetchedData.voicesSound;
            }
        });

        chrome.storage.sync.get("shootingMethod", function (fetchedData) {
            if (fetchedData.shootingMethod) {
                gameOptions.shootingMethod = fetchedData.shootingMethod;
            }
        });

        chrome.storage.sync.get("tutorial4Shown", function (fetchedData) {
            if (fetchedData.tutorial4Shown) {
                gameOptions.tutorial4Shown = fetchedData.tutorial4Shown;
            }
        });
    } else {
        if (window.localStorage.gameplaySound) {
            gameOptions.gameplaySound = window.localStorage.gameplaySound.boolValue();
        }

        if (window.localStorage.voicesSound) {
            gameOptions.voicesSound = window.localStorage.voicesSound.boolValue();
        }

        if (window.localStorage.shootingMethod) {
            gameOptions.shootingMethod = window.localStorage.shootingMethod;
        }

        if (window.localStorage.tutorial4Shown) {
            gameOptions.tutorial4Shown = window.localStorage.tutorial4Shown.boolValue();
        }
    }
}

fetchStoredGameOptions();

function saveStoredGameOptions() {
    if (useChromeStorage) {
        chrome.storage.sync.set({"gameplaySound": gameOptions.gameplaySound});
        chrome.storage.sync.set({"voicesSound": gameOptions.voicesSound});
        chrome.storage.sync.set({"shootingMethod": gameOptions.shootingMethod});
        chrome.storage.sync.set({"tutorial4Shown": gameOptions.tutorial4Shown});
    } else {
        window.localStorage.gameplaySound = gameOptions.gameplaySound;
        window.localStorage.voicesSound = gameOptions.voicesSound;
        window.localStorage.shootingMethod = gameOptions.shootingMethod;
        window.localStorage.tutorial4Shown = gameOptions.tutorial4Shown;
    }
}

var $document = $(document);

var gameSizeRatio = 1.386;
var game = $('#game');
(function setupGameDiv() {
    if (window.innerWidth / window.innerHeight > 1.386) {
        game.height(window.innerHeight);
        game.width(game.height() * gameSizeRatio);
        if (!nodeWebkit) {
            game.css('left', Math.floor((window.innerWidth - game.width()) / 2) + 'px');
        }
    } else {
        game.width(window.innerWidth);
        game.height(game.width() / gameSizeRatio);
        if (!nodeWebkit) {
            game.css('top', Math.floor(window.innerHeight - game.height()) + 'px');
        }
    }
})();

var gesturesButton = $('#gesturesButton');
gesturesButton.width(game.height() / 11);
gesturesButton.height(gesturesButton.width() / 2.23);
gesturesButton.css('left', game.height() / 6);
gesturesButton.css('top', game.height() / 90);
gesturesButton.clicker = function () {
}
gesturesButton.addClass('clicker').on('clicker', function (e) {
    e.preventDefault();
    e.stopPropagation();
    gesturesButton.clicker();
});
gesturesButton.clicker = function () {
    if (gameplayPause) {
        gameplayPause();
    }

    playNavigationSound('bonusAlert', true, 1.0);
    $('#gesturesPage').css('display', 'block');

    $('#gesturesPage').addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (gameplayResume) {
            gameplayResume();
        }

        $('#gesturesPage').removeClass('clicker').unbind('clicker');

        stopNavigationSound('bonusAlert');
        $('#gesturesPage').css('display', 'none');
    });
}

var quitButton = $('#quitButton');
quitButton.width(game.height() / 11);
quitButton.height(quitButton.width() / 2.23);
quitButton.css('left', game.height() / 16.2);
quitButton.css('top', game.height() / 90);
quitButton.clicker = function () {
}
quitButton.addClass('clicker').on('clicker', function (e) {
    e.preventDefault();
    e.stopPropagation();
    quitButton.clicker();
});
quitButton.clicker = function () {
    if (gameplayPause) {
        gameplayPause();
    }

    playNavigationSound('bonusAlert', true, 1.0);
    $('#quitPage').css('display', 'block');
}

var doQuit = $('#doQuit');
doQuit.width(game.height() / 8);
doQuit.height(doQuit.width());
doQuit.css('left', game.height() / 1.8);
doQuit.css('top', game.height() / 2.3);
doQuit.clicker = function () {
}
doQuit.addClass('quiter').on('clicker', function (e) {
    e.preventDefault();
    e.stopPropagation();
    doQuit.clicker();
});
doQuit.clicker = function () {
    window.open('', '_self', '');
    window.close();
}

var dontQuit = $('#dontQuit');
dontQuit.width(game.height() / 7);
dontQuit.height(dontQuit.width());
dontQuit.css('left', game.height() / 1.38);
dontQuit.css('top', game.height() / 2.3);
dontQuit.clicker = function () {
}
dontQuit.addClass('quiter').on('clicker', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dontQuit.clicker();
});
dontQuit.clicker = function () {
    if (gameplayResume) {
        gameplayResume();
    }

    stopNavigationSound('bonusAlert');
    $('#quitPage').css('display', 'none');
}

var clickerDiv = $('#clicker');
clickerDiv.normalSize = game.height() / 18;
clickerDiv.scaleSize = function(percent) {
    clickerDiv[0].style.width = this.normalSize * percent + 'px';
    clickerDiv[0].style.height = this.normalSize * percent + 'px';
}
clickerDiv.scaleSize(1);
clickerDiv.css('opacity', 0.0);
clickerDiv.vis = false;

var gamePlay = $('#gamePlay');

var belowCanvas = $('#belowCanvas');
var belowCanvasTemplate = $('#belowCanvasTemplate');
(function storeBelowCanvasTemplate() {
    var belowCanvasTemplateHtml = belowCanvasTemplate.html();
    belowCanvasTemplate.remove();
    belowCanvasTemplate = belowCanvasTemplateHtml;
})();

var gameCanvas = $('#gameCanvas');
(function setupGameCanvas() {
    var gameCanvasSizeRatio = 1.499;
    var gameCanvasHeightPercent = 0.848;
    var gameCanvasLeftPercent = 0.0420;
    var gameCanvasTopPercent = 0.0583;

    window.logicalGameSize = {
        height: game.height() * gameCanvasHeightPercent,
        width: game.height() * gameCanvasHeightPercent * gameCanvasSizeRatio
    }

    gameCanvas[0].height = logicalGameSize.height;
    gameCanvas[0].width = logicalGameSize.width;
    gameCanvas.css('left', game.width() * gameCanvasLeftPercent + 'px');
    gameCanvas.css('top', game.height() * gameCanvasTopPercent + 'px');
    gameCanvas.css('opacity', 0.0);

    if (window.devicePixelRatio) {
        //gameCanvas[0].height *= window.devicePixelRatio;
        //gameCanvas[0].width *= window.devicePixelRatio;
        //gameCanvas[0].getContext('2d').scale(window.devicePixelRatio, window.devicePixelRatio);
    }
})();

var aboveCanvas = $('#aboveCanvas');
var aboveCanvasTemplate = $('#aboveCanvasTemplate');
(function storeAboveCanvasTemplate() {
    var aboveCanvasTemplateHtml = aboveCanvasTemplate.html();
    aboveCanvasTemplate.remove();
    aboveCanvasTemplate = aboveCanvasTemplateHtml;
})();

var gameplayImages = {};
(function loadImages() {
    var gameplayImageNames = [
        'blackIntro',
        'blackOutro',
        'bomb',
        'buzzkill',
        'forcefield',
        'gameBezel',
        'gamedial1',
        'gamedial2',
        'gamedial3',
        'gamedial4',
        'gamedial5',
        'gamedial6',
        'gamedial7',
        'gamedial8',
        'gamedial9',
        'gamedial10',
        'gamedial11',
        'gamedial12',
        'gamedial13',
        'honeycombBackground',
        'honeycombCell',
        'honeycombCover1',
        'honeycombCover2',
        'honeycombCover3',
        'honeycombCover4',
        'honeycombCover5',
        'honeycombCover6',
        'honeycombCover7',
        'jokerDark',
        'jokerDark3',
        'jokerLight',
        'jokerLight3',
        'levelIndicator1',
        'levelIndicator2',
        'levelIndicator3',
        'levelIndicator4',
        'levelIndicator5',
        'levelIndicator6',
        'levelIndicator7',
        'levelIntro1',
        'levelIntro2',
        'levelIntro3',
        'levelIntro4',
        'levelIntro5',
        'levelIntro6',
        'levelIntro7',
        'levelEndWin',
        'levelEndLose',
        'redFlash',
        'smoke',
        'turretHit',
        'turretLife',
        'turretLifeBonus',
        'leapCursor',
        'leapCursor2',
        'bonusShipAlert'
    ];
    for (var i = 0; i < gameplayImageNames.length; i++) {
        var newImage = new Image();
        var gameplayImageName = gameplayImageNames[i];

        newImage.onerror = function () {
            this.hadError = true;
        }

        newImage.src = 'img/gameplay/' + gameplayImageName + '.png';
        newImage.style.position = 'absolute';
        $('#gameplayImages').append(newImage);
        gameplayImages[gameplayImageName] = newImage;
    }
})();

function hideGameplayImage(imageName) {
    $('#gameplayImages').append(gameplayImages[imageName]);
}

function hideAllGameplayImages() {
    for (var imageName in gameplayImages) {
        hideGameplayImage(imageName);
    }
}

var gameplaySounds = {};
(function loadSounds() {
    var gameplaySoundNames = [
        'beeAttack',
        'beeTakingHit0',
        'beeTakingHit1',
        'bombAttackExplosion',
        'bulletBounce0',
        'bulletBounce1',
        'forcefield',
        'freezerHum',
        'healthPowerupBounce',
        'healthPowerupMoving',
        'healthWarning',
        'hiveBackground',
        'largeBlast',
        'levelIntroScreen',
        'massiveTurretBlastBlowingUp',
        'queenExplodingOutHoneyBees',
        'shot',
        'smallBlast',
        'smokeAttack',
        'turretBackground',
        'levelWinOrLose',
        'turretLevelEndZoomUp',
        'turretBeingHit',
        'turretDieing',
        'uberBossTakingHit0',
        'uberBossTakingHit1',
        'turretDeath'
    ];
    for (var i = 0; i < gameplaySoundNames.length; i++) {
        var newSound = document.createElement('audio');
        var gameplaySoundName = gameplaySoundNames[i];
        newSound.src = 'sound/gameplay/' + gameplaySoundName + '.ogg';
        $('#gameplaySounds').append(newSound);
        gameplaySounds[gameplaySoundName] = newSound;
    }
})();

function playGameplaySound(soundName, loop, volume) {
    var soundToPlay = gameplaySounds[soundName];
    soundToPlay.startPlayback(loop, volume, !gameOptions.gameplaySound);
}

function stopGameplaySound(soundName) {
    var soundToPause = gameplaySounds[soundName];
    soundToPause.stopPlayback();
}

function stopAllGameplaySounds() {
    for (var soundName in gameplaySounds) {
        stopGameplaySound(soundName);
    }
}

function pausePlayingGameplaySound(soundName) {
    var soundToPause = gameplaySounds[soundName];
    soundToPause.pausePlayback();
}

function pauseAllPlayingGameplaySounds() {
    for (var soundName in gameplaySounds) {
        pausePlayingGameplaySound(soundName);
    }
}

function muteGameplaySound(soundName) {
    var soundToMute = gameplaySounds[soundName];
    soundToMute.mutePlayback();
}

function muteAllGameplaySounds() {
    for (var soundName in gameplaySounds) {
        muteGameplaySound(soundName);
    }
}

function unmuteGameplaySound(soundName) {
    var soundToUnmute = gameplaySounds[soundName];
    soundToUnmute.unmutePlayback();
}

function unmuteAllGameplaySounds() {
    for (var soundName in gameplaySounds) {
        unmuteGameplaySound(soundName);
    }
}

function resumeAllPausedGameplaySounds() {
    for (var soundName in gameplaySounds) {
        var soundToResume = gameplaySounds[soundName];
        soundToResume.resumePlayback();
    }
}

var gameplayVideos = {};
(function loadVideos() {
    var videoNames = [
        'smoke',
        'bomb',
        'fumesOverlay1',
        'fumesOverlay2',
        'fumesOverlay3',
        'fumesOverlay4',
        'fumesOverlay5',
        'fumesOverlay6',
        'fumesOverlay7'
    ];
    for (var i = 0; i < videoNames.length; i++) {
        var newVideo = document.createElement('video');
        var videoName = videoNames[i];
        newVideo.style.position = 'absolute';

        newVideo.onerror = function () {
            this.hadError = true;
        }

        newVideo.src = 'video/gameplay/' + videoName + '.ogv';
        $('#gameplayVideos').append(newVideo);
        gameplayVideos[videoName] = newVideo;
    }
})();

function playGameplayVideo(videoName, loop, volume) {
    var videoToPlay = gameplayVideos[videoName];
    videoToPlay.startPlayback(loop, volume, true);
}

function stopGameplayVideo(videoName) {
    var videoToPause = gameplayVideos[videoName];
    videoToPause.stopPlayback();
}

function stopAllGameplayVideos() {
    for (var videoName in gameplayVideos) {
        stopGameplayVideo(videoName);
    }
}

function pausePlayingGameplayVideo(videoName) {
    var videoToPause = gameplayVideos[videoName];
    videoToPause.pausePlayback();
}

function pauseAllPlayingGameplayVideos() {
    for (var videoName in gameplayVideos) {
        pausePlayingGameplayVideo(videoName);
    }
}

function resumeAllPausedGameplayVideos() {
    for (var videoName in gameplayVideos) {
        var videoToResume = gameplayVideos[videoName];
        videoToResume.resumePlayback();
    }
}

function hideGameplayVideo(videoName) {
    stopGameplayVideo(videoName);
    $('#gameplayVideos').append(gameplayVideos[videoName]);
}

function hideAllGameplayVideos() {
    for (var videoName in gameplayVideos) {
        hideGameplayVideo(videoName);
    }
}

var gameplayGifs = {};
(function loadGifs() {
    var gifNames = [
        ['turretDieing', 'turretDieing'],
        ['turretDieing', 'turretDieing2'],
        ['turretDieing', 'turretDieing3'],
        ['turretDieing', 'turretDieing4'],
        ['forcefield', 'forcefield']
    ];
    for (var i = 0; i < gifNames.length; i++) {
        var newGif = new Image();
        newGif.style.position = 'absolute';
        newGif.src = 'gif/gameplay/' + gifNames[i][0] + '.gif?' + Math.random() + '' + new Date().getMilliseconds();
        $('#gameplayGifs').append(newGif);
        gameplayGifs[gifNames[i][1]] = newGif;
    }
})();

function hideGameplayGif(gifName) {
    $('#gameplayGifs').append(gameplayGifs[gifName]);
}

function hideAllGameplayGifs() {
    for (var gifName in gameplayGifs) {
        hideGameplayGif(gifName);
    }
}

loadScript('js/setupNavigation.js');