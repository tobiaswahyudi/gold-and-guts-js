// import { makeTower } from "./tower";
import { makeMinion, Minion } from "./minion";
import { makeTower, Tower, TowerIcon } from "./tower";

export type BattlefieldDisplay = {
    minionIcon: string;
    towerIcon: TowerIcon;
}

export class Battlefield {
    towers: Tower[];
    units: Minion[];

    scene: Phaser.Scene;

    minionGroup: Phaser.Physics.Arcade.Group;

    x: number;
    y: number;
    width: number;
    height: number;

    display: BattlefieldDisplay;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        display: BattlefieldDisplay,
    ) {
        this.towers = [];
        this.units = [];

        this.scene = scene;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.display = display;

        this.minionGroup = scene.physics.add.group();

        // 400 colliding minions, without towers, still fit within 120fps.
        // 500 colliding minions drops significantly.
        this.spawnMinions();

        const towerGroup = scene.physics.add.staticGroup();

        this.towers.push(makeTower(scene, 5, 5, display.towerIcon));
        this.towers.push(makeTower(scene, 10, 7, display.towerIcon));

        this.towers.forEach((tower) => {
            towerGroup.add(tower.gameObject);
        });

        // Tower track first minion
        if (this.units.length > 0) {
            this.towers[0].setLookAt(this.units[0].gameObject);
        }

        const wallGroup = scene.physics.add.staticGroup();

        wallGroup.addMultiple([
            scene.add.rectangle(x, y, 20, height).setOrigin(1, 0),
            scene.add.rectangle(x + width, y, 20, height).setOrigin(0, 0),
            scene.add.rectangle(x, y, width, 20).setOrigin(0, 1),
            scene.add.rectangle(x, y + height, width, 20).setOrigin(0, 0),
        ]);

        scene.physics.add.collider(this.minionGroup, towerGroup);
        scene.physics.add.collider(this.minionGroup, wallGroup);
    }

    spawnMinions() {
        for (let i = 0; i < 3; i++) {
            const minion = makeMinion(  
                this.scene,
                this.minionGroup,
                this.display.minionIcon,
                this.x + this.width / 2,
                this.y + this.height / 2,
            );
            this.units.push(minion);
            minion.setVelocity(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
        }
    }
}
