/**
 * Created by 46465442z on 18/04/16.
 */

module MyGame {

    export class Player extends Phaser.Sprite {

        // Instanciamos el juego
        game:SimpleGame;

        // Variables
        id:string;   // ID con la que identificaremos al jugador

        // Constructores
        constructor(id:string, numeroVidas:number, game:SimpleGame, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
            super(game, x, y, key, frame);

            this.id = id;
            this.health = numeroVidas;
            this.x = this.game.world.centerX;
            this.y = this.game.world.height - this.height - 5;
            this.anchor.setTo(0.5, 0.5);

            // Activamos la fisica y la hacemos rebotar con los bordes
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;

            // Fuerza de rozamiento para que la barra frene
            this.body.drag.setTo(this.game.FUERZA_ROZAMIENTO, this.game.FUERZA_ROZAMIENTO); // x, y

            // Le damos una velocidad maxima
            this.body.maxVelocity.setTo(this.game.VELOCIDAD_MAXIMA, 0); // x, y
            this.body.bounce.setTo(0);  // Que no rebote
            this.body.immovable = true;
        }
    }
}