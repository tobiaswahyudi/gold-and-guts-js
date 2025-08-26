import Phaser from "phaser";

import {
    ATTACK_FIELD_CONFIG,
    ATTACK_FIELD_DISPLAY,
    DEFENSE_FIELD_CONFIG,
    DEFENSE_FIELD_DISPLAY,
} from "./battlefield/constants";

import { Battlefield } from "./battlefield/battlefield";
import { Deck } from "./deck/deck";
import { UIControl } from "./ui/uiControl";

export class Play extends Phaser.Scene {
    graphics: Phaser.GameObjects.Graphics;

    deck: Deck;

    uiControl: UIControl;

    attackBattlefield: Battlefield;
    defenseBattlefield: Battlefield;

    constructor() {
        super({
            key: "Play",
        });
    }

    // hoverCard(cardIndex: number) {
    //     if (this.draggedCard !== null) return false;
    //     this.hoveredCardIndex = cardIndex;
    //     return true;
    // }

    // dragCard(cardIndex: number) {
    //     this.draggedCard = this.cards[cardIndex];
    // }

    init() {
        this.cameras.main.fadeIn(500);
    }

    create() {
        this.graphics = this.add.graphics().setDepth(1000);

        this.deck = new Deck(this);
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

        const managers = {
            deck: this.deck,
            attackBattlefield: this.attackBattlefield,
            defenseBattlefield: this.defenseBattlefield,
        };

        this.uiControl = new UIControl(this, managers);

        this.setupResourcesUi();
        this.setupCards();

        // this.setupListeners();
        this.setupEnemyAction();
    }

    setupEnemyAction() {
        this.time.addEvent({
            delay: 3000,
            callback: this.enemyAction.bind(this),
            loop: true,
        });
    }

    enemyAction() {
        const action = Math.random() > 0.5 ? "spawn" : "attack";
        // console.log("enemy action", action);
        if (action === "spawn") {
            this.defenseBattlefield.spawnMinions();
        } else {
            const randomRow = Math.floor(
                Math.random() * ATTACK_FIELD_CONFIG.gridSize
            );
            const randomColumn = Math.floor(
                Math.random() * ATTACK_FIELD_CONFIG.gridSize
            );
            this.attackBattlefield.spawnTower(randomRow, randomColumn);
        }
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
        // this.deck.addCard();
        // this.deck.addCard();
        // this.deck.addCard();
        // this.deck.addCard();
        // this.deck.addCard();
    }

    // handleCardDrag(
    //     pointer: any,
    //     _gameObject: any,
    //     dragX: number,
    //     dragY: number
    // ) {
    //     this.dragCard(this.hoveredCardIndex);
    //     const card = this.draggedCard!.gameObject;
    //     this.draggedCardIsAttack = card.getData("cardTarget") === "attack";

    //     const arrowTail = new Phaser.Math.Vector2(card.x, card.y - 100);
    //     let arrowHead = new Phaser.Math.Vector2(pointer.x, pointer.y);

    //     if (this.draggedCardIsAttack && this.isAttackFieldHovered) {
    //         arrowHead = new Phaser.Math.Vector2(
    //             ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width / 2,
    //             ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height / 2
    //         );
    //     }

    //     if (!this.draggedCardIsAttack && this.defenseFieldHoveredTile) {
    //         arrowHead = new Phaser.Math.Vector2(
    //             DEFENSE_FIELD_CONFIG.x +
    //                 DEFENSE_FIELD_CONFIG.squareSize *
    //                     this.defenseFieldHoveredTile.x +
    //                 10,
    //             DEFENSE_FIELD_CONFIG.y +
    //                 DEFENSE_FIELD_CONFIG.squareSize *
    //                     this.defenseFieldHoveredTile.y +
    //                 10
    //         );
    //     }

    //     const dragDistance = arrowHead.distance(arrowTail);

    //     const controlPointDistance = Math.min(
    //         (dragDistance * dragDistance) / 150,
    //         150
    //     );
    //     const controlPoint = new Phaser.Math.Vector2(0, -controlPointDistance);

    //     this.dragArrow = new Phaser.Curves.QuadraticBezier(
    //         arrowTail,
    //         arrowTail.clone().add(controlPoint),
    //         arrowHead
    //     );
    // }

    // handleCardDragEnd() {
    //     if (this.draggedCard === null) return;
    //     const card = this.draggedCard.gameObject;

    //     if (this.draggedCardIsAttack && this.isAttackFieldHovered) {
    //         this.attackBattlefield.spawnMinions();

    //         card.destroy();
    //         this.cards = this.cards.filter((c) => c.gameObject !== card);

    //         this.addCard();
    //     }
    //     if (!this.draggedCardIsAttack && this.defenseFieldHoveredTile) {
    //         this.defenseBattlefield.spawnTower(
    //             this.defenseFieldHoveredTile.x,
    //             this.defenseFieldHoveredTile.y
    //         );

    //         card.destroy();
    //         this.cards = this.cards.filter((c) => c.gameObject !== card);

    //         this.addCard();
    //     }

    //     this.draggedCard = null;
    //     this.hoveredCardIndex = -1;
    //     this.arrangeCards();
    //     this.dragArrow = null;
    // }

    // setupListeners() {
    //     this.input.on("drag", this.handleCardDrag.bind(this));
    //     this.input.on("dragend", this.handleCardDragEnd.bind(this));

    //     this.attackField.on("pointerover", () => {
    //         this.isAttackFieldHovered = true;
    //     });
    //     this.attackField.on("pointerout", () => {
    //         this.isAttackFieldHovered = false;
    //     });

    //     this.defenseField.on(
    //         "pointermove",
    //         (pointer: Phaser.Input.Pointer, x: number, y: number) => {
    //             this.defenseFieldHoveredTile = {
    //                 x: Math.floor(x / 20),
    //                 y: Math.floor(y / 20),
    //             };
    //         }
    //     );
    //     this.defenseField.on("pointerout", () => {
    //         this.defenseFieldHoveredTile = null;
    //     });
    // }

    update() {
        //     this.graphics.clear();

        this.deck.update();

        this.defenseBattlefield.update();
        this.attackBattlefield.update();

        this.uiControl.update();

        //     if (this.dragArrow) {
        //         const ARROW_THICKNESS = 8;

        //         this.graphics.lineStyle(ARROW_THICKNESS, 0x594a3e, 1);
        //         this.dragArrow.draw(this.graphics);

        //         const tangentHead = this.dragArrow
        //             .getTangentAt(1)
        //             .scale(ARROW_THICKNESS * 3);
        //         const head = this.dragArrow.getPointAt(1);

        //         new Phaser.Curves.Line(
        //             head,
        //             head.clone().add(tangentHead.rotate(Math.PI * 0.85))
        //         ).draw(this.graphics);
        //         new Phaser.Curves.Line(
        //             head,
        //             head.clone().add(tangentHead.rotate(Math.PI * 0.3))
        //         ).draw(this.graphics);

        //         // should also have card

        //         // const card = this.draggedCard!.gameObject;

        //         const polygonPoints = this.draggedCardIsAttack
        //             ? [
        //                   0,
        //                   0,
        //                   ATTACK_FIELD_CONFIG.x,
        //                   0,
        //                   ATTACK_FIELD_CONFIG.x,
        //                   ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height,
        //                   ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width,
        //                   ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height,
        //                   ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width,
        //                   ATTACK_FIELD_CONFIG.y,
        //                   ATTACK_FIELD_CONFIG.x,
        //                   ATTACK_FIELD_CONFIG.y,
        //                   ATTACK_FIELD_CONFIG.x,
        //                   0,
        //                   this.scene.systems.scale.width,
        //                   0,
        //                   this.scene.systems.scale.width,
        //                   this.scene.systems.scale.height,
        //                   0,
        //                   this.scene.systems.scale.height,
        //               ]
        //             : [
        //                   0,
        //                   0,
        //                   DEFENSE_FIELD_CONFIG.x,
        //                   0,
        //                   DEFENSE_FIELD_CONFIG.x,
        //                   DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height,
        //                   DEFENSE_FIELD_CONFIG.x + DEFENSE_FIELD_CONFIG.width,
        //                   DEFENSE_FIELD_CONFIG.y + DEFENSE_FIELD_CONFIG.height,
        //                   DEFENSE_FIELD_CONFIG.x + DEFENSE_FIELD_CONFIG.width,
        //                   DEFENSE_FIELD_CONFIG.y,
        //                   DEFENSE_FIELD_CONFIG.x,
        //                   DEFENSE_FIELD_CONFIG.y,
        //                   DEFENSE_FIELD_CONFIG.x,
        //                   0,
        //                   this.scene.systems.scale.width,
        //                   0,
        //                   this.scene.systems.scale.width,
        //                   this.scene.systems.scale.height,
        //                   0,
        //                   this.scene.systems.scale.height,
        //               ];

        //         const polygonMask = new Phaser.Geom.Polygon(polygonPoints);
        //         this.graphics.fillStyle(0x000000, 0.4);
        //         this.graphics.fillPoints(polygonMask.points, true, true);

        //         if (this.draggedCardIsAttack) {
        //             if (this.isAttackFieldHovered) {
        //                 this.graphics.fillStyle(0xffffff, 0.25);
        //                 this.graphics.fillRectShape(
        //                     new Phaser.Geom.Rectangle(
        //                         ATTACK_FIELD_CONFIG.x,
        //                         ATTACK_FIELD_CONFIG.y,
        //                         ATTACK_FIELD_CONFIG.width,
        //                         ATTACK_FIELD_CONFIG.height
        //                     )
        //                 );
        //             }
        //         } else {
        //             if (this.defenseFieldHoveredTile) {
        //                 this.graphics.fillStyle(0xffffff, 0.25);
        //                 this.graphics.fillRectShape(
        //                     new Phaser.Geom.Rectangle(
        //                         DEFENSE_FIELD_CONFIG.x +
        //                             this.defenseFieldHoveredTile.x *
        //                                 DEFENSE_FIELD_CONFIG.squareSize,
        //                         DEFENSE_FIELD_CONFIG.y +
        //                             this.defenseFieldHoveredTile.y *
        //                                 DEFENSE_FIELD_CONFIG.squareSize,
        //                         20,
        //                         20
        //                     )
        //                 );
        //             }
        //         }
        //     }
    }
}
