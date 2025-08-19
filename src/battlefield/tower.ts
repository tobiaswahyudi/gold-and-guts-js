export type Tower = ReturnType<typeof makeTower>;

export const makeTower = (scene: Phaser.Scene, x: number, y: number) => {
    // x and y represent grid position. Mult with the square size.
    // THIS SHOULD BE EXTRACTED INTO CONSTANTS, ALONG WITH THE GRID SIZE IN Play.ts
    x = (x + 0.5) * 20 + 524;
    y = (y + 0.5) * 20 + 32;

    const group = scene.add.container(x, y).setSize(20, 20);
    const rect = scene.add.rectangle(0, 0, 16, 16, 0x222222, 1);
    const text = scene.add.text(0, 0, "🏹").setFontSize(40).setAlign("center").setDisplayOrigin(19, 19).setScale(0.4);

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
            text.setRotation(angle + Math.PI / 4);
            lastTargetX = targetX;
            lastTargetY = targetY;
        }
    };

    // Add to scene's update loop for continuous tracking
    scene.events.on('postupdate', updateRotation);

    const setLookAt = (gameObject: { x: number; y: number }) => {
        targetObject = gameObject;
        lastTargetX = gameObject.x;
        lastTargetY = gameObject.y;
        updateRotation(); // Initial rotation
    };

    const stopTracking = () => {
        targetObject = null;
        scene.events.off('postupdate', updateRotation);
    };

    return {
        gameObject: group,
        setLookAt,
        stopTracking,
    };
};
