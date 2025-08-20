import { BattlefieldConfig, TowerIcon } from "./types";

export type Tower = ReturnType<typeof makeTower>;

export const makeTower = (
    scene: Phaser.Scene,
    fieldConfig: BattlefieldConfig,
    icon: TowerIcon,
    fieldX: number,
    fieldY: number,
    range: number
) => {
    // x and y represent grid position. Mult with the square size.
    // THIS SHOULD BE EXTRACTED INTO CONSTANTS, ALONG WITH THE GRID SIZE IN Play.ts

    const cx = fieldConfig.x + (fieldX + 0.5) * fieldConfig.squareSize;
    const cy = fieldConfig.y + (fieldY + 0.5) * fieldConfig.squareSize;

    const group = scene.add
        .container(cx, cy)
        .setSize(fieldConfig.squareSize, fieldConfig.squareSize);
    const rect = scene.add.rectangle(
        0,
        0,
        fieldConfig.squareSize,
        fieldConfig.squareSize,
        0x222222,
        1
    ).setOrigin(0.5, 0.5).setScale(0.9);
    const text = scene.add
        .text(0, 0, icon.icon)
        .setFontSize(fieldConfig.squareSize * 2)
        .setAlign("center")
        .setDisplayOrigin(
            fieldConfig.squareSize,
            fieldConfig.squareSize
        )
        .setScale(0.4);

    group.add(scene.add.circle(0, 0, range, 0x222222, 0.1));

    scene.physics.add.existing(group, true);

    group.add(rect);
    group.add(text);

    let targetObject: { x: number; y: number } | null = null;
    let lastTargetX = 0;
    let lastTargetY = 0;

    const updateRotation = () => {
        if (!targetObject) return;

        const targetX = targetObject.x;
        const targetY = targetObject.y;

        // Only recalculate if target has moved (performance optimization)
        if (targetX !== lastTargetX || targetY !== lastTargetY) {
            const angle = Math.atan2(targetY - group.y, targetX - group.x);
            text.setRotation(angle + icon.rotationOffset);
            lastTargetX = targetX;
            lastTargetY = targetY;
        }
    };

    // Add to scene's update loop for continuous tracking
    scene.events.on("postupdate", updateRotation);

    const setLookAt = (gameObject: { x: number; y: number }) => {
        targetObject = gameObject;
        lastTargetX = gameObject.x;
        lastTargetY = gameObject.y;
        updateRotation(); // Initial rotation
    };

    const stopTracking = () => {
        targetObject = null;
    };

    return {
        gameObject: group,
        setLookAt,
        stopTracking,
        range,
        lastFired: 0,
        fireDelayTime: 800,
    };
};
