var currentLevelProperties = {};

function setupLevel() {
    gameCanvas[0].width = gameCanvas[0].width;

    belowCanvas.empty();
    aboveCanvas.empty();

    if (currentLevelProperties) {
        for (var prop in currentLevelProperties) delete currentLevelProperties[prop];
    }

    gameCanvas.css('opacity', 0.0);

    stopGameplaySound('levelWinOrLose');

    gameCanvas.animate({'opacity': 1.0});

    belowCanvas.html(belowCanvasTemplate);
    aboveCanvas.html(aboveCanvasTemplate);

    var levelProperties = {
        timers: []
    };

    (function setupHoneycombBackground() {
        var honeycombBackground = $('#honeycombBackground');

        honeycombBackground.css('position', 'absolute');
        honeycombBackground.height(logicalGameSize.height + 'px');
        honeycombBackground.width(logicalGameSize.width + 'px');
        honeycombBackground.css('left', parseFloat(gameCanvas.css('left')) + 'px');
        honeycombBackground.css('top', parseFloat(gameCanvas.css('top')) + 'px');
        honeycombBackground.backgroundImg('url(' + gameplayImages['honeycombBackground'].src + ')');
        honeycombBackground.css('background-size', 'contain');
        honeycombBackground.css('z-index', 0);

        levelProperties.honeycombBackground = honeycombBackground;
    })();

    (function setupBetweenBoardAndGame() {
        var betweenBoardAndGame = $('#betweenBoardAndGame');

        betweenBoardAndGame.css('position', 'absolute');
        betweenBoardAndGame.height(logicalGameSize.height + 'px');
        betweenBoardAndGame.width(logicalGameSize.width + 'px');
        betweenBoardAndGame.css('left', parseFloat(gameCanvas.css('left')) + 'px');
        betweenBoardAndGame.css('top', parseFloat(gameCanvas.css('top')) + 'px');
        betweenBoardAndGame.css('z-index', 2);

        levelProperties.betweenBoardAndGame = betweenBoardAndGame;
    })();

    (function setupBetweenGameAndBezel() {
        var betweenGameAndBezel = $('#betweenGameAndBezel');

        betweenGameAndBezel.css('position', 'absolute');
        betweenGameAndBezel.height(logicalGameSize.height + 'px');
        betweenGameAndBezel.width(logicalGameSize.width + 'px');
        betweenGameAndBezel.css('left', parseFloat(gameCanvas.css('left')) + 'px');
        betweenGameAndBezel.css('top', parseFloat(gameCanvas.css('top')) + 'px');
        betweenGameAndBezel.css('z-index', 1);

        levelProperties.betweenGameAndBezel = betweenGameAndBezel;
    })();

    (function setupGameBezelDiv() {
        var gameBezel = $('#gameBezel');

        gameBezel.css('position', 'absolute');
        gameBezel.width(aboveCanvas.width() + 'px');
        gameBezel.height(aboveCanvas.height() + 'px');
        gameBezel.backgroundImg('url(' + gameplayImages['gameBezel'].src + ')');
        gameBezel.css('background-size', 'contain');
        gameBezel.css('z-index', 2);

        levelProperties.gameBezel = gameBezel;
    })();

    (function setupGameDial() {
        var gameDial = $('#gameDial');

        var gamedialSizePercentOfGameHeight = 0.222;
        var gamedialTopPercentOfGameHeight = 0.743;

        gameDial.css('position', 'absolute');
        gameDial.height(levelProperties.gameBezel.height() * gamedialSizePercentOfGameHeight);
        gameDial.width(levelProperties.gameBezel.height() * gamedialSizePercentOfGameHeight);
        gameDial.css('left', (levelProperties.gameBezel.width() - gameDial.width()) / 2 + 'px');
        gameDial.css('top', levelProperties.gameBezel.height() * gamedialTopPercentOfGameHeight + 'px');
        gameDial.css('background-size', 'contain');

        levelProperties.gameDial = gameDial;

        levelProperties.gameDialToShow = '1';
        levelProperties.updateGameDial = function (gameDialToShow) {
            if (gameDialToShow) {
                levelProperties.gameDialToShow = gameDialToShow;
            }

            levelProperties.gameDial.backgroundImg(gameplayImages['gamedial' + levelProperties.gameDialToShow].src);
        }
        levelProperties.updateGameDial();
    })();

    (function setupScores() {
        var latestScore = $('#latestScore');
        var totalScore = $('#totalScore');

        var baseScoreSize = levelProperties.gameDial.height() / 7.0;
        var baseScoreTop = levelProperties.gameDial.height() / 2.8;

        var pointsLabel = $('#pointsLabel');

        latestScore.css('position', 'absolute');
        latestScore.css('text-align', 'center');
        latestScore.width(levelProperties.gameDial.width());
        latestScore.css('color', '#b56d05');
        latestScore.css('font-family', 'Portago');
        latestScore.css('top', baseScoreTop + 'px');
        latestScore.css('font-size', baseScoreSize / 1.1);
        latestScore.css('opacity', 0);
        latestScore.css('-webkit-user-select', 'none');

        totalScore.css('position', 'absolute');
        totalScore.css('text-align', 'center');
        totalScore.width(levelProperties.gameDial.width());
        totalScore.css('color', '#b56d05');
        totalScore.css('font-family', 'Portago');
        totalScore.css('top', baseScoreTop + 'px');
        totalScore.css('font-size', baseScoreSize);
        totalScore.css('-webkit-user-select', 'none');

        pointsLabel.css('position', 'absolute');
        pointsLabel.css('text-align', 'center');
        pointsLabel.width(levelProperties.gameDial.width());
        pointsLabel.css('color', '#b56d05');
        pointsLabel.css('font-family', 'Portago');
        pointsLabel.css('top', levelProperties.gameDial.height() / 1.9 + 'px');
        pointsLabel.css('font-size', levelProperties.gameDial.height() / 12.4);
        pointsLabel.text('points');
        pointsLabel.css('-webkit-user-select', 'none');

        levelProperties.latestScore = latestScore;
        levelProperties.totalScore = totalScore;
        levelProperties.baseScoreSize = baseScoreSize;
        levelProperties.baseScoreTop = baseScoreTop;
        levelProperties.pointsLabel = pointsLabel;

        levelProperties.updateLatestScore = function (score) {
            var sign = score > 0 ? '+' : '-';

            levelProperties.latestScore.css('top', parseFloat(levelProperties.totalScore.css('top')) + 'px');
            levelProperties.latestScore.css('font-size', parseFloat(levelProperties.totalScore.css('font-size')));
            levelProperties.latestScore.html(sign + score);
        }

        levelProperties.updateTotalScore = function (score) {
            if (score >= 1000000) {
                levelProperties.totalScore.css('top', Math.floor(levelProperties.baseScoreTop * 1.1) + 'px');
                levelProperties.totalScore.css('font-size', Math.floor(levelProperties.baseScoreSize / 1.3));
            } else if (score >= 100000) {
                levelProperties.totalScore.css('top', Math.floor(levelProperties.baseScoreTop * 1.1) + 'px');
                levelProperties.totalScore.css('font-size', Math.floor(levelProperties.baseScoreSize / 1.15));
            } else if (score >= 10000) {
                levelProperties.totalScore.css('top', Math.floor(levelProperties.baseScoreTop * 1.05) + 'px');
                levelProperties.totalScore.css('font-size', Math.floor(levelProperties.baseScoreSize / 1.1));
            } else {
                levelProperties.totalScore.css('font-size', levelProperties.baseScoreSize);
            }

            levelProperties.totalScore.html(score);
        }

        var unDisplayLatestScoreTimer;
        levelProperties.flashLatestScore = function () {
            levelProperties.totalScore.css('opacity', 0.0);
            levelProperties.latestScore.css('opacity', 1.0);

            unDisplayLatestScoreTimer = $.timeout(400, function () {
                levelProperties.latestScore.css('opacity', 0.0);
                levelProperties.totalScore.css('opacity', 1.0);
            });

            levelProperties.timers.push(unDisplayLatestScoreTimer);
        }
    })();

    (function setupLives() {
        var lives = $('#lives');
        var life1 = $('#life1');
        var life2 = $('#life2');
        var life3 = $('#life3');

        var livesHeightPercentOfGameHeight = 0.052;
        var livesWidthPercentOfGameHeight = 0.2;
        var livesLeftPercentOfGameHeight = 0.81;
        var livesTopPercentOfGameHeight = 0.005;

        lives.css('position', 'absolute');
        lives.height(levelProperties.gameBezel.height() * livesHeightPercentOfGameHeight);
        lives.width(levelProperties.gameBezel.height() * livesWidthPercentOfGameHeight);
        lives.css('left', levelProperties.gameBezel.width() * livesLeftPercentOfGameHeight + 'px');
        lives.css('top', levelProperties.gameBezel.height() * livesTopPercentOfGameHeight + 'px');
        lives.css('background-size', 'contain');
        lives.css('-webkit-user-select', 'none');

        var lifeImageAdjustment = 1.0;

        life1.css('position', 'absolute');
        life1.height(lives.height() * lifeImageAdjustment);
        life1.width(life1.height());
        life1.css('left', lives.width() / 1.44 + 'px');
        life1.css('top', 0 + 'px');
        life1.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
        life1.css('background-size', 'contain');
        life1.css('background-repeat', 'no-repeat');
        life1.css('-webkit-user-select', 'none');
        life1.css('opacity', 0);

        life2.css('position', 'absolute');
        life2.height(lives.height() * lifeImageAdjustment);
        life2.width(life2.height());
        life2.css('left', lives.width() / 2.76 + 'px');
        life2.css('top', 0 + 'px');
        life2.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
        life2.css('background-size', 'contain');
        life2.css('-webkit-user-select', 'none');
        life2.css('opacity', 0);

        life3.css('position', 'absolute');
        life3.height(lives.height() * lifeImageAdjustment);
        life3.width(life3.height());
        life3.css('left', lives.width() / 24 + 'px');
        life3.css('top', 0 + 'px');
        life3.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
        life3.css('background-size', 'contain');
        life3.css('-webkit-user-select', 'none');
        life3.css('opacity', 0);

        levelProperties.lives = lives;
        levelProperties.life1 = life1;
        levelProperties.life2 = life2;
        levelProperties.life3 = life3;

        levelProperties.updateLives = function (lives, bonus) {
            for (var i = 1; i <= 3; i++) {
                levelProperties['life' + i].animate({'opacity': (i <= lives ? 1.0 : 0.0)});
            }

            switch (bonus) {
                case 1:
                    life1.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
                    life2.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
                    life3.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
                    levelProperties['life' + lives].backgroundImg('url(' + gameplayImages['turretLifeBonus'].src + ')');
                    break;
                default :
                    life1.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
                    life2.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
                    life3.backgroundImg('url(' + gameplayImages['turretLife'].src + ')');
                    break;
            }
        }
    })();

    (function setupJoker() {
        var joker = $('#joker');

        var jokerSizePercentOfGameHeight = 0.083;
        var jokerTopPercentOfGameHeight = 0.914;
        var jokerLeftPercentOfGameHeight = 0.852;

        joker.css('position', 'absolute');
        joker.width(levelProperties.gameBezel.height() * jokerSizePercentOfGameHeight);
        joker.height(joker.width());
        joker.css('left', levelProperties.gameBezel.height() * jokerLeftPercentOfGameHeight + 'px');
        joker.css('top', levelProperties.gameBezel.height() * jokerTopPercentOfGameHeight + 'px');
        joker.css('background-size', 'contain');
        joker.css('background-repeat', 'no-repeat');

        levelProperties.joker = joker;

        levelProperties.updateJoker = function (showJoker, joker) {
            if (showJoker) {
                if (gameplayImages['jokerDark' + joker]) {
                    levelProperties.joker.backgroundImg('url(' + gameplayImages['jokerDark' + joker].src + ')');
                } else {
                    levelProperties.joker.backgroundImg('url(' + gameplayImages['jokerDark'].src + ')');
                }
            } else {
                if (gameplayImages['jokerLight' + joker]) {
                    levelProperties.joker.backgroundImg('url(' + gameplayImages['jokerLight' + joker].src + ')');
                } else {
                    levelProperties.joker.backgroundImg('url(' + gameplayImages['jokerLight'].src + ')');
                }
            }
        }
    })();

    (function setupLevelIndicator() {
        var levelIndicator = $('#levelIndicator');

        var levelIndicatorSizePercentOfGameHeight = 0.24;
        var levelIndicatorTopPercentOfGameHeight = 0.81;
        var levelIndicatorLeftPercentOfGameHeight = 0.07;

        levelIndicator.css('position', 'absolute');
        levelIndicator.width(levelProperties.gameBezel.height() * levelIndicatorSizePercentOfGameHeight);
        levelIndicator.height(levelIndicator.width() / 2.9);
        levelIndicator.css('left', levelProperties.gameBezel.height() * levelIndicatorLeftPercentOfGameHeight + 'px');
        levelIndicator.css('top', levelProperties.gameBezel.height() * levelIndicatorTopPercentOfGameHeight + 'px');
        levelIndicator.css('background-size', 'contain');
        levelIndicator.css('background-repeat', 'no-repeat');

        levelProperties.levelIndicator = levelIndicator;

        levelProperties.updateLevelIndicator = function (level) {
            if (gameplayImages['levelIndicator' + level].hadError) {
                level = 1;
            }

            levelProperties.levelIndicator.backgroundImg('url(' + gameplayImages['levelIndicator' + level].src + ')');
        }
    })();

    (function setupCurrentMoney() {
        var currentMoney = $('#currentMoney');

        var currentMoneySizePercentOfGameHeight = 0.12;
        var currentMoneyTopPercentOfGameHeight = 0.9;
        var currentMoneyLeftPercentOfGameHeight = 0.06;
        var currentMoneyBaseFontSize = levelProperties.gameBezel.height() / 26;

        currentMoney.css('position', 'absolute');
        currentMoney.width(levelProperties.gameBezel.height() * currentMoneySizePercentOfGameHeight);
        currentMoney.height(currentMoney.width() / 4);
        currentMoney.css('left', levelProperties.gameBezel.height() * currentMoneyLeftPercentOfGameHeight + 'px');
        currentMoney.css('top', levelProperties.gameBezel.height() * currentMoneyTopPercentOfGameHeight + 'px');
        currentMoney.css('color', 'grey');
        currentMoney.css('font-family', 'Portago');
        currentMoney.css('text-align', 'center');
        currentMoney.css('font-size', currentMoneyBaseFontSize);
        currentMoney.css('-webkit-user-select', 'none');

        levelProperties.currentMoney = currentMoney;

        levelProperties.updateCurrentMoney = function (money) {
            if (money > 9999) {
                currentMoney.css('font-size', currentMoneyBaseFontSize * 0.9);
            } else {
                currentMoney.css('font-size', currentMoneyBaseFontSize);
            }

            levelProperties.currentMoney.text(formatMoney(money));
        }
    })();

    (function setupTimerDiv() {
        var timerDiv = $('#timerDiv');

        var timerSizePercentOfGameHeight = 0.09;
        var timerTopPercentOfGameHeight = 0.935;
        var timerLeftPercentOfGameHeight = 0.4552;
        var timerBaseFontSize = levelProperties.levelIndicator.height() / 1.8;

        timerDiv.css('position', 'absolute');
        timerDiv.width(levelProperties.gameBezel.height() * timerSizePercentOfGameHeight);
        timerDiv.height(timerDiv.width() / 2.0);
        timerDiv.css('left', levelProperties.gameBezel.height() * timerLeftPercentOfGameHeight + 'px');
        timerDiv.css('top', levelProperties.gameBezel.height() * timerTopPercentOfGameHeight + 'px');
        timerDiv.css('color', '#b56d05');
        timerDiv.css('font-family', 'Portago');
        timerDiv.css('font-size', timerBaseFontSize);
        timerDiv.css('-webkit-user-select', 'none');

        levelProperties.timerDiv = timerDiv;

        levelProperties.updateTimerDiv = function (ms) {
            levelProperties.timerDiv.text(formatMilliseconds(ms));
        }
    })();

    (function setupOptionsButton() {
        var optionsButton = $('#optionsButton');

        var optionsButtonHeightPercentOfGameHeight = 0.03;
        var optionsButtonWidthPercentOfGameHeight = 0.1;
        var optionsButtonTopPercentOfGameHeight = 0.965;

        optionsButton.css('position', 'absolute');
        optionsButton.height(levelProperties.gameBezel.height() * optionsButtonHeightPercentOfGameHeight);
        optionsButton.width(levelProperties.gameBezel.height() * optionsButtonWidthPercentOfGameHeight);
        optionsButton.css('left', (levelProperties.gameBezel.width() - optionsButton.width()) / 2 + 'px');
        optionsButton.css('top', levelProperties.gameBezel.height() * optionsButtonTopPercentOfGameHeight + 'px');

        levelProperties.optionsButton = optionsButton;
    })();

    (function setupBuzzkillLogo() {
        var buzzkillLogo = $('#buzzkillLogo');

        var buzzkillLogoSizePercentOfGameHeight = 0.14;
        var buzzkillLogoTopPercentOfGameHeight = 0.835;
        var buzzkillLogoLeftPercentOfGameHeight = 1.196;

        buzzkillLogo.css('position', 'absolute');
        buzzkillLogo.width(levelProperties.gameBezel.height() * buzzkillLogoSizePercentOfGameHeight);
        buzzkillLogo.height(buzzkillLogo.width() / 3);
        buzzkillLogo.css('left', levelProperties.gameBezel.height() * buzzkillLogoLeftPercentOfGameHeight + 'px');
        buzzkillLogo.css('top', levelProperties.gameBezel.height() * buzzkillLogoTopPercentOfGameHeight + 'px');
        buzzkillLogo.backgroundImg('url(' + gameplayImages['buzzkill'].src + ')');
        buzzkillLogo.css('background-size', 'contain');
        buzzkillLogo.css('background-repeat', 'no-repeat');

        levelProperties.buzzkillLogo = buzzkillLogo;
    })();

    (function setupUsables() {
        var usables = $('#usables');
        var bombIcon = $('#bombIcon');
        var smokeIcon = $('#smokeIcon');
        var forcefieldIcon = $('#forcefieldIcon');

        var usablesHeightPercentOfGameHeight = 0.122;
        var usablesWidthPercentOfGameHeight = 0.23;
        var usablesLeftPercentOfGameHeight = 0.844;
        var usablesTopPercentOfGameHeight = 0.88;
        usables.css('position', 'absolute');
        usables.height(levelProperties.gameBezel.height() * usablesHeightPercentOfGameHeight);
        usables.width(levelProperties.gameBezel.height() * usablesWidthPercentOfGameHeight);
        usables.css('left', levelProperties.gameBezel.width() * usablesLeftPercentOfGameHeight + 'px');
        usables.css('top', levelProperties.gameBezel.height() * usablesTopPercentOfGameHeight + 'px');
        usables.css('background-size', 'contain');

        var usableSizePercentOfUsables = 0.44;

        bombIcon.css('position', 'absolute');
        bombIcon.height(usables.height() * usableSizePercentOfUsables);
        bombIcon.width(usables.height() * usableSizePercentOfUsables);
        bombIcon.css('left', usables.height() / 1.75 + 'px');
        bombIcon.css('top', usables.height() / 13 + 'px');
        bombIcon.backgroundImg('url(' + gameplayImages['bomb'].src + ')');
        bombIcon.css('background-size', 'contain');
        bombIcon.css('background-repeat', 'no-repeat');

        smokeIcon.css('position', 'absolute');
        smokeIcon.height(usables.height() * usableSizePercentOfUsables);
        smokeIcon.width(usables.height() * usableSizePercentOfUsables);
        smokeIcon.css('left', usables.height() / 1.1 + 'px');
        smokeIcon.css('top', usables.height() / 22 + 'px');
        smokeIcon.backgroundImg('url(' + gameplayImages['smoke'].src + ')');
        smokeIcon.css('background-size', 'contain');

        forcefieldIcon.css('position', 'absolute');
        forcefieldIcon.height(usables.height() * usableSizePercentOfUsables);
        forcefieldIcon.width(usables.height() * usableSizePercentOfUsables);
        forcefieldIcon.css('left', usables.height() / 4.4 + 'px');
        forcefieldIcon.css('top', usables.height() / 13 + 'px');
        forcefieldIcon.backgroundImg('url(' + gameplayImages['forcefield'].src + ')');
        forcefieldIcon.css('background-size', 'contain');

        levelProperties.usables = usables;
        levelProperties.bombIcon = bombIcon;
        levelProperties.smokeIcon = smokeIcon;
        levelProperties.forcefieldIcon = forcefieldIcon;
    })();

    (function generateHoneyCombCells() {
        var honeycombCellsNum = 0;
        var honeycombCells = [];
        var cellWidth = (levelProperties.honeycombBackground.height() / 23.8);
        var cellBaseX = -(cellWidth / 2.1);
        var cellBaseY = -(cellWidth / 1.96);

        levelProperties.honeycombHorizontal = 51;
        levelProperties.honeycombVertical = 30;

        for (var j = 0; j < levelProperties.honeycombHorizontal; j++) {
            var cellNum = levelProperties.honeycombVertical - (((j % 2) == 0) ? 0 : 1);
            var cellLeft = Math.round(cellBaseX + (cellWidth * j * 0.7104));

            honeycombCells[j] = [];
            for (var i = 0; i < cellNum; i++) {
                var cellTop = Math.round(cellBaseY + (j % 2 == 0 ? 0 : (cellWidth / 2.46)) + (cellWidth * i * 0.8214));

                var honeycombCell = $(document.createElement('div'));
                honeycombCell.backgroundImg('url(' + gameplayImages['honeycombCell'].src + ')');
                honeycombCell.css('background-size', 'contain');
                honeycombCell.css('position', 'absolute');
                honeycombCell.css('top', cellTop + 'px');
                honeycombCell.css('left', cellLeft + 'px');
                honeycombCell.css('height', cellWidth + 'px');
                honeycombCell.css('width', cellWidth + 'px');
                honeycombCell.css('opacity', 0.1);
                honeycombCell.appendTo(levelProperties.honeycombBackground);

                honeycombCells[j + i * levelProperties.honeycombHorizontal] = honeycombCell;
                honeycombCellsNum++;
            }
        }

        levelProperties.honeycombCellsNum = honeycombCellsNum;
        levelProperties.honeycombCells = honeycombCells;

        levelProperties.honeycombCellsCurrentShown = 0;
        levelProperties.honeycombCellsToShow = 0;
        levelProperties.updateHoneycombCellsToShowTimer = null;
        levelProperties.updateHoneycombCellsToShow = function (num) {
            levelProperties.honeycombCellsToShow = num;

            function fadeInShowHoneycombCells() {
                try {
                    if (levelProperties.honeycombCellsCurrentShown < levelProperties.honeycombCellsToShow) {
                        levelProperties.honeycombCells[levelProperties.honeycombCellsCurrentShown++].css('opacity', 1.0);
                        fadeInShowHoneycombCells();
                    } else if (levelProperties.honeycombCellsCurrentShown > levelProperties.honeycombCellsToShow) {
                        levelProperties.honeycombCells[levelProperties.honeycombCellsCurrentShown--].css('opacity', 0.1);
                        fadeInShowHoneycombCells();
                    }
                } catch (e) {
                }
            }

            fadeInShowHoneycombCells();
        }
    })();

    levelProperties.updateFumesOverlay = function (level) {
        var fumesOverlay = gameplayVideos['fumesOverlay' + level];

        if (fumesOverlay.hadError) {
            fumesOverlay = gameplayVideos['fumesOverlay1'];
            level = 1;
        }

        levelProperties.betweenBoardAndGame.append(fumesOverlay);
        fumesOverlay.style.width = levelProperties.betweenBoardAndGame.width() + 'px';
        fumesOverlay.style.height = levelProperties.betweenBoardAndGame.height() + 'px';
        fumesOverlay.style.top = '0px';
        fumesOverlay.style.opacity = 0.33;
        fumesOverlay.style.zIndex = -1;
        fumesOverlay.style.webkitTransform = 'scaleY(1.2)';
        playGameplayVideo('fumesOverlay' + level, true);
    }

    levelProperties.updateHoneycombCover = function (level) {
        var honeycombCover = gameplayImages['honeycombCover' + level];

        if (honeycombCover.hadError) {
            honeycombCover = gameplayImages['honeycombCover1'];
        }

        levelProperties.betweenBoardAndGame.append(honeycombCover);
        honeycombCover.style.width = levelProperties.betweenBoardAndGame.width() + 'px';
        honeycombCover.style.height = levelProperties.betweenBoardAndGame.height() + 'px';
        honeycombCover.style.top = '0px';
        honeycombCover.style.opacity = 0.9;
        honeycombCover.style.zIndex = 0;
    }

    levelProperties.showSmoke = function (midSmokeCallback, smokeEndedCallback) {
        levelProperties.betweenBoardAndGame.append(gameplayVideos['smoke']);
        gameplayVideos['smoke'].style.width = levelProperties.betweenBoardAndGame.width() + 'px';
        gameplayVideos['smoke'].style.height = levelProperties.betweenBoardAndGame.height() + 'px';
        gameplayVideos['smoke'].style.top = '0px';
        gameplayVideos['smoke'].style.opacity = 1.0;
        gameplayVideos['smoke'].style.webkitTransform = 'scaleY(1.2)';
        playGameplayVideo('smoke', true);

        var midSmokeCallbackCalled = false;
        var smokeOpacity = gameplayVideos['smoke'].style.opacity;

        function dissipateSmoke() {
            if (smokeOpacity >= 0) {
                if (smokeOpacity <= 0.4 && !midSmokeCallbackCalled) {
                    midSmokeCallbackCalled = true;
                    midSmokeCallback();
                }

                smokeOpacity -= 0.02;
                gameplayVideos['smoke'].style.opacity = smokeOpacity;

                levelProperties.timers.push($.timeout(300, function () {
                    dissipateSmoke();
                }));
            } else {
                hideGameplayVideo('smoke');

                smokeEndedCallback();
            }
        }

        dissipateSmoke();
    }

    levelProperties.showForcefield = function (forcefieldSize, midForcefieldCallback, forcefieldEndedCallback) {
        forcefieldSize *= 1.9;
        gameplayGifs['forcefield'].style.width = forcefieldSize + 'px';
        gameplayGifs['forcefield'].style.height = forcefieldSize + 'px';
        gameplayGifs['forcefield'].style.left = levelProperties.betweenBoardAndGame.width() / 2 - forcefieldSize / 2 + 'px';
        gameplayGifs['forcefield'].style.top = levelProperties.betweenBoardAndGame.height() / 2 - forcefieldSize / 2 + 'px';
        gameplayGifs['forcefield'].style.position = 'absolute';
        gameplayGifs['forcefield'].style.opacity = 0.85;
        levelProperties.betweenBoardAndGame.append(gameplayGifs['forcefield']);

        var reposition = setInterval((function offseter() {
            var offset = levelProperties.getOffset();
            gameplayGifs['forcefield'].style.webkitTransform = 'translate(' + offset.x + 'px,' + offset.y + 'px)';
            return offseter;
        })(), 33);

        var forceFieldRotation = 0;
        var midForcefieldCallbackCalled = false;
        var forcefieldOpacity = gameplayGifs['forcefield'].style.opacity;

        function dissapateForcefield() {
            if (forcefieldOpacity >= 0) {
                if (forcefieldOpacity <= 0.1 & !midForcefieldCallbackCalled) {
                    midForcefieldCallbackCalled = true;
                    midForcefieldCallback();
                }

                //gameplayGifs['forcefield'].style.webkitTransform = 'rotate(' + (forceFieldRotation += 10) + 'deg)';

                forcefieldOpacity -= 0.05;
                gameplayGifs['forcefield'].style.opacity = forcefieldOpacity;

                levelProperties.timers.push($.timeout(320, function () {
                    dissapateForcefield();
                }));
            } else {
                clearInterval(reposition);
                hideGameplayGif('forcefield');

                forcefieldEndedCallback();
            }
        }

        dissapateForcefield();
    }

    levelProperties.showBomb = function (midBombCallback, bombEndedCallback) {
        levelProperties.betweenBoardAndGame.append(gameplayVideos['bomb']);
        gameplayVideos['bomb'].style.width = levelProperties.betweenBoardAndGame.width() + 'px';
        gameplayVideos['bomb'].style.height = levelProperties.betweenBoardAndGame.height() + 'px';
        gameplayVideos['bomb'].style.top = '0px';
        gameplayVideos['bomb'].style.opacity = 0.0;
        gameplayVideos['bomb'].style.webkitTransform = 'scaleY(1.2)';
        playGameplayVideo('bomb', false);

        var midBombCallbackCalled = false;
        var fadedIn = false;

        var bombOpacity = 0.0;

        function fadeInBomb() {
            if (!fadedIn) {
                if (bombOpacity <= 1.0) {
                    bombOpacity += 0.12;

                    gameplayVideos['bomb'].style.opacity = bombOpacity;

                    levelProperties.timers.push($.timeout(100, function () {
                        fadeInBomb();
                    }));
                } else {
                    fadedIn = true;

                    bombOpacity = 1.0;
                    gameplayVideos['bomb'].style.opacity = 1.0;

                    dissipateBomb();
                }
            }
        }

        fadeInBomb();

        function dissipateBomb() {
            if (bombOpacity >= 0) {
                if (bombOpacity <= 0.95 && !midBombCallbackCalled) {
                    midBombCallbackCalled = true;
                    midBombCallback();
                }

                bombOpacity -= 0.15;
                gameplayVideos['bomb'].style.opacity = bombOpacity;

                levelProperties.timers.push($.timeout(200, function () {
                    dissipateBomb();
                }));
            } else {
                hideGameplayVideo('bomb');

                bombEndedCallback();
            }
        }
    }

    levelProperties.toggleTurretDieing = function (show) {
        var reposition = null;

        if (show) {
            var turretDieingSize = levelProperties.betweenBoardAndGame.height() / 6.0;
            gameplayGifs['turretDieing'].style.width = turretDieingSize + 'px';
            gameplayGifs['turretDieing'].style.height = turretDieingSize + 'px';
            gameplayGifs['turretDieing'].style.left = (levelProperties.betweenBoardAndGame.width() - turretDieingSize) / 2 - turretDieingSize / 3 + 'px';
            gameplayGifs['turretDieing'].style.top = (levelProperties.betweenBoardAndGame.height() - turretDieingSize) / 2 - turretDieingSize / 40 + 'px';
            gameplayGifs['turretDieing'].style.position = 'absolute';
            gameplayGifs['turretDieing'].style.opacity = 1.0;
            levelProperties.betweenBoardAndGame.append(gameplayGifs['turretDieing']);

            turretDieingSize = levelProperties.betweenBoardAndGame.height() / 7.0;
            gameplayGifs['turretDieing2'].style.width = turretDieingSize + 'px';
            gameplayGifs['turretDieing2'].style.height = turretDieingSize + 'px';
            gameplayGifs['turretDieing2'].style.left = (levelProperties.betweenBoardAndGame.width() - turretDieingSize) / 2 + turretDieingSize / 3 + 'px';
            gameplayGifs['turretDieing2'].style.top = (levelProperties.betweenBoardAndGame.height() - turretDieingSize) / 2 - turretDieingSize / 8 + 'px';
            gameplayGifs['turretDieing2'].style.position = 'absolute';
            gameplayGifs['turretDieing2'].style.opacity = 1.0;
            levelProperties.timers.push($.timeout(1000, function () {
                levelProperties.betweenBoardAndGame.append(gameplayGifs['turretDieing2']);
            }));

            turretDieingSize = levelProperties.betweenBoardAndGame.height() / 5.8;
            gameplayGifs['turretDieing3'].style.width = turretDieingSize + 'px';
            gameplayGifs['turretDieing3'].style.height = turretDieingSize + 'px';
            gameplayGifs['turretDieing3'].style.left = (levelProperties.betweenBoardAndGame.width() - turretDieingSize) / 2 + turretDieingSize / 4 + 'px';
            gameplayGifs['turretDieing3'].style.top = (levelProperties.betweenBoardAndGame.height() - turretDieingSize) / 2 + turretDieingSize / 5 + 'px';
            gameplayGifs['turretDieing3'].style.position = 'absolute';
            gameplayGifs['turretDieing3'].style.opacity = 1.0;
            levelProperties.timers.push($.timeout(500, function () {
                levelProperties.betweenBoardAndGame.append(gameplayGifs['turretDieing3']);
            }));

            var turretDieingSize = levelProperties.betweenBoardAndGame.height() / 5.2;
            gameplayGifs['turretDieing4'].style.width = turretDieingSize + 'px';
            gameplayGifs['turretDieing4'].style.height = turretDieingSize + 'px';
            gameplayGifs['turretDieing4'].style.left = (levelProperties.betweenBoardAndGame.width() - turretDieingSize) / 2 + 'px';
            gameplayGifs['turretDieing4'].style.top = (levelProperties.betweenBoardAndGame.height() - turretDieingSize) / 2 + 'px';
            gameplayGifs['turretDieing4'].style.position = 'absolute';
            gameplayGifs['turretDieing4'].style.opacity = 0.8;

            levelProperties.timers.push($.timeout(3000, function () {
                levelProperties.betweenBoardAndGame.append(gameplayGifs['turretDieing4']);
            }));

            reposition = setInterval((function offseter() {
                var offset = levelProperties.getOffset();
                gameplayGifs['turretDieing'].style.webkitTransform = 'translate(' + offset.x + 'px,' + offset.y + 'px)';
                gameplayGifs['turretDieing2'].style.webkitTransform = 'translate(' + offset.x + 'px,' + offset.y + 'px)';
                gameplayGifs['turretDieing3'].style.webkitTransform = 'translate(' + offset.x + 'px,' + offset.y + 'px)';
                gameplayGifs['turretDieing4'].style.webkitTransform = 'translate(' + offset.x + 'px,' + offset.y + 'px)';
                return offseter;
            })(), 33);
        } else {
            clearInterval(reposition);
            hideGameplayGif('turretDieing');
            hideGameplayGif('turretDieing2');
            hideGameplayGif('turretDieing3');
            hideGameplayGif('turretDieing4');
        }
    }

    levelProperties.showTurretDeath = function(count, callback) {
        if (count-- > 0) {
            var turretDeathSize = levelProperties.betweenBoardAndGame.height() / 4.6;
            gameplayImages['turretHit'].style.width = turretDeathSize + 'px';
            gameplayImages['turretHit'].style.height = turretDeathSize + 'px';
            var turretDeathOffset = {
                x: (Math.random() > 0.5 ? -1 : 1) * (0.3 * Math.random()) * turretDeathSize,
                y: (Math.random() > 0.5 ? 1 : -1) * (0.3 * Math.random()) * turretDeathSize
            };
            gameplayImages['turretHit'].style.left = (levelProperties.betweenBoardAndGame.width() - turretDeathSize) / 2 + turretDeathOffset.x + 'px';
            gameplayImages['turretHit'].style.top = (levelProperties.betweenBoardAndGame.height() - turretDeathSize) / 2 + turretDeathOffset.y + 'px';
            gameplayImages['turretHit'].style.position = 'absolute';
            gameplayImages['turretHit'].style.opacity = 1.0;
            (Math.random() > 0.5 ? levelProperties.betweenBoardAndGame : levelProperties.betweenGameAndBezel).append(gameplayImages['turretHit']);

            (function offseter() {
                var offset = levelProperties.getOffset();
                gameplayImages['turretHit'].style.webkitTransform = 'translate(' + offset.x + 'px,' + offset.y + 'px)';
                return offseter;
            })();

            var blastSound;
            var r = Math.random();
            if (r > 0.7) {
                blastSound = 'bombAttackExplosion';
            } else if (r > 0.4) {
                blastSound = 'smallBlast';
            } else {
                blastSound = 'turretBeingHit';
            }
            playGameplaySound(blastSound, false, 1.0);

            $.timeout(150, function() {
                hideGameplayImage('turretHit');
                levelProperties.showTurretDeath(count, callback);
            });
        } else {
            callback();
        }
    }

    levelProperties.showBonusAlert = function(bonusId, callback) {
        gameplayImages['bonusShipAlert'].style.width = levelProperties.betweenGameAndBezel.width() + 'px';
        gameplayImages['bonusShipAlert'].style.height = levelProperties.betweenGameAndBezel.height() + 'px';
        gameplayImages['bonusShipAlert'].style.top = 0 + 'px';
        gameplayImages['bonusShipAlert'].style.position = 'absolute';
        gameplayImages['bonusShipAlert'].style.opacity = 0.0;
        gameplayImages['bonusShipAlert'].style.zIndex = 10;
        levelProperties.betweenGameAndBezel.append(gameplayImages['bonusShipAlert']);

        var alertImage = $(gameplayImages['bonusShipAlert']);
        alertImage.animate({'opacity': 1.0}, 600, function () {
            var unshowBonusAlertTimer = $.timeout(3800, function () {
                alertImage.animate({'opacity': 0.0}, 1000, function () {
                    hideGameplayImage('bonusShipAlert');
                    callback();
                });
            });
            levelProperties.timers.push(unshowBonusAlertTimer);
        });
    }

    levelProperties.unShowTurretHitTimer = null;
    levelProperties.repositionTurretHit = null;
    levelProperties.flashTurretHit = function () {
        if (levelProperties.unShowTurretHitTimer) {
            levelProperties.unShowTurretHitTimer.stop();
        }

        if (levelProperties.repositionTurretHit) {
            clearInterval(levelProperties.repositionTurretHit);
        }

        var turretHitWidth = levelProperties.betweenGameAndBezel.height() / 3.4;
        var turretHitHeight = levelProperties.betweenGameAndBezel.height() / 3.4;
        gameplayImages['turretHit'].style.width = turretHitWidth + 'px';
        gameplayImages['turretHit'].style.height = turretHitHeight + 'px';
        gameplayImages['turretHit'].style.left = levelProperties.betweenGameAndBezel.width() / 2 - turretHitWidth / 2 + 'px';
        gameplayImages['turretHit'].style.top = levelProperties.betweenGameAndBezel.height() / 2 - turretHitHeight / 2 + 'px';
        gameplayImages['turretHit'].style.position = 'absolute';
        gameplayImages['turretHit'].style.opacity = 1.0;
        levelProperties.betweenGameAndBezel.append(gameplayImages['turretHit']);

        levelProperties.repositionTurretHit = setInterval((function offseter() {
            var offset = levelProperties.getOffset();
            gameplayImages['turretHit'].style.webkitTransform = 'translate(' + offset.x + 'px,' + offset.y + 'px)';
            return offseter;
        })(), 33);

        levelProperties.unShowTurretHitTimer = $.timeout(400, function () {
            clearInterval(levelProperties.repositionTurretHit);
            hideGameplayImage('turretHit');
        });
        levelProperties.timers.push(levelProperties.unShowTurretHitTimer);
    }

    levelProperties.showLevelIntro = function (level, callback) {
        var levelIntro = 'levelIntro' + level;

        if (gameplayImages[levelIntro].hadError) {
            levelIntro = 'levelIntro1';
        }

        gameplayImages[levelIntro].style.width = levelProperties.betweenGameAndBezel.width() + 'px';
        gameplayImages[levelIntro].style.height = levelProperties.betweenGameAndBezel.height() + 'px';
        gameplayImages[levelIntro].style.top = 0 + 'px';
        gameplayImages[levelIntro].style.position = 'absolute';
        gameplayImages[levelIntro].style.opacity = 1.0;
        levelProperties.betweenGameAndBezel.append(gameplayImages[levelIntro]);

        gameplayImages['blackIntro'].style.width = levelProperties.betweenGameAndBezel.width() + 'px';
        gameplayImages['blackIntro'].style.height = levelProperties.betweenGameAndBezel.height() + 'px';
        gameplayImages['blackIntro'].style.top = 0 + 'px';
        gameplayImages['blackIntro'].style.position = 'absolute';
        gameplayImages['blackIntro'].style.opacity = 0.0;
        gameplayImages['blackIntro'].style.zIndex = 10;
        levelProperties.betweenGameAndBezel.append(gameplayImages['blackIntro']);

        playNavigationSound('titleScreenAway', false, 1.0);
        levelProperties.timers.push($.timeout(2600, function () {
            playGameplaySound('levelIntroScreen', false, 1.0);
            levelProperties.timers.push($.timeout(3600, function () {
                $(gameplayImages['blackIntro']).animate({'opacity': 1.0}, 800, function () {
                    hideGameplayImage(levelIntro);
                    $.timeout(1000, function () {
                        $(gameplayImages['blackIntro']).animate({'opacity': 0.0}, 1000, function () {
                            hideGameplayImage('blackIntro');
                        });
                        callback();
                    });
                });
            }));
        }));
    }

    levelProperties.showLevelOutro = function (why, callback) {
        playGameplaySound('levelWinOrLose', true, 1.0);

        var levelOutro = null;
        if (why == 'win') {
            levelOutro = 'levelEndWin';
        } else if (why == 'die') {
            levelOutro = 'levelEndLose';
        }

        gameplayImages[levelOutro].style.width = levelProperties.betweenGameAndBezel.width() + 'px';
        gameplayImages[levelOutro].style.height = levelProperties.betweenGameAndBezel.height() + 'px';
        gameplayImages[levelOutro].style.top = 0 + 'px';
        gameplayImages[levelOutro].style.position = 'absolute';
        gameplayImages[levelOutro].style.opacity = 0.0;
        levelProperties.betweenGameAndBezel.append(gameplayImages[levelOutro]);

        gameplayImages['blackOutro'].style.width = levelProperties.betweenGameAndBezel.width() + 'px';
        gameplayImages['blackOutro'].style.height = levelProperties.betweenGameAndBezel.height() + 'px';
        gameplayImages['blackOutro'].style.top = 0 + 'px';
        gameplayImages['blackOutro'].style.position = 'absolute';
        gameplayImages['blackOutro'].style.opacity = 0.0;
        gameplayImages['blackOutro'].style.zIndex = 10;
        levelProperties.betweenGameAndBezel.append(gameplayImages['blackOutro']);

        $(gameplayImages[levelOutro]).animate({'opacity': 1.0}, 800, function () {
            levelProperties.timers.push($.timeout(4400, function () {
                $(gameplayImages['blackOutro']).animate({'opacity': 1.0}, 800, function () {
                    hideGameplayImage(levelOutro);
                    $.timeout(900, function () {
                        $(gameplayImages['blackOutro']).animate({'opacity': 0.0}, 1000, function () {
                            hideGameplayImage('blackOutro');
                        });
                        callback();
                    });
                });
            }));
        });
    }

    levelProperties.unFlashScreenRedTimer = null;
    levelProperties.flashScreenRed = function () {
        if (levelProperties.unFlashScreenRedTimer) {
            levelProperties.unFlashScreenRedTimer.stop();
        }

        gameplayImages['redFlash'].style.width = levelProperties.betweenGameAndBezel.width() + 'px';
        gameplayImages['redFlash'].style.height = levelProperties.betweenGameAndBezel.height() + 'px';
        gameplayImages['redFlash'].style.top = 0 + 'px';
        gameplayImages['redFlash'].style.position = 'absolute';
        gameplayImages['redFlash'].style.opacity = 1.0;
        gameplayImages['redFlash'].style.zIndex = 10;
        levelProperties.betweenGameAndBezel.append(gameplayImages['redFlash']);

        levelProperties.unFlashScreenRedTimer = $.timeout(160, function () {
            hideGameplayImage('redFlash');
        });
    }

    levelProperties.flashingGamedialTimer = null;
    levelProperties.showingFlash = false;
    levelProperties.flashingGameDial = false;
    levelProperties.toggleFlashingGamedial = function (show) {
        if (show && !levelProperties.flashingGameDial) {
            levelProperties.latestScore.css('color', 'black');
            levelProperties.totalScore.css('color', 'black');
            levelProperties.totalScore.css('color', 'black');
            levelProperties.pointsLabel.css('color', 'black');

            if (levelProperties.flashingGamedialTimer) {
                levelProperties.flashingGamedialTimer.stop();
            }

            levelProperties.flashingGameDial = true;

            function showFlash() {
                if (!levelProperties.showingFlash) {
                    levelProperties.gameDial.backgroundImg('url(' + gameplayImages['gamedial13'].src + ')');
                    levelProperties.showingFlash = true;
                } else {
                    levelProperties.updateGameDial();
                    levelProperties.showingFlash = false;
                }

                levelProperties.flashingGamedialTimer = $.timeout(600, function () {
                    showFlash();
                });
                levelProperties.timers.push(levelProperties.flashingGamedialTimer);
            }

            showFlash();
        } else if (!show) {
            levelProperties.latestScore.css('color', '#b56d05');
            levelProperties.totalScore.css('color', '#b56d05');
            levelProperties.pointsLabel.css('color', '#b56d05');

            if (levelProperties.flashingGamedialTimer) {
                levelProperties.flashingGamedialTimer.stop();
            }

            levelProperties.flashingGameDial = false;
        }
    }

    currentLevelProperties = levelProperties;
}

function forEachLevelTimer(func) {
    if (currentLevelProperties && currentLevelProperties.timers) {
        var tim = currentLevelProperties.timers.length;
        while (tim-- > 0) {
            if (currentLevelProperties.timers[tim]) {
                if (!func(currentLevelProperties.timers[tim])) {
                    return;
                }
            }
        }
    }
}

function stopLevelTimers() {
    forEachLevelTimer(function (tim) {
        tim.stop();
        return true;
    });
}

function pauseLevelTimers() {
    forEachLevelTimer(function (tim) {
        tim.pause();
        return true;
    });
}

function resumeLevelTimers() {
    forEachLevelTimer(function (tim) {
        tim.resume();
        return true;
    });
}

loadScript('js/baseLevel.js');