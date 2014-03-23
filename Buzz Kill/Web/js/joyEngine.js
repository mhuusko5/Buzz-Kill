var characterImages = {};
(function loadImages() {
    var characterImageNames = [
        'healthPowerupToken',
        'healthPowerupExplosion',
        'honeyBee',
        'honeyBeeExplode',
        'queenBee',
        'queenBeeExplode',
        'wasp',
        'waspExplode',
        'workerBee',
        'workerBeeExplode',
        'uberDrone',
        'uberDrone2',
        'uberDroneShot',
        'turret',
        'turretDying',
        'turretDyingBonus',
        'turretBonus',
        'turretShot'
    ];
    for (var i = 0; i < characterImageNames.length; i++) {
        var newImage = new Image();
        var characterImageName = characterImageNames[i];
        newImage.src = 'img/character/' + characterImageName + '.png';
        characterImages[characterImageName] = newImage;
    }
})();

var engine = new Joy.Engine({
    debug: false,
    canvas: gameCanvas[0]
});

engine.setSceneLoader(function (scene) {
});

var engineCenter = {x: engine.width / 2, y: engine.height / 2};
var engineDiagonal = Math.sqrt(Math.pow(engine.width, 2) + Math.pow(engine.height, 2));
var engineUpdateTime = 1000 / 60;
var engineCollisionOffset = engineDiagonal / 40;

Joy.Behaviour.define('bee', {
    desiredHeight: 0.084 * engine.height,
    desiredWidth: 0.06 * engine.height,
    centerBarrierRadius: engine.height / 2.8,
    movementAccuracy: 900,
    jittersDuringWait: 16,
    jitterDegree: 30.0,
    pauseTillDie: 250,
    startedExit: false,
    timers: null,
    moving: false,
    timeAlive: 0,
    alive: true,
    player: null,
    containingArray: null,
    hitsTillDeath: null,
    gotHitAction: null,
    extendedUpdate: null,
    diedAction: null,
    pathEndAction: null,
    pathEndTimer: null,
    removeFromAll: function () {
        this.scene.removeChild(this);
        this.containingArray.splice(this.containingArray.indexOf(this), 1);
        for (var tim in this.timers) {
            if (this.timers[tim]) {
                this.timers[tim].stop();
            }
        }
    },
    randomPosition: function () {
        var position = {
            x: Math.random() * engine.width,
            y: Math.random() * engine.height
        };

        if (position.x > (engine.width - this._height)) {
            position.x -= this._height;
        } else if (position.x < this._height) {
            position.x += this._height;
        }

        if (position.y > (engine.height - this._height)) {
            position.y -= this._height;
        } else if (position.y < this._height) {
            position.y += this._height;
        }

        return position;
    },
    newPosition: function () {
        var position;
        while (pointDistance((position = this.randomPosition()), engineCenter) < this.centerBarrierRadius ||
            (Math.abs(position.y - this.position.y) > engine.height / 2.2 && Math.abs(position.x - this.position.x) > engine.width / 2.2)) {
        }
        return position;
    },
    createStraightPath: function (endPosition, portionOfBaseSpeed) {
        this.currentPath = {
            speedAdjust: portionOfBaseSpeed * engineDiagonal,
            time: 0.0,
            points: {}
        };

        var direction = {
            x: endPosition.x - this.position.x,
            y: endPosition.y - this.position.y
        };


        var newLength = Math.sqrt(direction.x * direction.x + direction.y * direction.y) / this.movementAccuracy;
        direction = scaleVector(direction, newLength);

        var lastPoint = {
            x: this.position.x,
            y: this.position.y
        };
        for (var t = 0.0; t <= 1; t += (1 / this.movementAccuracy)) {
            lastPoint.x += direction.x;
            lastPoint.y += direction.y;

            this.currentPath.points[Math.round(t * this.movementAccuracy) / this.movementAccuracy] = {
                x: lastPoint.x,
                y: lastPoint.y
            }
        }

        this.moving = true;
    },
    createNewPath: function (endPosition) {
        this.currentPath = {
            speedAdjust: (Math.random() + 0.5) * (1 / pointDistance(endPosition, this.position)) * engineDiagonal,
            time: 0.0,
            points: {}
        };

        var bezierPointX = (Math.random() + 0.5) * (engine.width / 2);
        var bezierPoint = {
            x: bezierPointX,
            y: (Math.random() + 0.5) * bezierPointX
        };

        for (var t = 0.0; t <= 1; t += (1 / this.movementAccuracy)) {
            this.currentPath.points[Math.round(t * this.movementAccuracy) / this.movementAccuracy] = {
                x: ((1 - t) * (1 - t) * this.position.x + 2 * (1 - t) * t * bezierPoint.x + t * t * endPosition.x),
                y: ((1 - t) * (1 - t) * this.position.y + 2 * (1 - t) * t * bezierPoint.y + t * t * endPosition.y)
            };
        }

        this.moving = true;
    },
    updatePosition: function (pathTime) {
        var nextPoint = this.currentPath.points[pathTime];

        if (nextPoint) {
            var pointing = {
                x: nextPoint.x - this.position.x,
                y: nextPoint.y - this.position.y
            };

            var rotation = Math.atan2(pointing.y, pointing.x) * (180.0 / Math.PI);
            if (Math.abs(rotation) > 1) {
                this.rotation = rotation + 90.0;
            }

            this.position = nextPoint;
        }
    },
    jitterInPlace: function (delay, totalTime) {
        var jitterDirection = 1;
        var jitterTime = totalTime / this.jittersDuringWait;

        var self = this;
        for (var i = 0; i < this.jittersDuringWait; i++) {
            this.timers.push($.timeout(delay + i * jitterTime, function () {
                new Joy.Tween(self).to({rotation: self.rotation + (jitterDirection *= -1) * self.jitterDegree}, jitterTime).start();
            }));
        }
    },
    finishedPath: function () {
        this.moving = false;

        var waitTime = this.baseWaitTime * (0.5 * Math.random() + 1);

        new Joy.Tween(this).to({rotation: this.rotation + 180.0}, waitTime / 5).start();
        this.jitterInPlace(waitTime / 4, (3 / 4) * waitTime);

        var self = this;
        this.pathEndTimer = $.timeout(waitTime, function () {
            self.pathEndAction();
        });
        this.timers.push(this.pathEndTimer);
    },
    scaleToDesiredSize: function () {
        this.setScale(this.desiredWidth / this._width, this.desiredHeight / this._height);
    },
    setDesiredWidth: function (newWidth) {
        this.desiredWidth = newWidth;
        this.scaleToDesiredSize();
    },
    setDesiredHeight: function (newHeight) {
        this.desiredHeight = newHeight;
        this.scaleToDesiredSize();
    },
    delayedInit: function () {
        this.createNewPath(this.randomPosition());

        this.pathEndAction = function () {
            this.createNewPath(this.newPosition());
        }
    },
    INIT: function () {
        this.timers = [];

        this.position = this.randomPosition();
        this.position.x += (Math.random() > 0.5 ? -1 : 1) * engine.width;
        this.position.y += (Math.random() > 0.5 ? -1 : 1) * engine.height;

        this.scaleToDesiredSize();

        this.pivot = {
            x: this._height / 2,
            y: this._width / 2
        }
    },
    UPDATE: function () {
        if (this.player.playing && this.alive) {
            var adjustedEngineUpdateTime = (this.player.usedBomb ? 2 : 1) * (this.player.beingSneaky ? 3 : 1) * engineUpdateTime;

            this.timeAlive += adjustedEngineUpdateTime;

            for (var i = 0; i < this.player.onscreenShots.length; i++) {
                var shot = this.player.onscreenShots[i];
                if (this.timeAlive > 2000 && shot && pointDistance(this.position, shot.position) < engineCollisionOffset && !shot.hurtsPlayer && (!this.player.beingSneaky || (Math.random() > 0.5 && Math.random() < 0.5 && Math.random() > 0.5 && Math.random() < 0.5 && Math.random() > 0.5))) {
                    this.player.shotsHit++;
                    this.gotHitAction();

                    var beeHitBool = (Math.random() > 0.5);
                    playGameplaySound('beeTakingHit' + (beeHitBool ? 0 : 1), false, (beeHitBool ? 0.5 : 0.7));

                    shot.removeFromAll();

                    if (--this.hitsTillDeath <= 0) {
                        this.player.kills++;
                        this.diedAction(true);
                        return;
                    }
                    break;
                }
            }

            if (this.player.usingForcefield) {
                var distanceWithinForcefield = this.player.forceFieldRadius - pointDistance(this.position, engineCenter);
                if (distanceWithinForcefield > engineCollisionOffset) {
                    this.diedAction(true);
                    return;
                } else if (distanceWithinForcefield > 0) {
                    this.timeAlive -= adjustedEngineUpdateTime;
                    return;
                }
            }

            if (this.moving) {
                this.currentPath.time += ((adjustedEngineUpdateTime / 1000) * (this.player.usingSmoke ? 0.05 : 1.0));

                var adjustedPathTime = Math.round(this.baseSpeed * this.currentPath.speedAdjust * this.currentPath.time * this.movementAccuracy) / this.movementAccuracy;

                if (adjustedPathTime >= 1.0) {
                    this.finishedPath();
                } else {
                    this.updatePosition(adjustedPathTime);
                    this.extendedUpdate();
                }
            }
        } else if (this.player.allowingExit && this.alive) {
            if (!this.startedExit) {
                this.startedExit = true;

                for (var tim in this.timers) {
                    if (this.timers[tim]) {
                        this.timers[tim].stop();
                    }
                }

                var offscreenPosition = {x: this.position.x, y: (Math.random() + 0.2) * engine.height};
                offscreenPosition.x += (offscreenPosition.x > (engine.width / 2) ? 1 : -1) * (engine.width / 2) * 1.5;
                this.createNewPath(offscreenPosition);
            }

            this.currentPath.time += engineUpdateTime / 1000;

            var adjustedPathTime = Math.round(this.baseSpeed * this.currentPath.speedAdjust * 5 * this.currentPath.time * this.movementAccuracy) / this.movementAccuracy;

            if (adjustedPathTime >= 1.0) {
                this.alive = false;
            } else {
                this.updatePosition(adjustedPathTime);
            }
        }
    }
});

Joy.Behaviour.define('shot', {
    _width: engineDiagonal / 35,
    _height: engineDiagonal / 31,
    vector: null,
    timeSinceBounce: 0,
    bounceNum: 1,
    timers: null,
    alive: true,
    player: null,
    extendedUpdate: null,
    INIT: function () {
        this.timers = [];

        this.pivot = {
            x: this._width / 2,
            y: this._height / 2
        };
    },
    removeFromAll: function () {
        this.alive = false;
        this.scene.removeChild(this);
        this.player.onscreenShots.splice(this.player.onscreenShots.indexOf(this), 1);
    },
    UPDATE: function () {
        if (this.player.playing && this.alive) {
            this.position.x += (engineUpdateTime / 1000) * (this.vector.speed * this.vector.x * engineDiagonal);
            this.position.y += (engineUpdateTime / 1000) * (this.vector.speed * this.vector.y * engineDiagonal);

            this.rotation = Math.atan2(this.vector.y, this.vector.x) * (180.0 / Math.PI) + 90.0;

            var hitWall = false;
            var wall = null;
            if (this.position.x > engine.width - this._width / 2 || this.position.x < 0 + this._width / 2) {
                hitWall = true;
                wall = 'x';
            } else if (this.position.y > engine.height - this._height / 2 || this.position.y < 0 + this._height / 2) {
                hitWall = true;
                wall = 'y';
            }

            if (hitWall) {
                if (this.bounceNum-- <= 0) {
                    if (this.timeSinceBounce > 800) {
                        this.removeFromAll();
                    } else {
                        this.timeSinceBounce += engineUpdateTime;
                    }
                } else {
                    this.vector[wall] *= -1;

                    playGameplaySound('bulletBounce' + (Math.random() > 0.5 ? 0 : 1), false, 0.9);
                }
            }

            this.extendedUpdate();
        }
    }
});

Joy.Behaviour.define('turret', {
    _width: engine.height * 0.264,
    _height: engine.height * 0.264,
    readyToShoot: true,
    waitBetweenShots: 190,
    semiShootAtATime: 6,
    baseShotSpeed: 1.0,
    sneakyRotation: 0,
    timeSinceSneakRotationCheck: 0,
    currentlyDying: false,
    gotHitAction: null,
    startedExit: false,
    timers: null,
    player: null,
    removeFromAll: function () {
        this.scene.removeChild(this);
        for (var tim in this.timers) {
            if (this.timers[tim]) {
                this.timers[tim].stop();
            }
        }
    },
    INIT: function () {
        this.timers = [];

        this.pivot = {
            x: this._width / 2,
            y: this._height / 2
        };
    },
    updateImage: function (dying) {
        switch(this.player.bonusesAchieved) {
            case 1:
                if (dying) {
                    this.image = characterImages['turretDyingBonus'];
                } else if (!dying) {
                    this.image = characterImages['turretBonus'];
                }
                break;
            default:
                if (dying) {
                    this.image = characterImages['turretDying'];
                } else if (!dying) {
                    this.image = characterImages['turret'];
                }
                break;
        }
    },
    updateDirection: function (point) {
        var pointing = {
            x: point.x - this.position.x,
            y: point.y - this.position.y
        };

        var newRotation = Math.atan2(pointing.y, pointing.x) * (180.0 / Math.PI) + 90.0;

        this.sneakyRotation += Math.abs((newRotation - this.sneakyRotation));

        this.rotation = newRotation;
    },
    sendSingleShot: function (angle, shift) {
        var shotVector = {
            x: Math.cos((this.rotation + angle - 90.0) * (Math.PI / 180.0)),
            y: Math.sin((this.rotation + angle - 90.0) * (Math.PI / 180.0)),
            speed: this.baseShotSpeed
        };

        var turretHorizontalAxis = {
            x: Math.cos(this.rotation * (Math.PI / 180.0)),
            y: Math.sin(this.rotation * (Math.PI / 180.0))
        }

        var newShot = createTurretShot({
            x: this.position.x + shift * turretHorizontalAxis.x,
            y: this.position.y + shift * turretHorizontalAxis.y
        }, shotVector, this.player);

        this.player.onscreenShots.push(newShot);

        this.scene.addChild(newShot);
    },
    sendDoubleShot: function (angle) {
        this.sendSingleShot(-angle, 0);
        this.sendSingleShot(angle, 0);
    },
    sendSpecialShot: function (double, angle) {
        if (double) {
            this.sendSingleShot(-angle, -this._width / 10);
            this.sendSingleShot(-angle, this._width / 10);
            this.sendSingleShot(angle, -this._width / 10);
            this.sendSingleShot(angle, this._width / 10);
        } else {
            this.sendSingleShot(0, -this._width / 10);
            this.sendSingleShot(0, this._width / 10);
        }
    },
    sendShots: function () {
        this.player.shotsFired++;

        if (this.player.specialShoot || this.player.bonusesAchieved > 0) {
            if (this.player.doubleShoot) {
                this.sendSpecialShot(true, 14);
            } else {
                this.sendSpecialShot(false, 0);
            }
        } else if (this.player.doubleShoot) {
            this.sendDoubleShot(5);
        } else {
            this.sendSingleShot(0, 0);
        }
    },
    userShoot: function () {
        if (gameOptions.shootingMethod == 'single') {
            if (this.readyToShoot) {
                this.readyToShoot = false;

                this.sendShots();

                var self = this;
                this.timers.push($.timeout(this.waitBetweenShots, function () {
                    self.readyToShoot = true;
                }));
            }
        } else if (gameOptions.shootingMethod == 'semi') {
            if (this.readyToShoot) {
                this.readyToShoot = false;

                var self = this;
                var semiShotsShot = 0;
                for (var i = 0; i < this.semiShootAtATime; i++) {
                    this.timers.push($.timeout((this.waitBetweenShots + 60) * i, function () {
                        self.sendShots();

                        if (++semiShotsShot == self.semiShootAtATime) {
                            self.timers.push($.timeout(this.waitBetweenShots + 100, function () {
                                self.readyToShoot = true;
                            }));
                        }
                    }));
                }
            }
        }
    },
    autoShoot: function () {
        if (gameOptions.shootingMethod == 'auto') {
            if (this.readyToShoot) {
                this.readyToShoot = false;

                this.sendShots();

                var self = this;
                this.timers.push($.timeout((this.waitBetweenShots + 160), function () {
                    self.readyToShoot = true;
                }));
            }
        }
    },
    UPDATE: function () {
        if (this.player.playing) {
            this.player.timePlaying += engineUpdateTime;

            if ((this.timeSinceSneakRotationCheck += engineUpdateTime) >= 2000) {
                if (this.sneakyRotation < 18) {
                    this.player.beingSneaky = true;
                } else {
                    this.player.beingSneaky = false;
                }

                this.timeSinceSneakRotationCheck = 0;
                this.sneakyRotation = 0;
            } else if (this.sneakyRotation > 18) {
                this.player.beingSneaky = false;
            }

            for (var i = 0; i < this.player.onscreenShots.length; i++) {
                var shot = this.player.onscreenShots[i];
                if (shot && pointDistance(this.position, shot.position) < engineCollisionOffset && shot.hurtsPlayer) {
                    shot.removeFromAll();

                    this.gotHitAction();
                    break;
                }
            }

            this.autoShoot();
        } else if (this.player.allowingExit) {
            if (!this.startedExit) {
                this.startedExit = true;
                var self = this;
                this.timers.push($.timeout(2800, function () {
                    if (!self.player.turretShouldFadeNotZoom) {
                        playGameplaySound('turretDeath', false, 1.0);
                        playGameplaySound('turretLevelEndZoomUp', false, 1.0);
                        new Joy.Tween(self.scale).to({x: 120, y: 120}, 3000).easing(Joy.TweenManager.Easing.Linear.None).start();
                    }
                    new Joy.Tween(self).to({alpha: 0}, 3000).onComplete(function () {
                        self.player.readyToFinishLevel = true;
                    }).easing(Joy.TweenManager.Easing.Linear.None).start();
                }));
            }
        }
    }
});

Joy.Behaviour.define('powerup', {
    desiredHeight: 0.082 * engine.height,
    desiredWidth: 0.082 * engine.height,
    timeTillLeave: 0,
    timeAlive: 0,
    timers: null,
    containingArray: null,
    gotHitAction: null,
    extendedUpdate: null,
    hitsTillDestroy: null,
    destroyedAction: null,
    gainPowerup: null,
    alive: true,
    player: null,
    vector: null,
    removeFromAll: function () {
        this.alive = false;
        this.scene.removeChild(this);
        this.containingArray.splice(this.containingArray.indexOf(this), 1);
        for (var tim in this.timers) {
            if (this.timers[tim]) {
                this.timers[tim].stop();
            }
        }

        stopGameplaySound('healthPowerupMoving');
    },
    randomPosition: function () {
        var position = {
            x: Math.random() * engine.width,
            y: Math.random() * engine.height
        };

        if (position.x > (engine.width - this._height)) {
            position.x -= this._height;
        } else if (position.x < this._height) {
            position.x += this._height;
        }

        if (position.y > (engine.height - this._height)) {
            position.y -= this._height;
        } else if (position.y < this._height) {
            position.y += this._height;
        }

        return position;
    },
    scaleToDesiredSize: function () {
        this.setScale(this.desiredWidth / this._width, this.desiredHeight / this._height);
    },
    setDesiredWidth: function (newWidth) {
        this.desiredWidth = newWidth;
        this.scaleToDesiredSize();
    },
    setDesiredHeight: function (newHeight) {
        this.desiredHeight = newHeight;
        this.scaleToDesiredSize();
    },
    delayedInit: function () {

    },
    INIT: function () {
        this.timers = [];

        this.position = this.randomPosition();

        this.scaleToDesiredSize();

        this.pivot = {
            x: this._height / 2,
            y: this._width / 2
        }
    },
    UPDATE: function () {
        if (this.player.playing && this.alive) {
            this.timeAlive += engineUpdateTime;

            this.position.x += (engineUpdateTime / 1000) * (this.vector.speed * this.vector.x * engineDiagonal);
            this.position.y += (engineUpdateTime / 1000) * (this.vector.speed * this.vector.y * engineDiagonal);

            for (var i = 0; i < this.player.onscreenShots.length; i++) {
                var shot = this.player.onscreenShots[i];
                if (shot && pointDistance(this.position, shot.position) < engineCollisionOffset && !shot.hurtsPlayer) {
                    this.player.shotsHit++;

                    shot.removeFromAll();
                    this.gotHitAction();

                    if (--this.hitsTillDestroy <= 0) {
                        this.destroyedAction();
                        return;
                    }
                    break;
                }
            }

            var hitWall = false;
            var wall = null;
            if (this.position.x > engine.width - this._width / 1.2 || this.position.x < 0 + this._width / 1.2) {
                hitWall = true;
                wall = 'x';
            } else if (this.position.y > engine.height - this._height / 1.2 || this.position.y < 0 + this._height / 1.2) {
                hitWall = true;
                wall = 'y';
            }

            if (hitWall) {
                if (this.timeAlive < this.timeTillLeave) {
                    this.vector[wall] *= -1;

                    playGameplaySound('healthPowerupBounce', false, 0.9);
                } else {
                    this.removeFromAll();
                    return;
                }
            }

            this.extendedUpdate();
        }
    }
});

function createHoneyBee(containingArray, honeyBeeLeaveGroup, honeyBeeIndex, getPoints, player) {
    var honeyBeeBaseWaitTime = 800;
    var honeyBeeBaseSpeed = 0.12;
    var honeyBeeBaseLeaveTime = 10000;
    var honeyBeePointsValue = 2500;
    var honeyBeeLookHitTime = 150;

    var honeyBee = new Joy.SpriteSheet({
        src: characterImages['honeyBee'].src,
        width: 50,
        height: 70,
        animations: {
            'flying': [0, 1],
            'hit': [2, 2]
        },
        framesPerSecond: 14
    }).behave('bee');

    honeyBee.player = player;
    honeyBee.getPoints = getPoints;
    honeyBee.baseWaitTime = honeyBeeBaseWaitTime;
    honeyBee.baseSpeed = honeyBeeBaseSpeed;
    honeyBee.timeTillLeaveGame = ((honeyBeeIndex % honeyBeeLeaveGroup) + 1) * honeyBeeBaseLeaveTime;
    honeyBee.containingArray = containingArray;
    honeyBee.hitsTillDeath = 1;
    honeyBee.beforeHitAnimation = 'flying';
    honeyBee.endHitTimer = null;

    honeyBee.gotHitAction = function () {
        if (this.endHitTimer) {
            this.endHitTimer.stop();
        }

        if (this.currentAnimationName != 'hit') {
            this.beforeHitAnimation = this.currentAnimationName;
        }

        this.play('hit');
        var self = this;
        this.endHitTimer = $.timeout(honeyBeeLookHitTime, function () {
            self.play(self.beforeHitAnimation);
        });
        this.timers.push(this.endHitTimer);
    };

    honeyBee.diedAction = function (gainPoints) {
        this.alive = false;
        if (gainPoints) {
            this.getPoints(honeyBeePointsValue);
        }

        var self = this;
        this.timers.push($.timeout(this.pauseTillDie / 2.0, function () {
            self._width = 100;
            self._height = 100;
            self.pivot = {
                x: self._width / 2,
                y: self._height / 2
            };
            self.image = characterImages['honeyBeeExplode'];
            self.addAnimation('explode', [0, 0]);
            self.play('explode');

            playGameplaySound('smallBlast', false, 0.8);

            self.timers.push($.timeout(self.pauseTillDie, function () {
                self.removeFromAll();
            }));
        }));
    };

    honeyBee.leavingGame = false;
    honeyBee.extendedUpdate = function () {
        if (!this.leavingGame && this.timeAlive > this.timeTillLeaveGame) {
            this.leavingGame = true;

            this.moving = false;
            this.createStraightPath({x: engine.width / 2, y: -engine.height / 4}, 0.0007);
            this.pathEndAction = function () {
                this.alive = false;
                this.removeFromAll();
            };
        }
    };

    honeyBee.delayedInit();

    containingArray.push(honeyBee);
    honeyBee.play('flying');

    return honeyBee;
}

function createQueenBee(containingArray, getPoints, player) {
    var queenBeeBaseWaitTime = 400;
    var queenBeeBaseSpeed = 0.14;
    var queenBeeBaseLeaveTime = 14000;
    var queenBeePointsValue = 50000;
    var queenBeeHitsTillDeath = 6;
    var queenBeeLookHitTime = 180;
    var queenBeeLargerThanHoneyBee = 1.5;

    var queenBee = new Joy.SpriteSheet({
        src: characterImages['queenBee'].src,
        width: 82,
        height: 129,
        animations: {
            'flying': [0, 1],
            'hit': [2, 2]
        },
        framesPerSecond: 2
    }).behave('bee');

    queenBee.player = player;
    queenBee.getPoints = getPoints;
    queenBee.baseWaitTime = queenBeeBaseWaitTime;
    queenBee.baseSpeed = queenBeeBaseSpeed;
    queenBee.timeTillLeaveGame = queenBeeBaseLeaveTime;
    queenBee.containingArray = containingArray;
    queenBee.hitsTillDeath = queenBeeHitsTillDeath;
    queenBee.beforeHitAnimation = 'flying';
    queenBee.endHitTimer = null;

    queenBee.gotHitAction = function () {
        if (this.endHitTimer) {
            this.endHitTimer.stop();
        }

        if (this.currentAnimationName != 'hit') {
            this.beforeHitAnimation = this.currentAnimationName;
        }

        this.play('hit');
        var self = this;
        this.endHitTimer = $.timeout(queenBeeLookHitTime, function () {
            self.play(self.beforeHitAnimation);
        });
        this.timers.push(this.endHitTimer);
    };

    queenBee.diedAction = function (gainPoints) {
        this.alive = false;
        if (gainPoints) {
            this.getPoints(queenBeePointsValue);
        }

        var self = this;
        this.timers.push($.timeout(this.pauseTillDie / 2.0, function () {
            self._width = 354;
            self._height = 354;
            self.pivot = {
                x: self._width / 2,
                y: self._height / 2
            };
            self.image = characterImages['queenBeeExplode'];
            self.addAnimation('explode', [0, 0]);
            self.play('explode');

            playGameplaySound('largeBlast', false, 1.0);

            self.timers.push($.timeout(self.pauseTillDie, function () {
                self.removeFromAll();
            }));
        }));
    };

    queenBee.leavingGame = false;
    queenBee.extendedUpdate = function () {
        if (!this.leavingGame && this.timeAlive > this.timeTillLeaveGame) {
            this.leavingGame = false;

            this.moving = false;
            this.createStraightPath({x: engine.width / 2, y: -engine.height / 4}, 0.0007);
            this.pathEndAction = function () {
                this.alive = false;
                this.removeFromAll();
            };
        }
    };

    queenBee.delayedInit();

    containingArray.push(queenBee);
    queenBee.play('flying');

    queenBee.setDesiredHeight(queenBee.desiredHeight * queenBeeLargerThanHoneyBee);
    queenBee.setDesiredWidth(queenBee.desiredWidth * queenBeeLargerThanHoneyBee);

    return queenBee;
}

function createWasp(containingArray, getPoints, losePoints, player) {
    var waspBaseWaitTime = 500;
    var waspBaseSpeed = 0.15;
    var waspBaseAttackTime = 11000;
    var waspPointsValue = 50000;
    var waspLosePointsValue = 10000;
    var waspLookHitTime = 180;
    var waspHitsTillDeath = 12;
    var waspLargerThanHoneyBee = 1.26;
    var waspAttackStopRadius = engine.height / 8;

    var wasp = new Joy.SpriteSheet({
        src: characterImages['wasp'].src,
        width: 86,
        height: 112,
        animations: {
            'flying': [0, 2],
            'attacking': [3, 5],
            'hit': [6, 6]
        },
        framesPerSecond: 14
    }).behave('bee');

    wasp.player = player;
    wasp.lostPoints = losePoints;
    wasp.getPoints = getPoints;
    wasp.baseWaitTime = waspBaseWaitTime;
    wasp.baseSpeed = waspBaseSpeed;
    wasp.timeTillAttack = waspBaseAttackTime;
    wasp.containingArray = containingArray;
    wasp.hitsTillDeath = waspHitsTillDeath;
    wasp.beforeHitAnimation = 'flying';
    wasp.endHitTimer = null;

    wasp.gotHitAction = function () {
        if (this.endHitTimer) {
            this.endHitTimer.stop();
        }

        if (this.currentAnimationName != 'hit') {
            this.beforeHitAnimation = this.currentAnimationName;
        }

        this.play('hit');
        var self = this;
        this.endHitTimer = $.timeout(waspLookHitTime, function () {
            self.play(self.beforeHitAnimation);
        });
        this.timers.push(this.endHitTimer);
    };

    wasp.diedAction = function (gainPoints) {
        this.alive = false;
        if (gainPoints) {
            this.getPoints(waspPointsValue);

            this.player.bossKills++;
        }

        var self = this;
        this.timers.push($.timeout(this.pauseTillDie / 2.0, function () {
            self._width = 354;
            self._height = 354;
            self.pivot = {
                x: self._width / 2,
                y: self._height / 2
            };
            self.image = characterImages['waspExplode'];
            self.addAnimation('explode', [0, 0]);
            self.play('explode');

            playGameplaySound('largeBlast', false, 1.0);

            self.timers.push($.timeout(self.pauseTillDie, function () {
                self.removeFromAll();
            }));
        }));
    };

    wasp.attacking = false;
    wasp.extendedUpdate = function () {
        if (!this.attacking && this.timeAlive > this.timeTillAttack && pointDistance(engineCenter, this.position) > 1.6 * waspAttackStopRadius) {
            this.attacking = true;
            this.play('attacking');

            this.moving = false;
            var stopVector = {x: engineCenter.x - this.position.x, y: engineCenter.y - this.position.y};
            stopVector = scaleVector(stopVector, Math.sqrt(stopVector.x * stopVector.x + stopVector.y * stopVector.y) - waspAttackStopRadius);
            this.createStraightPath({x: this.position.x + stopVector.x, y: this.position.y + stopVector.y}, 0.0007);
            this.pathEndAction = function () {
                this.createNewPath(engineCenter);
                this.pathEndAction = function () {
                    this.lostPoints(waspLosePointsValue);

                    playGameplaySound('beeAttack', false, 0.7);

                    this.timeAlive = 0;
                    this.play('flying');
                    this.createNewPath(this.newPosition());
                    this.pathEndAction = function () {
                        this.createNewPath(this.newPosition());
                    };
                    this.attacking = false;
                    this.play('flying');
                }
            };
        }
    };

    wasp.delayedInit();

    containingArray.push(wasp);
    wasp.play('flying');

    wasp.setDesiredHeight(wasp.desiredHeight * waspLargerThanHoneyBee);
    wasp.setDesiredWidth(wasp.desiredWidth * waspLargerThanHoneyBee);

    return wasp;
}

var uberDroneImageAlt = 1;
function createUberDrone(containingArray, getPoints, player) {
    var uberDroneBaseWaitTime = 500;
    var uberDroneBaseSpeed = 0.15
    var uberDroneBaseAttackTime = 10000;
    var uberDronePointsValue = 100000;
    var uberDroneLookHitTime = 180;
    var uberDroneHitsTillDeath = 20;
    var uberDroneLargerThanHoneyBee = 2.0;
    var uberDroneAttackStopRadius = engine.height / 8;
    var uberDroneBaseShotSpeed = 0.4;
    var uberDroneBaseShotWaitTime = 3000;

    var uberDroneImage = player.alternatingEnemyImages ? ((uberDroneImageAlt *= -1) == -1 ? 'uberDrone' : 'uberDrone2') : 'uberDrone';

    var uberDrone = new Joy.SpriteSheet({
        src: characterImages[uberDroneImage].src,
        width: 191,
        height: 191,
        animations: {
            'flying': [0, 1],
            'attacking': [0, 1],
            'hit': [0, 1]
        },
        framesPerSecond: 14
    }).behave('bee');

    uberDrone.player = player;
    uberDrone.getPoints = getPoints;
    uberDrone.baseWaitTime = uberDroneBaseWaitTime;
    uberDrone.baseSpeed = uberDroneBaseSpeed;
    uberDrone.timeTillAttack = uberDroneBaseAttackTime;
    uberDrone.containingArray = containingArray;
    uberDrone.hitsTillDeath = uberDroneHitsTillDeath;
    uberDrone.beforeHitAnimation = 'flying';
    uberDrone.endHitTimer = null;

    uberDrone.gotHitAction = function () {
        if (this.endHitTimer) {
            this.endHitTimer.stop();
        }

        if (this.currentAnimationName != 'hit') {
            this.beforeHitAnimation = this.currentAnimationName;
        }

        this.play('hit');
        var self = this;
        this.endHitTimer = $.timeout(uberDroneLookHitTime, function () {
            self.play(self.beforeHitAnimation);
        });
        this.timers.push(this.endHitTimer);

        playGameplaySound('uberBossTakingHit' + (Math.random() > 0.5 ? 0 : 1), false, 0.7);
    };

    uberDrone.diedAction = function (gainPoints) {
        this.alive = false;
        if (gainPoints) {
            this.getPoints(uberDronePointsValue);

            this.player.bossKills++;
        }

        var self = this;
        this.timers.push($.timeout(this.pauseTillDie / 2.0, function () {
            self.setScale(0.8, 0.8);

            self._width = 354;
            self._height = 354;
            self.pivot = {
                x: self._width / 2,
                y: self._height / 2
            };
            self.image = characterImages['waspExplode'];
            self.addAnimation('explode', [0, 0]);
            self.play('explode');

            playGameplaySound('largeBlast', false, 1.0);

            self.timers.push($.timeout(self.pauseTillDie, function () {
                self.removeFromAll();
            }));
        }));
    };

    uberDrone.baseShotWaitTime = uberDroneBaseShotWaitTime;
    uberDrone.baseShotSpeed = uberDroneBaseShotSpeed;
    uberDrone.attacking = false;
    uberDrone.extendedUpdate = function () {
        if (!this.attacking && this.timeAlive > this.timeTillAttack && pointDistance(engineCenter, this.position) > 1.6 * uberDroneAttackStopRadius) {
            this.attacking = true;
            this.play('attacking');

            var self = this;

            function shoot() {
                var shotVector = {
                    x: Math.cos((self.rotation - 90.0) * (Math.PI / 180.0)),
                    y: Math.sin((self.rotation - 90.0) * (Math.PI / 180.0)),
                    speed: self.baseShotSpeed
                };

                var newShot = createEnemyShot(self.position, shotVector, self.player);

                self.player.onscreenShots.push(newShot);

                self.scene.addChild(newShot);

                self.timers.push($.timeout(self.baseShotWaitTime, function () {
                    shoot();
                }));
            }

            shoot();
        }
    };

    uberDrone.delayedInit();

    containingArray.push(uberDrone);
    uberDrone.play('flying');

    uberDrone.setDesiredHeight(uberDrone.desiredHeight * uberDroneLargerThanHoneyBee);
    uberDrone.setDesiredWidth(uberDrone.desiredWidth * uberDroneLargerThanHoneyBee * 2.1);

    return uberDrone;
}

function createWorkerBee(containingArray, workerBeeAttackGroup, workerBeeIndex, getPoints, losePoints, player) {
    var workerBeeBaseWaitTime = 700;
    var workerBeeBaseSpeed = 0.11;
    var workerBeeBaseAttackTime = 18000;
    var workerBeePointsValue = 5000;
    var workerBeeLosePointsValue = 7000;
    var workerBeeLookHitTime = 250;
    var workerBeeHitsTillDeath = 4;
    var workerBeeLargerThanHoneyBee = 1.24;
    var workerBeeAttackStopRadius = engine.height / 10;

    var workerBee = new Joy.SpriteSheet({
        src: characterImages['workerBee'].src,
        width: 120,
        height: 120,
        animations: {
            'flying': [0, 1],
            'attacking': [2, 3],
            'hit': [4, 5]
        },
        framesPerSecond: 14
    }).behave('bee');

    workerBee.player = player;
    workerBee.lostPoints = losePoints;
    workerBee.getPoints = getPoints;
    workerBee.baseWaitTime = workerBeeBaseWaitTime;
    workerBee.baseSpeed = workerBeeBaseSpeed;
    workerBee.timeTillAttack = ((workerBeeIndex % workerBeeAttackGroup) + 1) * workerBeeBaseAttackTime;
    workerBee.containingArray = containingArray;
    workerBee.hitsTillDeath = workerBeeHitsTillDeath;
    workerBee.beforeHitAnimation = 'flying';
    workerBee.endHitTimer = null;

    workerBee.gotHitAction = function () {
        if (this.endHitTimer) {
            this.endHitTimer.stop();
        }

        if (this.currentAnimationName != 'hit') {
            this.beforeHitAnimation = this.currentAnimationName;
        }

        this.play('hit');
        var self = this;
        this.endHitTimer = $.timeout(workerBeeLookHitTime, function () {
            self.play(self.beforeHitAnimation);
        });
        this.timers.push(this.endHitTimer);
    };

    workerBee.diedAction = function (gainPoints) {
        this.alive = false;
        if (gainPoints) {
            this.getPoints(workerBeePointsValue);
        }

        var self = this;
        this.timers.push($.timeout(this.pauseTillDie / 2.0, function () {
            self._width = 100;
            self._height = 100;
            self.pivot = {
                x: self._width / 2,
                y: self._height / 2
            };
            self.image = characterImages['workerBeeExplode'];
            self.addAnimation('explode', [0, 0]);
            self.play('explode');

            playGameplaySound('smallBlast', false, 1.0);

            self.timers.push($.timeout(self.pauseTillDie, function () {
                self.removeFromAll();
            }));
        }));
    };

    workerBee.attacking = false;
    workerBee.extendedUpdate = function () {
        if (!this.attacking && this.timeAlive > this.timeTillAttack && pointDistance(engineCenter, this.position) > 1.6 * workerBeeAttackStopRadius) {
            this.attacking = true;
            this.play('attacking');

            this.moving = false;
            var stopVector = {x: engineCenter.x - this.position.x, y: engineCenter.y - this.position.y};
            stopVector = scaleVector(stopVector, Math.sqrt(stopVector.x * stopVector.x + stopVector.y * stopVector.y) - workerBeeAttackStopRadius);
            this.createStraightPath({x: this.position.x + stopVector.x, y: this.position.y + stopVector.y}, 0.0005);
            this.pathEndAction = function () {
                this.createNewPath(engineCenter);
                this.pathEndAction = function () {
                    this.lostPoints(workerBeeLosePointsValue);

                    playGameplaySound('beeAttack', false, 0.7);

                    this.timeAlive = 0;
                    this.play('flying');
                    this.createNewPath(this.newPosition());
                    this.pathEndAction = function () {
                        this.createNewPath(this.newPosition());
                    };
                    this.attacking = false;
                    this.play('flying');
                }
            };
        }
    };

    workerBee.delayedInit();

    containingArray.push(workerBee);
    workerBee.play('flying');

    workerBee.setDesiredHeight(workerBee.desiredHeight * workerBeeLargerThanHoneyBee);
    workerBee.setDesiredWidth(workerBee.desiredWidth * workerBeeLargerThanHoneyBee * 1.4);

    return workerBee;
}

function createHealthPowerup(containingArray, gainPowerup, player) {
    var healthPowerupHitsTillDestroy = 1;
    var healthPowerupBaseSpeed = 0.4;
    var healthPowerupTimeTillLeave = 6000;

    var healthPowerupVector = {
        x: Math.cos(Math.random() * 360.0 * (Math.PI / 180.0)),
        y: Math.sin(Math.random() * 360.0 * (Math.PI / 180.0)),
        speed: healthPowerupBaseSpeed
    };

    var healthPowerup = new Joy.SpriteSheet({
        src: characterImages['healthPowerupToken'].src,
        width: 52,
        height: 52,
        animations: {
            'on': [0, 0],
            'off': [1, 1]
        },
        framesPerSecond: 14
    }).behave('powerup');

    healthPowerup.player = player;
    healthPowerup.vector = healthPowerupVector;
    healthPowerup.timeTillLeave = healthPowerupTimeTillLeave;
    healthPowerup.gainPowerup = gainPowerup;
    healthPowerup.containingArray = containingArray;
    healthPowerup.hitsTillDestroy = healthPowerupHitsTillDestroy;

    healthPowerup.gotHitAction = function () {

    };

    healthPowerup.destroyedAction = function () {
        this.alive = false;

        this.gainPowerup();

        this._width = 354;
        this._height = 354;
        this.pivot = {
            x: this._width / 2,
            y: this._height / 2
        };
        this.image = characterImages['healthPowerupExplosion'];
        this.setDesiredHeight(this.desiredHeight * 2.1);
        this.setDesiredWidth(this.desiredWidth * 2.0);
        this.addAnimation('explode', [0, 0]);
        this.play('explode');

        playGameplaySound('smallBlast', false, 1.0);

        var self = this;
        this.timers.push($.timeout(150, function () {
            self.removeFromAll();
        }));
    };

    healthPowerup.extendedUpdate = function () {

    };

    healthPowerup.delayedInit();

    healthPowerup.position = healthPowerup.randomPosition();

    containingArray.push(healthPowerup);
    healthPowerup.play('on');

    healthPowerup.setDesiredHeight(healthPowerup.desiredHeight);
    healthPowerup.setDesiredWidth(healthPowerup.desiredWidth);

    playGameplaySound('healthPowerupMoving', true, 0.7);

    return healthPowerup;
}

function createTurret(player, hit) {
    var turret = new Joy.Sprite({
        x: engine.width / 2,
        y: engine.height / 2,
        image: characterImages['turret']
    }).behave('turret');

    turret.gotHitAction = hit;
    turret.player = player;

    return turret;
}

function createTurretShot(position, vector, player) {
    var newShot = new Joy.Sprite({
        x: position.x,
        y: position.y,
        smooth: true,
        image: characterImages['turretShot']
    }).behave('shot');

    newShot.bounceNum = !player.cantRicochet ? 1 : 0;
    newShot.hurtsPlayer = false;
    newShot.player = player;
    newShot.vector = vector;

    newShot.extendedUpdate = function () {
    }

    playGameplaySound('shot', false, 0.9);

    return newShot;
}

function createEnemyShot(position, vector, player) {
    var newShot = new Joy.Sprite({
        x: position.x,
        y: position.y,
        smooth: true,
        image: characterImages['uberDroneShot']
    }).behave('shot');

    newShot.bounceNum = player.enemyInfiniteRicochet ? 1000 : 4;
    newShot.hurtsPlayer = true;
    newShot.player = player;
    newShot.vector = vector;

    newShot.extendedUpdate = function () {
        if (this.player.usingForcefield && pointDistance(this.position, engineCenter) < this.player.forceFieldRadius) {
            this.removeFromAll();
            return;
        }

        for (var i = 0; i < this.player.onscreenShots.length; i++) {
            var shot = this.player.onscreenShots[i];
            if (shot && pointDistance(this.position, shot.position) < engineCollisionOffset && !shot.hurtsPlayer) {
                this.alive = false;
                this._width = 100;
                this._height = 100;
                this.pivot = {
                    x: this._width / 2,
                    y: this._height / 2
                };
                this.image = characterImages['honeyBeeExplode'];
                var self = this;
                this.timers.push($.timeout(250, function () {
                    self.removeFromAll();
                }));

                playGameplaySound('smallBlast', false, 1.0);

                return;
            }
        }
    }

    playGameplaySound('shot', false, 0.9);

    return newShot;
}

loadScript('js/levelManager.js');