import { createCard } from "./createCard";
import { Battlefield } from "./battlefield/battlefield";
import Phaser from "phaser";
import { Card } from "./createCard";
import {
    ATTACK_FIELD_CONFIG,
    ATTACK_FIELD_DISPLAY,
    DEFENSE_FIELD_CONFIG,
    DEFENSE_FIELD_DISPLAY,
} from "./battlefield/constants";

export class Play extends Phaser.Scene {
    graphics: Phaser.GameObjects.Graphics;

    cards: Card[] = [];

    hoveredCardIndex = -1;
    draggedCard: Card | null = null;
    draggedCardIsAttack: boolean = false;
    dragStartPosition = { x: 0, y: 0 };

    isAttackFieldHovered = false;
    defenseFieldHoveredTile: { x: number; y: number } | null = null;

    attackField: Phaser.GameObjects.Grid;
    defenseField: Phaser.GameObjects.Grid;

    dragArrow: Phaser.Curves.Curve | null = null;

    attackBattlefield: Battlefield;
    defenseBattlefield: Battlefield;

    constructor() {
        super({
            key: "Play",
        });
    }

    hoverCard(cardIndex: number) {
        if (this.draggedCard !== null) return false;
        this.hoveredCardIndex = cardIndex;
        this.arrangeCards();
        return true;
    }

    dragCard(cardIndex: number) {
        this.draggedCard = this.cards[cardIndex];
    }

    init() {
        this.cameras.main.fadeIn(500);
    }

    create() {
        this.graphics = this.add.graphics().setDepth(1000);

        this.setupBattlefields();
        this.setupResourcesUi();
        this.setupCards();

        this.setupListeners();
    }

    setupBattlefields() {
        this.defenseField = this.add
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
            .setInteractive();

        this.attackField = this.add
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
            .setInteractive();

        const defendText = this.add
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

        const defendTextMask = this.add
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

        this.add.tween({
            targets: defendText,
            y: DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height,
            duration: 6000,
            repeat: -1,
        });

        const attackText = this.add
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

        const attackTextMask = this.add

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

        this.add.tween({
            targets: attackText,
            y: ATTACK_FIELD_CONFIG.y,
            duration: 6000,
            repeat: -1,
        });

        this.attackBattlefield = new Battlefield(
            this,
            ATTACK_FIELD_CONFIG,
            ATTACK_FIELD_DISPLAY
        );

        this.defenseBattlefield = new Battlefield(
            this,
            DEFENSE_FIELD_CONFIG,
            DEFENSE_FIELD_DISPLAY
        );
    }

    setupResourcesUi() {
        this.add.sprite(50, 570, "crest").setDisplaySize(60, 100);

        this.add
            .text(90, 520, "House Toadsworth of Lyria")
            .setColor("#ffffff")
            .setFontSize(14)
            .setFontFamily("Alkhemikal")
            .setAlign("left")
            .setResolution(4)
            .setOrigin(0, 0);

        this.add.sprite(104, 556, "gold").setDisplaySize(32, 32);
        this.add.sprite(104, 591, "guts").setDisplaySize(32, 32);

        this.add
            .text(124, 556, "164 Gold")
            .setColor("#D6B41D")
            .setFontSize(32)
            .setFontFamily("Alkhemikal")
            .setAlign("right")
            .setResolution(4)
            .setOrigin(0, 0.5);

        this.add
            .text(124, 591, "033 Guts")
            .setColor("#E8298F")
            .setFontSize(32)
            .setFontFamily("Alkhemikal")
            .setAlign("right")
            .setResolution(4)
            .setOrigin(0, 0.5);
    }

    setupCards() {
        this.addCard();
        this.addCard();
        this.addCard();
        this.addCard();
        this.addCard();

        this.arrangeCards();
    }

    handleCardDrag(
        pointer: any,
        _gameObject: any,
        dragX: number,
        dragY: number
    ) {
        this.dragCard(this.hoveredCardIndex);
        const card = this.draggedCard!.gameObject;
        this.draggedCardIsAttack = card.getData("cardTarget") === "attack";

        const arrowTail = new Phaser.Math.Vector2(card.x, card.y - 100);
        let arrowHead = new Phaser.Math.Vector2(pointer.x, pointer.y);

        if (this.draggedCardIsAttack && this.isAttackFieldHovered) {
            arrowHead = new Phaser.Math.Vector2(
                ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width / 2,
                ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height / 2
            );
        }

        if (!this.draggedCardIsAttack && this.defenseFieldHoveredTile) {
            arrowHead = new Phaser.Math.Vector2(
                DEFENSE_FIELD_CONFIG.x +
                    DEFENSE_FIELD_CONFIG.squareSize *
                        this.defenseFieldHoveredTile.x +
                    10,
                DEFENSE_FIELD_CONFIG.y +
                    DEFENSE_FIELD_CONFIG.squareSize *
                        this.defenseFieldHoveredTile.y +
                    10
            );
        }

        const dragDistance = arrowHead.distance(arrowTail);

        const controlPointDistance = Math.min(
            (dragDistance * dragDistance) / 150,
            150
        );
        const controlPoint = new Phaser.Math.Vector2(0, -controlPointDistance);

        this.dragArrow = new Phaser.Curves.QuadraticBezier(
            arrowTail,
            arrowTail.clone().add(controlPoint),
            arrowHead
        );
    }

    handleCardDragEnd() {
        if (this.draggedCard === null) return;
        const card = this.draggedCard.gameObject;

        if (this.draggedCardIsAttack && this.isAttackFieldHovered) {
            this.attackBattlefield.spawnMinions();

            card.destroy();
            this.cards = this.cards.filter((c) => c.gameObject !== card);

            this.addCard();
        }
        if (!this.draggedCardIsAttack && this.defenseFieldHoveredTile) {
            this.defenseBattlefield.spawnTower(
                this.defenseFieldHoveredTile.x,
                this.defenseFieldHoveredTile.y
            );

            card.destroy();
            this.cards = this.cards.filter((c) => c.gameObject !== card);

            this.addCard();
        }

        this.draggedCard = null;
        this.hoveredCardIndex = -1;
        this.arrangeCards();
        this.dragArrow = null;
    }

    setupListeners() {
        this.input.on("drag", this.handleCardDrag.bind(this));
        this.input.on("dragend", this.handleCardDragEnd.bind(this));

        this.attackField.on("pointerover", () => {
            this.isAttackFieldHovered = true;
        });
        this.attackField.on("pointerout", () => {
            this.isAttackFieldHovered = false;
        });

        this.defenseField.on(
            "pointermove",
            (pointer: Phaser.Input.Pointer, x: number, y: number) => {
                this.defenseFieldHoveredTile = {
                    x: Math.floor(x / 20),
                    y: Math.floor(y / 20),
                };
            }
        );
        this.defenseField.on("pointerout", () => {
            this.defenseFieldHoveredTile = null;
        });
    }

    addCard() {
        const cardTarget = Math.random() > 0.5 ? "attack" : "defense";
        let cardName = "";
        let cardImage = "";
        let cardDescription = "";

        if (cardTarget === "attack") {
            cardName = "Minion A ×3";
            cardImage = "💂‍♂️";
            cardDescription =
                "Spawns 3 minions. They attack the enemy base. They are not very strong.";
        } else {
            cardName = "Tower A";
            cardImage = "🏹";
            cardDescription =
                "Builds a tower. It defends your base. It is not very strong.";
        }

        this.cards.push(
            createCard({
                scene: this,
                x: 150,
                y: 540,
                selectCard: this.hoverCard.bind(this),
                cardName,
                cardImage,
                cardDescription,
                cardTarget,
            })
        );
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

            if (
                this.hoveredCardIndex != -1 &&
                this.hoveredCardIndex !== index
            ) {
                shimmyOver =
                    this.hoveredCardIndex < index ? SHIMMY_OVER : -SHIMMY_OVER;
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

    update() {
        this.graphics.clear();

        this.defenseBattlefield.update();
        this.attackBattlefield.update();

        if (this.dragArrow) {
            const ARROW_THICKNESS = 8;

            this.graphics.lineStyle(ARROW_THICKNESS, 0x594a3e, 1);
            this.dragArrow.draw(this.graphics);

            const tangentHead = this.dragArrow
                .getTangentAt(1)
                .scale(ARROW_THICKNESS * 3);
            const head = this.dragArrow.getPointAt(1);

            new Phaser.Curves.Line(
                head,
                head.clone().add(tangentHead.rotate(Math.PI * 0.85))
            ).draw(this.graphics);
            new Phaser.Curves.Line(
                head,
                head.clone().add(tangentHead.rotate(Math.PI * 0.3))
            ).draw(this.graphics);

            // should also have card

            const card = this.draggedCard!.gameObject;

            const polygonPoints = this.draggedCardIsAttack
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
                      this.scene.systems.scale.width,
                      0,
                      this.scene.systems.scale.width,
                      this.scene.systems.scale.height,
                      0,
                      this.scene.systems.scale.height,
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
                      this.scene.systems.scale.width,
                      0,
                      this.scene.systems.scale.width,
                      this.scene.systems.scale.height,
                      0,
                      this.scene.systems.scale.height,
                  ];

            const polygonMask = new Phaser.Geom.Polygon(polygonPoints);
            this.graphics.fillStyle(0x000000, 0.4);
            this.graphics.fillPoints(polygonMask.points, true, true);

            if (this.draggedCardIsAttack) {
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
