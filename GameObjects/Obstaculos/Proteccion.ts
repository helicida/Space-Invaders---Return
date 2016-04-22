/**
 * Created by 46465442z on 18/04/16.
 */

module MyGame {

    export class Proteccion extends Phaser.Sprite {

        // Instanciamos el juego
        game:SimpleGame;


        constructor(game:SimpleGame, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number) {
            super(game, x, y, key, 0);

            this.health = 8;
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.enableBody = true;
            this.body.immovable = true;
            this.loadTexture('proteccion1');
            this.anchor.setTo(0.5, 0.5);
        }

        // Update
        update():void {
            super.update();

        }

        // Metodos
        danyarProteccion():void {

            this.health -= 1;
            
            if (this.health == 6) {
                this.loadTexture('proteccion2');
            }
            else if (this.health == 4) {
                this.loadTexture('proteccion3');
            }
            else if (this.health == 2) {
                this.loadTexture('proteccion4');
            }
        }

    }
}