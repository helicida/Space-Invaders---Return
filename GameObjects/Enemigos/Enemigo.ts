/**
 * Created by 46465442z on 18/04/16.
 */
module MyGame {

    export abstract class Enemigo extends Phaser.Sprite {

        // Games
        game:SpaceInvadersGame;

        // Constructor de los enemigos
        constructor(game:SpaceInvadersGame, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
            super(game, x, y, key, frame);

            // Predeterminadas
            this.game = game;
            this.game.physics.enable(this);
            this.body.enableBody = true;
        }
    }
}