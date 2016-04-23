/**
 * Created by 46465442z on 18/04/16.
 */

module MyGame {

    export class Proteccion extends Phaser.Sprite {

        // Instanciamos el juego
        game:SpaceInvadersGame;


        constructor(game:SpaceInvadersGame, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number) {
            super(game, x, y, key, 0);

            this.health = 8;
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.enableBody = true;
            this.body.immovable = true;

            // Ajustamos el tamaño para las colisiones
            this.body.width = 150;
            this.body.height = 100;

            this.loadTexture('sprites', 'protection-1');
        }




    // Metodos

        danyarProteccion():void {

            this.health -= 1;
            
            if (this.health == 6) {
                this.loadTexture('sprites', 'protection-2');
            }
            else if (this.health == 4) {
                this.loadTexture('sprites', 'protection-3');
            }
            else if (this.health == 2) {
                this.loadTexture('sprites', 'protection-4');
            }
        }

    }
}