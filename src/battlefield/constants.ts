import { BattlefieldConfig, BattlefieldDisplay } from "./types";

export const DEFENSE_FIELD_CONFIG: BattlefieldConfig = {
    x: 100,
    y: 32,
    width: 400,
    height: 400,
    gridSize: 20,
    squareSize: 20,
    spawnPoints: [],
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
    spawnPoints: [],
    base: [19, 19],
};

export const ATTACK_FIELD_DISPLAY: BattlefieldDisplay = {
    minionIcon: "💂‍♂️",
    towerIcon: {
        icon: "🔱",
        rotationOffset: Math.PI / 2,
    },
}