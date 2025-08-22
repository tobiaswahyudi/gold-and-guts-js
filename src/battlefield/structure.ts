import { BattlefieldConfig } from "./types";

export type Structure = ReturnType<typeof makeStructure>;

export const makeStructure = (
    scene: Phaser.Scene,
    fieldConfig: BattlefieldConfig,
    icon: string,
    fieldX: number,
    fieldY: number,
    backgroundColor: number = 0x222222,
    backgroundAlpha: number = 1
) => {
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
        backgroundColor,
        backgroundAlpha
    ).setOrigin(0.5, 0.5).setScale(0.9);
    const text = scene.add
        .text(0, 0, icon)
        .setFontSize(fieldConfig.squareSize * 2)
        .setAlign("center")
        .setDisplayOrigin(
            fieldConfig.squareSize,
            fieldConfig.squareSize
        )
        .setScale(0.4);

    group.add(rect);
    group.add(text);

    return {
        group,
        text,
    };
};
