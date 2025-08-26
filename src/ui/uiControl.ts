import { StateManagers } from "./types";
import { BattlefieldUI, BattlefieldUIHandlers } from "./battlefield";
import { HandUI, HandUIHandlers } from "./hand";
import {
    ATTACK_FIELD_CONFIG,
    DEFENSE_FIELD_CONFIG,
} from "../battlefield/constants";
import { Card } from "../deck/types";
import { LAYERS } from "../utils/layers";

export class UIControl {
    scene: Phaser.Scene;

    managers: StateManagers;

    dragStartPosition = { x: 0, y: 0 };

    dragArrow: Phaser.Curves.Curve | null = null;

    battlefieldUi: BattlefieldUI;
    handUi: HandUI;

    graphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, managers: StateManagers) {
        this.scene = scene;
        this.managers = managers;

        this.graphics = scene.add.graphics().setDepth(LAYERS.UI_OVERLAY);

        const battlefieldUiHandlers: BattlefieldUIHandlers = {
            attackAction: this.playAttackCard.bind(this),
            defenseAction: this.playDefenseCard.bind(this),
        };

        this.battlefieldUi = new BattlefieldUI(scene, managers, battlefieldUiHandlers);

        const handUiHandlers: HandUIHandlers = {
            dragCard: this.flagDragCard.bind(this),
            releaseCard: this.unflagDragCard.bind(this),
            // playCard: this.managers.deck.playCard,
            // clickCard: this.managers.deck.clickCard,
        };

        this.handUi = new HandUI(scene, managers, handUiHandlers);

        this.scene.input.on(
            Phaser.Input.Events.POINTER_MOVE,
            this.handleCardDrag.bind(this)
        );

        this.battlefieldUi.defenseField.on("pointerdown", () => {
            const card = managers.deck.addCard();
            this.handUi.addCard(card);
        });
    }

    playDefenseCard(coords: {x: number, y: number}) {
        this.managers.deck.playCard(this.handUi.draggedCard!);
        this.managers.defenseBattlefield.spawnTower(coords.x, coords.y);
        this.handUi.playCard();
    }

    playAttackCard() {
        this.managers.deck.playCard(this.handUi.draggedCard!);
        this.managers.attackBattlefield.spawnMinions(3);
        this.handUi.playCard();
    }

    flagDragCard(card: Card) {
        this.battlefieldUi.setDraggedCard(card.cardTarget);
    }

    unflagDragCard() {
        this.battlefieldUi.setDraggedCard(null);
        this.dragArrow = null;
    }

    handleCardDrag(
        pointer: any,
        _gameObject: any,
        dragX: number,
        dragY: number
    ) {
        const card = this.handUi.draggedCard;

        if (card === null) return;

        const draggedCardIsAttack = card.cardTarget === "attack";

        const cardDisplay = this.handUi.draggedCardDisplay!;

        const arrowTail = new Phaser.Math.Vector2(
            cardDisplay.x,
            cardDisplay.y - 100
        );
        let arrowHead = new Phaser.Math.Vector2(pointer.x, pointer.y);

        // console.log("dragging card", card.cardName, draggedCardIsAttack, this.battlefieldUi.isAttackFieldHovered, this.battlefieldUi.defenseFieldHoveredTile)

        if (draggedCardIsAttack && this.battlefieldUi.isAttackFieldHovered) {
            arrowHead = new Phaser.Math.Vector2(
                ATTACK_FIELD_CONFIG.x + ATTACK_FIELD_CONFIG.width / 2,
                ATTACK_FIELD_CONFIG.y + ATTACK_FIELD_CONFIG.height / 2
            );
        }

        if (
            !draggedCardIsAttack &&
            this.battlefieldUi.defenseFieldHoveredTile
        ) {
            arrowHead = new Phaser.Math.Vector2(
                DEFENSE_FIELD_CONFIG.x +
                    DEFENSE_FIELD_CONFIG.squareSize *
                        this.battlefieldUi.defenseFieldHoveredTile.x +
                    10,
                DEFENSE_FIELD_CONFIG.y +
                    DEFENSE_FIELD_CONFIG.squareSize *
                        this.battlefieldUi.defenseFieldHoveredTile.y +
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

        // console.log("dragArrow", this.dragArrow)
    }

    update() {
        this.graphics.clear();

        this.battlefieldUi.update();

        if (this.dragArrow !== null) {
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
        }
    }
}
