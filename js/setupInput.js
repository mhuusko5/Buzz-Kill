//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////GAMEINPUT///////////GAMEINPUT///////////GAMEINPUT//////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function devicePixel() {
    return 1.0;
    return window.devicePixelRatio || 1.0;
}

function resetGameplayInput() {
    gameplayBonus = function () {

    }

    gameplayPause = function () {

    }

    gameplayResume = function () {

    }

    gameCanvasOffset = {
        x: parseFloat(gameCanvas.css('left')),
        y: parseFloat(gameCanvas.css('top'))
    }

    gameplayPointerLocationCallback = function (point) {

    }

    gameplayPrimaryClickCallback = function () {

    }

    shouldTrySpecial1 = false;
    gameplaySpecial1Callback = function () {

    }

    shouldTrySpecial2 = false;
    gameplaySpecial2Callback = function () {

    }

    shouldTrySpecial3 = false;
    gameplaySpecial3Callback = function () {

    }
}
resetGameplayInput();

(function gamePointerLocation() {
    game.on('mouseMover', function (e) {
        gameplayPointerLocationCallback({
            x: (devicePixel() || 1.0) * (e.x - gameCanvasOffset.x),
            y: (devicePixel() || 1.0) * (e.y - gameCanvasOffset.y)
        });
    });
})();

(function gamePrimaryClick() {
    game.addClass('clicker').on('clicker', function (e) {
        gameplayPrimaryClickCallback();
    });
})();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////INPUTINTERCEPT///////////INPUTINTERCEPT///////////INPUTINTERCEPT/////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.clicker = {x: 0, y: 0};
$document.on('doMouseMove', function (e) {
    clicker = {
        x: e.pageX,
        y: e.pageY
    };

    var gameClicker = normalizePointToDiv(clicker, game[0]);
    clickerDiv.css('left', gameClicker.x - clickerDiv.width() / 2);
    clickerDiv.css('top', gameClicker.y - clickerDiv.height() / 2);

    game.trigger({
        type: 'mouseMover',
        x: gameClicker.x,
        y: gameClicker.y,
        pageX: gameClicker.x,
        pageY: gameClicker.y
    });
});

var quitPage = $('#quitPage');

$document.on('doClick', function (e) {
    var select = (quitPage.css('display') != 'none' ? '.quiter' : '.clicker');
    $(select + ':actuallyVisible:actuallyOpaque').each(function (i, clickable) {
        var clickable = $(clickable);
        var clickableRect = {
            x: clickable.offset().left,
            y: clickable.offset().top,
            width: clickable.outerWidth(),
            height: clickable.outerHeight()
        }

        if ((clickerDiv.vis && divsIntersect(clickerDiv, clickable)) || (!clickerDiv.vis && (clicker.x > clickableRect.x && clicker.y > clickableRect.y
            && clicker.x < clickableRect.x + clickableRect.width && clicker.y < clickableRect.y + clickableRect.height))) {
            if (clickerDiv.vis) {
                clickerDiv.backgroundImg(gameplayImages['leapCursor2'].src);
            }

            $(clickable).trigger({
                type: 'clicker',
                x: clicker.x,
                y: clicker.y,
                pageX: clicker.x,
                pageY: clicker.y
            });
        }
    });
});

if ('ontouchstart' in document.documentElement) {
    (function touchInput() {
        function touch(e) {
            e = e.originalEvent.touches[0];

            if (!clickerDiv.vis) {
                clickerDiv.css('opacity', 0.81);
                clickerDiv.vis = true;
            }

            clicker = {
                x: e.pageX,
                y: e.pageY
            };

            var gameClicker = normalizePointToDiv(clicker, game[0]);
            clickerDiv.css('left', gameClicker.x - clickerDiv.width() / 2);
            clickerDiv.css('top', gameClicker.y - clickerDiv.height() / 2);

            gameplayPointerLocationCallback({
                x: (devicePixel() || 1.0) * (clicker.x - gameCanvasOffset.x),
                y: (devicePixel() || 1.0) * (clicker.y - gameCanvasOffset.y)
            });

            return false;
        }

        $document.on('touchstart', touch);
        $document.on('touchmove', touch);

        $document.on('touchend', function (e) {
            $document.trigger({
                type: 'doClick',
                pageX: e.pageX,
                pageY: e.pageY
            });

            return false;
        });
    })();
} else {
    (function mouseInput() {
        $document.on('mousemove', function (e) {
            if (clickerDiv.vis) {
                clickerDiv.css('opacity', 0);
                clickerDiv.vis = false;
            }

            $document.trigger({
                type: 'doMouseMove',
                pageX: e.pageX,
                pageY: e.pageY
            });

            return false;
        });

        $document.on('click', function (e) {
            $document.trigger({
                type: 'doClick',
                pageX: e.pageX,
                pageY: e.pageY
            });

            return false;
        });
    })();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////LEAPINPUT/////////////////////LEAPINPUT/////////////////////LEAPINPUT/////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (window.forLeapStore) {
    (function leapInput() {
        function leapToScene(frame, leapPos) {
            var iBox = frame.interactionBox;

            var left = iBox.center[0] - iBox.size[0] / 2;
            var top = iBox.center[1] + iBox.size[1] / 2;

            var x = leapPos[0] - left;
            var y = leapPos[1] - top;

            x /= iBox.size[0];
            y /= iBox.size[1];

            x *= window.innerWidth;
            y *= window.innerHeight;

            return {x: x, y: -y };
        }

        var leapLastClick = new Date();
        var leapUnclicked = true;

        function moveOrClick(pointClickFinger, frame) {
            var fingerPosition = leapToScene(frame, pointClickFinger.tipPosition);

            if (!clickerDiv.vis) {
                clickerDiv.css('opacity', 0.81);
                clickerDiv.vis = true;
            }

            /*$document.trigger({
                type: 'doMouseMove',
                pageX: fingerPosition.x,
                pageY: fingerPosition.y - window.innerWidth / 16
            });*/

            clicker = {
                x: fingerPosition.x,
                y: fingerPosition.y - window.innerWidth / 16
            };

            var gameClicker = normalizePointToDiv(clicker, game[0]);
            clickerDiv[0].style.left = gameClicker.x - parseFloat(clickerDiv[0].style.width) / 2 + 'px';
            clickerDiv[0].style.top = gameClicker.y - parseFloat(clickerDiv[0].style.height) / 2 + 'px';

            gameplayPointerLocationCallback({
                x: (devicePixel() || 1.0) * (gameClicker.x - gameCanvasOffset.x),
                y: (devicePixel() || 1.0) * (gameClicker.y - gameCanvasOffset.y)
            });

            var clickDepth = pointClickFinger.tipPosition[2];
            if (clickDepth < 20) {
                if ((leapUnclicked && (new Date() - leapLastClick) > 500) || (new Date() - leapLastClick) > 1500) {
                    leapLastClick = new Date();
                    leapUnclicked = false;

                    var tapPosition = leapToScene(frame, pointClickFinger.tipPosition);
                    $document.trigger({
                        type: 'doClick',
                        pageX: tapPosition.x,
                        pageY: tapPosition.y
                    });
                }
            } else if (!leapUnclicked) {
                leapUnclicked = true;
                clickerDiv.backgroundImg(gameplayImages['leapCursor'].src);
            }

            if (clickDepth < 20) {
                clickDepth = 20;
            }
            if (clickDepth > 70) {
                clickDepth = 70;
            }

            clickerDiv.scaleSize(1 + ((clickDepth - 20) / (70 - 20)));
        }

        var lastFrameDate = new Date();
        var leapController = new Leap.Controller();
        leapController.on('frame', function (frame) {
            if (!window.appFront || !frame.valid || !frame.pointables) {
                return;
            }

            var timeSinceLastFrame = new Date() - lastFrameDate;

            if (timeSinceLastFrame < 18) {
                return;
            }
            lastFrameDate = new Date();

            var spareFingers = [];
            for (var p in frame.pointables) {
                var pointable = frame.pointables[p];
                if (pointable.valid && pointable.handId == -1) {
                    spareFingers.push(pointable);
                }
            }

            var pointingHand;
            var pointingFinger;
            ////////////////////////////////////////POINT OR CLICK
            if (spareFingers.length == 1
                && (!frame.hands[0] || frame.hands[0].pointables.length == 0)
                && (!frame.hands[1] || frame.hands[1].pointables.length == 1)
                && (pointingFinger = spareFingers[0])) {
                moveOrClick(pointingFinger, frame);
            } else if (frame.hands[0]
                && frame.hands[0].pointables.length == 1
                && (!frame.hands[1] || frame.hands[1].pointables.length == 0)
                && (pointingFinger = frame.hands[0].pointables[0])
                && (pointingHand = frame.hands[0])) {
                moveOrClick(pointingFinger, frame);
            } else if (frame.hands[1]
                && frame.hands[1].pointables.length == 1
                && frame.hands[0].pointables.length == 0
                && (pointingFinger = frame.hands[1].pointables[0])
                && (pointingHand = frame.hands[1])) {
                moveOrClick(pointingFinger, frame);
            } else {
                var pointer = frame.pointables[0];
                if (pointer && pointer.valid) {
                    moveOrClick(pointer, frame);
                }
            }
            /*else
             ////////////////////////////////////////BOMB
             if (shouldTrySpecial2
             && frame.hands[0]
             && frame.hands[0].pointables.length == 0
             && frame.hands[0].palmPosition[2] < 100
             && frame.hands[1]
             && frame.hands[1].pointables.length == 0
             && frame.hands[1].palmPosition[2] < 100) {
             gameplaySpecial2Callback();
             } else
             ////////////////////////////////////////FORCEFIELD
             if (shouldTrySpecial1
             && frame.hands[0]
             && frame.hands[0].pointables.length >= 4
             && frame.hands[0].pitch() > 0.5) {
             gameplaySpecial1Callback();
             } else if (shouldTrySpecial1
             && frame.hands[1]
             && frame.hands[1].pointables.length >= 4
             && frame.hands[1].pitch() > 0.5) {
             gameplaySpecial1Callback();
             } else if (shouldTrySpecial1
             && spareFingers.length >= 4
             && spareFingers[0].direction[1] > 0.4) {
             gameplaySpecial1Callback();
             } else
             ////////////////////////////////////////SMOKE
             if (shouldTrySpecial3
             && frame.hands[0]
             && frame.hands[0].pointables.length >= 3
             && frame.hands[0].pitch() > 0.5
             && frame.hands[1]
             && frame.hands[1].pointables.length >= 3
             && frame.hands[1].pitch() > 0.5) {
             gameplaySpecial3Callback();
             }*/
        });

       /* leapController.on('disconnect', function () {
            gameOptions.usingLeap = false;

            if (window.forLeapStore) {
               // alert('Leap Motion Controller disconnected!');
            }
        });
*/
        leapController.on('deviceDisconnected', function () {
            gameOptions.usingLeap = false;

            if (window.forLeapStore) {
                alert('Leap Motion Controller disconnected!');
            }
        });

        leapController.on('deviceConnected', function () {
            gameOptions.usingLeap = true;
        });

        leapController.on('ready', function () {
            gameOptions.usingLeap = true;

            gameOptions.shootingMethod = 'semi';

            if (updateShootingMethod) {
                updateShootingMethod();
            }
        });

        leapController.connect();

        $.timeout(5500, function () {
            if (window.forLeapStore && !gameOptions.usingLeap) {
                alert('Please connect your Leap Motion Controller!');
            }
        });
    })();
}

loadScript('js/joyEngine.js');