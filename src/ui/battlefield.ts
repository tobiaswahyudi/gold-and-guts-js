import Phaser from "phaser";
import { StateManagers } from "./types";

import {
    ATTACK_FIELD_CONFIG,
    DEFENSE_FIELD_CONFIG,
} from "../battlefield/constants";
import { Battlefield } from "../battlefield/battlefield";
import { CardFieldTarget } from "../deck/types";
import { LAYERS } from "../utils/layers";

export interface BattlefieldUIHandlers {
    attackAction: () => void;
    defenseAction: ({ x, y }: { x: number; y: number }) => void;
}

export class BattlefieldUI {
    scene: Phaser.Scene;
    graphics: Phaser.GameObjects.Graphics;

    draggedCardTarget: CardFieldTarget | null = null;

    isAttackFieldHovered = false;
    defenseFieldHoveredTile: { x: number; y: number } | null = null;

    attackField: Phaser.GameObjects.Grid;
    defenseField: Phaser.GameObjects.Grid;

    defenseBattlefield: Battlefield;
    attackBattlefield: Battlefield;

    handlers: BattlefieldUIHandlers;

    constructor(scene: Phaser.Scene, managers: StateManagers, handlers: BattlefieldUIHandlers) {
        this.graphics = scene.add.graphics().setDepth(LAYERS.UI_OVERLAY);
        this.scene = scene;

        this.handlers = handlers;

        this.setupBattlefields();
        this.setupListeners();
    }

    setDraggedCard(cardTarget: CardFieldTarget | null) {
        this.draggedCardTarget = cardTarget;
    }

    setupListeners() {
        this.attackField.on("pointerover", () => {
            if (this.draggedCardTarget === "attack") {
                // console.log("attack field hovered");
                this.isAttackFieldHovered = true;
            }
        });
        this.attackField.on("pointerout", () => {
            // console.log("attack field unhovered");
            this.isAttackFieldHovered = false;
        });

        this.defenseField.on(
            "pointermove",
            (_: Phaser.Input.Pointer, x: number, y: number) => {
                if (this.draggedCardTarget === "defense") {
                    this.defenseFieldHoveredTile = {
                        x: Math.floor(x / 20),
                        y: Math.floor(y / 20),
                    };
                    // console.log(
                    //     "defense field hovered at",
                    //     this.defenseFieldHoveredTile
                    // );
                }
            }
        );
        this.defenseField.on("pointerout", () => {
            // console.log("defense field unhovered");
            this.defenseFieldHoveredTile = null;
        });

        this.attackField.on("pointerup", () => {
            if(this.draggedCardTarget === "attack") {
                console.log("attack action");
                this.handlers.attackAction();
            }
        });
        this.defenseField.on("pointerup", () => {
            if(this.draggedCardTarget === "defense") {
                console.log("defense action", this.defenseFieldHoveredTile);
                this.handlers.defenseAction(this.defenseFieldHoveredTile!);
            }
        });
    }

    setupBattlefields() {
        this.defenseField = this.scene.add
            .grid(
                DEFENSE_FIELD_CONFIG.x + DEFENSE_FIELD_CONFIG.width / 2,
                DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height / 2,
                DEFENSE_FIELD_CONFIG.width,
                DEFENSE_FIELD_CONFIG.height,
                DEFENSE_FIELD_CONFIG.squareSize,
                DEFENSE_FIELD_CONFIG.squareSize
            )
            .setFillStyle(0x6f947f)
            .setAltFillStyle(0x698c78)
            .setOutlineStyle()
            .setInteractive()
            .setDepth(LAYERS.BATTLEFIELD_BACKGROUND);

        this.attackField = this.scene.add
            .grid(
                ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width / 2,
                ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height / 2,
                ATTACK_FIELD_CONFIG.width,
                ATTACK_FIELD_CONFIG.height,
                ATTACK_FIELD_CONFIG.squareSize,
                ATTACK_FIELD_CONFIG.squareSize
            )
            .setFillStyle(0xe0bfa7)
            .setAltFillStyle(0xd6b6a0)
            .setOutlineStyle()
            .setInteractive()
            .setDepth(LAYERS.BATTLEFIELD_BACKGROUND);

        const defendText = this.scene.add
            .text(
                DEFENSE_FIELD_CONFIG.x,
                DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height + 130,
                "DEFEND DEFEND DEFEND DEFEND DEFEND",
                {
                    fontSize: 40,
                    fontStyle: "bold",
                    color: "#6f947f",
                    fontFamily: "Alkhemikal",
                }
            )
            .setResolution(2)
            .setOrigin(0, 1)
            .setRotation(-Math.PI / 2);

        const defendTextMask = this.scene.add
            .rectangle(
                DEFENSE_FIELD_CONFIG.x,
                DEFENSE_FIELD_CONFIG.y,
                40,
                DEFENSE_FIELD_CONFIG.height
            )
            .setOrigin(1, 0)
            .setFillStyle(0x000000)
            .setVisible(false)
            .createGeometryMask();
        defendText.setMask(defendTextMask);

        this.scene.add.tween({
            targets: defendText,
            y: DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height,
            duration: 6000,
            repeat: -1,
        });

        const attackText = this.scene.add
            .text(
                ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width,
                ATTACK_FIELD_CONFIG.y - 136,
                "ATTACK ATTACK ATTACK ATTACK ATTACK",
                {
                    fontSize: 39,
                    fontStyle: "bold",
                    color: "#E0BFA7",
                    fontFamily: "Alkhemikal",
                }
            )
            .setResolution(2)
            .setOrigin(0, 1)
            .setRotation(Math.PI / 2);

        const attackTextMask = this.scene.add
            .rectangle(
                ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width,
                ATTACK_FIELD_CONFIG.y,
                40,
                ATTACK_FIELD_CONFIG.height
            )
            .setOrigin(0, 0)
            .setFillStyle(0x000000)
            .setVisible(false)
            .createGeometryMask();
        attackText.setMask(attackTextMask);

        this.scene.add.tween({
            targets: attackText,
            y: ATTACK_FIELD_CONFIG.y,
            duration: 6000,
            repeat: -1,
        });
    }

    update() {
        this.graphics.clear();

        if (this.draggedCardTarget) {
            const polygonPoints =
                this.draggedCardTarget === "attack"
                    ? [
                          0,
                          0,
                          ATTACK_FIELD_CONFIG.x,
                          0,
                          ATTACK_FIELD_CONFIG.x,
                          ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height,
                          ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width,
                          ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height,
                          ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width,
                          ATTACK_FIELD_CONFIG.y,
                          ATTACK_FIELD_CONFIG.x,
                          ATTACK_FIELD_CONFIG.y,
                          ATTACK_FIELD_CONFIG.x,
                          0,
                          this.scene.scene.systems.scale.width,
                          0,
                          this.scene.scene.systems.scale.width,
                          this.scene.scene.systems.scale.height,
                          0,
                          this.scene.scene.systems.scale.height,
                      ]
                    : [
                          0,
                          0,
                          DEFENSE_FIELD_CONFIG.x,
                          0,
                          DEFENSE_FIELD_CONFIG.x,
                          DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height,
                          DEFENSE_FIELD_CONFIG.x + DEFENSE_FIELD_CONFIG.width,
                          DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height,
                          DEFENSE_FIELD_CONFIG.x + DEFENSE_FIELD_CONFIG.width,
                          DEFENSE_FIELD_CONFIG.y,
                          DEFENSE_FIELD_CONFIG.x,
                          DEFENSE_FIELD_CONFIG.y,
                          DEFENSE_FIELD_CONFIG.x,
                          0,
                          this.scene.scene.systems.scale.width,
                          0,
                          this.scene.scene.systems.scale.width,
                          this.scene.scene.systems.scale.height,
                          0,
                          this.scene.scene.systems.scale.height,
                      ];

            const polygonMask = new Phaser.Geom.Polygon(polygonPoints);
            this.graphics.fillStyle(0x000000, 0.4);
            this.graphics.fillPoints(polygonMask.points, true, true);

            if (this.draggedCardTarget === "attack") {
                if (this.isAttackFieldHovered) {
                    this.graphics.fillStyle(0xffffff, 0.25);
                    this.graphics.fillRectShape(
                        new Phaser.Geom.Rectangle(
                            ATTACK_FIELD_CONFIG.x,
                            ATTACK_FIELD_CONFIG.y,
                            ATTACK_FIELD_CONFIG.width,
                            ATTACK_FIELD_CONFIG.height
                        )
                    );
                }
            } else {
                if (this.defenseFieldHoveredTile) {
                    this.graphics.fillStyle(0xffffff, 0.25);
                    this.graphics.fillRectShape(
                        new Phaser.Geom.Rectangle(
                            DEFENSE_FIELD_CONFIG.x +
                                this.defenseFieldHoveredTile.x *
                                    DEFENSE_FIELD_CONFIG.squareSize,
                            DEFENSE_FIELD_CONFIG.y +
                                this.defenseFieldHoveredTile.y *
                                    DEFENSE_FIELD_CONFIG.squareSize,
                            20,
                            20
                        )
                    );
                }
            }
        }
    }
}
