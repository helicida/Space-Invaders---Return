/**
 * Created by 46465442z on 18/04/16.
 */
module MyGame {

    export class Marciano1 extends Enemigo {

        // Games
        game:SimpleGame;

        // Variables auxiliares
        nextFire = 0;
        CADENCIA_DISPARO = 1000;

        // Constructor de los enemigos
        constructor(game:SimpleGame, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, x:number, y:number) {
            super(game, x, y, key, 0);

            // Ajustmaos el sprite
            this.game = game;
            this.game.physics.enable(this);
            this.body.enableBody = true;
        }

        update():void {
            super.update();

            if ((this.game.jugador.body.x - 30 < this.body.x) && (this.body.x < this.game.jugador.body.x + 30)) {
                this.fireEnemigos(this.body.x, this.body.y);
            }
        }

        // Metodos

        fireEnemigos(x:number, y:number):void {

            // Al azar para que no disparen todos los monstruos
            var randomValue = this.game.rnd.integerInRange(1, 100);

            if (this.game.time.now > this.nextFire && randomValue == 5 && this.alive) {

                var proyectilEnemigo = this.game.proyectilesEnemigos.getFirstDead();

                if (proyectilEnemigo) {

                    proyectilEnemigo.reset(x, y + this.height);
                    this.game.livesText.setText("Coordenada x: " + this.body.x + ", Coordenada y:" + this.body.y + "| Vida jugador:" + this.game.jugador.health);

                    proyectilEnemigo.body.velocity.setTo(0, 500);

                    this.nextFire = this.game.time.now + this.CADENCIA_DISPARO;
                }
            }
        }
    }
}