import { createCard } from "./createCard";
import Phaser from "phaser";

export class Play extends Phaser.Scene {
    cards: ReturnType<typeof createCard>[] = [];

    hoveredCardIndex = -1;

    // Grid configuration
    attackField = {
        x: 100,
        y: 32,
        width: 400,
        height: 400,
    };

    defenseField = {
        x: 524,
        y: 32,
        width: 400,
        height: 400,
    };

    constructor() {
        super({
            key: "Play",
        });
    }

    hoverCard(cardIndex: number) {
        this.hoveredCardIndex = cardIndex;
        this.arrangeCards();
    }

    init() {
        this.cameras.main.fadeIn(500);
    }

    create() {
        const attackGrid = this.add.grid(
            this.attackField.x + this.attackField.width / 2,
            this.attackField.y + this.attackField.height / 2,
            this.attackField.width,
            this.attackField.height,
            20,
            20
        );
        attackGrid.setFillStyle(0x6f947f);
        attackGrid.setAltFillStyle(0x698c78);
        attackGrid.setOutlineStyle();

        const defenseGrid = this.add.grid(
            this.defenseField.x + this.defenseField.width / 2,
            this.defenseField.y + this.defenseField.height / 2,
            this.defenseField.width,
            this.defenseField.height,
            20,
            20
        );
        defenseGrid.setFillStyle(0xe0bfa7);
        defenseGrid.setAltFillStyle(0xd6b6a0);
        defenseGrid.setOutlineStyle();

        // const rec = this.add.rectangle(100, 500, 100, 160)

        const defendText = this.add
            .text(
                this.attackField.x,
                this.attackField.y + this.attackField.height + 130,
                "DEFEND DEFEND DEFEND DEFEND",
                {
                    fontSize: 40,
                    fontStyle: "bold",
                    color: "#6f947f",
                    fontFamily: "Alkhemikal",
                }
            )
            .setResolution(8)
            .setOrigin(0, 1)
            .setRotation(-Math.PI / 2);

        const defendTextMask = this.add
            .rectangle(
                this.attackField.x,
                this.attackField.y,
                40,
                this.attackField.height
            )
            .setOrigin(1, 0)
            .setFillStyle(0x000000)
            .setVisible(false)
            .createGeometryMask();
        defendText.setMask(defendTextMask);

        this.add.tween({
            targets: defendText,
            y: this.attackField.y + this.attackField.height,
            duration: 6000,
            repeat: -1,
        });

        const attackText = this.add
            .text(
                this.defenseField.x + this.defenseField.width,
                this.defenseField.y - 136,
                "ATTACK ATTACK ATTACK ATTACK",
                {
                    fontSize: 39,
                    fontStyle: "bold",
                    color: "#E0BFA7",
                    fontFamily: "Alkhemikal",
                }
            )
            .setResolution(8)
            .setOrigin(0, 1)
            .setRotation(Math.PI / 2);

        const attackTextMask = this.add

            .rectangle(
                this.defenseField.x + this.defenseField.width,
                this.defenseField.y,
                40,
                this.defenseField.height
            )
            .setOrigin(0, 0)
            .setFillStyle(0x000000)
            .setVisible(false)
            .createGeometryMask();
        attackText.setMask(attackTextMask);

        this.add.tween({
            targets: attackText,
            y: this.defenseField.y,
            duration: 6000,
            repeat: -1,
        });

        this.cards = [
            createCard({
                scene: this,
                x: 100,
                y: 540,
                selectCard: this.hoverCard.bind(this),
            }),
            createCard({
                scene: this,
                x: 150,
                y: 540,
                selectCard: this.hoverCard.bind(this),
            }),
            createCard({
                scene: this,
                x: 200,
                y: 540,
                selectCard: this.hoverCard.bind(this),
            }),
            createCard({
                scene: this,
                x: 150,
                y: 540,
                selectCard: this.hoverCard.bind(this),
            }),
            createCard({
                scene: this,
                x: 200,
                y: 540,
                selectCard: this.hoverCard.bind(this),
            }),
        ];

        this.arrangeCards();

        // CREST

        this.add.sprite(50, 570, "crest").setDisplaySize(60, 100);

        this.add
            .text(90, 520, "House Toadsworth of Lyria")
            .setColor("#ffffff")
            .setFontSize(14)
            .setFontFamily("Alkhemikal")
            .setAlign("left")
            .setResolution(8)
            .setOrigin(0, 0);

        this.add
            .text(120, 540, "164 Gold")
            .setColor("#D6B41D")
            .setFontSize(32)
            .setFontFamily("Alkhemikal")
            .setAlign("right")
            .setResolution(8)
            .setOrigin(0, 0);

        this.add
            .text(120, 575, "033 Guts")
            .setColor("#D61D4B")
            .setFontSize(32)
            .setFontFamily("Alkhemikal")
            .setAlign("right")
            .setResolution(8)
            .setOrigin(0, 0);
    }

    arrangeCards() {
        const cardCount = this.cards.length;
        const middle = (cardCount - 1) / 2;

        const arcDeg = Math.PI * (3 / 180);
        const arcRadius = 2000;

        const ARC_CENTER = {
            x: this.scene.systems.scale.width / 2,
            y: 540 + arcRadius,
        };

        const SHIMMY_OVER = 40;

        this.cards.forEach(({ control, gameObject }, index) => {
            const angle = (index - middle) * arcDeg;

            let shimmyOver = 0;

            if (this.hoveredCardIndex != -1 && this.hoveredCardIndex !== index) {
                shimmyOver = this.hoveredCardIndex < index ? SHIMMY_OVER : -SHIMMY_OVER;
            }

            const x = ARC_CENTER.x + Math.sin(angle) * arcRadius + shimmyOver;
            const y = ARC_CENTER.y - Math.cos(angle) * arcRadius;
            
            control.x = x;
            control.y = y;
            control.cardIndex = index;

            gameObject.setPosition(x, y);
            gameObject.setRotation(angle);
        });
    }
}
