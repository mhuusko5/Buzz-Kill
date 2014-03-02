startInitialPage();

var levelSkip;
if (window.forTesting && (levelSkip = prompt('Skip to level?', '1'))) {
    hideNavigation();
    continueGame(parseInt(levelSkip), {
        'damageTaken': 1,
        'livesLeft': 3,
        'rating': 0,
        'totalTime': 0,
        'bonusesAchieved': 0
    });
} else {
    $.timeout(250, function () {
        openInitialPageVaultDoor();

        currentPlayAction = function () {
            startNewGame();
        }
    });
}