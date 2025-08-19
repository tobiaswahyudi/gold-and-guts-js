// import { makeTower } from "./tower";
import { makeMinion, Minion } from "./minion";
import { makeTower, Tower } from "./tower";

export class Battlefield {
    towers: Tower[];
    units: Minion[];

    constructor(scene: Phaser.Scene) {
        this.towers = [];
        this.units = [];

        // 400 colliding minions, without towers, still fit within 120fps.
        // 500 colliding minions drops significantly.
        for (let i = 0; i < 1; i++) {
            const minion = makeMinion(scene);
            this.units.push(minion);
            minion.setVelocity(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
        }

        const unitBodies = this.units.map((unit) => unit.gameObject.body as Phaser.Physics.Arcade.Body);

        this.towers.push(makeTower(scene, 5, 5));

        // Tower track first minion
        if (this.units.length > 0) {
            this.towers[0].setLookAt(this.units[0].gameObject);
        }

        scene.physics.add.collider(unitBodies, this.towers[0].gameObject.body as Phaser.Physics.Arcade.StaticBody);
    }
}
