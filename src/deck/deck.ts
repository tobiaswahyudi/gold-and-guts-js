import { Card, CardFieldTarget } from "./types";
import { DeckUI } from "./deckUi";
import { generateId } from "../utils/id";

const DEBUG = true;

const DECKLIST_X = 1000;
const DECKLIST_Y = 32;

const DECKLIST_ITEM_HEIGHT = 24;
const DECKLIST_ITEM_WIDTH = 180;

const HAND_COLOR = "#F0E768";
const DRAW_COLOR = "#FFFFFF";
const DISCARD_COLOR = "#565656";

const handColor = Phaser.Display.Color.HexStringToColor(HAND_COLOR);
const drawColor = Phaser.Display.Color.HexStringToColor(DRAW_COLOR);
const discardColor = Phaser.Display.Color.HexStringToColor(DISCARD_COLOR);

const deckListItem = (scene: Phaser.Scene, text: string) => {
    const textObj = scene.add
        .text(10, 0, text, {
            color: "#ffffff",
            align: "left",
        })
        .setOrigin(0, 0.5);
    const rectangle = scene.add
        .rectangle(0, 0, DECKLIST_ITEM_WIDTH, DECKLIST_ITEM_HEIGHT)
        .setOrigin(0, 0.5)
        .setStrokeStyle(1, 0xffffff, 1);

    const container = scene.add.container(DECKLIST_X, DECKLIST_Y, [
        textObj,
        rectangle,
    ]);

    return {
        container,
        text: textObj,
        rectangle,
    };
};

type DeckListItem = ReturnType<typeof deckListItem>;

/**
 * Manages the display & logic of the card deck.
 */
export class Deck {
    scene: Phaser.Scene;

    fullDeck: Card[];
    drawPile: Card[];
    discardPile: Card[];
    hand: Card[];

    deckUi: DeckUI;

    deckList: Map<string, DeckListItem>;
    deckListGraphics: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.fullDeck = [];
        this.drawPile = [];
        this.discardPile = [];
        this.hand = [];

        this.deckUi = new DeckUI(scene, this.playCard.bind(this));

        this.deckListGraphics = scene.add.graphics().setDepth(99000);
        this.deckList = new Map();
    }

    shuffleDeck() {
        this.drawPile = [...this.fullDeck].sort(() => Math.random() - 0.5);
        this.discardPile = [];
    }

    addCard() {
        const cardTarget: CardFieldTarget =
            Math.random() > 0.5 ? "attack" : "defense";
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

        const card = {
            id: generateId(),
            cardName,
            cardImage,
            cardDescription,
            cardTarget,
        };

        this.fullDeck.push(card);
        // this.drawPile.push(card);
        this.deckUi.addCard(card);

        if (Math.random() > 0.5) {
            this.drawPile.push(card);
        } else {
            this.hand.push(card);
        }

        this.deckList.set(card.id, deckListItem(this.scene, card.cardName));

        this.updateDeckList();
    }

    playCard(card: Card) {
        this.discardPile.push(card);
        this.hand = this.hand.filter((c) => c.id !== card.id);
        this.drawPile = this.drawPile.filter((c) => c.id !== card.id); // only bc we sometimes add cards to the draw pile for debug
        this.updateDeckList();
    }

    updateDeckList() {
        if (!DEBUG) return;

        let y = 32;

        // console.log(
        //     "updateDeckList",
        //     this.hand.length,
        //     this.drawPile.length,
        //     this.discardPile.length
        // );

        this.hand.forEach((card) => {
            const item = this.deckList.get(card.id);
            if (!item) return; // shouldn't happen but just in case

            item.rectangle.strokeColor = handColor.color;
            item.text.setColor(HAND_COLOR);

            this.scene.add.tween({
                targets: item.container,
                y,
                duration: 100,
            });

            y += DECKLIST_ITEM_HEIGHT;
        });

        this.drawPile.forEach((card) => {
            const item = this.deckList.get(card.id);
            if (!item) return; // shouldn't happen but just in case

            item.rectangle.strokeColor = drawColor.color;
            item.text.setColor(DRAW_COLOR);

            this.scene.add.tween({
                targets: item.container,
                y,
                duration: 100,
            });

            y += DECKLIST_ITEM_HEIGHT;
        });

        this.discardPile.forEach((card) => {
            const item = this.deckList.get(card.id);
            if (!item) return; // shouldn't happen but just in case

            item.rectangle.strokeColor = discardColor.color;
            item.text.setColor(DISCARD_COLOR);

            this.scene.add.tween({
                targets: item.container,
                y,
                duration: 100,
            });

            y += DECKLIST_ITEM_HEIGHT;
        });
    }

    update() {
        this.deckListGraphics.clear();

        this.deckListGraphics.lineStyle(2, discardColor.color, 1);

        this.discardPile.forEach((card) => {
            const item = this.deckList.get(card.id);
            if (!item) return; // shouldn't happen but just in case

            this.deckListGraphics.lineBetween(
                DECKLIST_X + 5,
                item.container.y,
                DECKLIST_X + DECKLIST_ITEM_WIDTH - 10,
                item.container.y
            );
        });
    }
}
