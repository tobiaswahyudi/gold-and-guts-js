import Phaser from "phaser";

type CardParams = {
    scene: Phaser.Scene;
    x: number;
    y: number;
    cardName?: string;
    cardImage?: string;
    cardDescription?: string;
    cardTarget?: "attack" | "defense";
    cardIndex?: number;
    selectCard: (cardIndex: number) => boolean;
};

export const createCard = ({
    scene,
    x,
    y,
    cardName = "All Is Dust",
    cardImage = "card-guy",
    cardDescription = "Each player sacrifices all permanents they control that are one or more colors.",
    cardTarget = Math.random() > 0.5 ? "attack" : "defense",
    cardIndex = 0,
    selectCard,
}: CardParams) => {
    let isRaised = false;

    // const backTexture = "card-back";

    const CONTROL = {
        x: x,
        y: y,
        cardIndex: cardIndex,
    };

    const CARD_SCALE = 1.3;

    const colorHex = cardTarget === "attack" ? "#E0BFA7" : "#6f947f";
    const color = Phaser.Display.Color.HexStringToColor(colorHex)
        .saturate(20)
        .brighten(10);

    const cardWidth = 120;
    const cardHeight = 160;

    const cardTextDelta = cardHeight * -0.5 + 12;

    const cardGroup = scene.add
        .container(x, y)
        .setSize(cardWidth, cardHeight)
        .setDepth(2000);

    const card = scene.add
        .rectangle(0, 0, cardWidth, cardHeight)
        .setFillStyle(color.color)
        .setStrokeStyle(1, 0x444444, 1)
        .setName(cardName)
        .setInteractive({draggable: true});

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
        scene.add.rectangle(0, -20, cardWidth - 12, 72).setFillStyle(0xeeeeee)
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

    const hoverCard = () => {
        if (isRaised) return;
        const ok = selectCard(CONTROL.cardIndex);

        if (!ok) return;

        isRaised = true;

        scene.add.tween({
            targets: cardGroup,
            y: CONTROL.y - cardHeight * (CARD_SCALE - 1) * 0.5,
            scale: CARD_SCALE,
            duration: 100,
            ease: "Power2.easeInOut",
        });

    };

    const unhoverCard = () => {
        if (!isRaised) return;
        isRaised = false;
        scene.add.tween({
            targets: cardGroup,
            y: CONTROL.y,
            scale: 1,
            duration: 100,
            ease: "Power2.easeInOut",
        });
        selectCard(-1);
    };

    card.on(Phaser.Input.Events.POINTER_OVER, () => {
        hoverCard();
        scene.input.setDefaultCursor("pointer");
    });

    card.on(Phaser.Input.Events.POINTER_OUT, () => {
        unhoverCard();
        scene.input.setDefaultCursor("default");
    });

    return {
        gameObject: cardGroup,
        control: CONTROL,
    };
};
