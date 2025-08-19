export type Minion = ReturnType<typeof makeMinion>;

export const makeMinion = (scene: Phaser.Scene, world: Phaser.Physics.Arcade.World) => {
    let x = 0;
    let y = 0;

    // just have them bounce around for now
    let vel = {
        x: 10,
        y: 10,
    };

    const group = scene.add.container(x, y).setSize(20, 20);
    const circle = scene.add.circle(0, 0, 10, 0x000000, 1);
    const text = scene.add.text(0, 0, "👿").setFontSize(16).setAlign("center").setOrigin(0.5, 0.5);

    scene.physics.add.existing(group);
    const body = group.body as Phaser.Physics.Arcade.Body;

    group.add(circle);
    group.add(text);

    body.setBounce(1).setCollideWorldBounds(true);

    group.setScale(0.5);

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

export default makeMinion;