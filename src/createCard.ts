import Phaser from "phaser";

type CardParams = {
    scene: Phaser.Scene;
    x: number;
    y: number;
    cardName: string;
    cardImage: string;
    cardDescription: string;
};

export const createCard = ({
    scene,
    x,
    y,
    cardName,
    cardImage,
    cardDescription,
}: CardParams) => {
    let isRaised = false;

    // const backTexture = "card-back";

    cardName = "All Is Dust";
    cardImage = "card-guy";
    cardDescription =
        "Each player sacrifices all permanents they control that are one or more colors.";

    const cardWidth = 120;
    const cardHeight = 160;

    const cardTextDelta = cardHeight * -0.5 + 12;

    const cardGroup = scene.add
        .container(x, y)
        .setSize(cardWidth, cardHeight)
        .setInteractive();

    const card = scene.add
        .rectangle(0, 0, cardWidth, cardHeight)
        .setFillStyle(0xbbbbbb)
        .setName(cardName)
        .setInteractive();

    cardGroup.add(card);

    cardGroup.add(
        scene.add
            .text(0, cardTextDelta, cardName)
            .setColor("#ffffff")
            .setFontSize(16)
            .setFontFamily("Alkhemikal")
            .setAlign("center")
            .setResolution(8)
            .setOrigin(0.5, 0.5)
    );

    cardGroup.add(
        scene.add
        .rectangle(0, -20, cardWidth - 12, 72)
        .setFillStyle(0xeeeeee)
    );

    cardGroup.add(
        scene.add
            .text(0, 22, cardDescription, {
                wordWrap: { width: cardWidth - 20 },
            })
            .setColor("#ffffff")
            .setFontSize(10)
            .setFontFamily("Alkhemikal")
            .setAlign("center")
            .setResolution(8)
            .setOrigin(0.5, 0)
    );

    const raiseCard = () => {
        if (isRaised) return;

        isRaised = true;

        scene.add.tween({
            targets: cardGroup,
            y: y - cardHeight * 0.25,
            scale: 1.5,
            duration: 100,
            ease: "Power2.easeInOut",
        });
    };

    const lowerCard = () => {
        if (!isRaised) return;
        isRaised = false;
        scene.add.tween({
            targets: cardGroup,
            y: y,
            scale: 1,
            duration: 100,
            ease: "Power2.easeInOut",
        });
    };

    card.on(Phaser.Input.Events.POINTER_OVER, () => {
        raiseCard();
        scene.input.setDefaultCursor("pointer");
    });

    card.on(Phaser.Input.Events.POINTER_OUT, () => {
        lowerCard();
        scene.input.setDefaultCursor("default");
    });

    return {
        gameObject: cardGroup,
    };
};
