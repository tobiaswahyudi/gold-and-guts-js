// import { makeTower } from "./tower";
import { makeMinion, Minion } from "./minion";

export class Battlefield {
    // towers: ReturnType<typeof makeTower>[];
    units: Minion[];

    constructor(scene: Phaser.Scene) {
        // this.towers = [];
        this.units = [];

        // 400 colliding minions, without towers, still fit within 120fps.
        // 500 colliding minions drops significantly.
        for (let i = 0; i < 200; i++) {
            const minion = makeMinion(scene, scene.physics.world);
            this.units.push(minion);
            minion.setVelocity(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
        }

        const unitBodies = this.units.map((unit) => unit.gameObject.body as Phaser.Physics.Arcade.Body);

        scene.physics.add.collider(unitBodies, unitBodies);
    }
}
