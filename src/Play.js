import { createCard } from "./createCard";
import Phaser from "phaser";

export class Play extends Phaser.Scene {
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
        defenseGrid.setFillStyle(0xE0BFA7);
        defenseGrid.setAltFillStyle(0xD6B6A0);
        defenseGrid.setOutlineStyle();

        this.add
            .text(
                this.attackField.x,
                this.attackField.y + this.attackField.height,
                "DEFEND DEFEND DEFEND",
                {
                    fontSize: 33,
                    fontStyle: "bold",
                    color: "#6f947f",
                }
            )
            .setOrigin(0, 1)
            .setRotation(-Math.PI / 2);

        this.add
            .text(
                this.defenseField.x + this.defenseField.width,
                this.defenseField.y,
                "ATTACK ATTACK ATTACK",
                {
                    fontSize: 33,
                    fontStyle: "bold",
                    color: "#E0BFA7",
                }
            )
            .setOrigin(0, 1)
            .setRotation(Math.PI / 2);

        const titleText = this.add
            .text(
                this.sys.game.scale.width / 2,
                this.sys.game.scale.height / 2,
                "Gold and Guts",
                {
                    align: "center",
                    strokeThickness: 4,
                    fontSize: 40,
                    fontStyle: "bold",
                    color: "#8c7ae6",
                }
            )
            .setOrigin(0.5)
            .setDepth(3)
            .setInteractive();

        titleText.on(Phaser.Input.Events.POINTER_OVER, () => {
            titleText.setColor("#9c88ff");
            this.input.setDefaultCursor("pointer");
        });
        titleText.on(Phaser.Input.Events.POINTER_OUT, () => {
            titleText.setColor("#8c7ae6");
            this.input.setDefaultCursor("default");
        });
        titleText.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.sound.play("card-deal", { volume: 1.3 });
            this.add.tween({
                targets: titleText,
                ease: Phaser.Math.Easing.Bounce.InOut,
                y: -1000,
                onComplete: () => {
                    if (!this.sound.get("theme-song")) {
                        this.sound.play("theme-song", {
                            loop: true,
                            volume: 0.5,
                        });
                    }
                    this.startGame();
                },
            });
        });
    }
}
