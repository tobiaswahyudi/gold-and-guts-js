export type CardType = "minion" | "tower" | "tower-upgrade";
export type CardFieldTarget = "attack" | "defense";

export type Card = {
    id: string;
    cardName?: string;
    cardImage?: string;
    cardDescription?: string;
    goldCost?: number;
    gutsCost?: number;
    cardTarget?: CardFieldTarget;
    cardType?: CardType;
};