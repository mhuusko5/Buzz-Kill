function baseLevel(levelProperties) {
    levelProperties.initiateScene = function (pastPlayerProperties, levelEndCallback) {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //INITIATE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        levelProperties.showLevelIntro(levelProperties.levelId, function () {
            var player = {
                totalTime: pastPlayerProperties.totalTime,
                livesLeft: pastPlayerProperties.livesLeft,
                baseRating: pastPlayerProperties.rating,
                rating: 0,
                bonusesAchieved: pastPlayerProperties.bonusesAchieved,
                damageTaken: pastPlayerProperties.damageTaken,
                totalPoints: 0,
                filledRowIndex: -1,
                playing: true,
                timePlaying: 0,
                onscreenShots: [],
                usingForcefield: false,
                usedForcefield: false,
                forceFieldRadius: logicalGameSize.height / 5,
                usingSmoke: false,
                usedSmoke: false,
                usingBomb: false,
                usedBomb: false,
                shotsFired: 0,
                shotsHit: 0,
                bossKills: 0,
                doubleShoot: false,
                specialShoot: levelProperties.specialShoot,
                wavesSurvived: 0,
                damage: null,
                kills: 0,
                readyToFinishLevel: false,
                cantRicochet: (levelProperties.playerBulletNoRicochet == true) ? true : false,
                enemyInfiniteRicochet: (levelProperties.enemyInfiniteRicochet == true) ? true : false,
                alternatingEnemyImages: (levelProperties.alternatingEnemyImages == true) ? true : false,
                timePar: levelProperties.timePar,
                position: {
                    x: engineCenter.x,
                    y: engineCenter.y
                }
            };

            levelProperties.getOffset = function() {
                return {
                    x: (player.position.x - engineCenter.x) / window.devicePixelRatio,
                    y: (player.position.y - engineCenter.y) / window.devicePixelRatio
                };
            };

            levelProperties.actionsAfterPause = [];

            function gamePaused() {
                if (!player.playing || engine.paused || !levelProperties.timers) {
                    return true;
                }

                return false;
            }

            levelProperties.updateFumesOverlay(levelProperties.levelId);
            levelProperties.updateLives(player.livesLeft, player.bonusesAchieved);
            levelProperties.updateJoker(false, levelProperties.levelId);
            levelProperties.updateHoneycombCover(levelProperties.levelId);
            levelProperties.updateLevelIndicator(levelProperties.levelId);
            levelProperties.updateTotalScore(player.totalPoints);

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //UPDATE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var ratingTimeFactor = -1 / 70;
            var ratingShotsFactor = -5;
            var ratingPointsFactor = 1 / 250;
            var ratingKillsFactor = 10;
            var ratingDamageFactor = -50;
            var ratingBossKillsFactor = 20;
            var ratingWavesFactor = 50;

            function doBonus() {
                if (player.bonusesAchieved < 1) {
                    player.bonusesAchieved++;

                    pauseGameElements();

                    playNavigationSound('bonusAlert', false, 1.0);
                    levelProperties.showBonusAlert(player.bonusesAchieved, function() {
                        resumeGameElements();
                    });

                    levelProperties.updateLives(player.livesLeft, player.bonusesAchieved);

                    player.damageTaken = 1;

                    checkGameState();
                }
            }

            function updatePlayerRating() {
                try {
                    var currentRating = parseInt(10 * ((player.timePlaying / 1000) * ratingTimeFactor + player.shotsFired * ratingShotsFactor + player.totalPoints * ratingPointsFactor + player.kills * ratingKillsFactor + player.damageTaken * ratingDamageFactor + player.bossKills * ratingBossKillsFactor + player.wavesSurvived * ratingWavesFactor));
                    if (currentRating < 0) {
                        currentRating = 0;
                    }
                    player.rating = player.baseRating + currentRating;
                } catch (e) {
                    player.rating = player.baseRating + 0;
                }

                if (player.rating > 35000) {
                    doBonus();
                }

                levelProperties.updateCurrentMoney(player.rating);
            }

            function updateGameTimer() {
                if (gamePaused()) {
                    levelProperties.actionsAfterPause.push(function () {
                        updateGameTimer()
                    });
                    return;
                }

                levelProperties.updateTimerDiv(player.timePlaying);

                updatePlayerRating();

                levelProperties.timers.push($.timeout(1100, function () {
                    updateGameTimer();
                }));
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //SCORING///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function displayLatestScore() {
                if (gamePaused()) {
                    levelProperties.actionsAfterPause.push(function () {
                        displayLatestScore()
                    });
                    return;
                }

                levelProperties.flashLatestScore();
            }

            function gainPoints(points) {
                if (gamePaused()) {
                    levelProperties.actionsAfterPause.push(function () {
                        gainPoints(points)
                    });
                    return;
                }

                player.totalPoints += points;

                levelProperties.updateTotalScore(player.totalPoints);
                levelProperties.updateLatestScore(points);

                displayLatestScore();

                checkGameState();
            }

            function losePoints(points) {
                if (gamePaused()) {
                    levelProperties.actionsAfterPause.push(function () {
                        losePoints(points)
                    });
                    return;
                }

                if (player.bonusesAchieved > 0 && Math.random() > 0.5) {

                } else {
                    player.totalPoints -= points;

                    if (player.totalPoints < 0) {
                        player.totalPoints = 0;
                    }

                    levelProperties.updateTotalScore(player.totalPoints);
                    levelProperties.updateLatestScore(points);

                    displayLatestScore();

                    levelProperties.flashTurretHit();
                    //levelProperties.flashScreenRed();

                    player.damageTaken++;

                    playGameplaySound('turretBeingHit', false, 0.7);
                }

                checkGameState();
            }

            function toggleRow(fill) {
                if (gamePaused()) {
                    levelProperties.actionsAfterPause.push(function () {
                        toggleRow(fill)
                    });
                    return;
                }

                if (fill) {
                    player.filledRowIndex++;
                }

                levelProperties.updateHoneycombCellsToShow(player.filledRowIndex * levelProperties.honeycombHorizontal);

                if (!fill && player.filledRowIndex > 0) {
                    player.filledRowIndex--;
                }

                checkGameState();
            }

            function checkGameState() {
                if (gamePaused()) {
                    levelProperties.actionsAfterPause.push(function () {
                        checkGameState()
                    });
                    return;
                }

                if (player.damageTaken == 13) {
                    levelProperties.showTurretDeath(20, function() {
                        playGameplaySound('bombAttackExplosion', false, 1.0);
                        levelProperties.showBomb(function() {
                            hideAllGameplayGifs();
                        }, function() {

                        });
                    });
                    player.turretShouldFadeNotZoom = true;
                    levelProperties.updateLives(player.livesLeft - 1, 0);
                    endLevel('die');
                    return;
                }

                if (player.filledRowIndex == 29) {
                    endLevel('win');
                    return;
                }

                if (player.damageTaken > 5) {
                    turret.updateImage(true);

                    if (!gameplaySounds['healthWarning'].isPlaying) {
                        playGameplaySound('healthWarning', true, 1.0);
                    }

                    levelProperties.toggleTurretDieing(true);
                    levelProperties.toggleFlashingGamedial(true);
                } else {
                    turret.updateImage(false);

                    stopGameplaySound('healthWarning');

                    levelProperties.toggleTurretDieing(false);
                    levelProperties.toggleFlashingGamedial(false);
                }

                levelProperties.updateGameDial(player.damageTaken);
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //UTILITY//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function forEachSceneCharacter(func) {
                var chi = levelProperties.scene.children.length;
                while (chi-- > 0) {
                    if (levelProperties.scene.children[chi]) {
                        if (!func(levelProperties.scene.children[chi])) {
                            return;
                        }
                    }
                }
            }

            function pauseCharacterTimers() {
                forEachSceneCharacter(function (chi) {
                    for (var tim in chi.timers) {
                        if (chi.timers[tim]) {
                            chi.timers[tim].pause();
                        }
                    }

                    return true;
                });
            }

            function resumeCharacterTimers() {
                forEachSceneCharacter(function (chi) {
                    for (var tim in chi.timers) {
                        if (chi.timers[tim]) {
                            chi.timers[tim].resume();
                        }
                    }

                    return true;
                });
            }

            function removeUnnecessaryCharacters() {
                for (var s in player.onscreenShots) {
                    if (player.onscreenShots[s] && player.onscreenShots[s].removeFromAll) {
                        player.onscreenShots[s].removeFromAll();
                    }
                }

                for (var s in player.healthPowerups) {
                    if (player.healthPowerups[s] && player.healthPowerups[s].removeFromAll) {
                        player.healthPowerups[s].removeFromAll();
                    }
                }
            }

            levelProperties.resetLevelMedia = function () {
                stopAllGameplaySounds();
                stopAllGameplayVideos();
                hideAllGameplayVideos();
                hideAllGameplayGifs();
                hideAllGameplayImages();
            }

            levelProperties.resetLevelMechanics = function () {
                resetGameplayInput();
                stopLevelTimers();
            }

            levelProperties.clearEngine = function () {
                forEachSceneCharacter(function (chi) {
                    if (chi.removeFromAll) {
                        chi.removeFromAll();
                    }

                    return true;
                });

                engine.pause();
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //GAMESTATE/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function endLevel(why) {
                if (gamePaused()) {
                    return;
                }

                levelProperties.resetLevelMechanics();

                currentPlayAction = function() {

                };

                playNavigationSound('honeyGridFilled', false, 1.0);

                player.playing = false;

                player.allowingExit = true;

                levelProperties.latestScore.css('opacity', 0.0);
                levelProperties.totalScore.css('opacity', 1.0);

                removeUnnecessaryCharacters();

                levelProperties.timers.push($.timeout(200, function () {
                    removeUnnecessaryCharacters();

                    function checkReadyToFinishLevel() {
                        if (!player.readyToFinishLevel) {
                            levelProperties.timers.push($.timeout(500, function () {
                                checkReadyToFinishLevel();
                            }));
                            return;
                        }

                        player.whyEnd = why;

                        switch (levelProperties.levelId) {
                            case 1:
                                player.levelName = "One";
                                break;
                            case 2:
                                player.levelName = "Two";
                                break;
                            case 3:
                                player.levelName = "Three";
                                break;
                            case 4:
                                player.levelName = "Four";
                                break;
                            case 5:
                                player.levelName = "Five";
                                break;
                            case 6:
                                player.levelName = "Six";
                                break;
                            case 7:
                                player.levelName = "Seven";
                                break;
                            default :
                                player.levelName = levelProperties.levelId + '';
                                break;
                        }

                        player.totalTime += player.timePlaying;

                        updatePlayerRating();

                        levelProperties.resetLevelMedia();

                        levelProperties.clearEngine();

                        levelProperties.showLevelOutro(player.whyEnd, function () {
                            levelProperties.toggleTurretDieing(false);

                            levelEndCallback(player);
                        });
                    }

                    checkReadyToFinishLevel();
                }));
            }

            function pauseGameElements() {
                if (gamePaused()) {
                    return;
                }

                player.playing = false;

                pauseLevelTimers();
                pauseCharacterTimers();
                pauseAllPlayingGameplaySounds();
                pauseAllPlayingGameplayVideos();
            }

            function resumeGameElements() {
                player.playing = true;

                resumeLevelTimers();
                resumeCharacterTimers();
                resumeAllPausedGameplaySounds();
                resumeAllPausedGameplayVideos();

                for (var action in levelProperties.actionsAfterPause) {
                    if (levelProperties.actionsAfterPause[action]) {
                        levelProperties.actionsAfterPause[action]();
                    }
                }

                levelProperties.actionsAfterPause = [];
            }

            function pauseLevel() {
                if (gamePaused()) {
                    return;
                }

                pauseGameElements();

                hideInitialPage();
                startOptionsPage(function () {
                    currentPlayActionSafe();
                });

                currentPlayAction = function () {
                    resumeGameElements();

                    hideOptionsPage();
                    hideNavigation();
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //WEAPONS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            function doForcefield() {
                if (gamePaused()) {
                    return;
                }

                if (!player.usingBomb && !player.usingForcefield && !player.usingSmoke) {
                    player.usingForcefield = true;
                    player.usedForcefield = true;

                    playGameplaySound('forcefield', true, 1.0);

                    levelProperties.showForcefield(player.forceFieldRadius, function () {
                        player.usingForcefield = false;
                        stopGameplaySound('forcefield');
                    }, function () {

                    });

                    levelProperties.forcefieldIcon.animate({'opacity': 0});
                }
            }

            function doSmoke() {
                if (gamePaused()) {
                    return;
                }

                if (!player.usingBomb && !player.usingForcefield && !player.usingSmoke && !player.usedSmoke) {
                    player.usingSmoke = true;
                    player.usedSmoke = true;

                    playGameplaySound('smokeAttack', true, 0.7);

                    levelProperties.showSmoke(
                        function () {

                        }, function () {
                            player.usingSmoke = false;

                            stopGameplaySound('smokeAttack');
                        });

                    levelProperties.smokeIcon.animate({'opacity': 0});
                }
            }

            function bombKill() {
                if (gamePaused()) {
                    levelProperties.actionsAfterPause.push(function () {
                        bombKill()
                    });
                    return;
                }

                forEachSceneCharacter(function (chi) {
                    if (!chi.hasBehaviour('turret')) {
                        if (chi.diedAction) {
                            chi.diedAction();
                        } else if (chi.removeFromAll) {
                            chi.removeFromAll();
                        }
                    }

                    return true;
                });

                player.totalPoints = 0;
                levelProperties.updateTotalScore(player.totalPoints);
                updatePlayerRating();
            }

            function doBomb() {
                if (gamePaused()) {
                    return;
                }

                if (!player.usingBomb && !player.usingForcefield && !player.usingSmoke && !player.usedBomb) {
                    player.usingBomb = true;
                    player.usedBomb = true;

                    playGameplaySound('bombAttackExplosion', false, 0.7);

                    levelProperties.showBomb(function () {
                        bombKill();
                    }, function () {
                        player.usingBomb = false;
                    });

                    levelProperties.bombIcon.animate({'opacity': 0});
                }
            }

            function pointTurret(point) {
                if (gamePaused()) {
                    return;
                }

                turret.updateDirection(point);
            }

            function doShoot() {
                if (gamePaused()) {
                    return;
                }

                turret.userShoot();
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            var turret = createTurret(player, function () {
                losePoints(levelProperties.turretHitPointsLost);

                if (levelProperties.uberDroneRowsToToggleLose) {
                    for (var j = 0; j < levelProperties.uberDroneRowsToToggleLose; j++) {
                        toggleRow(false);
                    }
                }
            });
            levelProperties.scene.addChild(turret);

            levelProperties.forcefieldIcon.addClass('clicker').on('clicker', function (e) {
                e.preventDefault();
                e.stopPropagation();
                playNavigationSound('buttonPress', false, 1.0);

                doForcefield();
            });

            levelProperties.smokeIcon.addClass('clicker').on('clicker', function (e) {
                e.preventDefault();
                e.stopPropagation();
                playNavigationSound('buttonPress', false, 1.0);

                doSmoke();
            });

            levelProperties.bombIcon.addClass('clicker').on('clicker', function (e) {
                e.preventDefault();
                e.stopPropagation();
                playNavigationSound('buttonPress', false, 1.0);

                doBomb();
            });

            appLostFocus = function () {
                pauseLevel();
            }

            levelProperties.optionsButton.addClass('clicker').on('clicker', function (e) {
                e.preventDefault();
                e.stopPropagation();
                playNavigationSound('buttonPress', false, 1.0);

                pauseLevel();
            });

            gameplayBonus = function() {
                doBonus();
            };

            gameplayPause = function() {
                pauseGameElements();
            };

            gameplayResume = function() {
                resumeGameElements();
            };

            gameplayPointerLocationCallback = function (point) {
                pointTurret(point);
            };

            gameplayPrimaryClickCallback = function () {
                doShoot();
            };

            gameplaySpecial1Callback = function () {
                doForcefield();
                shouldTrySpecial1 = false;
            };

            gameplaySpecial2Callback = function () {
                doBomb();
                shouldTrySpecial2 = false;
            };

            gameplaySpecial3Callback = function () {
                doSmoke();
                shouldTrySpecial3 = false;
            }

            if (levelProperties.honeyBees) {
                levelProperties.timers.push($.timeout(levelProperties.honeyBeesEntryDelay, function () {
                    for (var i = 0; i < levelProperties.honeyBeesAtATime; i++) {
                        var newHoneyBee = createHoneyBee(levelProperties.honeyBees, levelProperties.honeyBeesAtATime / levelProperties.honeyBeesLeaveAtATime, i, function (points) {
                            gainPoints(points);

                            for (var j = 0; j < levelProperties.honeyBeeRowsToToggleGain; j++) {
                                toggleRow(true);
                            }
                        }, player);

                        if (levelProperties.honeyBeeSpeedAdjust) {
                            newHoneyBee.baseSpeed *= levelProperties.honeyBeeSpeedAdjust;
                        }

                        if (levelProperties.honeyBeePauseAdjust) {
                            newHoneyBee.baseWaitTime /= levelProperties.honeyBeePauseAdjust;
                        }

                        if (levelProperties.honeyBeeLeaveTimeAdjust) {
                            newHoneyBee.timeTillLeaveGame *= levelProperties.honeyBeeLeaveTimeAdjust;
                        }

                        if (levelProperties.honeyBeeTakeHitsModifier) {
                            newHoneyBee.hitsTillDeath += levelProperties.honeyBeeTakeHitsModifier;
                        }

                        levelProperties.scene.addChild(newHoneyBee);
                    }
                }));
            }

            if (levelProperties.wasps) {
                function roundOfWasps() {
                    player.wavesSurvived++;

                    var newWasp = createWasp(levelProperties.wasps, function (points) {
                        gainPoints(points);
                    }, function (points) {
                        losePoints(points);

                        for (var j = 0; j < levelProperties.waspRowsToToggleLose; j++) {
                            toggleRow(false);
                        }
                    }, player);

                    if (levelProperties.waspSpeedAdjust) {
                        newWasp.baseSpeed *= levelProperties.waspSpeedAdjust;
                    }

                    if (levelProperties.waspPauseAdjust) {
                        newWasp.baseWaitTime /= levelProperties.waspPauseAdjust;
                    }

                    if (levelProperties.waspAttackTimeAdjust) {
                        newWasp.timeTillAttack *= levelProperties.waspAttackTimeAdjust;
                    }

                    levelProperties.scene.addChild(newWasp);

                    levelProperties.timers.push($.timeout(levelProperties.waspEntryInterval, function () {
                        roundOfWasps();
                    }));
                }

                levelProperties.timers.push($.timeout(levelProperties.waspEntryInterval, function () {
                    roundOfWasps();
                }));
            }

            if (levelProperties.uberDrones) {
                function roundOfUberDrones() {
                    player.wavesSurvived++;

                    for (var i = 0; i < levelProperties.uberDronesAtATime; i++) {
                        var newUberDrone = createUberDrone(levelProperties.uberDrones, function (points) {
                            gainPoints(points);

                            for (var j = 0; j < levelProperties.uberDroneRowsToToggleGain; j++) {
                                toggleRow(true);
                            }
                        }, player);

                        if (levelProperties.uberDroneSpeedAdjust) {
                            newUberDrone.baseSpeed *= levelProperties.uberDroneSpeedAdjust;
                        }

                        if (levelProperties.uberDronePauseAdjust) {
                            newUberDrone.baseWaitTime /= levelProperties.uberDronePauseAdjust;
                        }

                        if (levelProperties.uberDroneAttackTimeAdjust) {
                            newUberDrone.timeTillAttack *= levelProperties.uberDroneAttackTimeAdjust;
                        }

                        levelProperties.scene.addChild(newUberDrone);
                    }

                    levelProperties.timers.push($.timeout(levelProperties.uberDroneEntryInterval, function () {
                        roundOfUberDrones();
                    }));
                }

                levelProperties.timers.push($.timeout(levelProperties.uberDroneEnterDelay, function () {
                    roundOfUberDrones();
                }));
            }

            if (levelProperties.workerBees) {
                function roundOfWorkerBees() {
                    player.wavesSurvived++;

                    for (var i = 0; i < levelProperties.workerBeesAtATime; i++) {
                        var newWorkerBee = createWorkerBee(levelProperties.workerBees, levelProperties.workerBeesAtATime / levelProperties.workerBeesAttackAtATime, i, function (points) {
                            gainPoints(points);
                        }, function (points) {
                            losePoints(points);
                        }, player);

                        if (levelProperties.workerBeeSpeedAdjust) {
                            newWorkerBee.baseSpeed *= levelProperties.workerBeeSpeedAdjust;
                        }
                        if (levelProperties.workerBeePauseAdjust) {
                            newWorkerBee.baseWaitTime /= levelProperties.workerBeePauseAdjust;
                        }

                        if (levelProperties.workerBeeAttackTimeAdjust) {
                            newWorkerBee.timeTillAttack *= levelProperties.workerBeeAttackTimeAdjust;
                        }

                        levelProperties.scene.addChild(newWorkerBee);
                    }

                    levelProperties.timers.push($.timeout(levelProperties.workerBeeEntryInterval, function () {
                        roundOfWorkerBees();
                    }));
                }

                roundOfWorkerBees();
            }

            if (levelProperties.queenBees) {
                function roundOfQueenBees() {
                    var newQueenBee = createQueenBee(levelProperties.queenBees, function (points) {
                        gainPoints(points);

                        for (var i = 0; i < levelProperties.honeyBeesAtATime / 2; i++) {
                            var newHoneyBee = createHoneyBee(levelProperties.honeyBees, levelProperties.honeyBeesAtATime / levelProperties.honeyBeesLeaveAtATime, i, function (points) {
                                gainPoints(points);

                                for (var j = 0; j < levelProperties.honeyBeeRowsToToggleGain; j++) {
                                    toggleRow(true);
                                }
                            }, player);

                            newHoneyBee.position = {
                                x: this.position.x,
                                y: this.position.y
                            };
                            newHoneyBee.createNewPath(newHoneyBee.newPosition());

                            if (levelProperties.honeyBeeSpeedAdjust) {
                                newHoneyBee.baseSpeed *= levelProperties.honeyBeeSpeedAdjust;
                            }

                            if (levelProperties.honeyBeePauseAdjust) {
                                newHoneyBee.baseWaitTime /= levelProperties.honeyBeePauseAdjust;
                            }

                            if (levelProperties.honeyBeeLeaveTimeAdjust) {
                                newHoneyBee.timeTillLeaveGame *= levelProperties.honeyBeeLeaveTimeAdjust;
                            }

                            if (levelProperties.honeyBeeTakeHitsModifier) {
                                newHoneyBee.hitsTillDeath += levelProperties.honeyBeeTakeHitsModifier;
                            }

                            levelProperties.scene.addChild(newHoneyBee);
                        }

                        playGameplaySound('queenExplodingOutHoneyBees', false, 0.7);
                    }, player);

                    if (levelProperties.queenBeeSpeedAdjust) {
                        newQueenBee.baseSpeed *= levelProperties.queenBeeSpeedAdjust;
                    }

                    if (levelProperties.queenBeePauseAdjust) {
                        newQueenBee.baseWaitTime /= levelProperties.queenBeePauseAdjust;
                    }

                    levelProperties.scene.addChild(newQueenBee);

                    levelProperties.timers.push($.timeout(levelProperties.queenBeeEntryInterval, function () {
                        roundOfQueenBees();
                    }));
                }

                levelProperties.timers.push($.timeout(levelProperties.queenBeeEntryInterval, function () {
                    roundOfQueenBees();
                }));
            }

            if (levelProperties.healthPowerups) {
                function roundOfHealthPowerups() {
                    var healthPowerup = createHealthPowerup(levelProperties.healthPowerups, function () {
                        player.doubleShoot = true;

                        levelProperties.updateJoker(true);

                        levelProperties.timers.push($.timeout(levelProperties.healthPowerupActivationTime, function () {
                            player.doubleShoot = false;
                            levelProperties.updateJoker(false);
                        }));

                        checkGameState();
                    }, player);

                    levelProperties.scene.addChild(healthPowerup);

                    levelProperties.timers.push($.timeout(levelProperties.healthPowerupEntryInterval, function () {
                        roundOfHealthPowerups();
                    }));
                }

                levelProperties.timers.push($.timeout(levelProperties.healthPowerupEntryInterval, function () {
                    roundOfHealthPowerups();
                }));
            }

            if (!levelProperties.canUseBomb) {
                levelProperties.bombIcon.fadeOut();
            }

            if (!levelProperties.canUseSmoke) {
                levelProperties.smokeIcon.fadeOut();
            }

            if (!levelProperties.canUseForcefield) {
                levelProperties.forcefieldIcon.fadeOut();
            }

            if (engine.paused) {
                engine.resume();
                engine.gotoNextScene();
            }

            checkGameState();

            updateGameTimer();

            playGameplaySound('hiveBackground', true, 0.95);
            playGameplaySound('turretBackground', true, 0.7);
            playGameplaySound('freezerHum', true, 0.7);

            $.timeout(3000, function() {
                shouldTrySpecial1 = true;
                shouldTrySpecial2 = true;
                shouldTrySpecial3 = true;
            });
        });
    }
}

loadScript('js/levels.js');