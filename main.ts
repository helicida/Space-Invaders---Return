/// <reference path="phaser/phaser.d.ts"/>

module MyGame {

    export class SimpleGame extends Phaser.Game {

        game:Phaser.Game;

        // Puntuacion
        score:number = 0;

        // Sonidos
        sonidoEnemigoMuerto;
        sonidoDisparoJugador;
        sonidoMovimeintoEnemigo;
        sonidoPlatillo;

        // Textos que mostramos en pantalla
        scoreText:Phaser.Text;
        livesText:Phaser.Text;
        endGameText:Phaser.Text;
        MARGEN_TEXTOS = 25;

        // Tilemaps y TileLayers
        tilemap:Phaser.Tilemap;

        // Grupos
        marcianos1:Phaser.Group;
        sateltites:Phaser.Group;

        // Variables
        velocidad = 10;
        nextMovement = 0;
        tiempoMovimiento = 800;

        explosiones:Phaser.Group;
        spriteMaricanos = true;

        // Sprites
        jugador:Player;
        cursor:Phaser.CursorKeys;
        proyectiles:Phaser.Group;
        proyectilesEnemigos:Phaser.Group;

        // Variables auxiliares
        nextFire = 0;

        // Constantes
        VELOCIDAD_MAXIMA = 450;  // pixels/second
        FUERZA_ROZAMIENTO = 100; // Aceleración negativa
        ACELERACION = 700;       // aceleración
        CADENCIA_DISPARO = 500;  // Tiempo entre disparo y disparo

        constructor() {
            super(1366, 768, Phaser.CANVAS, 'gameDiv');
            this.state.add("boot", BootState);
            this.state.add("load", LoadState);
            this.state.add("play", PlayState);
            this.state.start("boot");
        }
    }
}

window.onload = () => {
    var game = new MyGame.SimpleGame();
};