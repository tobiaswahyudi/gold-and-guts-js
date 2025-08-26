import Phaser from "phaser";
import { Card } from "./types";
import { LAYERS } from "../utils/layers";

type CardDisplayParams = {
    scene: Phaser.Scene;
    x: number;
    y: number;
    card: Card;
};

export type CardDisplay = ReturnType<typeof createDisplayCard>;

/**
 * THIS ONLY CREATES THE CARD DISPLAY.
 * NOT EVEN SCALING AND POSITIONING AND SUCH.
 * WANT TO MAKE IT BIGGER? TOO BAD
 * DO IT YOURSELF
 */
export const createDisplayCard = ({
    scene,
    x,
    y,
    card,
}: CardDisplayParams) => {
    const colorHex = card.cardTarget === "attack" ? "#E0BFA7" : "#6f947f";
    const color = Phaser.Display.Color.HexStringToColor(colorHex)
        .saturate(20)
        .brighten(10);

    const cardWidth = 120;
    const cardHeight = 160;

    const cardTextDelta = cardHeight * -0.5 + 12;

    const cardGroup = scene.add
        .container(x, y)
        .setSize(cardWidth, cardHeight)
        .setDepth(LAYERS.HAND);

    const cardRectangle = scene.add
        .rectangle(0, 0, cardWidth, cardHeight)
        .setFillStyle(color.color)
        .setStrokeStyle(2, color.darken(30).color, 1)
        .setInteractive({ draggable: true });

    cardGroup.add(cardRectangle);

    cardGroup.add(
        scene.add
            .text(0, cardTextDelta, card.cardName || "( ͡° ͜ʖ ͡°)")
            .setColor("#222222")
            .setFontSize(16)
            .setFontFamily("Alkhemikal")
            .setAlign("center")
            .setResolution(8)
            .setOrigin(0.5, 0.5)
    );

    cardGroup.add(
        scene.add
            .rectangle(0, -20, cardWidth - 12, 72)
            .setFillStyle(color.darken(10).color)
            .setStrokeStyle(1, color.darken(30).color, 1)
    );

    cardGroup.add(
        scene.add
            .text(0, -16, card.cardImage || "")
            .setFontSize(48)
            .setAlign("center")
            .setResolution(8)
            .setOrigin(0.5, 0.5)
    );

    cardGroup.add(
        scene.add
            .text(0, 22, card.cardDescription || "", {
                wordWrap: { width: cardWidth - 20 },
            })
            .setColor("#222222")
            .setFontSize(12)
            .setFontFamily("Alkhemikal")
            .setAlign("center")
            .setResolution(8)
            .setOrigin(0.5, 0)
    );

    return {
        gameObject: cardGroup,
        rectangle: cardRectangle,
        card,
    };
};
