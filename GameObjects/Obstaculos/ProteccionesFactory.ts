/**
 * Created by sergi on 22/04/16.
 */
module MyGame {

    export class ProteccionesFactory {

        // Instanciamos el juego
        game:SpaceInvadersGame;

        // Constructores
        constructor(game:SpaceInvadersGame) {
            this.game = game;
        }

        // Con este metodo
        generarProteccion(key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number):Enemigo {

            if (key == 'proteccion') {
                return new Proteccion(this.game, key, x, y);
            }
            else {
                return null;
            }
        }
    }
}