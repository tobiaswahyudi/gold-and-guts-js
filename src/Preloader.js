import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
    constructor() {
        super({
            key: "Preloader",
        });
    }

    preload() {
        this.load.setPath("assets/");

        this.load.audio("theme-song", "audio/fat-caps-audionatix.mp3");
        this.load.audio("card-shuffle", "audio/card-flip.mp3");
        this.load.audio("card-deal", "audio/card-slide.mp3");
        this.load.audio("level-up", "audio/victory.mp3");
        this.load.image("background");
        this.load.image("card-back", "cards/card-back.png");
        this.load.image("card-guy", "cards/card-0.png");
        this.load.image("heart", "ui/heart.png");

        this.load.font("Alkhemikal", "font/Alkhemikal.ttf");
    }

    create() {
        this.scene.start("Play");
    }
}
