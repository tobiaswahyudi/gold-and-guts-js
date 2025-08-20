import { makeMinion, Minion } from "./minion";
import { makeTower, Tower, TowerIcon } from "./tower";

export type BattlefieldDisplay = {
    minionIcon: string;
    towerIcon: TowerIcon;
};

export class Battlefield {
    towers: Tower[];
    units: Minion[];

    scene: Phaser.Scene;

    minionGroup: Phaser.Physics.Arcade.Group;
    towerGroup: Phaser.Physics.Arcade.StaticGroup;
    projectileGroup: Phaser.Physics.Arcade.Group;

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
        display: BattlefieldDisplay
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
            scene.add.rectangle(x, y, 20, height).setOrigin(1, 0),
            scene.add.rectangle(x + width, y, 20, height).setOrigin(0, 0),
            scene.add.rectangle(x, y, width, 20).setOrigin(0, 1),
            scene.add.rectangle(x, y + height, width, 20).setOrigin(0, 0),
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
                this.deleteMinion(minion as Phaser.Types.Physics.Arcade.GameObjectWithBody);
                projectile.destroy();
            }
        );
    }

    spawnMinions() {
        for (let i = 0; i < 3; i++) {
            const minion = makeMinion(
                this.scene,
                this.minionGroup,
                this.display.minionIcon,
                this.x + this.width / 2,
                this.y + this.height / 2
            );
            this.units.push(minion);
            minion.setVelocity(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
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
            x,
            y,
            this.display.towerIcon,
            this.x,
            this.y,
            70
        );
        this.towers.push(tower);
        this.towerGroup.add(tower.gameObject);
    }

    shoot(tower: Tower, minion: Minion) {
        const towerPos = tower.gameObject.getWorldPoint();
        const minionPos = minion.gameObject.getWorldPoint();
        this.makeJectile(
            towerPos.x,
            towerPos.y,
            minionPos.subtract(towerPos).normalize(),
            300
        );
    }

    update() {
        // Get closest minion for each tower. Has to be within range
        this.towers.forEach((tower) => {
            let closestDist = tower.range;
            let closestMinion: Minion | null = null;

            this.units.forEach((minion) => {
                const dist = tower.gameObject
                    .getWorldPoint()
                    .distance(minion.gameObject.getWorldPoint());
                if (dist < closestDist) {
                    closestDist = dist;
                    closestMinion = minion;
                }
            });

            if (closestMinion == null) {
                tower.stopTracking();
            } else {
                // @ts-ignore dumbass
                tower.setLookAt(closestMinion.gameObject);

                if (
                    tower.lastFired + tower.fireDelayTime <=
                    this.scene.time.now
                ) {
                    tower.lastFired = this.scene.time.now;
                    // Shoot
                    console.log("tower shooting at", closestMinion);
                    this.shoot(tower, closestMinion);
                }
            }
        });
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
