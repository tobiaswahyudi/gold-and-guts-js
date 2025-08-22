import { Cell } from "./pathGrid";

const ARRIVED_THRESHOLD = 3;

export class Minion {
    scene: Phaser.Scene;
    gameObject: Phaser.GameObjects.Container;
    body: Phaser.Physics.Arcade.Body;
    target: Cell;
    velocity: number;
    debug: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        minionGroup: Phaser.Physics.Arcade.Group,
        minionIcon: string,
        x: number,
        y: number,
        velocity: number
    ) {
        this.scene = scene;
        this.velocity = velocity;
        this.gameObject = scene.add.container(x, y).setSize(20, 20);
        const text = scene.add
            .text(0, 0, minionIcon)
            .setFontSize(16)
            .setAlign("center")
            .setOrigin(0.5, 0.5);

        minionGroup.add(this.gameObject);
        this.body = this.gameObject.body as Phaser.Physics.Arcade.Body;

        this.gameObject.add(text);

        this.body.setBounce(0).setCollideWorldBounds(true);

        this.gameObject.setScale(1);

        this.debug = scene.add.graphics().setDepth(99000);

        scene.events.on("postupdate", () => {
            this.debug.clear();
            this.debug.lineStyle(1, 0xff0000, 1);
            this.debug.lineBetween(this.gameObject.x, this.gameObject.y, this.target.x, this.target.y);
            // console.log(this.body.velocity.length());
        });
    }

    setTarget(cell: Cell) {
        this.target = cell;
        const dv = new Phaser.Math.Vector2(
            this.target.x - this.gameObject.x,
            this.target.y - this.gameObject.y
        )
            .normalize()
            .scale(this.velocity);
        this.body.setVelocity(dv.x, dv.y);
    }

    isAtTarget() {
        return (
            Math.sqrt(
                (this.gameObject.x - this.target.x) *
                    (this.gameObject.x - this.target.x) +
                    (this.gameObject.y - this.target.y) *
                        (this.gameObject.y - this.target.y)
            ) < ARRIVED_THRESHOLD
        );
    }
}
