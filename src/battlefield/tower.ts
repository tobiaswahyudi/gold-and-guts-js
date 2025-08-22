import { BattlefieldConfig, TowerIcon } from "./types";
import { makeStructure } from "./structure";

export type Tower = ReturnType<typeof makeTower>;

export const makeTower = (
    scene: Phaser.Scene,
    fieldConfig: BattlefieldConfig,
    icon: TowerIcon,
    fieldX: number,
    fieldY: number,
    range: number
) => {
    const { group, text } = makeStructure(scene, fieldConfig, icon.icon, fieldX, fieldY);

    group.add(scene.add.circle(0, 0, range, 0x222222, 0.1));

    scene.physics.add.existing(group, true);

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
