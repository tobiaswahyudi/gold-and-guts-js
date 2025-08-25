import { CardDisplay, createDisplayCard } from "./createCard";
import { Card } from "./types";

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

export class DeckUI {
    scene: Phaser.Scene;
    cards: CardDisplay[];
    hoveredCardIndex: number;
    draggedCardIndex: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.cards = [];
        this.hoveredCardIndex = -1;
        this.draggedCardIndex = -1;
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
            this.hoverCard(this.cards.indexOf(cardDisplay));
            this.scene.input.setDefaultCursor("pointer");
        });

        cardDisplay.rectangle.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.unhoverCard();
            this.scene.input.setDefaultCursor("default");
        });

        cardDisplay.rectangle.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.hoveredCardIndex = -1;
            console.log("pointer down", this.cards.length);
            this.cards = this.cards.filter((c) => c.gameObject !== cardDisplay.gameObject);
            console.log("pointer down deleted", this.cards.length);
            cardDisplay.gameObject.destroy();
            this.arrangeCards();
        });

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
            x: this.scene.scale.width / 2,
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
}
