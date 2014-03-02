function playerWonLevel(player) {
    levelPageName.text(player.levelName);
    levelPageTime.text(formatMilliseconds(player.timePlaying));
    levelPageTimePar.text(formatMilliseconds(player.timePar));
    levelPageTotalTime.text(formatMilliseconds(player.totalTime));
    levelPagePoints.text(player.totalPoints);
    levelPageShots.text(player.shotsFired);
    levelPageKills.text(player.kills);
    levelPageRatio.text(parseFloat(Math.round((player.kills / player.shotsFired) * 100) / 100));
    levelPageDamage.text(player.damageTaken);
    levelPageBoss.text(player.bossKills);
    levelPageWaves.text(player.wavesSurvived);
    levelPageRating.updateDollarValue(player.rating);

    showInitialPage();
    startLevelPage();
}

function continueGame(levelIndex, playerProperties) {
    setupLevel();
    switch (levelIndex) {
        case 1:
            engine.createScene(level1);
            break;
        case 2:
            engine.createScene(level2);
            break;
        case 3:
            engine.createScene(level3);
            break;
        case 4:
            engine.createScene(level4);
            break;
        case 5:
            engine.createScene(level5);
            break;
        case 6:
            engine.createScene(level6);
            break;
        case 7:
            engine.createScene(level7);
            break;
    }

    currentLevelProperties.initiateScene(playerProperties, function (player) {
        if (currentLevelProperties) {
            for (var prop in currentLevelProperties) delete currentLevelProperties[prop];
        }

        if (player.whyEnd == 'win') {
            currentPlayAction = function () {
                hideNavigation();

                if (levelIndex == 7) {
                    showGameEndPage('win', function () {
                        continueGame(1, {
                            'damageTaken': 1,
                            'livesLeft': 3,
                            'rating': 0,
                            'totalTime': 0,
                            'bonusesAchieved': 0
                        });
                    });
                } else {
                    continueGame(levelIndex + 1, {
                        'damageTaken': player.damageTaken,
                        'livesLeft': player.livesLeft,
                        'rating': player.rating,
                        'totalTime': player.totalTime,
                        'bonusesAchieved': player.bonusesAchieved
                    });
                }
            }

            playerWonLevel(player);
        } else if (player.whyEnd == 'die') {
            player.livesLeft--;

            if (player.livesLeft == 0) {
                showGameEndPage('lose', function () {
                    continueGame(1, {
                        'damageTaken': 1,
                        'livesLeft': 3,
                        'rating': 0,
                        'totalTime': 0,
                        'bonusesAchieved': 0
                    });
                });
            } else {
                continueGame(levelIndex,
                    {
                        'damageTaken': 1,
                        'livesLeft': player.livesLeft,
                        'rating': 0,
                        'totalTime': player.totalTime,
                        'bonusesAchieved': 0
                    });
            }
        }
    });
}

function startNewGame() {
    if (currentLevelProperties && currentLevelProperties.resetLevelMechanics) {
        currentLevelProperties.resetLevelMechanics();
    }

    if (currentLevelProperties && currentLevelProperties.resetLevelMedia) {
        currentLevelProperties.resetLevelMedia();
    }

    if (currentLevelProperties && currentLevelProperties.clearEngine) {
        currentLevelProperties.clearEngine();
    }

    hideNavigation();
    continueGame(1, {
        'damageTaken': 1,
        'livesLeft': 3,
        'rating': 0,
        'totalTime': 0,
        'bonusesAchieved': 0
    });
}

loadScript('js/optionsManager.js');