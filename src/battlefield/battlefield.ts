import { makeMinion, Minion } from "./minion";
import { makeTower, Tower } from "./tower";
import { BattlefieldConfig, BattlefieldDisplay } from "./types";
import { PathGrid } from "./pathGrid";

const DEBUG = true;

export class Battlefield {
    towers: Tower[];
    units: Minion[];

    scene: Phaser.Scene;

    minionGroup: Phaser.Physics.Arcade.Group;
    towerGroup: Phaser.Physics.Arcade.StaticGroup;
    projectileGroup: Phaser.Physics.Arcade.Group;

    config: BattlefieldConfig;
    display: BattlefieldDisplay;

    pathGrid: PathGrid;

    debug: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        config: BattlefieldConfig,
        display: BattlefieldDisplay
    ) {
        this.towers = [];
        this.units = [];

        this.scene = scene;

        this.config = config;
        this.display = display;

        this.pathGrid = new PathGrid(config);
        this.pathGrid.recompute();

        this.minionGroup = scene.physics.add.group();
        this.projectileGroup = scene.physics.add.group();

        // 400 colliding minions, without towers, still fit within 120fps.
        // 500 colliding minions drops significantly.
        this.spawnMinions();

        this.towerGroup = scene.physics.add.staticGroup();

        this.spawnTower(5, 5);
        this.spawnTower(10, 7);

        this.towers.forEach((tower) => {
            this.towerGroup.add(tower.gameObject);
        });

        // Tower track first minion
        if (this.units.length > 0) {
            this.towers[0].setLookAt(this.units[0].gameObject);
        }

        const wallGroup = scene.physics.add.staticGroup();

        wallGroup.addMultiple([
            scene.add
                .rectangle(config.x, config.y, 20, config.height)
                .setOrigin(1, 0),
            scene.add
                .rectangle(config.x + config.width, config.y, 20, config.height)
                .setOrigin(0, 0),
            scene.add
                .rectangle(config.x, config.y, config.width, 20)
                .setOrigin(0, 1),
            scene.add
                .rectangle(config.x, config.y + config.height, config.width, 20)
                .setOrigin(0, 0),
        ]);

        scene.physics.add.collider(this.minionGroup, this.towerGroup);
        scene.physics.add.collider(this.minionGroup, wallGroup);
        scene.physics.add.collider(
            this.projectileGroup,
            wallGroup,
            (projectile, wall) => {
                projectile.destroy();
            }
        );
        scene.physics.add.collider(
            this.projectileGroup,
            this.minionGroup,
            (projectile, minion) => {
                this.deleteMinion(
                    minion as Phaser.Types.Physics.Arcade.GameObjectWithBody
                );
                projectile.destroy();
            }
        );

        this.debug = scene.add.graphics().setDepth(99000);
    }

    spawnMinions() {
        for (let i = 0; i < 3; i++) {
            const minion = makeMinion(
                this.scene,
                this.minionGroup,
                this.display.minionIcon,
                this.config.x + this.config.width / 2,
                this.config.y + this.config.height / 2,
                100
            );
            const cell =
                this.pathGrid.grid[
                    Math.floor(Math.random() * this.pathGrid.size)
                ][Math.floor(Math.random() * this.pathGrid.size)];
            this.units.push(minion);
            minion.setTarget(cell);

            console.log(cell);
        }
    }

    deleteMinion(minion: Phaser.GameObjects.GameObject) {
        this.units = this.units.filter((m) => m.gameObject !== minion);
        this.minionGroup.remove(minion);
        minion.destroy();
    }

    spawnTower(x: number, y: number) {
        const tower = makeTower(
            this.scene,
            this.config,
            this.display.towerIcon,
            x,
            y,
            70
        );
        this.towers.push(tower);
        this.towerGroup.add(tower.gameObject);
    }

    update() {
        // Get closest minion for each tower. Has to be within range
        // this.towers.forEach((tower) => {
        //     let closestDist = tower.range;
        //     let closestMinion: Minion | null = null;

        //     this.units.forEach((minion) => {
        //         const dist = tower.gameObject
        //             .getWorldPoint()
        //             .distance(minion.gameObject.getWorldPoint());
        //         if (dist < closestDist) {
        //             closestDist = dist;
        //             closestMinion = minion;
        //         }
        //     });

        //     if (closestMinion == null) {
        //         tower.stopTracking();
        //     } else {
        //         // @ts-ignore dumbass
        //         tower.setLookAt(closestMinion.gameObject);

        //         if (
        //             tower.lastFired + tower.fireDelayTime <=
        //             this.scene.time.now
        //         ) {
        //             tower.lastFired = this.scene.time.now;
        //             // Shoot
        //             this.shoot(tower, closestMinion);
        //         }
        //     }
        // });

        this.units.forEach((minion) => {
            if (minion.isAtTarget()) {
                console.log("arrived");
                minion.setTarget(
                    this.pathGrid.grid[
                        Math.floor(Math.random() * this.pathGrid.size)
                    ][Math.floor(Math.random() * this.pathGrid.size)]
                );
            }
        });

        if (DEBUG) {
            this.debug.clear();
            this.debug.lineStyle(1, 0xff0000, 1);
            // for (let i = 0; i < this.pathGrid.size; i++) {
            //     for (let j = 0; j < this.pathGrid.size; j++) {
            //         for (const [x, y] of this.pathGrid.grid[i][j].to) {
            //             this.debug.lineBetween(
            //                 this.config.x + (i + 0.5) * 20,
            //                 this.config.y + (j + 0.5) * 20,
            //                 this.config.x + (x + 0.5) * 20,
            //                 this.config.y + (y + 0.5) * 20
            //             );
            //         }
            //     }
            // }
        }
    }

    shoot(tower: Tower, minion: Minion) {
        const towerPos = tower.gameObject.getWorldPoint();
        const minionPos = minion.gameObject.getWorldPoint();
        this.makeJectile(
            towerPos.x,
            towerPos.y,
            minionPos.subtract(towerPos).normalize(),
            150
        );
    }

    makeJectile(
        x: number,
        y: number,
        direction: Phaser.Math.Vector2,
        velocity: number
    ) {
        const projectile = this.scene.add
            .text(x, y, "🪨")
            .setFontSize(16)
            .setAlign("center")
            .setOrigin(0.5, 0.5);
        this.projectileGroup.add(projectile);
        this.scene.physics.add.existing(projectile, true);
        const body = projectile.body as Phaser.Physics.Arcade.Body;
        body.setCircle(8);
        projectile.setScale(0.5);

        body.setVelocity(direction.x * velocity, direction.y * velocity);
        return projectile;
    }
}
