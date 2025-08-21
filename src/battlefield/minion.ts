import { Cell, makeCell } from "./pathGrid";

export type Minion = ReturnType<typeof makeMinion>;

const ARRIVED_THRESHOLD = 3;

export const makeMinion = (
    scene: Phaser.Scene,
    minionGroup: Phaser.Physics.Arcade.Group,
    minionIcon: string,
    x: number,
    y: number,
    velocity: number
) => {
    const group = scene.add.container(x, y).setSize(20, 20);
    const text = scene.add
        .text(0, 0, minionIcon)
        .setFontSize(16)
        .setAlign("center")
        .setOrigin(0.5, 0.5);

    let target: Cell = makeCell(x, y);

    minionGroup.add(group);
    const body = group.body as Phaser.Physics.Arcade.Body;

    group.add(text);

    body.setBounce(1).setCollideWorldBounds(true);

    group.setScale(1);

    const debug = scene.add.graphics().setDepth(99000);

    // scene.events.on("postupdate", () => {
    //     debug.clear();
    //     debug.lineStyle(1, 0xff0000, 1);
    //     debug.lineBetween(group.x, group.y, target.x, target.y);
    // });

    const setTarget = (cell: Cell) => {
        target = cell;
        const dv = new Phaser.Math.Vector2(target.x - group.x, target.y - group.y)
            .normalize()
            .scale(velocity);
        body.setVelocity(dv.x, dv.y);
    };

    const isAtTarget = () => {
        // console.log(Math.sqrt((body.x - target.x) ** 2 + (body.y - target.y) ** 2));
        return (
            Math.sqrt(
                (group.x - target.x) * (group.x - target.x) +
                    (group.y - target.y) * (group.y - target.y)
            ) < ARRIVED_THRESHOLD
        );
    };

    return {
        gameObject: group,
        setTarget,
        isAtTarget
    };
};
