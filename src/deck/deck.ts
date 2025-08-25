import { Card } from "./types";
import { DeckUI } from "./deckUi";

/**
 * Manages the display & logic of the card deck.
 */
export class Deck {
    scene: Phaser.Scene;
    fullDeck: Card[];
    drawPile: Card[];
    discardPile: Card[];
    deckUi: DeckUI;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.fullDeck = [];
        this.drawPile = [];
        this.discardPile = [];

        this.deckUi = new DeckUI(scene);
    }

    shuffleDeck() {
        this.drawPile = [...this.fullDeck].sort(() => Math.random() - 0.5);
        this.discardPile = [];
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

        this.deckUi.addCard({
            id: "hgawkuhdkjadkakdbakd",
            cardName,
            cardImage,
            cardDescription,
            cardTarget,
        });
    }
}