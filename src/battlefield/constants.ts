import { BattlefieldConfig, BattlefieldDisplay } from "./types";

export const DEFENSE_FIELD_CONFIG: BattlefieldConfig = {
    x: 100,
    y: 32,
    width: 400,
    height: 400,
    gridSize: 20,
    squareSize: 20,
    spawnPoints: [[19, 19], [19, 16], [16, 19]],
    base: [0, 0],
};

export const DEFENSE_FIELD_DISPLAY: BattlefieldDisplay = {
    minionIcon: "👿",
    towerIcon: {
        icon: "🏹",
        rotationOffset: Math.PI / 4,
    },
}

export const ATTACK_FIELD_CONFIG: BattlefieldConfig = {
    x: 524,
    y: 32,
    width: 400,
    height: 400,
    gridSize: 20,
    squareSize: 20,
    spawnPoints: [[0, 0], [0, 3], [3, 0]],
    base: [19, 19],
};

export const ATTACK_FIELD_DISPLAY: BattlefieldDisplay = {
    minionIcon: "💂‍♂️",
    towerIcon: {
        icon: "🔱",
        rotationOffset: Math.PI / 2,
    },
}