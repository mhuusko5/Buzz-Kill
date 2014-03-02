function level1(scene) {
    var levelProperties = currentLevelProperties;

    levelProperties.honeyBees = [];
    if (levelProperties.honeyBees) {
        levelProperties.honeyBeeSpeedAdjust = 1.0;
        levelProperties.honeyBeeTakeHitsModifier = 0;
        levelProperties.honeyBeePauseAdjust = 1.0;
        levelProperties.honeyBeesAtATime = 18;
        levelProperties.honeyBeeRowsToToggleGain = 2;
        levelProperties.honeyBeesLeaveAtATime = 2;
        levelProperties.honeyBeesEntryDelay = 0;
        levelProperties.honeyBeeLeaveTimeAdjust = 1.0;
    }

    levelProperties.wasps = [];
    if (levelProperties.wasps) {
        levelProperties.waspSpeedAdjust = 1.0;
        levelProperties.waspPauseAdjust = 1.0;
        levelProperties.waspsAtAtime = 1;
        levelProperties.waspRowsToToggleLose = 1;
        levelProperties.waspEntryInterval = 18000;
        levelProperties.waspAttackTimeAdjust = 1.0;
    }

    levelProperties.workerBees = [];
    if (levelProperties.workerBees) {
        levelProperties.workerBeeSpeedAdjust = 1.0;
        levelProperties.workerBeePauseAdjust = 1.0;
        levelProperties.workerBeesAtATime = 6;
        levelProperties.workerBeesAttackAtATime = 2;
        levelProperties.workerBeeEntryInterval = 14000;
        levelProperties.workerBeeAttackTimeAdjust = 1.0;
    }

    levelProperties.queenBees = [];
    if (levelProperties.queenBees) {
        levelProperties.queenBeeSpeedAdjust = 1.0;
        levelProperties.queenBeePauseAdjust = 1.0;
        levelProperties.queenBeeEntryInterval = 24000;
    }

    levelProperties.healthPowerups = [];
    if (levelProperties.healthPowerups) {
        levelProperties.healthPowerupEntryInterval = 20000;
        levelProperties.healthPowerupActivationTime = 8000;
    }

    levelProperties.canUseBomb = true;
    levelProperties.canUseForcefield = true;
    levelProperties.canUseSmoke = true;

    levelProperties.levelId = 1;

    levelProperties.timePar = 8000;

    levelProperties.scene = scene;

    baseLevel(levelProperties);
}

function level2(scene) {
    var levelProperties = currentLevelProperties;

    levelProperties.honeyBees = [];
    if (levelProperties.honeyBees) {
        levelProperties.honeyBeeSpeedAdjust = 1.2;
        levelProperties.honeyBeeTakeHitsModifier = 0;
        levelProperties.honeyBeePauseAdjust = 1.0;
        levelProperties.honeyBeesAtATime = 14;
        levelProperties.honeyBeeRowsToToggleGain = 2;
        levelProperties.honeyBeesLeaveAtATime = 2;
        levelProperties.honeyBeesEntryDelay = 0;
        levelProperties.honeyBeeLeaveTimeAdjust = 1.0;
    }

    levelProperties.wasps = [];
    if (levelProperties.wasps) {
        levelProperties.waspSpeedAdjust = 1.0;
        levelProperties.waspPauseAdjust = 1.0;
        levelProperties.waspsAtAtime = 1;
        levelProperties.waspRowsToToggleLose = 2;
        levelProperties.waspEntryInterval = 12000;
        levelProperties.waspAttackTimeAdjust = 1.2;
    }

    levelProperties.workerBees = [];
    if (levelProperties.workerBees) {
        levelProperties.workerBeeSpeedAdjust = 1.0;
        levelProperties.workerBeePauseAdjust = 1.0;
        levelProperties.workerBeesAtATime = 8;
        levelProperties.workerBeesAttackAtATime = 3;
        levelProperties.workerBeeEntryInterval = 10000;
        levelProperties.workerBeeAttackTimeAdjust = 1.0;
    }

    levelProperties.queenBees = [];
    if (levelProperties.queenBees) {
        levelProperties.queenBeeSpeedAdjust = 1.0;
        levelProperties.queenBeePauseAdjust = 1.0;
        levelProperties.queenBeeEntryInterval = 30000;
    }

    levelProperties.healthPowerups = [];
    if (levelProperties.healthPowerups) {
        levelProperties.healthPowerupEntryInterval = 30000;
        levelProperties.healthPowerupActivationTime = 10000;
    }

    levelProperties.canUseBomb = true;
    levelProperties.canUseForcefield = true;
    levelProperties.canUseSmoke = true;

    levelProperties.levelId = 2;

    levelProperties.timePar = 16000;

    levelProperties.scene = scene;

    baseLevel(levelProperties);
}

function level3(scene) {
    var levelProperties = currentLevelProperties;

    levelProperties.uberDrones = [];
    if (levelProperties.uberDrones) {
        levelProperties.uberDronesAtATime = 2;
        levelProperties.uberDroneSpeedAdjust = 1.0;
        levelProperties.uberDronePauseAdjust = 1.0;
        levelProperties.uberDroneRowsToToggleLose = 2;
        levelProperties.uberDroneRowsToToggleGain = 4;
        levelProperties.uberDroneEntryInterval = 10000;
        levelProperties.uberDroneEnterDelay = 0;
        levelProperties.uberDroneAttackTimeAdjust = 1.0;
    }

    levelProperties.healthPowerups = [];
    if (levelProperties.healthPowerups) {
        levelProperties.healthPowerupEntryInterval = 30000;
        levelProperties.healthPowerupActivationTime = 10000;
    }

    levelProperties.specialShoot = true;
    levelProperties.turretHitPointsLost = 1000;

    levelProperties.canUseBomb = true;
    levelProperties.canUseForcefield = true;
    levelProperties.canUseSmoke = true;

    levelProperties.levelId = 3;

    levelProperties.timePar = 26000;

    levelProperties.scene = scene;

    baseLevel(levelProperties);
}

function level4(scene) {
    var levelProperties = currentLevelProperties;

    levelProperties.workerBees = [];
    if (levelProperties.workerBees) {
        levelProperties.workerBeeSpeedAdjust = 1.0;
        levelProperties.workerBeePauseAdjust = 1.0;
        levelProperties.workerBeesAtATime = 20;
        levelProperties.workerBeesAttackAtATime = 2;
        levelProperties.workerBeeEntryInterval = 18000;
        levelProperties.workerBeeAttackTimeAdjust = 1000;
    }

    levelProperties.uberDrones = [];
    if (levelProperties.uberDrones) {
        levelProperties.uberDronesAtATime = 2;
        levelProperties.uberDroneSpeedAdjust = 2.0;
        levelProperties.uberDronePauseAdjust = 2.0;
        levelProperties.uberDroneRowsToToggleLose = 2;
        levelProperties.uberDroneRowsToToggleGain = 6;
        levelProperties.uberDroneEntryInterval = 14000;
        levelProperties.uberDroneEnterDelay = 0;
        levelProperties.uberDroneAttackTimeAdjust = 1.0;
    }

    levelProperties.healthPowerups = [];
    if (levelProperties.healthPowerups) {
        levelProperties.healthPowerupEntryInterval = 15000;
        levelProperties.healthPowerupActivationTime = 10000;
    }

    levelProperties.specialShoot = true;
    levelProperties.turretHitPointsLost = 2500;

    levelProperties.canUseBomb = true;
    levelProperties.canUseForcefield = true;
    levelProperties.canUseSmoke = true;

    levelProperties.levelId = 4;

    levelProperties.timePar = 32000;

    levelProperties.scene = scene;

    baseLevel(levelProperties);
}

function level5(scene) {
    var levelProperties = currentLevelProperties;

    levelProperties.honeyBees = [];
    if (levelProperties.honeyBees) {
        levelProperties.honeyBeeSpeedAdjust = 3.0;
        levelProperties.honeyBeeTakeHitsModifier = 5;
        levelProperties.honeyBeePauseAdjust = 2.0;
        levelProperties.honeyBeesAtATime = 4;
        levelProperties.honeyBeeRowsToToggleGain = 8;
        levelProperties.honeyBeesLeaveAtATime = 2;
        levelProperties.honeyBeesEntryDelay = 4000;
        levelProperties.honeyBeeLeaveTimeAdjust = 1000;
    }

    levelProperties.uberDrones = [];
    if (levelProperties.uberDrones) {
        levelProperties.uberDronesAtATime = 1;
        levelProperties.uberDroneSpeedAdjust = 1.0;
        levelProperties.uberDronePauseAdjust = 1.0;
        levelProperties.uberDroneRowsToToggleLose = 0;
        levelProperties.uberDroneRowsToToggleGain = 0;
        levelProperties.uberDroneEntryInterval = 20000;
        levelProperties.uberDroneEnterDelay = 0;
        levelProperties.uberDroneAttackTimeAdjust = 1.0;
    }

    levelProperties.turretHitPointsLost = 2000;

    levelProperties.enemyInfiniteRicochet = true;
    levelProperties.playerBulletNoRicochet = true;

    levelProperties.levelId = 5;

    levelProperties.timePar = 41000;

    levelProperties.scene = scene;

    baseLevel(levelProperties);
}

function level6(scene) {
    var levelProperties = currentLevelProperties;

    levelProperties.wasps = [];
    if (levelProperties.wasps) {
        levelProperties.waspSpeedAdjust = 2.0;
        levelProperties.waspPauseAdjust = 2.0;
        levelProperties.waspsAtAtime = 6;
        levelProperties.waspRowsToToggleLose = 1;
        levelProperties.waspEntryInterval = 14000;
        levelProperties.waspAttackTimeAdjust = 1.8;
    }

    levelProperties.uberDrones = [];
    if (levelProperties.uberDrones) {
        levelProperties.uberDronesAtATime = 3;
        levelProperties.uberDroneSpeedAdjust = 1.0;
        levelProperties.uberDronePauseAdjust = 1.0;
        levelProperties.uberDroneRowsToToggleLose = 4;
        levelProperties.uberDroneRowsToToggleGain = 4;
        levelProperties.uberDroneEntryInterval = 16000;
        levelProperties.uberDroneEnterDelay = 0;
        levelProperties.uberDroneAttackTimeAdjust = 1.0;
    }

    levelProperties.specialShoot = true;
    levelProperties.turretHitPointsLost = 2500;

    levelProperties.alternatingEnemyImages = true;

    levelProperties.playerBulletNoRicochet = true;

    levelProperties.levelId = 6;

    levelProperties.timePar = 78000;

    levelProperties.scene = scene;

    baseLevel(levelProperties);
}

function level7(scene) {
    var levelProperties = currentLevelProperties;

    levelProperties.honeyBees = [];
    if (levelProperties.honeyBees) {
        levelProperties.honeyBeeSpeedAdjust = 3.0;
        levelProperties.honeyBeeTakeHitsModifier = 7;
        levelProperties.honeyBeePauseAdjust = 2.0;
        levelProperties.honeyBeesAtATime = 4;
        levelProperties.honeyBeeRowsToToggleGain = 5;
        levelProperties.honeyBeesLeaveAtATime = 2;
        levelProperties.honeyBeesEntryDelay = 4000;
        levelProperties.honeyBeeLeaveTimeAdjust = 1000;
    }

    levelProperties.wasps = [];
    if (levelProperties.wasps) {
        levelProperties.waspSpeedAdjust = 2.0;
        levelProperties.waspPauseAdjust = 2.0;
        levelProperties.waspsAtAtime = 6;
        levelProperties.waspRowsToToggleLose = 1;
        levelProperties.waspEntryInterval = 14000;
        levelProperties.waspAttackTimeAdjust = 1.8;
    }

    levelProperties.uberDrones = [];
    if (levelProperties.uberDrones) {
        levelProperties.uberDronesAtATime = 2;
        levelProperties.uberDroneSpeedAdjust = 1.0;
        levelProperties.uberDronePauseAdjust = 1.0;
        levelProperties.uberDroneRowsToToggleLose = 4;
        levelProperties.uberDroneRowsToToggleGain = 4;
        levelProperties.uberDroneEntryInterval = 16000;
        levelProperties.uberDroneEnterDelay = 0;
        levelProperties.uberDroneAttackTimeAdjust = 1.0;
    }

    levelProperties.workerBees = [];
    if (levelProperties.workerBees) {
        levelProperties.workerBeeSpeedAdjust = 1.0;
        levelProperties.workerBeePauseAdjust = 1.0;
        levelProperties.workerBeesAtATime = 12;
        levelProperties.workerBeesAttackAtATime = 2;
        levelProperties.workerBeeEntryInterval = 14000;
        levelProperties.workerBeeAttackTimeAdjust = 1.0;
    }

    levelProperties.specialShoot = false;
    levelProperties.turretHitPointsLost = 5000;

    levelProperties.alternatingEnemyImages = true;

    levelProperties.playerBulletNoRicochet = true;

    levelProperties.levelId = 7;

    levelProperties.timePar = 132000;

    levelProperties.scene = scene;

    baseLevel(levelProperties);
}

loadScript('js/gameManager.js');