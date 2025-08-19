import { createCard } from "./createCard";
import Phaser from "phaser";

export class Play extends Phaser.Scene {
    cards: {
        gameObject: Phaser.GameObjects.Container;
        control: { x: number; y: number };
    }[] = [];

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

        this.add
            .text(
                this.attackField.x,
                this.attackField.y + this.attackField.height,
                "DEFEND DEFEND DEFEND",
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

        this.add
            .text(
                this.defenseField.x + this.defenseField.width,
                this.defenseField.y,
                "ATTACK ATTACK ATTACK",
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

        // const titleText = this.add
        //     .text(
        //         this.sys.game.scale.width / 2,
        //         this.sys.game.scale.height / 2,
        //         "Guts and Gold",
        //         {
        //             align: "center",
        //             fontSize: 120,
        //             fontStyle: "bold",
        //             color: "#ffffff",
        //             fontFamily: "Alkhemikal",
        //         }
        //     )
        //     .setResolution(8)
        //     .setOrigin(0.5)
        //     .setDepth(3)
        //     .setInteractive();

        // titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
        //     titleText.setColor("#eeeeee");
        //     this.input.setDefaultCursor("pointer");
        // });
        // titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
        //     titleText.setColor("#ffffff");
        //     this.input.setDefaultCursor("default");
        // });
        // titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
        //     this.sound.play("card-deal", { volume: 1.3 });
        //     this.add.tween({
        //         targets: titleText,
        //         ease: Phaser.Math.Easing.Bounce.InOut,
        //         y: -1000,
        //         onComplete: () => {
        //             if (!this.sound.get("theme-song")) {
        //                 this.sound.play("theme-song", {
        //                     loop: true,
        //                     volume: 0.5,
        //                 });
        //             }
        //             // this.startGame();
        //         },
        //     });
        // });

        this.cards = [
            createCard({
                scene: this,
                x: 100,
                y: 540,
            }),
            createCard({
                scene: this,
                x: 150,
                y: 540,
            }),
            createCard({
                scene: this,
                x: 200,
                y: 540,
            }),
            createCard({
                scene: this,
                x: 150,
                y: 540,
            }),
            createCard({
                scene: this,
                x: 200,
                y: 540,
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

        const arcDeg = Math.PI * (3.5 / 180);
        const arcRadius = 1600;

        const arcCenter = {
            x: this.scene.systems.scale.width / 2,
            y: 540 + arcRadius,
        };

        this.cards.forEach(({ control, gameObject }, index) => {
            const angle = (index - middle) * arcDeg;
            const x = arcCenter.x + Math.sin(angle) * arcRadius;
            const y = arcCenter.y - Math.cos(angle) * arcRadius;

            console.log(
                angle,
                Math.sin(angle) * arcRadius,
                Math.cos(angle) * arcRadius
            );

            control.x = x;
            control.y = y;

            gameObject.setPosition(x, y);
            gameObject.setRotation(angle);
        });
    }
}
