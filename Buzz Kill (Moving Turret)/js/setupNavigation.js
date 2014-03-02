var navigationImages = {};
(function loadImages() {
    var navigationImageNames = [
        'initialPageControlDiskBlack',
        'initialPageControlDisk',
        'gamewonPage',
        'gameoverPage',
        'gameEndOptionsPage',
        'black'
    ];
    for (var i = 0; i < navigationImageNames.length; i++) {
        var newImage = new Image();
        var navigationImageName = navigationImageNames[i];

        newImage.onerror = function () {
            this.hadError = true;
        }

        newImage.src = 'img/navigation/' + navigationImageName + '.png';
        newImage.style.position = 'absolute';
        $('#navigationImages').append(newImage);
        navigationImages[navigationImageName] = newImage;
    }
})();

var navigationSounds = {};
(function loadSounds() {
    var navigationSoundNames = [
        'introLevelSound',
        'titleScreenAway',
        'optionsPageBackgroundSound',
        'pageTurn',
        'buttonPress',
        'typewriter',
        'smallVaultDoorWithProbe',
        'introThemeSong',
        'mainVaultDoorOpening',
        'initialScreenElevator',
        'gameEndWinOrLose',
        'honeyGridFilled',
        'bonusAlert'
    ];
    for (var i = 0; i < navigationSoundNames.length; i++) {
        var newSound = document.createElement('audio');
        var navigationSoundName = navigationSoundNames[i];
        newSound.src = 'sound/navigation/' + navigationSoundName + '.ogg';

        $('#navigationSounds').append(newSound);
        navigationSounds[navigationSoundName] = newSound;
    }
})();

function playNavigationSound(soundName, loop, volume) {
    var soundToPlay = navigationSounds[soundName];
    soundToPlay.startPlayback(loop, volume, !gameOptions.gameplaySound);
}

function stopNavigationSound(soundName) {
    var soundToPause = navigationSounds[soundName];
    soundToPause.stopPlayback();
}

function muteNavigationSound(soundName) {
    var soundToMute = navigationSounds[soundName];
    soundToMute.mutePlayback();
}

function muteAllNavigationSounds() {
    for (var soundName in navigationSounds) {
        muteNavigationSound(soundName);
    }
}

function unmuteNavigationSound(soundName) {
    var soundToUnmute = navigationSounds[soundName];
    soundToUnmute.unmutePlayback();
}

function unmuteAllNavigationSounds() {
    for (var soundName in navigationSounds) {
        unmuteNavigationSound(soundName);
    }
}

var navigation = $('#navigation');

function showNavigation() {
    navigation.css('z-index', 1);

    if (parseFloat(navigation.css('opacity')) < 1) {
        navigation.animate({'opacity': 1.0}, 700, function () {

        });
    }
}

function hideNavigation() {
    stopNavigationSound('introThemeSong');

    navigation.css('z-index', -1);
    navigation.css('opacity', 0.0);
}

var initialPage = $('#initialPage');

function showInitialPage() {
    initialPage.css('z-index', 1);
    initialPage.css('opacity', 1.0);

    showNavigation();

    playNavigationSound('introThemeSong', true, 0.6);
}

function hideInitialPage() {
    initialPage.css('z-index', -1);
    initialPage.css('opacity', 0.0);
}

var initialPageVaultDoor = $('#initialPageVaultDoor');
var initialPageVaultDoorFrontUnlocked = $('#initialPageVaultDoorFrontUnlocked');

(function setupInitialPageVaultDoor() {
    initialPageVaultDoor.css('left', initialPage.height() / 2.1 + 'px');
    initialPageVaultDoor.css('top', initialPage.height() / 5.8 + 'px');
    initialPageVaultDoor.height(initialPage.height() / 1.73);
    initialPageVaultDoor.width(initialPageVaultDoor.height() * 0.847);
    initialPageVaultDoor.css('-webkit-perspective', initialPageVaultDoor.width() * 3.8 + 'px');
})();

function openElevator() {
    $('#initialPageOverlay').css('display', 'block');
    $('#initialPageOverlay').backgroundImg('url(' + navigationImages['initialPageControlDiskBlack'].src + ')');
    $('#initialPageOverlay').animate({'opacity': 1.0}, 1000, function () {
        initialPage.backgroundImg('url(' + navigationImages['initialPageControlDisk'].src + ')');
        navigationSounds['introThemeSong'].setPlaybackVolume(0.38);
        playNavigationSound('initialScreenElevator', false, 1.0);
        $.timeout(2900, function () {
            navigationSounds['introThemeSong'].setPlaybackVolume(0.6);
        });

        $.timeout(2400, function () {
            $('#initialPageOverlay').animate({'opacity': 0.0}, 1000, function () {
                $('#initialPageOverlay').css('display', 'none');
                initialPagePlate.css('display', 'block');
            });
        });
    });

    $('#initialPage').removeClass('clicker').unbind('clicker');
    openElevator = function () {
    }
}

function openInitialPageVaultDoor() {
    function movePastSplashscreen() {
        $('#initialPageOverlay').animate({'opacity': 0.0}, 1000, function () {
            $('#initialPageOverlay').css('display', 'none');
            $.timeout(600, function () {
                navigationSounds['introThemeSong'].setPlaybackVolume(0.38);
                playNavigationSound('smallVaultDoorWithProbe', false, 1.0);
                initialPageVaultDoorFrontUnlocked.css('display', 'block');
                $.timeout(2600, function () {
                    $.timeout(50, function () {
                        navigationSounds['introThemeSong'].setPlaybackVolume(0.6);
                        initialPageVaultDoorFrontUnlocked.css('display', 'none');
                        $.timeout(1800, function () {
                            playNavigationSound('mainVaultDoorOpening', false, 1.0);
                            initialPageVaultDoor.addClass('flip');

                            if (window.forLeapStore && !gameOptions.tutorial4Shown) {
                                $.timeout(1000, function() {
                                    $('#initialPageTutorialOverlay').css('display', 'block');
                                    $('#initialPageTutorialOverlay').css('zIndex', 10);
                                    $('#initialPageTutorialOverlay').animate({'opacity':1.0}, function() {
                                        $.timeout(1000, function() {
                                            $('#initialPageTutorialOverlay').addClass('clicker').on('clicker', function () {
                                                $('#initialPageTutorialOverlay').animate({'opacity':0.0}, function() {
                                                    $('#initialPageTutorialOverlay').removeClass('clicker').unbind('clicker');
                                                    $('#initialPageTutorialOverlay').remove();
                                                    gameOptions.tutorial4Shown = true;
                                                    saveStoredGameOptions();
                                                    openElevator();
                                                });
                                            });
                                        });
                                    });
                                });
                            } else {
                                $('#initialPageTutorialOverlay').remove();

                                $.timeout(8500, function () {
                                    openElevator();
                                });

                                $('#initialPage').addClass('clicker').on('clicker', function () {
                                    openElevator();
                                });
                            }
                        });
                    });
                });
            });
        });
        movePastSplashscreen = function () {
        }
    }

    quitButton.animate({'opacity':1.0}, 1600);

    if (window.forLeapStore) {
        gesturesButton.animate({'opacity':1.0}, 1600);
    } else {
        gesturesButton.css('display', 'none');
    }

    $('#initialPageOverlay').animate({'opacity': 1.0}, 1600, function () {
        $.timeout(4000, function () {
            movePastSplashscreen();
        });

        $('#initialPageOverlay').addClass('clicker').on('clicker', function () {
            movePastSplashscreen();
        })
    });
}

var initialPagePlate = $('#initialPagePlate');
var initialPagePlayButton = $('#initialPagePlayButton');
var initialPageBriefingButton = $('#initialPageBriefingButton');
var initialPageOptionsButton = $('#initialPageOptionsButton');
var initialPageGameplayButton = $('#initialPageGameplayButton');
(function setupInitialPage() {
    initialPagePlate.css('left', initialPage.height() / 1.74 + 'px');
    initialPagePlate.css('top', initialPage.height() / 2.96 + 'px');
    initialPagePlate.height(initialPage.height() / 3.44);
    initialPagePlate.width(initialPagePlate.height());

    initialPagePlayButton.css('left', initialPagePlate.width() / 3.4 + 'px');
    initialPagePlayButton.css('top', initialPagePlate.height() / 16 + 'px');
    initialPagePlayButton.height(initialPagePlate.height() / 3.8);
    initialPagePlayButton.width(initialPagePlate.width() / 2.3);
    initialPagePlayButton.clicker = function () {
    }
    initialPagePlayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        initialPagePlayButton.clicker();
    });

    initialPageBriefingButton.css('left', initialPagePlate.width() / 3.4 + 'px');
    initialPageBriefingButton.css('top', initialPagePlate.height() / 1.5 + 'px');
    initialPageBriefingButton.height(initialPagePlate.height() / 3.8);
    initialPageBriefingButton.width(initialPagePlate.width() / 2.3);
    initialPageBriefingButton.clicker = function () {
    }
    initialPageBriefingButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        initialPageBriefingButton.clicker();
    });

    initialPageGameplayButton.css('left', initialPagePlate.width() / 12 + 'px');
    initialPageGameplayButton.css('top', initialPagePlate.height() / 3.4 + 'px');
    initialPageGameplayButton.height(initialPagePlate.height() / 2.5);
    initialPageGameplayButton.width(initialPagePlate.width() / 4.2);
    initialPageGameplayButton.clicker = function () {
    }
    initialPageGameplayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        initialPageGameplayButton.clicker();
    });

    initialPageOptionsButton.css('left', initialPagePlate.width() / 1.5 + 'px');
    initialPageOptionsButton.css('top', initialPagePlate.height() / 3.4 + 'px');
    initialPageOptionsButton.height(initialPagePlate.height() / 2.5);
    initialPageOptionsButton.width(initialPagePlate.width() / 4.2);
    initialPageOptionsButton.clicker = function () {
    }
    initialPageOptionsButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        initialPageOptionsButton.clicker();
    });
})();

var playButtonLayout = {
    left: initialPage.width() / 3.9,
    top: initialPage.height() / 9.0,
    height: initialPage.height() / 12.4,
    width: initialPage.height() / 15
}

var briefingButtonLayout = {
    left: initialPage.width() / 2.64,
    top: initialPage.height() / 17.2,
    height: initialPage.height() / 12.4,
    width: initialPage.height() / 15
}

var gameplayButtonLayout = {
    left: initialPage.width() / 2.24,
    top: initialPage.height() / 26,
    height: initialPage.height() / 12.4,
    width: initialPage.height() / 15
}

var optionsButtonLayout = {
    left: initialPage.width() / 1.91,
    top: initialPage.height() / 44,
    height: initialPage.height() / 12.4,
    width: initialPage.height() / 15
}

var coverPage = $('#coverPage');

function showCoverPage() {
    coverPage.css('z-index', 1);
    coverPage.css('left', 0);
    coverPage.css('opacity', 1.0);
}

function hideCoverPage() {
    coverPage.css('z-index', -1);
    coverPage.css('opacity', 0.0);
}

var briefingPage = $('#briefingPage');

function showBriefingPage() {
    briefingPage.css('z-index', 1);
    briefingPage.css('opacity', 1.0);
    showCoverPage();

    showNavigation();
}

function hideBriefingPage() {
    stopNavigationSound('typewriter');
    briefingPage.css('z-index', -1);
    briefingPage.css('opacity', 0.0);
}

var briefingPlayButton = $('#briefingPlayButton');
var briefingOptionsButton = $('#briefingOptionsButton');
var briefingGameplayButton = $('#briefingGameplayButton');
var briefingPageText = $('#briefingPageText');
(function setupBriefingPage() {
    briefingPlayButton.css('left', playButtonLayout.left + 'px');
    briefingPlayButton.css('top', playButtonLayout.top + 'px');
    briefingPlayButton.height(playButtonLayout.height);
    briefingPlayButton.width(playButtonLayout.width);
    briefingPlayButton.clicker = function () {
    }
    briefingPlayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        briefingPlayButton.clicker();
    });

    briefingGameplayButton.css('left', gameplayButtonLayout.left + 'px');
    briefingGameplayButton.css('top', gameplayButtonLayout.top + 'px');
    briefingGameplayButton.height(gameplayButtonLayout.height);
    briefingGameplayButton.width(gameplayButtonLayout.width);
    briefingGameplayButton.clicker = function () {
    }
    briefingGameplayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        briefingGameplayButton.clicker();
    });

    briefingOptionsButton.css('left', optionsButtonLayout.left + 'px');
    briefingOptionsButton.css('top', optionsButtonLayout.top + 'px');
    briefingOptionsButton.height(optionsButtonLayout.height);
    briefingOptionsButton.width(optionsButtonLayout.width);
    briefingOptionsButton.clicker = function () {
    }
    briefingOptionsButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        briefingOptionsButton.clicker();
    });

    briefingPageText.css('left', briefingPage.height() / 1.98 + 'px');
    briefingPageText.css('top', briefingPage.height() / 3.28 + 'px');
    briefingPageText.height(briefingPage.height() * 0.9);
    briefingPageText.width(briefingPage.width() * 0.32);
    briefingPageText.css('font-family', 'Typewriter');
    briefingPageText.css('font-size', briefingPage.width() / 88);

    coverPage.clicker = function () {
    }
    coverPage.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        coverPage.clicker();
    });
})();

var optionsPage = $('#optionsPage');

function showOptionsPage() {
    optionsPage.css('z-index', 1);
    optionsPage.css('opacity', 1.0);

    if (!navigationSounds['optionsPageBackgroundSound'].isPlaying) {
        playNavigationSound('optionsPageBackgroundSound', true, 1.0);
    }

    showNavigation();
}

function hideOptionsPage() {
    optionsPage.css('z-index', -1);
    optionsPage.css('opacity', 0.0);
}

var optionsPlayButton = $('#optionsPlayButton');
var optionsBriefingButton = $('#optionsBriefingButton');
var optionsGameplayButton = $('#optionsGameplayButton');
var optionsCreditsButton = $('#optionsCreditsButton');
var optionsNewButton = $('#optionsNewButton');
var optionsQuitButton = $('#optionsQuitButton');
var optionsShootingMethodButtons = $('#optionsShootingMethodButtons');
var optionsShootingMethodSingleButton = $('#optionsShootingMethodSingleButton');
var optionsShootingMethodSemiButton = $('#optionsShootingMethodSemiButton');
var optionsShootingMethodAutoButton = $('#optionsShootingMethodAutoButton');
var optionsGameplaySoundButtons = $('#optionsGameplaySoundButtons');
var optionsGameplaySoundOnButton = $('#optionsGameplaySoundOnButton');
var optionsGameplaySoundOffButton = $('#optionsGameplaySoundOffButton');
var optionsCloseButton = $('#optionsCloseButton');
var optionsContinueButton = $('#optionsContinueButton');
(function setupOptionsPage() {
    optionsPlayButton.css('left', playButtonLayout.left + 'px');
    optionsPlayButton.css('top', playButtonLayout.top + 'px');
    optionsPlayButton.height(playButtonLayout.height);
    optionsPlayButton.width(playButtonLayout.width);
    optionsPlayButton.clicker = function () {
    }
    optionsPlayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsPlayButton.clicker();
    });

    optionsBriefingButton.css('left', briefingButtonLayout.left + 'px');
    optionsBriefingButton.css('top', briefingButtonLayout.top + 'px');
    optionsBriefingButton.height(briefingButtonLayout.height);
    optionsBriefingButton.width(briefingButtonLayout.width);
    optionsBriefingButton.clicker = function () {
    }
    optionsBriefingButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsBriefingButton.clicker();
    });

    optionsGameplayButton.css('left', gameplayButtonLayout.left + 'px');
    optionsGameplayButton.css('top', gameplayButtonLayout.top + 'px');
    optionsGameplayButton.height(gameplayButtonLayout.height);
    optionsGameplayButton.width(gameplayButtonLayout.width);
    optionsGameplayButton.clicker = function () {
    }
    optionsGameplayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsGameplayButton.clicker();
    });

    optionsCreditsButton.css('left', optionsPage.width() / 2.21 + 'px');
    optionsCreditsButton.css('top', optionsPage.height() / 1.6 + 'px');
    optionsCreditsButton.height(optionsPage.height() / 21);
    optionsCreditsButton.width(optionsPage.width() / 13);
    optionsCreditsButton.clicker = function () {
    }
    optionsCreditsButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsCreditsButton.clicker();
    });

    optionsNewButton.css('left', optionsPage.width() / 2.21 + 'px');
    optionsNewButton.css('top', optionsPage.height() / 2.8 + 'px');
    optionsNewButton.height(optionsPage.height() / 21);
    optionsNewButton.width(optionsPage.width() / 13);
    optionsNewButton.clicker = function () {
    }
    optionsNewButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsNewButton.clicker();
    });

    optionsShootingMethodButtons.css('left', optionsPage.width() / 2.26 + 'px');
    optionsShootingMethodButtons.css('top', optionsPage.height() / 2.37 + 'px');
    optionsShootingMethodButtons.height(optionsPage.height() / 18);
    optionsShootingMethodButtons.width(optionsPage.width() / 3.4);
    optionsShootingMethodButtons.clicker = function () {
    }
    optionsShootingMethodButtons.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsShootingMethodButtons.clicker();
    });

    optionsGameplaySoundButtons.css('left', optionsPage.width() / 2.23 + 'px');
    optionsGameplaySoundButtons.css('top', optionsPage.height() / 2.06 + 'px');
    optionsGameplaySoundButtons.height(optionsPage.height() / 14.8);
    optionsGameplaySoundButtons.width(optionsPage.width() / 10);
    optionsGameplaySoundButtons.clicker = function () {
    }
    optionsGameplaySoundButtons.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsGameplaySoundButtons.clicker();
    });

    optionsQuitButton.css('left', optionsPage.width() / 2.21 + 'px');
    optionsQuitButton.css('top', optionsPage.height() / 1.44 + 'px');
    optionsQuitButton.height(optionsPage.height() / 21);
    optionsQuitButton.width(optionsPage.width() / 13);
    optionsQuitButton.clicker = function () {
    }
    optionsQuitButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsQuitButton.clicker();
    });

    optionsCloseButton.css('left', optionsPage.width() / 1.55 + 'px');
    optionsCloseButton.css('top', optionsPage.height() / 1.44 + 'px');
    optionsCloseButton.height(optionsPage.height() / 21);
    optionsCloseButton.width(optionsPage.width() / 15);
    optionsCloseButton.clicker = function () {
    }
    optionsCloseButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsCloseButton.clicker();
    });

    optionsContinueButton.css('left', optionsPage.width() / 2.22 + 'px');
    optionsContinueButton.css('top', optionsPage.height() / 1.21 + 'px');
    optionsContinueButton.height(optionsPage.height() / 27);
    optionsContinueButton.width(optionsPage.width() / 5);
    optionsContinueButton.clicker = function () {
    }
    optionsContinueButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsContinueButton.clicker();
    });
})();

var optionsCreditsPage = $('#optionsCreditsPage');

function showOptionsCreditsPage() {
    optionsCreditsPage.css('z-index', 1);
    optionsCreditsPage.css('opacity', 1.0);
}

function hideOptionsCreditsPage() {
    stopNavigationSound('typewriter');
    optionsCreditsPage.css('z-index', -1)
    optionsCreditsPage.css('opacity', 0.0);
}

var optionsCreditsPlayButton = $('#optionsCreditsPlayButton');
var optionsCreditsBriefingButton = $('#optionsCreditsBriefingButton');
var optionsCreditsGameplayButton = $('#optionsCreditsGameplayButton');
var optionsCreditsPageText = $('#optionsCreditsPageText');
var optionsCreditsOptionsButton = $('#optionsCreditsOptionsButton');
var optionsCreditsContinueButton = $('#optionsCreditsContinueButton');
(function setupOptionsCreditsPage() {
    optionsCreditsPlayButton.css('left', playButtonLayout.left + 'px');
    optionsCreditsPlayButton.css('top', playButtonLayout.top + 'px');
    optionsCreditsPlayButton.height(playButtonLayout.height);
    optionsCreditsPlayButton.width(playButtonLayout.width);
    optionsCreditsPlayButton.clicker = function () {
    }
    optionsCreditsPlayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsCreditsPlayButton.clicker();
    });

    optionsCreditsBriefingButton.css('left', briefingButtonLayout.left + 'px');
    optionsCreditsBriefingButton.css('top', briefingButtonLayout.top + 'px');
    optionsCreditsBriefingButton.height(briefingButtonLayout.height);
    optionsCreditsBriefingButton.width(briefingButtonLayout.width);
    optionsCreditsBriefingButton.clicker = function () {
    }
    optionsCreditsBriefingButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsCreditsBriefingButton.clicker();
    });

    optionsCreditsGameplayButton.css('left', gameplayButtonLayout.left + 'px');
    optionsCreditsGameplayButton.css('top', gameplayButtonLayout.top + 'px');
    optionsCreditsGameplayButton.height(gameplayButtonLayout.height);
    optionsCreditsGameplayButton.width(gameplayButtonLayout.width);
    optionsCreditsGameplayButton.clicker = function () {
    }
    optionsCreditsGameplayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsCreditsGameplayButton.clicker();
    });

    optionsCreditsPageText.css('left', optionsCreditsPage.height() / 2.26 + 'px');
    optionsCreditsPageText.css('top', optionsCreditsPage.height() / 2.6 + 'px');
    optionsCreditsPageText.height(optionsCreditsPage.height() * 0.33);
    optionsCreditsPageText.width(optionsCreditsPage.width() * 0.42);
    optionsCreditsPageText.css('font-family', 'Typewriter');
    optionsCreditsPageText.css('font-size', optionsCreditsPage.width() / 82);

    optionsCreditsOptionsButton.css('left', optionsCreditsPage.width() / 2.1 + 'px');
    optionsCreditsOptionsButton.css('top', optionsCreditsPage.height() / 1.4 + 'px');
    optionsCreditsOptionsButton.height(optionsCreditsPage.height() / 28);
    optionsCreditsOptionsButton.width(optionsCreditsPage.width() / 9);
    optionsCreditsOptionsButton.clicker = function () {
    }
    optionsCreditsOptionsButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsCreditsOptionsButton.clicker();
    });

    optionsCreditsContinueButton.css('left', optionsCreditsPage.width() / 2.22 + 'px');
    optionsCreditsContinueButton.css('top', optionsCreditsPage.height() / 1.21 + 'px');
    optionsCreditsContinueButton.height(optionsCreditsPage.height() / 27);
    optionsCreditsContinueButton.width(optionsCreditsPage.width() / 5);
    optionsCreditsContinueButton.clicker = function () {
    }
    optionsCreditsContinueButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        optionsCreditsContinueButton.clicker();
    });
})();

var gameplayPage = $('#gameplayPage');

function showGameplayPage() {
    gameplayPage.css('z-index', 1);
    gameplayPage.css('opacity', 1.0);

    showNavigation();
}

function hideGameplayPage() {
    gameplayPage.css('z-index', -1);
    gameplayPage.css('opacity', 0.0);
    gameplayGesturesPage.css('opacity', 0.0);
    gameplayGesturesPage.css('z-index', -1);
    gameplayGetLeapPage.css('opacity', 0.0);
    gameplayGetLeapPage.css('z-index', -1);
}

var gameplayPlayButton = $('#gameplayPlayButton');
var gameplayBriefingButton = $('#gameplayBriefingButton');
var gameplayOptionsButton = $('#gameplayOptionsButton');
var gameplayGesturesButton = $('#gameplayGesturesButton');
(function setupGameplayPage() {
    gameplayPlayButton.css('left', playButtonLayout.left + 'px');
    gameplayPlayButton.css('top', playButtonLayout.top + 'px');
    gameplayPlayButton.height(playButtonLayout.height);
    gameplayPlayButton.width(playButtonLayout.width);
    gameplayPlayButton.clicker = function () {
    }
    gameplayPlayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        gameplayPlayButton.clicker();
    });

    gameplayBriefingButton.css('left', briefingButtonLayout.left + 'px');
    gameplayBriefingButton.css('top', briefingButtonLayout.top + 'px');
    gameplayBriefingButton.height(briefingButtonLayout.height);
    gameplayBriefingButton.width(briefingButtonLayout.width);
    gameplayBriefingButton.clicker = function () {
    }
    gameplayBriefingButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        gameplayBriefingButton.clicker();
    });

    gameplayOptionsButton.css('left', optionsButtonLayout.left + 'px');
    gameplayOptionsButton.css('top', optionsButtonLayout.top + 'px');
    gameplayOptionsButton.height(optionsButtonLayout.height);
    gameplayOptionsButton.width(optionsButtonLayout.width);
    gameplayOptionsButton.clicker = function () {
    }
    gameplayOptionsButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        gameplayOptionsButton.clicker();
    });

    gameplayGesturesButton.css('left', gameplayPage.width() / 2.86 + 'px');
    gameplayGesturesButton.css('top', gameplayPage.height() / 7.0 + 'px');
    gameplayGesturesButton.height(gameplayPage.height() / 1.9);
    gameplayGesturesButton.width(gameplayPage.height() / 2);
    gameplayGesturesButton.css('z-index', 10);
    gameplayGesturesButton.clicker = function () {
    }
    gameplayGesturesButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        gameplayGesturesButton.clicker();
    });
})();

var levelPage = $('#levelPage');

function showLevelPage() {
    levelPage.css('z-index', 1);
    levelPage.css('opacity', 1.0);

    showNavigation();
}

function hideLevelPage() {
    levelPage.css('z-index', -1);
    levelPage.css('opacity', 0.0);
}

var levelPagePlayButton = $('#levelPagePlayButton');
var levelPageBriefingButton = $('#levelPageBriefingButton');
var levelPageGameplayButton = $('#levelPageGameplayButton');
var levelPageOptionsButton = $('#levelPageOptionsButton');
var levelPageContinueButton = $('#levelPageContinueButton');
var levelPageName = $('#levelPageName');
var levelPageTime = $('#levelPageTime');
var levelPageTimePar = $('#levelPageTimePar');
var levelPageTotalTime = $('#levelPageTotalTime');
var levelPagePoints = $('#levelPagePoints');
var levelPageShots = $('#levelPageShots');
var levelPageKills = $('#levelPageKills');
var levelPageRatio = $('#levelPageRatio');
var levelPageDamage = $('#levelPageDamage');
var levelPageBoss = $('#levelPageBoss');
var levelPageWaves = $('#levelPageWaves');
var levelPageRating = $('#levelPageRating');
(function setupLevelPage() {
    levelPagePlayButton.css('left', playButtonLayout.left + 'px');
    levelPagePlayButton.css('top', playButtonLayout.top + 'px');
    levelPagePlayButton.height(playButtonLayout.height);
    levelPagePlayButton.width(playButtonLayout.width);
    levelPagePlayButton.clicker = function () {
    }
    levelPagePlayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        levelPagePlayButton.clicker();
    });

    levelPageBriefingButton.css('left', briefingButtonLayout.left + 'px');
    levelPageBriefingButton.css('top', briefingButtonLayout.top + 'px');
    levelPageBriefingButton.height(briefingButtonLayout.height);
    levelPageBriefingButton.width(briefingButtonLayout.width);
    levelPageBriefingButton.clicker = function () {
    }
    levelPageBriefingButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        levelPageBriefingButton.clicker();
    });

    levelPageGameplayButton.css('left', gameplayButtonLayout.left + 'px');
    levelPageGameplayButton.css('top', gameplayButtonLayout.top + 'px');
    levelPageGameplayButton.height(gameplayButtonLayout.height);
    levelPageGameplayButton.width(gameplayButtonLayout.width);
    levelPageGameplayButton.clicker = function () {
    }
    levelPageGameplayButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        levelPageGameplayButton.clicker();
    });

    levelPageOptionsButton.css('left', optionsButtonLayout.left + 'px');
    levelPageOptionsButton.css('top', optionsButtonLayout.top + 'px');
    levelPageOptionsButton.height(optionsButtonLayout.height);
    levelPageOptionsButton.width(optionsButtonLayout.width);
    levelPageOptionsButton.clicker = function () {
    }
    levelPageOptionsButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        levelPageOptionsButton.clicker();
    });

    levelPageContinueButton.css('left', levelPage.width() / 2.6 + 'px');
    levelPageContinueButton.css('top', levelPage.height() / 1.3 + 'px');
    levelPageContinueButton.height(levelPage.height() / 6);
    levelPageContinueButton.width(levelPage.width() / 3);
    levelPageContinueButton.clicker = function () {
    }
    levelPageContinueButton.addClass('clicker').on('clicker', function (e) {
        e.preventDefault();
        e.stopPropagation();
        playNavigationSound('buttonPress', false, 1.0);

        levelPageContinueButton.clicker();
    });

    levelPageName.css('position', 'absolute');
    levelPageName.css('color', '#FF0000');
    levelPageName.css('font-family', 'Portago');
    levelPageName.css('top', levelPage.height() / 2.94 + 'px');
    levelPageName.css('left', levelPage.height() / 1.6 + 'px');
    levelPageName.css('font-size', levelPage.height() / 18);
    levelPageName.css('-webkit-user-select', 'none');

    levelPageTime.css('position', 'absolute');
    levelPageTime.css('color', '#FF0000');
    levelPageTime.css('font-family', 'Portago');
    levelPageTime.css('top', levelPage.height() / 2.536 + 'px');
    levelPageTime.css('left', levelPage.height() / 1.6 + 'px');
    levelPageTime.css('font-size', levelPage.height() / 18);
    levelPageTime.css('-webkit-user-select', 'none');

    levelPageTimePar.css('position', 'absolute');
    levelPageTimePar.css('color', '#545454');
    levelPageTimePar.css('font-family', 'Portago');
    levelPageTimePar.css('top', levelPage.height() / 2.38 + 'px');
    levelPageTimePar.css('left', levelPage.height() / 1.365 + 'px');
    levelPageTimePar.css('font-size', levelPage.height() / 28);
    levelPageTimePar.css('-webkit-user-select', 'none');

    levelPageTotalTime.css('position', 'absolute');
    levelPageTotalTime.css('color', '#FF0000');
    levelPageTotalTime.css('font-family', 'Portago');
    levelPageTotalTime.css('top', levelPage.height() / 2.38 + 'px');
    levelPageTotalTime.css('left', levelPage.height() / 1.23 + 'px');
    levelPageTotalTime.css('font-size', levelPage.height() / 28);
    levelPageTotalTime.css('-webkit-user-select', 'none');

    levelPagePoints.css('position', 'absolute');
    levelPagePoints.css('color', '#FF0000');
    levelPagePoints.css('font-family', 'Portago');
    levelPagePoints.css('top', levelPage.height() / 2.22 + 'px');
    levelPagePoints.css('left', levelPage.height() / 1.6 + 'px');
    levelPagePoints.css('font-size', levelPage.height() / 18);
    levelPagePoints.css('-webkit-user-select', 'none');

    levelPageShots.css('position', 'absolute');
    levelPageShots.css('color', '#FF0000');
    levelPageShots.css('font-family', 'Portago');
    levelPageShots.css('top', levelPage.height() / 1.92 + 'px');
    levelPageShots.css('left', levelPage.height() / 1.6 + 'px');
    levelPageShots.css('font-size', levelPage.height() / 21.4);
    levelPageShots.css('-webkit-user-select', 'none');

    levelPageKills.css('position', 'absolute');
    levelPageKills.css('color', '#FF0000');
    levelPageKills.css('font-family', 'Portago');
    levelPageKills.css('top', levelPage.height() / 1.77 + 'px');
    levelPageKills.css('left', levelPage.height() / 1.6 + 'px');
    levelPageKills.css('font-size', levelPage.height() / 21.4);
    levelPageKills.css('-webkit-user-select', 'none');

    levelPageRatio.css('position', 'absolute');
    levelPageRatio.css('color', '#FF0000');
    levelPageRatio.css('font-family', 'Portago');
    levelPageRatio.css('top', levelPage.height() / 1.645 + 'px');
    levelPageRatio.css('left', levelPage.height() / 1.6 + 'px');
    levelPageRatio.css('font-size', levelPage.height() / 21.4);
    levelPageRatio.css('-webkit-user-select', 'none');

    levelPageDamage.css('position', 'absolute');
    levelPageDamage.css('color', '#FF0000');
    levelPageDamage.css('font-family', 'Portago');
    levelPageDamage.css('top', levelPage.height() / 1.534 + 'px');
    levelPageDamage.css('left', levelPage.height() / 1.6 + 'px');
    levelPageDamage.css('font-size', levelPage.height() / 21.4);
    levelPageDamage.css('-webkit-user-select', 'none');

    levelPageBoss.css('position', 'absolute');
    levelPageBoss.css('color', '#FF0000');
    levelPageBoss.css('font-family', 'Portago');
    levelPageBoss.css('top', levelPage.height() / 1.44 + 'px');
    levelPageBoss.css('left', levelPage.height() / 1.6 + 'px');
    levelPageBoss.css('font-size', levelPage.height() / 21.4);
    levelPageBoss.css('-webkit-user-select', 'none');

    levelPageWaves.css('position', 'absolute');
    levelPageWaves.css('color', '#FF0000');
    levelPageWaves.css('font-family', 'Portago');
    levelPageWaves.css('top', levelPage.height() / 1.36 + 'px');
    levelPageWaves.css('left', levelPage.height() / 1.6 + 'px');
    levelPageWaves.css('font-size', levelPage.height() / 21.4);
    levelPageWaves.css('-webkit-user-select', 'none');

    var levelPageRatingBaseFontSize = levelPage.height() / 10;
    levelPageRating.css('position', 'absolute');
    levelPageRating.css('color', 'grey');
    levelPageRating.css('font-family', 'Portago');
    levelPageRating.css('top', levelPage.height() / 1.98 + 'px');
    levelPageRating.css('left', levelPage.height() / 1.32 + 'px');
    levelPageRating.css('font-size', levelPageRatingBaseFontSize);
    levelPageRating.css('-webkit-user-select', 'none');
    levelPageRating.updateDollarValue = function (d) {
        if (d > 9999) {
            levelPageRating.css('font-size', levelPageRatingBaseFontSize * 0.8);
        } else {
            levelPageRating.css('font-size', levelPageRatingBaseFontSize);
        }

        levelPageRating.text(formatMoney(d));
    }
})();

window.currentPlayAction = function () {

}

var lastPlayAction = null;
window.currentPlayActionSafe = function() {
    if (!lastPlayAction || new Date() - lastPlayAction > 4000) {
        window.currentPlayAction();
        lastPlayAction = new Date();
    }
}

function startInitialPage() {
    showInitialPage();

    function disableInitialPageButtons() {
        initialPageBriefingButton.removeClass('clicker').unbind('clicker');
        initialPageGameplayButton.removeClass('clicker').unbind('clicker');
        initialPageOptionsButton.removeClass('clicker').unbind('clicker');
        initialPagePlayButton.removeClass('clicker').unbind('clicker');
    }

    initialPagePlayButton.clicker = function () {
        disableInitialPageButtons();
        $('#gameOverlay').backgroundImg('url(' + navigationImages['black'].src + ')');
        $('#gameOverlay').css('display', 'block');
        $('#gameOverlay').animate({'opacity': 1.0}, 1000, function () {
            $.timeout(1000, function () {
                playNavigationSound('initialScreenElevator', false, 1.0);
                $.timeout(1800, function () {
                    $('#gameOverlay').animate({'opacity': 0.0}, 1000, function () {
                        $('#gameOverlay').css('display', 'none');
                    });

                    currentPlayActionSafe();
                });
            });
        });
    }

    initialPageBriefingButton.clicker = function () {
        disableInitialPageButtons();
        startBriefingPage();
    }

    initialPageGameplayButton.clicker = function () {
        disableInitialPageButtons();
        startGameplayPage();
    }

    initialPageOptionsButton.clicker = function () {
        disableInitialPageButtons();
        startOptionsPage(function () {
            currentPlayActionSafe();
        });
    }
}

function startBriefingPage() {
    showBriefingPage();

    var forceStopTyping = false;

    coverPage.clicker = function() {
        turnPage();
    }

    var turnPageTimeout = $.timeout(10000, function () {
        turnPage();
    });

    function turnPage() {
        coverPage.clicker = function(){};
        turnPageTimeout.stop();

        playNavigationSound('pageTurn', false, 1.0);

        coverPage.animate({'left': window.innerWidth + 500 + 'px'}, 1100, function () {
            hideCoverPage();

            briefingPlayButton.clicker = function () {
                forceStopTyping = true;
                hideBriefingPage();
                currentPlayActionSafe();
            }

            briefingGameplayButton.clicker = function () {
                forceStopTyping = true;
                hideBriefingPage();
                startGameplayPage();
            }

            briefingOptionsButton.clicker = function () {
                forceStopTyping = true;
                hideBriefingPage();
                startOptionsPage(function () {
                    startBriefingPage();
                });
            }

            var briefingPageTextString = "Somewhere outside the US the \"nonexistent\" , Black Key 7, R&D team has been testing, and is anxious to deploy, a new black ops experimental system. The system is unknown to any government, including intelligence services. The system is the world's smallest drone...militarized, drone. A Micro Drone, potentially an undetectable force multiplier.<br><br>Live testing the drone prototype is imperative, so is maintaining full secrecy of the system and Black Key 7. Each of the three existing drone prototypes can be operated from anywhere in the world. The Black Key 7 have provided you with a remote interface to field test the only existing prototypes.<br><br>Your adversary... an unusual, bioengineered strain of über bees, useful in no other way than for their organized, aggressive, unrelenting attacks on intruders. The bees have been genetically encoded to defend the steel RoboHive that they consider home. The bees are true foes as they are capable of taking out trespassers as large as crows.<br><br>Your objective is simple, master the drone operations, thwart the aggressive bees with strategic attacks and counter attacks, all without losing the valuable prototypes in the process.<br><br>Good Luck!";

            if (!briefingPageText.typed) {
                briefingPageText.typed = true;

                playNavigationSound('typewriter', true, 1.0);

                briefingPageText.typer([briefingPageTextString], {
                    duration: 500,
                    onType: function (timer) {
                        if (forceStopTyping) {
                            clearTimeout(timer);
                            briefingPageText.html(briefingPageTextString);
                        }

                        briefingPageText.css('font-size', briefingPage.width() / 88);
                    },
                    afterAll: function () {
                        stopNavigationSound('typewriter');
                        briefingPageText.html(briefingPageTextString);
                    }
                });
            } else {
                briefingPageText.html(briefingPageTextString);
            }
        });
    }
}

function startGameplayPage() {
    showGameplayPage();

    gameplayPlayButton.clicker = function () {
        hideGameplayPage();
        currentPlayActionSafe();
    }

    gameplayBriefingButton.clicker = function () {
        hideGameplayPage();
        startBriefingPage();
    }

    gameplayOptionsButton.clicker = function () {
        hideGameplayPage();
        startOptionsPage(function () {
            startGameplayPage();
        });
    }

    gameplayGesturesButton.clicker = function () {
        if (window.forLeapStore) {
            startGameplayGesturesPage();
        } else {
            startGameplayGetLeapPage();
        }
    }
}

var gameplayGesturesPage = $('#gameplayGesturesPage');
function startGameplayGesturesPage() {
    gameplayGesturesPage.css('z-index', 1);
    gameplayGesturesPage.css('opacity', 1.0);

    gameplayGesturesButton.clicker = function () {
        gameplayGesturesPage.css('opacity', 0.0);
        gameplayGesturesPage.css('z-index', -1);

        gameplayGesturesButton.clicker = function () {
            if (window.forLeapStore) {
                startGameplayGesturesPage();
            } else {
                startGameplayGetLeapPage();
            }
        }
    }
}

var gameplayGetLeapPage = $('#gameplayGetLeapPage');
var gameplayGetLeapClickable = $('#gameplayGetLeapClickable');
gameplayGetLeapClickable.addClass('clicker').on('clicker', function (e) {
    e.preventDefault();
    e.stopPropagation();
    playNavigationSound('buttonPress', false, 1.0);

    window.open('http://airspace.leapmotion.com/apps/buzz-kill', "_blank");
});

function startGameplayGetLeapPage() {
    gameplayGetLeapPage.css('z-index', 1);
    gameplayGetLeapPage.css('opacity', 1.0);

    gameplayGetLeapClickable.width(gameplayGetLeapPage.width() / 3.2);
    gameplayGetLeapClickable.css('left', (gameplayGetLeapPage.width() - gameplayGetLeapClickable.width()) / 1.84);
    gameplayGetLeapClickable.height(gameplayGetLeapPage.height() / 8);
    gameplayGetLeapClickable.css('top', gameplayGetLeapPage.height() * 0.73);

        gameplayGesturesButton.clicker = function () {
        gameplayGetLeapPage.css('opacity', 0.0);
        gameplayGetLeapPage.css('z-index', -1);

        gameplayGesturesButton.clicker = function () {
            if (window.forLeapStore) {
                startGameplayGesturesPage();
            } else {
                startGameplayGetLeapPage();
            }
        }
    }
}

function startOptionsPage(close) {
    showOptionsPage();

    optionsPlayButton.clicker = function () {
        stopNavigationSound('optionsPageBackgroundSound');
        hideOptionsPage();
        currentPlayActionSafe();
    }

    optionsBriefingButton.clicker = function () {
        stopNavigationSound('optionsPageBackgroundSound');
        hideOptionsPage();
        startBriefingPage();
    }

    optionsGameplayButton.clicker = function () {
        stopNavigationSound('optionsPageBackgroundSound');
        hideOptionsPage();
        startGameplayPage();
    }

    optionsCreditsButton.clicker = function () {
        hideOptionsPage();
        startOptionsCreditsPage();
    }

    if (close) {
        optionsCloseButton.closeAction = function () {
            close();
        }
    }

    optionsCloseButton.clicker = function () {
        hideOptionsPage();
        optionsCloseButton.closeAction();
    }

    optionsContinueButton.clicker = function () {
        hideOptionsPage();
        currentPlayActionSafe();
    }
}

function startOptionsCreditsPage() {
    showOptionsCreditsPage();

    var forceStopTyping = false;

    optionsCreditsPlayButton.clicker = function () {
        stopNavigationSound('optionsPageBackgroundSound');
        forceStopTyping = true;
        hideOptionsCreditsPage();
        currentPlayActionSafe();
    }

    optionsCreditsBriefingButton.clicker = function () {
        stopNavigationSound('optionsPageBackgroundSound');
        forceStopTyping = true;
        hideOptionsCreditsPage();
        startBriefingPage();
    }

    optionsCreditsGameplayButton.clicker = function () {
        stopNavigationSound('optionsPageBackgroundSound');
        forceStopTyping = true;
        hideOptionsCreditsPage();
        startGameplayPage();
    }

    optionsCreditsOptionsButton.clicker = function () {
        forceStopTyping = true;
        hideOptionsCreditsPage();
        startOptionsPage(null);
    }

    optionsCreditsContinueButton.clicker = function () {
        forceStopTyping = true;
        hideOptionsCreditsPage();
        currentPlayActionSafe();
    }

    var optionsCreditsPageTextString = "<b>Development: Mathew Huusko V<br><br>Game Design: Kevin Thompson<br><br>Concept & Title Score: Ethan Thompson</b><br><br>Testers: Ethan Thompson, Tristan Thompson, Forrest Hayden<br><br>Licenses & Acknowledgements: PSDgraphics.com, Depositphotos.com, iStock.com, ShutterStock.com, The Noun Project, Luke Firth, Edward Boatman, James Kevning, FreeSFX.co.uk, 123RF.com, XOOPlate.com, Jonathan Moreira, Vectorportal.com, Tempees.com, Eurotunnel - Le Shuttle-Adam-Foster by Cargo Cult-boring-photos, Water Line Connected to Pump Room at Cranberry Tube-Leonard Wiggins, Laurent Patain (The Noun Projectroject)";

    if (!optionsCreditsPageText.typed) {
        optionsCreditsPageText.typed = true;

        playNavigationSound('typewriter', true, 1.0);

        optionsCreditsPageText.typer([optionsCreditsPageTextString], {
            duration: 500,
            onType: function (timer) {
                if (forceStopTyping) {
                    clearTimeout(timer);
                    optionsCreditsPageText.html(optionsCreditsPageTextString);
                }

                optionsCreditsPageText.css('font-size', optionsCreditsPage.width() / 82);
            },
            afterAll: function () {
                stopNavigationSound('typewriter');
                optionsCreditsPageText.html(optionsCreditsPageTextString);
            }
        });
    } else {
        optionsCreditsPageText.html(optionsCreditsPageTextString);
    }
}

function startLevelPage() {
    showLevelPage();

    function specialHideLevelPage() {
        $('#gameOverlay').backgroundImg('url(' + navigationImages['black'].src + ')');
        $('#gameOverlay').css('display', 'block');
        $('#gameOverlay').animate({'opacity': 1.0}, 1000, function () {
            $.timeout(1200, function () {
                $('#gameOverlay').animate({'opacity': 0.0}, 1000, function () {
                    $('#gameOverlay').css('display', 'none');
                });

                hideLevelPage();
                currentPlayActionSafe();
            });
        });
    }

    levelPagePlayButton.clicker = function () {
        specialHideLevelPage();
    }

    levelPageBriefingButton.clicker = function () {
        hideLevelPage();
        startBriefingPage();
    }

    levelPageGameplayButton.clicker = function () {
        hideLevelPage();
        startGameplayPage();
    }

    levelPageOptionsButton.clicker = function () {
        hideLevelPage();
        startOptionsPage(function () {
            startLevelPage();
        });
    }

    levelPageContinueButton.clicker = function () {
        specialHideLevelPage();
    }
}

var gameWinText = $('#gameWinText');
var gameEndPage = $('#gameEndPage');
var gameEndOptionsPage = $('#gameEndOptionsPage');

function showGameEndPage(why, callback) {
    gameEndOptionsPage.css('display', 'none');
    gameWinText.css('top', gameEndPage.height() / 1.31 + 'px');
    gameWinText.height(gameEndPage.height() * 0.23);
    gameWinText.width(gameEndPage.width() * 0.7);
    gameWinText.css('left', (gameEndPage.outerWidth() - gameWinText.width()) / 2 + 'px');
    gameWinText.css('color', '#FF0000');
    gameWinText.css('font-family', 'Typewriter');
    gameWinText.css('font-size', gameEndPage.width() / 42);

    if (why == 'win') {
        gameEndPage.backgroundImg('url(' + navigationImages['gamewonPage'].src + ')');
    } else if (why == 'lose') {
        gameEndPage.backgroundImg('url(' + navigationImages['gameoverPage'].src + ')');
    }

    playNavigationSound('gameEndWinOrLose', false, 1.0);

    gameEndPage.css('z-index', 10);
    gameEndPage.css('opacity', 1);
    showNavigation();

    var stopTyping = function () {

    }

    var gameWinTextString = 'If you enjoyed the game so far, we want to know! Your feedback is the fuel that helps maintain our passion to build and develop more. Thanks again, tell a friend, and please give us a quick bit of feedback at contact@illuminatedcore.com';

    playNavigationSound('typewriter', true, 1.0);

    gameWinText.css('display', 'block');

    gameWinText.typer([gameWinTextString], {
        duration: 500,
        onType: function (timer) {
            stopTyping = function () {
                if (timer) {
                    stopNavigationSound('typewriter');
                    clearTimeout(timer);
                    gameWinText.css('display', 'block');
                }
            }
            gameWinText.css('font-size', gameEndPage.width() / 42);
        },
        afterAll: function () {
            stopNavigationSound('typewriter');
            gameWinText.html(gameWinTextString);
        }
    });

    /*$.timeout(500, function() {
        gameEndPage.addClass('clicker').on('clicker', function () {
            gameEndPage.removeClass('clicker').unbind('clicker');

            stopTyping();
            showGameEndOptionsUI(callback);
        });
    });*/

    $.timeout(500, function() {
        gameEndPage.addClass('clicker').on('clicker', function () {
            gameEndPage.removeClass('clicker').unbind('clicker');

            $('#gameOverlay').backgroundImg('url(' + navigationImages['black'].src + ')');
            $('#gameOverlay').css('display', 'block');
            $('#gameOverlay').animate({'opacity': 1.0}, 1000, function () {
                stopTyping();

                gameEndPage.css('z-index', -1);
                gameEndPage.css('opacity', 0);
                hideNavigation();
                $.timeout(1000, function () {
                    $('#gameOverlay').animate({'opacity': 0.0}, 1000, function () {
                        $('#gameOverlay').css('display', 'none');
                    });

                    callback();
                });
            });
        });
    });
}

function showGameEndOptionsUI(callback) {
    gameEndOptionsPage.css('display', 'block');
    gameWinText.css('top', gameEndPage.height() / 2.7 + 'px');
    gameWinText.height(gameEndPage.height() * 0.23);
    gameWinText.width(gameEndPage.width() * 0.4);
    gameWinText.css('left', (gameEndPage.outerWidth() - gameWinText.width()) / 2 + 'px');
    gameWinText.css('color', '#1ebe16');
    gameWinText.css('font-family', 'Typewriter');
    gameWinText.css('font-size', gameEndPage.width() / 70);

    playNavigationSound('gameEndWinOrLose', false, 1.0);

    gameEndPage.css('z-index', 10);
    gameEndPage.css('opacity', 1);
    showNavigation();

    var stopTyping = function () {

    }

    var gameWinTextString = "Buzz Kill Part 2<br>Top secret RoboHive containment vaults have been compromised by an internal double agent. This act of sabotage has released a hyper aggressive, genetically engineered, demon swarm. The swarm has been advancing northward, in a relentless, unwavering, blitzkrieg of attacks. Secrecy, containment and complete extermination of the toxic swarm is imperative. You are the only one with Micro Hammer experience. Black Key 7 is reaching out to you, once again, to engage and eradicate this abomination, now set loose, before it interbreeds with common bees worldwide turning them into a massive, cataclysmic force of destruction.";

    playNavigationSound('typewriter', true, 1.0);

    gameWinText.css('display', 'block');

    gameWinText.typer([gameWinTextString], {
        duration: 450,
        onType: function (timer) {
            stopTyping = function () {
                if (timer) {
                    stopNavigationSound('typewriter');
                    clearTimeout(timer);
                    gameWinText.css('display', 'block');
                }
            }
            gameWinText.css('font-size', gameEndPage.width() / 70);
        },
        afterAll: function () {
            stopNavigationSound('typewriter');
            gameWinText.html(gameWinTextString);
        }
    });

    $.timeout(500, function() {
        gameEndPage.addClass('clicker').on('clicker', function () {
            gameEndPage.removeClass('clicker').unbind('clicker');

            $('#gameOverlay').backgroundImg('url(' + navigationImages['black'].src + ')');
            $('#gameOverlay').css('display', 'block');
            $('#gameOverlay').animate({'opacity': 1.0}, 1000, function () {
                stopTyping();

                gameEndPage.css('z-index', -1);
                gameEndPage.css('opacity', 0);
                hideNavigation();
                $.timeout(1000, function () {
                    $('#gameOverlay').animate({'opacity': 0.0}, 1000, function () {
                        $('#gameOverlay').css('display', 'none');
                    });

                    callback();
                });
            });
        });
    });
}

loadScript('js/setupInput.js');