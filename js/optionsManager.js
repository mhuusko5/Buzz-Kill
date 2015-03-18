optionsNewButton.clicker = function () {
    hideOptionsPage();
    startNewGame();
}

function updateShootingMethod() {
    if (gameOptions.shootingMethod == 'single') {
        optionsShootingMethodSingleButton.css('display', 'block');
        optionsShootingMethodSemiButton.css('display', 'none');
        optionsShootingMethodAutoButton.css('display', 'none');
    } else if (gameOptions.shootingMethod == 'semi') {
        optionsShootingMethodSingleButton.css('display', 'none');
        optionsShootingMethodSemiButton.css('display', 'block');
        optionsShootingMethodAutoButton.css('display', 'none');
    } else if (gameOptions.shootingMethod == 'auto') {
        optionsShootingMethodSingleButton.css('display', 'none');
        optionsShootingMethodSemiButton.css('display', 'none');
        optionsShootingMethodAutoButton.css('display', 'block');
    } else {
        gameOptions.shootingMethod = 'single';
        updateShootingMethod();
        return;
    }

    saveStoredGameOptions();
}

updateShootingMethod();

function toggleShootingMethod() {
    if (gameOptions.shootingMethod == 'single') {
        gameOptions.shootingMethod = 'semi';
    } else if (gameOptions.shootingMethod == 'semi') {
        gameOptions.shootingMethod = 'auto';
    } else if (gameOptions.shootingMethod == 'auto') {
        gameOptions.shootingMethod = 'single';
    } else {
        gameOptions.shootingMethod = 'single';
    }

    updateShootingMethod();
}

optionsShootingMethodButtons.clicker = function () {
    toggleShootingMethod();
}

function updateGameplaySound() {
    if (gameOptions.gameplaySound == true) {
        optionsGameplaySoundOnButton.css('display', 'block');
        optionsGameplaySoundOffButton.css('display', 'none');

        unmuteAllGameplaySounds();
        unmuteAllNavigationSounds();
    } else if (gameOptions.gameplaySound == false) {
        optionsGameplaySoundOnButton.css('display', 'none');
        optionsGameplaySoundOffButton.css('display', 'block');

        muteAllGameplaySounds();
        muteAllNavigationSounds();
    } else {
        gameOptions.gameplaySound = true;
        updateGameplaySound();
        return;
    }

    saveStoredGameOptions();
}

updateGameplaySound();

function toggleGameplaySound() {
    if (gameOptions.gameplaySound == true) {
        gameOptions.gameplaySound = false;
    } else if (gameOptions.gameplaySound == false) {
        gameOptions.gameplaySound = true;
    } else {
        gameOptions.gameplaySound = true;
    }

    updateGameplaySound();
}

optionsGameplaySoundButtons.clicker = function () {
    toggleGameplaySound();
}

optionsQuitButton.clicker = function () {
    window.open('', '_self', '');
    window.close();
}

loadScript('js/main.js');