/**
 * Created by 46465442z on 18/04/16.
 */
module MyGame {

    export class EnemigosFactory {

        // Instanciamos el juego
        game:SpaceInvadersGame;

        // Constructores
        constructor(game:SpaceInvadersGame) {
            this.game = game;
        }

        // Con este metodo
        generarEnemigo(key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number):Enemigo {

            if (key == 'marciano1') {
                return new Marciano1(this.game, key, x, y);
            }
            else if (key == 'satelite') {
                return new Satelite(this.game, key, x, y);
            }
            else {
                return null;
            }
        }
    }
}