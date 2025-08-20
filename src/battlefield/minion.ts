export type Minion = ReturnType<typeof makeMinion>;

export const makeMinion = (scene: Phaser.Scene, minionGroup: Phaser.Physics.Arcade.Group, minionIcon: string, x: number, y: number) => {
    // just have them bounce around for now
    let vel = {
        x: 10,
        y: 10,
    };

    const group = scene.add.container(x, y).setSize(20, 20);
    const text = scene.add.text(0, 0, minionIcon).setFontSize(16).setAlign("center").setOrigin(0.5, 0.5);

    minionGroup.add(group);
    const body = group.body as Phaser.Physics.Arcade.Body;

    group.add(text);

    body.setBounce(1).setCollideWorldBounds(true);

    group.setScale(1);

    const setVelocity = (x: number, y: number) => {
        vel.x = x;
        vel.y = y;
        body.setVelocity(vel.x, vel.y);
    };

    return {
        gameObject: group,
        setVelocity,
    };
};
