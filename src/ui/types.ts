import { Deck } from "../deck/deck"
import { Battlefield } from "../battlefield/battlefield"

export interface StateManagers {
    deck: Deck
    defenseBattlefield: Battlefield
    attackBattlefield: Battlefield
}