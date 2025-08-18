import { Preloader } from "./Preloader";
import { Play } from "./Play";
import Phaser from "phaser";

const config = {
    title: "Gold and Guts",
    type: Phaser.AUTO,
    width: 1024,
    height: 640,
    parent: "game-container",
    backgroundColor: "#141414",
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Preloader, Play],
};

new Phaser.Game(config);
