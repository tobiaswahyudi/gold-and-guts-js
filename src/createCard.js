export const createCard = ({
    scene,
    x,
    y,
    cardName,
    cardImage,
    cardDescription,
}) => {
    let isRaised = false;

    // const backTexture = "card-back";

    cardName = "All Is Dust";
    cardImage = "card-guy";
    cardDescription =
        "Each player sacrifices all permanents they control that are one or more colors.";

    const cardWidth = 120;
    const cardHeight = 160;

    const cardTextDelta = cardHeight * -0.5 + 10;

    const cardGroup = scene.add.container(x, y).setSize(cardWidth, cardHeight).setInteractive();

    const card = cardGroup.add(
        scene.add
            .rectangle(0, 0, cardWidth, cardHeight)
            .setFillStyle(0xbbbbbb)
            .setName(cardName)
            .setInteractive()
    );

    cardGroup.add(
        scene.add
            .text(0, cardTextDelta, cardName)
            .setColor("#ffffff")
            .setFontSize(16)
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
            y: y - cardHeight * 0.5,
            scale: 1.2,
            duration: 100,
            ease: "Power2.easeInOut",
        });

        // scene.add.tween({
        //     targets: [cardText],
        //     y: y + (cardTextDelta - (cardHeight * 0.5)) * 1.2,
        //     scale: 1.2,
        //     duration: 100,
        //     ease: "Power2.easeInOut",
        // });
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

        // scene.add.tween({
        //     targets: [cardText],
        //     y: y + cardTextDelta,
        //     scale: 1,
        //     duration: 100,
        //     ease: "Power2.easeInOut",
        // });
    };

    cardGroup.on(Phaser.Input.Events.POINTER_OVER, () => {
        raiseCard();
        scene.input.setDefaultCursor("pointer");
    });

    cardGroup.on(Phaser.Input.Events.POINTER_OUT, () => {
        lowerCard();
        scene.input.setDefaultCursor("default");
    });

    return {
        gameObject: cardGroup,
    };
};
