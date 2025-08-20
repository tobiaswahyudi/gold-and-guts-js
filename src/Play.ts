import { createCard } from "./createCard";
import { Battlefield } from "./battlefield/battlefield";
import Phaser from "phaser";

export class Play extends Phaser.Scene {
    graphics: Phaser.GameObjects.Graphics;

    cards: ReturnType<typeof createCard>[] = [];

    hoveredCardIndex = -1;
    draggedCardIndex = -1;
    dragStartPosition = { x: 0, y: 0 };

    isAttackFieldHovered = false;

    attackField: Phaser.GameObjects.Grid;
    defenseField: Phaser.GameObjects.Grid;

    dragArrow: Phaser.Curves.Curve | null = null;

    battlefield: Battlefield;

    // Grid configuration
    DEFENSE_FIELD = {
        x: 100,
        y: 32,
        width: 400,
        height: 400,
    };

    ATTACK_FIELD = {
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
        if (this.draggedCardIndex !== -1) return false;
        this.hoveredCardIndex = cardIndex;
        this.arrangeCards();
        return true;
    }

    dragCard(cardIndex: number) {
        this.draggedCardIndex = cardIndex;
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
                this.DEFENSE_FIELD.x + this.DEFENSE_FIELD.width / 2,
                this.DEFENSE_FIELD.y + this.DEFENSE_FIELD.height / 2,
                this.DEFENSE_FIELD.width,
                this.DEFENSE_FIELD.height,
                20,
                20
            )
            .setFillStyle(0x6f947f)
            .setAltFillStyle(0x698c78)
            .setOutlineStyle()
            .setInteractive();

        this.attackField = this.add
            .grid(
                this.ATTACK_FIELD.x + this.ATTACK_FIELD.width / 2,
                this.ATTACK_FIELD.y + this.ATTACK_FIELD.height / 2,
                this.ATTACK_FIELD.width,
                this.ATTACK_FIELD.height,
                20,
                20
            )
            .setFillStyle(0xe0bfa7)
            .setAltFillStyle(0xd6b6a0)
            .setOutlineStyle()
            .setInteractive();

        const defendText = this.add
            .text(
                this.DEFENSE_FIELD.x,
                this.DEFENSE_FIELD.y + this.DEFENSE_FIELD.height + 130,
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
                this.DEFENSE_FIELD.x,
                this.DEFENSE_FIELD.y,
                40,
                this.DEFENSE_FIELD.height
            )
            .setOrigin(1, 0)
            .setFillStyle(0x000000)
            .setVisible(false)
            .createGeometryMask();
        defendText.setMask(defendTextMask);

        this.add.tween({
            targets: defendText,
            y: this.DEFENSE_FIELD.y + this.DEFENSE_FIELD.height,
            duration: 6000,
            repeat: -1,
        });

        const attackText = this.add
            .text(
                this.ATTACK_FIELD.x + this.ATTACK_FIELD.width,
                this.ATTACK_FIELD.y - 136,
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
                this.ATTACK_FIELD.x + this.ATTACK_FIELD.width,
                this.ATTACK_FIELD.y,
                40,
                this.ATTACK_FIELD.height
            )
            .setOrigin(0, 0)
            .setFillStyle(0x000000)
            .setVisible(false)
            .createGeometryMask();
        attackText.setMask(attackTextMask);

        this.add.tween({
            targets: attackText,
            y: this.ATTACK_FIELD.y,
            duration: 6000,
            repeat: -1,
        });

        this.physics.world.setBounds(
            this.ATTACK_FIELD.x,
            this.ATTACK_FIELD.y,
            this.ATTACK_FIELD.width,
            this.ATTACK_FIELD.height
        );

        this.battlefield = new Battlefield(this);
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
    }

    handleCardDrag(
        pointer: any,
        _gameObject: any,
        dragX: number,
        dragY: number
    ) {
        this.dragCard(this.hoveredCardIndex);
        const card = this.cards[this.draggedCardIndex].gameObject;

        const arrowTail = new Phaser.Math.Vector2(card.x, card.y - 100);
        const arrowHead = this.isAttackFieldHovered
            ? new Phaser.Math.Vector2(
                  this.ATTACK_FIELD.x + this.ATTACK_FIELD.width / 2,
                  this.ATTACK_FIELD.y + this.ATTACK_FIELD.height / 2
              )
            : new Phaser.Math.Vector2(pointer.x, pointer.y);

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
        if (this.draggedCardIndex === -1) return;
        const card = this.cards[this.draggedCardIndex].gameObject;

        const isAttackFieldCard = card.getData("cardTarget") === "attack";

        if (isAttackFieldCard && this.isAttackFieldHovered) {
            this.battlefield.spawnMinions();
        }

        this.draggedCardIndex = -1;
        this.arrangeCards();
        this.dragArrow = null;
    }

    setupListeners() {
        this.input.on("drag", this.handleCardDrag.bind(this));
        this.input.on("dragend", this.handleCardDragEnd.bind(this));

        this.attackField.on("pointerover", () => {
            this.isAttackFieldHovered = true;
            console.log("attack field hovered");
        });
        this.attackField.on("pointerout", () => {
            this.isAttackFieldHovered = false;
        });
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

            const card = this.cards[this.draggedCardIndex].gameObject;

            const isAttackFieldCard = card.getData("cardTarget") === "attack";

            const polygonPoints = isAttackFieldCard
                ? [
                      0,
                      0,
                      this.ATTACK_FIELD.x,
                      0,
                      this.ATTACK_FIELD.x,
                      this.ATTACK_FIELD.y + this.ATTACK_FIELD.height,
                      this.ATTACK_FIELD.x + this.ATTACK_FIELD.width,
                      this.ATTACK_FIELD.y + this.ATTACK_FIELD.height,
                      this.ATTACK_FIELD.x + this.ATTACK_FIELD.width,
                      this.ATTACK_FIELD.y,
                      this.ATTACK_FIELD.x,
                      this.ATTACK_FIELD.y,
                      this.ATTACK_FIELD.x,
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
                      this.DEFENSE_FIELD.x,
                      0,
                      this.DEFENSE_FIELD.x,
                      this.DEFENSE_FIELD.y + this.DEFENSE_FIELD.height,
                      this.DEFENSE_FIELD.x + this.DEFENSE_FIELD.width,
                      this.DEFENSE_FIELD.y + this.DEFENSE_FIELD.height,
                      this.DEFENSE_FIELD.x + this.DEFENSE_FIELD.width,
                      this.DEFENSE_FIELD.y,
                      this.DEFENSE_FIELD.x,
                      this.DEFENSE_FIELD.y,
                      this.DEFENSE_FIELD.x,
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

            if (isAttackFieldCard) {
                if (this.isAttackFieldHovered) {
                    this.graphics.fillStyle(0xffffff, 0.2);
                    this.graphics.fillRectShape(
                        new Phaser.Geom.Rectangle(
                            this.ATTACK_FIELD.x,
                            this.ATTACK_FIELD.y,
                            this.ATTACK_FIELD.width,
                            this.ATTACK_FIELD.height
                        )
                    );
                }
            }
        }
    }
}
