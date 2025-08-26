import { StateManagers } from "./types";
import { CardDisplay, createDisplayCard } from "../deck/createCard";
import { Card } from "../deck/types";

const deg2Rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Logic is as follows:
 * - A total arc size for the entire hand is set.
 * - A maximum arc size for a single card is set. This prevents absurdly large cards for small hands.
 * - When a card is hovered/selected, it is enlarged to the set scale.
 * - When a card is selected, all other cards are shrunk so that the total arc size is maintained. There is no minimum size.
 *
 * Maybe this logic can be altered later when we playtest with very large hands. For now it's good enough.
 */

const HAND_TOTAL_ARCDEG = deg2Rad(15);
const MAX_CARD_ARCDEG = deg2Rad(3);
const SELECTED_CARD_ARCDEG = deg2Rad(4);

// The radius of the circle that the cards are arranged on.
const CARD_ARC_RADIUS = 2000;

export interface HandUIHandlers {
    dragCard: (card: Card) => void;
    releaseCard: () => void;
//     playCard: (card: Card) => void;
//     clickCard: (card: Card) => void;
}

export class HandUI {
    scene: Phaser.Scene;
    cards: CardDisplay[];
    hoveredCardIndex: number;
    draggedCardIndex: number;
    handlers: HandUIHandlers;
    managers: StateManagers;

    dragStartPosition = { x: 0, y: 0 };

    constructor(
        scene: Phaser.Scene,
        managers: StateManagers,
        handlers: HandUIHandlers
    ) {
        this.scene = scene;
        this.cards = [];
        this.hoveredCardIndex = -1;
        this.draggedCardIndex = -1;
        this.handlers = handlers;
        this.managers = managers;

        this.scene.input.on("dragend", this.endDragCard.bind(this));
    }

    addCard(card: Card) {
        const cardDisplay = createDisplayCard({
            scene: this.scene,
            x: 150,
            y: 540,
            card,
        });

        this.cards.push(cardDisplay);

        cardDisplay.rectangle.on(Phaser.Input.Events.POINTER_OVER, () => {
            const index = this.cards.indexOf(cardDisplay);
            this.hoverCard(index);
            // console.log("pointer over", index, this.hoveredCardIndex)
            this.scene.input.setDefaultCursor("pointer");
        });

        cardDisplay.rectangle.on(Phaser.Input.Events.POINTER_OUT, () => {
            // console.log("pointer out", this.draggedCardIndex)
            if(this.draggedCardIndex !== -1) return;
            this.unhoverCard();
            this.scene.input.setDefaultCursor("default");
        });

        cardDisplay.rectangle.on(Phaser.Input.Events.POINTER_UP, this.endDragCard.bind(this));

        cardDisplay.rectangle.on(Phaser.Input.Events.POINTER_DOWN, this.startDragCard.bind(this));

        // cardDisplay.rectangle.input.

        this.arrangeCards();
    }

    arrangeCards() {
        const cardCount = this.cards.length;
        const handTotalArcDeg = Math.min(
            HAND_TOTAL_ARCDEG,
            MAX_CARD_ARCDEG * cardCount
        );
        let arcDeg = -handTotalArcDeg / 2;

        const ARC_CENTER = {
            x: 512,
            y: 540 + CARD_ARC_RADIUS,
        };

        const nothingSelectedArcDeg = Math.min(
            MAX_CARD_ARCDEG,
            handTotalArcDeg / cardCount
        );
        const unselectedArcDeg =
            this.hoveredCardIndex === -1
                ? nothingSelectedArcDeg
                : (handTotalArcDeg - SELECTED_CARD_ARCDEG) / (cardCount - 1);

        this.cards.forEach(({ gameObject }, index) => {
            const angle =
                this.hoveredCardIndex === index
                    ? SELECTED_CARD_ARCDEG
                    : unselectedArcDeg;

            arcDeg += angle / 2;

            const scale = angle / MAX_CARD_ARCDEG;

            const radius =
                this.hoveredCardIndex === index
                    ? CARD_ARC_RADIUS + (160 * (scale - 1)) / 2
                    : CARD_ARC_RADIUS;

            const x = ARC_CENTER.x + Math.sin(arcDeg) * radius;
            const y = ARC_CENTER.y - Math.cos(arcDeg) * radius;

            this.scene.add.tween({
                targets: gameObject,
                y,
                x,
                scale,
                rotation: arcDeg,
                duration: 100,
                ease: "Power2.easeInOut",
            });

            arcDeg += angle / 2;
        });
    }

    hoverCard(index: number) {
        if (this.draggedCardIndex !== -1) return;
        if (this.hoveredCardIndex === index) return;
        this.hoveredCardIndex = index;
        this.arrangeCards();
    }

    unhoverCard() {
        if (this.hoveredCardIndex === -1) return;
        this.hoveredCardIndex = -1;
        this.arrangeCards();
    }

    startDragCard(pointer: Phaser.Input.Pointer) {
        this.dragStartPosition = { x: pointer.x, y: pointer.y };
        this.draggedCardIndex = this.hoveredCardIndex;
        // console.log("start drag card", this.hoveredCardIndex, this.draggedCardIndex, this.draggedCard, this.dragStartPosition);
        this.arrangeCards();
        this.handlers.dragCard(this.draggedCard!);
    }

    endDragCard(pointer: Phaser.Input.Pointer = {x: -1, y: -1} as any as Phaser.Input.Pointer) {
        // console.log("up", pointer, args)
        if(this.draggedCardIndex === -1) return;
        if(pointer.x === this.dragStartPosition.x && pointer.y === this.dragStartPosition.y) return;

        this.handlers.releaseCard();

        this.hoveredCardIndex = -1;
        this.draggedCardIndex = -1;
        // console.log("end drag card", this.draggedCard);

        this.arrangeCards();
    }

    playCard() {
        const cardObject = this.cards[this.draggedCardIndex];
        this.cards.splice(this.draggedCardIndex, 1);

        cardObject.gameObject.destroy();

        console.log("play card", cardObject.card, this.draggedCardIndex);

        this.endDragCard();
    }

    get draggedCard() {
        return this.draggedCardIndex === -1
            ? null
            : this.managers.deck.hand[this.draggedCardIndex];
    }

    get draggedCardDisplay() {
        return this.draggedCardIndex === -1
            ? null
            : this.cards[this.draggedCardIndex].gameObject;
    }
}
