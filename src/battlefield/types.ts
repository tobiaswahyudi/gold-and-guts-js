export interface BattlefieldConfig {
    x: number;
    y: number;
    width: number;
    height: number;

    gridSize: number;
    squareSize: number;

    spawnPoints: [number, number][];
    base: [number, number];
}

export interface TowerIcon {
    icon: string;
    rotationOffset: number;
}

export interface BattlefieldDisplay {
    minionIcon: string;
    towerIcon: TowerIcon;
}
